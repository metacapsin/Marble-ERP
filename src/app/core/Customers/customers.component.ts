import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { routes } from "src/app/shared/routes/routes";
import { DialogModule } from "primeng/dialog";
import { CustomersdataService } from "./customers.service";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
  providers: [MessageService],
})
export class CustomersComponent {
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
  cols = [];
  exportColumns = [];
  constructor(private router: Router,private Service: CustomersdataService,private messageService: MessageService,private localStorageService:LocalStorageService) {
    this.routerChangeSubscription = this.router.events.subscribe((event) => {
      this.currentRoute = this.router.url;
      // console.log(this.currentRoute);
    });
  }
  ngOnInit() {
    this.getCoustomers()
  }
  getCoustomers(){
    this.Service.GetCustomerData().subscribe((data) => {
      this.dataSource = data
      this.originalData = data
      this.cols = [
        { field: "name", header: "Name" },
        { field: "email", header: "Email" },
        { field: "status", header: "Status" },
        { field: "shippingAddress", header: "Shipping Address" },
        { field: "billingAddress", header: "Billing Address" },
        { field: "creaditPeriod", header: "Creadit Period" },
        { field: "creaditLimit", header: "Creadit Limit" },
        { field: "taxNo", header: "Tax No" },
        { field: "phoneNo", header: "Phone No" },
        { field: "createdOn", header: "Created On" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.dataSource?.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
    })
  }
  goToEditPage(value: any) {
    this.router.navigate(["/customers/add-customers/" + value]);
  }
  // public searchData(value: any): void {
  //   this.dataSource = this.originalData.map((i) => {
  //     if (i.name.toLowerCase().includes(value.trim().toLowerCase())) {
  //       return i;
  //     }
  //   });
  // }
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
  changeCalendarSettingCategory(type: string) {}

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
  vewCustomer(e: string){
    console.log(e);
    this.router.navigate(["/customers/view-customers/"+e]);
  }
  editCustomer(e){
    console.log(e);
    this.router.navigate(["/customers/edit-customers/"+e]);
  }

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

  navigateToCreateCustomer() {
    const returnUrl = this.router.url;
    console.log(returnUrl);
    this.localStorageService.setItem("returnUrl", returnUrl)
    this.router.navigateByUrl("/customers/add-customers");
  }
  
}
