import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  NgForm,
  NgModel,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { MessageService } from "primeng/api";
import { NewPurchaseService } from "src/app/core/new-purchase/new-purchase.service";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
import {
  atLeastOneRequiredValidator,
  validationRegex,
} from "src/app/core/validation";
import { blockProcessorService } from "src/app/core/block-processor/block-processor.service";
import { TaxesService } from "src/app/core/settings/taxes/taxes.service";
import { CategoriesService } from "src/app/core/settings/categories/categories.service";
import { SubCategoriesService } from "src/app/core/settings/sub-categories/sub-categories.service";
import { co } from "@fullcalendar/core/internal-common";
@Component({
  selector: "app-add-slab-purchase",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  templateUrl: "./add-slab-purchase.component.html",
  styleUrl: "./add-slab-purchase.component.scss",
})
export class AddSlabPurchaseComponent {
  @Input() tab!: string;
  @Input() addSlabdisableBtn: boolean = false;
  slabAddForm: FormGroup;
  expensesForm: FormGroup;
  maxDate = new Date();
  public routes = routes;
  activeIndex: number[] = [0];
  @Output() saveClicked: EventEmitter<void> = new EventEmitter();
  slabDetails: any[] = [];
  marbleName: string;
  slabNumber: string;
  barcodeImage: string
  category: any = {};
  subCategory: any = {};
  noOfPieces: number;
  width: number;
  length: number;
  thickness: number;
  finishes: any = {};
  quantity: number;
  ratePerSqFeet: number;
  totalAmount: number;
  addvisible: boolean = false;
  addbarcodevisible: boolean = false;
  vehicleRegex = /^[A-Z]{2}[ -]?[0-9]{1,2}(?: ?[A-Z])?(?: ?[A-Z]*)? ?[0-9]{4}$/;
  slabTotalCost: number = 0;
  wareHousedata: any = [];
  orderTaxList: any[];
  taxesListData: any;
  categoryList: any[];
  CategoryListsEditArray: any[];
  // nonTaxableAmount: number;
  allSubCategoryList: any = [];
  subCategorListByCategory: any = [];
  maxPurchaseAmount = 0;
  previousSlabData: any;
  products: any[] = [];

  finisheshList = [
    { name: "Polished" },
    { name: "Unpolished" },
    { name: "Semi polished" },
  ];
  rows = [];
  editedRowBackup: any = null;
  totalQuantity: number = 0;
  expensesExpanded: boolean = true;
  // expenses: any[] = [];
  expenseTypeOptions = [
    { name: 'Transportation Charges', value: 'transportationCharge' },
    { name: 'Royalty Charges', value: 'royaltyCharges' },
    { name: 'Other Charges', value: 'otherCharges' }
  ];
  @Output() nextBtnDisabled = new EventEmitter<any>();


  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef,
    private NewPurchaseService: NewPurchaseService,
    private WarehouseService: WarehouseService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private ServiceblockProcessor: blockProcessorService,
    private taxService: TaxesService
  ) {
    this.slabAddForm = this.fb.group(
      {
        vehicleNo: ["", [Validators.pattern(this.vehicleRegex)]],
        warehouse: ["", [Validators.required]],
        paidToSupplierSlabCost: ["", [Validators.required]],
        taxableAmount: [""],
        nonTaxableAmount: [""],
        ItemTax: [""],
        taxable: [""], // taxbale Amount + apply tax amount
        taxApplied: [""], // tax applied ammount
        purchaseDiscount: ["", [Validators.min(0)]],
        transportationCharge: ["", [Validators.min(0), Validators.max(100000)]],
        royaltyCharge: ["", [Validators.min(0), Validators.max(100000)]],
        totalCost: [""],
        totalSQFT: [""],
      },
      {
        //  validators: atLeastOneRequiredValidator()
        validators: this.taxSelectionValidator(),
      }
    );
  }

  taxSelectionValidator(): ValidatorFn {
    return (control: AbstractControl) => {
      const taxableAmount = control.get("taxableAmount")?.value || 0;
      const selectedTaxes = control.get("ItemTax")?.value;

      if (taxableAmount && (!selectedTaxes || selectedTaxes.length === 0)) {
        return { taxRequired: true }; // Custom error key
      }
      return null;
    };
  }

  isEditMode: boolean = false
  discountModifiedByUser: boolean = false;

  ngOnInit(): void {
     this.expensesForm = this.fb.group({
    expenses: this.fb.array([])
  });

  // ✅ Now access form array after initialization
  const expensesData = this.NewPurchaseService.getFormData("expensesData");

  if (expensesData && expensesData.length) {
    expensesData.forEach((exp: any) => {
      this.expenses.push(this.createExpenseGroup(exp));
    });
  } else {
    this.addExpense(); // one empty row
  }

    this.previousSlabData =
      this.NewPurchaseService.getFormData("stepFirstSlabData");

    this.slabAddForm.get("taxableAmount")?.valueChanges.subscribe(() => {
      this.slabAddForm.updateValueAndValidity(); // Refreshes form validity
    });

    this.slabAddForm.get("ItemTax")?.valueChanges.subscribe(() => {
      this.slabAddForm.updateValueAndValidity(); // Refreshes form validity
    });

    this.slabAddForm.get("purchaseDiscount")?.valueChanges.subscribe(() => {
      this.discountModifiedByUser = true;
    });

    this.WarehouseService.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data.map((element: any) => ({
        name: element.name,
        _id: {
          name: element.name,
          _id: element._id,
        },
      }));
      if (this.previousSlabData) {
        console.log('yes previous value found')
        this.isEditMode = true
        this.discountModifiedByUser = false; // Reset flag when editing existing data
        this.patchSlabValue();
      }
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
      this.allSubCategoryList = resp.data;
    });

    this.slabAddForm.get("vehicleNo")?.valueChanges.subscribe((value) => {
      if (value) {
        const upperCaseValue = value.toUpperCase();
        this.slabAddForm
          .get("vehicleNo")
          ?.setValue(upperCaseValue, { emitEvent: false });
      }
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
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      this.NewPurchaseService.setFormData("expensesData", this.expenses.value);
    }, 500);
  }

  createExpenseGroup(data?: any): FormGroup {
    return this.fb.group({
      type: [data?.type || ''],
      payment: [data?.payment || ''],
      paidBy: [data?.paidBy || '']
    });
  }


  patchSlabValue() {
    if (this.previousSlabData) {
      console.log("previousSlabData", this.previousSlabData);

      // Create a deep copy of slabDetails array to avoid reference issues
      this.slabDetails = this.previousSlabData.slabDetails ? JSON.parse(JSON.stringify(this.previousSlabData.slabDetails)) : [];
      this.slabTotalCost = this.previousSlabData.slabTotalCost;
      console.log("previousSlabData", this.previousSlabData);

      this.slabAddForm.patchValue({
        vehicleNo: this.previousSlabData.vehicleNo,
        warehouse: this.previousSlabData.warehouseDetails,
        invoiceNo: this.previousSlabData.invoiceNo,
        paidToSupplierSlabCost: this.previousSlabData.paidToSupplierSlabCost,
        transportationCharge:
          this.previousSlabData.transportationCharge == 0
            ? null
            : this.previousSlabData.transportationCharge,
        royaltyCharge:
          this.previousSlabData.royaltyCharge == 0
            ? null
            : this.previousSlabData.royaltyCharge,
        purchaseDiscount: this.previousSlabData.purchaseDiscount,
        taxableAmount: this.previousSlabData.taxableAmount,
        nonTaxableAmount: this.previousSlabData.nonTaxableAmount,
        taxable: this.previousSlabData.taxable,
        ItemTax: this.previousSlabData.purchaseItemTax,
        taxApplied: this.previousSlabData.taxApplied,
        totalCost: this.previousSlabData.totalCost,
        totalSQFT: this.previousSlabData.totalSQFT,
      });
    }


    this.calculateTotalAmount();
  }
  addSlabDialog() {
    console.log(this.slabDetails);
    this.rows = [];
    this.marbleName = "";
    this.slabNumber = "";
    this.category = {};
    this.subCategory = {};
    this.noOfPieces = null;
    this.width = null;
    this.length = null;
    this.thickness = null;
    this.finishes = {};
    this.quantity = null;
    this.ratePerSqFeet = null;
    this.totalAmount = null;
    this.addvisible = true;
    this.finishes = this.finisheshList.find(f => f.name === 'Unpolished');
  }

  deleteAccordian(index: number) {
    // Subtract the cost of the deleted slab from the total
    this.slabTotalCost -= Number(this.slabDetails[index].totalCosting || 0);
  
    // Remove the slab at the specified index
    this.slabDetails.splice(index, 1);
  
    // Update the slab count in the service
    this.NewPurchaseService.slabDetailsLengthCount(this.slabDetails?.length);
  
    // Update calculations
    this.calculateTotalAmount();
  
    // Get the current form data
    const formData = this.slabAddForm.value;
  
    // Update the service data with the modified slabDetails array
    const payload = {
      warehouseDetails: formData?.warehouse,
      vehicleNo: formData?.vehicleNo ? (formData.vehicleNo.length === 0 ? null : formData.vehicleNo) : null,
      transportationCharge: Number(formData?.transportationCharge || 0),
      royaltyCharge: Number(formData?.royaltyCharge || 0),
      slabDetails: this.slabDetails || [], // Updated slab details with deleted slab removed
      slabTotalCost: Number(this.slabTotalCost || 0)?.toFixed(2),
      totalCost: Number(formData?.totalCost || 0)?.toFixed(2),
      paidToSupplierSlabCost: Number(formData?.paidToSupplierSlabCost || 0),
      purchaseDiscount: Number(formData?.purchaseDiscount || 0)?.toFixed(2),
      nonTaxableAmount: Number(formData?.nonTaxableAmount || 0)?.toFixed(2),
      taxableAmount: Number(formData?.taxableAmount || 0)?.toFixed(2),
      taxable: Number(formData?.taxable || 0)?.toFixed(2),
      purchaseItemTax: formData?.ItemTax,
      taxApplied: Number(formData?.taxApplied || 0)?.toFixed(2),
      totalSQFT: Number(formData?.totalSQFT || 0),
    };
  
    // Update the service with the modified data
    this.NewPurchaseService.setFormData("stepFirstSlabData", payload);
  
    // Emit event for parent component
    this.saveClicked.emit();
  }

  // for get hsn code
  generateProductCode() {
    const payload = {
      category: this.category.name,
      subCategory: this.marbleName,
    };
    this.NewPurchaseService.generateProductCode(payload).subscribe((resp: any) => {
      if (resp) {
        if (resp.status === "success") {
          this.slabNumber = resp.data.productCode;
          this.NewPurchaseService.clearFormData();
          const message = "Generate Product Code has been generated";
          this.messageService.add({ severity: "success", detail: message });
        } else {
          const message = resp.message;
          this.messageService.add({ severity: "error", detail: message });
        }
      }
    });

  }

  generateBarCode() {
    const payload = {
      productId: this.slabNumber
    };
    this.NewPurchaseService.generateBarCode(payload).subscribe((resp: any) => {
      if (resp) {
        if (resp.status === "success") {
          this.barcodeImage = resp.data.barcodeImage;
          this.NewPurchaseService.clearFormData();
          const message = "Generate Product Code has been generated";
          this.messageService.add({ severity: "success", detail: message });
        } else {
          const message = resp.message;
          this.messageService.add({ severity: "error", detail: message });
        }
      }
    });
  }


  getHsnCode(event) {
    this.marbleName = event.name;
    this.generateProductCode();
    let rec = this.allSubCategoryList.find((item) => item._id === event._id);
    if (rec) {
      this.subCategory.hsnCode = rec.hsnCode;
    } else {
      console.error("No matching item found for the selected _id:", event._id);
    }
  }

  closeSlabForm(myForm: NgForm) {
    this.addvisible = false;
    myForm.resetForm();
  }

  openBarCodePopup() {
    this.addbarcodevisible = true;
    this.generateBarCode();
  }

  closeBarCodeForm() {
    this.addbarcodevisible = false;
  }

  addSlabDetails(myForm: NgForm,rowsCopy:any) {
    this.addvisible = false;
    this.cdRef.detectChanges();

    if (!this.slabDetails) {
      this.slabDetails = [];
    }

    if (
      !this.slabNumber ||
      this.totalQuantity === null ||
      this.totalAmount === null ||
      this.ratePerSqFeet === null
    ) {
      const message = "Please fill all required fields.";
      this.messageService.add({ severity: "error", detail: message });
      return;
    }

    // Ensure values are numbers and not null/undefined before calculations
  const totalQuantity = Number(this.totalQuantity) || 0;
  const totalAmount = Number(this.totalAmount) || 0;
  const noOfPieces = Number(this.noOfPieces) || 1; // Avoid division by zero
  const quantity = Number(this.quantity) || 0;
  
  const newSlab = {
      slabName: this.marbleName,
      slabNo: this.slabNumber,
      categoryDetail: this.category,
      subCategoryDetail: this.subCategory,
      noOfPieces: noOfPieces,
      width: this.width,
      length: this.length,
      thickness: this.thickness,
      finishes: this.finishes,
      totalSQFT: totalQuantity,
      ratePerSqFeet: this.ratePerSqFeet,
      totalCosting: totalAmount,
      // purchaseCost: this.totalAmount,
      // warehouseDetails: this.slabAddForm.get("warehouse").value,

      sqftPerPiece: Number(quantity / noOfPieces || 0).toFixed(2),
      costPerSQFT: totalQuantity > 0 ? Number(totalAmount / totalQuantity || 0).toFixed(2) : "0",
      piecesDetails: rowsCopy
    };

    console.log(this.quantity,"newSlab", newSlab,'noOfPieces',this.noOfPieces);

    this.slabDetails.push(newSlab);
  this.NewPurchaseService.slabDetailsLengthCount(this.slabDetails?.length);
  
  // Recalculate the total cost from all slabs to ensure accuracy
  this.slabTotalCost = this.slabDetails.reduce((total, slab) => {
    return total + (Number(slab.totalCosting) || 0);
  }, 0);

    this.marbleName = "";
    this.slabNumber = "";
    this.category = {};
    this.subCategory = {};
    this.noOfPieces = null;
    this.width = null;
    this.length = null;
    this.thickness = null;
    this.finishes = {};
    this.quantity = null;
    this.ratePerSqFeet = null;
    this.totalAmount = null;

    this.calculateTotalAmount();

    // Reset the form to clear validation messages
    this.saveClicked.emit()
    myForm.resetForm();
  }

  findSubCategory(value: any) {
    this.category = value;
    let SubCategoryData = [];
    this.subCategory = {};

    SubCategoryData = this.allSubCategoryList?.filter(
      (e) => e.categoryId._id == value._id
    );

    this.subCategorListByCategory = SubCategoryData?.map((e) => ({
      name: e.name,
      _id: {
        _id: e._id,
        name: e.name,
        hsnCode: e.hsnCode,
      },
    }));

    if (this.previousSlabData) {
      // this.patchSlabValue();
    }
  }


  getSlabDetails(calculateTotalQTY: boolean) {
    console.log("getSlabDetails", calculateTotalQTY);
    if (this.ratePerSqFeet && this.totalQuantity) {
      this.totalAmount = +(this.totalQuantity * this.ratePerSqFeet).toFixed(2);
    }
    else if (this.width && this.length && this.ratePerSqFeet) {
      this.quantity = this.width * this.length / 144;
      this.totalAmount = +(this.totalQuantity * this.ratePerSqFeet).toFixed(2);
    } else if (this.width && this.length) {
      this.quantity = this.width * this.length / 144;
    } else{
      return;
    }

    // Generate rows based on noOfPieces
    if (this.noOfPieces && this.noOfPieces > 0 && this.ratePerSqFeet == null) {
      // Clear existing rows
      this.rows = [];

      // Create new rows based on noOfPieces
      for (let i = 0; i < this.noOfPieces; i++) {
        this.rows.push({
          pieceNumber: i + 1,
          length: this.length || null,
          width: this.width || null,
          thickness: this.thickness || null,
          quantity: this.getFormattedQuantity(),
          finish: this.finishes,
          isEditing: false
        });
      }
    }

    if (calculateTotalQTY) {
      setTimeout(() => {
        this.calculateTotalQuantity();
      }, 500);
    }

    // if (
    //   !this.slabNumber ||
    //   this.quantity === null ||
    //   this.ratePerSqFeet === null
    // ) {
    //   return;
    // }
  }

  getFormattedQuantity(): number | null {
    if (this.length && this.width) {
      const result = this.length * this.width / 144;
      console.log("Formatted Quantity:", result);

      return parseFloat(result.toFixed(2)); // toFixed returns a string, so convert back to number
    }
    return null;
  }

  updateQuantity(row: any) {
    const width = parseFloat(row.width) || 0;
    const length = parseFloat(row.length) || 0;

    const calculatedQuantity = (width * length) / 144;
    row.quantity = +calculatedQuantity.toFixed(2); // convert back to number
    this.calculateTotalQuantity();
  }

  calculateTotalQuantity() {
    this.totalQuantity = this.rows.reduce((sum, row) => {
      const qty = parseFloat(row.quantity);
      return sum + (isNaN(qty) ? 0 : qty);
    }, 0);

    this.totalQuantity = +this.totalQuantity.toFixed(2);
  }



  public setValidations(formControlName: string) {
    return (
      this.slabAddForm.get(formControlName)?.invalid &&
      (this.slabAddForm.get(formControlName)?.dirty ||
        this.slabAddForm.get(formControlName)?.touched)
    );
  }

  originalTaxableAmount: number | null = null;
  originalNonTaxableAmount: number | null = null;
  originalTaxApplied: number | null = null;
  wasDiscountApplied: boolean = false;

  calculateExpenseCharges() {
    let transportationChargesBySupplier = 0;
    let transportationChargesBySelf = 0;
    let royaltyChargesBySupplier = 0;
    let royaltyChargesBySelf = 0;
    let otherByChargesSupplier = 0;
    let otherByChargesSelf = 0;

    this.expenses.controls.forEach((expenseGroup: any) => {
      const type = expenseGroup.get('type')?.value;
      const paidBy = expenseGroup.get('paidBy')?.value;
      const payment = Number(expenseGroup.get('payment')?.value) || 0;

      if (paidBy === 'supplier') {
        if (type === 'transportationCharge') transportationChargesBySupplier += payment;
        if (type === 'royaltyCharges') royaltyChargesBySupplier += payment;
        if (type === 'otherCharges') otherByChargesSupplier += payment;
      } else if (paidBy === 'self') {
        if (type === 'transportationCharge') transportationChargesBySelf += payment;
        if (type === 'royaltyCharges') royaltyChargesBySelf += payment;
        if (type === 'otherCharges') otherByChargesSelf += payment;
      }
    });

    const totalTransportation = transportationChargesBySupplier + transportationChargesBySelf;
    const totalRoyalty = royaltyChargesBySupplier + royaltyChargesBySelf;
    const totalOther = otherByChargesSupplier + otherByChargesSelf;

    // Optional: update parent form (if required)
    this.expensesForm.patchValue({
      transportationCharge: totalTransportation,
      royaltyCharge: totalRoyalty,
      otherCharge: totalOther,
    });

    console.log('--- Expense Breakdown ---');
    console.log('Transportation by Supplier:', transportationChargesBySupplier);
    console.log('Transportation by Self:', transportationChargesBySelf);
    console.log('Royalty by Supplier:', royaltyChargesBySupplier);
    console.log('Royalty by Self:', royaltyChargesBySelf);
    console.log('Other by Supplier:', otherByChargesSupplier);
    console.log('Other by Self:', otherByChargesSelf);

    return {
      transportation: { supplier: transportationChargesBySupplier, self: transportationChargesBySelf },
      royalty: { supplier: royaltyChargesBySupplier, self: royaltyChargesBySelf },
      other: { supplier: otherByChargesSupplier, self: otherByChargesSelf },
      total: {
        transportation: totalTransportation,
        royalty: totalRoyalty,
        other: totalOther
      }
    };
  }

  get expenseControls(): FormGroup[] {
    return this.expenses.controls as FormGroup[];
  }


  // Helper method to prevent NaN values and ensure proper formatting
  safeNumber(value: any, defaultValue: number = 0): string {
    const num = Number(value);
    return isNaN(num) ? defaultValue.toFixed(2) : num.toFixed(2);
  }

  calculateTotalAmount() {
    this.nextBtnDisabled.emit(this.slabAddForm);
    const expenseBreakdown = this.calculateExpenseCharges();
    
    // Fix any existing NaN values in slabDetails
    if (this.slabDetails && this.slabDetails.length > 0) {
      this.slabDetails = this.slabDetails.map(slab => {
        if (slab && (slab.costPerSQFT === 'NaN' || isNaN(slab.costPerSQFT))) {
          const totalSQFT = Number(slab.totalSQFT) || 0;
          const totalCosting = Number(slab.totalCosting) || 0;
          slab.costPerSQFT = totalSQFT > 0 ? this.safeNumber(totalCosting / totalSQFT) : '0.00';
        }
        return slab;
      });
    }
    
    // Always recalculate slabTotalCost from all slabs in slabDetails to ensure accuracy
    if (this.slabDetails && this.slabDetails.length > 0) {
      // Recalculate slabTotalCost from all slabs
      this.slabTotalCost = this.slabDetails.reduce((total, slab) => {
        return total + (Number(slab.totalCosting) || 0);
      }, 0);
    } else {
      this.slabTotalCost = 0; // Reset if no slabs
    }
    
    this.NewPurchaseService.taxableAmountFun(this.slabAddForm.get('taxableAmount')?.value);
    console.log(this.slabAddForm.get('ItemTax')?.value, "ItemTax");
    this.NewPurchaseService.taxFun(this.slabAddForm.get('ItemTax')?.value);

    // this.slabAddForm.patchValue({
    //   nonTaxableAmount: this.slabTotalCost -  this.slabAddForm.get('taxableAmount')?.value
    // });

    // this.nonTaxableAmount = this.slabAddForm.get("nonTaxableAmount").value;
    const totalSupplierExpenses = expenseBreakdown.royalty.supplier + expenseBreakdown.transportation.supplier + expenseBreakdown.other.supplier
    const form = this.slabAddForm;
    const slabTotalAmount = this.slabTotalCost;
    // const royaltyCharge = Number(form.get("royaltyCharge")?.value) || 0;
    const royaltyCharge = expenseBreakdown.royalty.self || expenseBreakdown.royalty.supplier;
    const otherCharge = expenseBreakdown.other.self || expenseBreakdown.other.supplier;
    // const transportationCharge =
    //   Number(form.get("transportationCharge")?.value) || 0;
    const transportationCharge = expenseBreakdown.transportation.self || expenseBreakdown.transportation.supplier;
    const purchaseDiscount = Number(form.get("purchaseDiscount")?.value) || 0;
    const tax = form.get("ItemTax")?.value || [];
    let taxableAmount = Number(form.get("taxableAmount")?.value) || 0;
    let nonTaxableAmount = Number(form.get("nonTaxableAmount")?.value) || 0;
    console.log(this.slabAddForm.get("nonTaxableAmount").value, "nonTaxableAmount", nonTaxableAmount);
    let taxable = 0;
    let transportationAndOtherChargePerSQFT = 0;
    let transportationChargesPerSlab = 0;
    let otherChargesPerSlab = 0;
    let royaltyChargesPerSlab = 0;

    if (
      this.originalTaxableAmount === null ||
      this.originalNonTaxableAmount === null ||
      !this.wasDiscountApplied
    ) {
      this.originalTaxableAmount = taxableAmount;
      this.originalNonTaxableAmount = nonTaxableAmount;
      this.originalTaxApplied = 0;
    }




    let totalSQFT = 0;
    let totalSlabAmount = 0;
    this.slabDetails.forEach((element: any) => {
      totalSQFT += element?.totalSQFT;
      totalSlabAmount += element?.totalCosting;
    });
    transportationAndOtherChargePerSQFT = Number(
      (transportationCharge + royaltyCharge + otherCharge) / totalSQFT
    );
    transportationChargesPerSlab = Number(transportationCharge / totalSQFT);
    otherChargesPerSlab = Number(otherCharge / totalSQFT);
    royaltyChargesPerSlab = Number(royaltyCharge / totalSQFT);
    if (slabTotalAmount) {
      nonTaxableAmount =
        taxableAmount && taxableAmount <= slabTotalAmount
          ? slabTotalAmount - taxableAmount + totalSupplierExpenses
          : slabTotalAmount - 0 + totalSupplierExpenses;

      this.maxPurchaseAmount = slabTotalAmount;

      form.patchValue({
        nonTaxableAmount,
        paidToSupplierSlabCost: totalSlabAmount,
      });
    }

    let taxApplied = 0;
    if (Array.isArray(tax)) {
      tax.forEach((selectedTax: any) => {
        taxApplied += (taxableAmount * selectedTax.taxRate) / 100;
      });
    } else if (tax) {
      taxApplied = (taxableAmount * tax) / 100;
    }


    // Check if slabDetails is empty   code  Add by ravi
    if (this.slabDetails.length === 0) {
      // If no data in slabDetails, clear the related fields
      form.patchValue({
        taxableAmount: 0,
        nonTaxableAmount: 0,
        paidToSupplierSlabCost: 0,
        taxable: 0,
        taxApplied: 0,
        totalCost: 0,
        totalSQFT: 0,
      });
      this.slabDetails = []; // Clear slabDetails data
      const formData = this.slabAddForm.value;

      const payload = {
        warehouseDetails: formData.warehouse,
        vehicleNo: formData.vehicleNo,
        transportationCharge: Number(formData.transportationCharge),
        royaltyCharge: Number(formData.royaltyCharge),
        slabDetails: this.slabDetails || [],
        slabTotalCost: Number(this.slabTotalCost),
        // totalCost: Number(formData?.totalCost),
        // paidToSupplierSlabCost: Number(formData.paidToSupplierSlabCost),
        purchaseDiscount: Number(formData.purchaseDiscount),
        // nonTaxableAmount: Number(formData.nonTaxableAmount),
        // taxableAmount: Number(formData.taxableAmount),
        // taxable: Number(formData.taxable),
        purchaseItemTax: null,
        taxableAmount: 0,
        nonTaxableAmount: 0,
        paidToSupplierSlabCost: 0,
        taxable: 0,
        taxApplied: 0,
        totalCost: 0,
        totalSQFT: 0,
      };
      this.NewPurchaseService.setFormData("stepFirstSlabData", payload);

      return; // Exit the function early as there's no data
    }

    let calculatedDetails = this.slabDetails.map((e: any) => ({
      ...e,
      taxAmountPerSQFT: Number(
        ((taxApplied / this.slabTotalCost) * Number(e.totalCosting)) /
        Number(e.totalSQFT)
      ).toFixed(2),
    }));

    if (this.isEditMode && this.previousSlabData) {
      console.log('🟡 Edit Mode - Using API Values');

      const apiTaxableAmount = this.previousSlabData.taxableAmount || 0;
      const apiPurchaseDiscount = this.previousSlabData.purchaseDiscount || 0;

      // Step 1: Calculate Non-Taxable Amount as Total SQFT * Rate per SQFT
      nonTaxableAmount = totalSlabAmount;

      // Step 2: Deduct API taxable amount from calculated Non-Taxable Amount
      nonTaxableAmount -= apiTaxableAmount;

      // Step 3: Deduct the Purchase Discount following original logic
      // let remainingDiscount = apiPurchaseDiscount;

      // Step 3: Deduct the Purchase Discount following original logic
      let remainingDiscount = this.discountModifiedByUser
        ? purchaseDiscount  // Use user's updated discount value
        : apiPurchaseDiscount;  // Use API's original discount value



      nonTaxableAmount =
        taxableAmount && taxableAmount <= slabTotalAmount
          ? slabTotalAmount - taxableAmount + totalSupplierExpenses
          : slabTotalAmount - 0 + totalSupplierExpenses;



      if (nonTaxableAmount > 0) {
        const discountApplied = Math.min(nonTaxableAmount, remainingDiscount);
        nonTaxableAmount -= discountApplied;
        remainingDiscount -= discountApplied;
      }


      if (remainingDiscount > 0) {
        taxableAmount -= remainingDiscount;
      }



      form.patchValue({
        nonTaxableAmount: Number(nonTaxableAmount).toFixed(2),
        taxableAmount: taxableAmount ? Number(taxableAmount).toFixed(2) : 0,
        // purchaseDiscount: apiPurchaseDiscount ? Number(apiPurchaseDiscount).toFixed(2) : 0
        purchaseDiscount: this.discountModifiedByUser
          ? Number(purchaseDiscount).toFixed(2) // Preserve modified value
          : Number(apiPurchaseDiscount).toFixed(2) // Use API value if untouched
      });

    } else {
      // New Entry Mode Logic
      console.log('🟢 New Entry Mode - Using Original Discount Logic');

      nonTaxableAmount =
        taxableAmount && taxableAmount <= slabTotalAmount
          ? slabTotalAmount - taxableAmount + totalSupplierExpenses
          : slabTotalAmount - 0 + totalSupplierExpenses;

      // Discount Logic (Your Original Logic)
      if (purchaseDiscount) {
        let remainingDiscount = purchaseDiscount;

        if (nonTaxableAmount > 0) {
          const discountApplied = Math.min(nonTaxableAmount, remainingDiscount);
          nonTaxableAmount -= discountApplied;
          remainingDiscount -= discountApplied;
        }

        if (remainingDiscount > 0) {
          taxableAmount = Math.max(taxableAmount - remainingDiscount, 0);
        }
      }

      let taxApplied = 0;
      if (Array.isArray(tax)) {
        tax.forEach((selectedTax: any) => {
          taxApplied += (taxableAmount * selectedTax.taxRate) / 100;
        });
      } else if (tax) {
        taxApplied = (taxableAmount * tax) / 100;
      }

      form.patchValue({
        nonTaxableAmount: Number(nonTaxableAmount).toFixed(2),
        taxableAmount: taxableAmount ? Number(taxableAmount).toFixed(2) : 0,
        purchaseDiscount: purchaseDiscount ? Number(purchaseDiscount).toFixed(2) : 0,
        taxApplied: Number(taxApplied).toFixed(2)
      });
    }

    taxable = taxApplied + taxableAmount;

    calculatedDetails = calculatedDetails.map((e: any, index: any) => {
      // Calculate costPerSQFT with fallback to prevent NaN
      const ratePerSqFeet = Number(e.ratePerSqFeet) || 0;
      const taxAmountPerSQFT = Number(e.taxAmountPerSQFT) || 0;
      const transportCharge = Number(transportationAndOtherChargePerSQFT) || 0;
      
      // Calculate the cost - this should never be NaN now
      const costValue = ratePerSqFeet + taxAmountPerSQFT + transportCharge;
      
      // Final safety check - if somehow it's still NaN, use 0
      const finalCostPerSQFT = isNaN(costValue) ? 0 : costValue;
      
      return {
        ...e,
        costPerSQFT: Number(finalCostPerSQFT).toFixed(2),
        sellingPricePerSQFT: Number(
          (Number(e.ratePerSqFeet) || 0) +
          (Number(e.taxAmountPerSQFT) || 0) +
          (Number(transportationAndOtherChargePerSQFT) || 0)
        ).toFixed(2),
      transportationCharges: Number(
        transportationChargesPerSlab * e.totalSQFT
      ).toFixed(2),
      royaltyCharges: Number(royaltyChargesPerSlab * e.totalSQFT).toFixed(2),
      otherCharges: Number(otherChargesPerSlab * e.totalSQFT).toFixed(2),
      slabSize: `${e.width ? e.width : " "} x ${e.length ? e.length : " "} x ${e.thickness ? e.thickness : " "
        }`,
      purchaseCost:
        ((Number(e.ratePerSqFeet) || 0) +
          (Number(e.taxAmountPerSQFT) || 0) +
          (Number(transportationAndOtherChargePerSQFT) || 0)) *
        (Number(e.totalSQFT) || 0),
      warehouseDetails: this.slabAddForm?.value?.warehouse,
    };
    });

    taxable = taxApplied + taxableAmount;
    const paidToSupplierSlabAmount = taxable + nonTaxableAmount;

    console.log("Taxable:", taxable);
    console.log("Non-Taxable Amount:", nonTaxableAmount);
    console.log("Purchase Discount:", purchaseDiscount);
    console.log("Transportation Charge:", transportationCharge);
    console.log("Royalty Charge:", royaltyCharge);


    const totalCost =
      taxable +
      nonTaxableAmount +
      purchaseDiscount +
      transportationCharge +
      royaltyCharge +
      otherCharge;

    console.log("Total Cost:", totalCost);
    form.patchValue({
      paidToSupplierSlabCost: paidToSupplierSlabAmount
        ? Number(paidToSupplierSlabAmount).toFixed(2)
        : 0,
      taxable: Number(taxable).toFixed(2),
      taxApplied: Number(taxApplied).toFixed(2),
      taxableAmount: taxableAmount ? Number(taxableAmount).toFixed(2) : 0,
      totalCost: Number(totalCost),
      totalSQFT: Number(totalSQFT),
    });
    this.slabDetails = [...calculatedDetails];

    this.setValidator();
  }

  trackByFn(index: number, item: any) {
    return index; // or use a unique identifier if available like: item.id
  }

  setValidator() {
    this.slabAddForm
      .get("taxableAmount")
      ?.setValidators([Validators.min(0), Validators.max(this.slabTotalCost)]);
    this.slabAddForm
      .get("nonTaxableAmount")
      ?.setValidators([Validators.min(0), Validators.max(this.slabTotalCost)]);
    this.slabAddForm
      .get("purchaseDiscount")
      ?.setValidators([
        Validators.min(0),
        Validators.max(this.maxPurchaseAmount),
      ]);
    this.slabAddForm.get("purchaseDiscount")?.updateValueAndValidity;
    this.slabAddForm.get("nonTaxableAmount")?.updateValueAndValidity;
    this.slabAddForm.get("taxableAmount")?.updateValueAndValidity;
  }

  slabAddFormSubmit() {
    this.calculateTotalAmount(); // Ensure calculations are up-to-date
    const formData = this.slabAddForm.value;
    console.log('formData', formData)
    
    // Helper function to safely convert values to numbers and format them
    const safeNumberFormat = (value: any, defaultValue: number = 0): string => {
      const num = Number(value);
      return isNaN(num) ? defaultValue.toFixed(2) : num.toFixed(2);
    };
    
    // Ensure we have valid values for all numeric fields
    const slabTotalCost = Number(this.slabTotalCost) || 0;
    
    // Check if nonTaxableAmount is 0 but there's a total amount, recalculate it
    let nonTaxableAmount = Number(formData?.nonTaxableAmount || 0);
    if (nonTaxableAmount === 0 && slabTotalCost > 0 && this.slabDetails?.length > 0) {
      // If nonTaxableAmount is 0 but we have slabs, recalculate it
      const taxableAmount = Number(formData?.taxableAmount || 0);
      nonTaxableAmount = slabTotalCost - taxableAmount;
      if (nonTaxableAmount < 0) nonTaxableAmount = 0;
      
      // Update the form value
      this.slabAddForm.patchValue({
        nonTaxableAmount: nonTaxableAmount.toFixed(2)
      });
      
      // Get the updated form data
      formData.nonTaxableAmount = nonTaxableAmount.toFixed(2);
    }
    
    const payload = {
      warehouseDetails: formData?.warehouse,
      vehicleNo: formData?.vehicleNo ? (formData.vehicleNo.length === 0 ? null : formData.vehicleNo) : null,
      transportationCharge: Number(formData?.transportationCharge || 0),
      royaltyCharge: Number(formData?.royaltyCharge || 0),
      slabDetails: this.slabDetails || [],
      slabTotalCost: safeNumberFormat(slabTotalCost),
      totalCost: safeNumberFormat(formData?.totalCost),
      paidToSupplierSlabCost: Number(formData?.paidToSupplierSlabCost || 0),
      purchaseDiscount: safeNumberFormat(formData?.purchaseDiscount),
      nonTaxableAmount: safeNumberFormat(formData?.nonTaxableAmount),
      taxableAmount: safeNumberFormat(formData?.taxableAmount),
      taxable: safeNumberFormat(formData?.taxable),
      purchaseItemTax: formData?.ItemTax,
      taxApplied: safeNumberFormat(formData?.taxApplied),
      totalSQFT: Number(formData?.totalSQFT || 0),
    };
    
    this.NewPurchaseService.setFormData("stepFirstSlabData", payload);
    // this.saveClicked.emit()
  }

  addEmptyRow() {
    this.products.push({
      id: this.products.length + 1,
      code: '',
      name: '',
      inventoryStatus: '',
      price: ''
    });
  }

  addRow() {
    const lastPieceNumber = this.rows.length > 0
      ? this.rows[this.rows.length - 1].pieceNumber
      : 0;

    const newRow = {
      pieceNumber: lastPieceNumber + 1,
      length: this.length || 0,
      width: this.width || 0,
      thickness: this.width || 0,
      quantity: this.getFormattedQuantity() || 0,
      finish: this.finishes || {},
      isEditing: true
    };

    this.rows.push(newRow);
    this.noOfPieces = this.rows.length;
    setTimeout(() => {
      this.calculateTotalQuantity();
    }, 500);
    // this.getSlabDetails(false);
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1);

    // Reassign piece numbers after deletion
    this.rows.forEach((row, i) => {
      row.pieceNumber = i + 1;
    });
    this.noOfPieces = this.rows.length;
    this.calculateTotalQuantity();
    // this.getSlabDetails(false);
  }



  //   addRow() {
  //   this.rows.push({
  //     pieceNumber: null,
  //     length: null,
  //     width: null,
  //     thickness: null,
  //     quantity: null,
  //     finish: null
  //   });
  // }

  // deleteRow(index: number) {
  //   this.rows.splice(index, 1);
  // }

  enableEdit(row: any) {
    row.isEditing = true;
    this.editedRowBackup = { ...row }; // shallow copy
  }

  saveRow(row: any) {
    console.log(row, 'saveRow');
    console.log(this.rows, 'this.rows');
    this.rows.forEach((r: any, i) => {
      if (r.pieceNumber === row.pieceNumber) {
        this.rows[i] = row; // update the row in the array
      }
    })
    console.log('Updated Rows:', this.rows);
    row.isEditing = false;
    this.editedRowBackup = null;
    // this.getSlabDetails(false);
  }

  cancelEdit(row: any) {
    Object.assign(row, this.editedRowBackup); // revert changes
    row.isEditing = false;
    this.editedRowBackup = null;
  }

  toggleExpenses(): void {
    this.expensesExpanded = !this.expensesExpanded;
  }

  get expenses(): FormArray {
    return this.expensesForm.get('expenses') as FormArray;
  }

  updatePaidBy(index: number, value: string) {
    const expenseControl = this.expenses.at(index);
    if (expenseControl) {
      expenseControl.get('paidBy')?.setValue(value);
      this.calculateTotalAmount();
    }
  }



  createExpense(): FormGroup {
    return this.fb.group({
      type: ['', Validators.required],
      payment: ['', Validators.required],
      paidBy: ['self', Validators.required]
    });
  }

  addExpense(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.expenses.push(this.createExpense());
  }

  removeExpense(index: number): void {
    this.expenses.removeAt(index);
    this.calculateTotalAmount();
  }

  logSlabDetails(myForm:NgForm): void {
    console.log("<<<<<<<<<<<<<<<<<<<<<rows:", this.rows);
    // First make a deep copy of the rows data to preserve it
    const rowsCopy = JSON.parse(JSON.stringify(this.rows));
    // Calculate total amount and add slab details
    this.calculateTotalAmount();
    this.addSlabDetails(myForm,rowsCopy);
    // Set form data after processing is complete, using the preserved copy
    // this.NewPurchaseService.setFormData("piecesDetails", rowsCopy);
  }



}


