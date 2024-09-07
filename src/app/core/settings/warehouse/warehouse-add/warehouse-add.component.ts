import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SettingsService } from "src/app/shared/data/settings.service";
import { Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { SharedModule } from "src/app/shared/shared.module";
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { WarehouseService } from "../warehouse.service";
import { validationRegex } from "src/app/core/validation";

@Component({
  selector: "app-warehouse-add",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  templateUrl: "./warehouse-add.component.html",
  styleUrl: "./warehouse-add.component.scss",
})
export class WarehouseAddComponent {
  public routes = routes;
  warehouseForm!: FormGroup;
  // personNameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]*$/;
  personNameRegex = /^[A-Za-z0-9](?!.*\s{2})[A-Za-z0-9. \/_-]{2,29}$/;


  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  invoiceRegex = /^(?=[^\s])(?=.*[a-zA-Z])[a-zA-Z\d\/\-_ ]{1,50}$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  // personNameRegex = /^\d{10}$/;
  billingAddressRegex = /^(?!\s)(?!.*\s{3})(.{3,500})$/s;

  phoneRegex = /^[0-9]{10}$/;

  constructor(
    private service: WarehouseService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.warehouseForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(validationRegex.nameREGEX)]],
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
        [Validators.required, Validators.pattern(this.billingAddressRegex)],
      ],
      // bankDetails: ["", [Validators.pattern(new RegExp(/^[A-Za-z0-9\s-]+$/))]],
      phone: ["", [Validators.required, Validators.pattern(this.phoneRegex)]],
    });
  }

  get f() {
    return this.warehouseForm.controls;
  }

  WarehouseFormSubmit() {
    if (this.warehouseForm.valid) {
      this.service
        .CreateWarehouse(this.warehouseForm.value)
        .subscribe((resp: any) => {
          if (resp.status === "success") {
            const message = "Warehouse has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/settings/warehouse"]);
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
