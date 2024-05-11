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
import { ToastModule } from "primeng/toast";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { MultiSelectModule } from "primeng/multiselect";
import { CalendarModule } from "primeng/calendar";
import { ExpensesCategoriesdataService } from "../expenseCategories.service";

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
  ],
  templateUrl: "./add-expenses.component.html",
  styleUrl: "./add-expenses.component.scss",
  providers: [MessageService],
})
export class AddExpensesComponent implements OnInit {
  addExpensesGroup: UntypedFormGroup;
  public routes = routes;
  wareHousedata: any;
  statusArray = [{ name: "Enabled" }, { name: "Disabled" }];
  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,15})$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  billingAddressRegex = /^(?!\s)(?:.{3,500})$/;
  phoneRegex = /^[0-9]{10}$/;

  constructor(
    private fb: UntypedFormBuilder,
    private messageService: MessageService,
    private Service: ExpensesCategoriesdataService,
    private router: Router,
    // private service: WarehouseService
  ) {
    this.addExpensesGroup = this.fb.group({
      expenseCategory: ["", [Validators.required]],
      user: ["",],
      date: ["", [Validators.required]],
      amount: ["", [Validators.required]],
      notes: ["",],
    });
  }

  ngOnInit(): void {
  
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
}