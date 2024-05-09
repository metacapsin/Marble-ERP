import { Component } from "@angular/core";
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { DropdownModule } from "primeng/dropdown";
import { CommonModule } from "@angular/common";
import { CustomersdataService } from "../customers.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  selector: "app-edit-customers",
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    DropdownModule,
    CommonModule,
    ToastModule,
    MultiSelectModule,
  ],
  templateUrl: "./edit-customers.component.html",
  styleUrl: "./edit-customers.component.scss",
  providers: [MessageService],
})
export class EditCustomersComponent {
  editCustomerGroup: UntypedFormGroup;
  routes = routes;
  customerData: any;
  id: any;
  wareHousedata: any;

  wareHouseArray = [{ name: "Electronifly" }, { name: "Warehouse Gas" }];

  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];

  personNameRegex = /^(?! )[A-Za-z]{3,50}(?: [A-Za-z]{3,50})?$/;

  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15)$/;

  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  billingAddressRegex = /^(?!\s)(?:.{3,500})$/;

  phoneRegex = /^[0-9]{10}$/;
  constructor(
    private fb: UntypedFormBuilder,
    private Service: CustomersdataService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private service: WarehouseService
  ) {
    this.editCustomerGroup = this.fb.group({
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
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getCoustomers();

    this.service.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data;
    });
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
      wareHouse: this.customerData.warehouse,
      name: this.customerData.name,
      phoneNumber: this.customerData.phoneNo,
      email: this.customerData.email,
      status: true,
      taxNumber: this.customerData.taxNo,
      openingBalance: this.customerData.openingBalance,
      creditPeriod: this.customerData.creaditPeriod,
      creditLimit: this.customerData.creaditLimit,
      billingAddress: this.customerData.billingAddress,
      shippingAddress: this.customerData.shippingAddress,
    });
  }
  editCustomerForm() {
    console.log(this.editCustomerGroup.value);

    const payload = {
      id: this.id,
      warehouse: this.editCustomerGroup.value.wareHouse,
      name: this.editCustomerGroup.value.name,
      phoneNo: this.editCustomerGroup.value.phoneNumber,
      email: this.editCustomerGroup.value.email,
      status:this.editCustomerGroup.value.status,
      taxNo: this.editCustomerGroup.value.taxNumber,
      creaditPeriod: this.editCustomerGroup.value.creditPeriod,
      creaditLimit: this.editCustomerGroup.value.creditLimit,
      billingAddress: this.editCustomerGroup.value.billingAddress,
      shippingAddress: this.editCustomerGroup.value.shippingAddress,
      openingBalance: this.editCustomerGroup.value.openingBalance,
    };
    console.log(payload);
    if (this.editCustomerGroup.value) {
      this.Service.UpDataCustomerApi(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            // const message = "User has been updated";
            this.messageService.add({
              severity: "success",
              detail: resp.message,
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
