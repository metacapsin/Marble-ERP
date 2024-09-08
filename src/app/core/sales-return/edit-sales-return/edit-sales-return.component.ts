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
import { TaxesService } from "../../settings/taxes/taxes.service";
import { CustomersdataService } from "../../Customers/customers.service";
import { CategoriesService } from "../../settings/categories/categories.service";
import { UnitsService } from "../../settings/units/units.service";
import { SubCategoriesService } from "../../settings/sub-categories/sub-categories.service";
import { MessageService } from "primeng/api";
import { SalesReturnService } from "../sales-return.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastModule } from "primeng/toast";
@Component({
  selector: "app-edit-sales-return",
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: "./edit-sales-return.component.html",
  styleUrl: "./edit-sales-return.component.scss",
  providers: [MessageService],
})
export class EditSalesReturnComponent {
  maxDate = new Date();
  editReturnSalesForm!: FormGroup;
  public routes = routes;
  salesReturnId: any;
  addTaxTotal: any;
  customerList = [];
  originalCustomerData = [];
  categoryList = [];
  subCategoryList = [];
  unitListData = [];
  orderTaxList = [];
  taxesListData = [];
  public itemDetails: number[] = [0];
  public selectedValue!: string;

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  notesRegex = /^(?:.{2,100})$/;
  tandCRegex = /^(?:.{2,200})$/;
  orderStatusList = [
    { orderStatus: "Ordered" },
    { orderStatus: "Confirmed" },
    { orderStatus: "Processing" },
    { orderStatus: "Shipping" },
    { orderStatus: "Delivered" },
  ];
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private messageService: MessageService,
    private Service: SalesReturnService,
    private subCategoriesService: SubCategoriesService,
    private unitService: UnitsService,
    private customerService: CustomersdataService,
    private CategoriesService: CategoriesService,
    private taxService: TaxesService,
    private fb: FormBuilder
  ) {
    this.editReturnSalesForm = this.fb.group({
      customer: ["", [Validators.required]],
      returnDate: ["", [Validators.required]],
      salesDiscount: ["", [Validators.min(0)]],
      salesInvoiceNumber: [
        "",
        // [Validators.required, Validators.pattern(this.nameRegex)],
      ],
      salesItemDetails: this.fb.array([]),
      salesNotes: ["", [Validators.pattern(this.notesRegex)]],
      salesGrossTotal: [""],
      returnOrderStatus: ["", [Validators.required]],
      salesOrderTax: [""],
      appliedTax: [""],
      salesShipping: ["", [Validators.min(0)]],
      salesTermsAndCondition: ["", [Validators.pattern(this.tandCRegex)]],
      salesTotalAmount: ["",[Validators.min(1)]],
      otherCharges: ["", [Validators.min(0)]],
    });

    this.salesReturnId = this.activeRoute.snapshot.params["id"];
  }

  get salesItemDetails() {
    return this.editReturnSalesForm.controls["salesItemDetails"] as FormArray;
  }
  deletesalesReturnItemDetails(salesReturnItemDetailsIndex: number) {
    this.salesItemDetails.removeAt(salesReturnItemDetailsIndex);
    this.calculateTotalAmount();
  }
  addsalesReturnItemDetailsItem() {
    const item = this.fb.group({
      salesItemProduct: ["", [Validators.required]],
      salesItemQuantity: ["", [Validators.required, Validators.min(0)]],
      salesItemUnitPrice: ["", [Validators.required, Validators.min(0)]],
      salesItemTax: [""],
      salesItemTaxAmount: [""],
      salesItemSubTotal: ["", [Validators.required, Validators.min(0)]],
    });
    this.salesItemDetails.push(item);
  }

  ngOnInit(): void {
    let totalTax = 0;

    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.originalCustomerData = resp;
      this.customerList = [];
      this.originalCustomerData.forEach((element) => {
        this.customerList.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
    });

    // this.unitService.getAllUnitList().subscribe((resp: any) => {
    //   this.unitListData = resp.data;
    // })

    this.taxService.getAllTaxList().subscribe((resp: any) => {
      this.taxesListData = resp.data;
      this.orderTaxList = [];
      this.taxesListData.forEach((element) => {
        this.orderTaxList.push({
          orderTaxName: element.name + " (" + element.taxRate + "%" + ")",
          orderNamevalue: element,
        });
      });
    });

    this.CategoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
    });

    // this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
    //   this.subCategoryList = resp.data;
    // });

    this.Service.getSalesReturnById(this.salesReturnId).subscribe(
      (resp: any) => {
        resp.data?.salesItemDetails?.forEach((lang) => {
          this.addsalesReturnItemDetailsItem();
        });
        // resp.data?.appliedTax?.forEach(element => {
        //   totalTax += Number(element.taxRate);
        // });
        // this.addTaxTotal = resp.data.salesGrossTotal * totalTax / 100;

        this.patchForm(resp.data);
      }
    );

    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    let salesGrossTotal = 0;

    const salesItems = this.editReturnSalesForm.get(
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
    this.editReturnSalesForm
      .get("salesGrossTotal")
      .setValue(salesGrossTotal.toFixed(2));

    let totalAmount = salesGrossTotal;
    const discount = +this.editReturnSalesForm.get("salesDiscount").value || 0;
    const shipping = +this.editReturnSalesForm.get("salesShipping").value || 0;
    const otherCharges =
      +this.editReturnSalesForm.get("otherCharges").value || 0;

    totalAmount -= discount;
    totalAmount += shipping;
    totalAmount += otherCharges;

    this.editReturnSalesForm.patchValue({
      salesTotalAmount: totalAmount.toFixed(2),
      salesDiscount: discount.toFixed(2),
      salesShipping: shipping.toFixed(2),
      otherCharges: otherCharges.toFixed(2),
    });
  }

  patchForm(data) {
    // data?.appliedTax?.forEach(element => {
    //   delete element.tenantId;
    // });
    this.editReturnSalesForm.patchValue({
      salesInvoiceNumber: data.salesInvoiceNumber,
      customer: data.customer,
      returnDate: data.returnDate,
      returnOrderStatus: data.returnOrderStatus,
      // salesOrderTax: data.appliedTax,
      salesGrossTotal: data.salesGrossTotal,
      salesDiscount: data.salesDiscount,
      salesShipping: data.salesShipping,
      salesTermsAndCondition: data.salesTermsAndCondition,
      salesNotes: data.salesNotes,
      salesTotalAmount: data.salesTotalAmount,
      otherCharges: data.otherCharges,
    });

    this.salesItemDetails.patchValue(data.salesItemDetails);
  }

  editReturnSalesFormSubmit() {
    const formData = this.editReturnSalesForm.value;

    // let totalTax = 0
    // if(formData.salesOrderTax){
    //   formData.salesOrderTax.forEach((element) => {
    //       totalTax = totalTax + element.taxRate;
    //     });
    // }
    const payload = {
      customer: formData.customer,
      returnDate: formData.returnDate,
      salesDiscount: Number(formData.salesDiscount),
      salesInvoiceNumber: formData.salesInvoiceNumber,
      salesItemDetails: formData.salesItemDetails,
      salesNotes: formData.salesNotes,
      salesGrossTotal: Number(formData.salesGrossTotal),
      returnOrderStatus: formData.returnOrderStatus,
      // salesOrderTax: totalTax,
      salesShipping: Number(formData.salesShipping),
      // appliedTax: formData.salesOrderTax,
      salesTermsAndCondition: formData.salesTermsAndCondition,
      salesTotalAmount: Number(formData.salesTotalAmount),
      otherCharges: Number(formData.otherCharges),
      id: "",
    };

    if (this.editReturnSalesForm.valid) {
      console.log("valid form");
      console.log(this.editReturnSalesForm.value);
      (payload.id = this.salesReturnId),
        this.Service.updateSalesReturn(payload).subscribe((resp: any) => {
          console.log(resp);
          if (resp) {
            if (resp.status === "success") {
              const message = "Sales Return has been updated";
              this.messageService.add({ severity: "success", detail: message });
              setTimeout(() => {
                this.router.navigate(["/sales-return"]);
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
