import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { MessageService } from "primeng/api";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { CategoriesService } from "../../settings/categories/categories.service";
import { SuppliersdataService } from "../../Suppliers/suppliers.service";
import { SubCategoriesService } from "../../settings/sub-categories/sub-categories.service";
import { NewPurchaseService } from "../new-purchase.service";
import { TaxesService } from "../../settings/taxes/taxes.service";
import { TaxVendorsService } from "../../tax-vendors/tax-vendors.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { validationRegex } from "../../validation";
import { SharedModule } from "src/app/shared/shared.module";
import { EditLotComponent } from "../../Product/lot/edit-lot/edit-lot.component";
import { AddSlabPurchaseComponent } from "../add-slab-purchase/add-slab-purchase.component";
import { DateTransformPipe } from "src/app/core/dateTransform.pipe";
import * as moment from 'moment';


@Component({
  selector: "app-edit-new-purchase",
  standalone: true,
  imports: [SharedModule, EditLotComponent, AddSlabPurchaseComponent],
  templateUrl: "./edit-new-purchase.component.html",
  styleUrl: "./edit-new-purchase.component.scss",
})
export class EditNewPurchaseComponent implements OnInit {
  @ViewChild(EditLotComponent) child!: EditLotComponent;
  @ViewChild(AddSlabPurchaseComponent) slabChild!: AddSlabPurchaseComponent;

  public routes = routes;
  maxDate = new Date();
  lotsNoArray = [
    { name: "Lot", _id: "lot" },
    { name: "Slab", _id: "slab" },
  ];
  finishes = [
    { name: "Polished" },
    { name: "Unpolished" },
    { name: "Semi polished" },
  ];
  currentUrl: string;
  editNewPurchaseForm!: FormGroup;
  invoiceRegex = /^(?=[^\s])([a-zA-Z\d\/\-_ ]{1,30})$/;
  shortNameRegex = /^[^\s.-][a-zA-Z0-9_.\s-]{2,50}$/;
  descriptionRegex = /^.{3,500}$/s;
  purchaseId: "";
  taxVendorList: any = [];
  wareHousedata: any = [];
  wareHousedataListsEditArray: any = [];
  getSupplierShow: any;
  SupplierLists: any = [];
  taxesListData: any = [];
  orderTaxList: any = [];
  categoryList: any = [];
  CategoryListsEditArray: any = [];
  subCategoryList: any = [];
  SubCategoryListsEditArray: any = [];
  subCategorListByCategory: any = [];
  lotTypeValue: any;
  ItemDetails: any = {};
  LotPayload: any;
  previousSlabValues: any = {};
  returnUrl: string;
  apiResponseData: any;
  SlabItemDetails: any = {};
  slabdtls: any;
  constructor(
    private activeRoute: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private router: Router,
    private fb: FormBuilder,
    private WarehouseService: WarehouseService,
    private categoriesService: CategoriesService,
    private SuppliersdataService: SuppliersdataService,
    private subCategoriesService: SubCategoriesService,
    private NewPurchaseService: NewPurchaseService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private taxService: TaxesService,
    private taxVendorsService: TaxVendorsService
  ) {
    this.editNewPurchaseForm = this.fb.group({
      // invoiceNumber: ["", [Validators.pattern(this.invoiceRegex)]],
      // purchaseDate: ["", Validators.required],
      // supplier: ["", [Validators.required]],
      // paidToSupplierPurchaseCost: [
      //   "",
      //   [Validators.min(0), Validators.max(9999999), Validators.required],
      // ],
      // purchaseType: ["", [Validators.required]],

      // purchaseNotes: [
      //   "",
      //   [Validators.pattern(validationRegex.address3To500Regex)],
      // ],
      // _id: [""],
      productId: [""],
      // slabNo: [
      //   "",
      //   [Validators.required, Validators.pattern(this.invoiceRegex)],
      // ],
      // slabName: [
      //   "",
      //   [Validators.required, Validators.pattern(this.invoiceRegex)],
      // ],
      // warehouseDetails: ["", [Validators.required]],
      // categoryDetail: ["", [Validators.required]],
      // subCategoryDetail: ["", [Validators.required]],
      // totalSQFT: [
      //   "",
      //   [Validators.required, Validators.min(1), Validators.max(100000)],
      // ],
      // width: ["", [Validators.min(1), Validators.max(100000)]],
      // length: ["", [Validators.min(1), Validators.max(100000)]],
      // thickness: ["", [Validators.min(1), Validators.max(1000)]],
      // finishes: ["", [Validators.required]],
      // sellingPricePerSQFT: [
      //   "",
      //   [Validators.min(1), Validators.max(100000)],
      // ],
      // transportationCharges: ["", [Validators.min(1), Validators.max(100000)]],
      // otherCharges: ["", [Validators.min(1), Validators.max(100000)]],
      // totalCosting: [""],
      // costPerSQFT: [""],
      // sqftPerPiece: [""],
      // noOfPieces: [
      //   "",
      //   [Validators.required, Validators.min(1), Validators.max(100000)],
      // ],
      // purchaseDiscount: ["", [Validators.min(0)]],
      // taxableAmount: ["", [Validators.min(0), Validators.max(9999999)]],
      // purchaseItemTax: [""],
      // nonTaxable: ["", [Validators.min(0), Validators.max(9999999)]],
      // taxable: [""],
      // taxVendor: [""],
      // taxVendorAmount: [""],
      // vendorTaxApplied: ["", [Validators.min(1), Validators.max(100)]],
      // taxApplied: [""],
      // isTaxVendor: [false],
      paidToSupplierPurchaseCost: [""],
      warehouseDetails: [""],
      totalCosting: [""],
      purchaseTotalAmount: [""],
      invoiceNumber: ["", [Validators.pattern(this.invoiceRegex)]],
      purchaseDate: ["", Validators.required],
      supplier: ["", [Validators.required]],
      purchaseType: ["", [Validators.required]],
      purchaseNotes: [
        "",
        [Validators.pattern(validationRegex.address3To500Regex)],
      ],
      purchaseDiscount: ["", [Validators.min(0)]],
      taxableAmount: ["", [Validators.min(0), Validators.max(9999999)]],
      purchaseItemTax: [""],
      nonTaxable: ["", [Validators.min(0), Validators.max(9999999)]],
      taxable: [""],
      taxVendor: [""],
      taxVendorAmount: [""],
      vendorTaxApplied: ["", [Validators.min(1), Validators.max(100)]],
      taxApplied: [""],
      transportationCharges: [""],
      otherCharges: [""],
      vehicleNo: [""],
      totalSQFT: [""],
      isTaxVendor: [false],
    });
    this.purchaseId = this.activeRoute.snapshot.params["id"];
  }
  ngOnInit() {
    // this.slabChild?.slabAddFormSubmit();
    this.returnUrl = this.localStorageService.getItem("returnUrl");
    console.log(this.returnUrl);

    // const today = new Date();
    // const formattedDate = today.toLocaleDateString("en-US"); // Format to MM/DD/YYYY
    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
      console.log(this.subCategoryList);
      this.SubCategoryListsEditArray = [];
      this.subCategoryList?.forEach((element: any) => {
        this.SubCategoryListsEditArray.push({
          name: element?.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
    });
    this.WarehouseService.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data;
      this.wareHousedataListsEditArray = [];
      this.wareHousedata.forEach((element: any) => {
        this.wareHousedataListsEditArray.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
    });
    this.NewPurchaseService.getPurchaseById(this.purchaseId).subscribe(
      (resp: any) => {
        console.log("data", resp.data);
         let convertedDate =  resp.data.purchaseDate ? moment(resp.data.purchaseDate, "MM/DD/YYYY").format("DD/MM/YYYY") : null;
        this.editNewPurchaseForm.patchValue({
          invoiceNumber: resp.data.purchaseInvoiceNumber,
          purchaseDate: convertedDate,
          supplier: resp.data.supplier,
          _id: resp.data._id,
          purchaseType: resp.data.purchaseType,
          productId: resp.data.productId,
          taxable: resp.data.taxable,
          nonTaxable: resp.data.nonTaxable,
          purchaseItemTax: resp.data.purchaseItemTax,
          isTaxVendor: resp.data.taxVendor ? true : false,
          taxVendor: {
            _id: resp.data?.taxVendor?._id,
            companyName: resp.data?.taxVendor?.companyName,
          },
          // taxVendorAmount: resp.data?.taxVendor?.taxVendorAmount,
          taxVendorAmount: resp.data?.taxVendor?.taxVendorCutAmount,
          vendorTaxApplied: resp.data?.taxVendor?.vendorTaxApplied,
          purchaseNotes: resp.data?.purchaseNotes,
        });

        if (resp.data.purchaseType === "lot") {
          this.NewPurchaseService.setFormData("stepFirstLotData", resp.data);
          this.lotTypeValue = resp.data.purchaseType;
        } else {
          const payload = {
            warehouseDetails: resp.data.warehouseDetails,
            vehicleNo: resp.data.vehicleNo,
            transportationCharge: Number(resp.data.transportationCharges),
            royaltyCharge: Number(resp.data.otherCharges),
            slabDetails: resp?.data?.slabDetails,
            slabTotalCost: Number(resp?.data?.totalCosting),
            totalCost: Number(resp.data?.purchaseTotalAmount),
            paidToSupplierSlabCost: Number(resp.data.totalCosting),
            purchaseDiscount: Number(resp.data.purchaseDiscount),
            nonTaxableAmount: Number(resp.data.nonTaxable),
            taxableAmount: Number(resp.data.taxableAmount),
            taxable: Number(resp.data.taxable),
            purchaseItemTax: resp.data.purchaseItemTax,
            taxApplied: Number(resp.data.taxApplied),
            totalSQFT: Number(resp.data.totalSQFT),
          };
          this.NewPurchaseService.setFormData("stepFirstSlabData", payload);
        }

        if (resp.data.purchaseType === "slab") {
          this.lotTypeValue = resp.data.purchaseType;
          this.slabdtls = resp.data.slabDetails || [];
          console.log("resp.data<<<", this.slabdtls);
          if (resp.data.slabDetails.length > 0) {
            this.findSubCategory(resp.data.slabDetails[0]?.categoryDetail);
            this.previousSlabValues = {
              slabNo: resp.data.slabDetails[0]?.slabNo,
              slabName: resp.data.slabDetails[0]?.slabName,
              warehouseDetails: resp.data.slabDetails[0]?.warehouseDetails,
              categoryDetail: resp.data.slabDetails[0]?.categoryDetail,
              subCategoryDetail: resp.data.slabDetails[0]?.subCategoryDetail,
              finishes: resp.data.slabDetails[0]?.finishes,
              totalSQFT: resp.data.slabDetails[0]?.totalSQFT,
              noOfPieces: resp.data.slabDetails[0]?.noOfPieces,
              sellingPricePerSQFT:
                resp.data.slabDetails[0]?.sellingPricePerSQFT,
              transportationCharges:
                resp.data.slabDetails[0]?.transportationCharges,
              otherCharges: resp.data.slabDetails[0]?.otherCharges,
              totalCosting: resp.data.slabDetails[0]?.totalCosting,
              thickness: resp.data.slabDetails[0]?.thickness,
              length: resp.data.slabDetails[0]?.length,
              width: resp.data.slabDetails[0]?.width,
              costPerSQFT: resp.data.slabDetails[0]?.costPerSQFT,
              sqftPerPiece: resp.data.slabDetails[0]?.sqftPerPiece || 0,
              paidToSupplierPurchaseCost:
                resp.data.taxable + resp.data.nonTaxable,
            };
          }

          // }
          this.lotType(resp.data.purchaseType);
        }
      }
    );

    this.taxVendorsService.getTaxVendorList().subscribe((resp: any) => {
      if (resp.data) {
        this.taxVendorList = resp.data.map((element) => ({
          name: `${element.companyName} / ${element.city},`,
          _id: {
            _id: element._id,
            companyName: element.companyName,
          },
        }));
      }
    });

    this.SuppliersdataService.GetSupplierData().subscribe((data: any) => {
      this.getSupplierShow = data;
      this.SupplierLists = [];
      this.getSupplierShow.forEach((element: any) => {
        this.SupplierLists.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
            taxNo: element.taxNo,
            billingAddress: element.billingAddress,
          },
        });
      });
    });
    this.taxService.getAllTaxList().subscribe((resp: any) => {
      this.taxesListData = resp.data;
      this.orderTaxList = [];
      this.taxesListData.forEach((element: any) => {
        this.orderTaxList.push({
          orderTaxName: element.name + " (" + element.taxRate + "%" + ")",
          orderNamevalue: element,
        });
      });
    });
    this.categoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
      this.CategoryListsEditArray = [];
      this.categoryList.forEach((element: any) => {
        this.CategoryListsEditArray.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
    });
    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
      this.SubCategoryListsEditArray = [];
      this.subCategoryList?.forEach((element: any) => {
        this.SubCategoryListsEditArray.push({
          name: element?.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
    });
  }

  findSubCategory(value: any) {
    console.log("val cate>>", value);
    let SubCategoryData: any = [];
    this.editNewPurchaseForm.get("subCategoryDetail").reset();
    SubCategoryData = this.subCategoryList.filter(
      (e) => e.categoryId._id == value._id
    );
    this.subCategorListByCategory = SubCategoryData.map((e) => ({
      name: e.name,
      _id: {
        _id: e._id,
        name: e.name,
      },
    }));
  }

  backStep(prevCallback: any) {
    prevCallback.emit();
    this.editNewPurchaseForm.get("taxVendor").clearValidators();
    this.editNewPurchaseForm.get("taxVendorAmount").clearValidators();
    this.editNewPurchaseForm.get("vendorTaxApplied").clearValidators();
    this.editNewPurchaseForm.get("taxVendor").updateValueAndValidity();
    this.editNewPurchaseForm.get("taxVendorAmount").updateValueAndValidity();
    this.editNewPurchaseForm.get("vendorTaxApplied").updateValueAndValidity();
  }
  handleSaveClick() {
    this.slabChild?.slabAddFormSubmit();

    let data = this.NewPurchaseService.getFormData("stepFirstSlabData");
    console.log("this data>>>>>>>>>>", data);
    this.slabdtls = data?.slabDetails;
    // console.log('Save button clicked in child!');
  }
  nextStep(nextCallback: any, page: string) {
    if (page == "first") {
      if (this.lotTypeValue == "lot") {
        this.child.LotEditFormSubmit();
        this.ItemDetails =
          this.NewPurchaseService.getFormData("stepFirstLotData");

        // Save the ItemDetails in local storage
        localStorage.setItem("lotFormData", JSON.stringify(this.ItemDetails));
        const payload = { ...this.ItemDetails };
        this.LotPayload = payload;

        this.editNewPurchaseForm.patchValue({
          paidToSupplierPurchaseCost: this.ItemDetails?.paidToSupplierLotCost,
          taxableAmount: this.ItemDetails?.taxableAmount,
          nonTaxable: this.ItemDetails?.nonTaxableAmount,
          taxable: this.ItemDetails?.taxable,
          purchaseItemTax: this.ItemDetails?.purchaseItemTax,
          taxApplied: this.ItemDetails?.taxApplied,
          purchaseDiscount: this.ItemDetails?.purchaseDiscount,
          _id: this.purchaseId,
        });
      }
      if (this.lotTypeValue == "slab") {
        console.log("this.lotTypeValue", this.lotTypeValue);

        this.slabChild?.slabAddFormSubmit();
        this.SlabItemDetails =
          this.NewPurchaseService.getFormData("stepFirstSlabData");
        console.log("this.this.SlabItemDetails", this.SlabItemDetails);
        this.editNewPurchaseForm.patchValue({
          paidToSupplierPurchaseCost:
            this.SlabItemDetails?.paidToSupplierSlabCost,
          totalCosting: this.SlabItemDetails?.slabTotalCost,
          purchaseTotalAmount: this.SlabItemDetails?.totalCost,
          taxableAmount: this.SlabItemDetails?.taxableAmount,
          nonTaxable: this.SlabItemDetails?.nonTaxableAmount,
          taxable: this.SlabItemDetails?.taxable, // tax amount + tax applied amount
          purchaseItemTax: this.SlabItemDetails?.purchaseItemTax,
          taxApplied: this.SlabItemDetails?.taxApplied,
          purchaseCost: this.SlabItemDetails?.purchaseCost,
          purchaseDiscount: this.SlabItemDetails?.purchaseDiscount,
          otherCharges: this.SlabItemDetails?.royaltyCharge,
          transportationCharges: this.SlabItemDetails?.transportationCharge,
          warehouseDetails: this.SlabItemDetails?.warehouseDetails,
          vehicleNo: this.SlabItemDetails?.vehicleNo,
          totalSQFT: this.SlabItemDetails?.totalSQFT,
        });
      }
    }
    nextCallback.emit();
    this.changeVaidationForTaxVendor();
    if (this.editNewPurchaseForm.get("isTaxVendor").value) {
      this.calculateTaxVendorAmount();
    }
  }

  lotType(value: any) {
    this.lotTypeValue = value.toLowerCase();
    // if (this.lotTypeValue == "lot") {
    //   this.previousSlabValues = {
    //     slabNo: this.editNewPurchaseForm.value.slabNo,
    //     slabName: this.editNewPurchaseForm.value.slabName,
    //     warehouseDetails: this.editNewPurchaseForm.value.warehouseDetails,
    //     categoryDetail: this.editNewPurchaseForm.value.categoryDetail,
    //     subCategoryDetail: this.editNewPurchaseForm.value.subCategoryDetail,
    //     finishes: this.editNewPurchaseForm.value.finishes,
    //     totalSQFT: this.editNewPurchaseForm.value.totalSQFT,
    //     noOfPieces: this.editNewPurchaseForm.value.noOfPieces,
    //     sellingPricePerSQFT: this.editNewPurchaseForm.value.sellingPricePerSQFT,
    //     transportationCharges:
    //       this.editNewPurchaseForm.value.transportationCharges,
    //     otherCharges: this.editNewPurchaseForm.value.otherCharges,
    //     totalCosting: this.editNewPurchaseForm.value.totalCosting,
    //     thickness: this.editNewPurchaseForm.value.thickness,
    //     length: this.editNewPurchaseForm.value.length,
    //     width: this.editNewPurchaseForm.value.width,
    //     costPerSQFT: this.editNewPurchaseForm.value.costPerSQFT,
    //     paidToSupplierPurchaseCost:
    //       this.editNewPurchaseForm.value.paidToSupplierPurchaseCost,
    //   };

    //   this.editNewPurchaseForm.patchValue({
    //     slabNo: "slabNo",
    //     slabName: "slabName",
    //     warehouseDetails: {
    //       _id: "123",
    //       name: "test",
    //     },
    //     categoryDetail: {
    //       _id: "123",
    //       name: "sdj",
    //     },
    //     subCategoryDetail: {
    //       _id: "123",
    //       name: "sdj",
    //     },
    //     finishes: {
    //       name: "Unpolished",
    //     },
    //     sellingPricePerSQFT: 2,
    //     totalSQFT: 2,
    //     noOfPieces: 2,
    //     costPerSQFT: 2,
    //     paidToSupplierPurchaseCost: 2,
    //   });
    // } else {
    //   this.editNewPurchaseForm.patchValue({
    //     slabNo: this.previousSlabValues.slabNo,
    //     slabName: this.previousSlabValues.slabName,
    //     warehouseDetails: this.previousSlabValues.warehouseDetails,
    //     categoryDetail: this.previousSlabValues.categoryDetail,
    //     subCategoryDetail: this.previousSlabValues.subCategoryDetail,
    //     finishes: this.previousSlabValues.finishes,
    //     totalSQFT: this.previousSlabValues.totalSQFT,
    //     noOfPieces: this.previousSlabValues.noOfPieces,
    //     sellingPricePerSQFT: this.previousSlabValues.sellingPricePerSQFT,
    //     transportationCharges: this.previousSlabValues.transportationCharges,
    //     otherCharges: this.previousSlabValues.otherCharges,
    //     totalCosting: this.previousSlabValues.totalCosting,
    //     thickness: this.previousSlabValues.thickness,
    //     length: this.previousSlabValues.length,
    //     width: this.previousSlabValues.width,
    //     costPerSQFT: this.previousSlabValues.costPerSQFT,
    //     paidToSupplierPurchaseCost:
    //       this.previousSlabValues.paidToSupplierPurchaseCost,
    //   });
    // }
    this.calculateTotalAmount();
  }
  calculateTotalAmount() {
    // if (this.lotTypeValue == "slab") {
    //   let totalTaxAmount: number = 0;
    //   let paidToSupplierPurchaseCost =
    //     this.editNewPurchaseForm.get("paidToSupplierPurchaseCost")?.value || 0;
    //   let transportationCharges =
    //     this.editNewPurchaseForm.get("transportationCharges")?.value || 0;
    //   let otherCharges =
    //     this.editNewPurchaseForm.get("otherCharges")?.value || 0;
    //   let totalSQFT = this.editNewPurchaseForm.get("totalSQFT")?.value || 0;
    //   let costPerSQFT = this.editNewPurchaseForm.get("costPerSQFT")?.value || 0;
    //   let purchaseDiscount =
    //     this.editNewPurchaseForm.get("purchaseDiscount")?.value || 0;
    //   let noOfPieces = this.editNewPurchaseForm.get("noOfPieces")?.value || 1; // Default to 1 to avoid division by zero
    //   let taxableAmount =
    //     this.editNewPurchaseForm.get("taxableAmount")?.value || 0;
    //   let nonTaxable = this.editNewPurchaseForm.get("nonTaxable")?.value || 0;
    //   let purchaseItemTax =
    //     this.editNewPurchaseForm.get("purchaseItemTax")?.value;
    //   let sqftPerPiece = totalSQFT / noOfPieces;
    //   let taxable;
    //   if (Array.isArray(purchaseItemTax)) {
    //     purchaseItemTax.forEach((selectedTax: any) => {
    //       totalTaxAmount += (taxableAmount * selectedTax.taxRate) / 100;
    //     });
    //   } else if (purchaseItemTax) {
    //     totalTaxAmount = (taxableAmount * purchaseItemTax) / 100;
    //   }
    //   if (purchaseDiscount > 0) {
    //     if (!nonTaxable) {
    //       taxableAmount -= purchaseDiscount;
    //     } else {
    //       nonTaxable -= purchaseDiscount;
    //       this.editNewPurchaseForm.get("nonTaxable").patchValue(nonTaxable);
    //     }
    //   }
    //   taxable = taxableAmount + totalTaxAmount;
    //   paidToSupplierPurchaseCost = taxable + nonTaxable;
    //   const total: number =
    //     transportationCharges +
    //     otherCharges +
    //     paidToSupplierPurchaseCost +
    //     purchaseDiscount;
    //   if (totalSQFT !== 0) {
    //     costPerSQFT = total / totalSQFT;
    //   }
    //   if (total) {
    //     this.editNewPurchaseForm.patchValue({
    //       sellingPricePerSQFT: Number(costPerSQFT).toFixed(2),
    //       costPerSQFT: Number(costPerSQFT).toFixed(2),
    //       totalCosting: total,
    //       sqftPerPiece: sqftPerPiece,
    //       paidToSupplierPurchaseCost: paidToSupplierPurchaseCost,
    //       taxable: taxable,
    //       taxableAmount: taxableAmount,
    //       taxApplied: totalTaxAmount,
    //       nonTaxable: nonTaxable,
    //     });
    //   }
    //   if (this.editNewPurchaseForm.get("isTaxVendor").value) {
    //     this.calculateTaxVendorAmount();
    //   }
    // }
  }

  calculateDiscount() {
    // if (this.lotTypeValue === "slab") {
    //   let purchaseDiscount =
    //     this.editNewPurchaseForm.get("purchaseDiscount")?.value || 0;
    //   let taxableAmount =
    //     this.editNewPurchaseForm.get("taxableAmount")?.value || 0;
    //   let nonTaxable = this.editNewPurchaseForm.get("nonTaxable")?.value || 0;
    //   let totalTaxAmount = 0;
    //   if (purchaseDiscount > 0) {
    //     if (!nonTaxable) {
    //       taxableAmount -= purchaseDiscount;
    //       this.editNewPurchaseForm.get("taxableAmount").patchValue(nonTaxable);
    //     } else {
    //       nonTaxable -= purchaseDiscount;
    //       this.editNewPurchaseForm.get("nonTaxable").patchValue(nonTaxable);
    //     }
    //   }
    // }
  }

  calculateTaxVendorAmount() {
    let totalTaxAmount: number =
      this.editNewPurchaseForm.get("taxableAmount").value;
    let vendorTaxApplied =
      this.editNewPurchaseForm.get("vendorTaxApplied").value;
    let taxVendorAmount = (totalTaxAmount * vendorTaxApplied) / 100;
    this.editNewPurchaseForm.patchValue({
      taxVendorAmount: taxVendorAmount.toFixed(2),
    });
  }

  changeVaidationForTaxVendor() {
    let isTaxVendor = this.editNewPurchaseForm.get("isTaxVendor").value;
    this.editNewPurchaseForm.get("taxVendor").clearValidators();
    this.editNewPurchaseForm.get("taxVendorAmount").clearValidators();
    this.editNewPurchaseForm.get("vendorTaxApplied").clearValidators();
    if (isTaxVendor) {
      this.editNewPurchaseForm
        .get("taxVendor")
        .setValidators([Validators.required]);
      this.editNewPurchaseForm
        .get("taxVendorAmount")
        .setValidators([Validators.required]);
      this.editNewPurchaseForm
        .get("vendorTaxApplied")
        .setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(100),
        ]);
    }
    this.editNewPurchaseForm.get("taxVendor").updateValueAndValidity();
    this.editNewPurchaseForm.get("taxVendorAmount").updateValueAndValidity();
    this.editNewPurchaseForm.get("vendorTaxApplied").updateValueAndValidity();

    if (isTaxVendor) {
      this.editNewPurchaseForm
        .get("paidToSupplierPurchaseCost")
        .patchValue(this.editNewPurchaseForm.get("nonTaxable").value);
    } else {
      this.lotTypeValue === "lot"
        ? this.editNewPurchaseForm
            .get("paidToSupplierPurchaseCost")
            .patchValue(this.ItemDetails.paidToSupplierLotCost)
        : this.editNewPurchaseForm
            .get("paidToSupplierPurchaseCost")
            .patchValue(
              (
                Number(Number(this.editNewPurchaseForm.get("nonTaxable").value || 0).toFixed(2)) +
                Number(Number(this.editNewPurchaseForm.get("taxable").value || 0).toFixed(2))
              )
            );
    }
  }

  // Optional: clear local storage if needed when the form is completed
  clearLocalStorage() {
    localStorage.removeItem("lotFormData");
  }
  editNewPurchaseFormSubmit() {
    const formData = this.editNewPurchaseForm.value;
    console.log(formData);

    let payload = {};
    this.NewPurchaseService.clearFormData();

    let taxVenoderObj = {
      _id: formData.taxVendor?._id,
      companyName: formData.taxVendor?.companyName,
      taxVendorAmount: Number(formData.taxVendorAmount),
      vendorTaxApplied: Number(formData.vendorTaxApplied),
    };
    if (this.editNewPurchaseForm.value.purchaseType == "lot") {
      if (formData && formData.paidToSupplierPurchaseCost !== undefined) {
        this.ItemDetails.purchaseCost = Number(
          formData.paidToSupplierPurchaseCost
        );
        this.ItemDetails.date = formData.purchaseDate;
        this.ItemDetails.notes = formData.purchaseNotes;
        this.ItemDetails._id = formData.productId;
      } else {
        console.error("formData.paidToSupplierPurchaseCost is not defined");
      }
      let convertedDate = moment(formData.purchaseDate, "DD/MM/YYYY").format("MM/DD/YYYY");
      payload = {
        purchaseInvoiceNumber: formData.invoiceNumber,
        supplier: formData.supplier,
        purchaseDate: convertedDate,
        purchaseType: "lot",
        purchaseNotes: formData.purchaseNotes,
        purchaseCost: Number(formData.paidToSupplierPurchaseCost).toFixed(2),
        purchaseTotalAmount: Number(this.ItemDetails.lotTotalCost).toFixed(2),
        lotDetail: this.ItemDetails,
        nonTaxable: Number(formData.nonTaxable),
        taxableAmount: Number(formData.taxableAmount),
        taxable: formData.taxable,
        warehouseDetails: this.ItemDetails?.warehouseDetails,
        transportationCharges: this.ItemDetails?.transportationCharge,
        otherCharges: this.ItemDetails?.royaltyCharge,
        purchaseItemTax: formData.purchaseItemTax,
        taxVendor: this.editNewPurchaseForm.get("isTaxVendor").value
          ? taxVenoderObj
          : null,
        taxApplied: formData.taxApplied,
        productId: formData.productId,
        _id: this.purchaseId,
        totalTransportationCharges:
          this.ItemDetails?.totalTransportationCharges,
      };
    } else {
      let convertedDate = moment(formData.purchaseDate, "DD/MM/YYYY").format("MM/DD/YYYY");
      payload = {
        purchaseInvoiceNumber: formData.invoiceNumber,
        supplier: formData.supplier,
        purchaseDate: convertedDate,
        purchaseType: "slab",
        purchaseNotes: formData.purchaseNotes,
        purchaseCost: Number(formData.paidToSupplierPurchaseCost).toFixed(2),
        slabDetail: this.SlabItemDetails.slabDetails,
        purchaseTotalAmount: Number(formData.purchaseTotalAmount),
        totalCosting: Number(formData.totalCosting),
        purchaseDiscount: Number(formData.purchaseDiscount),
        nonTaxable: Number(formData.nonTaxable),
        taxableAmount: Number(formData.taxableAmount),
        taxable: Number(formData.taxable)?.toFixed(2),
        purchaseItemTax: formData.purchaseItemTax,
        taxVendor: this.editNewPurchaseForm.get("isTaxVendor").value
          ? taxVenoderObj
          : null,
        // taxApplied: formData.taxApplied,
        // otherCharges: formData?.otherCharges,
        // transportationCharges: formData?.transportationCharges,

        taxApplied:  Number(formData.taxApplied || 0)?.toFixed(2),
        otherCharges:  Number(formData.otherCharges || 0)?.toFixed(2),
        transportationCharges:  Number(formData.transportationCharges || 0)?.toFixed(2),

        warehouseDetails: formData?.warehouseDetails,
        vehicleNo: formData?.vehicleNo,
        totalSQFT: formData?.totalSQFT,
        _id: this.purchaseId,
      };
    }
    if (this.editNewPurchaseForm.valid) {
      console.log(payload);
      this.NewPurchaseService.UpdatePurchaseData(payload).subscribe(
        (resp: any) => {
          if (resp) {
            if (resp.status === "success") {
              this.clearLocalStorage();
              this.NewPurchaseService.clearFormData();
              const message = "Purchase has been Updated added";
              this.messageService.add({ severity: "success", detail: message });
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
      console.log("form is not valid");
    }
  }
}
