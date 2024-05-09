import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { DropdownModule } from "primeng/dropdown";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { MultiSelectModule } from "primeng/multiselect";
import { SharedModule } from "src/app/shared/shared.module";
import { blockCustomersDataService } from "../block-customer.service";

@Component({
  selector: 'app-add-block-customer',
  standalone: true,
  imports: [
    RouterModule,
    DropdownModule,
    CommonModule,
    SharedModule, 
    ToastModule,
    MultiSelectModule,
  ],
  templateUrl: './add-block-customer.component.html',
  styleUrl: './add-block-customer.component.scss',
  providers: [MessageService],
})
export class AddBlockCustomerComponent {
  addBlockCustomerForm: FormGroup;
  public routes = routes;
  wareHousedata: any;

  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];

  personNameRegex = /^(?! )[A-Za-z]{3,50}(?: [A-Za-z]{3,50})?$/;
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15)$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  billingAddressRegex = /^(?!\s)(?:.{3,500})$/;
  phoneRegex = /^[0-9]{10}$/;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private Service: blockCustomersDataService,
    private router: Router,
  ) {
    this.addBlockCustomerForm = this.fb.group({
      // wareHouse: ["", [Validators.required]],
      name: ["", [Validators.required, Validators.pattern(this.personNameRegex)]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(this.phoneRegex)],
      ],
      email: ["", [Validators.required, Validators.pattern(this.emailRegex)]],
      taxNumber: ["", [Validators.pattern(this.shortNameRegex)]],
      openingBalance: ["", [Validators.min(0)]],
      creditPeriod: ["", [Validators.min(0), Validators.max(120)]],
      creditLimit: ["", [Validators.min(0), Validators.max(150000)]],
      billingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
      shippingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
    });
  }

  addBlockCustomerFormSubmit() {
    const payload = {
      name: this.addBlockCustomerForm.value.name, 
      email: this.addBlockCustomerForm.value.email, 
      status: true, 
      phoneNo: this.addBlockCustomerForm.value.phoneNumber,
      taxNumber: this.addBlockCustomerForm.value.taxNumber,
      creditPeriod: this.addBlockCustomerForm.value.creditPeriod,
      creditLimit: this.addBlockCustomerForm.value.creditLimit,
      billingAddress: this.addBlockCustomerForm.value.billingAddress,
      shippingAddress: this.addBlockCustomerForm.value.shippingAddress,
      openingBalance: this.addBlockCustomerForm.value.openingBalance,
    };
    
    if (this.addBlockCustomerForm.valid) {
      console.log(payload);
      this.Service.creatBlockCustomer(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            const message = "Block Customer has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/block-customer"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }
  }
}
