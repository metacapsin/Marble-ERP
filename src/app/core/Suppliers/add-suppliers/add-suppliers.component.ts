import { Component } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { Router} from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { MessageService } from "primeng/api";
import { SuppliersdataService } from "../suppliers.service";
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: "app-add-suppliers",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./add-suppliers.component.html",
  styleUrl: "./add-suppliers.component.scss",
})
export class AddSuppliersComponent {
  addSupplierGroup: UntypedFormGroup;
  routes = routes;

  // personNameRegex = /^[A-Za-z](?!.*\s{2})[A-Za-z. ]{2,28}[A-Za-z.]$/;
  personNameRegex = /^(?=.*[A-Za-z])[A-Za-z0-9](?!.*\s{2})[A-Za-z0-9. \/_-]{2,29}$/;
  // taxNumberRegex = /^[A-Za-z0-9]{15}$/;
  taxNumberRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{15}$/;
  emailRegex: string = "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  billingAddressRegex = /^(?!\s)(?!.*\s{3})(.{3,500})$/s;
  phoneRegex = /^[0-9]{10}$/;

  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private Service: SuppliersdataService,
    private messageService: MessageService
  ) {
    this.addSupplierGroup = this.fb.group({
      name: [
        "",
        [Validators.required, Validators.pattern(this.personNameRegex)],
      ],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(this.phoneRegex)],
      ],
      email: ["", [Validators.pattern(this.emailRegex)]],
      taxNumber: ["", [Validators.pattern(this.taxNumberRegex)]],
      creditPeriod: ["", [Validators.min(0), Validators.max(180)]],
      creditLimit: ["", [Validators.min(0), Validators.max(9999999)]],
      billingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
      openingbalance: [0],
      balanceType: ["Pay"],
      creditPeriodType:['Days']
      // shippingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
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
      creditPeriodType:this.addSupplierGroup.value.creditPeriodType,
      creditLimit: Number(this.addSupplierGroup.value.creditLimit),
      billingAddress: this.addSupplierGroup.value.billingAddress,
      openingBalance:Number(this.addSupplierGroup.value.openingbalance),
      // shippingAddress: this.addSupplierGroup.value.shippingAddress,
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
