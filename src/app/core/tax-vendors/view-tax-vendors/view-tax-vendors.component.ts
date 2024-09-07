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
  totalSelectedSalesAmount: number = 0; // Declare this variable

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
      payableAmount:["",[ Validators.required,
        Validators.min(this.totalSelectedSalesAmount),
        Validators.max(this.totalSelectedSalesAmount)]]
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
          _id: [sale._id],
          salesInvoiceNumber: [sale.salesInvoiceNumber],
          // salesTotalAmount: [sale.taxVendor.taxVendorAmount],
          amount: [
            sale.taxVendor.taxVendorAmount,
            [
              Validators.required,
              Validators.min(sale.taxVendor.taxVendorAmount),
              Validators.max(sale.taxVendor.taxVendorAmount),
            ],
          ],
        })
      );
    });
  }

  totalSalesSelectedTotalAmount() {
    // Sum the total amount of the selected sales
    this.totalSelectedSalesAmount = this.selectedSales.reduce(
      (total, sale) => total + (sale.taxVendor.taxVendorAmount || 0),
      0
    );
  
    // Set the total amount in the form control
    this.addTaxVendorsPaymentForm.patchValue({
      payableAmount: this.totalSelectedSalesAmount,
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
        console.log("Tax Vendors Payment Data By Id", data.data);
        this.paymentListDataByTaxVendorsId = data.data;
      }
    );
  }

  showInvoiceDialoge() {}

  openPaymentDialog() {
    console.log("payments to be made for these sales", this.selectedSales);
    if (this.selectedSales.length > 0) {
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

  deleteVendorsPayment(Id: any) {}

  deleteVendorsSales(id: any) {}

  addTaxVendorsPaymentFormSubmit() {
    const formData = this.addTaxVendorsPaymentForm.value;
    const payload = {
      taxVendors: {name:this.selectedSales[0].taxVendor.companyName,
        _id:this.selectedSales[0]._id
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
                this.getPaymentListByVendorId(); // Refresh the payment list
                this.addTaxVendorsPaymentForm.reset(); // Reset the form
                this.sales.clear(); // Clear sales controls if needed
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
