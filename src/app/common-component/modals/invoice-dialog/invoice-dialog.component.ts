import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";

import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { SalesService } from "src/app/core/sales/sales.service";

@Component({
  selector: "app-invoice-dialog",
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    TableModule,
    DialogModule,
    ToastModule,
    TabViewModule,
  ],
  templateUrl: "./invoice-dialog.component.html",
  styleUrl: "./invoice-dialog.component.scss",
})
export class InvoiceDialogComponent implements OnInit{
  @Input() showInvoiceDialog: boolean;
  @Input() salesDataById: any = [];
  @Output() callbackModal = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();

  // data = [
  //   {
  //     _id: "",
  //     appliedTax: [],
  //     createdBy: "",
  //     createdByName: "",
  //     createdOn: "",
  //     customer: {
  //       _id: "",
  //       name: "",
  //     },
  //     name: "",
  //     dueAmount: 0,
  //     otherCharges: 0,
  //     paidAmount: 0,
  //     paymentStatus: "",
  //     salesDate: "",
  //     salesDiscount: 0,
  //     salesGrossTotal: 0,
  //     salesInvoiceNumber: "",
  //     salesItemDetails: [
  //       {
  //         salesItemProduct: "",
  //         salesItemQuantity: 0,
  //         salesItemUnitPrice: 0,
  //         salesItemSubTotal: "",
  //         salesItemTax: [
  //           {
  //             _id: "",
  //             name: "",
  //             taxType: "",
  //             taxRate: "",
  //             multipleTax: null,
  //             createdBy: "",
  //             createdOn: "",
  //             status: false,
  //           },
  //           {
  //             _id: "",
  //             name: "",
  //             taxType: "",
  //             taxRate: "",
  //             multipleTax: null,
  //             createdBy: "",
  //             createdOn: "",
  //             status: false,
  //           },
  //         ],
  //         salesItemTaxAmount: "",
  //       },
  //     ],
  //     salesNotes: "",
  //     salesOrderStatus: "",
  //     salesOrderTax: 0,
  //     salesShipping: 0,
  //     salesTermsAndCondition: "",
  //     salesTotalAmount: 0,
  //     status: false,
  //   },
  // ];


  ngOnInit() {
    console.log("this is sale invoice component");
    console.log("this is sale invoice component data",this.salesDataById)
  }

  closeTheWindow() {
    // debugger
    console.log("dialog close")
    this.close.emit();
  }

  onConfirm(){
    this.callbackModal.emit();
  }
}
