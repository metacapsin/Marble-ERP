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
import { CustomersdataService } from "src/app/core/Customers/customers.service";
import { ToastModule } from "primeng/toast";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
import { MultiSelectModule } from "primeng/multiselect";
import { SharedModule } from "src/app/shared/shared.module";

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
  editBlockCuatomerForm: FormGroup;
  routes = routes;
  customerData: any;
  id: any;

  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];
  personNameRegex = /^(?! )[A-Za-z]{3,50}(?: [A-Za-z]{3,50})?$/;
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15)$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  billingAddressRegex = /^(?!\s)(?:.{3,500})$/;
  phoneRegex = /^[0-9]{10}$/;

  constructor(
    private fb: FormBuilder,
    private Service: CustomersdataService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private service: WarehouseService
  ) {
    this.editBlockCuatomerForm = this.fb.group({
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
  }
  getCoustomers() {
    this.Service.GetCustomerDataById(this.id).subscribe((data: any) => {
      this.customerData = data;
      console.log(this.customerData);
      this.patchForm();
    });
  }
  patchForm() {
    this.editBlockCuatomerForm.patchValue({
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
  editBlockCuatomerFormSubmit() {

    const payload = {
      id: this.id,
      name: this.editBlockCuatomerForm.value.name,
      phoneNo: this.editBlockCuatomerForm.value.phoneNumber,
      email: this.editBlockCuatomerForm.value.email,
      status:this.editBlockCuatomerForm.value.status,
      taxNo: this.editBlockCuatomerForm.value.taxNumber,
      creaditPeriod: this.editBlockCuatomerForm.value.creditPeriod,
      creaditLimit: this.editBlockCuatomerForm.value.creditLimit,
      billingAddress: this.editBlockCuatomerForm.value.billingAddress,
      shippingAddress: this.editBlockCuatomerForm.value.shippingAddress,
      openingBalance: this.editBlockCuatomerForm.value.openingBalance,
    };
    console.log(payload);
    if (this.editBlockCuatomerForm.valid) {
      this.Service.UpDataCustomerApi(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
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
