import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { TaxesService } from "../../settings/taxes/taxes.service";
import { CustomersdataService } from "../../Customers/customers.service";
import { SalesService } from "../sales.service";
import { MessageService } from "primeng/api";
import { ActivatedRoute, Router } from "@angular/router";
import { CategoriesService } from "../../settings/categories/categories.service";
import { ToastModule } from "primeng/toast";
import { SubCategoriesService } from "../../settings/sub-categories/sub-categories.service";
import { UnitsService } from "../../settings/units/units.service";
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  selector: "app-edit-sals",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    MultiSelectModule,
  ],
  templateUrl: "./edit-sals.component.html",
  styleUrl: "./edit-sals.component.scss",
  providers: [MessageService],
})
export class EditSalsComponent {
  editSalesForm!: FormGroup;
  public routes = routes;
  maxDate = new Date();
  salesId = "";
  customerList = [];
  originalCustomerData = [];
  categoryList = [];
  subCategoryList = [];
  addTaxTotal: any;
  unitListData: [];
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
  public chargesArray: number[] = [0];
  public recurringInvoice = false;
  public selectedValue!: string;

nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  notesRegex = /^(?:.{2,100})$/;
  tandCRegex = /^(?:.{2,200})$/;
  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private Service: SalesService,
    private customerService: CustomersdataService,
    private unitService: UnitsService,
    private CategoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private taxService: TaxesService,
    private fb: FormBuilder
  ) {
    this.editSalesForm = this.fb.group({
      id: [""],
      customer: ["", [Validators.required]],
      salesDate: ["", [Validators.required]],
      salesDiscount: ["", [Validators.min(0)]],
      salesInvoiceNumber: [
        "",
        // [Validators.required, Validators.pattern(this.nameRegex)],
      ],
      salesItemDetails: this.fb.array([]),
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
    this.salesId = this.activeRoute.snapshot.params["id"];
  }

  get salesItemDetails() {
    return this.editSalesForm.controls["salesItemDetails"] as FormArray;
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
      salesItemTaxAmount: [''],
      salesItemSubTotal: ["", [Validators.required, Validators.min(0)]],
    })
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
    // });

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

    this.Service.GetSalesDataById(this.salesId).subscribe((resp: any) => {
      resp.data?.salesItemDetails?.forEach((lang) => {
        this.addsalesItemDetailsItem();
      });
      // resp.data?.appliedTax?.forEach((element) => {
      //   totalTax += Number(element.taxRate);
      // });
      // this.addTaxTotal = (resp.data.salesGrossTotal * totalTax) / 100;
      // console.log("applied tax", resp.data.appliedTax);

      this.patchForm(resp.data);
    });

    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    let salesGrossTotal = 0;

    const salesItems = this.editSalesForm.get("salesItemDetails") as FormArray;

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

      const subtotal = (quantity * unitPrice) + totalTaxAmount;

      salesGrossTotal += subtotal;
      
      item.get("salesItemTaxAmount").setValue(totalTaxAmount.toFixed(2))
      item.get("salesItemSubTotal").patchValue(subtotal.toFixed(2));
    });

    this.editSalesForm.get('salesGrossTotal').setValue(salesGrossTotal.toFixed(2));

    let totalAmount = salesGrossTotal;
    const discount = +this.editSalesForm.get("salesDiscount").value || 0;
    const shipping = +this.editSalesForm.get("salesShipping").value || 0;
    const otherCharges = +this.editSalesForm.get("otherCharges").value || 0;

    totalAmount -= discount;
    totalAmount += shipping;
    totalAmount += otherCharges;

    this.editSalesForm.patchValue({
      salesTotalAmount: totalAmount.toFixed(2),
      salesDiscount: discount.toFixed(2),
      salesShipping: shipping.toFixed(2),
      otherCharges: otherCharges.toFixed(2)
    });
  }

  patchForm(data) {
    // data?.appliedTax?.forEach((element) => {
    //   delete element.tenantId;
    // });
    this.editSalesForm.patchValue({
      salesInvoiceNumber: data.salesInvoiceNumber,
      customer: data.customer,
      salesDate: data.salesDate,
      salesOrderStatus: data.salesOrderStatus,
      salesGrossTotal: data.salesGrossTotal,
      // salesOrderTax: data.appliedTax,
      salesDiscount: data.salesDiscount,
      salesShipping: data.salesShipping,
      salesTermsAndCondition: data.salesTermsAndCondition,
      salesNotes: data.salesNotes,
      salesTotalAmount: data.salesTotalAmount,
      otherCharges: data.otherCharges,
    });

    this.salesItemDetails.patchValue(data.salesItemDetails);
  }

  editSalesFormSubmit() {
    const formData = this.editSalesForm.value;

    // let totalTax = 0;
    // if(formData.salesOrderTax){
    //   formData.salesOrderTax?.forEach((element) => {
    //       totalTax = totalTax + element.taxRate;
    //     });

    // }  

    const payload = {
      customer: formData.customer,
      salesDate: formData.salesDate,
      salesDiscount: formData.salesDiscount,
      salesInvoiceNumber: formData.salesInvoiceNumber,
      salesItemDetails: formData.salesItemDetails,
      salesNotes: formData.salesNotes,
      salesGrossTotal: formData.salesGrossTotal,
      salesOrderStatus: formData.salesOrderStatus,
      // salesOrderTax: totalTax,
      salesShipping: formData.salesShipping,
      appliedTax: formData.salesOrderTax,
      salesTermsAndCondition: formData.salesTermsAndCondition,
      salesTotalAmount: formData.salesTotalAmount,
      otherCharges: formData.otherCharges,
      id: "",
    };

    if (this.editSalesForm.valid) {
      console.log("valid form");
      console.log(payload);
      payload.id = this.salesId;
      this.Service.UpdateSalesData(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Sales has been updated";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/customers"]);
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
