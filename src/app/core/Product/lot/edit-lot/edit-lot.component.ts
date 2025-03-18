import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, NgForm, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
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
  selector: "app-edit-lot",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  templateUrl: "./edit-lot.component.html",
  styleUrl: "./edit-lot.component.scss",
})
export class EditLotComponent {
  lotEditForm: FormGroup;
  maxDate = new Date();
  public routes = routes;
  activeIndex: number[] = [0]; // or any other indices you want active by default
  totalBlocksArea: number = 0;
  blocksDetails = [];
  blockNo: string;
  height: number;
  width: number;
  length: number;
  totalArea: number;
  weightPerBlock: number;
  taxAmountCosting: number;
  rawCosting: number;
  transportationCosting: number;
  royaltyCosting: number;
  totalCosting: number;
  isProcessed: boolean = false;
  addvisible: boolean = false;
  vehicleRegex = /^[A-Z]{2}[ -]?[0-9]{1,2}(?: ?[A-Z])?(?: ?[A-Z]*)? ?[0-9]{4}$/;
  lotTotalCost: number = 0;
  previousLotTotalCost: number = 0;
  wareHousedata: any = [];
  blockProcessorList: any = [];
  blockProcessor: any = {};
  orderTaxList: any[];
  taxesListData: any;
  rowCosting: number;
  categoryList: any[];
  CategoryListsEditArray: any[];

  allSubCategoryList: any = [];
  subCategorListByCategory: any = [];
  maxPurchaseAmount = 0;
  previouslotData: any;
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
    this.lotEditForm = this.fb.group(
      {
        lotNo: [
          "",
          [
            Validators.required,
            Validators.pattern(validationRegex.oneToFiftyCharRegex),
          ],
        ],
        lotName: [
          "",
          [
            Validators.required,
            Validators.pattern(validationRegex.oneToFiftyCharRegex),
          ],
        ],
        vehicleNo: ["", [Validators.pattern(this.vehicleRegex)]],
        warehouse: ["", [Validators.required]],
        lotWeight: [
          "",
          [Validators.required, Validators.min(1), Validators.max(10000)],
        ],
        pricePerTon: [
          "",
          [Validators.required, Validators.min(1), Validators.max(1000000)],
        ],
        paidToSupplierLotCost: ["", [Validators.required]],
        purchaseDiscount: ["", [Validators.min(0)]],
        transportationCharge: ["", [Validators.min(0), Validators.max(100000)]],
        royaltyCharge: ["", [Validators.min(0), Validators.max(100000)]],
        lotRowCost: [""],
        blocksCount: [""],
        averageWeight: [""],
        nonTaxableAmount: [""],
        taxableAmount: [""],
        ItemTax: [""],
        taxable: [""],
        taxApplied: [""],
        averageTransport: [""],
        averageRoyalty: [""],
        categoryDetail: ["", [Validators.required]],
        subCategoryDetail: ["", [Validators.required]],
        totalTransportationCharges: [""],
      },
      { 
        // validators: atLeastOneRequiredValidator(),
        validators: this.taxSelectionValidator() 
       }
    );
  }
  ngOnInit(): void {
    this.previouslotData =
      this.NewPurchaseService.getFormData("stepFirstLotData");
      // if(this.previouslotData){
      //   this.patchLotValue();
      // }

      this.lotEditForm.get('taxableAmount')?.valueChanges.subscribe(() => {
        this.lotEditForm.updateValueAndValidity();  // Refreshes form validity
      });
    
      this.lotEditForm.get('ItemTax')?.valueChanges.subscribe(() => {
        this.lotEditForm.updateValueAndValidity();  // Refreshes form validity
      });

      
console.log('this.previouslotData',this.previouslotData)
    this.WarehouseService.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data.map((element: any) => ({
        name: element.name,
        _id: {
          name: element.name,
          _id: element._id,
        },
      }));
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
      console.log('sub cate', this.allSubCategoryList)
      if (this.allSubCategoryList && this.previouslotData) {

        if(this.previouslotData?.lotDetails){
          this.findSubCategory(this.previouslotData?.lotDetails?.categoryDetail);
        }else{
          this.findSubCategory(this.previouslotData?.categoryDetail);
        }

       
      }
    });

    this.lotEditForm.get("vehicleNo")?.valueChanges.subscribe((value) => {
      if (value) {
        const upperCaseValue = value.toUpperCase();
        this.lotEditForm
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
    this.ServiceblockProcessor.getAllBlockProcessorData().subscribe(
      (data: any) => {
        this.blockProcessorList = [];
        data.forEach((element: any) => {
          this.blockProcessorList.push({
            name: element.name,
            _id: {
              _id: element._id,
              name: element.name,
            },
          });
        });
      }
    );

    // this.findSubCategory(this.previouslotData?.categoryDetail)
  }

   taxSelectionValidator(): ValidatorFn {
      return (control: AbstractControl) => {
        const taxableAmount = control.get('taxableAmount')?.value || 0;
        const selectedTaxes = control.get('ItemTax')?.value;
    
        if (taxableAmount && (!selectedTaxes || selectedTaxes.length === 0)) {
          return { taxRequired: true }; // Custom error key
        }
        return null;
      };
    }

  // patchLotValue() {
  //   if (this.previouslotData) {
  //     this.blocksDetails = this.previouslotData?.lotDetails?.blockDetails 
  //     this.blocksDetails?.forEach((element) => {
  //       this.totalBlocksArea += element.totalArea;
  //     });
  //     console.log("this.previouslotData>>", this.previouslotData);
  //     this.lotEditForm.patchValue({
  //       lotNo: this.previouslotData.lotDetails.lotNo,
  //       lotName: this.previouslotData.lotDetails.lotName,
  //       vehicleNo: this.previouslotData.lotDetails.vehicleNo,
  //       warehouse: this.previouslotData.lotDetails.warehouseDetails,
  //       invoiceNo: this.previouslotData.lotDetails.invoiceNo,
  //       lotWeight: this.previouslotData.lotDetails.lotWeight,
  //       pricePerTon: this.previouslotData.lotDetails.pricePerTon,
  //       paidToSupplierLotCost: this.previouslotData.lotDetails.paidToSupplierLotCost,
  //       transportationCharge:
  //         this.previouslotData.lotDetails.transportationCharge == 0
  //           ? null
  //           : this.previouslotData.lotDetails.transportationCharge,
  //       royaltyCharge:
  //         this.previouslotData.lotDetails.royaltyCharge == 0
  //           ? null
  //           : this.previouslotData.lotDetails.royaltyCharge,
  //       notes: this.previouslotData.lotDetails.notes,
  //       blocksCount: this.previouslotData.lotDetails.blocksCount,
  //       averageWeight: this.previouslotData.lotDetails.averageWeight,
  //       averageTransport: this.previouslotData.lotDetails.averageTransport,
  //       averageRoyalty: this.previouslotData.lotDetails.averageRoyalty,
  //       averageTaxAmount: this.previouslotData.lotDetails.averageTaxAmount,
  //       lotRowCost: this.previouslotData.lotDetails.lotRowCost,
  //       purchaseDiscount: this.previouslotData.lotDetails.purchaseDiscount,
  //       taxableAmount: this.previouslotData.taxableAmount,
  //       nonTaxableAmount: this.previouslotData.lotDetails.nonTaxableAmount,
  //       taxable: this.previouslotData.lotDetails.taxable,
  //       ItemTax: this.previouslotData.purchaseItemTax,
  //       taxApplied: this.previouslotData.lotDetails.taxApplied,
  //       categoryDetail: this.previouslotData.lotDetails.categoryDetail,
  //       subCategoryDetail: this.previouslotData.lotDetails.subCategoryDetail?._id,
  //     });
  //   }
  //   this.calculateTotalAmount();
  // }

  patchLotValue(category:any) {
    if (this.previouslotData) {
      this.blocksDetails = this.previouslotData?.lotDetails ? this.previouslotData?.lotDetails?.blockDetails : this.previouslotData?.blockDetails;
      this.blocksDetails?.forEach((element) => {
        this.totalBlocksArea += element.totalArea;
      });
      console.log("this.previouslotData>>", this.previouslotData);
      const lotDetails = this.previouslotData.lotDetails || {}; // Fallback object for lotDetails
      this.lotEditForm.patchValue({
        lotNo: lotDetails.lotNo || this.previouslotData.lotNo,
        lotName: lotDetails.lotName || this.previouslotData.lotName,
        vehicleNo: lotDetails.vehicleNo || this.previouslotData.vehicleNo,
        warehouse: lotDetails.warehouseDetails || this.previouslotData.warehouseDetails,
        invoiceNo: lotDetails.invoiceNo || this.previouslotData.invoiceNo,
        lotWeight: lotDetails.lotWeight || this.previouslotData.lotWeight,
        pricePerTon: lotDetails.pricePerTon || this.previouslotData.pricePerTon,
        paidToSupplierLotCost: lotDetails.paidToSupplierLotCost || this.previouslotData.paidToSupplierLotCost,
        transportationCharge: lotDetails.transportationCharge || this.previouslotData.transportationCharge || null,
        royaltyCharge: lotDetails.royaltyCharge || this.previouslotData.royaltyCharge || null,
        notes: lotDetails.notes || this.previouslotData.notes,
        blocksCount: lotDetails.blocksCount || this.previouslotData.blocksCount,
        averageWeight: lotDetails.averageWeight || this.previouslotData.averageWeight,
        averageTransport: lotDetails.averageTransport || this.previouslotData.averageTransport,
        averageRoyalty: lotDetails.averageRoyalty || this.previouslotData.averageRoyalty,
        averageTaxAmount: lotDetails.averageTaxAmount || this.previouslotData.averageTaxAmount,
        lotRowCost: lotDetails.lotRowCost || this.previouslotData.lotRowCost,
        purchaseDiscount: lotDetails.purchaseDiscount || this.previouslotData.purchaseDiscount,
        taxableAmount: this.previouslotData.taxableAmount,
        nonTaxableAmount: lotDetails.nonTaxableAmount || this.previouslotData.nonTaxableAmount,
        taxable: lotDetails.taxable || this.previouslotData.taxable,
        ItemTax: this.previouslotData.purchaseItemTax,
        taxApplied: lotDetails.taxApplied || this.previouslotData.taxApplied,
        categoryDetail:category || this.previouslotData.categoryDetail,
        subCategoryDetail: lotDetails.subCategoryDetail?._id || this.previouslotData.subCategoryDetail?._id,
      });
      // this.previouslotData ={}
    }
    this.calculateTotalAmount();
  }
  
  addBlockDialog() {
    this.blockNo = "";
    this.height = null;
    this.width = null;
    this.length = null;
    this.totalArea = null;
    this.addvisible = true;
  }

  deleteAccordian(index: number) {
    this.totalBlocksArea -= Number(this.blocksDetails[index].totalArea);
    this.blocksDetails.splice(index, 1);
    this.calculateTotalAmount();
  }

  clossBlock(myForm: NgForm) {
    this.addvisible = false;
    myForm.resetForm();
  }
  addBlock(myForm: NgForm) {
    this.addvisible = false;
    this.cdRef.detectChanges();

    if (
      !this.blockNo ||
      this.height === null ||
      this.width === null ||
      this.length === null
    ) {
      const message = "Please fill all required fields.";
      this.messageService.add({ severity: "error", detail: message });
      return;
    }

    const newBlock = {
      blockNo: this.blockNo,
      height: this.height,
      width: this.width,
      length: this.length,
      totalArea: this.totalArea,
      weightPerBlock: this.weightPerBlock,
      rawCosting: this.rawCosting,
      transportationCosting: this.transportationCosting,
      royaltyCosting: this.royaltyCosting,
      taxAmountCosting: this.taxAmountCosting,
      totalCosting: this.totalCosting,
      blockProcessor: this.blockProcessor,
      isProcessed: this.isProcessed,
    };

    this.blocksDetails.push(newBlock);
    this.totalBlocksArea += Number(this.totalArea);

    this.blockNo = "";
    this.height = null;
    this.width = null;
    this.length = null;
    this.totalArea = null;
    this.blockProcessor = null;

    this.calculateTotalAmount();

    // Reset the form to clear validation messages
    myForm.resetForm();
  }

  // findSubCategory(value: any) {
  //   console.log('value',value)
  //   this.lotEditForm.get("subCategoryDetail").reset();
  //   let SubCategoryData = [];
  
  //   console.log('this.allSubCategoryList',this.allSubCategoryList)
  //   let rec = this.previouslotData?.lotDetails ? this.previouslotData?.lotDetails?.subCategoryDetail : this.previouslotData?.subCategoryDetail
  //   console.log('rec',rec)
  //   SubCategoryData = this.allSubCategoryList?.filter(
  //     (e) => e.categoryId._id == value?._id 
  //   );

  //   console.log('SubCategoryData',SubCategoryData)
  //   this.subCategorListByCategory = SubCategoryData?.map((e) => ({
  //     name: e.name,
  //     _id: {
  //       _id: e._id,
  //       name: e.name,
  //     },
  //   }));

  //   // Add by ravi for subcategory map
  //   // this.subCategorListByCategory = this.allSubCategoryList?.filter(
  //   //   (e) => e._id == rec?._id
  //   // );
  //   console.log('this.subCategorListByCategory ',this.subCategorListByCategory )
  //   if (this.previouslotData) {
  //     this.patchLotValue(value);
  //   }
  // }

  findSubCategory(value: any) {
    console.log('value>',value)
    let SubCategoryData = []
    this.lotEditForm.get("subCategoryDetail").reset();
    SubCategoryData = this.allSubCategoryList?.filter(
      (e) => e.categoryId._id == value?._id
    );
    console.log('SubCategoryData',SubCategoryData)
    this.subCategorListByCategory = SubCategoryData?.map((e) => ({
      name: e.name,
      _id: e._id
    }));

    console.log('this.subCategorListByCategory',this.subCategorListByCategory)
    if (this.previouslotData) {
      this.patchLotValue(value)
    }
  }

  getblockDetails() {
    if (
      isNaN(this.height) ||
      isNaN(this.width) ||
      isNaN(this.length) ||
      this.height === null ||
      this.width === null ||
      this.length === null
    ) {
      return;
    }
    this.totalArea = this.height * this.width * this.length;
  }
  originalTaxableAmount: number | null = null;
  originalNonTaxableAmount: number | null = null;
  originalTaxApplied: number | null = null;
  // Flag to track if a discount was previously applied
  wasDiscountApplied: boolean = false;
  calculateTotalAmount() {
    const form = this.lotEditForm;
    const lotWeight = Number(form.get("lotWeight")?.value) || 0;
    const pricePerTon = Number(form.get("pricePerTon")?.value) || 0;
    const royaltyCharge = Number(form.get("royaltyCharge")?.value) || 0;
    const transportationCharge = Number(form.get("transportationCharge")?.value) || 0;
    const purchaseDiscount = Number(form.get("purchaseDiscount")?.value) || 0;
    const tax = form.get("ItemTax")?.value || [];
    // Get current values from form
    let taxableAmount = Number(form.get("taxableAmount")?.value) || 0;
    let nonTaxableAmount = Number(form.get("nonTaxableAmount")?.value) || 0;
    let taxable = 0;
    // Calculate base lot cost
    if (lotWeight && pricePerTon) {
      const lotWeightmultiPricePerton = lotWeight * pricePerTon;
      this.rowCosting = lotWeightmultiPricePerton;
        nonTaxableAmount =
          taxableAmount && taxableAmount <= lotWeightmultiPricePerton
            ? lotWeightmultiPricePerton - taxableAmount
            : lotWeightmultiPricePerton;
  
        this.maxPurchaseAmount = lotWeightmultiPricePerton;
  // Step 2: Reset Original Values to New Base Values
  this.originalTaxableAmount = taxableAmount;
  this.originalNonTaxableAmount = nonTaxableAmount;
  
        form.patchValue({
          nonTaxableAmount,
          paidToSupplierLotCost: lotWeightmultiPricePerton,
          taxableAmount: taxableAmount.toFixed(2),
        });
      }
  
    // IMPORTANT: Store original values if this is the first calculation or if discount was not applied before
    if (this.originalTaxableAmount === null || this.originalNonTaxableAmount === null || !this.wasDiscountApplied) {
      this.originalTaxableAmount = taxableAmount;
      this.originalNonTaxableAmount = nonTaxableAmount;
     
    }
  
    // Calculate tax before discount
      let taxApplied = 0;
      if (Array.isArray(tax)) {
        tax.forEach((selectedTax: any) => {
          taxApplied += (taxableAmount * selectedTax.taxRate) / 100;
        });
      } else if (tax) {
        taxApplied = (taxableAmount * tax) / 100;
      }
  
    // Store original tax applied
    if (this.originalTaxApplied === null || !this.wasDiscountApplied) {
      this.originalTaxApplied = taxApplied;
      // console.log(`Stored Original Tax Applied: ${this.originalTaxApplied}`);
    }
  
    // Check if discount is being applied or removed
    if (purchaseDiscount > 0) {
      
      // Use the original values for discount calculation
      let discountedTaxableAmount = this.originalTaxableAmount;
      let discountedNonTaxableAmount = this.originalNonTaxableAmount;
      let totalAmount = discountedTaxableAmount + discountedNonTaxableAmount;
      
   
      if (purchaseDiscount > totalAmount) {
        console.error('❌ Discount exceeds the total taxable + non-taxable amount.');
        alert('Discount cannot exceed the total taxable + non-taxable amount.');
        form.patchValue({
          purchaseDiscount: 0
        });
        return; // Stop further calculation
      }
      
      let remainingDiscount = purchaseDiscount;
  
      
      
      // First, subtract from non-taxable amount
      if (discountedNonTaxableAmount > 0) {
        if (remainingDiscount <= discountedNonTaxableAmount) {
          discountedNonTaxableAmount -= remainingDiscount;
          remainingDiscount = 0;
          // console.log(`Discount fully applied to Non-Taxable Amount`);
        } else {
          remainingDiscount -= discountedNonTaxableAmount;
          discountedNonTaxableAmount = 0;
          // console.log(`Non-Taxable Amount reduced to zero, remaining discount: ${remainingDiscount}`);
        }
      }
  
      // If there's remaining discount, subtract from taxable amount
      if (remainingDiscount > 0) {
        discountedTaxableAmount -= remainingDiscount;
        // console.log(`Remaining discount applied to Taxable Amount`);
      }
  
      // Update current values with discounted amounts
      taxableAmount = discountedTaxableAmount;
      nonTaxableAmount = discountedNonTaxableAmount;
      
      // Set flag that discount was applied
      this.wasDiscountApplied = true;
  
      form.patchValue({
        nonTaxableAmount: Number(nonTaxableAmount).toFixed(2),
        taxableAmount: taxableAmount ? Number(taxableAmount).toFixed(2) : 0,
      });
  
      
      // Recalculate tax with the new taxable amount
      taxApplied = 0;
      if (Array.isArray(tax)) {
        tax.forEach((selectedTax: any) => {
          taxApplied += (taxableAmount * selectedTax.taxRate) / 100;
        });
      } else if (tax) {
        taxApplied = (taxableAmount * tax) / 100;
      }
      
      // console.log(`Tax Applied After Discount: ${taxApplied}`);
      
    } else if (this.wasDiscountApplied) { 
      // If discount was previously applied but now removed
      
      // Restore original values
      taxableAmount = this.originalTaxableAmount;
      nonTaxableAmount = this.originalNonTaxableAmount;
      taxApplied = this.originalTaxApplied;
      
      // Reset flag
      this.wasDiscountApplied = false;
      
      form.patchValue({
        nonTaxableAmount: Number(nonTaxableAmount).toFixed(2),
        taxableAmount: taxableAmount ? Number(taxableAmount).toFixed(2) : 0,
      });
      
     
    } else {
    
      taxApplied = 0;
      if (Array.isArray(tax)) {
        tax.forEach((selectedTax: any) => {
          taxApplied += (taxableAmount * selectedTax.taxRate) / 100;
        });
      } else if (tax) {
        taxApplied = (taxableAmount * tax) / 100;
      }
    }
  
    // Calculate final values
    taxable = taxApplied + taxableAmount;
    const lotRowCost = taxable + nonTaxableAmount + (purchaseDiscount ? purchaseDiscount : 0);
    const paidToSupplierLotAmount = taxable + nonTaxableAmount;
  
   
  
      form.patchValue({
        paidToSupplierLotCost: paidToSupplierLotAmount
          ? Number(paidToSupplierLotAmount).toFixed(2)
          : 0,
        lotRowCost: Number(lotRowCost),
        taxable: Number(taxable).toFixed(2),
        taxApplied: Number(taxApplied).toFixed(2),
        taxableAmount: taxableAmount ? Number(taxableAmount).toFixed(2) : 0,
      });
      const totalTransportationCharge = transportationCharge * lotWeight;
      const averageTransportation = totalTransportationCharge / lotWeight;
      const averageRoyalty = royaltyCharge / lotWeight;
      const averageBlocksWeight = this.totalBlocksArea / lotWeight;
      const blockPricePerTon = lotRowCost / lotWeight;
  
      this.blocksDetails.forEach((element: any) => {
        element.weightPerBlock = element.totalArea / averageBlocksWeight;
        element.rawCosting = element.weightPerBlock * blockPricePerTon;
        element.transportationCosting =
          element.weightPerBlock * averageTransportation;
        element.royaltyCosting = element.weightPerBlock * averageRoyalty;
        element.totalCosting =
          element.rawCosting +
          element.transportationCosting +
          element.royaltyCosting;
      });
  
      form.patchValue({
        averageTransport: averageTransportation,
        averageRoyalty: averageRoyalty,
        averageWeight: averageBlocksWeight,
        totalTransportationCharges: totalTransportationCharge,
      });
  
      this.setValidations();
    }

  setValidations() {
    this.lotEditForm
      .get("taxableAmount")
      ?.setValidators([Validators.min(0), Validators.max(this.rowCosting)]);
    this.lotEditForm
      .get("nonTaxableAmount")
      ?.setValidators([Validators.min(0), Validators.max(this.rowCosting)]);
    this.lotEditForm
      .get("purchaseDiscount")
      ?.setValidators([
        Validators.min(0),
        Validators.max(this.maxPurchaseAmount),
      ]);
    this.lotEditForm.get("purchaseDiscount")?.updateValueAndValidity;
    this.lotEditForm.get("nonTaxableAmount")?.updateValueAndValidity;
    this.lotEditForm.get("taxableAmount")?.updateValueAndValidity;
  }

  LotEditFormSubmit() {
    const formData = this.lotEditForm.value;
    if (!this.lotTotalCost) {
      this.blocksDetails.forEach((e: any) => {
        this.lotTotalCost += e.totalCosting;
      });
      console.log('formdata>>>',formData)

      let subcate = this.allSubCategoryList.filter((i)=> i._id === formData?.subCategoryDetail)
      console.log('subcate',subcate)
      const payload = {
        lotNo: formData.lotNo,
        lotName: formData.lotName,
        warehouseDetails: formData.warehouse,
        vehicleNo: formData.vehicleNo,
        lotWeight: formData.lotWeight,
        pricePerTon: Number(formData.pricePerTon),
        transportationCharge: Number(formData.transportationCharge),
        royaltyCharge: Number(formData.royaltyCharge),
        blocksCount: this.blocksDetails.length,
        averageWeight: formData.averageWeight,
        averageTransport: Number(formData.averageTransport),
        averageRoyaltyNumber: formData.averageRoyalty,
        blockDetails: this.blocksDetails,
        lotTotalCost: Number(this.lotTotalCost),
        paidToSupplierLotCost: Number(formData.paidToSupplierLotCost),
        purchaseDiscount: Number(formData.purchaseDiscount),
        lotRowCost: Number(formData.lotRowCost),
        date: "",
        notes: "",
        nonTaxableAmount: Number(formData.nonTaxableAmount),
        taxableAmount: Number(formData.taxableAmount),
        taxable: Number(formData.taxable),
        purchaseItemTax: formData.ItemTax,
        taxApplied: Number(formData.taxApplied),
        categoryDetail: formData.categoryDetail,
        subCategoryDetail:subcate[0],
        totalTransportationCharges: Number(formData.totalTransportationCharges),
      };
      console.log('payload',payload)
      this.NewPurchaseService.setFormData("stepFirstLotData", payload);
    }
  }
}
