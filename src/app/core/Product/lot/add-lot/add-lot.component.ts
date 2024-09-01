import { ChangeDetectorRef, Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { MessageService } from "primeng/api";
import { NewPurchaseService } from "src/app/core/new-purchase/new-purchase.service";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
import { validationRegex } from "src/app/core/validation";
import { blockProcessorService } from "src/app/core/block-processor/block-processor.service";
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
  perBlockWeight: number;
  addvisible: boolean = false;
  shortNameRegex = /^[^\s.-][a-zA-Z0-9_.\s-]{2,50}$/;
  vehicleRegex = /^[A-Z]{2}[ -]?[0-9]{1,2}(?: ?[A-Z])?(?: ?[A-Z]*)? ?[0-9]{4}$/;
  lotTotalCost: number = 0;
  previousLotTotalCost: number = 0;
  wareHousedata: any = [];
  blockProcessorList: any = [];
  blockProcessor: any = {};

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef,
    private NewPurchaseService: NewPurchaseService,
    private WarehouseService: WarehouseService,
    private ServiceblockProcessor: blockProcessorService,
  ) {
    this.lotAddForm = this.fb.group({
      lotNo: ["", [Validators.required, Validators.pattern(validationRegex.oneToFiftyCharRegex)]],
      lotName: ["", [Validators.required, Validators.pattern(validationRegex.oneToFiftyCharRegex)]],
      vehicleNo: ["", [Validators.pattern(this.vehicleRegex)]],
      warehouse: ["", [Validators.required]],
      lotWeight: ["", [Validators.required, Validators.min(1), Validators.max(10000)]],
      pricePerTon: ["", [Validators.required, Validators.min(1), Validators.max(1000000)]],
      paidToSupplierLotCost: ["", [Validators.required]],
      purchaseDiscount: ["", [Validators.min(0), Validators.max(100000)]],
      transportationCharge: ["", [Validators.min(0), Validators.max(100000)]],
      royaltyCharge: ["", [Validators.min(0), Validators.max(100000)]],
      lotRowCost: [""],
      blocksCount: [""],
      averageWeight: [""],
      averageTransport: [""],
      averageRoyalty: [""],
    });
  }
  ngOnInit(): void {
    this.WarehouseService.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data.map((element: any) => ({
        name: element.name,
        _id: {
          name: element.name,
          _id: element._id,
        },
      }));

      this.lotAddForm.get('vehicleNo')?.valueChanges.subscribe(value => {
        if (value) {
          const upperCaseValue = value.toUpperCase();
          this.lotAddForm.get('vehicleNo')?.setValue(upperCaseValue, { emitEvent: false });
        }
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
        console.log(this.blockProcessorList);
      }
    );
    let lotData = this.NewPurchaseService.getFormData("stepTwoData");

    if (lotData) {
      this.blocksDetails = lotData.blockDetails
      this.blocksDetails.forEach(element => {
        this.totalBlocksArea += element.totalArea
      });

      this.lotAddForm.patchValue({
        lotNo: lotData.lotNo,
        lotName: lotData.lotName,
        vehicleNo: lotData.vehicleNo,
        warehouse: lotData.warehouseDetails,
        invoiceNo: lotData.invoiceNo,
        lotWeight: lotData.lotWeight,
        pricePerTon: lotData.pricePerTon,
        paidToSupplierLotCost: lotData.paidToSupplierLotCost,
        transportationCharge: lotData.transportationCharge,
        royaltyCharge: lotData.royaltyCharge,
        notes: lotData.notes,
        blocksCount: lotData.blocksCount,
        averageWeight: lotData.averageWeight,
        averageTransport: lotData.averageTransport,
        averageRoyalty: lotData.averageRoyalty,
        averageTaxAmount: lotData.averageTaxAmount,
        lotRowCost: lotData.lotRowCost,
        purchaseDiscount: lotData.purchaseDiscount,
      });
      this.calculateTotalAmount()
    }
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
    console.log("Delete OBJ.");
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
    let paidToSupplierLotCost: number;
    let lotRowCost: number;
    let lotWeight: number = this.lotAddForm.get("lotWeight").value;
    let pricePerTon = this.lotAddForm.get("pricePerTon").value;
    let royaltyCharge: number = this.lotAddForm.get("royaltyCharge").value;
    let transportationCharge: number = this.lotAddForm.get("transportationCharge").value;
    let purchaseDiscount: number = this.lotAddForm.get("purchaseDiscount").value;

    if (lotWeight && pricePerTon) {
      paidToSupplierLotCost = lotWeight * pricePerTon;
      lotRowCost = lotWeight * pricePerTon;
      paidToSupplierLotCost = paidToSupplierLotCost - purchaseDiscount;
      this.lotAddForm.get("paidToSupplierLotCost").patchValue(paidToSupplierLotCost.toFixed(2));
      this.lotAddForm.get("lotRowCost").patchValue(lotRowCost.toFixed(3));
    }
    let averageTransportation = transportationCharge / lotWeight;
    let averageRoyalty = royaltyCharge / lotWeight;
    let averageBlocksWeight = this.totalBlocksArea / lotWeight;

    this.blocksDetails.forEach((element: any) => {
      element.weightPerBlock = element.totalArea / averageBlocksWeight;
      element.rawCosting = parseFloat(element.weightPerBlock) * pricePerTon;
      element.transportationCosting =
        parseFloat(element.weightPerBlock) * averageTransportation;
      element.royaltyCosting =
        parseFloat(element.weightPerBlock) * averageRoyalty;
      let rawCosting = parseFloat(element.rawCosting);
      let transportationCosting = parseFloat(element.transportationCosting);
      let royaltyCosting = parseFloat(element.royaltyCosting);
      element.totalCosting =
        rawCosting + transportationCosting + royaltyCosting;
    });

    this.lotAddForm.patchValue({
      averageTransport: averageTransportation,
      averageRoyalty: averageRoyalty,
      // averageTaxAmount: averageTaxAmount,
      // lotTotalCost: this.lotTotalCost,
      averageWeight: averageBlocksWeight,
    });
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
        averageRoyaltyNumber: (formData.averageRoyalty),
        blockDetails: this.blocksDetails,
        lotTotalCost: Number(this.lotTotalCost),
        paidToSupplierLotCost: Number(formData.paidToSupplierLotCost),
        purchaseDiscount: Number(formData.purchaseDiscount),
        lotRowCost: Number(formData.lotRowCost),
        date: "",
        notes: "",
      };

      this.NewPurchaseService.setFormData('stepTwoData', payload)
    }
  }
}
