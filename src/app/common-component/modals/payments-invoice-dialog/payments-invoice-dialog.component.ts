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
  TotalValue: any;

  ngOnInit() {
    console.log("this is payment invoice component");
  }

  closeTheWindow() {
    debugger;
    console.log("dialog close");
    this.close.emit();
  }

  onConfirm() {
    this.callbackModalForPayment.emit();
  }
}








