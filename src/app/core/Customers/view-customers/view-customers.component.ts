import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from "../customers.service";
import { PaymentInService } from "../../payment-in/payment-in.service";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";

@Component({
  selector: "app-view-customers",
  standalone: true,
  imports: [RouterModule, CommonModule, TabViewModule, TableModule],
  templateUrl: "./view-customers.component.html",
  styleUrl: "./view-customers.component.scss",
})
export class ViewCustomersComponent {
  routes = routes;
  customerData: any[] = [];
  paymentListData: any[] = [];
  salesDataById: any[] = [];
  id: any;
  // this.socialLinks = this._data.socialLinks;

  constructor(
    private Service: CustomersdataService,
    private activeRoute: ActivatedRoute,
    private PaymentInService: PaymentInService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getCoustomers();

    this.PaymentInService.getPaymentDetailById(this.id).subscribe(
      (resp: any) => {
        console.log("payments of customer",resp)
        
        this.paymentListData = resp.data;


      }
    );
    this.PaymentInService.getSalesByCustomerId(this.id).subscribe(
      (resp: any) => {
        console.log("sales of custonmer ", resp);

        this.salesDataById = resp.data;
        // console.log("sales Data by id ",this.salesDataById);
      }
    );
  }
  getCoustomers() {
    this.Service.GetCustomerDataById(this.id).subscribe((data: any) => {
      console.log(data);
      this.customerData = [data];
    });
  }
}
