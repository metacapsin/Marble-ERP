import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { Router } from "@angular/router";
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
  selector: "app-add-lot",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  templateUrl: "./add-lot.component.html",
  styleUrl: "./add-lot.component.scss",
})
export class AddLotComponent {
  lotAddForm: FormGroup;
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
    this.lotAddForm = this.fb.group({
      lotNo: ["", [Validators.required, Validators.pattern(validationRegex.oneToFiftyCharRegex)]],
      lotName: ["",
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
      purchaseDiscount: ["", [Validators.min(0), Validators.max(100000)]],
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

    }, { validators: atLeastOneRequiredValidator() });
  }
  ngOnInit(): void {
    this.previouslotData = this.NewPurchaseService.getFormData("stepFirstLotData");

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
      // this.allSubCategoryList.forEach((element: any) => {
      //   this.SubCategoryListsEditArray.push({
      //     name: element.name,
      //     _id: {
      //       _id: element._id,
      //       name: element.name,
      //     },
      //   });
      // });
      if(this.allSubCategoryList && this.previouslotData){
        this.findSubCategory(this.previouslotData?.categoryDetail)
      }
    });

    this.lotAddForm.get("vehicleNo")?.valueChanges.subscribe((value) => {
      if (value) {
        const upperCaseValue = value.toUpperCase();
        this.lotAddForm
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

  patchLotValue() {
    if (this.previouslotData) {
      this.blocksDetails = this.previouslotData.blockDetails;
      this.blocksDetails.forEach((element) => {
        this.totalBlocksArea += element.totalArea;
      });

      this.lotAddForm.patchValue({
        lotNo: this.previouslotData.lotNo,
        lotName: this.previouslotData.lotName,
        vehicleNo: this.previouslotData.vehicleNo,
        warehouse: this.previouslotData.warehouseDetails,
        invoiceNo: this.previouslotData.invoiceNo,
        lotWeight: this.previouslotData.lotWeight,
        pricePerTon: this.previouslotData.pricePerTon,
        paidToSupplierLotCost: this.previouslotData.paidToSupplierLotCost,
        transportationCharge:
          this.previouslotData.transportationCharge == 0
            ? null
            : this.previouslotData.transportationCharge,
        royaltyCharge:
          this.previouslotData.royaltyCharge == 0 ? null : this.previouslotData.royaltyCharge,
        notes: this.previouslotData.notes,
        blocksCount: this.previouslotData.blocksCount,
        averageWeight: this.previouslotData.averageWeight,
        averageTransport: this.previouslotData.averageTransport,
        averageRoyalty: this.previouslotData.averageRoyalty,
        averageTaxAmount: this.previouslotData.averageTaxAmount,
        lotRowCost: this.previouslotData.lotRowCost,
        purchaseDiscount: this.previouslotData.purchaseDiscount,
        taxableAmount: this.previouslotData.taxableAmount,
        nonTaxableAmount: this.previouslotData.nonTaxableAmount,
        taxable: this.previouslotData.taxable,
        ItemTax: this.previouslotData.purchaseItemTax,
        taxApplied: this.previouslotData.taxApplied,
        categoryDetail: this.previouslotData.categoryDetail,
        subCategoryDetail: this.previouslotData.subCategoryDetail,
      });
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

  findSubCategory(value: any) {
    console.log(value);

    let SubCategoryData = []
    this.lotAddForm.get("subCategoryDetail").reset();
    console.log('allSubCategoryList', this.allSubCategoryList);
    
    SubCategoryData = this.allSubCategoryList?.filter(
      (e) => e.categoryId._id == value._id
    );

    console.log('SubCategoryData', SubCategoryData);
    
    this.subCategorListByCategory = SubCategoryData?.map((e) => ({
      name: e.name,
      _id: {
        _id: e._id,
        name: e.name,
      },
    }));


    console.log('subCategorListByCategory', this.subCategorListByCategory);

    if (this.previouslotData) {
      this.patchLotValue()
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
  calculateTotalAmount() {
    const form = this.lotAddForm;
    const lotWeight = Number(form.get("lotWeight")?.value) || 0;
    const pricePerTon = Number(form.get("pricePerTon")?.value) || 0;
    const royaltyCharge = Number(form.get("royaltyCharge")?.value) || 0;
    const transportationCharge = Number(form.get("transportationCharge")?.value) || 0;
    const purchaseDiscount = Number(form.get("purchaseDiscount")?.value) || 0;
    const tax = form.get("ItemTax")?.value || [];
    let taxableAmount = Number(form.get("taxableAmount")?.value) || 0;
    let nonTaxableAmount = Number(form.get("nonTaxableAmount")?.value) || 0;
    let taxable = 0;
    if (lotWeight && pricePerTon) {
      const lotWeightmultiPricePerton = lotWeight * pricePerTon;
      this.rowCosting = lotWeightmultiPricePerton;
      nonTaxableAmount = taxableAmount && taxableAmount <= lotWeightmultiPricePerton
        ? lotWeightmultiPricePerton - taxableAmount
        : lotWeightmultiPricePerton;

      this.maxPurchaseAmount = lotWeightmultiPricePerton - 10000;

      form.patchValue({
        nonTaxableAmount,
        paidToSupplierLotCost: lotWeightmultiPricePerton,
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

    taxable = taxApplied + taxableAmount;
    const lotRowCost = taxable + nonTaxableAmount + purchaseDiscount;
    const paidToSupplierLotAmount = taxable + nonTaxableAmount;

    form.patchValue({
      paidToSupplierLotCost: paidToSupplierLotAmount ? Number(paidToSupplierLotAmount).toFixed(2) : 0,
      lotRowCost: Number(lotRowCost),
      taxable: Number(taxable).toFixed(2),
      taxApplied: Number(taxApplied).toFixed(2),
      taxableAmount: taxableAmount ? Number(taxableAmount).toFixed(2) : 0,
    });

    const averageTransportation = transportationCharge / lotWeight;
    const averageRoyalty = royaltyCharge / lotWeight;
    const averageBlocksWeight = this.totalBlocksArea / lotWeight;
    const blockPricePerTon = lotRowCost / lotWeight;

    this.blocksDetails.forEach((element: any) => {
      element.weightPerBlock = element.totalArea / averageBlocksWeight;
      element.rawCosting = element.weightPerBlock * blockPricePerTon;
      element.transportationCosting = element.weightPerBlock * averageTransportation;
      element.royaltyCosting = element.weightPerBlock * averageRoyalty;
      element.totalCosting = element.rawCosting + element.transportationCosting + element.royaltyCosting;
    });

    form.patchValue({
      averageTransport: averageTransportation,
      averageRoyalty: averageRoyalty,
      averageWeight: averageBlocksWeight,
    });

    this.setValidations();
  }

  setValidations() {
    this.lotAddForm.get("taxableAmount")?.setValidators([Validators.min(0), Validators.max(this.rowCosting)]);
    this.lotAddForm.get("nonTaxableAmount")?.setValidators([Validators.min(0), Validators.max(this.rowCosting)]);
    this.lotAddForm.get("purchaseDiscount")?.setValidators([Validators.min(0), Validators.max(this.maxPurchaseAmount)]);
    this.lotAddForm.get("purchaseDiscount")?.updateValueAndValidity;
    this.lotAddForm.get("nonTaxableAmount")?.updateValueAndValidity;
    this.lotAddForm.get("taxableAmount")?.updateValueAndValidity;
  }

  LotAddFormSubmit() {
    const formData = this.lotAddForm.value;
    if (!this.lotTotalCost) {
      this.blocksDetails.forEach((e: any) => {
        this.lotTotalCost += e.totalCosting;
      });
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
        subCategoryDetail: formData.subCategoryDetail,
      };
      this.NewPurchaseService.setFormData("stepFirstLotData", payload);
    }
  }
}
