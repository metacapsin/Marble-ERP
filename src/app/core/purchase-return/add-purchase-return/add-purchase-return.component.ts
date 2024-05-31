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
import { PaymentOutService } from "../../payment-out/payment-out.service";
import { s } from "@fullcalendar/core/internal-common";
import { PurchaseReturnService } from "../purchase-return.service";
import { SlabsService } from "../../Product/slabs/slabs.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-add-purchase-return",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MultiSelectModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
  ],
  templateUrl: "./add-purchase-return.component.html",
  styleUrl: "./add-purchase-return.component.scss",
  providers: [MessageService],
})
export class AddPurchaseReturnComponent {
  addPurchaseReturnForm!: FormGroup;
  public routes = routes;
  unitListData: any;
  subCategoryList = [];
  addTaxTotal: any;
  getSupplierShow: any;
  PurchaseReturnDataById:any
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
  blockDataWithLotId:any
  purchaseSlabData:any
  SlabAddValue:any
  purchaseDataByInvoiceNumber = [];
  purchaseDataById: any;
  public itemDetails: number[] = [0];
  public chargesArray: number[] = [0];
  public recurringInvoice = false;
  public selectedValue!: string;
  date = new FormControl(new Date());
  GridDataForSlab: any;
  // slabValuesAdd: any[];
  GridDataForLot: any;
  lotAddValue: number;
  lotValuesAdd: any[];
  processedLots: any;
  selectedLots: any;
  isProcess: any;

  constructor(
    private taxService: TaxesService,
    private fb: FormBuilder,
    private unitService: UnitsService,
    private PurchaseReturnService : PurchaseReturnService,
    private Service: SuppliersdataService,
    private CategoriesService: CategoriesService,
    private PaymentOutService: PaymentOutService,
    private service: SlabsService,
    private messageService: MessageService,
    private subCategoriesService: SubCategoriesService
  ) {
    this.addPurchaseReturnForm = this.fb.group({
      purchaseReturnInvoiceNumber: [""],
      purchaseReturnSupplierName: [""],
      purchaseReturnDate: [""],
      purchaseReturnOrderStatus: [""],
      // purchaseReturnDiscount: [""],
      // purchaseReturnShipping: [""],
      purchaseReturnTermsAndCondition: [""],
      purchaseReturnNotes: [""],
      purchaseReturnTotalAmount: [""],
      // purchaseOrderTax: [""],
      purchaseGrossTotal: [""],
      otherCharges: [""],
      purchaseLot:[''],
      purchaseSlab:[[]],
      // purchaseReturnDetails: this.fb.array([
      //   this.fb.group({
      //     purchaseReturnQuantity: [""],
      //     purchaseReturnUnitPrice: [""],
      //     purchaseItemSubTotal: [""],
      //     purchaseReturnItemName: [""],
      //     purchaseItemCategory: [""],
      //     purchaseItemSubCategory: [""],
      //     unit: [""],
      //   }),
      // ]),
    });
  }

  // get purchaseReturnDetails() {
  //   return this.addPurchaseReturnForm.controls[
  //     "purchaseReturnDetails"
  //   ] as FormArray;
  // }
  // deletepurchaseReturnDetails(purchaseReturnDetailsIndex: number) {
  //   this.purchaseReturnDetails.removeAt(purchaseReturnDetailsIndex);
  // }
  // addpurchaseReturnDetailsItem() {
  //   const item = this.fb.group({
  //     purchaseReturnQuantity: [""],
  //     purchaseReturnUnitPrice: [""],
  //     purchaseItemSubTotal: [""],
  //     purchaseReturnItemName: [""],
  //     purchaseItemCategory: [""],
  //     purchaseItemSubCategory: [""],
  //     unit: [""],
  //   });
  //   this.purchaseReturnDetails.push(item);
  // }
  onSuppliersSelect(customerId: any) {
    this.PaymentOutService.getPurchaseBySupplierId(customerId).subscribe(
      (resp: any) => {
       if (resp.status == 'error') {
        this.messageService.add({ severity: "error", detail: resp.message });
       }
        console.log(resp);
        if (resp && resp.data && Array.isArray(resp.data)) {
          this.purchaseDataById = resp.data;
          this.purchaseDataByInvoiceNumber = [];
          this.purchaseDataById.forEach((element) => {
            console.log("elements", element);
            this.purchaseDataByInvoiceNumber.push({
              purchaseInvoiceNumber: element.purchaseInvoiceNumber,
              _id:element._id,
            });
          });
        } else {
          console.error("Invalid response data", resp);
        }
      },
      (error) => {
        console.error("Error fetching data from service", error);
      }
    );
  }
  slabValues(slabValue: any) {
    this.SlabAddValue = 0;
    this.GridDataForSlab = slabValue || [];
    // this.slabValuesAdd = [];
    this.GridDataForSlab.forEach((element) => {
      const totalCosting = parseFloat(element.totalCosting);
      if (!isNaN(totalCosting)) {
        this.SlabAddValue += totalCosting;
      } else {
        console.error("Invalid totalCosting value:", element.totalCosting);
      }
    });
    // this.GridDataForLot = [];
    // this.calculateTotalAmount();
    console.log(this.SlabAddValue);
  }
  lotValues(lotValue: any) {
    this.lotAddValue = 0;
    this.GridDataForLot = lotValue || [];
    // this.lotValuesAdd = [];
    this.GridDataForLot.forEach((element) => {
      const totalCosting = parseFloat(element.totalCosting);
      if (!isNaN(totalCosting)) {
        this.lotAddValue += totalCosting;
      } else {
        console.error("Invalid totalCosting value:", element.totalCosting);
      }
    });
    // this.GridDataForLot = [];
    // this.calculateTotalAmount();
    console.log(this.lotAddValue);
  }
  deleteSlab(id:any){
    console.log(id);
  }
  deleteLot(id:any){

  }
  onInvoiceNumber(purchaseId:any){
    this.PurchaseReturnService.GetPurchaseReturnDataById(purchaseId).subscribe((resp:any)=>{
      this.PurchaseReturnDataById = resp.data;
      if(this.PurchaseReturnDataById.purchaseType == "slab"){
        this.purchaseSlabData = [];
        this.PurchaseReturnDataById.slabDetails.forEach(element => {
          console.log(element);
          this.purchaseSlabData.push({
            slabName: element.slabName,
            _id: element._id,
            totalCosting:element.totalCosting,
            totalSQFT:element.totalSQFT,
            slabNo:element.slabNo,
            sellingPricePerSQFT: element.sellingPricePerSQFT,
          }) 
          console.log(this.purchaseSlabData); 
        });
      }
      if(this.PurchaseReturnDataById.purchaseType == "lot"){
        this.service.getBlockDetailByLotId(this.PurchaseReturnDataById.lotDetails._id).subscribe((resp: any) => {
          this.blockDataWithLotId = resp.data.blockDetails || [];
          if (!this.PurchaseReturnDataById.isProcess) {
            this.selectedLots = this.blockDataWithLotId.filter(block => !block.isProcessed)
            console.log(this.selectedLots);
          } else {
            this.selectedLots = []; // Clear selection if isProcess is true
          }
          // this.processedLots = this.blockDataWithLotId.map(block => block._id);
          // console.log("resp.data.blocksDetails", resp.data.blockDetails,this.processedLots);
        });
      }
    })
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
      this.taxesListData.forEach((element) => {
        this.orderTaxList.push({
          orderTaxName: element.name + " (" + element.taxRate + "%" + ")",
          orderNamevalue: element,
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

    if (
      Array.isArray(this.addPurchaseReturnForm.get("purchaseOrderTax").value)
    ) {
      this.addPurchaseReturnForm
        .get("purchaseOrderTax")
        .value.forEach((element) => {
          totalTax += Number(element.taxRate);
        });
    } else {
      totalTax += Number(
        this.addPurchaseReturnForm.get("purchaseOrderTax").value
      );
    }

    this.addTaxTotal = (purchaseGrossTotal * totalTax) / 100;
    let shipping = +this.addPurchaseReturnForm.get("purchaseReturnShipping")
      .value;
    let Discount = +this.addPurchaseReturnForm.get("purchaseReturnDiscount")
      .value;
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
  addPurchaseReturnFormSubmit() {
    console.log(this.addPurchaseReturnForm.value);
  }
}
