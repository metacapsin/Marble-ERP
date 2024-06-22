import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";

import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { SalesService } from "src/app/core/sales/sales.service";
import { ButtonModule } from "primeng/button";
import { SharedModule } from "src/app/shared/shared.module";
import { UsersdataService } from "src/app/core/users/services/usersdata.service";
import { AuthService } from "src/app/shared/auth/auth.service";
import { HttpClient } from "@angular/common/http";
import { PurchaseService } from "src/app/core/purchase/purchase.service";

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
    ButtonModule,
    SharedModule,
  ],
  templateUrl: "./invoice-dialog.component.html",
  styleUrl: "./invoice-dialog.component.scss",
})
export class InvoiceDialogComponent implements OnInit {
  @Input() showInvoiceDialog: boolean;
  @Input() salesDataById: any;
  @Input() header: any = [];
  @Input() paymentDataListById: any = [];
  @Output() callbackModal = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();

  sellerData: any;
  constructor(
    private userData: AuthService,
    private salesService: SalesService,
    private purchaseService: PurchaseService,

    private http: HttpClient
  ) {}
  ngOnInit() {
    this.userData.getUserProfile().subscribe((user: any) => {
      this.sellerData = user.data;
      console.log("THis is buyer data on invoice", this.sellerData);
    });
  }
  closeTheWindow() {
    // debugger
    // console.log("dialog close")
    this.close.emit();
  }



  downloadSalesFile(id: any) {
    if (!id) {
      console.error("No ID provided for download");
      return;
    }

    this.salesService.downloadSalesInvoice(id).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sales-invoice.pdf"; // Adjust the file name and extension as needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error("Download failed", error);
      }
    );
  }
  downloadPurchaseFile(id: any) {
    if (!id) {
      console.error("No ID provided for download");
      return;
    }

    this.purchaseService.downloadPurchaseInvoice(id).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement("a");
        a.href = url;
        a.download = "purchase-invoice.pdf"; // Adjust the file name and extension as needed
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      (error) => {
        console.error("Download failed", error);
      }
    );
  }

  onConfirm() {
    this.callbackModal.emit();
  }
  print() {
    window.print();
  }
}

// salesDataById
