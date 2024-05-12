import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { SuppliersdataService } from "../suppliers.service";
import { PurchaseService } from "../../purchase/purchase.service";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { PaymentOutService } from "../../payment-out/payment-out.service";

@Component({
  selector: "app-view-suppliers",
  standalone: true,
  imports: [RouterModule, CommonModule, TabViewModule, TableModule],
  templateUrl: "./view-suppliers.component.html",
  styleUrl: "./view-suppliers.component.scss",
})
export class ViewSuppliersComponent {
  routes = routes;
  id: any;
  customerData:any;
  paymentListData: any[] = [];
  purchaseDataById: any[] = [];
  constructor(
    private Service: SuppliersdataService,
    private activeRoute: ActivatedRoute,
    private PaymentOutService: PaymentOutService,
    private purchaseService: PurchaseService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getSupplier();

    this.PaymentOutService.getPaymentDetailById(this.id).subscribe(
      (resp: any) => {
        console.log("payments of customer",resp)
        
        this.paymentListData = resp.data;


      }
    );
    this.purchaseService.GetPurchaseDataById(this.id).subscribe(
      (resp: any) => {
        console.log("Purchase of Supplier ", resp);

        this.purchaseDataById = resp.data;
        // console.log("sales Data by id ",this.salesDataById);
      }
    );

  }
  getSupplier() {
    this.Service.GetSupplierDataById(this.id).subscribe((data: any) => {
      this.customerData = [data]; 
      console.log(this.customerData);
    });
  }
}
