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
import { ExpensesdataService } from "../expenses.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { MultiSelectModule } from "primeng/multiselect";
import { CalendarModule } from "primeng/calendar";
import { FileUploadModule } from "primeng/fileupload";
import { ExpensesCategoriesdataService } from "../../expenseCategories/expenseCategories.service";

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
    FileUploadModule,
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
  ExpensesCategories: any;
  ExpensesCategoriesArray:any

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;

  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  billingAddressRegex = /^(?!\s)(?:.{3,500})$/;

  phoneRegex = /^[0-9]{10}$/;
  constructor(
    private fb: UntypedFormBuilder,
    private Service: ExpensesdataService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private service: ExpensesCategoriesdataService,
  ) {
    this.editExpensesGroup = this.fb.group({
      categoryDetails: ["", [Validators.required]],
      date: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      notes: [""],
    });
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getExpenses();
    this.getExpensesById();
  }
  getExpensesById() {
    this.Service.GetExpensesDataById(this.id).subscribe((resp: any) => {
      this.customerData = resp.data;
      console.log(this.customerData);
      this.patchForm(this.customerData)
    });
  }
  getExpenses() {
    this.service.GetExpensesCategriesData().subscribe((resp: any) => {
      this.ExpensesCategories = resp.data;
      this.ExpensesCategoriesArray = [];
      this.ExpensesCategories.forEach(element => {
        this.ExpensesCategoriesArray.push({
          name: element.categoryName,
          _id: element._id,
        })
    });
    });
  }
  patchForm(data:any) {
    this.editExpensesGroup.patchValue({
      categoryDetails: data.categoryDetails,
      amount: data.amount,
      date: data.date,
      notes: data.notes,
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
  editCustomerForm() {
    console.log(this.editExpensesGroup.value);
    const fromData = this.editExpensesGroup.value;

    const payload = {
      id: this.id,
      categoryDetails: fromData.categoryDetails,
      amount: fromData.amount,
      date: fromData.date,
      notes: fromData.notes,
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
              this.router.navigate(["/expenses"]);
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
