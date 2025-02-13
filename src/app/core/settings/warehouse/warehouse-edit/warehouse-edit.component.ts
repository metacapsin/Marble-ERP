import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SettingsService } from "src/app/shared/data/settings.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ActivatedRoute, Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { SharedModule } from "src/app/shared/shared.module";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { WarehouseService } from "../warehouse.service";
import { validationRegex } from "src/app/core/validation";

@Component({
  selector: "app-warehouse-edit",
  templateUrl: "./warehouse-edit.component.html",
  styleUrl: "./warehouse-edit.component.scss",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
})
export class WarehouseEditComponent {
  public routes = routes;
  warehouseForm!: FormGroup;
  data: any;
  warehouseId: any;

  // personNameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]*$/;
  personNameRegex = /^[A-Za-z0-9](?!.*\s{2})[A-Za-z0-9. \/_-]{2,29}$/;


  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  invoiceRegex = /^(?=[^\s])(?=.*[a-zA-Z])[a-zA-Z\d\/\-_ ]{1,50}$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  billingAddressRegex = /^(?!\s)(?!.*\s{3})(.{3,500})$/s;
  // personNameRegex = /^\d{10}$/;
  phoneRegex = /^[0-9]{10}$/;

  constructor(
    private service: WarehouseService,
    private fb: FormBuilder,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) {
    this.warehouseForm = this.fb.group({
      name: ["", [Validators.required]],
      // slug: [
      //   "",
      //   [
      //     Validators.required,
      //     Validators.pattern(new RegExp(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)),
      //   ],
      // ],
      email: ["", [Validators.pattern(this.emailRegex)]],
      showEmailOnInvoice: [],
      showPhoneOnInvoice: [],
      termsCondition: [],
      singnatureUrl: [],
      billingAddress: [
        "",
        [Validators.required, Validators.pattern(validationRegex.billingAddressRegex)],
      ],
      // bankDetails: ["", [Validators.pattern(new RegExp(/^[A-Za-z0-9\s-]+$/))]],
      phone: ["", [Validators.required, Validators.pattern(validationRegex.phoneRGEX)]],
    });
  }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((params) => {
      this.warehouseId = params["id"];
      console.log("user id ", this.warehouseId);
    });
    this.service.getWarehouseById(this.warehouseId).subscribe((data: any) => {
      this.data = data.data; //assuming data is returned as expected
      console.log("User Data", this.data);
      this.warehouseForm.patchValue({
        name: this.data.name,
        // slug: this.data.slug,
        email: this.data.email,
        showEmailOnInvoice: this.data.showEmailOnInvoice,
        phone: this.data.phone,
        showPhoneOnInvoice: this.data.showPhoneOnInvoice,
        billingAddress: this.data.billingAddress,
        // bankDetails: this.data.bankDetails,
        termsCondition: this.data.termsCondition,
        singnatureUrl: this.data.singnatureUrl,
      });
    });
  }

  get f() {
    return this.warehouseForm.controls;
  }

  WarehouseFormSubmit() {
    if (this.warehouseForm.valid) {
      const requestBody = { ...this.warehouseForm.value };
      requestBody.id = this.warehouseId;
      this.service.updateWarehouseById(requestBody).subscribe(
        (resp: any) => {
          if (resp) {
            if (resp.status === "success") {
              const message = "Warehouse has been updated";
              this.messageService.add({ severity: "success", detail: message });
              setTimeout(() => {
                this.router.navigate(["/settings/warehouse"]);
              }, 400);
            } else {
              const message = resp.message;
              this.messageService.add({ severity: "error", detail: message });
            }
          }
        },
        (error) => {
          const message= error.message
          this.messageService.add({ severity: "warn", detail: message });
          console.error("Error occured while updating Warehouse:", error);
        }
      );
    } else {
      console.log("Form is invalid!");
    }
  }
}
