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
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-edit-purchase-return",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MultiSelectModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
  ],
  templateUrl: "./edit-purchase-return.component.html",
  styleUrl: "./edit-purchase-return.component.scss",
  providers: [MessageService],
})
export class EditPurchaseReturnComponent {
  editPurchaseReturnForm!: FormGroup;
  public routes = routes;
  unitListData: any;
  subCategoryList = [];
  addTaxTotal: any;
  getSupplierShow: any;
  PurchaseReturnDataById: any;
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
  blockDataWithLotId: any;
  purchaseSlabData: any;
  SlabAddValue: any;
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
  unselectedLots: any = [];
  totalValue: any;
  getpurchaseTotalAmount: any;
  totalSlab: any;
  slabData: any;
  purchaseReturnId: any;
  maxDate = new Date();
  unselectedSlab: any;
  patchPurchaseID: any;

  constructor(
    private taxService: TaxesService,
    private fb: FormBuilder,
    private unitService: UnitsService,
    private router: Router,
    private PurchaseReturnService: PurchaseReturnService,
    private Service: SuppliersdataService,
    private CategoriesService: CategoriesService,
    private PaymentOutService: PaymentOutService,
    private service: SlabsService,
    private messageService: MessageService,
    private subCategoriesService: SubCategoriesService,
    private activeRoute: ActivatedRoute
  ) {
    this.editPurchaseReturnForm = this.fb.group({
      purchaseReturnInvoiceNumber: [""],
      purchaseReturnSupplier: [""],
      purchaseReturnDate: [""],
      purchaseReturnOrderStatus: [""],
      purchaseReturnTermsAndCondition: [""],
      purchaseReturnNotes: [""],
      purchaseReturnTotalAmount: [""],
      purchaseGrossTotal: [""],
      otherCharges: [""],
      purchaseLot: [""],
      purchaseSlab: [[]],
    });
    this.purchaseReturnId = this.activeRoute.snapshot.params["id"];
  }
  onSuppliersSelect(SuppliersId: any) {
    this.GridDataForLot = [];
    this.GridDataForSlab = [];
    this.purchaseSlabData = [];
    this.selectedLots = [];
    this.PaymentOutService.getPurchaseBySupplierId(SuppliersId).subscribe(
      (resp: any) => {
        if (resp.status == "error") {
          this.messageService.add({ severity: "error", detail: resp.message });
        }
        console.log(resp);
        if (resp && resp.data && Array.isArray(resp.data)) {
          this.purchaseDataById = resp.data;
          console.log(this.purchaseDataById);
            this.onInvoiceNumber(this.patchPurchaseID)
          this.slabData = this.purchaseDataById.filter(
            (slab) => slab.purchaseType == "slab"
          );
          console.log(this.slabData);
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
    this.PurchaseReturnDataById.purchaseType = "";
  }
  slabValues(slabValue: any) {
    this.SlabAddValue = 0;
    this.GridDataForLot = [];
    this.GridDataForSlab = slabValue || [];
    console.log('Selected Slab Value:', slabValue);
    console.log('Selected Lots:', this.purchaseSlabData);

    // Ensure the slabValue array is not empty
    if (!Array.isArray(this.GridDataForSlab) || this.GridDataForSlab.length === 0) {
        console.warn('No slab values provided or slabValue is not an array.');
        return;
    }

    // Filter out unselected lots
    this.unselectedSlab = this.purchaseSlabData.filter(lot => !this.GridDataForSlab.includes(lot));
    console.log('Unselected Slabs:', this.unselectedSlab);
    this.unselectedSlab.forEach(element => {
        const totalCosting = parseFloat(element.totalCosting);
        if (!isNaN(totalCosting)) {
            this.SlabAddValue += totalCosting;
        } else {
            console.error('Invalid totalCosting value:', element.totalCosting);
        }
    });
    this.subFromPurchaseTotalAmount(this.SlabAddValue);
    console.log('Slab Add Value:', this.SlabAddValue);
    console.log('Grid Data For Slab:', this.GridDataForSlab);
}


  lotValues(lotValue: any) {
    this.GridDataForSlab = [];
    this.lotAddValue = 0;
    this.GridDataForLot = lotValue || [];
    this.GridDataForLot = Array.isArray(lotValue) ? lotValue : [];
    // console.log(lotValue);
    this.unselectedSlab =
      this.purchaseSlabData.filter((lot) => !lotValue.includes(lot)) || [];
    console.log(this.unselectedSlab);
    this.unselectedSlab.forEach((element) => {
      const totalCosting = parseFloat(element.totalCosting);
      if (!isNaN(totalCosting)) {
        this.lotAddValue += totalCosting;
      } else {
        console.error("Invalid totalCosting value:", element.totalCosting);
      }
    });
    this.subFromPurchaseTotalAmount(this.lotAddValue || 0);
    console.log(this.lotAddValue);
  }
  subFromPurchaseTotalAmount(subTotal: any) {
    this.totalValue = 0;
    console.log(subTotal);
    var purchaseTotalAmount = this.getpurchaseTotalAmount || 0;
    if (this.totalSlab) {
      this.totalValue = (this.totalSlab - subTotal).toFixed(2);
      // this.totalValue = subTotal;
      this.editPurchaseReturnForm.patchValue({
        purchaseGrossTotal: this.totalSlab,
      });
    }
  }
  onInvoiceNumber(purchaseId: any) {
    console.log(purchaseId);
    this.GridDataForLot = [];
    this.GridDataForSlab = [];
    this.purchaseSlabData = [];
    this.selectedLots = [];
    this.totalSlab = 0;
    this.PurchaseReturnService.GetPurchaseDataById(purchaseId).subscribe(
      (resp: any) => {
        this.PurchaseReturnDataById = resp.data;
        console.log(this.PurchaseReturnDataById);
        if (this.PurchaseReturnDataById.purchaseType == "slab") {
          this.purchaseSlabData = [];
          this.PurchaseReturnDataById.slabDetails.forEach((element) => {
            console.log(element);
            this.purchaseSlabData.push({
              slabName: element.slabName,
              _id: element._id,
              totalCosting: element.totalCosting,
              totalSQFT: element.totalSQFT,
              slabNo: element.slabNo,
              sellingPricePerSQFT: element.sellingPricePerSQFT,
            });
            const totalCosting = parseFloat(element.totalCosting);
            if (!isNaN(totalCosting)) {
              this.totalSlab += totalCosting;
            }
            console.log(this.totalSlab);
            this.editPurchaseReturnForm
              .get("purchaseSlab")
              .patchValue(this.purchaseSlabData);
            this.slabValues(this.purchaseSlabData);
            console.log(this.purchaseSlabData);
          });
        }
      }
    );
    this.lotAddValue = 0;
    this.subFromPurchaseTotalAmount(this.lotAddValue);
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
    this.PurchaseReturnService.getPurchaseReturnById(
      this.purchaseReturnId
    ).subscribe((resp: any) => {
      this.unitListData = resp.data;
      this.patchForm(this.unitListData);
    });
  }
  patchForm(data) {
    (this.totalValue = data.purchaseReturnTotalAmount), console.log(data);
    this.patchPurchaseID = data.purchaseInvoiceNumber._id
    this.editPurchaseReturnForm.patchValue({
      purchaseReturnInvoiceNumber: data.purchaseInvoiceNumber,
      purchaseReturnSupplier: data.supplier,
      purchaseReturnDate: data.returnDate,
      purchaseReturnOrderStatus: data.purchaseReturnOrderStatus,
      purchaseReturnTermsAndCondition: data.purchaseReturnTermsAndCondition,
      purchaseReturnNotes: data.purchaseReturnNotes,
      purchaseReturnTotalAmount: data.purchaseReturnTotalAmount,
      purchaseGrossTotal: data.purchaseGrossTotal,
    });
    // this.onInvoiceNumber(data._id)
    this.onSuppliersSelect(data.supplier._id);
  }

  editPurchaseReturnFormSubmit() {
    const purchaseReturnItemDetails = [
      {
        purchaseSlab: this.editPurchaseReturnForm.value.purchaseSlab,
      },
    ];
    console.log(purchaseReturnItemDetails);
    const payload = {
      id: this.purchaseReturnId,
      purchaseReturnInvoiceNumber:
        this.editPurchaseReturnForm.value.purchaseReturnInvoiceNumber,
      purchaseReturnSupplier:
        this.editPurchaseReturnForm.value.purchaseReturnSupplier,
      purchaseReturnDate: this.editPurchaseReturnForm.value.purchaseReturnDate,
      purchaseReturnTermsAndCondition:
        this.editPurchaseReturnForm.value.purchaseReturnTermsAndCondition,
      purchaseReturnNotes:
        this.editPurchaseReturnForm.value.purchaseReturnNotes,
      purchaseReturnTotalAmount: this.totalValue,
      purchaseGrossTotal: this.editPurchaseReturnForm.value.purchaseGrossTotal,
      purchaseReturnItemDetails,
      purchaseReturnOrderStatus:
        this.editPurchaseReturnForm.value.purchaseReturnOrderStatus,
    };
    console.log(payload);
    if (this.editPurchaseReturnForm.valid) {
      console.log("valid form");
      this.PurchaseReturnService.updatePurchaseReturn(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            this.messageService.add({ severity: "success", detail: resp.message });
            setTimeout(() => {
              this.router.navigate(["/purchase-return"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }
    else {
      console.log("invalid form");
    }
  }
}
