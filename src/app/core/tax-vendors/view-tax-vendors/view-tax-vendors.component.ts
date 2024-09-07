import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageService } from "primeng/api";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { BillingAddressService } from "../../settings/billing-Address/billingAddress.service";
import { TaxVendorsService } from "../tax-vendors.service";

@Component({
  selector: "app-view-tax-vendors",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./view-tax-vendors.component.html",
  styleUrls: ["./view-tax-vendors.component.scss"], // Fix: 'styleUrl' should be 'styleUrls'
})
export class ViewTaxVendorsComponent implements OnInit {
  public routes = routes;
  id: any;
  taxVendorsData: any = {};
  vendorsSalesData: any = {};
  vendorsPaymentData: any = {};
  showDialog=false
  modalData:any
  salesDataShowById: any[] = [];
  paymentListDataByTaxVendorsId: any[] = [];
  selectedSales: any[] = []; // Holds the selected sales items
  addTaxVendorsPaymentForm!: FormGroup;
  displayPaymentDialog: boolean = false;
  paymentModeList = [
    {
      paymentMode: "Cash",
    },
    {
      paymentMode: "Online",
    },
  ];
  maxDate = new Date();
  totalSelectedSalesTotalAmount: number = 0; // Declare this variable
  totalSelectedSalesDueAmount: number = 0; // Declare this variable
  totalSelectedSalesPayableAmount: number = 0; // Declare this variable
  paymentId: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private BillingAddressService: BillingAddressService,
    private activeRoute: ActivatedRoute,
    private TaxVendorsService: TaxVendorsService
  ) {
    this.addTaxVendorsPaymentForm = this.fb.group({
      sales: this.fb.array([]),
      paymentDate: ["", [Validators.required]],
      paymentMode: ["", [Validators.required]],
      note: [""],
      payableAmount: [
        "",
        [
          Validators.required,
          // Validators.min(this.totalSelectedSalesDueAmount),
          // Validators.max(this.totalSelectedSalesDueAmount)
        ],
      ],
    });
    this.id = this.activeRoute.snapshot.params["id"];
  }

  get sales(): FormArray {
    return this.addTaxVendorsPaymentForm.get("sales") as FormArray;
  }

  addSalesControls() {
    this.sales.clear();
    this.selectedSales.forEach((sale) => {
      this.sales.push(
        this.fb.group({
          _id: [sale.taxVendor.salesId],
          salesInvoiceNumber: [sale.taxVendor.salesInvoice],
          // salesTotalAmount: [sale.taxVendor.taxVendorAmount],
          amount: [
            sale.taxVendor.dueAmount,
            [
              Validators.required,
              Validators.min(sale.taxVendor.dueAmount),
              Validators.max(sale.taxVendor.dueAmount),
            ],
          ],
        })
      );
    });
  }

  totalSalesSelectedTotalAmount() {
    // Sum the total amount of the selected sales
    this.totalSelectedSalesTotalAmount = this.selectedSales.reduce(
      (total, sale) => total + (sale.taxVendor.taxVendorAmount || 0),
      0
    );
    this.totalSelectedSalesDueAmount = this.selectedSales.reduce(
      (total, sale) => total + (sale.taxVendor.dueAmount || 0),
      0
    );
    this.totalSelectedSalesPayableAmount = this.selectedSales.reduce(
      (total, sale) => total + (sale.taxVendor.dueAmount || 0),
      0
    );

    // Set the total amount in the form control
    this.addTaxVendorsPaymentForm.patchValue({
      payableAmount: this.totalSelectedSalesDueAmount,
    });
  }

  ngOnInit() {
    this.getTaxVendorsById();
    this.getPaymentListByVendorId();
    this.getVendorSalesList();
  }

  getTaxVendorsById() {
    this.TaxVendorsService.getTaxVendorById(this.id).subscribe((data: any) => {
      console.log("Tax Vendors Data By Id", data.data);
      this.id = data.data._id;
      this.taxVendorsData = data.data;
    });
  }
  getVendorSalesList() {
    this.TaxVendorsService.getVendorSalesList(this.id).subscribe(
      (data: any) => {
        console.log("Tax Vendors Sales Data By Id", data.data);
        this.salesDataShowById = data.data;
      }
    );
  }
  getPaymentListByVendorId() {
    this.TaxVendorsService.getPaymentListByVendorId(this.id).subscribe(
      (data: any) => {
        console.log(this.id);
        console.log("Tax Vendors Payment Data By Id", data.data);
        this.paymentListDataByTaxVendorsId = data.data;
      }
    );
  }

  close() {
    this.displayPaymentDialog = false;
    this.showDialog=false
    this.sales.clear();
    this.addTaxVendorsPaymentForm.reset();
  }
  callBackModal(){

    this.TaxVendorsService.deletePayment(this.paymentId).subscribe((resp:any) => {
      let message = "Tax Vendor Payment has been Deleted"
      this.messageService.add({ severity: 'success', detail:message });
      this.getPaymentListByVendorId();
      this.getVendorSalesList();
      this.showDialog = false;
    })


  }
  deleteTaxVendorPayment(id){
    console.log("delete dialog open")
    this.paymentId = id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Payment",
    };
    this.showDialog = true;

  }
  
  openPaymentDialog() {
    
    // Check if any selected sales have a dueAmount of 0 (fully paid)
    const hasPaidSales = this.selectedSales.some(
      (sale) => sale.taxVendor.dueAmount === 0
    );

    if (hasPaidSales) {
      this.messageService.add({
        severity: "warn",
        summary: "Paid Sales Selected",
        detail:
        "You cannot make payments for fully paid sales. Please unselect them.",
      });
    } else if (this.selectedSales.length > 0) {
      console.log("payments to be made for these sales", this.selectedSales);
      console.log(this.selectedSales[0].customer);
      this.addSalesControls(); // Populate form with selected sales data
      this.totalSalesSelectedTotalAmount(); // Calculate and store the total sales amount
      this.displayPaymentDialog = true;
    } else {
      this.messageService.add({
        severity: "warn",
        summary: "No Sales Selected",
        detail: "Please select sales to process the payment.",
      });
    }
  }

  addTaxVendorsPaymentFormSubmit() {
    const formData = this.addTaxVendorsPaymentForm.value;
    const payload = {
      taxVendor: {
        name: this.selectedSales[0].taxVendor.companyName,
        _id: this.selectedSales[0].taxVendor._id,
      },
      sales: formData.sales,
      paymentDate: formData.paymentDate,
      paymentMode: formData.paymentMode,
      note: formData.note,
    };
    console.log("valid form", this.addTaxVendorsPaymentForm.value);
    if (this.addTaxVendorsPaymentForm.valid) {
      console.log(payload);

      this.TaxVendorsService.createTaxVendorPayment(payload).subscribe(
        (resp: any) => {
          console.log(resp);
          if (resp) {
            if (resp.status === "success") {
              const message = "Payment has been added";
              this.messageService.add({ severity: "success", detail: message });
              setTimeout(() => {
                this.displayPaymentDialog = false;
                this.getPaymentListByVendorId();
                this.getVendorSalesList();
                this.addTaxVendorsPaymentForm.reset();
                this.sales.clear();
              }, 400);
            } else {
              const message = resp.message;
              this.messageService.add({ severity: "error", detail: message });
            }
          }
        }
      );
    } else {
      console.log("invalid form");
    }
  }
}
