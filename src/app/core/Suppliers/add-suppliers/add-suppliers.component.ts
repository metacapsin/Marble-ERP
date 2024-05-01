import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
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
import { SuppliersdataService } from "../suppliers.service";
import { ToastModule } from "primeng/toast";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { MultiSelectModule } from "primeng/multiselect";

@Component({
  selector: "app-add-suppliers",
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, DropdownModule, CommonModule,ToastModule,MultiSelectModule],
  templateUrl: "./add-suppliers.component.html",
  styleUrl: "./add-suppliers.component.scss",
  providers: [MessageService],
})
export class AddSuppliersComponent {
  addSupplierGroup: UntypedFormGroup;
  routes = routes;
  wareHousedata:any

  wareHouseArray = [{ name: "Electronifly" }, { name: "Warehouse Gas" }];

  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private Service: SuppliersdataService,
    private messageService: MessageService,
    private service: WarehouseService
  ) {
    this.addSupplierGroup = this.fb.group({
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
    console.log(this.addSupplierGroup.value);
    let _status: boolean; // Change const to let
    if (this.addSupplierGroup.value.status.name === "Enabled") {
      _status = true;
    }else{
      _status = false;
    }
    // "warehouse" : "Warehouse Gas",
    // "name" : "vishnu",
    // "email" :"abc@gmail.com",
    // "phoneNo" : 1234567890,
    // "taxNo" : 512,
    // "status" : true,
    // "creditPeriod" : 54.5,
    // "creditLimit" : 5,
    // "billingAddress" : "jaipur",
    // "shippingAddress" :"jaipur",
    // "openingBalance" : 1000
    const payload = {
      warehouse: this.addSupplierGroup.value.wareHouse,
      name: this.addSupplierGroup.value.name,
      email: this.addSupplierGroup.value.email,
      phoneNo: this.addSupplierGroup.value.phoneNumber,
      taxNo: this.addSupplierGroup.value.taxNumber,
      status: _status,
      creditPeriod: this.addSupplierGroup.value.creditPeriod,
      creditLimit: this.addSupplierGroup.value.creditLimit,
      billingAddress: this.addSupplierGroup.value.billingAddress,
      shippingAddress: this.addSupplierGroup.value.shippingAddress,
      openingBalance: this.addSupplierGroup.value.openingBalance,
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
