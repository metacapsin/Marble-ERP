import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { SuppliersdataService } from "../suppliers.service";
import { CustomersdataService } from "../../Customers/customers.service";

@Component({
  selector: "app-view-suppliers",
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: "./view-suppliers.component.html",
  styleUrl: "./view-suppliers.component.scss",
})
export class ViewSuppliersComponent {
  routes = routes;
  id: any;
  customerData: any[] = [];
  constructor(
    private Service: SuppliersdataService,
    private activeRoute: ActivatedRoute
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getSupplier();
  }
  getSupplier() {
    this.Service.GetSupplierDataById(this.id).subscribe((data: any) => {
      console.log(data);
      this.customerData = [data]; 
    });
  }
}
