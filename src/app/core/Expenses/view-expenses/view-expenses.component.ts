import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { ExpensesdataService } from "../expenses.service";

@Component({
  selector: "app-view-expenses",
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: "./view-expenses.component.html",
  styleUrl: "./view-expenses.component.scss",
})
export class ViewExpensesComponent {
  routes = routes;
  customerData: any[] = [];
  id: any;
  // this.socialLinks = this._data.socialLinks;

  constructor(
    private Service: ExpensesdataService,
    private activeRoute: ActivatedRoute
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getCoustomers();
  }
  getCoustomers() {
    this.Service.GetCustomerDataById(this.id).subscribe((data: any) => {
      console.log(data);
      this.customerData = [data];
    });
  }
}
