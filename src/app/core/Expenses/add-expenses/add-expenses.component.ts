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
import { MessageService } from "primeng/api";
import { ExpensesdataService } from "../expenses.service";
import { ExpensesCategoriesdataService } from "../../expenseCategories/expenseCategories.service";
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: "app-add-expenses",
  standalone: true,
  imports: [
    SharedModule
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
  maxDate = new Date();
  
  personNameRegex = /^(?! )[A-Za-z](?:[A-Za-z ]{0,28}[A-Za-z])?$/;
  descriptionRegex = /^.{3,500}$/s;

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
      recipient: ["", [Validators.required, Validators.pattern(this.personNameRegex)]],
      amount: ["", [Validators.required,Validators.min(0),Validators.max(100000)]],
      notes: ["", [Validators.pattern(this.descriptionRegex)]],
    });
  }

  // onUpload(e) {
  //   console.log("hi");
  //   console.log(e);
  //   this.messageService.add({
  //     severity: "info",
  //     summary: "Success",
  //     detail: "File Uploaded with Basic Mode",
  //   });
  // }
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
      amount: Number(fromData.amount),
      date: fromData.date,
      recipient: fromData.recipient,
      notes: fromData.notes,
    };
    console.log(payload);

    if (this.addExpensesGroup.valid) {
      this.Service.AddExpensesdata(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Expenses has been added";
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
