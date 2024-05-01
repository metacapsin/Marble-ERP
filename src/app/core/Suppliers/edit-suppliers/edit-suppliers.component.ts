import { Component, OnInit } from "@angular/core";
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
import { MessageService } from "primeng/api";
import { SuppliersdataService } from "../suppliers.service";
import { ToastModule } from "primeng/toast";
import { MultiSelectModule } from "primeng/multiselect";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";

@Component({
  selector: "app-edit-suppliers",
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    DropdownModule,
    CommonModule,
    ToastModule,
    MultiSelectModule
  ],
  templateUrl: "./edit-suppliers.component.html",
  styleUrl: "./edit-suppliers.component.scss",
  providers: [MessageService],
})
export class EditSuppliersComponent implements OnInit {
  editSupplierGroup: UntypedFormGroup;
  routes = routes;
  id: any;
  SupplierData: any;
  wareHousedata:any

  // wareHouseArray = [{ name: "Electronifly" }, { name: "Warehouse Gas" }];

  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private Service: SuppliersdataService,
    private messageService: MessageService,
    private activeRoute: ActivatedRoute,
    private service: WarehouseService
  ) {
    this.editSupplierGroup = this.fb.group({
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
  ngOnInit(): void {
    this.getSupplier();
    this.service.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data;
    })
  }
  getSupplier() {
    this.Service.GetSupplierDataById(this.id).subscribe((data: any) => {
      this.SupplierData = data;
      console.log(this.SupplierData);
      this.patchForm();
    });
  }

  patchForm() {
    this.editSupplierGroup.patchValue({
      wareHouse: this.SupplierData.warehouse,
      name: this.SupplierData.name,
      phoneNumber: this.SupplierData.phoneNo,
      email: this.SupplierData.email,
      status: this.SupplierData.status,
      taxNumber: this.SupplierData.taxNo,
      openingBalance: this.SupplierData.openingBalance,
      creditPeriod: this.SupplierData.creditPeriod,
      creditLimit: this.SupplierData.creditLimit,
      billingAddress: this.SupplierData.billingAddress,
      shippingAddress: this.SupplierData.shippingAddress,
    });
  }

  editCustomerForm() {
    console.log(this.editSupplierGroup.value);
    let _status: boolean; // Change const to let
    if (this.editSupplierGroup.value.status.name === "Enabled") {
      _status = true;
    } else {
      _status = false;
    }
    const payload = {
      id: this.id,
      warehouse: this.editSupplierGroup.value.wareHouse,
      name: this.editSupplierGroup.value.name,
      email: this.editSupplierGroup.value.email,
      phoneNo: this.editSupplierGroup.value.phoneNumber,
      status: _status,
      taxNo: this.editSupplierGroup.value.taxNumber,
      creaditPeriod: this.editSupplierGroup.value.creditPeriod,
      creaditLimit: this.editSupplierGroup.value.creditLimit,
      billingAddress: this.editSupplierGroup.value.billingAddress,
      shippingAddress: this.editSupplierGroup.value.shippingAddress,
      openingBalance: this.editSupplierGroup.value.openingBalance,
    };
    if (this.editSupplierGroup.value) {
      this.Service.UpDataSupplierApi(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            // const message = "User has been updated";
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
