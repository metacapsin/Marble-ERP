import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { TaxesService } from "../../settings/taxes/taxes.service";
import { CustomersdataService } from "../../Customers/customers.service";
import { UnitsService } from "../../settings/units/units.service";
import { SubCategoriesService } from "../../settings/sub-categories/sub-categories.service";
import { CategoriesService } from "../../settings/categories/categories.service";
import { SuppliersdataService } from "../../Suppliers/suppliers.service";

@Component({
  selector: "app-add-purchase-return",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MultiSelectModule,
    DropdownModule,
    CalendarModule,
  ],
  templateUrl: "./add-purchase-return.component.html",
  styleUrl: "./add-purchase-return.component.scss",
})
export class AddPurchaseReturnComponent {
  addPurchaseReturnForm!: FormGroup;
  public routes = routes;
  unitListData: any;
  subCategoryList = [];
  addTaxTotal:any
  getSupplierShow:any
  SupplierList = [
    { SupplierName: "Adnan" },
    { SupplierName: "Nadim" },
    { SupplierName: "Kavya" },
  ];
  categoryList = [];
  productsList = [
    { productsName: "Earphone" },
    { productsName: "Mobiles" },
    { productsName: "Computers" },
  ];
  orderStatusList = [
    { orderStatus: "Ordered" },
    { orderStatus: "Confirmed" },
    { orderStatus: "Processing" },
    { orderStatus: "Shipping" },
    { orderStatus: "Delivered" },
  ];
  orderTaxList = [];
  taxesListData = [];
  SupplierLists = [];

  public itemDetails: number[] = [0];
  public chargesArray: number[] = [0];
  public recurringInvoice = false;
  public selectedValue!: string;
  date = new FormControl(new Date());

  constructor(
    private customerService: CustomersdataService,
    private taxService: TaxesService,
    private fb: FormBuilder,
    private unitService: UnitsService,
    private Service: SuppliersdataService,
    private CategoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService
  ) {
    this.addPurchaseReturnForm = this.fb.group({
      purchaseReturnInvoiceNumber: [""],
      purchaseReturnSupplierName: [""],
      purchaseReturnDate: [""],
      purchaseReturnOrderStatus: [""],
      purchaseReturnDiscount: [""],
      purchaseReturnShipping: [""],
      purchaseReturnTermsAndCondition: [""],
      purchaseReturnNotes: [""],
      purchaseReturnTotalAmount: [""],
      purchaseOrderTax:[''],
      purchaseGrossTotal:[''],
      otherCharges: ['',],
      purchaseReturnDetails: this.fb.array([
        this.fb.group({
          purchaseReturnQuantity: [""],
          purchaseReturnUnitPrice: [""],
          purchaseItemSubTotal: [""],
          purchaseReturnItemName: [""],
          purchaseItemCategory:[''],
          purchaseItemSubCategory:[''],
          unit:[''],
        }),
      ]),
    });
  }

  get purchaseReturnDetails() {
    return this.addPurchaseReturnForm.controls[
      "purchaseReturnDetails"
    ] as FormArray;
  }
  deletepurchaseReturnDetails(purchaseReturnDetailsIndex: number) {
    this.purchaseReturnDetails.removeAt(purchaseReturnDetailsIndex);
  }
  addpurchaseReturnDetailsItem() {
    const item = this.fb.group({
      purchaseReturnQuantity: [""],
      purchaseReturnUnitPrice: [""],
      purchaseItemSubTotal: [""],
      purchaseReturnItemName: [""],
      purchaseItemCategory:[''],
      purchaseItemSubCategory:[''],
      unit:[''],
    });
    this.purchaseReturnDetails.push(item);
  }

  ngOnInit(): void {
    this.unitService.getAllUnitList().subscribe((resp: any) => {
      this.unitListData = resp.data;
    });
    this.CategoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
    });
    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
    });
    this.taxService.getAllTaxList().subscribe((resp: any) => {
      this.taxesListData = resp.data;
      this.orderTaxList = [];
      this.taxesListData.forEach(element => {
        this.orderTaxList.push({
          orderTaxName: element.name + ' (' + element.taxRate + '%' + ')',
          orderNamevalue: element
        });
      });
    });
    this.Service.GetSupplierData().subscribe((data: any) => {
      this.getSupplierShow = data;
      this.SupplierLists = [];
      this.getSupplierShow.forEach((element: any) => {
        this.SupplierLists.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
        console.log(this.SupplierLists);
      });
    });
  }

  calculateTotalAmount() {
    console.log("Enter in caltotal");
    let totalAmount = 0;
    let purchaseGrossTotal = 0;
    let totalTax = 0;

    const purchaseItems = this.addPurchaseReturnForm.get(
      "purchaseReturnDetails"
    ) as FormArray;

    purchaseItems.controls.forEach((item: FormGroup) => {
      const quantity = +item.get("purchaseReturnQuantity").value || 0;
      const unitPrice = +item.get("purchaseReturnUnitPrice").value || 0;
      const subtotal = quantity * unitPrice;
      
      purchaseGrossTotal += subtotal;
      
      item.get("purchaseItemSubTotal").setValue(subtotal.toFixed(2));
    });

    if (Array.isArray(this.addPurchaseReturnForm.get("purchaseOrderTax").value)) {
      this.addPurchaseReturnForm.get("purchaseOrderTax").value.forEach((element) => {
        totalTax += Number(element.taxRate);
      });
    } else {
      totalTax += Number(this.addPurchaseReturnForm.get("purchaseOrderTax").value);
    }

    this.addTaxTotal = purchaseGrossTotal * totalTax / 100;    
    let shipping = +this.addPurchaseReturnForm.get("purchaseReturnShipping").value;
    let Discount = +this.addPurchaseReturnForm.get("purchaseReturnDiscount").value;
    let otherCharges = +this.addPurchaseReturnForm.get("otherCharges").value;

    totalAmount += purchaseGrossTotal;
    totalAmount += this.addTaxTotal;
    totalAmount -= Discount;
    totalAmount += shipping;
    totalAmount += otherCharges;

    this.addPurchaseReturnForm.patchValue({
      purchaseGrossTotal: purchaseGrossTotal.toFixed(2),
      purchaseDiscount: Discount.toFixed(2),
      purchaseShipping: shipping.toFixed(2),
      purchaseTotalAmount: totalAmount.toFixed(2),
      otherCharges: otherCharges.toFixed(2),
    });
  }
  addPurchaseReturnFormSubmit(){
    console.log(this.addPurchaseReturnForm.value);
  }
}
