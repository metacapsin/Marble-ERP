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
import { format } from "crypto-js";

@Component({
  selector: "app-edit-purchase",
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: "./edit-purchase.component.html",
  styleUrl: "./edit-purchase.component.scss",
  providers: [MessageService],
})
export class EditPurchaseComponent implements OnInit {
  editPurchaseForm!: FormGroup;
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
  lotsNoArray = [
    { name: "Lot", _id: "lot" },
    { name: "Slabs", _id: "slab" },
  ];
  orderTaxList = [];
  slabData: any;
  // lotsNo: any;
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
  purchaseId: any;
  PurchaseListData: any;
  maxDate = new Date();
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
    private service: SlabsService,
    private activeRoute: ActivatedRoute
  ) {
    this.editPurchaseForm = this.fb.group({
      purchaseInvoiceNumber: [""],
      supplier: ["", [Validators.required]],
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
      lotDetail: [""],
      purchaseType: ["", [Validators.required]],
      slabDetails: [""],
    });
    this.purchaseId = this.activeRoute.snapshot.params["id"];
  }

  lotType() {
    this.lotValue = this.editPurchaseForm.get("purchaseType")?.value;
    this.GridDataForLot = [];
    this.GridDataForSlab = [];
    this.TotleLotCost = 0;
    this.SlabAddValue = 0;
    this.calculateTotalAmount();

    // this.editPurchaseForm.get("lotDetails")?.reset();
    // this.editPurchaseForm.get("slabDetail")?.reset();
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
    console.log(LotValue);
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
            billingAddress: element.billingAddress,
          },
        });
      });
    });
  }
  patchForm(data) {
    console.log(data);
    this.editPurchaseForm.patchValue({
      purchaseInvoiceNumber: data.purchaseInvoiceNumber,
      supplier: data.supplier,
      purchaseDate: data.purchaseDate,
      purchaseOrderStatus: data.purchaseOrderStatus,
      purchaseOrderTax: data.purchaseOrderTax,
      purchaseDiscount: data.purchaseDiscount,
      purchaseShipping: data.purchaseShipping,
      purchaseTermsAndCondition: data.purchaseTermsAndCondition,
      purchaseNotes: data.purchaseNotes,
      purchaseTotalAmount: data.purchaseTotalAmount,
      otherCharges: data.otherCharges,
      purchaseGrossTotal: data.purchaseGrossTotal,
      oceanFrieght: data.oceanFrieght,
      postExpenses: data.postExpenses,
      quality: data.quality,
      lotDetail: data.lotDetails,
      purchaseType: data.purchaseType,
      slabDetails: data.slabDetails,
    });
    this.lotType();
  }
  ngOnInit(): void {
    this.PurchaseService.GetPurchaseDataById(this.purchaseId).subscribe(
      (resp: any) => {
        this.PurchaseListData = resp.data;
        this.patchForm(this.PurchaseListData);
        console.log(resp.data.lotDetails);

        if (resp.data.purchaseType == "slab") {
          this.slabValues(resp.data.slabDetails);
        }
        if (resp.data.purchaseType == "lot") {
          console.log(resp.data.lotDetails.blockDetails);
          this.lotValues(resp.data.lotDetails);
        }
      }
    );
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
          _id: element._id,
          lotNo: element.lotNo,
          lotTotalCosting: element.lotTotalCosting,
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
          _id: element._id,
          slabNo: element.slabNo,
          totalCosting: element.totalCosting,
          totalSQFT: element.totalSQFT,
          sellingPricePerSQFT: element.sellingPricePerSQFT,
        });
      });
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
    if (Array.isArray(this.editPurchaseForm.get("purchaseOrderTax").value)) {
      this.editPurchaseForm.get("purchaseOrderTax").value.forEach((element) => {
        totalTax += Number(element.taxRate);
      });
    } else {
      totalTax += Number(this.editPurchaseForm.get("purchaseOrderTax").value);
    }

    let shipping = +this.editPurchaseForm.get("purchaseShipping").value;
    let Discount = +this.editPurchaseForm.get("purchaseDiscount").value;
    let otherCharges = +this.editPurchaseForm.get("otherCharges").value;
    let oceanFrieght = +this.editPurchaseForm.get("oceanFrieght").value;
    let postExpenses = +this.editPurchaseForm.get("postExpenses").value;
    this.addTaxTotal = (purchaseGrossTotal * totalTax) / 100;
    totalAmount += purchaseGrossTotal;
    totalAmount -= Discount;
    totalAmount += shipping;
    totalAmount += otherCharges;
    totalAmount += oceanFrieght;
    totalAmount += postExpenses;
    totalAmount += this.addTaxTotal;

    this.editPurchaseForm.patchValue({
      purchaseGrossTotal: purchaseGrossTotal,
      purchaseDiscount: Discount.toFixed(),
      purchaseShipping: shipping.toFixed(),
      purchaseTotalAmount: totalAmount.toFixed(),
      otherCharges: otherCharges.toFixed(),
      oceanFrieght: oceanFrieght.toFixed(),
      postExpenses: postExpenses.toFixed(),
    });
  }

  editPurchaseFormSubmit() {
    const formData = this.editPurchaseForm.value;
    console.log(formData);
    if (formData.slabDetails == "" && formData.lotDetail == "") {
      this.messageService.add({
        severity: "error",
        detail: "Select one Lot or Slab",
      });
    }
    const payload = {
      purchaseInvoiceNumber: formData.purchaseInvoiceNumber,
      supplier: formData.supplier,
      purchaseDate: formData.purchaseDate,
      purchaseType: formData.purchaseType,
      purchaseDiscount: formData.purchaseDiscount,
      purchaseGrossTotal: formData.purchaseGrossTotal,
      purchaseItemDetails: formData.purchaseItemDetails,
      purchaseNotes: formData.purchaseNotes,
      otherCharges: formData.otherCharges,
      purchaseOrderTax: formData.purchaseOrderTax,
      purchaseShipping: formData.purchaseShipping,
      purchaseTermsAndCondition: formData.purchaseTermsAndCondition,
      purchaseTotalAmount: formData.purchaseTotalAmount,
      lotDetail: formData.lotDetail,
      slabDetail: formData.slabDetails,
      quality: formData.quality,
      purchaseOrderStatus: formData.purchaseOrderStatus,
      id: this.purchaseId,
    };
    console.log(payload);
    if (this.editPurchaseForm.valid) {
      console.log("valid form");
      this.PurchaseService.UpdatePurchaseData(payload).subscribe(
        (resp: any) => {
          console.log(resp);
          if (resp) {
            if (resp.status === "success") {
              this.messageService.add({
                severity: "success",
                detail: resp.message,
              });
              setTimeout(() => {
                this.router.navigate(["/purchase"]);
              }, 400);
            } else {
              this.messageService.add({
                severity: "error",
                detail: resp.message,
              });
            }
          }
        }
      );
    } else {
    }
  }
}
