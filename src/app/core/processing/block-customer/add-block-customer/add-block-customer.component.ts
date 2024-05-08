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
import { CustomersdataService } from "src/app/core/Customers/customers.service";
import { ToastModule } from "primeng/toast";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  selector: 'app-add-block-customer',
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    DropdownModule,
    CommonModule,
    ToastModule,
    MultiSelectModule,
  ],
  templateUrl: './add-block-customer.component.html',
  styleUrl: './add-block-customer.component.scss',
  providers: [MessageService],
})
export class AddBlockCustomerComponent {
  addcustomerGroup: UntypedFormGroup;
  public routes = routes;
  wareHousedata: any;

  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];

  personNameRegex = /^(?! )[A-Za-z]{3,50}(?: [A-Za-z]{3,50})?$/;

  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{1,10})$/;

  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  billingAddressRegex = /^(?!\s)(?:.{3,500})$/;

  phoneRegex = /^[0-9]{10}$/;

  constructor(
    private fb: UntypedFormBuilder,
    private messageService: MessageService,
    private Service: CustomersdataService,
    private router: Router,
    private service: WarehouseService
  ) {
    this.addcustomerGroup = this.fb.group({
      wareHouse: ["", [Validators.required]],
      name: ["", [Validators.required, Validators.pattern(this.personNameRegex)]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(this.phoneRegex)],
      ],
      email: ["", [Validators.required, Validators.pattern(this.emailRegex)]],
      // status: ["", [Validators.required]],
      taxNumber: ["", [Validators.pattern(this.shortNameRegex)]],
      openingBalance: ["", [Validators.min(0)]],
      creditPeriod: ["", [Validators.min(0), Validators.max(120)]],
      creditLimit: ["", [Validators.min(0), Validators.max(150000)]],
      billingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
      shippingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
    });
  }

  ngOnInit(): void {
    this.service.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data;
    });
  }
  addcustomerForm() {
    console.log(this.addcustomerGroup.value);
    const payload = {
      warehouse: this.addcustomerGroup.value.wareHouse, //req
      name: this.addcustomerGroup.value.name, //req
      email: this.addcustomerGroup.value.email, //req
      status: true, //req
      phoneNo: this.addcustomerGroup.value.phoneNumber,
      taxNo: this.addcustomerGroup.value.taxNumber,
      creaditPeriod: this.addcustomerGroup.value.creditPeriod,
      creaditLimit: this.addcustomerGroup.value.creditLimit,
      billingAddress: this.addcustomerGroup.value.billingAddress,
      shippingAddress: this.addcustomerGroup.value.shippingAddress,
      openingBalance: this.addcustomerGroup.value.openingBalance,
    };
    console.log(payload);

    if (this.addcustomerGroup.value) {
      this.Service.AddCustomerdata(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "User has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/customers"]);
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
