import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { routes } from "src/app/shared/routes/routes";
import { DialogModule } from "primeng/dialog";
import { ExpensesCategoriesdataService } from "./expenseCategories.service";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-expenseCategories",
  templateUrl: "./expenseCategories.component.html",
  styleUrls: ["./expenseCategories.component.scss"],
  providers: [MessageService],
})
export class ExpensesCategoriesComponent {
  items: MenuItem[] = [];
  public dataSource: any = []
  public originalData: any = []
  settingCategory = "";
  routes = routes;
  currentRoute!: string;
  routerChangeSubscription: Subscription;
  selectedCustomer = [];
  searchDataValue: any;
  showDialoge = false;
  modalData: any = {};
  customerId: any;
  addExpensesCategory: UntypedFormGroup;
  editExpensesCategory: UntypedFormGroup;
  constructor(private router: Router,private Service: ExpensesCategoriesdataService,private messageService: MessageService,private fb: UntypedFormBuilder,) {
    this.routerChangeSubscription = this.router.events.subscribe((event) => {
      this.currentRoute = this.router.url;
    });
    this.addExpensesCategory = this.fb.group({
      expenseCategoryName: ["", [Validators.required]],
      description: ["",],
    });
    this.editExpensesCategory = this.fb.group({
      expenseCategoryName: ["", [Validators.required]],
      description: ["",],
    });
  }
  addExpensesCategoryForm(){
    console.log(this.addExpensesCategory.value);
    if(this.addExpensesCategory.valid){
    this.visible = false;
    }

  }
  editExpensesCategoryForm(){
  console.log(this.editExpensesCategory.value);
  if(this.editExpensesCategory.valid){
    this.visible1 = false;
    }
  }

  ngOnInit() {
    this.getCoustomers()
  }
  getCoustomers(){
    this.Service.GetCustomerData().subscribe((data) => {
      this.dataSource = data
      this.originalData = data
    })
  }
  // goToEditPage(value: any) {
  //   this.router.navigate(["/customers/add-customers/" + value]);
  // }
  visible: boolean = false;
  visible1: boolean = false;
  showDialog() {
    this.visible = true;
    this.addExpensesCategory.reset();
  }
  clodeDialog() {
    this.visible = false;
  }
  showDialogEdit() {
    this.visible1 = true;
    this.editExpensesCategory.reset();
  }
  clodeDialogEdit() {
    this.visible1 = false;
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
  // vewCustomer(e: string){
  //   console.log(e);
  //   this.router.navigate(["/customers/view-customers/"+e]);
  // }
  editCustomer(e){
    console.log(e);
    this.router.navigate(["/expenseCategories/edit-expensesCategories/"+e]);
  }









  // for delete api
  deleteCustomer(Id: any) {
this.customerId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Customer"
    }
    this.showDialoge = true;
  }
  showNewDialog() {
    this.showDialoge = true;
  }
  callBackModal() {
    this.Service.DeleteCustomerApi(this.customerId).subscribe((resp:any) => {
      this.messageService.add({ severity: 'success', detail:  resp.message });
      this.getCoustomers();
      this.showDialoge = false;
    })
  }









  close() {
    this.showDialoge = false;
  }
  public searchData(value: any): void {
    this.dataSource = this.originalData.filter(i =>
    i.name.toLowerCase().includes(value.trim().toLowerCase())
  );
  }
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows; 
    const currentPageData = this.dataSource.slice(startIndex, endIndex);
  }
}
