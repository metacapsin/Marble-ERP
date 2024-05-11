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
import { ExpensesCategoriesdataService } from "../expenseCategories.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { MultiSelectModule } from "primeng/multiselect";
import { CalendarModule } from "primeng/calendar";

@Component({
  selector: "app-edit-expenses",
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    DropdownModule,
    CommonModule,
    ToastModule,
    MultiSelectModule,
    CalendarModule,
  ],
  templateUrl: "./edit-expenses.component.html",
  styleUrl: "./edit-expenses.component.scss",
  providers: [MessageService],
})
export class EditExpensesComponent {
  editExpensesGroup: UntypedFormGroup;
  routes = routes;
  customerData: any;
  id: any;
  wareHousedata: any;

  wareHouseArray = [{ name: "Electronifly" }, { name: "Warehouse Gas" }];

  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;

  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  billingAddressRegex = /^(?!\s)(?:.{3,500})$/;

  phoneRegex = /^[0-9]{10}$/;
  constructor(
    private fb: UntypedFormBuilder,
    private Service: ExpensesCategoriesdataService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private service: WarehouseService
  ) {
    this.editExpensesGroup = this.fb.group({
      // wareHouse: ["", [Validators.required]],
      // name: ["", [Validators.required, Validators.pattern(this.nameRegex)]],
      // phoneNumber: [
      //   "",
      //   [Validators.required, Validators.pattern(this.phoneRegex)],
      // ],
      // email: ["", [Validators.required, Validators.pattern(this.emailRegex)]],
      // status: ["", [Validators.required]],
      // taxNumber: ["", [Validators.pattern(this.shortNameRegex)]],
      // openingBalance: ["", [Validators.min(0)]],
      // creditPeriod: ["", [Validators.min(0), Validators.max(120)]],
      // creditLimit: ["", [Validators.min(0), Validators.max(150000)]],
      // billingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
      // shippingAddress: ["", [Validators.pattern(this.billingAddressRegex)]],
      expenseCategory: ["", [Validators.required]],
      user: [""],
      date: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      notes: [""],
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
    this.Service.GetExpensesDataById(this.id).subscribe((data: any) => {
      this.customerData = data;
      console.log(this.customerData);
      this.patchForm();
    });
  }
  patchForm() {
    let _status: any;
    if (this.customerData.status == true) {
      _status = "Enabled";
    } else {
      _status = "Disabled";
    }
    this.editExpensesGroup.patchValue({
      // wareHouse: this.customerData.warehouse,
      // name: this.customerData.name,
      // phoneNumber: this.customerData.phoneNo,
      // email: this.customerData.email,
      // status: _status,
      // taxNumber: this.customerData.taxNo,
      // openingBalance: this.customerData.openingBalance,
      // creditPeriod: this.customerData.creaditPeriod,
      // creditLimit: this.customerData.creaditLimit,
      // billingAddress: this.customerData.billingAddress,
      // shippingAddress: this.customerData.shippingAddress,
      // warehouse: fromData.expenseCategory,
      // name: fromData.user, 
      // email: fromData.date,
      // status: fromData.status.amount, 
      // phoneNo: fromData.notes,
    });
  }
  editCustomerForm() {
    console.log(this.editExpensesGroup.value);
    const fromData = this.editExpensesGroup.value;

    const payload = {
      id: this.id,
      warehouse: fromData.expenseCategory,
      name: fromData.user, 
      email: fromData.date,
      status: fromData.status.amount, 
      phoneNo: fromData.notes,
    };
    console.log(payload); 
    if (this.editExpensesGroup.valid) {
      this.Service.UpDataExpensesApi(payload).subscribe((resp: any) => {
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
