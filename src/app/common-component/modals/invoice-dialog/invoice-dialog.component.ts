import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { TabViewModule } from "primeng/tabview";
import { TableModule } from "primeng/table";

import { DialogModule } from "primeng/dialog";
import { ToastModule } from "primeng/toast";
import { SalesService } from "src/app/core/sales/sales.service";
import { ButtonModule } from "primeng/button";

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
    ButtonModule
  ],
  templateUrl: "./invoice-dialog.component.html",
  styleUrl: "./invoice-dialog.component.scss",
})
export class InvoiceDialogComponent {
  @Input() showInvoiceDialog: boolean;
  @Input() salesDataById: any = [];
  @Input() paymentDataListById: any = [];
  @Output() callbackModal = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();


  closeTheWindow() {
    // debugger
    // console.log("dialog close")
    this.close.emit();
    
  }

  onConfirm(){
    this.callbackModal.emit();
  }
}
