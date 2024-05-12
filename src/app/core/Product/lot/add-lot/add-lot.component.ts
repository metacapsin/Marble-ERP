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
  blockItemDetails = [];
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

  addvisible: boolean = false;
  lotNoRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{5,10})$/;
  lotNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{5,15})$/;
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  vehicleNoRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  descriptionRegex = /^(?!\s)(?:.{1,500})$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private service: LotService,

  ) {
    this.lotAddForm = this.fb.group({
      lotNo: ["", [Validators.required, Validators.pattern(this.lotNoRegex)]],
      lotName: ["", [Validators.required, Validators.pattern(this.lotNameRegex)]],
      vehicleNo: ["", [Validators.required, Validators.pattern(this.lotNameRegex)]],
      date: ["", [Validators.required]],
      invoiceNo: ["", [Validators.required, Validators.pattern(this.lotNoRegex)]],
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

    // this.blockAddForm = this.fb.group({
    //   blocksNo: ["", [Validators.required, Validators.pattern(this.shortNameRegex)]],
    //   height: ["", [Validators.required, Validators.min(0)]],
    //   width: ["", [Validators.required, Validators.min(0)]],
    //   length: ["", [Validators.required, Validators.min(0)]],
    //   processingCharge: ["", [Validators.required, Validators.min(0)]],
    // });
  }
  // get f() {
  //   return this.lotAddForm.controls;
  // }
  ngOnInit(): void {
  }


  addBlockDialog() {
    this.addvisible = true
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
      isProcessed: this.isProcessed
    };

    this.blockItemDetails.push(newBlock);

    console.log("blocks", this.blockItemDetails);


    this.blockNo = '';
    this.height = null;
    this.width = null;
    this.length = null;
    this.totalArea = null;


  }


  // blockAddFormSubmit() {
  //   if (this.blockAddForm.valid) {
  //     this.addvisible = false;
  //     console.log("Form is valid", this.blockAddForm.value);

  //   } else {
  //     console.log("Form is invalid");

  //   }
  // }

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
      blocksCount: data.blocksCount,
      averageWeight: data.averageWeight,
      averageTransport: data.averageTransport,
      averageRoyalty: data.averageRoyalty,
      blockItemDetails: this.blockItemDetails

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