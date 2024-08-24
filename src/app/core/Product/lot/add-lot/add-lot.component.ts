import { ChangeDetectorRef, Component, EventEmitter, Input, Output, SimpleChanges } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { SharedModule } from "src/app/shared/shared.module";
import { ToastModule } from "primeng/toast";
import { MessageService, SelectItem } from "primeng/api";
import { LotService } from "../lot.service";
import { DialogModule } from "primeng/dialog";
import { CalendarModule } from "primeng/calendar";
import { AccordionModule } from "primeng/accordion";
import { NewPurchaseService } from "src/app/core/new-purchase/new-purchase.service";

import { Subject } from 'rxjs';
import { MatCardLgImage } from "@angular/material/card";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";

@Component({
  selector: "app-add-lot",
  standalone: true,
  imports: [
    SharedModule,
  ],
  providers: [MessageService],
  templateUrl: "./add-lot.component.html",
  styleUrl: "./add-lot.component.scss",
})
export class AddLotComponent {
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  lotAddForm: FormGroup;

  maxDate = new Date();
  public routes = routes;

  subject = new Subject<object>();

  // lotAddForm!: FormGroup;
  // blockAddForm!: FormGroup;
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
  lotPurchaseCost: number;
  invoiceRegex = /^(?=[^\s])([a-zA-Z\d\/\-_ ]{1,50})$/;


  lotTotalCost: number = 0;
  previousLotTotalCost: number = 0;

  wareHousedata: any = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private cdRef: ChangeDetectorRef,
    private NewPurchaseService: NewPurchaseService,
    private WarehouseService: WarehouseService,
  ) {
    this.lotAddForm = this.fb.group({
      lotNo: [
        "",
        [Validators.required, Validators.pattern(this.invoiceRegex)],
      ],
      lotName: [
        "",
        [Validators.required, Validators.pattern(this.invoiceRegex)],
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
      transportationCharge: [
        "",
        [Validators.min(1), Validators.max(100000)],
      ],
      royaltyCharge: [
        "",
        [Validators.min(0), Validators.max(100000)],
      ],
      // notes: ["", [Validators.pattern(this.descriptionRegex)]],
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
    this.lotPurchaseCost = this.NewPurchaseService.getFormData("stepperOneData");
    console.log("stepperOneData", this.lotPurchaseCost);

    let lotData = this.NewPurchaseService.getFormData("stepTwoData");
    console.log("adnan service data", lotData);

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
        transportationCharge: lotData.transportationCharge,
        royaltyCharge: lotData.royaltyCharge,
        notes: lotData.notes,
        blocksCount: lotData.blocksCount,
        averageWeight: lotData.averageWeight,
        averageTransport: lotData.averageTransport,
        averageRoyalty: lotData.averageRoyalty,
        averageTaxAmount: lotData.averageTaxAmount,
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
      isProcessed: this.isProcessed,
    };

    this.blocksDetails.push(newBlock);
    this.totalBlocksArea += Number(this.totalArea);

    this.blockNo = "";
    this.height = null;
    this.width = null;
    this.length = null;
    this.totalArea = null;

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
    console.log(this.lotAddForm
      .get('warehouse')
      ?.value);
    
    let pricePerTon: number;
    let lotWeight: number = this.lotAddForm.get("lotWeight").value || 0;
    if (lotWeight) {
      pricePerTon = this.lotPurchaseCost / lotWeight;
      this.lotAddForm.get("pricePerTon").patchValue(pricePerTon.toFixed(3));
      // this.lotAddForm.get("pricePerTon").disable();
    } else {
      this.lotAddForm.get("pricePerTon").enable();
    }

    // let pricePerTon = this.lotAddForm.get("pricePerTon").value || 0;
    let royaltyCharge: number = this.lotAddForm.get("royaltyCharge").value || 0;
    let transportationCharge: number = this.lotAddForm.get("transportationCharge").value || 0;
    // let taxAmount: number = this.lotAddForm.get("taxAmount").value || 0;

    let averageTransportation = transportationCharge / lotWeight;
    console.log(averageTransportation, "averageTransportation");

    let averageRoyalty = royaltyCharge / lotWeight;
    // let averageTaxAmount = taxAmount / lotWeight;
    let averageBlocksWeight = this.totalBlocksArea / lotWeight;
    console.log(averageTransportation, averageRoyalty);

    this.blocksDetails.forEach((element: any) => {
      element.weightPerBlock = element.totalArea / averageBlocksWeight;
      element.rawCosting = parseFloat(element.weightPerBlock) * pricePerTon;
      element.transportationCosting =
        parseFloat(element.weightPerBlock) * averageTransportation;
      element.royaltyCosting =
        parseFloat(element.weightPerBlock) * averageRoyalty;
      // element.taxAmountCosting =
      //   parseFloat(element.weightPerBlock) * averageTaxAmount;

      let rawCosting = parseFloat(element.rawCosting);
      let transportationCosting = parseFloat(element.transportationCosting);
      let royaltyCosting = parseFloat(element.royaltyCosting);
      // let taxAmountCosting = parseFloat(element.taxAmountCosting);
      element.totalCosting =
        rawCosting + transportationCosting + royaltyCosting;
      // this.lotTotalCost += element.totalCosting;
      // this.totalRawCosting += rawCosting; // Accumulate rawCosting
      // console.log(this.totalRawCosting);
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
    const data = this.lotAddForm.value;
    if(!this.lotTotalCost){
    this.blocksDetails.forEach((e: any) => {
      this.lotTotalCost += e.totalCosting;
    });
    console.log(this.lotTotalCost);
    const payload = {
      lotNo: data.lotNo,
      lotName: data.lotName,
      warehouseDetails: data.warehouse,
      vehicleNo: data.vehicleNo,
      lotWeight: data.lotWeight,
      pricePerTon: Number(data.pricePerTon),
      transportationCharge: Number(data.transportationCharge),
      royaltyCharge: Number(data.royaltyCharge),
      blocksCount: this.blocksDetails.length,
      averageWeight: data.averageWeight,
      averageTransport: Number(data.averageTransport),
      averageRoyaltyNumber:( data.averageRoyalty),
      blockDetails: this.blocksDetails,
      lotTotalCost: Number(this.lotTotalCost),
      purchaseCost: "",
      date: "",
      notes: "",
    };
    // this.dataEmitter.emit(JSON.stringify(payload));

    console.log("payload", payload);
    this.NewPurchaseService.setFormData('stepTwoData', payload)
    if(this.lotAddForm.valid){
          const message = "Lot Values has been saved";
          this.messageService.add({ severity: "success", detail: message });
    } else {
          const message = "Lot Values are not valid";
          this.messageService.add({ severity: "error", detail: message });
    }
  }
    // this.NewPurchaseService.setFormData(payload)
    // this.subject.next(payload);
    // if (this.lotAddForm.valid) {
    //   console.log("Form valid lot value", payload);
    //   this.service.CreateLot(payload).subscribe((resp: any) => {
    //     if (resp.status === "success") {
    //       const message = "Lot has been added";
    //       this.messageService.add({ severity: "success", detail: message });
    //       setTimeout(() => {
    //         this.router.navigate(["/lot/"]);
    //       }, 400);
    //     } else {
    //       const message = resp.message;
    //       this.messageService.add({ severity: "error", detail: message });
    //     }
    //   });
    // } else {
    //   console.log("Form is invalid!");
    // }
  }
}
