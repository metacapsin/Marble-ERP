import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { routes } from "src/app/shared/routes/routes";
import { DialogModule } from "primeng/dialog";
import { ExpensesdataService } from "./expenses.service";

@Component({
  selector: "app-expenses",
  templateUrl: "./expenses.component.html",
  styleUrls: ["./expenses.component.scss"],
  providers: [MessageService],
})
export class ExpensesComponent {
  items: MenuItem[] = [];
  public dataSource: any = []
  public originalData: any = []
  settingCategory = "";
  routes = routes;
  currentRoute!: string;
  routerChangeSubscription: Subscription;
  selectedExpenses = [];
  searchDataValue: any;
  showDialoge = false;
  modalData: any = {};
  expenseId: any;
  cols = [];
  exportColumns = [];
  constructor(private router: Router,private Service: ExpensesdataService,private messageService: MessageService) {
    // this.routerChangeSubscription = this.router.events.subscribe((event) => {
    //   this.currentRoute = this.router.url;
    // });
  }
  ngOnInit() {
    this.getExpense()
  }
  getExpense(){
    this.Service.GetExpensesData().subscribe((rsep:any) => {
      this.dataSource = rsep.data
      this.originalData = rsep.data
      this.cols = [
        { field: "recipient", header: "Recipient" },
        { field: "date", header: "Date" },
        { field: "categoryDetails.name", header: "Category Details Name" },
        { field: "amount", header: "Amount" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      this.exportColumns = this.dataSource.map((element) => ({
        title: element.header,
        dataKey: element.field,
      }));
      console.log(rsep.data);
    })
  }

  visible: boolean = false;
  showDialog() {
    this.visible = true;
  }

  // vewCustomer(e: string){
  //   console.log(e);
  //   this.router.navigate(["/customers/view-customers/"+e]);
  // }
  editExpense(e){
    console.log(e);
    this.router.navigate(["/expenses/edit-expenses/"+e]);
  }









  // for delete api
  deleteExpense(Id: any) {
this.expenseId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Expenses"
    }
    this.showDialoge = true;
  }
  showNewDialog() {
    this.showDialoge = true;
  }
  callBackModal() {
    this.Service.DeleteExpensesApi(this.expenseId).subscribe((resp:any) => {
      this.messageService.add({ severity: 'success', detail:  resp.message });
      this.getExpense();
      this.showDialoge = false;
    })
  }









  close() {
    this.showDialoge = false;
  }
  // public searchData(value: any): void {
  //   this.dataSource = this.originalData.filter(i =>
  //   i.name.toLowerCase().includes(value.trim().toLowerCase())
  // );
  // }
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows; 
    const currentPageData = this.dataSource.slice(startIndex, endIndex);
  }
}
