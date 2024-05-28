import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
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
import { LotService } from "../../Product/lot/lot.service";
import { SlabsService } from "../../Product/slabs/slabs.service";

@Component({
  selector: "app-add-purchase",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MultiSelectModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
  ],
  templateUrl: "./add-purchase.component.html",
  styleUrl: "./add-purchase.component.scss",
  providers: [MessageService],
})
export class AddPurchaseComponent implements OnInit {
  addPurchaseForm!: FormGroup;
  getSupplierShow: any;
  public routes = routes;
  subCategoryList: any;
  unitListData: any;
  id: any;
  SupplierLists = [];
  categoryList = [];
  setIT: any;
  data: any;
  TotleLotCost: any;
  originalData: any;
  GridDataForLot?: any = [];
  GridDataForSlab?: any = [];
  SlabAddValue: any;
  slabValuesAdd?: any = [];
  orderStatusList = [
    { orderStatus: "Ordered" },
    { orderStatus: "Confirmed" },
    { orderStatus: "Processing" },
    { orderStatus: "Shipping" },
    { orderStatus: "Delivered" },
  ];
  lotsNoArray = [{ name: "Lot" }, { name: "Slabs" }];
  orderTaxList = [];
  slabData: any;
  lotsNo: any;
  slabs: any = null;
  taxesListData = [];
  Lotlists: any;
  slabLists: any;
  public itemDetails: number[] = [0];
  public chargesArray: number[] = [0];
  public recurringInvoice = false;
  public selectedValue!: string;
  lotValue: any;
  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  notesRegex = /^(?:.{2,100})$/;
  addTaxTotal: any;
  tandCRegex = /^(?:.{2,200})$/;

  constructor(
    private taxService: TaxesService,
    private fb: FormBuilder,
    private router: Router,
    private Service: SuppliersdataService,
    private PurchaseService: PurchaseService,
    private messageService: MessageService,
    private CategoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private unitService: UnitsService,
    private Lotservice: LotService,
    private service: SlabsService
  ) {
    this.addPurchaseForm = this.fb.group({
      purchaseInvoiceNumber: [""],
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
      oceanFrieght: [""],
      postExpenses: [""],
      quality: [""],
      lot: [""],
      purchaseType: ["", [Validators.required]],
      slabs: [""],
      // purchaseItemDetails: this.fb.array([
      //   this.fb.group({
      //     purchaseItemCategory: ["", [Validators.required]],
      //     purchaseItemSubCategory: ["", [Validators.required]],
      //     unit: ["", [Validators.required]],
      //     purchaseItemName: [
      //       "",
      //       [Validators.required, Validators.pattern(this.nameRegex)],
      //     ],
      //     purchaseItemQuantity: ["", [Validators.required, Validators.min(0)]],
      //     purchaseItemUnitPrice: ["", [Validators.required, Validators.min(0)]],
      //     purchaseItemSubTotal: ["", [Validators.required, Validators.min(0)]],
      //   }),
      // ]),
    });
  }

  lotType() {
    this.lotValue = this.addPurchaseForm.get("purchaseType")?.value;
    this.GridDataForLot = [];
    this.GridDataForSlab = [];
    this.TotleLotCost = 0;
    this.SlabAddValue = 0;
    this.calculateTotalAmount();

    this.addPurchaseForm.get("lot")?.reset();
    this.addPurchaseForm.get("slabs")?.reset();
  }
  lotValues(LotValue: any) {
    console.log("LotValue", LotValue);
    this.service.getBlockDetailByLotId(LotValue._id).subscribe((resp: any) => {
      this.GridDataForLot = resp.data.blockDetails || [];
      console.log("resp.data.blocksDetails", resp.data.blockDetails, resp.data);
      console.log("blocks", this.GridDataForLot, this.TotleLotCost);
    });
    this.TotleLotCost = LotValue.lotTotalCosting || 0;
    this.calculateTotalAmount();
    this.GridDataForSlab = [];
  }

  slabValues(slabValue: any) {
    this.SlabAddValue = 0;
    this.GridDataForSlab = slabValue || [];
    this.slabValuesAdd = [];
    this.GridDataForSlab.forEach((element) => {
      const totalCosting = parseFloat(element.totalCosting);
      if (!isNaN(totalCosting)) {
        this.SlabAddValue += totalCosting;
      } else {
        console.error("Invalid totalCosting value:", element.totalCosting);
      }
    });
    this.GridDataForLot = [];
    this.calculateTotalAmount();
    console.log(slabValue);
  }

  getSupplier() {
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
      });
    });
  }

  ngOnInit(): void {
    this.getSupplier();
    this.unitService.getAllUnitList().subscribe((resp: any) => {
      this.unitListData = resp.data;
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
    this.CategoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
    });
    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
    });
    this.Lotservice.getLotList().subscribe((resp: any) => {
      this.data = resp.data;
      this.originalData = resp.data;
      console.log(this.originalData);
      this.Lotlists = [];
      this.originalData.forEach((element: any) => {
        console.log(element);
        this.Lotlists.push({
          lotName: element.lotName,
          _id: {
            _id: element._id,
            lotName: element.lotName,
            lotNo: element.lotNo,
            lotTotalCosting: element.lotTotalCosting,
          },
        });
      });
    });
    this.service.getSlabsList().subscribe((resp: any) => {
      this.data = resp.data;
      this.slabData = resp.data;
      this.slabLists = [];
      this.slabData.forEach((element: any) => {
        this.slabLists.push({
          slabName: element.slabName,
          _id: {
            _id: element._id,
            slabName: element.slabName,
            slabNo: element.slabNo,
            totalCosting: element.totalCosting,
            totalSQFT: element.totalSQFT,
            sellingPricePerSQFT: element.sellingPricePerSQFT,
          },
        });
        // console.log(this.slabLists);
      });
      // console.log("API", this.data);
    });
  }
  calculateTotalAmount() {
    console.log("Enter in caltotal");
    let totalAmount = 0;
    var purchaseGrossTotal = 0;
    if (this.SlabAddValue) {
      this.TotleLotCost = 0;
      purchaseGrossTotal = this.SlabAddValue;
    }
    if (this.TotleLotCost) {
      this.SlabAddValue = 0;
      purchaseGrossTotal = this.TotleLotCost;
    }
    console.log("tocalculateTotalAmount", purchaseGrossTotal);

    let totalTax = 0;
    if (Array.isArray(this.addPurchaseForm.get("purchaseOrderTax").value)) {
      this.addPurchaseForm.get("purchaseOrderTax").value.forEach((element) => {
        totalTax += Number(element.taxRate);
      });
    } else {
      totalTax += Number(this.addPurchaseForm.get("purchaseOrderTax").value);
    }

    let shipping = +this.addPurchaseForm.get("purchaseShipping").value;
    let Discount = +this.addPurchaseForm.get("purchaseDiscount").value;
    let otherCharges = +this.addPurchaseForm.get("otherCharges").value;
    let oceanFrieght = +this.addPurchaseForm.get("oceanFrieght").value;
    let postExpenses = +this.addPurchaseForm.get("postExpenses").value;
    this.addTaxTotal = (purchaseGrossTotal * totalTax) / 100;
    var valueAddTaxTotal = parseFloat(this.addTaxTotal.toFixed(2));
    totalAmount += purchaseGrossTotal;
    totalAmount -= Discount;
    totalAmount += shipping;
    totalAmount += otherCharges;
    totalAmount += oceanFrieght;
    totalAmount += postExpenses;
    totalAmount += valueAddTaxTotal;

    this.addPurchaseForm.patchValue({
      purchaseGrossTotal: purchaseGrossTotal,
      purchaseDiscount: Discount.toFixed(),
      purchaseShipping: shipping.toFixed(),
      purchaseTotalAmount: totalAmount.toFixed(),
      otherCharges: otherCharges.toFixed(),
      oceanFrieght: oceanFrieght.toFixed(),
      postExpenses: postExpenses.toFixed(),
    });
  }

  addPurchaseFormSubmit() {
    const formData = this.addPurchaseForm.value;
    console.log(formData);
    // let totalTax = 0;
    // if (formData.purchaseOrderTax) {
    //   formData.purchaseOrderTax.forEach((e) => {
    //     totalTax = totalTax + e.taxRate;
    //   });
    // }
    if (formData.slabs === null && formData.lot === null) {
      this.messageService.add({
        severity: "error",
        detail: "Select one Lot or Slab",
      });
    }
    const payload = {
      purchaseSupplierName: formData.purchaseSupplierName,
      purchaseDate: formData.purchaseDate,
      quality: formData.purchaseDiscount,
      purchaseType: formData.purchaseType,
      slabs: formData.slabs,
      lot: formData.lot,
      purchaseDiscount: formData.purchaseDiscount,
      purchaseGrossTotal: formData.purchaseGrossTotal,
      purchaseNotes: formData.purchaseNotes,
      otherCharges: formData.otherCharges,
      purchaseOrderStatus: formData.purchaseOrderStatus,
      purchaseOrderTax: formData.purchaseOrderTax,
      purchaseShipping: formData.purchaseShipping,
      purchaseTermsAndCondition: formData.purchaseTermsAndCondition,
      purchaseTotalAmount: formData.purchaseTotalAmount,
      postExpenses: formData.postExpenses,
      oceanFrieght: formData.oceanFrieght,
    };
    console.log(payload);
    if (this.addPurchaseForm.valid) {
      console.log("valid form");
      this.PurchaseService.AddPurchaseData(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Purchase has been added";
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
    }
  }
}
