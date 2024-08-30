import { Component, OnInit } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { MessageService } from "primeng/api";
import { SuppliersdataService } from "../suppliers.service";
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: "app-edit-suppliers",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./edit-suppliers.component.html",
  styleUrl: "./edit-suppliers.component.scss",
})
export class EditSuppliersComponent implements OnInit {
  editSupplierGroup: UntypedFormGroup;
  routes = routes;
  id: any;
  SupplierData: any;

  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];

  // personNameRegex = /^[A-Za-z](?!.*\s{2})[A-Za-z. ]{2,28}[A-Za-z.]$/;
  personNameRegex = /^[A-Za-z0-9](?!.*\s{2})[A-Za-z0-9. \/_-]{2,29}$/;
  taxNumberRegex = /^[A-Za-z0-9]{15}$/;
  emailRegex: string = "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  billingAddressRegex = /^(?!\s)(?!.*\s{3})(.{3,500})$/s;
  phoneRegex = /^[0-9]{10}$/;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private Service: SuppliersdataService,
    private messageService: MessageService,
    private activeRoute: ActivatedRoute,
  ) {
    this.editSupplierGroup = this.fb.group({
      name:["", [Validators.required, Validators.pattern(this.personNameRegex)]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(this.phoneRegex)],
      ],
      email: ["", [Validators.pattern(this.emailRegex)]],
      taxNumber: ["", [Validators.pattern(this.taxNumberRegex)]],
      creditPeriod:  ["", [Validators.min(0), Validators.max(180)]],
      creditLimit: ["", [Validators.min(0), Validators.max(9999999)]],
      billingAddress:  ["", [Validators.pattern(this.billingAddressRegex)]],
      // shippingAddress:  ["", [Validators.pattern(this.billingAddressRegex)]],
    });
    this.id = this.activeRoute.snapshot.params["id"];
  }
  ngOnInit(): void {
    this.Service.GetSupplierDataById(this.id).subscribe((data: any) => {
      this.SupplierData = data;
      this.patchForm();
    });
  }

  patchForm() {
    this.editSupplierGroup.patchValue({
      name: this.SupplierData.name,
      phoneNumber: this.SupplierData.phoneNo,
      email: this.SupplierData.email,
      status: this.SupplierData.status,
      taxNumber: this.SupplierData.taxNo,
      creditPeriod: this.SupplierData.creditPeriod,
      creditLimit: this.SupplierData.creditLimit,
      billingAddress: this.SupplierData.billingAddress,
      // shippingAddress: this.SupplierData.shippingAddress,
    });
  }

  editSupplierForm() {
    console.log(this.editSupplierGroup.value);
    const payload = {
      id: this.id,
      name: this.editSupplierGroup.value.name,
      email: this.editSupplierGroup.value.email,
      phoneNo: this.editSupplierGroup.value.phoneNumber,
      status: true,
      taxNo: this.editSupplierGroup.value.taxNumber,
      creditPeriod: this.editSupplierGroup.value.creditPeriod,
      creditLimit: Number(this.editSupplierGroup.value.creditLimit),
      billingAddress: this.editSupplierGroup.value.billingAddress,
      // shippingAddress: this.editSupplierGroup.value.shippingAddress,
    };
    if (this.editSupplierGroup.value) {
      this.Service.UpDataSupplierApi(payload).subscribe((resp: any) => {
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
