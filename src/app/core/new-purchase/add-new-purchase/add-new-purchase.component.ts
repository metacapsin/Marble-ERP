import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  viewChild,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { FormBuilder, FormGroup, NgForm } from "@angular/forms";
import { AddLotComponent } from "../../Product/lot/add-lot/add-lot.component";
import { AddSlabsComponent } from "../../Product/slabs/add-slabs/add-slabs.component";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { SubCategoriesService } from "../../settings/sub-categories/sub-categories.service";
import { CategoriesService } from "../../settings/categories/categories.service";
import { SuppliersdataService } from "../../Suppliers/suppliers.service";
import { NewPurchaseService } from "../new-purchase.service";
import { Validators } from "@angular/forms";
import { MessageService } from "primeng/api";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
import { validationRegex } from "../../validation";
import { TaxesService } from "../../settings/taxes/taxes.service";
import { TaxVendorsService } from "../../tax-vendors/tax-vendors.service";
import { blockProcessorService } from "../../block-processor/block-processor.service";
import { AddSlabPurchaseComponent } from "../add-slab-purchase/add-slab-purchase.component";
import * as moment from 'moment';


@Component({
  selector: "app-add-new-purchase",
  standalone: true,
  imports: [
    SharedModule,
    AddLotComponent,
    AddSlabsComponent,
    AddSlabPurchaseComponent,
  ],
  templateUrl: "./add-new-purchase.component.html",
  styleUrl: "./add-new-purchase.component.scss",
  providers: [MessageService],
})
export class AddNewPurchaseComponent implements OnInit, OnDestroy {
  @ViewChild(AddLotComponent) child!: AddLotComponent;
  @ViewChild(AddSlabPurchaseComponent) slabChild!: AddSlabPurchaseComponent;
  public routes = routes;
  maxDate = new Date();
  SupplierLists: any[];
  lotsNoArray = [
    { name: "Lot", _id: "Lot" },
    { name: "Slab", _id: "Slab" },
  ];
  addNewPurchaseForm!: FormGroup;
  lotTypeValue: any;
  wareHousedataListsEditArray: any[];
  wareHousedata: any;
  SubCategoryListsEditArray: any;
  subCategoryList: any;
  CategoryListsEditArray: any;
  blockNo: string;
  height: number;
  width: number;
  length: number;
  totalArea: number;
  totalBlocksArea: number = 0;
  blocksDetails = [];
  addvisible: boolean = false;
  weightPerBlock: number;
  taxAmountCosting: number;
  rawCosting: number;
  transportationCosting: number;
  royaltyCosting: number;
  totalCosting: number;
  isProcessed: boolean = false;
  blockProcessorList: any = [];

  categoryList: any;
  finishes = [
    { name: "Polished" },
    { name: "Unpolished" },
    { name: "Semi polished" },
  ];
  getSupplierShow: any;
  ItemDetails: any = {};
  SlabItemDetails: any = {};
  invoiceRegex = /^(?=[^\s])([a-zA-Z\d\/\-_ ]{1,30})$/;
  shortNameRegex = /^[^\s.-][a-zA-Z0-9_.\s-]{2,50}$/;
  descriptionRegex = /^.{3,500}$/s;
  previousSlabValues: any = {};
  returnUrl: any;
  supplier: any;
  taxVendorList: any = [];
  subCategorListByCategory: any = [];
  taxesListData: any;
  orderTaxList: any;
  LotPayload: any;
  blockProcessor: any;
  slabDetails: any;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private ServiceblockProcessor: blockProcessorService,
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
    this.addNewPurchaseForm = this.fb.group({
      paidToSupplierPurchaseCost: [""],

      // slabNo: [
      //   "",
      //   [Validators.required, Validators.pattern(this.invoiceRegex)],
      // ],
      // slabName: [
      //   "",
      //   [Validators.required, Validators.pattern(this.invoiceRegex)],
      // ],
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
      // sellingPricePerSQFT: ["", [Validators.min(1), Validators.max(100000)]],
      // transportationCharges: ["", [Validators.min(1), Validators.max(100000)]],
      // otherCharges: ["", [Validators.min(1), Validators.max(100000)]],
      // costPerSQFT: [""],
      // noOfPieces: [
      //   "",
      //   [Validators.required, Validators.min(1), Validators.max(100000)],
      // ],
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
  }

  handleBeforeUnload = (): void => {
    if (localStorage.getItem("slabAddForm")) {
      localStorage.removeItem("slabAddForm");
    }
  };
  ngOnInit() {
    window.addEventListener("beforeunload", this.handleBeforeUnload);
    this.NewPurchaseService.clearFormData();
    this.supplier = this.localStorageService.getItem("supplier");
    this.returnUrl = this.localStorageService.getItem("returnUrl");
    if (this.supplier) {
      this.addNewPurchaseForm.patchValue({
        supplier: this.supplier,
      });
    }
    const today = new Date();
    const formattedDate =  moment(today).format("DD/MM/YYYY"); // Format to MM/DD/YYYY

    this.addNewPurchaseForm.patchValue({
      purchaseDate: formattedDate,
    });

    this.taxVendorsService.getTaxVendorList().subscribe((resp: any) => {
      if (resp.data) {
        this.taxVendorList = resp.data.map((element) => ({
          name: `${element.companyName} / ${element.city},`,
          _id: element,
        }));
      }
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
      this.subCategoryList.forEach((element: any) => {
        this.SubCategoryListsEditArray.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
      });
    });
  }

  findSubCategory(value: any) {
    let SubCategoryData: any = [];
    this.addNewPurchaseForm.get("subCategoryDetail").reset();
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

  backStep(prevCallback: any, type: string) {
    console.log(this.lotTypeValue, type);
    prevCallback.emit();
    this.addNewPurchaseForm.get("taxVendor").clearValidators();
    this.addNewPurchaseForm.get("taxVendorAmount").clearValidators();
    this.addNewPurchaseForm.get("vendorTaxApplied").clearValidators();
    this.addNewPurchaseForm.get("taxVendor").updateValueAndValidity();
    this.addNewPurchaseForm.get("taxVendorAmount").updateValueAndValidity();
    this.addNewPurchaseForm.get("vendorTaxApplied").updateValueAndValidity();
  }
  nextStep(nextCallback: any, page: string) {
    console.log(this.ItemDetails);
    if (page == "first") {
      if (this.lotTypeValue == "Lot") {
        this.child?.LotAddFormSubmit();
        this.ItemDetails =
          this.NewPurchaseService.getFormData("stepFirstLotData");
        const payload = { ...this.ItemDetails };
        this.LotPayload = payload;
        console.log(this.ItemDetails?.paidToSupplierLotCost);
        this.addNewPurchaseForm.patchValue({
          paidToSupplierPurchaseCost: this.ItemDetails?.paidToSupplierLotCost,
          taxableAmount: this.ItemDetails?.taxableAmount,
          nonTaxable: this.ItemDetails?.nonTaxableAmount,
          taxable: this.ItemDetails?.taxable,
          purchaseItemTax: this.ItemDetails?.purchaseItemTax,
          taxApplied: this.ItemDetails?.taxApplied,
          purchaseDiscount: this.ItemDetails?.purchaseDiscount,
        });
      }
      if (this.lotTypeValue == "Slab") {
        this.slabChild?.slabAddFormSubmit();
        this.SlabItemDetails =
          this.NewPurchaseService.getFormData("stepFirstSlabData");
        console.log("SlabItemDetails", this.SlabItemDetails);

        this.addNewPurchaseForm.patchValue({
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

        console.log(this.addNewPurchaseForm.value);
      }
    }
    nextCallback.emit();
    this.changeVaidationForTaxVendor();
  }

  lotType(value: any) {
    this.lotTypeValue = value;
    console.log("value on select of purchase type", value);
    if (this.lotTypeValue == "Lot") {
      this.child?.LotAddFormSubmit();
      this.ItemDetails =
        this.NewPurchaseService.getFormData("stepFirstLotData");
      const payload = { ...this.ItemDetails };
      this.LotPayload = payload;
      console.log(this.ItemDetails?.paidToSupplierLotCost);
      if (this.ItemDetails) {
        this.addNewPurchaseForm.patchValue({
          paidToSupplierPurchaseCost: this.ItemDetails?.paidToSupplierLotCost,
          taxableAmount: this.ItemDetails?.taxableAmount,
          nonTaxable: this.ItemDetails?.nonTaxableAmount,
          taxable: this.ItemDetails?.taxable,
          purchaseItemTax: this.ItemDetails?.purchaseItemTax,
          taxApplied: this.ItemDetails?.taxApplied,
        });
      }
    } else {
      this.slabChild?.slabAddFormSubmit();
      this.SlabItemDetails =
        this.NewPurchaseService.getFormData("stepFirstSlabData");
      console.log("SlabItemDetails", this.SlabItemDetails);
      if (this.SlabItemDetails) {
        this.addNewPurchaseForm.patchValue({
          paidToSupplierPurchaseCost:
            this.SlabItemDetails?.paidToSupplierSlabCost,
          totalCosting: this.SlabItemDetails?.totalCost,
          taxableAmount: this.SlabItemDetails?.taxableAmount,
          nonTaxable: this.SlabItemDetails?.nonTaxableAmount,
          taxable: this.SlabItemDetails?.taxable, // tax amount + tax applied amount
          purchaseItemTax: this.SlabItemDetails?.purchaseItemTax,
          taxApplied: this.SlabItemDetails?.taxApplied,
          purchaseDiscount: this.SlabItemDetails?.purchaseDiscount,
          otherCharges: this.SlabItemDetails?.royaltyCharge,
          transportationCharges: this.SlabItemDetails?.transportationCharge,
          warehouseDetails: this.SlabItemDetails?.warehouseDetails,
          vehicleNo: this.SlabItemDetails?.vehicleNo,
          totalSQFT: this.SlabItemDetails?.totalSQFT,
        });
      }

      console.log(this.addNewPurchaseForm.value);
    }
    this.calculateTotalAmount();
  }
  calculateTotalAmount() {
    // if (this.lotTypeValue === "Slab") {
    //   let totalTaxAmount: number = 0;
    //   let paidToSupplierPurchaseCost =
    //     this.addNewPurchaseForm.get("paidToSupplierPurchaseCost")?.value || 0;
    //   let transportationCharges =
    //     this.addNewPurchaseForm.get("transportationCharges")?.value || 0;
    //   let otherCharges =
    //     this.addNewPurchaseForm.get("otherCharges")?.value || 0;
    //   let totalSQFT = this.addNewPurchaseForm.get("totalSQFT")?.value || 0;
    //   let costPerSQFT = this.addNewPurchaseForm.get("costPerSQFT")?.value || 0;
    //   let purchaseDiscount =
    //     this.addNewPurchaseForm.get("purchaseDiscount")?.value || 0;
    //   let noOfPieces = this.addNewPurchaseForm.get("noOfPieces")?.value || 1;
    //   let taxableAmount =
    //     this.addNewPurchaseForm.get("taxableAmount")?.value || 0;
    //   let nonTaxable = this.addNewPurchaseForm.get("nonTaxable")?.value || 0;
    //   let purchaseItemTax =
    //     this.addNewPurchaseForm.get("purchaseItemTax")?.value;
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
    //       this.addNewPurchaseForm.get("nonTaxable").patchValue(nonTaxable);
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
    //     this.addNewPurchaseForm.patchValue({
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
    //   if (this.addNewPurchaseForm.get("isTaxVendor").value) {
    //     this.calculateTaxVendorAmount();
    //   }
    // }
  }

  calculateDiscount() {
    // if (this.lotTypeValue === "Slab") {
    //   let purchaseDiscount =
    //     this.addNewPurchaseForm.get("purchaseDiscount")?.value || 0;
    //   let taxableAmount =
    //     this.addNewPurchaseForm.get("taxableAmount")?.value || 0;
    //   let nonTaxable = this.addNewPurchaseForm.get("nonTaxable")?.value || 0;
    //   let totalTaxAmount = 0;
    //   if (purchaseDiscount > 0) {
    //     if (!nonTaxable) {
    //       taxableAmount -= purchaseDiscount;
    //       this.addNewPurchaseForm.get("taxableAmount").patchValue(nonTaxable);
    //     } else {
    //       nonTaxable -= purchaseDiscount;
    //       this.addNewPurchaseForm.get("nonTaxable").patchValue(nonTaxable);
    //     }
    //   }
    // }
  }

  calculateTaxVendorAmount() {
    let totalTaxAmount: number =
      this.addNewPurchaseForm.get("taxableAmount").value;
    let vendorTaxApplied =
      this.addNewPurchaseForm.get("vendorTaxApplied").value;
    let taxVendorAmount = (totalTaxAmount * vendorTaxApplied) / 100;
    this.addNewPurchaseForm.patchValue({
      taxVendorAmount: taxVendorAmount.toFixed(2),
    });
  }

  changeVaidationForTaxVendor() {
    let isTaxVendor = this.addNewPurchaseForm.get("isTaxVendor").value;
    console.log("isTaxVendor", isTaxVendor);

    this.addNewPurchaseForm.get("taxVendor").clearValidators();
    this.addNewPurchaseForm.get("taxVendorAmount").clearValidators();
    this.addNewPurchaseForm.get("vendorTaxApplied").clearValidators();
    if (isTaxVendor) {
      this.addNewPurchaseForm
        .get("taxVendor")
        .setValidators([Validators.required]);
      this.addNewPurchaseForm
        .get("taxVendorAmount")
        .setValidators([Validators.required]);
      this.addNewPurchaseForm
        .get("vendorTaxApplied")
        .setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(100),
        ]);
    }
    this.addNewPurchaseForm.get("taxVendor").updateValueAndValidity();
    this.addNewPurchaseForm.get("taxVendorAmount").updateValueAndValidity();
    this.addNewPurchaseForm.get("vendorTaxApplied").updateValueAndValidity();


    if (isTaxVendor) {
      this.addNewPurchaseForm
        .get("paidToSupplierPurchaseCost")
        ?.patchValue(this.addNewPurchaseForm.get("nonTaxable").value);
    } else {
      this.lotTypeValue === "Lot"
        ? this.addNewPurchaseForm
            .get("paidToSupplierPurchaseCost")
            ?.patchValue(this.ItemDetails.paidToSupplierLotCost)
        : this.addNewPurchaseForm
            .get("paidToSupplierPurchaseCost")
            ?.patchValue(
              (
                Number(Number(this.addNewPurchaseForm.get("nonTaxable").value || 0).toFixed(2)) +
                Number(Number(this.addNewPurchaseForm.get("taxable").value || 0).toFixed(2))
              )
            );
    }
  }


  selectSubCate(event: any): void {
    console.log('Selected Sub Category:', event);
  }
  
  

  addNewPurchaseFormSubmit() {
    const formData = this.addNewPurchaseForm.value;
    let payload = {};
    console.log(formData);

    let taxVenoderObj = {
      _id: formData.taxVendor._id,
      companyName: formData.taxVendor.companyName,
      taxVendorAmount: Number(formData.taxVendorAmount),
      vendorTaxApplied: Number(formData.vendorTaxApplied),
    };
    if (this.addNewPurchaseForm.value.purchaseType == "Lot") {
      if (formData && formData.paidToSupplierPurchaseCost !== undefined) {
        this;
        this.ItemDetails.purchaseCost = Number(
          formData.paidToSupplierPurchaseCost
        );

        this.ItemDetails.date = formData.purchaseDate;
        this.ItemDetails.notes = formData.purchaseNotes;
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
        purchaseDiscount: Number(formData.purchaseDiscount),
        purchaseCost: Number(formData.paidToSupplierPurchaseCost).toFixed(2),
        purchaseTotalAmount: Number(this.ItemDetails.lotTotalCost).toFixed(2),
        lotDetail: this.ItemDetails,
        nonTaxable: Number(formData.nonTaxable),
        taxableAmount: Number(formData.taxableAmount),
        taxable: formData.taxable,
        purchaseItemTax: formData.purchaseItemTax,
        taxVendor: this.addNewPurchaseForm.get("isTaxVendor").value
          ? taxVenoderObj
          : null,
        taxApplied: formData.taxApplied,
        warehouseDetails:this.ItemDetails?.warehouseDetails,
        transportationCharges:this.ItemDetails?.transportationCharge,
        otherCharges:this.ItemDetails?.royaltyCharge,
        totalTransportationCharges:this.ItemDetails?.totalTransportationCharges,
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
        nonTaxable: Number(formData.nonTaxable)?.toFixed(2),
        taxableAmount: Number(formData.taxableAmount)?.toFixed(2),
        taxable: Number(formData.taxable)?.toFixed(2),
        purchaseItemTax: formData.purchaseItemTax,
        taxVendor: this.addNewPurchaseForm.get("isTaxVendor").value
          ? taxVenoderObj
          : null,
        taxApplied:  Number(formData?.taxApplied)?.toFixed(2), 
        otherCharges:  Number(formData?.otherCharges)?.toFixed(2), 
        transportationCharges:  Number(formData?.transportationCharges)?.toFixed(2),
        warehouseDetails: formData?.warehouseDetails,
        vehicleNo: formData?.vehicleNo,
        totalSQFT: formData?.totalSQFT,
      };
      // payload = this.slabSelected(formData) as any;
      console.log(payload);
    }
    if (this.addNewPurchaseForm.valid) {
      this.NewPurchaseService.createPurchase(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            this.NewPurchaseService.clearFormData();
            const message = "Purchase has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigateByUrl(this.returnUrl);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    } else {
      console.log("form is not valid");
    }
  }

  slabSelected(formData?: any): any {
    const {
      paidToSupplierPurchaseCost,
      slabDetails,
      royaltyCharge,
      transportationCharge,
      slabDiscount,
      squarefeet,
    } = this.addSlabPNTTT(formData.slabDetails);
    return {
      purchaseInvoiceNumber: formData.invoiceNumber,
      supplier: formData.supplier,
      purchaseDate: formData.purchaseDate,
      purchaseType: "slab",
      purchaseNotes: formData.purchaseNotes,
      purchaseTotalAmount: Number(formData.totalCosting),
      slabDetail: slabDetails,
      purchaseCost: Number(paidToSupplierPurchaseCost),
      totalCosting: formData.totalCosting,
      nonTaxable: formData.nonTaxable,
      taxableAmount: formData.nonTaxable,
      taxable: formData.nonTaxable,
      otherCharges: Number(royaltyCharge),
      transportationCharges: Number(transportationCharge),
      purchaseDiscount: Number(slabDiscount),
      purchaseItemTax: formData.purchaseItemTax,
      taxVendor: formData.taxVendor,
      taxApplied: formData.taxApplied,
      totalSQFT: squarefeet,
      warehouseDetails: formData.warehouseDetails,
    };
  }

  addSlabPNTTT(formData?: any) {
    let paidToSupplierPurchaseCost = 0;
    let nonTaxable = 0;
    let taxable = 0;
    let taxableAmount = 0;
    let slabDetails = [];
    let transportationCharge = 0;
    let royaltyCharge = 0;
    let slabDiscount = 0;
    let squarefeet = 0;
    let warehouseDetails: any;
    slabDiscount = formData.slabDiscount || 0;
    transportationCharge = formData.transportationCharge || 0;
    royaltyCharge = formData.royaltyCharge || 0;
    warehouseDetails = formData.warehouseDetails;
    (paidToSupplierPurchaseCost = formData.paidToSupplierSlabCost),
      console.log(formData);
    formData.addSlab?.forEach((item) => {
      slabDetails.push({
        slabName: item.slabName,
        slabNo: item.slabNumber || "",
        width: Number(item.width) || "",
        length: Number(item.length) || "",
        thikness: Number(item.thickness) || "",
        finishes: item.finishes || "",
        sqftPerPiece: Number(item.sqftPerPiece) || "",
        categoryDetail: item.categoryDetail || "",
        subCategoryDetail: {
          name: item.subCategoryDetail.name,
          _id: item.subCategoryDetail._id,
        },
        costPerSQFT: Number(item.costPerSQFT),
        quantity: Number(item.quantity),
        ratePerSqFeet: item.ratePerSqFeet,
        totalAmount: Number(item.totalAmount) || "",
        slabSize: `${item.width ? item.width : " "} x ${
          item.length ? item.length : " "
        } x ${item.thickness ? item.thickness : " "}`,
        noOfPieces: Number(item.noOfPieces) || "",
      });
      squarefeet += item.quantity;
    });
    return {
      taxable,
      nonTaxable,
      taxableAmount,
      paidToSupplierPurchaseCost,
      slabDetails,
      royaltyCharge,
      transportationCharge,
      slabDiscount,
      squarefeet,
    };
  }

  ngOnDestroy(): void {
    this.handleBeforeUnload();
  }
}
