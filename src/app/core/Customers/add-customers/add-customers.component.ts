import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
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
import { CustomersdataService } from "../customers.service";
import { ToastModule } from "primeng/toast";
import { MultiSelectModule } from "primeng/multiselect";
import { SharedModule } from "src/app/shared/shared.module";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

@Component({
  selector: "app-add-customers",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./add-customers.component.html",
  styleUrl: "./add-customers.component.scss",
})
export class AddCustomersComponent implements OnInit {
  addcustomerGroup: UntypedFormGroup;
  public routes = routes;
  returnUrl: string;
  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];

  // personNameRegex = /^[A-Za-z](?!.*\s{2})[A-Za-z. ]{2,28}[A-Za-z.]$/;
  personNameRegex = /^[A-Za-z0-9](?!.*\s{2})[A-Za-z0-9. \/_-]{2,29}$/;
  taxNumberRegex = /^[A-Za-z0-9]{15}$/;
  emailRegex: string = "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  billingAddressRegex = /^.{3,500}$/s;
  phoneRegex = /^[0-9]{10}$/;

  constructor(
    private fb: UntypedFormBuilder,
    private messageService: MessageService,
    private Service: CustomersdataService,
    private router: Router,
    private localStorageService: LocalStorageService,

  ) {
    this.addcustomerGroup = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(this.personNameRegex)]],
      phoneNo: ["", [Validators.required, Validators.pattern(this.phoneRegex)]],
      email: ["", [Validators.pattern(this.emailRegex)]],
      taxNo: ["", [Validators.pattern(this.taxNumberRegex)]],
      creditPeriod: ["", [Validators.min(0), Validators.max(180)]],
      creditLimit: ["", [Validators.min(0), Validators.max(9999999)]],
      billingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
      shippingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
    });
  }

  ngOnInit(): void {
    this.returnUrl = this.localStorageService.getItem("returnUrl");
  }
  onCancel(){
    this.router.navigateByUrl(this.returnUrl);
  }
  
  addcustomerForm() {
    console.log(this.addcustomerGroup.value);
    const payload = {
      name: this.addcustomerGroup.value.name, //req
      email: this.addcustomerGroup.value.email, //req
      status: true, //req
      phoneNo: this.addcustomerGroup.value.phoneNo,
      taxNo: this.addcustomerGroup.value.taxNo,
      creaditPeriod: this.addcustomerGroup.value.creditPeriod,
      creaditLimit: Number(this.addcustomerGroup.value.creditLimit),
      billingAddress: this.addcustomerGroup.value.billingAddress,
      shippingAddress: this.addcustomerGroup.value.shippingAddress,
    };
    console.log(payload);

    if (this.addcustomerGroup.value) {
      this.Service.AddCustomerdata(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Customers has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              // this.router.navigate(["/customers"]);
              this.router.navigateByUrl(this.returnUrl);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }
  }
  // [routerLink]="['/customers/view-customers/', product._id]"
  
}
