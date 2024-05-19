import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { MessageService, SharedModule } from "primeng/api";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { ToastModule } from "primeng/toast";
import { PaymentInService } from "src/app/core/payment-in/payment-in.service";
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
    SharedModule,
    FormsModule,
    CalendarModule,
    DropdownModule,
    ReactiveFormsModule,
  ],
  templateUrl: "./payments-invoice-dialog.component.html",
  styleUrl: "./payments-invoice-dialog.component.scss",
})
export class PaymentsInvoiceDialogComponent implements OnInit {
  @Input() ShowPaymentInvoice: boolean;
  @Input() dataById: any = [];
  @Output() callbackModalForPayment = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  paymentInvoiceForm: FormGroup;
  payableAmounts: string[] = [];
  routes: { customers: string };
  paymentModeList = [{
    paymentMode: 'Cash'
  },
  {
    paymentMode: 'Bank'
  }];
  dueAmount= this.dataById.dueAmount;

  notesRegex = /^(?:.{2,100})$/;

  constructor(
    private paymentInService: PaymentInService,
    private messageService: MessageService,
    private fb: FormBuilder,
  ) {
    this.paymentInvoiceForm = this.fb.group({
      paymentDate: ["", [Validators.required]],
      paymentMode: ["", [Validators.required]],
      notes: ["", [Validators.required]],
      // totalAmount: ["", [Validators.required,this.amountExceedsTotalValidator.bind(this)]],
      totalAmount: ["", [Validators.required, Validators.max(this.dueAmount)]]
    });
  }

  ngOnInit() {

  }

  // amountExceedsTotalValidator(control: FormControl) {
  //   const amount = control.value;
  //   if (amount != null && amount > this.dataById.salesTotalAmount) {
  //     return { amountExceedsTotal: true };
  //   }
  //   return null;
  // }

  closeTheWindow() {
    this.close.emit();
    this.paymentInvoiceForm.reset();
    // this.dataById=[]
  }

  onConfirm() {
    this.callbackModalForPayment.emit();
  }

  paymentInvoiceFormSubmit() {
    const formData = this.paymentInvoiceForm.value;
    const payload = {
      customer: this.dataById.customer,
      paymentDate: formData.paymentDate,
      paymentMode: formData.paymentMode,
      sales: [
        {
          _id: this.dataById.salesId,
          amount: formData.totalAmount,
        }
      ],
      notes: formData.notes,
    }


    if (this.paymentInvoiceForm.valid) {
      this.paymentInService.createPayment(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Payment has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.close.emit();
              this.paymentInvoiceForm.reset();
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }
    else {
      console.log("invalid form");

    }
  }
}