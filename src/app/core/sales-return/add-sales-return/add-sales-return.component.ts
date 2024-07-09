import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { CustomersdataService } from "../../Customers/customers.service";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { SalesReturnService } from "../sales-return.service";
import { ToastModule } from "primeng/toast";
import { SalesService } from "../../sales/sales.service";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
@Component({
  selector: "app-add-sales-return",
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: "./add-sales-return.component.html",
  styleUrl: "./add-sales-return.component.scss",
  providers: [MessageService],
})
export class AddSalesReturnComponent {
  addReturnSalesForm!: FormGroup;
  public routes = routes;
  maxDate = new Date();
  public searchData_id = "";
  customerList: any = [];
  originalCustomerData = [];
  categoryList = [];
  subCategoryList = [];
  orderStatusList = [
    { orderStatus: "Accepted" },
    { orderStatus: "Pending" },
    { orderStatus: "Processing" },
    { orderStatus: "Rejected" },
  ];
  unitListData = [];
  orderTaxList = [];
  taxesListData = [];
  salesInvoiceList = [];
  public itemDetails: number[] = [0];
  public selectedValue!: string;
  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  notesRegex = /^(?:.{2,100})$/;
  tandCRegex = /^(?:.{2,200})$/;
  customer: any = [];
  returnUrl: string;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private Service: SalesReturnService,
    private customerService: CustomersdataService,
    private salesService: SalesService,
    private fb: FormBuilder,
    private LocalStorageService: LocalStorageService
  ) {
    this.addReturnSalesForm = this.fb.group({
      customer: ["", [Validators.required]],
      returnDate: ["", [Validators.required]],
      salesInvoiceNumber: ["", [Validators.required]],
      salesItemDetails: this.fb.array([]),
      salesNotes: ["", [Validators.pattern(this.notesRegex)]],
      salesGrossTotal: [""],
      returnOrderStatus: ["", [Validators.required]],
      // salesDiscount: ["", ],
      // otherCharges: ["", ],
      // salesShipping: ["", ],
      // salesTermsAndCondition: ["", [Validators.pattern(this.tandCRegex)]],
      salesTotalAmount: [""],
      returnOtherCharges: ["", [Validators.min(0)]],
    });
  }

  get salesItemDetails() {
    return this.addReturnSalesForm.controls["salesItemDetails"] as FormArray;
  }

  deletesalesReturnItemDetails(salesReturnItemDetailsIndex: number) {
    this.salesItemDetails.removeAt(salesReturnItemDetailsIndex);
    this.calculateTotalAmount();
  }

  // addsalesReturnItemDetailsItem(salesItemDetails: any) {
  //   const salesArray = this.addReturnSalesForm.get('salesItemDetails') as FormArray;
  //   salesItemDetails?.forEach(sale => {
  //     salesArray.push(this.fb.group({
  //       salesItemProduct: [sale.salesItemProduct],
  //       salesItemQuantity: [sale.salesItemQuantity,[Validators.max(sale.salesItemQuantity)]],
  //       salesItemSubTotal: [sale.salesItemSubTotal],
  //       salesItemTax: [sale.salesItemTax],
  //       salesItemTaxAmount: [sale.salesItemTaxAmount],
  //       salesItemUnitPrice: [sale.salesItemUnitPrice],

  //     }));
  //   });
  // }

  ngOnInit(): void {
    this.customerList = this.getCustomerData();

    this.customer = this.LocalStorageService.getItem("customer1");
    this.returnUrl = this.LocalStorageService.getItem("returnUrl");

    console.log(
      "this is customer data by local sotrage service",
      this.customer
    );
    if (this.customer) {
      this.addReturnSalesForm.patchValue({
        customer: this.customer,
      });
      console.log("this is customer in true condition", this.customer);
      this.onCustomerSelect(this.customer);
    }
  }

  getCustomerData() {
    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.originalCustomerData = resp;
      this.customerList = [];
      this.originalCustomerData.forEach((element) => {
        this.customerList.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
            billingAddress: element.billingAddress,
          },
        });
      });
    });
  }
  onCustomerSelect(value: any) {
    // debugger
    this.salesItemDetails.clear();

    this.salesService
      .getAllSalesByCustomerId(value._id)
      .subscribe((resp: any) => {
        this.salesInvoiceList = resp.data;
        console.log("All Sales", resp.data);
      });
  }

  onInvoiceSelect(value: any) {
    this.salesItemDetails.clear();

    // this.addsalesReturnItemDetailsItem(value.salesItemDetails);
    const salesArray = this.addReturnSalesForm.get(
      "salesItemDetails"
    ) as FormArray;

    value.salesItemDetails?.forEach((sale) => {
      salesArray.push(
        this.fb.group({
          salesItemProduct: [sale.salesItemProduct],
          salesItemQuantity: [
            sale.salesItemQuantity,
            [Validators.max(sale.salesItemQuantity)],
          ],
          salesItemSubTotal: [sale.salesItemSubTotal],
          salesItemTax: [sale.salesItemTax],
          salesItemTaxAmount: [sale.salesItemTaxAmount],
          salesItemUnitPrice: [sale.salesItemUnitPrice],
          salesWarehouseDetails: [sale.salesWarehouseDetails],
        })
      );
    });

    this.addReturnSalesForm.patchValue({
      salesGrossTotal: value.salesGrossTotal,
      // salesDiscount: value.salesDiscount,
      // salesShipping: value.salesShipping,
      // otherCharges: value.otherCharges,
      salesTotalAmount: value.salesGrossTotal,
    });
  }

  calculateTotalAmount() {
    let salesGrossTotal = 0;

    const salesItems = this.addReturnSalesForm.get(
      "salesItemDetails"
    ) as FormArray;

    salesItems.controls.forEach((item: FormGroup) => {
      const quantity = +item.get("salesItemQuantity").value || 0;
      const unitPrice = +item.get("salesItemUnitPrice").value || 0;
      const tax = item.get("salesItemTax").value || [];

      let totalTaxAmount = 0;
      if (Array.isArray(tax)) {
        tax.forEach((selectedTax: any) => {
          totalTaxAmount += (quantity * unitPrice * selectedTax.taxRate) / 100;
        });
      } else {
        totalTaxAmount = (quantity * unitPrice * tax) / 100;
      }
      const subtotal = quantity * unitPrice + totalTaxAmount;

      salesGrossTotal += subtotal;
      item.get("salesItemTaxAmount").setValue(totalTaxAmount.toFixed(2));
      item.get("salesItemSubTotal").patchValue(subtotal.toFixed(2));
    });

    // Update the total gross amount
    this.addReturnSalesForm
      .get("salesGrossTotal")
      .setValue(salesGrossTotal.toFixed(2));

    let totalAmount = salesGrossTotal;
    // const discount = +this.addReturnSalesForm.get("salesDiscount").value || 0;
    // const shipping = +this.addReturnSalesForm.get("salesShipping").value || 0;
    // const otherCharges = +this.addReturnSalesForm.get("otherCharges").value || 0;
    const returnOtherCharges =
      +this.addReturnSalesForm.get("returnOtherCharges").value || 0;

    // totalAmount -= discount;
    // totalAmount += shipping;
    // totalAmount += otherCharges;
    totalAmount -= returnOtherCharges;

    this.addReturnSalesForm.patchValue({
      salesTotalAmount: totalAmount.toFixed(2),
      // salesDiscount: discount.toFixed(2),
      // salesShipping: shipping.toFixed(2),
      // otherCharges: otherCharges.toFixed(2),
      returnOtherCharges: returnOtherCharges,
    });
  }

  addReturnSalesFormSubmit() {
    const formData = this.addReturnSalesForm.value;
    const payload = {
      customer: formData.customer,
      salesInvoiceNumber: formData.salesInvoiceNumber.salesInvoiceNumber,
      returnDate: formData.returnDate,
      salesItemDetails: formData.salesItemDetails,
      salesGrossTotal: formData.salesGrossTotal,
      returnOrderStatus: formData.returnOrderStatus,
      // salesDiscount: formData.salesDiscount,
      // salesShipping: formData.salesShipping,
      // otherCharges: formData.otherCharges,
      // salesTermsAndCondition: formData.salesTermsAndCondition,
      salesNotes: formData.salesNotes,
      salesTotalAmount: formData.salesTotalAmount,
      returnOtherCharges: formData.returnOtherCharges,
    };
    if (this.addReturnSalesForm.valid) {
      console.log("valid form");
      this.Service.createSalesReturn(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Sales Return has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigateByUrl(this.returnUrl);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    } else {
      console.log("invalid form");
    }
  }
}
