import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { routes } from "src/app/shared/routes/routes";
import { blockProcessorService } from "../block-processor.service";
import { PaymentOutService } from "../../payment-out/payment-out.service";
import { PurchaseService } from "../../purchase/purchase.service";

@Component({
  selector: "app-view-block-processor",
  standalone: true,
  imports: [RouterModule, CommonModule, TabViewModule, TableModule],
  templateUrl: "./view-block-processor.component.html",
  styleUrl: "./view-block-processor.component.scss",
})
export class ViewBlockProcessorComponent {
  routes = routes;
  id: any;
  blockProcessorData:any;
  paymentListData: any[] = [];
  purchaseDataById: any[] = [];
  constructor(
    private activeRoute: ActivatedRoute,
    private blockProcessorService: blockProcessorService,
    private PaymentOutService: PaymentOutService,
    private purchaseService: PurchaseService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }
  ngOnInit() {
    this.getBlockProcessor();

    this.PaymentOutService.getPaymentList().subscribe(
      (resp: any) => {
        console.log("payments of customer",resp)
        
        this.paymentListData = resp.data;


      }
    );
    this.purchaseService.GetPurchaseData().subscribe(
      (resp: any) => {
        console.log("Purchase of Supplier ", resp);

        this.purchaseDataById = resp.data;
        // console.log("sales Data by id ",this.salesDataById);
      }
    );

  }
  getBlockProcessor() {
    this.blockProcessorService.getBlockProcessorDataById(this.id).subscribe((data: any) => {
      this.blockProcessorData = [data]; 
      console.log(this.blockProcessorData);
    });
  }
}
