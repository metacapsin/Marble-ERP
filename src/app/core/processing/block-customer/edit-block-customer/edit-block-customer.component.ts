import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { DropdownModule } from "primeng/dropdown";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { MultiSelectModule } from "primeng/multiselect";
import { SharedModule } from "src/app/shared/shared.module";
import { blockCustomersDataService } from "../block-customer.service";

@Component({
  selector: 'app-edit-block-customer',
  standalone: true,
  imports: [
    RouterModule,
    DropdownModule,
    CommonModule,
    SharedModule, 
    ToastModule,
    MultiSelectModule,
  ],
  templateUrl: './edit-block-customer.component.html',
  styleUrl: './edit-block-customer.component.scss',
  providers: [MessageService],
})
export class EditBlockCustomerComponent {
  editBlockCustomerForm: FormGroup;
  routes = routes;
  customerData: any;
  id: any;

  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];
  personNameRegex = /^(?! )[A-Za-z](?:[A-Za-z ]{0,28}[A-Za-z])?$/;
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  billingAddressRegex = /^(?!\s)(?!.*\s{3})(.{3,500})$/s;
  phoneRegex = /^[0-9]{10}$/;

  constructor(
    private fb: FormBuilder,
    private Service: blockCustomersDataService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {
    this.editBlockCustomerForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(this.personNameRegex)]],
      phoneNo: [
        "",
        [Validators.required, Validators.pattern(this.phoneRegex)],
      ],
      email: ["", [Validators.required, Validators.pattern(this.emailRegex)]],
      // status: ["", [Validators.required]],
      taxNumber: ["", [Validators.pattern(this.shortNameRegex)]],
      openingBalance: ["", [Validators.min(0)]],
      creditPeriod: ["", [Validators.min(0), Validators.max(180)]],
      creditLimit: ["", [Validators.min(0), Validators.max(9999999)]],
      billingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
      shippingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
    });
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getCoustomers();
  }
  getCoustomers() {
    this.Service.getBlockCustomerDataById(this.id).subscribe((data: any) => {
      this.customerData = data;
      console.log(this.customerData);
      this.patchForm();
    });
  }
  patchForm() {
    this.editBlockCustomerForm.patchValue({
      name: this.customerData.name,
      phoneNo: this.customerData.phoneNo,
      email: this.customerData.email,
      status: true,
      taxNumber: this.customerData.taxNumber,
      openingBalance: this.customerData.openingBalance,
      creditPeriod: this.customerData.creditPeriod,
      creditLimit: this.customerData.creditLimit,
      billingAddress: this.customerData.billingAddress,
      shippingAddress: this.customerData.shippingAddress,
    });
  }
  editBlockCustomerFormSubmit() {

    const payload = {
      id: this.id,
      name: this.editBlockCustomerForm.value.name,
      phoneNo: this.editBlockCustomerForm.value.phoneNo,
      email: this.editBlockCustomerForm.value.email,
      status:this.editBlockCustomerForm.value.status,
      taxNumber: this.editBlockCustomerForm.value.taxNumber,
      creditPeriod: this.editBlockCustomerForm.value.creditPeriod,
      creditLimit: Number(this.editBlockCustomerForm.value.creditLimit),
      billingAddress: this.editBlockCustomerForm.value.billingAddress,
      shippingAddress: this.editBlockCustomerForm.value.shippingAddress,
      openingBalance: Number(this.editBlockCustomerForm.value.openingBalance),
    };
    console.log(payload);
    if (this.editBlockCustomerForm.valid) {
      this.Service.updateBlockCustomerData(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            this.messageService.add({
              severity: "success",
              detail: resp.message,
            });
            setTimeout(() => {
              this.router.navigate(["/block-customer"]);
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
