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
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  selector: "app-add-customers",
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, DropdownModule, CommonModule,ToastModule,MultiSelectModule],
  templateUrl: "./add-customers.component.html",
  styleUrl: "./add-customers.component.scss",
  providers:[MessageService]
})
export class AddCustomersComponent implements OnInit{
  addcustomerGroup: UntypedFormGroup;
  public routes = routes;
  wareHousedata:any

  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];
  constructor(
    private fb: UntypedFormBuilder,
    private messageService: MessageService,
    private Service: CustomersdataService,
    private router: Router,
    private service: WarehouseService
  ) {
    this.addcustomerGroup = this.fb.group({
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
  }

  ngOnInit(): void {
    this.service.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data;
    })
  }
  addcustomerForm() {
    console.log(this.addcustomerGroup.value);
    const payload = {
      warehouse: this.addcustomerGroup.value.wareHouse,//req
      name: this.addcustomerGroup.value.name,//req
      email: this.addcustomerGroup.value.email,//req
      status: this.addcustomerGroup.value.status.name,//req
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
