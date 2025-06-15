// 1. Imports
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import * as moment from "moment";
import { routes } from "src/app/shared/routes/routes";
import { validationRegex } from "../../validation";
import { SharedModule } from "src/app/shared/shared.module";
import { EditLotComponent } from "../../Product/lot/edit-lot/edit-lot.component";
import { AddSlabPurchaseComponent } from "../add-slab-purchase/add-slab-purchase.component";
// Import all services
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { CategoriesService } from "../../settings/categories/categories.service";
import { SuppliersdataService } from "../../Suppliers/suppliers.service";
import { SubCategoriesService } from "../../settings/sub-categories/sub-categories.service";
import { NewPurchaseService } from "../new-purchase.service";
import { TaxesService } from "../../settings/taxes/taxes.service";
import { TaxVendorsService } from "../../tax-vendors/tax-vendors.service";

@Component({
  selector: "app-edit-new-purchase",
  standalone: true,
  imports: [SharedModule, EditLotComponent, AddSlabPurchaseComponent],
  templateUrl: "./edit-new-purchase.component.html",
  styleUrl: "./edit-new-purchase.component.scss",
})
export class EditNewPurchaseComponent implements OnInit {
  // 3. ViewChild decorators
  @ViewChild(EditLotComponent) child!: EditLotComponent;
  @ViewChild(AddSlabPurchaseComponent) slabChild!: AddSlabPurchaseComponent;

  public routes = routes;
  maxDate = new Date();
  currentUrl: string;
  editNewPurchaseForm!: FormGroup;
  expensesForm!: FormGroup;
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
  slabDetailsLength: number = 0;
  categoryList: any = [];
  CategoryListsEditArray: any = [];
  subCategoryList: any = [];
  SubCategoryListsEditArray: any = [];
  subCategorListByCategory: any = [];
  lotTypeValue = "";
  ItemDetails: any = {};
  LotPayload: any;
  previousSlabValues: any = {};
  returnUrl: string;
  apiResponseData: any;
  SlabItemDetails: any = {};
  slabdtls: any;
  addSlabData: any;
  taxableAmount: number = 0;
  itemTax: any[] = [];
  editSlabValues: any = [];
  piecesDetails: any = [];

  // 6. Static data
  readonly lotsNoArray = [
    { name: "Lot", _id: "lot" },
    { name: "Slab", _id: "slab" },
  ];
  readonly finishes = [
    { name: "Polished" },
    { name: "Unpolished" },
    { name: "Semi polished" },
  ];
  readonly expenseTypeOptions = [
    { name: "Transportation Charges", value: "transportationCharge" },
    { name: "Royalty Charges", value: "royaltyCharges" },
    { name: "Other Charges", value: "otherCharges" },
  ];
  constructor(
    private activeRoute: ActivatedRoute,
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
    this.expensesForm = this.fb.group({
      expenses: this.fb.array([]),
    });
    this.editNewPurchaseForm = this.fb.group({
      productId: [""],
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
      taxableAmount: ["", [Validators.min(0), Validators.max(999999999999)]],
      purchaseItemTax: [""],
      nonTaxable: ["", [Validators.min(0), Validators.max(999999999999)]],
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
    this.initializeSubscriptions();
    this.loadSubCategories();
    this.loadWarehouses();
    this.loadPurchaseDetails();
    this.loadTaxVendors();
    this.loadSuppliers();
    this.loadTaxes();
    this.loadCategories();
  }

  private initializeSubscriptions() {
    this.returnUrl = this.localStorageService.getItem("returnUrl");
    this.subscribeToSlabDetailsLength();
  }

  private subscribeToSlabDetailsLength() {
    this.NewPurchaseService.slabDetailsLength.subscribe((length) => {
      this.slabDetailsLength = length;
    });
  }

  private loadSubCategories() {
    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategoryList = resp.data;
      this.SubCategoryListsEditArray = this.mapItAsDropDownFromat(resp.data);
    });
  }

  // private mapSubCategories(data: any[]) {
  //   return (
  //     data?.map((element: any) => ({
  //       name: element?.name,
  //       _id: {
  //         _id: element._id,
  //         name: element.name,
  //       },
  //     })) || []
  //   );
  // }

  private loadWarehouses() {
    this.WarehouseService.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data;
      this.wareHousedataListsEditArray = this.mapItAsDropDownFromat(resp.data);
    });
  }

  private mapItAsDropDownFromat(data: any[]) {
    return data.map((element: any) => ({
      name: element.name,
      _id: {
        _id: element._id,
        name: element.name,
      },
    }));
  }

  private loadPurchaseDetails() {
    this.NewPurchaseService.getPurchaseById(this.purchaseId).subscribe(
      (resp: any) => {
        this.handlePurchaseResponse(resp.data);
      }
    );
  }

  public getTaxType(type: string):string {
    return type === 'intra_state_tax' ? '( Intra State Tax )' : '( Inter State Tax )' 
  }

  private handlePurchaseResponse(data: any) {
    this.editSlabValues = data.slabDetails || [];
    this.patchPurchaseFormValues(data);

    if (data.purchaseType === "lot") {
      this.handleLotTypePurchase(data);
    } else {
      this.handleSlabTypePurchase(data);
    }

    if (data.purchaseType === "slab") {
      this.handleSlabDetails(data);
    }
  }

  private patchPurchaseFormValues(data: any) {
    const convertedDate = data.purchaseDate
      ? moment(data.purchaseDate, "MM/DD/YYYY").format("DD/MM/YYYY")
      : null;

    this.editNewPurchaseForm.patchValue({
      invoiceNumber: data.purchaseInvoiceNumber,
      purchaseDate: convertedDate,
      supplier: data.supplier,
      _id: data._id,
      purchaseType: data.purchaseType,
      productId: data.productId,
      warehouseDetails: data.warehouseDetails,
      taxable: data.taxable,
      nonTaxable: data.nonTaxable,
      purchaseItemTax: data.purchaseItemTax,
      isTaxVendor: data.taxVendor ? true : false,
      taxVendor: {
        _id: data?.taxVendor?._id,
        companyName: data?.taxVendor?.companyName,
      },
      taxVendorAmount: data?.taxVendor?.taxVendorCutAmount,
      vendorTaxApplied: data?.taxVendor?.vendorTaxApplied,
      purchaseNotes: data?.purchaseNotes,
    });
  }

  private handleLotTypePurchase(data: any) {
    this.NewPurchaseService.setFormData("stepFirstLotData", data);
    this.lotTypeValue = data.purchaseType;
  }

  private handleSlabTypePurchase(data: any) {
    const payload = {
      warehouseDetails: data.warehouseDetails,
      vehicleNo: data.vehicleNo,
      purchaseExpenses: data.purchaseExpenses || [],
      transportationCharge: Number(data.transportationCharges),
      royaltyCharge: Number(data.otherCharges),
      slabDetails: data?.slabDetails,
      slabTotalCost: Number(data?.totalCosting),
      totalCost: Number(data?.purchaseTotalAmount),
      paidToSupplierSlabCost: Number(data.totalCosting),
      purchaseDiscount: Number(data.purchaseDiscount),
      nonTaxableAmount: Number(data.nonTaxable),
      taxableAmount: Number(data.taxableAmount),
      taxable: Number(data.taxable),
      purchaseItemTax: data.purchaseItemTax,
      taxApplied: Number(data.taxApplied),
      totalSQFT: Number(data.totalSQFT),
    };

    this.NewPurchaseService.setFormData("expensesData", data.purchaseExpenses);
    this.NewPurchaseService.setFormData("stepFirstSlabData", payload);
  }

  private handleSlabDetails(data: any) {
    this.lotTypeValue = data.purchaseType;
    this.slabdtls = data.slabDetails || [];

    if (data.slabDetails.length > 0) {
      this.findSubCategory(data.slabDetails[0]?.categoryDetail);
      this.previousSlabValues = this.mapSlabValues(data.slabDetails[0]);
    }

    this.lotType(data.purchaseType);
  }

  private mapSlabValues(slabData: any) {
    return {
      slabNo: slabData?.slabNo,
      slabName: slabData?.slabName,
      warehouseDetails: slabData?.warehouseDetails,
      categoryDetail: slabData?.categoryDetail,
      subCategoryDetail: slabData?.subCategoryDetail,
      finishes: slabData?.finishes,
      totalSQFT: slabData?.totalSQFT,
      noOfPieces: slabData?.noOfPieces,
      sellingPricePerSQFT: slabData?.sellingPricePerSQFT,
      transportationCharges: slabData?.transportationCharges,
      otherCharges: slabData?.otherCharges,
      totalCosting: slabData?.totalCosting,
      thickness: slabData?.thickness,
      length: slabData?.length,
      width: slabData?.width,
      costPerSQFT: slabData?.costPerSQFT,
      sqftPerPiece: slabData?.sqftPerPiece || 0,
      paidToSupplierPurchaseCost:
        this.editNewPurchaseForm.get("taxable")?.value +
        this.editNewPurchaseForm.get("nonTaxable")?.value,
    };
  }

  private loadTaxVendors() {
    this.taxVendorsService.getTaxVendorList().subscribe((resp: any) => {
      if (resp.data) {
        this.taxVendorList = this.mapTaxVendors(resp.data);
      }
    });
  }

  private mapTaxVendors(data: any[]) {
    return data.map((element) => ({
      name: `${element.companyName} / ${element.city},`,
      _id: {
        _id: element._id,
        companyName: element.companyName,
      },
    }));
  }

  private loadSuppliers() {
    this.SuppliersdataService.GetSupplierData().subscribe((data: any) => {
      this.getSupplierShow = data;
      this.SupplierLists = this.mapSuppliers(data);
    });
  }

  private mapSuppliers(data: any[]) {
    return data.map((element: any) => ({
      name: element.name,
      _id: {
        _id: element._id,
        name: element.name,
        taxNo: element.taxNo,
        billingAddress: element.billingAddress,
      },
    }));
  }

  private loadTaxes() {
    this.taxService.getAllTaxList().subscribe((resp: any) => {
      this.taxesListData = resp.data;
      this.orderTaxList = this.mapTaxes(resp.data);
    });
  }

  private mapTaxes(data: any[]) {
    return data.map((element: any) => ({
      orderTaxName: `${element.name} (${element.taxRate}%)`,
      orderNamevalue: element,
    }));
  }

  private loadCategories() {
    this.categoriesService.getCategories().subscribe((resp: any) => {
      this.categoryList = resp.data;
      this.CategoryListsEditArray = this.mapItAsDropDownFromat(resp.data);
    });
  }

  findSubCategory(value: any) {
    console.log("val cate>>", value);
    let SubCategoryData: any = [];
    this.editNewPurchaseForm.get("subCategoryDetail")?.reset();
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

  backStep(prevCallback: any, type: any) {
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
  private handleFirstPageSlabType() {
    this.slabChild?.slabAddFormSubmit();
    const slabData = this.NewPurchaseService.getFormData(
      "stepFirstSlabData"
    ) as any;

    if (!slabData) return;

    this.editNewPurchaseForm.patchValue({
      paidToSupplierPurchaseCost: slabData.paidToSupplierSlabCost,
      totalCosting: slabData.totalCosting,
      purchaseTotalAmount: slabData.totalCost,
      taxableAmount: slabData.taxableAmount,
      nonTaxable: slabData.nonTaxableAmount,
      taxable: slabData.taxable,
      purchaseItemTax: slabData.purchaseItemTax,
      taxApplied: slabData.taxApplied,
      purchaseCost: slabData.purchaseCost,
      purchaseDiscount: slabData.purchaseDiscount,
      otherCharges: slabData.royaltyCharge,
      transportationCharges: slabData.transportationCharge,
      warehouseDetails: slabData.warehouseDetails,
      vehicleNo: slabData.vehicleNo,
      totalSQFT: slabData.totalSQFT,
    });

    this.SlabItemDetails = slabData;

    console.log(this.SlabItemDetails, 'SlabItemDetails');
    
  }

  handleFirstPageLotType() {
    this.child?.LotEditFormSubmit();
    this.ItemDetails = this.NewPurchaseService.getFormData("stepFirstLotData");

    if (!this.ItemDetails) return;

    // Save the ItemDetails in local storage
    localStorage.setItem("lotFormData", JSON.stringify(this.ItemDetails));
    this.LotPayload = { ...this.ItemDetails };

    this.editNewPurchaseForm.patchValue({
      paidToSupplierPurchaseCost: this.ItemDetails.paidToSupplierLotCost,
      taxableAmount: this.ItemDetails.taxableAmount,
      nonTaxable: this.ItemDetails.nonTaxableAmount,
      taxable: this.ItemDetails.taxable,
      purchaseItemTax: this.ItemDetails.purchaseItemTax,
      taxApplied: this.ItemDetails.taxApplied,
      purchaseDiscount: this.ItemDetails.purchaseDiscount,
      _id: this.purchaseId,
    });
  }

  private handleExpensesData() {
    setTimeout(() => {
      const expensesData = this.NewPurchaseService.getFormData("expensesData");
      if (!expensesData) return;

      // Clear existing expenses
      while (this.expenses.length !== 0) {
        this.expenses.removeAt(0);
      }

      // Add new expenses
      expensesData.forEach((data) => {
        this.expenses.push(this.createExpenseGroup(data));
      });
    }, 1000);
  }

  // Main nextStep method
  nextStep(nextCallback: any, page: string) {
    // Handle pieces details
    this.piecesDetails = this.NewPurchaseService.getFormData("piecesDetails");

    // Handle expenses data
    this.handleExpensesData();

    // Handle first page specific logic
    if (page === "first") {
      if (this.lotTypeValue === "lot") {
        this.handleFirstPageLotType();
      } else if (this.lotTypeValue === "slab") {
        this.handleFirstPageSlabType();
      }
    }

    // Process next step
    nextCallback.emit();

    // Handle tax vendor validation and calculations
    this.changeVaidationForTaxVendor();
    if (this.editNewPurchaseForm.get("isTaxVendor")?.value) {
      this.calculateTaxVendorAmount();
    }
  }

  lotType(value: any) {
    this.lotTypeValue = value.toLowerCase();
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
              Number(
                Number(
                  this.editNewPurchaseForm.get("nonTaxable").value || 0
                ).toFixed(2)
              ) +
                Number(
                  Number(
                    this.editNewPurchaseForm.get("taxable").value || 0
                  ).toFixed(2)
                )
            );
    }
  }

  // Optional: clear local storage if needed when the form is completed
  clearLocalStorage() {
    localStorage.removeItem("lotFormData");
  }
  getExpenseTypeName(value: string): string {
    const option = this.expenseTypeOptions.find((opt) => opt.value === value);
    return option ? option.name : value; // fallback to value if not found
  }

  createExpenseGroup(data?: any): FormGroup {
    return this.fb.group({
      type: [data?.type || ""],
      payment: [data?.payment || ""],
      paidBy: [data?.paidBy],
      state_tax: [data?.state_tax],
      ItemTax: [data?.ItemTax],
      IGST: [data?.IGST],
      CGST: [data?.CGST],
      SGST: [data?.SGST],
      taxAppliedExpense: [data?.taxAppliedExpense],
      rcmApplicable: [data?.rcmApplicable],
      serviceProvider: [data?.serviceProvider],
    });
  }

  public capitalizeFirstLetter(value: string): string {
    return value
      ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
      : "";
  }
  onVehicleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const uppercaseValue = input.value.toUpperCase();
    this.editNewPurchaseForm
      .get("vehicleNo")
      ?.setValue(uppercaseValue, { emitEvent: false });
  }
  public setValidations(formControlName: string) {
    return (
      this.editNewPurchaseForm.get(formControlName)?.invalid &&
      (this.editNewPurchaseForm.get(formControlName)?.dirty ||
        this.editNewPurchaseForm.get(formControlName)?.touched)
    );
  }

  onnextBtnDisabled(data: any) {
    this.addSlabData = data.controls;
  }

  get expenses(): FormArray {
    console.log(this.expensesForm.get("expenses"), "FormArray");
    return this.expensesForm.get("expenses") as FormArray;
  }

  hasAnyPayment(): boolean {
    return this.expenses?.controls?.some(
      (ctrl) => !!ctrl.get("payment")?.value
    );
  }

  getSelectedWarehouseName(): string {
    const selectedId = this.editNewPurchaseForm.get("warehouseDetails")?.value;
    console.log(selectedId, 'selectedId');
    
    const selectedWarehouse = this.wareHousedata.find(
      (w) => w._id === selectedId
    );
    console.log(selectedWarehouse, 'selectedWarehouse');
    return selectedWarehouse ? selectedWarehouse.name : "--";

    
  }

  editNewPurchaseFormSubmit() {
    if (!this.editNewPurchaseForm.valid) {
      this.messageService.add({
        severity: "error",
        detail: "Please fill all required fields correctly",
      });
      return;
    }

    try {
      const formData = this.editNewPurchaseForm.value;
      const convertedDate = moment(formData.purchaseDate, "DD/MM/YYYY").format(
        "MM/DD/YYYY"
      );
      const payload = this.preparePayload(formData, convertedDate);

      this.submitPurchaseUpdate({...payload, _id: this.purchaseId});
    } catch (error) {
      this.messageService.add({
        severity: "error",
        detail: "Error processing form data",
      });
      console.error("Form submission error:", error);
    }
  }

  private preparePayload(formData: any, convertedDate: string): any {
    // Clear any existing form data
    this.NewPurchaseService.clearFormData();

    const taxVendorObj = this.prepareTaxVendorData(formData);

    return formData.purchaseType === "lot"
      ? this.prepareLotPayload(formData, convertedDate, taxVendorObj)
      : this.prepareSlabPayload(formData, convertedDate, taxVendorObj);
  }

  private prepareTaxVendorData(formData: any): any | null {
    if (!this.editNewPurchaseForm.get("isTaxVendor").value) {
      return null;
    }

    return {
      _id: formData.taxVendor?._id,
      companyName: formData.taxVendor?.companyName,
      taxVendorAmount: Number(formData.taxVendorAmount),
      vendorTaxApplied: Number(formData.vendorTaxApplied),
    };
  }

  private prepareLotPayload(
    formData: any,
    convertedDate: string,
    taxVendorObj: any | null
  ): any {
    // Update ItemDetails if needed
    if (formData?.paidToSupplierPurchaseCost !== undefined) {
      this.updateItemDetails(formData, convertedDate);
    }

    return {
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
      taxVendor: taxVendorObj,
      taxApplied: formData.taxApplied,
      productId: formData.productId,
      _id: this.purchaseId,
      totalTransportationCharges: this.ItemDetails?.totalTransportationCharges,
    };
  }

  private prepareSlabPayload(
    formData: any,
    convertedDate: string,
    taxVendorObj: any | null
  ): any {
    this.updateSlabWarehouseDetails();
    console.log(formData, 'formData')
    console.log(this.ItemDetails, 'this.ItemDetails')
    return {
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
      nonTaxable: this.formatNumber(formData.nonTaxable),
      taxableAmount: this.formatNumber(formData.taxableAmount),
      taxable: this.formatNumber(formData.taxable),
      purchaseItemTax: formData.purchaseItemTax,
      taxVendor: taxVendorObj,
      taxApplied: this.formatNumber(formData.taxApplied),
      otherCharges: this.formatNumber(formData.otherCharges),
      transportationCharges: this.formatNumber(formData.transportationCharges),
      royaltycharges: this.formatNumber(formData.royaltyCharge),
      vehicleNo: formData?.vehicleNo?.length > 0 ? formData.vehicleNo : null,
      totalSQFT: formData.totalSQFT,
      purchaseExpenses: this.expensesForm.value.expenses,
      warehouseDetails: formData.warehouseDetails ? formData.warehouseDetails : this.ItemDetails?.warehouseDetails,
      ...this.getSlabAdditionalDetails(),
    };
  }

  private formatNumber(value: number | string): string {
    return isNaN(Number(value)) ? "0.00" : Number(value).toFixed(2);
  }

  private updateItemDetails(formData: any, convertedDate: string): void {
    this.ItemDetails = {
      ...this.ItemDetails,
      purchaseCost: Number(formData.paidToSupplierPurchaseCost),
      date: convertedDate,
      notes: formData.purchaseNotes,
      _id: formData.productId,
    };
  }

  private updateSlabWarehouseDetails(): void {
    if (Array.isArray(this.SlabItemDetails.slabDetails)) {
      console.log(this.SlabItemDetails, 'this.SlabItemDetails');
      
      this.SlabItemDetails.slabDetails = this.SlabItemDetails.slabDetails.map(
        (slab) => ({
          ...slab,
          warehouseDetails: this.getSelectedWarehouseDetails(),
        })
      );

      console.log(this.SlabItemDetails, 'this.SlabItemDetails')
    }
  }

  private getSlabAdditionalDetails() {
    return {
      sellingPricePerSQFT: this.SlabItemDetails.sellingPricePerSQFT,
      costPerSQFT: this.SlabItemDetails.costPerSQFT,
      sqftPerPiece: this.SlabItemDetails.sqftPerPiece,
      slabSize: this.SlabItemDetails.slabSize,
      taxAmountPerSQFT: this.SlabItemDetails.taxAmountPerSQFT,
      processingFeePerSQFT: this.SlabItemDetails.processingFeePerSQFT,
      piecesDetails: this.piecesDetails,
    };
  }

  private submitPurchaseUpdate(payload: any): void {
    this.NewPurchaseService.UpdatePurchaseData(payload).subscribe({
      next: (resp: any) => {
        if (resp?.status === "success") {
          this.handleSuccessfulUpdate();
        } else {
          this.messageService.add({
            severity: "error",
            detail: resp.message || "Update failed",
          });
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          detail: "Error updating purchase data",
        });
        console.error("Update error:", error);
      },
    });
  }

  private handleSuccessfulUpdate(): void {
    this.clearLocalStorage();
    this.NewPurchaseService.clearFormData();

    this.messageService.add({
      severity: "success",
      detail: "Purchase has been updated successfully",
    });

    setTimeout(() => {
      this.router.navigateByUrl(this.returnUrl);
    }, 400);
  }

  getSelectedWarehouseDetails(): { _id: string; name: string } | null {
    const selectedId = this.editNewPurchaseForm.get("warehouseDetails")?.value;
    console.log(selectedId, 'selectedIdselectedId');
    
    const warehouse = this.wareHousedata.find((w) => w._id === selectedId);
    return warehouse ? { _id: warehouse._id, name: warehouse.name } : null;
  }

  // getSelectedWarehouseName(): string {
  //   const selectedId = this.editNewPurchaseForm.get('warehouse')?.value;
  //   const selectedWarehouse = this.wareHousedata.find(w => w._id === selectedId);
  //   return selectedWarehouse ? selectedWarehouse.name : '--';
  // }
}
