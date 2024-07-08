import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NgForm,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
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
import { MatSnackBar } from "@angular/material/snack-bar";
import { CalendarModule } from "primeng/calendar";
import { AccordionModule } from "primeng/accordion";
import { DialogModule } from "primeng/dialog";

@Component({
  selector: "app-edit-lot",
  standalone: true,
  imports: [
    SharedModule,
  ],
  providers: [MessageService],
  templateUrl: "./edit-lot.component.html",
  styleUrl: "./edit-lot.component.scss",
})
export class EditLotComponent {
  public routes = routes;
  lotEditForm!: FormGroup;
  data: any;
  lotId: any;
  maxDate = new Date();
  totalBlocksArea: number = 0;
  blockDetails = [];
  blockNo: string;
  height: number;
  width: number;
  length: number;
  totalArea: number;
  weightPerBlock: number;
  rawCosting: number;
  transportationCosting: number;
  royaltyCosting: number;
  taxAmountCosting: number;

  totalCosting: number;
  isProcessed: boolean = false;
  perBlockWeight: number;

  addvisible: boolean = false;

  categoryList: any = [];
  shortNameRegex = /^[^-\s][a-zA-Z0-9_\s-]{2,14}$/;
  invoiceRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{2,15})$/;
  descriptionRegex = /^(?!\s)(?:.{1,500})$/;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private service: LotService
  ) {
    this.lotEditForm = this.fb.group({
      lotNo: ["", [Validators.required, Validators.pattern(this.shortNameRegex)]],
      lotName: ["", [Validators.required, Validators.pattern(this.shortNameRegex)]],
      vehicleNo: ["", [Validators.pattern(this.shortNameRegex)]],
      date: ["", [Validators.required]],
      invoiceNo: ["", [Validators.required, Validators.pattern(this.invoiceRegex)]],
      lotWeight: ["", [Validators.required, Validators.min(1), Validators.max(10000)]],
      pricePerTon: ["", [Validators.required, Validators.min(1), Validators.max(1000000)]],
      transportationCharge: ["", [Validators.required, Validators.min(1), Validators.max(100000)]],
      royaltyCharge: ["", [Validators.required, Validators.min(0), Validators.max(100000)]],
      taxAmount: ["", [Validators.min(0), Validators.max(100000)]],
      notes: ["", [Validators.pattern(this.descriptionRegex)]],
      blocksCount: [""],
      averageWeight: [""],
      averageTransport: [""],
      averageRoyalty: [""],
      averageTaxAmount: [""],
    });
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.lotId = params["id"];
      console.log("user id ", this.lotId);
    });

    this.service.getLotById(this.lotId).subscribe((resp: any) => {
      this.data = resp.data; 
      this.blockDetails = resp.data.blockDetails

      this.blockDetails.forEach(element => {
        this.totalBlocksArea += element.totalArea
      });

      console.log("Lot Data", this.blockDetails);
      this.lotEditForm.patchValue({
        lotNo: this.data.lotNo,
        lotName: this.data.lotName,
        vehicleNo: this.data.vehicleNo,
        date: this.data.date,
        invoiceNo: this.data.invoiceNo,
        lotWeight: this.data.lotWeight,
        pricePerTon: this.data.pricePerTon,
        transportationCharge: this.data.transportationCharge,
        royaltyCharge: this.data.royaltyCharge,
        taxAmount: this.data.taxAmount,
        notes: this.data.notes,
        blocksCount: this.data.blocksCount,
        averageWeight: this.data.averageWeight,
        averageTransport: this.data.averageTransport,
        averageRoyalty: this.data.averageRoyalty,
        averageTaxAmount: this.data.averageTaxAmount,
      });
    });
  }
  addBlockDialog() {
    this.blockNo = '';
    this.height = null;
    this.width = null;
    this.length = null;
    this.totalArea = null;

    this.addvisible = true
  }
  deleteAccordian(index: number) {
    console.log("Delete OBJ.");
    this.totalBlocksArea -= Number(this.blockDetails[index].totalArea);
    this.blockDetails.splice(index, 1);
    this.calculateTotalAmount();

  }

  clossBlock(myForm: NgForm){
    this.addvisible = false;
    myForm.resetForm();
  }
  addBlock(myForm: NgForm) {
    if (!this.blockNo || this.height === null || this.width === null || this.length === null) {
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

    this.blockDetails.push(newBlock);
    this.totalBlocksArea += Number(this.totalArea);

    this.blockNo = '';
    this.height = null;
    this.width = null;
    this.length = null;
    this.totalArea = null;

    this.calculateTotalAmount();

    // Reset the form to clear validation messages
    myForm.resetForm();
  }

  getblockDetails() {
    if (isNaN(this.height) || isNaN(this.width) || isNaN(this.length) || this.height === null || this.width === null || this.length === null) {
      return;
    }
    this.totalArea = this.height * this.width * this.length;
    console.log("Total Area:", this.totalArea);
  }


  calculateTotalAmount() {


    let lotWeight: number = this.lotEditForm.get("lotWeight").value || 0;
    let pricePerTon = this.lotEditForm.get("pricePerTon").value || 0;
    let royaltyCharge: number = this.lotEditForm.get("royaltyCharge").value || 0;
    let taxAmount: number = this.lotEditForm.get("taxAmount").value || 0;
    let transportationCharge: number = this.lotEditForm.get("transportationCharge").value || 0;

    let averageTransportation = transportationCharge / lotWeight;
    let averageRoyalty = royaltyCharge / lotWeight;
    let averageTaxAmount = taxAmount / lotWeight;
    let averageBlocksWeight = this.totalBlocksArea / lotWeight

    this.blockDetails.forEach((element: any) => {
      element.weightPerBlock = (element.totalArea / averageBlocksWeight);
      element.rawCosting = (parseFloat(element.weightPerBlock) * pricePerTon);
      element.transportationCosting = (parseFloat(element.weightPerBlock) * averageTransportation);
      element.royaltyCosting = (parseFloat(element.weightPerBlock) * averageRoyalty);
      element.taxAmountCosting = (parseFloat(element.weightPerBlock) * averageTaxAmount);

      let rawCosting = parseFloat(element.rawCosting);
      let transportationCosting = parseFloat(element.transportationCosting);
      let royaltyCosting = parseFloat(element.royaltyCosting);
      let taxAmountCosting = parseFloat(element.taxAmountCosting);
      element.totalCosting = (rawCosting + transportationCosting + royaltyCosting + taxAmountCosting);
    });


    this.lotEditForm.patchValue({
      averageTransport: averageTransportation,
      averageRoyalty: averageRoyalty,
      averageTaxAmount: averageTaxAmount,
      averageWeight: averageBlocksWeight
    });
  }

  LotEditFormSubmit() {
    const data = this.lotEditForm.value;


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
      notes: data.notes,
      blocksCount: this.blockDetails.length,
      averageWeight: data.averageWeight,
      averageTransport: data.averageTransport,
      averageRoyalty: data.averageRoyalty,
      averageTaxAmount: data.averageTaxAmount,
      blockDetails: this.blockDetails,
      id: this.lotId
    }
    console.log(payload);
    if (this.lotEditForm.valid) {
      // payload.id = this.lotId;
      this.service.updateLotById(payload).subscribe(
        (resp: any) => {
          if (resp) {
            if (resp.status === "success") {
              const message = "Lot has been updated";
              this.messageService.add({ severity: "success", detail: message });
              setTimeout(() => {
                this.router.navigate(["/lot/"]);
              }, 400);
            } else {
              const message = resp.message;
              this.messageService.add({ severity: "error", detail: message });
            }
          }
        },
        (error) => {
          console.error("Error occured while updating Lot:", error);
        }
      );
    } else {
      console.log("Form is invalid!");
    }
  }
}
