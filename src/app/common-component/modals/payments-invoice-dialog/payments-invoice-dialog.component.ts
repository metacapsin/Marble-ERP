import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { ToastModule } from "primeng/toast";
import { SalesService } from "src/app/core/sales/sales.service";

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
export class PaymentsInvoiceDialogComponent implements OnInit {
  @Input() paymentVisible: boolean;
  @Input() dataById: any = [];
  // @Input() dataById: any = [];
  @Output() callbackModalForPayment = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  payableAmounts: string[]=[];
  totalAmount: number= 0
  
  // Variables for additional charges and discount
  discount: number = 0;
  shipping: number = 0;
  otherCharges: number = 0;

  constructor(private salesServicePayment: SalesService) {}


  ngOnInit() {
    console.log("this is payment invoice component");
    
    // this.payableAmounts = new Array(this.dataById.salesItemDetails.length).fill('');

    // console.log("id get in payment invoice popup ",this.dataById._id)
    
    // Fetch additional charges from API
    // this.fetchAdditionalCharges();

  }

  closeTheWindow() {
    // debugger;
    console.log("dialog close triggered in payment invoice component");
    this.close.emit();
    console.log("this is customer payment data",this.dataById)
  }



  onConfirm() {
    this.callbackModalForPayment.emit();
  }



  // fetchAdditionalCharges() {
  //   this.salesServicePayment.GetSalesDataById(this.dataById._id).subscribe((response: any) => {
  //     this.discount = response.discount || 0;
  //     this.shipping = response.shipping || 0;
  //     this.otherCharges = response.otherCharges || 0;
  //     this.updateTotal();
  //     console.log("this is discount in payment invoice", this.discount)
  //   });
  // }

  updateTotal() {
    const totalPayable = this.payableAmounts.reduce((sum, current) => {
      // Convert current to number using parseFloat, and handle empty strings gracefully
      const value = parseFloat(current) || 0;
      return sum + value;
    }, 0);
    // Calculate total amount
    this.totalAmount = totalPayable - this.dataById.discount + this.shipping + this.otherCharges;
  }
}








