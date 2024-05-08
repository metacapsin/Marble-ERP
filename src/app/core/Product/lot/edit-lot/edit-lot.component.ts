import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
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

@Component({
  selector: "app-edit-lot",
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
  templateUrl: "./edit-lot.component.html",
  styleUrl: "./edit-lot.component.scss",
})
export class EditLotComponent {
  public routes = routes;
  lotEditForm!: FormGroup;
  data: any;
  lotId: any;

  categoryList: any = [];
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{1,10})$/;
  vehicleNoRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{1,15})$/;

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private service: LotService
  ) {
    this.lotEditForm = this.fb.group({
      lotNo: [
        "",
        [Validators.required, Validators.pattern(this.shortNameRegex)],
      ],
      vehicleNo: [
        "",
        [Validators.required, Validators.pattern(this.vehicleNoRegex)],
      ],
      invoiceNo: [
        "",
        [Validators.required, Validators.pattern(this.shortNameRegex)],
      ],
      totalSlots: ["", [Validators.required, Validators.min(0)]],
      totalWeightInTon: ["", [Validators.required, Validators.min(0)]],
      totalPricing: ["", [Validators.required, Validators.min(0)]],
      totalTransportation: ["", [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.lotId = params["id"];
      console.log("user id ", this.lotId);
    });

    this.service.getLotById(this.lotId).subscribe((data: any) => {
      this.data = data.data; //assuming data is returned as expected
      console.log("Lot Data", this.data);
      this.lotEditForm.patchValue({
        lotNo: this.data.lotNo,
        vehicleNo: this.data.vehicleNo,
        invoiceNo: this.data.invoiceNo,
        subCategory: this.data.subCatergory,
        height: this.data.height,
        width: this.data.width,
        length: this.data.length,
        totalSqrFt: this.data.totalSqrFt,
        totalCosting: this.data.totalCosting,
        perSellPrice: this.data.perSellPrice,
      });
    });
  }
  get f() {
    return this.lotEditForm.controls;
  }

  LotEditFormSubmit() {
    console.log(this.lotEditForm.value);
    if (this.lotEditForm.valid) {
      const requestBody = this.lotEditForm.value;
      requestBody.id = this.lotId;
      this.service.updateLotById(requestBody).subscribe(
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
