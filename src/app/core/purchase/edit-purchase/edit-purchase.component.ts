import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup,Validators } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { el } from "@fullcalendar/core/internal-common";
import { TaxesService } from "../../settings/taxes/taxes.service";
import { debounceTime } from "rxjs";
import { CustomersdataService } from "../../Customers/customers.service";
import { SuppliersdataService } from "../../Suppliers/suppliers.service";
import { SubCategoriesService } from "../../settings/sub-categories/sub-categories.service";
import { CategoriesService } from "../../settings/categories/categories.service";
import { UnitsService } from "../../settings/units/units.service";
import { ActivatedRoute, Router } from "@angular/router";
import { PurchaseService } from "../purchase.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-edit-purchase",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MultiSelectModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
  ],
  templateUrl: "./edit-purchase.component.html",
  styleUrl: "./edit-purchase.component.scss",
  providers: [MessageService]
})
export class EditPurchaseComponent implements OnInit {
  editPurchaseForm!: FormGroup;
  getSupplierShow: any;
  public routes = routes;
  subCategoryList: any;
  unitListData: any;
  PurchaseId:any
  SupplierLists= [];
  categoryList= [];
  orderStatusList = [
    { orderStatus: "Ordered" },
    { orderStatus: "Confirmed" },
    { orderStatus: "Processing" },
    { orderStatus: "Shipping" },
    { orderStatus: "Delivered" },
  ];
  orderTaxList = [];
  taxesListData = [];
  getPurchaseApiResp:any
  public itemDetails: number[] = [0];
  public chargesArray: number[] = [0];
  public recurringInvoice = false;
  public selectedValue!: string;
  addTaxTotal: any;
  
  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  notesRegex = /^(?:.{2,100})$/;
  tandCRegex = /^(?:.{2,200})$/;

  constructor(
    private taxService: TaxesService,
    private fb: FormBuilder,
    private Service: SuppliersdataService,
    private CategoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private unitService: UnitsService,
    private activeRoute: ActivatedRoute,
    private purchaseService: PurchaseService,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.editPurchaseForm = this.fb.group({
      purchaseInvoiceNumber: ["", [Validators.required,Validators.pattern(this.nameRegex)]],
      purchaseSupplierName: ["", [Validators.required]],
      purchaseDate: ["", [Validators.required]],
      purchaseOrderStatus: ["", [Validators.required]],
      purchaseOrderTax: [""],
      purchaseDiscount: ["", [Validators.min(0)]],
      purchaseShipping: ["", [Validators.min(0)]],
      purchaseTermsAndCondition: ["", [Validators.pattern(this.tandCRegex)]],
      purchaseNotes: ["", [Validators.pattern(this.notesRegex)]],
      purchaseTotalAmount: [""],
      otherCharges: ["", [Validators.min(0)]],
      purchaseGrossTotal: [""],
      purchaseItemDetails: this.fb.array([
        this.fb.group({
          purchaseItemCategory: ["", [Validators.required]],
          purchaseItemSubCategory: ["", [Validators.required]],
          unit: ["", [Validators.required]],
          purchaseItemName: [
            "",
            [Validators.required, Validators.pattern(this.nameRegex)],
          ],
          purchaseItemQuantity: ["", [Validators.required, Validators.min(0)]],
          purchaseItemUnitPrice: ["", [Validators.required, Validators.min(0)]],
          purchaseItemSubTotal: ["", [Validators.required, Validators.min(0)]],
        }),
      ]),
    });
    this.PurchaseId = this.activeRoute.snapshot.params["id"];
  }

  get purchaseItemDetails() {
    return this.editPurchaseForm.controls["purchaseItemDetails"] as FormArray;
  }
  deletePurchaseItemDetails(purchaseItemDetailsIndex: number) {
    this.purchaseItemDetails.removeAt(purchaseItemDetailsIndex);
    this.calculateTotalAmount();
  }
  addPurchaseItemDetailsItem() {
    const item = this.fb.group({
      purchaseItemCategory: ["", [Validators.required]],
      purchaseItemSubCategory: ["", [Validators.required]],
      unit: ["", [Validators.required]],
      purchaseItemName: [
        "",
        [Validators.required, Validators.pattern(this.nameRegex)],
      ],
      purchaseItemQuantity: ["", [Validators.required, Validators.min(0)]],
      purchaseItemUnitPrice: ["", [Validators.required, Validators.min(0)]],
      purchaseItemSubTotal: ["", [Validators.required, Validators.min(0)]]
    });
    this.purchaseItemDetails.push(item);
  }

  getSupplier() {
    this.Service.GetSupplierData().subscribe((data) => {
      this.getSupplierShow = data;
      this.SupplierLists = [];
      this.getSupplierShow.forEach(element => {
        this.SupplierLists.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name
          }
        })
    });
  })}

  ngOnInit(): void {
    let totalTax = 0;
    this.getSupplier();
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

    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
    });
    this.unitService.getAllUnitList().subscribe((resp: any) => {
      this.unitListData = resp.data;
    });

    this.purchaseService.GetPurchaseDataById(this.PurchaseId).subscribe((resp: any) => {
      resp.data?.salesItemDetails?.forEach(lang => {
        this.addPurchaseItemDetailsItem()
      });
      resp.data?.appliedTax?.forEach(element => {
         totalTax += Number(element.taxRate);
      });
      this.addTaxTotal = resp.data.purchaseGrossTotal * totalTax / 100;

        this.patchFrom(resp.data);
    });

    this.calculateTotalAmount();
  }

  patchFrom(data){
   data?.appliedTax?.forEach(element => {
      delete element.tenantId;
    });
    this.editPurchaseForm.patchValue({
      purchaseInvoiceNumber: data.purchaseInvoiceNumber,
      purchaseSupplierName: data.supplier,
      purchaseDate: data.purchaseDate,
      purchaseOrderStatus: data.purchaseOrderStatus,
      purchaseOrderTax: data.appliedTax, 
      purchaseDiscount: data.purchaseDiscount,
      purchaseShipping: data.purchaseShipping,
      purchaseTermsAndCondition: data.purchaseTermsAndCondition,
      purchaseNotes: data.purchaseNotes,
      purchaseTotalAmount: data.purchaseTotalAmount,
      purchaseGrossTotal: data.purchaseGrossTotal,
      otherCharges: data.purchaseOtherCharges,
    });

    this.purchaseItemDetails.patchValue(data.purchaseItemDetails);
  }


  calculateTotalAmount() {
    console.log("Enter in caltotal");
    let totalAmount = 0;
    let purchaseGrossTotal = 0;
    let totalTax = 0;

    const purchaseItems = this.editPurchaseForm.get(
      "purchaseItemDetails"
    ) as FormArray;

    purchaseItems.controls.forEach((item: FormGroup) => {
      const quantity = +item.get("purchaseItemQuantity").value || 0;
      const unitPrice = +item.get("purchaseItemUnitPrice").value || 0;
      const subtotal = quantity * unitPrice;
      purchaseGrossTotal += subtotal;
      
      item.get("purchaseItemSubTotal").setValue(subtotal.toFixed(2));
    });

    if (Array.isArray(this.editPurchaseForm.get("purchaseOrderTax").value)) {
      this.editPurchaseForm.get("purchaseOrderTax").value.forEach((element) => {
        totalTax += Number(element.taxRate);
      });
    } else {
      totalTax += Number(this.editPurchaseForm.get("purchaseOrderTax").value);
    }

    this.addTaxTotal = (purchaseGrossTotal * totalTax) / 100;

    let shipping = +this.editPurchaseForm.get("purchaseShipping").value;
    let Discount = +this.editPurchaseForm.get("purchaseDiscount").value;
    let otherCharges = +this.editPurchaseForm.get("otherCharges").value;

    totalAmount += purchaseGrossTotal;
    totalAmount += this.addTaxTotal;
    totalAmount -= Discount;
    totalAmount += shipping;
    totalAmount += otherCharges;

    this.editPurchaseForm.patchValue({
      purchaseGrossTotal: purchaseGrossTotal.toFixed(2),
      purchaseDiscount: Discount.toFixed(2),
      purchaseShipping: shipping.toFixed(2),
      purchaseTotalAmount: totalAmount.toFixed(2),
      otherCharges: otherCharges.toFixed(2),
    });
  }
  

  editPurchaseFormSubmit() {
    let totalTax = 0;
    if(this.editPurchaseForm.value.purchaseOrderTax){
      this.editPurchaseForm.value.purchaseOrderTax.forEach(element => {
        totalTax = totalTax + element.taxRate;
      });
    }
    
      const payload = {
        id: this.PurchaseId,
        supplier: this.editPurchaseForm.value.purchaseSupplierName,
        purchaseDate: this.editPurchaseForm.value.purchaseDate,
        purchaseDiscount: this.editPurchaseForm.value.purchaseDiscount,
        purchaseInvoiceNumber: this.editPurchaseForm.value.purchaseInvoiceNumber,
        purchaseGrossTotal: this.editPurchaseForm.value.purchaseGrossTotal,
        purchaseItemDetails: this.editPurchaseForm.value.purchaseItemDetails,
        appliedTax: this.editPurchaseForm.value.purchaseOrderTax,
        purchaseNotes: this.editPurchaseForm.value.purchaseNotes,
        purchaseOtherCharges: this.editPurchaseForm.value.otherCharges,
        purchaseOrderStatus: this.editPurchaseForm.value.purchaseOrderStatus,
        purchaseOrderTax: totalTax,
        purchaseShipping: this.editPurchaseForm.value.purchaseShipping,
        purchaseTermsAndCondition: this.editPurchaseForm.value.purchaseTermsAndCondition,
        purchaseTotalAmount: this.editPurchaseForm.value.purchaseTotalAmount,
      };
      console.log(payload);

      
    if (this.editPurchaseForm.valid) {

      this.purchaseService.UpdatePurchaseData(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Purchase has been updated";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/purchase"]);
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
