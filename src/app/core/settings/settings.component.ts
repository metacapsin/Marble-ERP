import { Component, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem } from "primeng/api";
import { Subscription } from "rxjs";
import { routes } from "src/app/shared/routes/routes";

@Component({
  selector: "app-settings",
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"],
})
export class SettingsComponent {
  items: MenuItem[] = [];
  settingCategory = "";
  routes = routes;
  currentRoute!: string;
  text: string = "";
  routerChangeSubscription: Subscription;
  constructor(private router: Router, private elementRef: ElementRef) {
    this.routerChangeSubscription = this.router.events.subscribe((event) => {
      this.currentRoute = this.router.url;
      console.log(this.currentRoute)
    });
  }
  ngOnInit() {
    this.routerChangeSubscription = this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
      console.log(this.currentRoute)
      this.updateBreadcrumb();
    });

    // this.findPageName('Profile Information')
    this.isRouteActive('practice-information');
  }

  updateBreadcrumb() {
    const path = this.router.url.split("/"); // Get the last part of the URL
    switch (path[2]) {
      case "users":
        if (path[3]) {
          this.text = `Users`;
        } else {
          this.text = "Users";
        }
        break;
      case "warehouse":
        this.text = "Warehouse";
        break;
      case "categories":
        this.text = "Categories";
        break;
      case "subCategories":
        this.text = "Sub Categories";
        break;
      case "billing-Address":
        if (path[3]) {
          this.text = "Billing Address";
        } else {
          this.text = "Billing Address";
        }
        break;
      case "taxes":
        this.text = "Taxes";
        break;
      default:
        this.text = "Profile Information"; // Default case
        break;
    }
  }

  changeCalendarSettingCategory(type: string) {}

  ngOnDestroy() {
    if (this.routerChangeSubscription) {
      this.routerChangeSubscription.unsubscribe();
    }
  }

  isRouteActive(text) {
    console.log(this.currentRoute);
    if (!this.currentRoute) return "";
    let str = this.currentRoute?.includes(text);
    console.log(str);
    if (str) {
      return "active";
    } else {
      return "non-active";
    }
  }
  findPageName(text) {
    console.log(text);
    this.text = text;
  }
}
