import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
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
import { UnitsService } from "../../settings/units/units.service";
import { SubCategoriesService } from "../../settings/sub-categories/sub-categories.service";
import { CategoriesService } from "../../settings/categories/categories.service";
import { SuppliersdataService } from "../../Suppliers/suppliers.service";
import { PaymentOutService } from "../../payment-out/payment-out.service";
import { PurchaseReturnService } from "../purchase-return.service";
import { SlabsService } from "../../Product/slabs/slabs.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { Router } from "@angular/router";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

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
export class AddPurchaseReturnComponent implements OnInit {
  addPurchaseReturnForm!: FormGroup;
  public routes = routes;
  maxDate = new Date();
  unitListData: any;
  subCategoryList = [];
  addTaxTotal: any;
  getSupplierShow: any;
  PurchaseReturnDataById: any = {};
  orderStatusList = [
    { orderStatus: "Ordered" },
    { orderStatus: "Confirmed" },
    { orderStatus: "Processing" },
    { orderStatus: "Shipping" },
    { orderStatus: "Delivered" },
  ];

  SupplierLists: any = [];
  purchaseSlabData: any;
  SlabAddValue: any;
  purchaseDataByInvoiceNumber = [];
  purchaseDataById: any;
  GridDataForSlab: any;
  // slabValuesAdd: any[];
  GridDataForLot: any;
  lotAddValue: number;
  lotValuesAdd: any[];
  processedLots: any;
  selectedLots: any;
  isProcess: any;
  unselectedLots: any = [];
  totalValue: any;
  getpurchaseTotalAmount: any;
  totalSlab: any;
  slabData: any;
  unselectedSlab: any;
  LotData: any;
  supplier: any = [];
  returnUrl: string;


  constructor(
    private taxService: TaxesService,
    private fb: FormBuilder,
    private unitService: UnitsService,
    private router: Router,
    private PurchaseReturnService: PurchaseReturnService,
    private Service: SuppliersdataService,
    private CategoriesService: CategoriesService,
    private PaymentOutService: PaymentOutService,
    private messageService: MessageService,
    private subCategoriesService: SubCategoriesService,
    private localStorageService: LocalStorageService
  ) {
    this.addPurchaseReturnForm = this.fb.group({
      purchaseReturnInvoiceNumber: ["", [Validators.required]],
      purchaseReturnSupplier: ["", [Validators.required]],
      purchaseReturnDate: ["", [Validators.required]],
      // purchaseReturnOrderStatus: ["", [Validators.required]],
      // purchaseReturnTermsAndCondition: [""],
      purchaseReturnNotes: [""],
      purchaseReturnTotalAmount: [""],
      purchaseGrossTotal: [""],
      otherCharges: [""],
      // purchaseLot: [""],
      purchaseSlab: [[]],
    });
  }
  onSuppliersSelect(_id: any) {
    // this.GridDataForLot = [];
    this.GridDataForSlab = [];
    // this.purchaseSlabData = [];
    // this.selectedLots = [];
    this.PaymentOutService.getPurchaseBySupplierId(_id).subscribe(
      (resp: any) => {
        if (resp.status == "error") {
          this.messageService.add({ severity: "error", detail: resp.message });
        }
        if (resp && resp.data && Array.isArray(resp.data)) {
          this.purchaseDataById = resp.data;
          this.LotData = this.purchaseDataById.filter(
            (lot) => lot.purchaseType == "lot"
          );
          if (this.LotData.length) {
            const message = "Lot can't return";
            this.messageService.add({ severity: "error", detail: message });
          }
          this.slabData = this.purchaseDataById.filter(
            (slab) => slab.purchaseType == "slab"
          );
          this.purchaseDataByInvoiceNumber = [];
          this.slabData.forEach((element) => {
            console.log("elements", element);
            this.purchaseDataByInvoiceNumber.push({
              purchaseInvoiceNumber: element.purchaseInvoiceNumber,
              _id: element._id,
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
    // this.PurchaseReturnDataById.purchaseType = "";
  }
  slabValues(slabValue: any) {
    this.SlabAddValue = 0;
    this.GridDataForLot = [];
    this.GridDataForSlab = slabValue || [];
    console.log("Selected Slab Value:", slabValue);
    console.log("Selected Lots:", this.purchaseSlabData);

    // Ensure the slabValue array is not empty
    if (
      !Array.isArray(this.GridDataForSlab) ||
      this.GridDataForSlab.length === 0
    ) {
      console.warn("No slab values provided or slabValue is not an array.");
      return;
    }

    // Filter out unselected lots
    // this.unselectedSlab = this.purchaseSlabData.filter(
    //   (lot) => !this.GridDataForSlab.includes(lot)
    // );
    // console.log("Unselected Slabs:", this.unselectedSlab);
    // this.unselectedSlab.forEach((element) => {
    //   const totalCosting = parseFloat(element.totalCosting);
    //   if (!isNaN(totalCosting)) {
    //     this.SlabAddValue += totalCosting;
    //   } else {
    //     console.error("Invalid totalCosting value:", element.totalCosting);
    //   }
    // });
    // this.subFromPurchaseTotalAmount(this.SlabAddValue);
    // console.log("Slab Add Value:", this.SlabAddValue);
    // console.log("Grid Data For Slab:", this.GridDataForSlab);
  }
  // lotValues(lotValue: any) {
  //   this.GridDataForSlab = [];
  //   this.lotAddValue = 0;
  //   this.GridDataForLot = lotValue || [];
  //   this.GridDataForLot = Array.isArray(lotValue) ? lotValue : [];

  //   this.unselectedLots =
  //     this.selectedLots.filter((lot) => !lotValue.includes(lot)) || [];
  //   console.log(this.unselectedLots);
  //   this.unselectedLots.forEach((element) => {
  //     const totalCosting = parseFloat(element.totalCosting);
  //     if (!isNaN(totalCosting)) {
  //       this.lotAddValue += totalCosting;
  //     } else {
  //       console.error("Invalid totalCosting value:", element.totalCosting);
  //     }
  //   });
  //   this.subFromPurchaseTotalAmount(this.lotAddValue || 0);
  //   console.log(this.lotAddValue);
  // }
  subFromPurchaseTotalAmount(subTotal: any) {
    this.totalValue = 0;
    console.log(subTotal);
    var purchaseTotalAmount = this.getpurchaseTotalAmount || 0;
    // if (this.getpurchaseTotalAmount) {
    //   this.totalValue = (purchaseTotalAmount - subTotal).toFixed(2);
    //   console.log(
    //     "totalAmount block total",
    //     this.totalValue,
    //     purchaseTotalAmount
    //   );
    //   this.addPurchaseReturnForm.patchValue({
    //     purchaseGrossTotal: this.getpurchaseTotalAmount,
    //   });
    // }
    if (this.totalSlab) {
      this.totalValue = (this.totalSlab - subTotal).toFixed(2);
      // this.totalValue = subTotal;
      this.addPurchaseReturnForm.patchValue({
        purchaseGrossTotal: this.totalSlab,
      });
    }
  }

  calculateTotalPurchaseAmount() {
    let purchaseGrossTotal = this.addPurchaseReturnForm.get('purchaseGrossTotal').value || 0;
    // let purchaseReturnTotalAmount = this.addPurchaseReturnForm.get('purchaseReturnTotalAmount').value || 0;
    let ReturnOtherCharges = this.addPurchaseReturnForm.get('otherCharges').value || 0;

    let purchaseReturnTotalAmount = purchaseGrossTotal - ReturnOtherCharges;

    this.addPurchaseReturnForm.get('purchaseReturnTotalAmount').patchValue(purchaseReturnTotalAmount);
    console.log(
      this.addPurchaseReturnForm.get('purchaseReturnTotalAmount').value);
    

  }

  onInvoiceNumber(purchaseId: any) {
    this.GridDataForLot = [];
    this.GridDataForSlab = [];
    this.purchaseSlabData = [];
    this.selectedLots = [];
    this.totalSlab = 0;
    this.PurchaseReturnService.GetPurchaseDataById(purchaseId).subscribe((resp: any) => {
      this.PurchaseReturnDataById = resp.data;
      this.GridDataForSlab = [resp.data.slabDetails];
      if (this.PurchaseReturnDataById.purchaseType == "slab") {
        // this.purchaseSlabData = [];
        // this.addPurchaseReturnForm.get("purchaseSlab").patchValue(resp.data.slabDetails);


        // this.purchaseSlabData.push({
        //   _id: this.PurchaseReturnDataById.slabDetails._id,
        //   slabNo: this.PurchaseReturnDataById.slabDetails.slabNo,
        //   slabName: this.PurchaseReturnDataById.slabDetails.slabName,
        //   totalSQFT: this.PurchaseReturnDataById.slabDetails.totalSQFT,
        //   sellingPricePerSQFT: this.PurchaseReturnDataById.slabDetails.sellingPricePerSQFT,
        //   totalCosting: this.PurchaseReturnDataById.slabDetails.totalCosting,
        // });
        const totalCosting = parseFloat(this.PurchaseReturnDataById.slabDetails.purchaseCost);
        if (!isNaN(totalCosting)) {
          this.addPurchaseReturnForm.patchValue({
            purchaseGrossTotal: totalCosting,
            purchaseReturnTotalAmount: totalCosting,
          });
        }
      }
    }


    );
    // this.lotAddValue = 0;
    // this.subFromPurchaseTotalAmount(this.lotAddValue);
  }

  ngOnInit(): void {
    this.getSupplierData();

    this.supplier = this.localStorageService.getItem("supplier1");
    this.returnUrl = this.localStorageService.getItem('returnUrl')
    console.log(this.returnUrl)

    if (this.supplier) {
      this.addPurchaseReturnForm.patchValue({
        purchaseReturnSupplier: this.supplier,
      });
      this.onSuppliersSelect(this.supplier._id)
    }


    this.getSupplierData();
  }

  getSupplierData() {
    this.Service.GetSupplierData().subscribe((resp: any) => {
      this.SupplierLists = [];
      resp.forEach((element: any) => {
        this.SupplierLists.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
    });
  }

  calculateTotalAmount() {
    //    .log("Enter in caltotal");
    //   let totalAmount = 0;
    //   let purchaseGrossTotal = 0;
    //   let totalTax = 0;
    //   const purchaseItems = this.addPurchaseReturnForm.get(
    //     "purchaseReturnDetails"
    //   ) as FormArray;
    //   purchaseItems.controls.forEach((item: FormGroup) => {
    //     const quantity = +item.get("purchaseReturnQuantity").value || 0;
    //     const unitPrice = +item.get("purchaseReturnUnitPrice").value || 0;
    //     const subtotal = quantity * unitPrice;
    //     purchaseGrossTotal += subtotal;
    //     item.get("purchaseItemSubTotal").setValue(subtotal.toFixed(2));
    //   });
    //   if (
    //     Array.isArray(this.addPurchaseReturnForm.get("purchaseOrderTax").value)
    //   ) {
    //     this.addPurchaseReturnForm
    //       .get("purchaseOrderTax")
    //       .value.forEach((element) => {
    //         totalTax += Number(element.taxRate);
    //       });
    //   } else {
    //     totalTax += Number(
    //       this.addPurchaseReturnForm.get("purchaseOrderTax").value
    //     );
    //   }
    //   this.addTaxTotal = (purchaseGrossTotal * totalTax) / 100;
    //   let shipping = +this.addPurchaseReturnForm.get("purchaseReturnShipping")
    //     .value;
    //   let Discount = +this.addPurchaseReturnForm.get("purchaseReturnDiscount")
    //     .value;
    //   let otherCharges = +this.addPurchaseReturnForm.get("otherCharges").value;
    //   totalAmount += purchaseGrossTotal;
    //   totalAmount += this.addTaxTotal;
    //   totalAmount -= Discount;
    //   totalAmount += shipping;
    //   totalAmount += otherCharges;
    //   this.addPurchaseReturnForm.patchValue({
    //     purchaseGrossTotal: purchaseGrossTotal.toFixed(2),
    //     purchaseDiscount: Discount.toFixed(2),
    //     purchaseShipping: shipping.toFixed(2),
    //     purchaseTotalAmount: totalAmount.toFixed(2),
    //     otherCharges: otherCharges.toFixed(2),
    //   });
  }
  addPurchaseReturnFormSubmit() {
    // const purchaseReturnItemDetails = [
    //   {
    //     purchaseSlab: this.addPurchaseReturnForm.value.purchaseSlab,
    //   },
    // ];
    // console.log(purchaseReturnItemDetails);
    const payload = {
      purchaseReturnInvoiceNumber: this.addPurchaseReturnForm.value.purchaseReturnInvoiceNumber,
      purchaseReturnSupplier: this.addPurchaseReturnForm.value.purchaseReturnSupplier,
      purchaseReturnDate: this.addPurchaseReturnForm.value.purchaseReturnDate,
      // purchaseReturnTermsAndCondition: this.addPurchaseReturnForm.value.purchaseReturnTermsAndCondition,
      purchaseReturnNotes: this.addPurchaseReturnForm.value.purchaseReturnNotes,
      purchaseReturnTotalAmount: this.addPurchaseReturnForm.value.purchaseReturnTotalAmount,
      purchaseGrossTotal: this.addPurchaseReturnForm.value.purchaseGrossTotal,
      purchaseReturnItemDetails: this.GridDataForSlab,
      purchaseReturnOrderStatus: "Static",
    };
    console.log(payload);
    if (this.addPurchaseReturnForm.valid) {
      console.log("valid form");
      this.PurchaseReturnService.createPurchaseReturn(payload).subscribe(
        (resp: any) => {
          console.log(resp);
          if (resp) {
            if (resp.status === "success") {
              this.messageService.add({
                severity: "success",
                detail: resp.message,
              });
              setTimeout(() => {
                this.router.navigateByUrl(this.returnUrl);
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
