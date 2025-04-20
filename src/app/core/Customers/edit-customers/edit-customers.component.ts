import { Component } from "@angular/core";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from "../customers.service";
import { MessageService } from "primeng/api";
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: "app-edit-customers",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./edit-customers.component.html",
  styleUrl: "./edit-customers.component.scss",
})
export class EditCustomersComponent {
  editCustomerGroup: UntypedFormGroup;
  routes = routes;
  customerData: any;
  id: any;
  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];
   panregex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  // personNameRegex = /^[A-Za-z](?!.*\s{2})[A-Za-z. ]{2,28}[A-Za-z.]$/;
  personNameRegex =
    /^(?=.*[A-Za-z])[A-Za-z0-9](?!.*\s{2})[A-Za-z0-9. \/_-]{2,29}$/;
  // taxNumberRegex = /^[A-Za-z0-9]{15}$/;
  taxNumberRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{2,20}$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  billingAddressRegex = /^(?!\s)(?!.*\s{3})(.{3,500})$/s;
  phoneRegex = /^[0-9]{10}$/;
  constructor(
    private fb: UntypedFormBuilder,
    private Service: CustomersdataService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute
  ) // private service: WarehouseService
  {
    this.editCustomerGroup = this.fb.group({
      // wareHouse: ["", [Validators.required]],
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
      shippingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
      openingBalance: [0],
      balanceType: ["Received"],
      penCardNumber: ["", [Validators.pattern(this.panregex)]],
    });
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getCoustomers();
  }
  getCoustomers() {
    this.Service.GetCustomerDataById(this.id).subscribe((data: any) => {
      this.customerData = data;
      console.log(this.customerData);
      this.patchForm();
    });
  }
  patchForm() {
    this.editCustomerGroup.patchValue({
      name: this.customerData.name,
      phoneNumber: this.customerData.phoneNo,
      email: this.customerData.email,
      status: true,
      taxNumber: this.customerData.taxNo,
      creditPeriod: this.customerData.creaditPeriod,
      creditLimit: Number(this.customerData.creaditLimit),
      billingAddress: this.customerData.billingAddress,
      shippingAddress: this.customerData.shippingAddress,
      openingBalance: this.customerData.openingBalance,
      penCardNumber: this.customerData.penCardNumber,
    });
  }
  toUpperCase(event: any) {
    let val = event.target.value.toUpperCase();
    this.editCustomerGroup.patchValue({
      penCardNumber: val,
    });
  }

  editCustomerForm() {
    console.log(this.editCustomerGroup.value);

    const payload = {
      _id: this.id,
      name: this.editCustomerGroup.value.name,
      phoneNo: this.editCustomerGroup.value.phoneNumber,
      email: this.editCustomerGroup.value.email,
      status: true,
      taxNo: this.editCustomerGroup.value.taxNumber,
      creaditPeriod: this.editCustomerGroup.value.creditPeriod,
      creaditLimit: Number(this.editCustomerGroup.value.creditLimit),
      billingAddress: this.editCustomerGroup.value.billingAddress,
      shippingAddress: this.editCustomerGroup.value.shippingAddress,
      openingBalance: Number(this.editCustomerGroup.value.openingBalance),
      penCardNumber: this.editCustomerGroup.value.penCardNumber?.toUpperCase(),
    };
    console.log(payload);
    if (this.editCustomerGroup.value) {
      this.Service.UpDataCustomerApi(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            const message = "Customer details updated successfully.";
            this.messageService.add({
              severity: "success",
              detail: message,
            });
            setTimeout(() => {
              this.router.navigate(["/customers"]);
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
