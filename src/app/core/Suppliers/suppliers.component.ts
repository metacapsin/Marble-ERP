import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { Subscription } from "rxjs";
import { routes } from "src/app/shared/routes/routes";
import { SuppliersdataService } from "./suppliers.service";
// import { DialogModule } from "primeng/dialog";

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

  constructor(private router: Router, private Service: SuppliersdataService) {
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
      this.dataSource = [data];
    });
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
