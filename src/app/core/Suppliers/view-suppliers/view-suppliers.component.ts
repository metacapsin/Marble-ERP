import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";

@Component({
  selector: "app-view-suppliers",
  standalone: true,
  imports: [RouterModule,CommonModule],
  templateUrl: "./view-suppliers.component.html",
  styleUrl: "./view-suppliers.component.scss",
})
export class ViewSuppliersComponent {
  routes = routes;
  customerData = [
    {
      name: "Supplier 1",
      email: "Supplier@gmail.com",
      phoneNumber: "234324",
      openingBalance: "50.00",
      billingAddress: "Supplier Billing Address",
      creditPeriod: "30 day(s)",
      creditLimit: "20.00",
      balance: "300.00",
      taxNumber: "12389524",
    },
  ];
}