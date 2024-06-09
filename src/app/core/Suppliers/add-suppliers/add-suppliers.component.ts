import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { DropdownModule } from "primeng/dropdown";
import { MessageService } from "primeng/api";
import { SuppliersdataService } from "../suppliers.service";
import { ToastModule } from "primeng/toast";
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  selector: "app-add-suppliers",
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    DropdownModule,
    CommonModule,
    ToastModule,
    MultiSelectModule,
  ],
  templateUrl: "./add-suppliers.component.html",
  styleUrl: "./add-suppliers.component.scss",
  providers: [MessageService],
})
export class AddSuppliersComponent {
  addSupplierGroup: UntypedFormGroup;
  routes = routes;

  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];

  personNameRegex = /^(?! )[A-Za-z]{3,50}(?: [A-Za-z]{3,50})?$/;

  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;

  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  billingAddressRegex = /^(?!\s)(?:.{3,500})$/;

  descriptionRegex = /^(?!\s)(.{3,500})$/;

  phoneRegex = /^[0-9]{10}$/;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private Service: SuppliersdataService,
    private messageService: MessageService,
  ) {
    this.addSupplierGroup = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(this.personNameRegex)]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(this.phoneRegex)],
      ],
      email: ["", [Validators.pattern(this.emailRegex)]],
      taxNumber: ["", [Validators.pattern(this.shortNameRegex)]],
      creditPeriod: ["", [Validators.min(0), Validators.max(120)]],
      creditLimit: ["", [Validators.min(0), Validators.max(150000)]],
      billingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
      shippingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
    });
  }

  addSupplierForm() {
    console.log(this.addSupplierGroup.value);
    const payload = {
      name: this.addSupplierGroup.value.name,
      email: this.addSupplierGroup.value.email,
      phoneNo: this.addSupplierGroup.value.phoneNumber,
      taxNo: this.addSupplierGroup.value.taxNumber,
      status: true,
      creditPeriod: this.addSupplierGroup.value.creditPeriod,
      creditLimit: this.addSupplierGroup.value.creditLimit,
      billingAddress: this.addSupplierGroup.value.billingAddress,
      shippingAddress: this.addSupplierGroup.value.shippingAddress,
    };
    if (this.addSupplierGroup.value) {
      this.Service.AddSupplierdata(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            this.messageService.add({
              severity: "success",
              detail: resp.message,
            });
            setTimeout(() => {
              this.router.navigate(["/suppliers"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    } else {
      console.log("Form is invalid!");
    }
  }
}
