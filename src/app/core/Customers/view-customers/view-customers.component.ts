import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from "../customers.service";
import { PaymentInService } from "../../payment-in/payment-in.service";
import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";
import { SalesService } from "../../sales/sales.service";
import { SharedModule } from "primeng/api";
import { DropdownModule } from "primeng/dropdown";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-view-customers",
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, RouterModule, TableModule, CalendarModule, DialogModule, ToastModule, TabViewModule],

  templateUrl: "./view-customers.component.html",
  styleUrl: "./view-customers.component.scss",
})
export class ViewCustomersComponent {
  routes = routes;
  customerData: any[] = [];
  paymentListData: any[] = [];
  salesDataById: any[] = [];
  id: any;

  saleId: any;
  showDialoge = false;
  modalData: any = {};

  // this.socialLinks = this._data.socialLinks;

  constructor(
    private Service: CustomersdataService,
    private activeRoute: ActivatedRoute,
    private PaymentInService: PaymentInService,
    private salesService: SalesService,
    private router: Router,

  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getCoustomers();

    this.PaymentInService.getPaymentList().subscribe(
      (resp: any) => {
        console.log("payments of customer",resp)
        
        this.paymentListData = resp.data;


      }
    );
    this.salesService.GetSalesData().subscribe(
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

  showInvoiceDialog(id: any) {
    this.router.navigate(["/customers/invoice-customers/" + id]);
  }

  editSalesRout(id) {
    this.router.navigate(["/sales/edit-sales/" + id]);
  }
  deleteSales(Id: any) {
    this.saleId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Sales Details"
    }
    this.showDialoge = true;
  }

}
