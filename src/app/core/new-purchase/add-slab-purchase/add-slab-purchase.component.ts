import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, Output } from "@angular/core";
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
@Component({
  selector: "app-add-slab-purchase",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  templateUrl: "./add-slab-purchase.component.html",
  styleUrl: "./add-slab-purchase.component.scss",
})
export class AddSlabPurchaseComponent {
  slabAddForm: FormGroup;
  maxDate = new Date();
  public routes = routes;
  activeIndex: number[] = [0];
  @Output() saveClicked: EventEmitter<void> = new EventEmitter();
  slabDetails: any[] = [];
  marbleName: string;
  slabNumber: string;
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
  vehicleRegex = /^[A-Z]{2}[ -]?[0-9]{1,2}(?: ?[A-Z])?(?: ?[A-Z]*)? ?[0-9]{4}$/;
  slabTotalCost: number = 0;
  wareHousedata: any = [];
  orderTaxList: any[];
  taxesListData: any;
  categoryList: any[];
  CategoryListsEditArray: any[];
  nonTaxableAmount: number;
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

  patchSlabValue() {
    if (this.previousSlabData) {
      console.log("previousSlabData", this.previousSlabData);

      this.slabDetails = this.previousSlabData.slabDetails;
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
    this.slabTotalCost -= Number(this.slabDetails[index].totalCosting);
    this.slabDetails.splice(index, 1);
    this.calculateTotalAmount();
    this.saveClicked.emit()
  }

  // for get hsn code
  getHsnCode(event) {
    this.marbleName = event.name;
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

  addSlabDetails(myForm: NgForm) {
    this.addvisible = false;
    this.cdRef.detectChanges();
  
    if (!this.slabDetails) {
      this.slabDetails = [];
    }

    if (
      !this.slabNumber ||
      this.quantity === null ||
      this.totalAmount === null ||
      this.ratePerSqFeet === null
    ) {
      const message = "Please fill all required fields.";
      this.messageService.add({ severity: "error", detail: message });
      return;
    }

    const newSlab = {
      slabName: this.marbleName,
      slabNo: this.slabNumber,
      categoryDetail: this.category,
      subCategoryDetail: this.subCategory,
      noOfPieces: this.noOfPieces,
      width: this.width,
      length: this.length,
      thickness: this.thickness,
      finishes: this.finishes,
      totalSQFT: this.quantity,
      ratePerSqFeet: this.ratePerSqFeet,
      totalCosting: this.totalAmount,
      // purchaseCost: this.totalAmount,
      // warehouseDetails: this.slabAddForm.get("warehouse").value,

      sqftPerPiece: Number(this.quantity / this.noOfPieces).toFixed(2),
    };

    this.slabDetails.push(newSlab);
    this.slabTotalCost += Number(this.totalAmount);

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

  getSlabDetails() {
    if(this.width && this.length && this.ratePerSqFeet){
      this.quantity = this.width * this.length / 144;
      this.totalAmount = this.quantity * this.ratePerSqFeet;
    } else if (this.width && this.length) {
      this.quantity = this.width * this.length / 144;
    } else {
      return;
    }
    // if (
    //   !this.slabNumber ||
    //   this.quantity === null ||
    //   this.ratePerSqFeet === null
    // ) {
    //   return;
    // }
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

  calculateTotalAmount() {
    this.slabAddForm.patchValue({
      nonTaxableAmount: this.slabTotalCost -  this.slabAddForm.get('taxableAmount')?.value
    });

    this.nonTaxableAmount = this.slabAddForm.get("nonTaxableAmount").value;
    const form = this.slabAddForm;
    const slabTotalAmount = this.slabTotalCost;
    const royaltyCharge = Number(form.get("royaltyCharge")?.value) || 0;
    const transportationCharge =
      Number(form.get("transportationCharge")?.value) || 0;
    const purchaseDiscount = Number(form.get("purchaseDiscount")?.value) || 0;
    const tax = form.get("ItemTax")?.value || [];
    let taxableAmount = Number(form.get("taxableAmount")?.value) || 0;
    let nonTaxableAmount = Number(form.get("nonTaxableAmount")?.value) || 0;
    let taxable = 0;
    let transportationAndOtherChargePerSQFT = 0;
    let transportationChargesPerSlab = 0;
    let otherChargesPerSlab = 0;

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
      (transportationCharge + royaltyCharge) / totalSQFT
    );
    transportationChargesPerSlab = Number(transportationCharge / totalSQFT);
    otherChargesPerSlab = Number(royaltyCharge / totalSQFT);
    if (slabTotalAmount) {
      nonTaxableAmount =
        taxableAmount && taxableAmount <= slabTotalAmount
          ? slabTotalAmount - taxableAmount
          : slabTotalAmount;

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
        purchaseItemTax:null,
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
      ).toFixed(4),
    }));

    // if (purchaseDiscount) {
    //   if (!nonTaxableAmount) {
    //     taxableAmount -= purchaseDiscount;
    //   } else {
    //     nonTaxableAmount -= purchaseDiscount;
    //     form.patchValue({
    //       nonTaxableAmount,
    //     });
    //   }
    // }


// customer to supplier branch calculation

// if (purchaseDiscount) {
//   let remainingDiscount = purchaseDiscount;
//   let discountedNonTaxableAmount = this.originalNonTaxableAmount;
//   let discountedTaxableAmount = this.originalTaxableAmount;

//   if (remainingDiscount <= discountedNonTaxableAmount) {
//     discountedNonTaxableAmount -= remainingDiscount;
//     remainingDiscount = 0;
//   } else {
//     remainingDiscount -= discountedNonTaxableAmount;
//     discountedNonTaxableAmount = 0;
//   }

//   // Recalculate tax with updated taxable amount
//   taxApplied = 0;
//   if (Array.isArray(tax)) {
//     tax.forEach((selectedTax: any) => {
//       taxApplied += (taxableAmount * selectedTax.taxRate) / 100;
//     });
//   } else if (tax) {
//     taxApplied = (taxableAmount * tax) / 100;
//   }

//   console.log(
//     `🟡 Tax Recalculated After Discount/Restoration: ${taxApplied}`
//   );

//   if (remainingDiscount > 0) {
//     discountedTaxableAmount -= remainingDiscount;
//   }

//   taxableAmount = discountedTaxableAmount;
//   nonTaxableAmount = discountedNonTaxableAmount;
//   this.wasDiscountApplied = true;

//   console.log(`Taxable Amount After Discount: ${taxableAmount}`);
//   console.log(`Non-Taxable Amount After Discount: ${nonTaxableAmount}`);

//   // Recalculate tax with updated taxable amount
//   taxApplied = 0;
//   if (Array.isArray(tax)) {
//     tax.forEach((selectedTax: any) => {
//       taxApplied += (taxableAmount * selectedTax.taxRate) / 100;
//     });
//   } else if (tax) {
//     taxApplied = (taxableAmount * tax) / 100;
//   }

//   console.log(
//     `🟡 Tax Recalculated After Discount/Restoration: ${taxApplied}`
//   );

//   form.patchValue({
//     nonTaxableAmount: Number(nonTaxableAmount).toFixed(2),
//     taxableAmount: taxableAmount ? Number(taxableAmount).toFixed(2) : 0,
//     purchaseDiscount: purchaseDiscount ? Number(purchaseDiscount).toFixed(2) : 0

//   });
// } else if (this.wasDiscountApplied) {
//   taxableAmount = this.originalTaxableAmount;
//   nonTaxableAmount = this.originalNonTaxableAmount;
//   taxApplied = this.originalTaxApplied;
//   this.wasDiscountApplied = false;

//   console.log(`Taxable Amount Restored: ${taxableAmount}`);
//   console.log(`Non-Taxable Amount Restored: ${nonTaxableAmount}`);
//   // Recalculate tax with updated taxable amount
//   taxApplied = 0;
//   if (Array.isArray(tax)) {
//     tax.forEach((selectedTax: any) => {
//       taxApplied += (taxableAmount * selectedTax.taxRate) / 100;
//     });
//   } else if (tax) {
//     taxApplied = (taxableAmount * tax) / 100;
//   }

//   console.log(
//     `🟡 Tax Recalculated After Discount/Restoration: ${taxApplied}`
//   );
//   form.patchValue({
//     nonTaxableAmount: Number(nonTaxableAmount).toFixed(2),
//     taxableAmount: taxableAmount ? Number(taxableAmount).toFixed(2) : 0,
//     purchaseDiscount: purchaseDiscount ? Number(purchaseDiscount).toFixed(2) : 0

//   });
// }

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
      ? slabTotalAmount - taxableAmount
      : slabTotalAmount;

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

    calculatedDetails = calculatedDetails.map((e: any, index: any) => ({
      ...e,
      costPerSQFT: Number(
        Number(e.ratePerSqFeet) +
          Number(e.taxAmountPerSQFT) +
          Number(transportationAndOtherChargePerSQFT)
      ).toFixed(4),
      sellingPricePerSQFT: Number(
        Number(e.ratePerSqFeet) +
          Number(e.taxAmountPerSQFT) +
          Number(transportationAndOtherChargePerSQFT)
      ).toFixed(4),
      transportationCharges: Number(
        transportationChargesPerSlab * e.totalSQFT
      ).toFixed(4),
      otherCharges: Number(otherChargesPerSlab * e.totalSQFT).toFixed(4),
      slabSize: `${e.width ? e.width : " "} x ${e.length ? e.length : " "} x ${
        e.thickness ? e.thickness : " "
      }`,
      purchaseCost:
        (Number(e.ratePerSqFeet) +
          Number(e.taxAmountPerSQFT) +
          Number(transportationAndOtherChargePerSQFT)) *
        e.totalSQFT,
      warehouseDetails: this.slabAddForm?.value?.warehouse,
    }));

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
      royaltyCharge;

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
    console.log('formData',formData)
    if (this.slabTotalCost) {
      const payload = {
        warehouseDetails: formData?.warehouse,
        vehicleNo: formData?.vehicleNo ? (formData.vehicleNo.length === 0 ? null : formData.vehicleNo) : null,
        transportationCharge: Number(formData?.transportationCharge),
        royaltyCharge: Number(formData?.royaltyCharge),
        slabDetails: this.slabDetails || [],
        slabTotalCost: Number(this.slabTotalCost)?.toFixed(2),
        totalCost: Number(formData?.totalCost)?.toFixed(2),
        paidToSupplierSlabCost: Number(formData?.paidToSupplierSlabCost),
        purchaseDiscount: Number(formData?.purchaseDiscount)?.toFixed(2),
        nonTaxableAmount: Number(formData?.nonTaxableAmount)?.toFixed(2),
        taxableAmount: Number(formData?.taxableAmount)?.toFixed(2),
        taxable: Number(formData?.taxable)?.toFixed(2),
        purchaseItemTax: formData?.ItemTax,
        taxApplied: Number(formData?.taxApplied)?.toFixed(2),
        totalSQFT: Number(formData?.totalSQFT),
      };
      this.NewPurchaseService.setFormData("stepFirstSlabData", payload);
    }
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
    this.rows.push({
      pieceNumber: null,
      length: null,
      width: null,
      thickness: null,
      quantity: null,
      finish: null
    });
  }

  deleteRow(index: number) {
    this.rows.splice(index, 1);
  }

  enableEdit(row: any) {
  row.isEditing = true;
  this.editedRowBackup = { ...row }; // shallow copy
}

saveRow(row: any) {
  row.isEditing = false;
  this.editedRowBackup = null;
}

cancelEdit(row: any) {
  Object.assign(row, this.editedRowBackup); // revert changes
  row.isEditing = false;
  this.editedRowBackup = null;
}

}


