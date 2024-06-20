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
import { MessageService } from "primeng/api";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { ToastModule } from "primeng/toast";
import { min } from "rxjs";
import { blockProcessorService } from "src/app/core/block-processor/block-processor.service";
import { PaymentInService } from "src/app/core/payment-in/payment-in.service";
import { PaymentOutService } from "src/app/core/payment-out/payment-out.service";
import { PurchaseReturnService } from "src/app/core/purchase-return/purchase-return.service";
import { SalesReturnService } from "src/app/core/sales-return/sales-return.service";
import { SalesService } from "src/app/core/sales/sales.service";
import { SharedModule } from "src/app/shared/shared.module";

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
    CalendarModule,
    DropdownModule,
    ReactiveFormsModule,
    SharedModule,
  
  ],
  templateUrl: "./payments-invoice-dialog.component.html",
  styleUrl: "./payments-invoice-dialog.component.scss",
})
export class PaymentsInvoiceDialogComponent implements OnInit {
  @Input() ShowPaymentInvoice: boolean;
  @Input() dataById: any = [];
  @Input() dataItemsGrid: any ;
  @Input() header:any;
  @Output() callbackModalForPayment = new EventEmitter<any>();
  @Output() close = new EventEmitter<any>();
  paymentInvoiceForm: FormGroup;
  payableAmounts: string[] = [];
  routes: { customers: string };
  maxDate = new Date();
  paymentModeList = [
    {
      paymentMode: "Cash",
    },
    {
      paymentMode: "Bank",
    },
  ];
  // dueAmount = this.dataById.salesDueAmount;

  notesRegex = /^(?:.{2,100})$/;

  constructor(
    private paymentInService: PaymentInService,
    private paymentOutService: PaymentOutService,
    private purchaseReturnPaymentService: PurchaseReturnService,
    private blockProcessorService: blockProcessorService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private salesReturnService: SalesReturnService
  ) {
    this.paymentInvoiceForm = this.fb.group({
      paymentDate: ["", [Validators.required]],
      paymentMode: ["", [Validators.required]],
      note: [""],
      totalAmount: [
        "",
        [
          Validators.required,
          Validators.min(0),
          Validators.max(this.dataById.salesDueAmount),
        ],
      ],
    });
  }

  ngOnInit() {}

  closeTheWindow() {
    this.close.emit();
    this.paymentInvoiceForm.reset();
    // this.dataById=[]
    console.log("this is data from open payment return dialog",this.dataItemsGrid)
  }

  onConfirm() {
    this.callbackModalForPayment.emit();
  }

  paymentInvoiceFormSubmit() {
    console.log("dataById",this.dataById);
    const formData = this.paymentInvoiceForm.value;

    console.log("this is form data", formData);
    if (this.dataById.isSalesReturn) {
      const payload = {
        customer: this.dataById.customer,
        paymentDate: formData.paymentDate,
        paymentMode: formData.paymentMode,
        salesReturnId: this.dataById.salesReturnId,
        amount: formData.totalAmount,
        note: formData.note,
      };
      if (this.paymentInvoiceForm.valid) {
        this.salesReturnService
          .createSalesReturnPayment(payload)
          .subscribe((resp: any) => {
            console.log(resp);
            if (resp) {
              if (resp.status === "success") {
                const message = "Payment Out has been added";
                this.messageService.add({
                  severity: "success",
                  detail: message,
                });
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
      } else {
        console.log("invalid form");
      }
    }

    if (this.dataById.isSales) {
      const payload = {
        customer: this.dataById.customer,
        paymentDate: formData.paymentDate,
        paymentMode: formData.paymentMode,
        sales: [
          {
            _id: this.dataById.salesId,
            amount: formData.totalAmount,
          },
        ],
        note: formData.note,
      };

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
      } else {
        console.log("invalid form");
      }
    }

    // for create purchase payment
    if (this.dataById.isPurchase) {
      const payload = {
        supplier: this.dataById.supplier,
        paymentDate: formData.paymentDate,
        paymentMode: formData.paymentMode,
        purchase: [
          {
            _id: this.dataById.purchaseId,
            amount: formData.totalAmount,
          },
        ],
        note: formData.note,
      };

      if (this.paymentInvoiceForm.valid) {
        this.paymentOutService.createPayment(payload).subscribe((resp: any) => {
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
      } else {
        console.log("invalid form");
      }
    }

    // for purchase return payment
    if (this.dataById.isPurchaseReturn) {
      const payload = {
        supplier: this.dataById.supplier,
        paymentDate: formData.paymentDate,
        paymentMode: formData.paymentMode,
        purchaseReturnId: this.dataById.purchaseReturnId,
        amount: formData.totalAmount,
        note: formData.note,
      };
      if (this.paymentInvoiceForm.valid) {
        this.purchaseReturnPaymentService.createPurchaseReturnPayment(payload).subscribe((resp: any) => {
          console.log(resp);
          if (resp) {
            if (resp.status === "success") {
              const message = "Payment In has been added";
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
      } else {
        console.log("invalid form");
      }
    }

    //For slab Processing Payment
    if (this.dataById.isSlabProcessing) {
      const payload = {
        processor: this.dataById.customer,
        paymentDate: formData.paymentDate,
        paymentMode: formData.paymentMode,
        slabProcessing: {
            _id: this.dataById.slabProcessing_id,
            amount: formData.totalAmount,
          },
          slabInvoiceNumber: this.dataById.processingInvoiceNo,
        note: formData.note,
      };
      if (this.paymentInvoiceForm.valid) {
        this.blockProcessorService.createPayment(payload).subscribe((resp: any) => {
          console.log(resp);
          if (resp) {
            if (resp.status === "success") {
              const message = "Slab Processing Payment has been added";
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
      } else {
        console.log("invalid form");
      }
    }
  }
}
