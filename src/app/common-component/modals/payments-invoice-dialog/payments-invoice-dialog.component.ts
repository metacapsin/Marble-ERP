import { CommonModule } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-payments-invoice-dialog",
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    TableModule,
    DialogModule,
    ToastModule,
    TabViewModule,
    FormsModule,
  ],
  templateUrl: "./payments-invoice-dialog.component.html",
  styleUrl: "./payments-invoice-dialog.component.scss",
})
export class PaymentsInvoiceDialogComponent {
  @Input() paymentVisible: boolean;
  @Input() dataById: any = [];
  @Output() callbackModalForPayment = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  TotalValue:any
  // @Input() header: string;
  // @Output() headerChange = new EventEmitter<string>();

  // updateHeader(newHeader: string) {
  //   this.header = newHeader;
  //   this.headerChange.emit(this.header);
  // }

  // data: any = [
  //   {
  //     _id: "663e0331a7f5b94ea9503245",
  //     createdBy: "662b8256ead0c76c25d9072f",
  //     createdByName: "Adnan",
  //     createdOn: "2024-05-10T11:21:21.450Z",
  //     customer: {
  //       _id: "662de1bd5cbb13423d7ec6ad",
  //       name: "Liyakat Hyussain",
  //     },
  //     name: "Liyakat Hyussain",
  //     dueAmount: 71900,
  //     otherCharges: 5200,
  //     paidAmount: 1000,
  //     paymentStatus: "Partial Paid",
  //     salesDate: "05/10/2024",
  //     salesDiscount: 2500,
  //     salesGrossTotal: 65000,
  //     salesInvoiceNumber: "20",
  //     salesItemDetails: [
  //       {
  //         salesItemProduct: "Granite",
  //         salesItemQuantity: 20,
  //         salesItemUnitPrice: 2500,
  //         salesItemSubTotal: "65000.00",
  //         salesItemTax: [],
  //         salesItemTaxAmount: "15000.00",
  //       },
  //     ],
  //     salesNotes: "",
  //     salesOrderStatus: "Confirmed",
  //     salesOrderTax: 0,
  //     salesShipping: 5200,
  //     salesTermsAndCondition: "",
  //     salesTotalAmount: 72900,
  //     status: true,
  //   },
  // ];

  ngOnInit() {
    console.log("this is payment invoice component");
  }

  closeTheWindow() {
    debugger
    console.log("dialog close");
    this.close.emit();
  }

  onConfirm() {
    this.callbackModalForPayment.emit();
  }
}
