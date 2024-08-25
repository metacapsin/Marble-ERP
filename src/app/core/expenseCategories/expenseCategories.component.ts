import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { routes } from "src/app/shared/routes/routes";
import { DialogModule } from "primeng/dialog";
import { ExpensesCategoriesdataService } from "./expenseCategories.service";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";

@Component({
  selector: "app-expenseCategories",
  templateUrl: "./expenseCategories.component.html",
  styleUrls: ["./expenseCategories.component.scss"],
  providers: [MessageService],
})
export class ExpensesCategoriesComponent {
  routes = routes;
  public dataSource: any = [];
  public originalData: any = [];
  settingCategory = "";
  selectedCustomer = [];
  searchDataValue: any;
  showDialoge = false;
  modalData: any = {};
  expenseId: any;
  ExpensesByID: any;
  ExpensesDataById: any;
  addExpensesCategoryForm: FormGroup;
  editExpensesCategoryForm: FormGroup;
  id: any;
  visible: boolean = false;
  visible1: boolean = false;
  cols = [];
  exportColumns = [];

  descriptionRegex = /^.{3,500}$/s;

  constructor(
    private Service: ExpensesCategoriesdataService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.addExpensesCategoryForm = this.fb.group({
      categoryName: ["", [Validators.required]],
      categoryDescription: ["", [Validators.pattern(this.descriptionRegex)]],
    });
    this.editExpensesCategoryForm = this.fb.group({
      categoryName: ["", [Validators.required]],
      categoryDescription: ["", [Validators.pattern(this.descriptionRegex)]],
    });
  }
  getExpenses() {
    this.Service.GetExpensesCategriesData().subscribe((resp: any) => {
      this.dataSource = resp.data;
      this.originalData = resp.data;
      this.cols = [
        { field: "categoryName", header: "Category Name" },
        { field: "categoryDescription", header: "Category Description" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.dataSource.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
    });
  }

  ngOnInit() {
    this.getExpenses();
  }
  showDialog() {
    this.visible = true;
    this.addExpensesCategoryForm.reset();
  }
  addCloseDialog() {
    this.visible = false;
  }
  closeDialogEdit() {
    this.visible1 = false;
  }
  showDialogEdit(id: any) {
    // this.editExpensesCategoryForm.reset();
    this.visible1 = true;
    this.ExpensesByID = id;
    this.Service.GetExpenseCategriesDataById(id).subscribe((resp: any) => {
      this.patchValuesForm(resp.data);
    });
  }
  patchValuesForm(data: any) {
    this.editExpensesCategoryForm.patchValue({
      categoryName: data.categoryName,
      categoryDescription: data.categoryDescription,
    });
  }
  // for delete api
  deleteExpense(Id: any) {
    this.expenseId = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this expense category",
    };
    this.showNewDialog();
  }
  showNewDialog() {
    this.showDialoge = true;
  }
  callBackModal() {
    this.Service.DeleteExpensesCategriesApi(this.expenseId).subscribe(
      (resp: any) => {
        this.messageService.add({ severity: "success", detail: resp.message });
        this.getExpenses();
        this.close();
      }
    );
  }
  close() {
    this.showDialoge = false;
  }
  //

  public searchData(value: any): void {
    this.dataSource = this.originalData.filter((i) =>
      i.categoryName.toLowerCase().includes(value.trim().toLowerCase())
    );
  }
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.dataSource.slice(startIndex, endIndex);
  }

  addExpensesCategoryFormsubmit() {
    const payload = {
      categoryName: this.addExpensesCategoryForm.value.categoryName,
      categoryDescription:
        this.addExpensesCategoryForm.value.categoryDescription,
    };
    if (this.addExpensesCategoryForm.valid) {
      this.Service.AddExpensesCategriesdata(payload).subscribe((resp: any) => {
        this.visible = false;
        if (resp) {
          if (resp.status === "success") {
            const message = "Expenses Category has been added";
            this.messageService.add({ severity: "success", detail: message });
            this.getExpenses();
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    } else {
      console.log("Form is invalid");
    }
  }

  editExpensesCategoryFormSubmit() {
    const payload = {
      id: this.ExpensesByID,
      categoryName: this.editExpensesCategoryForm.value.categoryName,
      categoryDescription:
        this.editExpensesCategoryForm.value.categoryDescription,
    };

    if (this.editExpensesCategoryForm.valid) {
      this.Service.UpDataExpensesCategriesApi(payload).subscribe(
        (resp: any) => {
          if (resp.status === "success") {
            this.closeDialogEdit();
            const message = "Expenses Category has been updated";
            this.messageService.add({ severity: "success", detail: message });
            this.getExpenses();
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      );
    } else {
      console.log("Form is invalid!");
    }
  }
}
