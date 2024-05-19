import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
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
  selector: 'app-add-lot',
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
    AccordionModule
  ],
  providers: [MessageService],
  templateUrl: './add-lot.component.html',
  styleUrl: './add-lot.component.scss'
})
export class AddLotComponent {

  public routes = routes;
  lotAddForm!: FormGroup;
  // blockAddForm!: FormGroup;
  totalBlocksArea: number = 0;
  blocksDetails = [];
  blockNo: string;
  height: number;
  width: number;
  length: number;
  totalArea: number;
  weightPerBlock: number;
  rawCosting: number;
  transportationCosting: number;
  royaltyCosting: number;
  totalCosting: number;
  isProcessed: boolean = false;
  perBlockWeight: number;

  addvisible: boolean = false;
  // lotNoRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  // lotNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  invoiceRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{2,15})$/;
  descriptionRegex = /^(?!\s)(?:.{1,500})$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private service: LotService,

  ) {
    this.lotAddForm = this.fb.group({
      lotNo: ["", [Validators.required, Validators.pattern(this.shortNameRegex)]],
      lotName: ["", [Validators.required, Validators.pattern(this.shortNameRegex)]],
      vehicleNo: ["", [Validators.pattern(this.shortNameRegex)]],
      date: ["", [Validators.required]],
      invoiceNo: ["", [Validators.required, Validators.pattern(this.invoiceRegex)]],
      lotWeight: ["", [Validators.required, Validators.min(1), Validators.max(10000)]],
      pricePerTon: ["", [Validators.required, Validators.min(1), Validators.max(1000000)]],
      transportationCharge: ["", [Validators.required, Validators.min(1), Validators.max(100000)]],
      royaltyCharge: ["", [Validators.required, Validators.min(0), Validators.max(100000)]],
      notes: ["", [Validators.pattern(this.descriptionRegex)]],
      blocksCount: [""],
      averageWeight: [""],
      averageTransport: [""],
      averageRoyalty: [""],
    });

  }
  ngOnInit(): void {
  }


  addBlockDialog() {
    this.blockNo = '';
    this.height = null;
    this.width = null;
    this.length = null;
    this.totalArea = null;

    this.addvisible = true
  }

  deleteAccordian(salesItemDetailsIndex: number){
    console.log("Delete OBJ.");
    
    this.blocksDetails.splice(salesItemDetailsIndex, 1);
    this.calculateTotalAmount();

  }

  addBlock() {
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
      totalCosting: this.totalCosting,
      isProcessed: this.isProcessed,
    };

    this.blocksDetails.push(newBlock);
    
    this.totalBlocksArea += Number(this.totalArea);
    console.log("total block area:", this.totalBlocksArea);

    console.log("blocks", this.blocksDetails);


    this.blockNo = '';
    this.height = null;
    this.width = null;
    this.length = null;
    this.totalArea = null;
    
    this.calculateTotalAmount();
  }

  getblockDetails() {
    if (isNaN(this.height) || isNaN(this.width) || isNaN(this.length) || this.height === null || this.width === null || this.length === null) {
        return; 
    }
    this.totalArea = this.height * this.width * this.length; 
    console.log("Total Area:", this.totalArea);
}



  calculateTotalAmount() {
    

    let lotWeight:number = this.lotAddForm.get("lotWeight").value || 0;
    let pricePerTon = this.lotAddForm.get("pricePerTon").value || 0;
    let royaltyCharge: number = this.lotAddForm.get("royaltyCharge").value || 0;
    let transportationCharge:number = this.lotAddForm.get("transportationCharge").value || 0;

    let averageTransportation = transportationCharge/lotWeight;
    let averageRoyalty = royaltyCharge/lotWeight;
    let averageBlocksWeight = this.totalBlocksArea / lotWeight

    this.blocksDetails.forEach((element: any) => {
      element.weightPerBlock = (element.totalArea / averageBlocksWeight).toFixed(2);
      element.rawCosting = (parseFloat(element.weightPerBlock) * pricePerTon).toFixed(2);
      element.transportationCosting = (parseFloat(element.weightPerBlock) * averageTransportation).toFixed(2);
      element.royaltyCosting = (parseFloat(element.weightPerBlock) * averageRoyalty).toFixed(2);
      
      let rawCosting = parseFloat(element.rawCosting);
      let transportationCosting = parseFloat(element.transportationCosting);
      let royaltyCosting = parseFloat(element.royaltyCosting);
      element.totalCosting = (rawCosting + transportationCosting + royaltyCosting).toFixed(2);
  });
  

    this.lotAddForm.patchValue({
      averageTransport: averageTransportation.toFixed(2),
      averageRoyalty: averageRoyalty.toFixed(2),
      averageWeight: averageBlocksWeight.toFixed(2)
    });
  }

  LotAddFormSubmit() {
    const data = this.lotAddForm.value;
    

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
      blocksCount: this.blocksDetails.length,
      averageWeight: data.averageWeight,
      averageTransport: data.averageTransport,
      averageRoyalty: data.averageRoyalty,
      blocksDetails: this.blocksDetails,
    }
    if (this.lotAddForm.valid) {
      console.log("Form valid lot value", payload);
      this.service
        .CreateLot(payload)
        .subscribe((resp: any) => {
          if (resp.status === "success") {
            const message = "Lot has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/lot/"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        });
    } else {
      console.log("Form is invalid!");
    }
  }
}