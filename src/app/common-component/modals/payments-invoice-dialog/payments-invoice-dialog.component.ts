import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
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
  // @Input() dataById: any = [];
  @Output() callbackModalForPayment = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  payableAmounts: string[] = [];
  totalAmount = this.dataById.salesTotalAmount; // Example value, replace with actual data
customerId=this.dataById._id
// customerId=this.dataById[0].customer._id
  // Variables for additional charges and discount
  discount: number = 0;
  shipping: number = 0;
  otherCharges: number = 0;
  paymentInvoiceForm: UntypedFormGroup;
  routes: { customers: string };
  paymentModeList = [{
    paymentMode: 'Cash'
  },
{
  paymentMode:'Online'
}];

notesRegex = /^(?:.{2,100})$/;

  constructor(
    private salesServicePayment: SalesService,
    private paymentInService: PaymentInService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.paymentInvoiceForm = this.fb.group({
      paymentDate: ["", [Validators.required]],
      paymentMode: ["", [Validators.required]],
      notes: ["", [Validators.required]],
      paybleAmount: ["", [Validators.required,this.amountExceedsTotalValidator.bind(this)]],
    });
    // this.routes = {
    //   customers: '/customers'
    // };
  }

  ngOnInit() {
    console.log("this is payment invoice component");
  }

  amountExceedsTotalValidator(control: FormControl) {
    const amount = control.value;
    if (amount != null && amount > this.totalAmount) {
      return { amountExceedsTotal: true };
    }
    return null;
  }

  closeTheWindow() {
    this.close.emit();
    this.dataById=[]
  }

  onConfirm() {
    this.callbackModalForPayment.emit();
  }
  paymentInvoiceFormSubmit() {
    const formData = this.paymentInvoiceForm.value;
    console.log('Submitted data:', formData);
    console.log('customer Id:', this.customerId);

    const payload = {
      customer: this.customerId,
      paymentDate: formData.paymentDate,
      paymentMode: formData.paymentMode,
      notes: formData.notes,
      paybleAmount: formData.paybleAmount
    }


    if (this.paymentInvoiceForm.valid) {
      console.log("valid form");

      this.paymentInService.createPayment(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Payment has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.close.emit();
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