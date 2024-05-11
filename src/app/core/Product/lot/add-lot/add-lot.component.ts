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

interface CategoryItem {
  label: string;
  value: string;
  children?: CategoryItem[];
}

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
  ],
  providers: [MessageService],
  templateUrl: './add-lot.component.html',
  styleUrl: './add-lot.component.scss'
})
export class AddLotComponent {

  public routes = routes;
  lotAddForm!: FormGroup;
  
  categoryList: any = [];
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  vehicleNoRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private service: LotService,

  ) {
    this.lotAddForm = this.fb.group({
      lotNo: ["", [Validators.required ,Validators.pattern(this.shortNameRegex)]],
      vehicleNo: ["", [Validators.required ,Validators.pattern(this.vehicleNoRegex)]],
      invoiceNo: ["", [Validators.required ,Validators.pattern(this.shortNameRegex)]],
      totalSlots: ["", [Validators.required,Validators.min(0)]],
      totalWeightInTon: ["", [Validators.required, Validators.min(0)]],
      totalPricing: ["", [Validators.required, Validators.min(0)]],
      totalTransportation: ["", [Validators.required, Validators.min(0)]],
    });
  }
  get f() {
    return this.lotAddForm.controls;
  }
  ngOnInit(): void {

   
  }
  LotAddFormSubmit() {
    console.log(this.lotAddForm.value);
    if (this.lotAddForm.valid) {
      this.service
        .CreateLot(this.lotAddForm.value)
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