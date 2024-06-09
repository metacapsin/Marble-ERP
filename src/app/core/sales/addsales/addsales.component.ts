import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { TaxesService } from "../../settings/taxes/taxes.service";
import { CustomersdataService } from "../../Customers/customers.service";
import { SalesService } from "../sales.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { CategoriesService } from "../../settings/categories/categories.service";
import { ToastModule } from "primeng/toast";
import { SubCategoriesService } from "../../settings/sub-categories/sub-categories.service";
import { UnitsService } from "../../settings/units/units.service";
import { SlabsService } from "../../Product/slabs/slabs.service";

@Component({
  selector: "app-addsales",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MultiSelectModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
  ],
  templateUrl: "./addsales.component.html",
  styleUrls: ["./addsales.component.scss"],
  providers: [MessageService],
})
export class AddsalesComponent implements OnInit {
  addSalesForm!: FormGroup;
  public routes = routes;
  maxDate = new Date();
  public searchData_id = "";
  addTaxTotal: any;
  customerList = [];
  originalCustomerData = [];
  slabList = [];
  slabData = [];
  orderStatusList = [
    { orderStatus: "Ordered" },
    { orderStatus: "Confirmed" },
    { orderStatus: "Processing" },
    { orderStatus: "Shipping" },
    { orderStatus: "Delivered" },
  ];
  orderTaxList = [];
  taxesListData = [];
  public itemDetails: number[] = [0];
  maxQuantity : number;

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  notesRegex = /^(?:.{2,100})$/;
  tandCRegex = /^(?:.{2,200})$/;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private salesService: SalesService,
    private customerService: CustomersdataService,
    private slabService: SlabsService,
    private taxService: TaxesService,
    private fb: FormBuilder
  ) {
    this.addSalesForm = this.fb.group({
      customer: ["", [Validators.required]],
      salesDate: ["", [Validators.required]],
      salesDiscount: ["", [Validators.min(0)]],
      salesInvoiceNumber: [""],
      salesItemDetails: this.fb.array([
        this.fb.group({
          salesItemProduct: ['', [Validators.required]],
          salesItemQuantity: ["", [Validators.required, Validators.min(0), Validators.max(this.maxQuantity)]],
          salesItemUnitPrice: ["", [Validators.required, Validators.min(0)]],
          salesItemTax: [''],
          salesItemTaxAmount: [''],
          salesItemSubTotal: ["", [Validators.required, Validators.min(0)]],
          maxQuantity: [" "],
        }),
      ]),
      salesNotes: ["", [Validators.pattern(this.notesRegex)]],
      salesGrossTotal: [""],
      salesOrderStatus: ["", [Validators.required]],
      salesOrderTax: ["", []],
      appliedTax: [""],
      salesShipping: ["", [Validators.min(0)]],
      salesTermsAndCondition: ["", [Validators.pattern(this.tandCRegex)]],
      salesTotalAmount: [""],
      otherCharges: ["", [Validators.min(0)]],
    });
  }

  get salesItemDetails() {
    return this.addSalesForm.controls["salesItemDetails"] as FormArray;
  }

  deletesalesItemDetails(salesItemDetailsIndex: number) {
    this.salesItemDetails.removeAt(salesItemDetailsIndex);
    this.calculateTotalAmount();
  }

  addsalesItemDetailsItem() {
    const item = this.fb.group({
      salesItemProduct: ['', [Validators.required]],
      salesItemQuantity: ["", [Validators.required, Validators.min(0)]],
      salesItemUnitPrice: ["", [Validators.required, Validators.min(0)]],
      salesItemTax: [''],
      salesItemSubTotal: ["", [Validators.required, Validators.min(0)]],
      salesItemTaxAmount: [''],
      maxQuantity: [''],
    });
    this.salesItemDetails.push(item);
  }

  ngOnInit(): void {
    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.originalCustomerData = resp;
      this.customerList = this.originalCustomerData.map(element => ({
        name: element.name,
        _id: {
          _id: element._id,
          name: element.name,
          billingAddress: element.billingAddress,
        },
      }));
    }); 

    this.taxService.getAllTaxList().subscribe((resp: any) => {
      this.taxesListData = resp.data;
      this.orderTaxList = this.taxesListData.map(element => ({
        orderTaxName: `${element.name} (${element.taxRate}%)`,
        orderNamevalue: element,
      }));
    });

    this.slabService.getSlabsList().subscribe((resp: any) => {
      this.slabData = resp.data;
      this.slabList = this.slabData.map(e => ({
        slabName: e.slabName,
              _id: {
                _id: e._id,
                slabName: e.slabName,
                slabNo: e.slabNo,
                sellingPricePerSQFT: e.sellingPricePerSQFT,
                totalSQFT: e.totalSQFT,
              }
      }));
    });
  }

  onSlabSelect(value, i) {
    this.maxQuantity = 0;
    const salesItemDetailsArray = this.addSalesForm.get("salesItemDetails") as FormArray;
    const salesItemUnitPriceControl = salesItemDetailsArray.at(i)?.get("salesItemUnitPrice");
    const maxQuantityPriceControl = salesItemDetailsArray.at(i)?.get("maxQuantity");
    if (salesItemUnitPriceControl) {
      salesItemUnitPriceControl.patchValue(value.sellingPricePerSQFT);
      console.log("totalSQFT", value);
      this.calculateTotalAmount();
    }
    if (maxQuantityPriceControl) {
      maxQuantityPriceControl.setValue(value.totalSQFT);
    }
  }

  calculateTotalAmount() {
    let salesGrossTotal = 0;
    
    const salesItems = this.addSalesForm.get("salesItemDetails") as FormArray;
    
    salesItems.controls.forEach((item: FormGroup) => {
      if(item.get("salesItemQuantity").value > item.get("maxQuantity").value){
        console.log("ADnan");
        item.get("salesItemQuantity").patchValue(item.get("maxQuantity").value)
      }
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

      const subtotal = (quantity * unitPrice) + totalTaxAmount;

      salesGrossTotal += subtotal;
      item.get("salesItemTaxAmount").setValue(totalTaxAmount.toFixed(2))
      item.get("salesItemSubTotal").setValue(subtotal.toFixed(2));
    });

    this.addSalesForm.get('salesGrossTotal').setValue(salesGrossTotal.toFixed(2));

    let totalAmount = salesGrossTotal;
    const discount = +this.addSalesForm.get("salesDiscount").value;
    const shipping = +this.addSalesForm.get("salesShipping").value;
    const otherCharges = +this.addSalesForm.get("otherCharges").value;

    totalAmount -= discount;
    totalAmount += shipping;
    totalAmount += otherCharges;

    this.addSalesForm.get("salesTotalAmount").setValue(totalAmount)
  }

  addSalesFormSubmit() {
    const formData = this.addSalesForm.value;

    const payload = {
      customer: formData.customer,
      salesDate: formData.salesDate,
      salesDiscount: formData.salesDiscount,
      salesInvoiceNumber: formData.salesInvoiceNumber,
      salesItemDetails: formData.salesItemDetails,
      salesNotes: formData.salesNotes,
      salesGrossTotal: formData.salesGrossTotal,
      salesOrderStatus: formData.salesOrderStatus,
      salesShipping: formData.salesShipping,
      salesTermsAndCondition: formData.salesTermsAndCondition,
      salesTotalAmount: formData.salesTotalAmount,
      otherCharges: formData.otherCharges,
    };

    if (this.addSalesForm.valid) {
      console.log("Valid form sales payload", payload);

      this.salesService.AddSalesData(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Sales has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/sales"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    } else {
      console.log("Invalid form");
    }
  }
}
