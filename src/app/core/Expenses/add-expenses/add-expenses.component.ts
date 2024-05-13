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
import { ExpensesdataService } from "../expenses.service";
import { ToastModule } from "primeng/toast";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { MultiSelectModule } from "primeng/multiselect";
import { CalendarModule } from "primeng/calendar";
import { FileUploadModule } from "primeng/fileupload";
import { ExpensesCategoriesdataService } from "../../expenseCategories/expenseCategories.service";


@Component({
  selector: "app-add-expenses",
  standalone: true,
  imports: [
    RouterModule,
    ReactiveFormsModule,
    DropdownModule,
    CommonModule,
    CalendarModule,
    ToastModule,
    MultiSelectModule,
    FileUploadModule,
  ],
  templateUrl: "./add-expenses.component.html",
  styleUrl: "./add-expenses.component.scss",
  providers: [MessageService],
})
export class AddExpensesComponent implements OnInit {
  addExpensesGroup: UntypedFormGroup;
  public routes = routes;
  ExpensesCategories: any;
  ExpensesCategoriesArray:any
  expenses = [
    { name: "Utilities" },
    { name: "Printing" },
    { name: "Grocery" },
    { name: "Travel" },
  ];
  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  billingAddressRegex = /^(?!\s)(?:.{3,500})$/;
  phoneRegex = /^[0-9]{10}$/;

  constructor(
    private fb: UntypedFormBuilder,
    private messageService: MessageService,
    private Service: ExpensesdataService,
    private service: ExpensesCategoriesdataService,
    private router: Router,
  ) // private service: WarehouseService
  {
    this.addExpensesGroup = this.fb.group({
      categoryId: ["", [Validators.required]],
      date: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      notes: [""],
    });
  }

  onUpload(e) {
    console.log("hi");
    console.log(e);
    this.messageService.add({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded with Basic Mode",
    });
  }
  ngOnInit(): void {
    this.service.GetExpensesData().subscribe((resp: any) => {
      this.ExpensesCategories = resp;
      this.ExpensesCategoriesArray = [];
      this.ExpensesCategories.forEach(element => {
        this.ExpensesCategoriesArray.push({
          name: element.categoryName,
          _id: {
            _id: element._id,
            name: element.categoryName
          }
        })
    });
    });
  }
  addExpensesForm() {
    console.log(this.addExpensesGroup.value);
    const fromData = this.addExpensesGroup.value;
    const payload = {
      warehouse: fromData.expenseCategory,
      name: fromData.user,
      email: fromData.date,
      status: fromData.status.amount,
      phoneNo: fromData.notes,
      // taxNo: fromData.taxNumber,
      // creaditPeriod: fromData.creditPeriod,
      // creaditLimit: fromData.creditLimit,
      // billingAddress: fromData.billingAddress,
      // shippingAddress: fromData.shippingAddress,
      // openingBalance: fromData.openingBalance,
    };
    console.log(payload);

    if (this.addExpensesGroup.valid) {
      // this.Service.AddCustomerdata(payload).subscribe((resp: any) => {
      //   console.log(resp);
      //   if (resp) {
      //     if (resp.status === "success") {
      //       const message = "User has been added";
      //       this.messageService.add({ severity: "success", detail: message });
      //       setTimeout(() => {
      //         this.router.navigate(["/customers"]);
      //       }, 400);
      //     } else {
      //       const message = resp.message;
      //       this.messageService.add({ severity: "error", detail: message });
      //     }
      //   }
      // });
    }
  }
}
