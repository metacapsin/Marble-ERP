import { Component, OnInit, ViewChild, viewChild } from "@angular/core";
import { Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { FormBuilder, FormGroup } from "@angular/forms";
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

@Component({
  selector: "app-add-new-purchase",
  standalone: true,
  imports: [SharedModule, AddLotComponent, AddSlabsComponent],
  templateUrl: "./add-new-purchase.component.html",
  styleUrl: "./add-new-purchase.component.scss",
  providers: [MessageService],
})
export class AddNewPurchaseComponent implements OnInit {
  @ViewChild(AddLotComponent) child!: AddLotComponent;
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
  categoryList: any;
  finishes = [
    { name: "Polished" },
    { name: "Unpolished" },
    { name: "Semi polished" },
  ];
  getSupplierShow: any;
  ItemDetails: any = {};
  invoiceRegex = /^(?=[^\s])([a-zA-Z\d\/\-_ ]{1,30})$/;
  shortNameRegex = /^[^\s.-][a-zA-Z0-9_.\s-]{2,50}$/;
  descriptionRegex = /^.{3,500}$/s;

  previousSlabValues: any = {};
  returnUrl: any;
  supplier: any;
  purchaseItemTaxAmount: number = 0;
  isTaxVendor: boolean = false;

  taxVendorList: any = [];
  subCategorListByCategory: any = [];
  taxesListData: any;
  orderTaxList: any;
  LotPayload: any;
  constructor(
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
    this.addNewPurchaseForm = this.fb.group({
      invoiceNumber: ["", [Validators.pattern(this.invoiceRegex)]],
      purchaseDate: ["", Validators.required],
      supplier: ["", [Validators.required]],
      paidToSupplierPurchaseCost: [
        "",
        [Validators.min(0), Validators.max(9999999), Validators.required],
      ],
      purchaseType: ["", [Validators.required]],

      purchaseNotes: [
        "",
        [Validators.pattern(validationRegex.address3To500Regex)],
      ],
      slabNo: [
        "",
        [Validators.required, Validators.pattern(this.invoiceRegex)],
      ],
      slabName: [
        "",
        [Validators.required, Validators.pattern(this.invoiceRegex)],
      ],
      warehouseDetails: ["", [Validators.required]],
      categoryDetail: ["", [Validators.required]],
      subCategoryDetail: ["", [Validators.required]],
      totalSQFT: [
        "",
        [Validators.required, Validators.min(1), Validators.max(100000)],
      ],
      width: ["", [Validators.min(1), Validators.max(100000)]],
      length: ["", [Validators.min(1), Validators.max(100000)]],
      thickness: ["", [Validators.min(1), Validators.max(1000)]],
      finishes: ["", [Validators.required]],
      sellingPricePerSQFT: [
        "",
        [Validators.required, Validators.min(1), Validators.max(100000)],
      ],
      transportationCharges: ["", [Validators.min(1), Validators.max(100000)]],
      otherCharges: ["", [Validators.min(1), Validators.max(100000)]],
      totalCosting: [""],
      costPerSQFT: [""],
      sqftPerPiece: [""],
      noOfPieces: ["", [Validators.min(1), Validators.max(100000)]],
      purchaseDiscount: ["", [Validators.min(0), Validators.max(100000)]],
      taxable: [""],
      purchaseItemTax: [""],
      nonTaxable: [""],
      purchaseItemTaxAmount: [""],
      taxVendor: [""],
      taxVendorAmount: [""],
      vendorTaxApplied: [""],
      taxApplied: [""],
    });
  }

  ngOnInit(): void {
    this.NewPurchaseService.clearFormData();
    this.supplier = this.localStorageService.getItem("supplier");
    this.returnUrl = this.localStorageService.getItem("returnUrl");
    if (this.supplier) {
      this.addNewPurchaseForm.patchValue({
        supplier: this.supplier,
      });
    }

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

  // Method to check if the required fields in the first stepper are valid
  isFirstStepValid(): boolean {
    const controls = this.addNewPurchaseForm.controls;
    return (
      controls["invoiceNumber"].valid &&
      controls["purchaseDate"].valid &&
      controls["supplier"].valid &&
      controls["paidToSupplierPurchaseCost"].valid
    );
  }

  backStap(prevCallback: any, page: any) {
    prevCallback.emit();
    if (page == "second") {
      if (this.lotTypeValue == "Lot") {
        this.child.LotAddFormSubmit();
        console.log(this.child.LotAddFormSubmit);
      }
    }
  }
  nextStep(nextCallback: any, page: string) {
    if (this.isFirstStepValid()) {
      nextCallback.emit();
    }

    if (page == "second") {
      if (this.lotTypeValue == "Lot") {
        this.child.LotAddFormSubmit();
        console.log(this.child.LotAddFormSubmit);
      }
    }
    nextCallback.emit();

    if (page == "first") {
      this.calculateTotalAmount();
    }
    if (this.lotTypeValue == "Lot") {
      this.ItemDetails = this.NewPurchaseService.getFormData("stepTwoData");
      const payload = { ...this.ItemDetails };
      delete payload.nonTaxable;
      delete payload.taxable;
      delete payload.purchaseItemTax;
      delete payload.purchaseItemTaxAmount;
      this.LotPayload = payload;
      console.log("hei adnan", this.ItemDetails);

      this.addNewPurchaseForm.patchValue({
        paidToSupplierPurchaseCost: this.ItemDetails?.paidToSupplierLotCost,
        taxable: this.ItemDetails?.taxableAmount,
        nonTaxable: this.ItemDetails?.nonTaxableAmount,
        purchaseItemTaxAmount: this.ItemDetails?.purchaseItemTaxAmount,
        purchaseItemTax: this.ItemDetails?.purchaseItemTax,
        taxApplied: this.ItemDetails?.taxApplied,
      });
    }
  }

  lotType(value: any) {
    this.lotTypeValue = value;
    if (this.lotTypeValue == "Lot") {
      this.previousSlabValues = {
        slabNo: this.addNewPurchaseForm.value.slabNo,
        slabName: this.addNewPurchaseForm.value.slabName,
        warehouseDetails: this.addNewPurchaseForm.value.warehouseDetails,
        categoryDetail: this.addNewPurchaseForm.value.categoryDetail,
        subCategoryDetail: this.addNewPurchaseForm.value.subCategoryDetail,
        finishes: this.addNewPurchaseForm.value.finishes,
        totalSQFT: this.addNewPurchaseForm.value.totalSQFT,
        sellingPricePerSQFT: this.addNewPurchaseForm.value.sellingPricePerSQFT,
        transportationCharges:
          this.addNewPurchaseForm.value.transportationCharges,
        otherCharges: this.addNewPurchaseForm.value.otherCharges,
        totalCosting: this.addNewPurchaseForm.value.totalCosting,
        thickness: this.addNewPurchaseForm.value.thickness,
        length: this.addNewPurchaseForm.value.length,
        width: this.addNewPurchaseForm.value.width,
        costPerSQFT: this.addNewPurchaseForm.value.costPerSQFT,
        paidToSupplierPurchaseCost:
          this.addNewPurchaseForm.value.paidToSupplierPurchaseCost,
      };

      this.addNewPurchaseForm.patchValue({
        slabNo: "slabNo",
        slabName: "slabName",
        warehouseDetails: {
          _id: "123",
          name: "test",
        },
        categoryDetail: {
          _id: "123",
          name: "sdj",
        },
        subCategoryDetail: {
          _id: "123",
          name: "sdj",
        },
        finishes: {
          name: "Unpolished",
        },
        sellingPricePerSQFT: 2,
        totalSQFT: 2,
        costPerSQFT: 2,
        paidToSupplierPurchaseCost: 2,
      });
    } else {
      this.addNewPurchaseForm.patchValue({
        slabNo: this.previousSlabValues.slabNo,
        slabName: this.previousSlabValues.slabName,
        warehouseDetails: this.previousSlabValues.warehouseDetails,
        categoryDetail: this.previousSlabValues.categoryDetail,
        subCategoryDetail: this.previousSlabValues.subCategoryDetail,
        finishes: this.previousSlabValues.finishes,
        totalSQFT: this.previousSlabValues.totalSQFT,
        sellingPricePerSQFT: this.previousSlabValues.sellingPricePerSQFT,
        transportationCharges: this.previousSlabValues.transportationCharges,
        otherCharges: this.previousSlabValues.otherCharges,
        totalCosting: this.previousSlabValues.totalCosting,
        thickness: this.previousSlabValues.thickness,
        length: this.previousSlabValues.length,
        width: this.previousSlabValues.width,
        costPerSQFT: this.previousSlabValues.costPerSQFT,
        paidToSupplierPurchaseCost: this.previousSlabValues.paidToSupplierPurchaseCost,
      });
    }
  }
  calculateTotalAmount() {
    let totalTaxAmount: number = 0;
    if (this.lotTypeValue === "Slab") {
      let paidToSupplierPurchaseCost = this.addNewPurchaseForm.get("paidToSupplierPurchaseCost").value || 0;
      let transportationCharges = this.addNewPurchaseForm.get("transportationCharges").value || 0;
      let otherCharges = this.addNewPurchaseForm.get("otherCharges").value || 0;
      let totalSQFT = this.addNewPurchaseForm.get("totalSQFT").value || 0;
      let costPerSQFT = this.addNewPurchaseForm.get("costPerSQFT").value || 0;
      let purchaseDiscount = this.addNewPurchaseForm.get("purchaseDiscount").value || 0;
      let noOfPieces = this.addNewPurchaseForm.get("noOfPieces").value || 0;

      let taxable = this.addNewPurchaseForm.get("taxable").value || 0;
      let nonTaxable = this.addNewPurchaseForm.get("nonTaxable").value || 0;
      let purchaseItemTaxAmount = this.addNewPurchaseForm.get("purchaseItemTaxAmount").value || 0;
      let purchaseItemTax = this.addNewPurchaseForm.get("purchaseItemTax").value;

      let sqftPerPiece = totalSQFT / noOfPieces;

      if (taxable && purchaseItemTax) {
        if (Array.isArray(purchaseItemTax)) {
          purchaseItemTax.forEach((selectedTax: any) => {
            totalTaxAmount += (taxable * selectedTax.taxRate) / 100;
          });
        } else if (purchaseItemTax) {
          totalTaxAmount = (taxable * purchaseItemTax) / 100;
        }
        purchaseItemTaxAmount = taxable + totalTaxAmount;
        paidToSupplierPurchaseCost = purchaseItemTaxAmount + nonTaxable;
      } else {
        paidToSupplierPurchaseCost = taxable + nonTaxable;
      }

      const total: number = transportationCharges + otherCharges + paidToSupplierPurchaseCost + purchaseDiscount;
      if (totalSQFT !== 0) {
        costPerSQFT = total / totalSQFT;
      }
      if (total) {
        this.addNewPurchaseForm.patchValue({
          sellingPricePerSQFT: costPerSQFT.toFixed(2),
          costPerSQFT: costPerSQFT.toFixed(2),
          totalCosting: total,
          sqftPerPiece: sqftPerPiece,
          paidToSupplierPurchaseCost: paidToSupplierPurchaseCost
        });
      }
    }
  }

  calculateTaxVendorAmount() {
    let totalTaxAmount: number = this.ItemDetails.taxApplied;
    let vendorTaxApplied = this.addNewPurchaseForm.get("vendorTaxApplied").value;
    let taxVendorAmount = (totalTaxAmount * vendorTaxApplied) / 100;
    this.addNewPurchaseForm.patchValue({
      taxVendorAmount: taxVendorAmount,
    });
  }

  addNewPurchaseFormSubmit() {
    const formData = this.addNewPurchaseForm.value;
    let payload = {};
    this.LotPayload = this.LotPayload || {};
    console.log('formData', formData);

    if (formData && formData.paidToSupplierPurchaseCost !== undefined) {
      this.LotPayload.purchaseCost = Number(
        formData.paidToSupplierPurchaseCost
      );
      this.LotPayload.date = formData.purchaseDate;
      this.LotPayload.notes = formData.purchaseNotes;
    } else {
      console.error("formData.paidToSupplierPurchaseCost is not defined");
    }

    let taxVenoderObj = {
      _id: formData.taxVendor._id,
      companyName: formData.taxVendor.companyName,
      taxVendorAmount: Number(formData.taxVendorAmount),
      vendorTaxApplied: Number(formData.vendorTaxApplied),
    }
    if (this.addNewPurchaseForm.value.purchaseType == "Lot") {
      payload = {
        purchaseInvoiceNumber: formData.invoiceNumber,
        supplier: formData.supplier,
        purchaseDate: formData.purchaseDate,
        purchaseType: "lot",
        purchaseNotes: formData.purchaseNotes,
        purchaseCost: Number(formData.paidToSupplierPurchaseCost),
        purchaseTotalAmount: Number(this.LotPayload.lotTotalCost).toFixed(2),
        lotDetail: this.LotPayload,
        nonTaxable: Number(formData.nonTaxable),
        taxable: Number(formData.taxable),
        purchaseItemTaxAmount: formData.purchaseItemTaxAmount,
        purchaseItemTax: formData.purchaseItemTax,
        taxVendor: this.isTaxVendor ? taxVenoderObj : null,
        taxApplied: formData.taxApplied,
      };
    } else {
      if (formData.width || formData.length || formData.thickness) {
        var _Size = `${formData.width}x${formData.length}x${formData.thickness}`;
      }
      payload = {
        purchaseInvoiceNumber: formData.invoiceNumber,
        supplier: formData.supplier,
        purchaseDate: formData.purchaseDate,
        purchaseType: "slab",
        purchaseNotes: formData.purchaseNotes,
        purchaseCost: Number(formData.paidToSupplierPurchaseCost),
        slabDetail: {
          slabNo: formData.slabNo,
          slabName: formData.slabName,
          warehouseDetails: formData.warehouseDetails,
          categoryDetail: formData.categoryDetail,
          subCategoryDetail: formData.subCategoryDetail,
          totalSQFT: formData.totalSQFT,
          width: formData.width,
          length: formData.length,
          thickness: formData.thickness,
          finishes: formData.finishes,
          sellingPricePerSQFT: Number(formData.sellingPricePerSQFT),
          transportationCharges: Number(formData.transportationCharges),
          otherCharges: Number(formData.otherCharges),
          totalCosting: Number(formData.totalCosting),
          costPerSQFT: Number(formData.costPerSQFT),
          slabSize: _Size,
          purchaseCost: Number(formData.paidToSupplierPurchaseCost),
          purchaseDiscount: Number(formData.purchaseDiscount),
          sqftPerPiece: Number(formData.sqftPerPiece.toFixed(2)),
          noOfPieces: Number(formData.noOfPieces.toFixed(2)),
          date: formData.purchaseDate,
          notes: formData.purchaseNotes,
        },
        purchaseTotalAmount: Number(formData.totalCosting),
      };
    }
    if (this.addNewPurchaseForm.valid) {
      console.log("valid form");
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
}
