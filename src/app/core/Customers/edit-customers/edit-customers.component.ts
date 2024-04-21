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
  imports: [RouterModule, ReactiveFormsModule, DropdownModule, CommonModule,ToastModule,MultiSelectModule],
  templateUrl: "./edit-customers.component.html",
  styleUrl: "./edit-customers.component.scss",
  providers: [MessageService],
})
export class EditCustomersComponent {
  editCustomerGroup: UntypedFormGroup;
  routes = routes;
  customerData: any;
  id: any;
  wareHousedata:any

  wareHouseArray = [{ name: "Electronifly" }, { name: "Warehouse Gas" }];

  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];
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
      name: ["", [Validators.required]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(new RegExp(/^.{3,20}$/))],
      ],
      email: ["", [Validators.required, Validators.email]],
      status: ["", [Validators.required]],
      taxNumber: ["", []],
      openingBalance: ["", []],
      creditPeriod: ["", []],
      creditLimit: ["", []],
      billingAddress: ["", []],
      shippingAddress: ["", []],
    });
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getCoustomers();

    this.service.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data;
    })
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
      status: this.customerData.status,
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
      taxNo: this.editCustomerGroup.value.taxNumber,
      creaditPeriod: this.editCustomerGroup.value.creditPeriod,
      creaditLimit: this.editCustomerGroup.value.creditLimit,
      billingAddress: this.editCustomerGroup.value.billingAddress,
      shippingAddress: this.editCustomerGroup.value.shippingAddress,
      openingBalance: this.editCustomerGroup.value.openingBalance,
    };
    console.log(payload);

    if (this.editCustomerGroup.value) {
      this.Service.UpDataCustomerApi(payload).subscribe(
        (resp: any) => {
          if (resp) {
            if (resp.status === "success") {
              // const message = "User has been updated";
              this.messageService.add({ severity: "success", detail: resp.message });
              setTimeout(() => {
                this.router.navigate(["/customers"]);
              }, 400);
            } else {
              const message = resp.message;
              this.messageService.add({ severity: "error", detail: message });
            }
          }
        }
      );
    } else {
      console.log("Form is invalid!");
    }
  }
}
