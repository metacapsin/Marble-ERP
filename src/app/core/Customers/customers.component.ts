import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { Subscription } from "rxjs";
import { routes } from "src/app/shared/routes/routes";
import { DialogModule } from "primeng/dialog";
import { CustomersdataService } from "./customers.service";

@Component({
  selector: "app-customers",
  templateUrl: "./customers.component.html",
  styleUrls: ["./customers.component.scss"],
})
export class CustomersComponent {
  items: MenuItem[] = [];
  public dataSource: any = []
  settingCategory = "";
  routes = routes;
  currentRoute!: string;
  routerChangeSubscription: Subscription;
  selectedProducts = [];
  searchDataValue: any;
  constructor(private router: Router,private Service: CustomersdataService) {
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
      console.log(data);
      this.dataSource = data
      console.log(this.dataSource);
    })
  }
  goToEditPage(value: any) {
    this.router.navigate(["/customers/add-customers/" + value]);
  }
  public searchData(value: any): void {
    this.dataSource = this.dataSource.map((i) => {
      if (i.firstName.toLowerCase().includes(value.trim().toLowerCase())) {
        return i;
      }
    });
  }
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }
  // dataSource: any[] = [
  //   {
  //     firstName: "John",
  //     lastName: "Doe",
  //     email: "john.doe@example.com",
  //     status: "Active",
  //     isUserLocked: false,
  //     createdAt: "15-04-2024 05:39 pm",
  //     Balance: "$9,111.15",
  //     role: ["admin"],
  //   },
  //   {
  //     firstName: "Jane",
  //     lastName: "Smith",
  //     email: "jane.smith@example.com",
  //     status: "Locked",
  //     createdAt: "15-04-2024 05:39 pm",
  //     Balance: "$9,111.15",
  //     isUserLocked: true,
  //     role: ["super-admin"],
  //   },
  //   {
  //     firstName: "Alice",
  //     lastName: "Johnson",
  //     email: "alice.johnson@example.com",
  //     status: "Active",
  //     createdAt: "15-04-2024 05:39 pm",
  //     Balance: "$9,111.15",
  //     isUserLocked: false,
  //     role: ["admin", "user"],
  //   },
  // ];
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
