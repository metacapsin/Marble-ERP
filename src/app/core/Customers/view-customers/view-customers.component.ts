import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from "../customers.service";

@Component({
  selector: "app-view-customers",
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: "./view-customers.component.html",
  styleUrl: "./view-customers.component.scss",
})
export class ViewCustomersComponent {
  routes = routes;
  customerData: any[] = [];
  id: any;
  // this.socialLinks = this._data.socialLinks;

  constructor(
    private Service: CustomersdataService,
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
