import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { routes } from "src/app/shared/routes/routes";
import { SuppliersdataService } from "./suppliers.service";

@Component({
  selector: "app-suppliers",
  templateUrl: "./suppliers.component.html",
  styleUrls: ["./suppliers.component.scss"],
})
export class SuppliersComponent {
  items: MenuItem[] = [];
  settingCategory = "";
  routes = routes;
  currentRoute!: string;
  routerChangeSubscription: Subscription;
  selectedProducts = [];
  searchDataValue: any;
  getSupplierShow:any
  SuppliersId:any
  showDialoge = false;
  modalData: any = {};
  originalData:any = [];
  cols = [];
  exportColumns = [];

  constructor(private router: Router, private Service: SuppliersdataService, private messageService: MessageService) {
    this.routerChangeSubscription = this.router.events.subscribe((event) => {
      this.currentRoute = this.router.url;
      // console.log(this.currentRoute);
    });
  }
  ngOnInit() {
    this.getSupplier();
  }
  getSupplier() {
    this.Service.GetSupplierData().subscribe((data) => {
      this.getSupplierShow = data;
      this.originalData = data;
      this.cols = [
        { field: "name", header: "Name" },
        { field: "email", header: "Email" },
        { field: "status", header: "Status" },
        { field: "shippingAddress", header: "Shipping Address" },
        { field: "billingAddress", header: "Billing Address" },
        { field: "creditLimit", header: "Credit Limit" },
        { field: "creditPeriod", header: "Credit Period" },
        { field: "taxNo", header: "Tax No" },
        { field: "phoneNo", header: "Phone No" },
        { field: "createdOn", header: "Created On" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.getSupplierShow.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
      console.log(this.getSupplierShow);
    });
  }
  editSuppliers(id:any){
    this.router.navigate(['/suppliers/edit-suppliers/'+ id]);
  }
  goToEditPage(value: any) {
    this.router.navigate(["/suppliers/add-suppliers/" + value]);
  }
  suppliersView(id:any){
    this.router.navigate(['/suppliers/view-suppliers/'+ id]);
  }
  deleteSuppliers(id:any){
    console.log("delete");
    
    this.SuppliersId = id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Suppliers"
    }
    this.showDialoge = true;
  }

  showNewDialog() {
    this.showDialoge = true;
  }

  callBackModal() {
    this.Service.DeleteSupplierApi(this.SuppliersId).subscribe((resp:any) => {
      let message = "Suppliers has been Deleted"
      this.messageService.add({ severity: 'success', detail:message });
      this.getSupplier();
      this.showDialoge = false;
    })
  }

  close() {
    this.showDialoge = false;
  }
public searchData(value: any): void {
  this.getSupplierShow = this.originalData.filter(i =>
  i.name.toLowerCase().includes(value.trim().toLowerCase())
);
}

onPageChange(event) {
  const startIndex = event.first;
  const endIndex = startIndex + event.rows; 
  const currentPageData = this.dataSource.slice(startIndex, endIndex);
}

  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
  dataSource: any[] = [];
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
}
