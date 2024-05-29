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
  ExpensesCategoriesArray: any;
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
    private router: Router
  ) {
    this.addExpensesGroup = this.fb.group({
      categoryDetails: ["", [Validators.required]],
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
    this.service.GetExpensesCategriesData().subscribe((resp: any) => {
      this.ExpensesCategories = resp.data;
      this.ExpensesCategoriesArray = [];
      console.log(this.ExpensesCategories);
      this.ExpensesCategories.forEach((element) => {
        this.ExpensesCategoriesArray.push({
          name: element.categoryName,
          _id: element._id,
        });
      });
    });
  }
  addExpensesFormSubmit() {
    console.log(this.addExpensesGroup.value);
    const fromData = this.addExpensesGroup.value;
    const payload = {
      categoryDetails: fromData.categoryDetails,
      amount: fromData.amount,
      date: fromData.date,
      notes: fromData.notes,
    };
    console.log(payload);

    if (this.addExpensesGroup.valid) {
      this.Service.AddExpensesdata(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "User has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/expenses"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }
  }
}
