import { Component, EventEmitter, Input, Output } from "@angular/core";
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

@Component({
  selector: "app-add-lot",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    DropdownModule,
    ToastModule,
    DialogModule,
    CalendarModule,
    AccordionModule,
  ],
  providers: [MessageService],
  templateUrl: "./add-lot.component.html",
  styleUrl: "./add-lot.component.scss",
})
export class AddLotComponent {
  @Output() dataEmitter: EventEmitter<string> = new EventEmitter<string>();

  @Input() lotAddForm: FormGroup;
  maxDate = new Date();
  public routes = routes;
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
  // lotNoRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  // lotNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  // shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\-]+(\s[a-zA-Z\d\/\-]+)*){3,15}$/;
  //  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\-]+(\s[a-zA-Z\d\/\-]+)*){3,15}$/;
  // shortNameRegex = /^(?!.*\s\s)[a-zA-Z\d\/\-]{1,15}(?:\s[a-zA-Z\d\/\-]{1,15}){0,14}$/;
  shortNameRegex = /^[^-\s][a-zA-Z0-9_\s-]{2,14}$/;
  @Input() otherCharges = 0;
  @Input() transportationCharges = 0;

  invoiceRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{2,15})$/;
  descriptionRegex = /^(?!\s)(?:.{1,500})$/;
  LotTotalCosting: number = 0;
  totalRawCosting: number = 0;
  LotblockDetails: number = 0;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private service: LotService
  ) {}
  ngOnInit(): void {
    console.log(this.transportationCharges, this.otherCharges);
    console.log("ds");
    this.lotAddForm = this.fb.group({
      lotNo: [
        "",
        [Validators.required, Validators.pattern(this.shortNameRegex)],
      ],
      lotName: [
        "",
        [Validators.required, Validators.pattern(this.shortNameRegex)],
      ],
      vehicleNo: ["", [Validators.pattern(this.shortNameRegex)]],
      date: ["", [Validators.required]],
      // invoiceNo: [
      //   "",
      //   [Validators.required, Validators.pattern(this.invoiceRegex)],
      // ],
      lotWeight: [
        "",
        [Validators.required, Validators.min(1), Validators.max(10000)],
      ],
      pricePerTon: [
        "",
        [Validators.required, Validators.min(1), Validators.max(1000000)],
      ],
      // transportationCharge: [
      //   "",
      //   [Validators.required, Validators.min(1), Validators.max(100000)],
      // ],
      // royaltyCharge: [
      //   "",
      //   [Validators.required, Validators.min(0), Validators.max(100000)],
      // ],
      taxAmount: ["", [Validators.min(0), Validators.max(100000)]],
      notes: ["", [Validators.pattern(this.descriptionRegex)]],
      blocksCount: [""],
      averageWeight: [""],
      averageTransport: [""],
      averageRoyalty: [""],
      averageTaxAmount: [""],
      LotTotalCosting: [""],
    });
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

    this.addvisible = false;
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
    console.log("Total Area:", this.totalArea);
  }

  calculateTotalAmount() {
    let lotWeight: number = this.lotAddForm.get("lotWeight").value || 0;
    let pricePerTon = this.lotAddForm.get("pricePerTon").value || 0;
    // let royaltyCharge: number = this.lotAddForm.get("royaltyCharge").value || 0;
    // let transportationCharge: number =
    //   this.lotAddForm.get("transportationCharge").value || 0;
    let taxAmount: number = this.lotAddForm.get("taxAmount").value || 0;

    let averageTransportation = this.transportationCharges / lotWeight;
    console.log(averageTransportation, "averageTransportation");

    let averageRoyalty = this.otherCharges / lotWeight;
    let averageTaxAmount = taxAmount / lotWeight;
    let averageBlocksWeight = this.totalBlocksArea / lotWeight;
    console.log(averageTransportation, averageRoyalty);

    this.blocksDetails.forEach((element: any) => {
      element.weightPerBlock = element.totalArea / averageBlocksWeight;
      element.rawCosting = parseFloat(element.weightPerBlock) * pricePerTon;
      element.transportationCosting =
        parseFloat(element.weightPerBlock) * averageTransportation;
      element.royaltyCosting =
        parseFloat(element.weightPerBlock) * averageRoyalty;
      element.taxAmountCosting =
        parseFloat(element.weightPerBlock) * averageTaxAmount;

      let rawCosting = parseFloat(element.rawCosting);
      let transportationCosting = parseFloat(element.transportationCosting);
      let royaltyCosting = parseFloat(element.royaltyCosting);
      let taxAmountCosting = parseFloat(element.taxAmountCosting);
      element.totalCosting =
        rawCosting + transportationCosting + royaltyCosting + taxAmountCosting;
      console.log(rawCosting);
      console.log(element);
      this.LotTotalCosting += element.totalCosting; // Accumulate totalCosting
      console.log(element.totalCosting);
      console.log(this.LotTotalCosting);
      this.totalRawCosting += rawCosting; // Accumulate rawCosting
      console.log(this.totalRawCosting);
    });

    this.lotAddForm.patchValue({
      averageTransport: averageTransportation,
      averageRoyalty: averageRoyalty,
      averageTaxAmount: averageTaxAmount,
      LotTotalCosting: this.LotTotalCosting,
      averageWeight: averageBlocksWeight,
    });
    const data = {
      lotWeight: lotWeight,
      pricePerTon: pricePerTon,
      taxAmount: taxAmount,
      totalCosting: this.LotTotalCosting,
      totalRawCosting: this.totalRawCosting,
      LotblockDetails: this.LotblockDetails,
    };
  }

  LotAddFormSubmit() {
    this.totalRawCosting = 0;
    // this.LotblockDetails = 0;
    const data = this.lotAddForm.value;
    this.blocksDetails.forEach((val: any) => {
      this.LotblockDetails += val.totalCosting;
      this.totalRawCosting += val.rawCosting;
    });
    console.log(this.LotblockDetails);
    const payload = {
      lotNo: data.lotNo,
      lotName: data.lotName,
      date: data.date,
      vehicleNo: data.vehicleNo,
      invoiceNo: data.invoiceNo,
      lotWeight: data.lotWeight,
      pricePerTon: data.pricePerTon,
      transportationCharge: data.transportationCharge,
      royaltyCharge: data.royaltyCharge,
      taxAmount: data.taxAmount,
      notes: data.notes,
      blocksCount: this.blocksDetails.length,
      averageWeight: data.averageWeight,
      averageTransport: data.averageTransport,
      averageRoyalty: data.averageRoyalty,
      averageTaxAmount: data.averageTaxAmount,
      blockDetails: this.blocksDetails,
      LotblockDetails: this.LotblockDetails,
      totalRawCosting: this.totalRawCosting,
    };
    this.dataEmitter.emit(JSON.stringify(payload));
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
