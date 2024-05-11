import { Component } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { routes } from "src/app/shared/routes/routes";
import { DialogModule } from "primeng/dialog";
import { ExpensesCategoriesdataService } from "./expenseCategories.service";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";

@Component({
  selector: "app-expenseCategories",
  templateUrl: "./expenseCategories.component.html",
  styleUrls: ["./expenseCategories.component.scss"],
  providers: [MessageService],
})
export class ExpensesCategoriesComponent {
  items: MenuItem[] = [];
  public dataSource: any = [];
  public originalData: any = [];
  settingCategory = "";
  routes = routes;
  currentRoute!: string;
  routerChangeSubscription: Subscription;
  selectedCustomer = [];
  searchDataValue: any;
  showDialoge = false;
  modalData: any = {};
  expenseId: any;
  ExpensesByID: any;
  ExpensesDataById: any;
  addExpensesCategory: UntypedFormGroup;
  editExpensesCategory: UntypedFormGroup;
  id: any;
  visible: boolean = false;
  visible1: boolean = false;
  constructor(
    private router: Router,
    private Service: ExpensesCategoriesdataService,
    private messageService: MessageService,
    private fb: UntypedFormBuilder,
    private activeRoute: ActivatedRoute
  ) {
    this.routerChangeSubscription = this.router.events.subscribe((event) => {
      this.currentRoute = this.router.url;
    });
    this.addExpensesCategory = this.fb.group({
      categoryName: ["", [Validators.required]],
      categoryDescription: [""],
    });
    this.editExpensesCategory = this.fb.group({
      categoryName: ["", [Validators.required]],
      categoryDescription: [""],
    });
    this.id = this.activeRoute.snapshot.params["id"];
  }
  getExpenses() {
    this.Service.GetExpensesData().subscribe((data) => {
      this.dataSource = data;
      this.originalData = data;
    });
  }
  addExpensesCategoryForm() {
    console.log(this.addExpensesCategory.value);
    if (this.addExpensesCategory.valid) {
      this.visible = false;
      const payload = {
        categoryName: this.addExpensesCategory.value.categoryName,
        categoryDescription: this.addExpensesCategory.value.categoryDescription,
      };
      this.Service.AddExpensesdata(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "User has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/expenseCategories"]);
              this.getExpenses();
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    } else {
    }
  }
  editExpensesCategoryForm() {
    console.log(this.editExpensesCategory.value);
    if (this.editExpensesCategory.valid) {
      this.visible1 = false;
      const payload = {
        id: this.ExpensesByID,
        categoryName: this.editExpensesCategory.value.categoryName,
        categoryDescription:
          this.editExpensesCategory.value.categoryDescription,
      };
      console.log(this.ExpensesByID);
      this.Service.UpDataExpensesApi(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            this.messageService.add({
              severity: "success",
              detail: resp.message,
            });
            setTimeout(() => {
              this.router.navigate(["/expenseCategories"]);
              this.getExpenses();
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    } else {
    }
  }
  ngOnInit() {
    this.getExpenses();
  }
  showDialog() {
    this.visible = true;
    this.addExpensesCategory.reset();
  }
  addCloseDialog() {
    this.visible = false;
  }
  closeDialogEdit() {
    this.visible1 = false;
  }
  showDialogEdit(id: any) {
    this.visible1 = true;
    this.editExpensesCategory.reset();
    this.ExpensesByID = id;
    this.Service.GetExpensesDataById(id).subscribe((resp: any) => {
      console.log(resp);
      this.ExpensesDataById = resp;
      console.log(this.ExpensesDataById);
      this.patchValuesForm(this.ExpensesDataById);
    });
  }
  patchValuesForm(data: any) {
    console.log(data);
    this.editExpensesCategory.patchValue({
      categoryName: data.categoryName,
      categoryDescription: data.categoryDescription,
    });
  }
  // for delete api
  deleteExpense(Id: any) {
    this.expenseId = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this expense",
    };
    this.showNewDialog();
  }
  showNewDialog() {
    this.showDialoge = true;
  }
  callBackModal() {
    this.Service.DeleteExpensesApi(this.expenseId).subscribe((resp: any) => {
      this.messageService.add({ severity: "success", detail: resp.message });
      this.getExpenses();
      this.close();
    });
  }
  close() {
    this.showDialoge = false;
  }
  public searchData(value: any): void {
    this.dataSource = this.originalData.filter((i) =>
      i.name.toLowerCase().includes(value.trim().toLowerCase())
    );
  }
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.dataSource.slice(startIndex, endIndex);
  }
  ngOnDestroy() {
    this.routerChangeSubscription.unsubscribe();
  }
  isRouteActive(text) {
    if (!this.currentRoute) return "";
    let str = this.currentRoute?.includes(text);
    if (str) {
      return "active";
    } else {
      return "non-active";
    }
  }
}
