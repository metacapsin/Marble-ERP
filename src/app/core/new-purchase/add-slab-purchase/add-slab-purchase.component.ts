import { ChangeDetectorRef, Component, OnDestroy } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, NgForm, NgModel, Validators } from "@angular/forms";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { MessageService } from "primeng/api";
import { NewPurchaseService } from "src/app/core/new-purchase/new-purchase.service";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
import { atLeastOneRequiredValidator, validationRegex } from "src/app/core/validation";
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
  slabDetails = [];
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

  allSubCategoryList: any = [];
  subCategorListByCategory: any = [];
  maxPurchaseAmount = 0;
  previousSlabData: any;

  finisheshList = [
    { name: "Polished" },
    { name: "Unpolished" },
    { name: "Semi polished" },
  ];
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
    this.slabAddForm = this.fb.group({
      vehicleNo: ["", [Validators.pattern(this.vehicleRegex)]],
      warehouse: ["", [Validators.required]],
      paidToSupplierSlabCost: ["", [Validators.required]],
      taxableAmount: [""],
      nonTaxableAmount: [""],
      ItemTax: [""],
      taxable: [""], // taxbale Amount + apply tax amount
      taxApplied: [""], // tax applied ammount
      purchaseDiscount: ["", [Validators.min(0),]],
      transportationCharge: ["", [Validators.min(0), Validators.max(100000)]],
      royaltyCharge: ["", [Validators.min(0), Validators.max(100000)]],
      totalCost: [""],
      totalSQFT: [""],
    }, { validators: atLeastOneRequiredValidator() });
  }
  ngOnInit(): void {
    this.previousSlabData = this.NewPurchaseService.getFormData("stepFirstSlabData");

    this.WarehouseService.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data.map((element: any) => ({
        name: element.name,
        _id: {
          name: element.name,
          _id: element._id,
        },
      }));
      if (this.previousSlabData) {
        this.patchSlabValue()
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
      console.log('previousSlabData', this.previousSlabData);

      this.slabDetails = this.previousSlabData.slabDetails;
     this.slabTotalCost = this.previousSlabData.slabTotalCost

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
          this.previousSlabData.royaltyCharge == 0 ? null : this.previousSlabData.royaltyCharge,
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
    this.marbleName = '';
    this.slabNumber = '';
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
  }

  deleteAccordian(index: number) {
    this.slabTotalCost -= Number(this.slabDetails[index].totalAmount);
    this.slabDetails.splice(index, 1);
    this.calculateTotalAmount();
  }

  closeSlabForm(myForm: NgForm) {
    this.addvisible = false;
    myForm.resetForm();
  }

  addSlabDetails(myForm: NgForm) {
    this.addvisible = false;
    this.cdRef.detectChanges();

    if (!this.slabNumber ||
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
      quantity: this.quantity,
      ratePerSqFeet: this.ratePerSqFeet,
      totalAmount: this.totalAmount,
      sqftPerPiece: Number((this.quantity / this.noOfPieces)).toFixed(2),
    };

    this.slabDetails.push(newSlab);
    this.slabTotalCost += Number(this.totalAmount);

    this.marbleName = '';
    this.slabNumber = '';
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
    myForm.resetForm();
  }

  findSubCategory(value: any) {
    let SubCategoryData = []
    this.subCategory = {};

    SubCategoryData = this.allSubCategoryList?.filter(
      (e) => e.categoryId._id == value._id
    );

    this.subCategorListByCategory = SubCategoryData?.map((e) => ({
      name: e.name,
      _id: {
        _id: e._id,
        name: e.name,
      },
    }));

    if (this.previousSlabData) {
      this.patchSlabValue()
    }
  }


  getSlabDetails() {
    if (
      !this.slabNumber ||
      this.quantity === null ||
      this.ratePerSqFeet === null
    ) {
      return;
    }
    this.totalAmount = this.quantity * this.ratePerSqFeet;
  }

  public setValidations(formControlName: string) {
    return (
      this.slabAddForm.get(formControlName)?.invalid &&
      (this.slabAddForm.get(formControlName)?.dirty ||
        this.slabAddForm.get(formControlName)?.touched)
    );
  }
  calculateTotalAmount() {
    const form = this.slabAddForm;
    const slabTotalAmount = this.slabTotalCost;
    const royaltyCharge = Number(form.get("royaltyCharge")?.value) || 0;
    const transportationCharge = Number(form.get("transportationCharge")?.value) || 0;
    const purchaseDiscount = Number(form.get("purchaseDiscount")?.value) || 0;
    const tax = form.get("ItemTax")?.value || [];
    let taxableAmount = Number(form.get("taxableAmount")?.value) || 0;
    let nonTaxableAmount = Number(form.get("nonTaxableAmount")?.value) || 0;
    let taxable = 0;
    let transportationAndOtherChargePerSQFT = 0;
    let transportationChargesPerSlab = 0;
    let otherChargesPerSlab = 0;

    let totalSQFT = 0
    let totalSlabAmount = 0
    this.slabDetails.forEach((element: any) => {
      totalSQFT += element?.quantity
      totalSlabAmount += element?.totalAmount
    });
    transportationAndOtherChargePerSQFT = Number((transportationCharge + royaltyCharge) / totalSQFT);
    transportationChargesPerSlab = Number(transportationCharge / totalSQFT);
    otherChargesPerSlab = Number(royaltyCharge / totalSQFT);
    if (slabTotalAmount) {
      nonTaxableAmount = taxableAmount && taxableAmount <= slabTotalAmount
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

    let calculatedDetails = this.slabDetails.map((e: any) => ({
      ...e,
      taxAmountPerSQFT: Number(((taxApplied / this.slabTotalCost) * Number(e.totalAmount)) / Number(e.quantity)).toFixed(4),
    }));

    if (purchaseDiscount) {
      if (!nonTaxableAmount) {
        taxableAmount -= purchaseDiscount;
      } else {
        nonTaxableAmount -= purchaseDiscount;
        form.patchValue({
          nonTaxableAmount,
        });
      }
    }


    calculatedDetails = calculatedDetails.map((e: any,index:any) => ({
      ...e,
      costPerSQFT: Number(Number(e.ratePerSqFeet) + Number(e.taxAmountPerSQFT) + Number(transportationAndOtherChargePerSQFT)).toFixed(4),
      sellingPricePerSQFT: Number(Number(e.ratePerSqFeet) + Number(e.taxAmountPerSQFT) + Number(transportationAndOtherChargePerSQFT)).toFixed(4),
      transportationCharges: Number(transportationChargesPerSlab * e.quantity).toFixed(4),
      otherCharges: Number(otherChargesPerSlab * e.quantity).toFixed(4),
      slabSize: `${e.width ? e.width : " "} x ${e.length ? e.length : " "} x ${e.thickness ? e.thickness : " "}`,
      warehouseDetails: this.slabAddForm?.value?.warehouse,
    }));

    taxable = taxApplied + taxableAmount;
    const paidToSupplierSlabAmount = taxable + nonTaxableAmount;
    const totalCost = taxable + nonTaxableAmount + purchaseDiscount + transportationCharge + royaltyCharge;
    form.patchValue({
      paidToSupplierSlabCost: paidToSupplierSlabAmount ? Number(paidToSupplierSlabAmount).toFixed(2) : 0,
      taxable: Number(taxable).toFixed(2),
      taxApplied: Number(taxApplied).toFixed(2),
      taxableAmount: taxableAmount ? Number(taxableAmount).toFixed(2) : 0,
      totalCost: Number(totalCost),
      totalSQFT: Number(totalSQFT)
    });
    this.slabDetails = [...calculatedDetails];
    this.setValidator();
  }

  trackByFn(index: number, item: any) {
    return index; // or use a unique identifier if available like: item.id
  }

  setValidator() {
    this.slabAddForm.get("taxableAmount")?.setValidators([Validators.min(0), Validators.max(this.slabTotalCost)]);
    this.slabAddForm.get("nonTaxableAmount")?.setValidators([Validators.min(0), Validators.max(this.slabTotalCost)]);
    this.slabAddForm.get("purchaseDiscount")?.setValidators([Validators.min(0), Validators.max(this.maxPurchaseAmount)]);
    this.slabAddForm.get("purchaseDiscount")?.updateValueAndValidity;
    this.slabAddForm.get("nonTaxableAmount")?.updateValueAndValidity;
    this.slabAddForm.get("taxableAmount")?.updateValueAndValidity;
  }

  slabAddFormSubmit() {
    const formData = this.slabAddForm.value;
    if (this.slabTotalCost) {
      const payload = {
        warehouseDetails: formData.warehouse,
        vehicleNo: formData.vehicleNo,
        transportationCharge: Number(formData.transportationCharge),
        royaltyCharge: Number(formData.royaltyCharge),
        slabDetails: this.slabDetails,
        slabTotalCost: Number(this.slabTotalCost),
        totalCost: Number(formData?.totalCost),
        paidToSupplierSlabCost: Number(formData.paidToSupplierSlabCost),
        purchaseDiscount: Number(formData.purchaseDiscount),
        nonTaxableAmount: Number(formData.nonTaxableAmount),
        taxableAmount: Number(formData.taxableAmount),
        taxable: Number(formData.taxable),
        purchaseItemTax: formData.ItemTax,
        taxApplied: Number(formData.taxApplied),
        totalSQFT: Number(formData.totalSQFT)
      };
      this.NewPurchaseService.setFormData("stepFirstSlabData", payload);
    }
  }
}
