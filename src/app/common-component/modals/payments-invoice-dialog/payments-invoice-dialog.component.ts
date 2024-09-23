import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MessageService } from "primeng/api";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { ToastModule } from "primeng/toast";
import { blockProcessorService } from "src/app/core/block-processor/block-processor.service";
import { PaymentInService } from "src/app/core/payment-in/payment-in.service";
import { PaymentOutService } from "src/app/core/payment-out/payment-out.service";
import { PurchaseReturnService } from "src/app/core/purchase-return/purchase-return.service";
import { SalesReturnService } from "src/app/core/sales-return/sales-return.service";
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
  @Input() dataItemsGrid: any;
  @Input() header: any;
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
    {
      paymentMode: "Cheque",
    }
  ];
  taxableDue = 0
  nonTaxableDue = 0

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
      taxablePaymentAmount: [""],
      nonTaxablePaymentAmount: [""],
      taxablePaymentMode: [""],
      nonTaxablePaymentMode: [""],
    });
  }

  ngOnInit() {
    this.onFormChanges();

   }



   // Function to track changes in the payment fields
   onFormChanges(): void {
    this.paymentInvoiceForm.valueChanges.subscribe(() => {
      const taxablePayment = this.paymentInvoiceForm.get(
        'taxablePaymentAmount'
      )?.value;
      const nonTaxablePayment = this.paymentInvoiceForm.get(
        'nonTaxablePaymentAmount'
      )?.value;

      // If either one of the amounts is filled, mark the form as valid
      if (taxablePayment || nonTaxablePayment) {
        this.paymentInvoiceForm.get('totalAmount')?.setValidators(null); // Remove validators from totalAmount
        this.paymentInvoiceForm.get('totalAmount')?.updateValueAndValidity();
      } else {
        // If neither is filled, keep the form invalid
        this.paymentInvoiceForm.get('totalAmount')?.setValidators([Validators.required, Validators.min(1)]);
        this.paymentInvoiceForm.get('totalAmount')?.updateValueAndValidity();
      }
    });
  }

  ngOnChanges(changes: SimpleChange) {
    console.log("this.dataById", this.dataById);

    if (this.ShowPaymentInvoice) {
      let totalAmount = this.paymentInvoiceForm.get("totalAmount");

      if (this.dataById.isPurchase) {
        let taxablePaymentAmount = this.paymentInvoiceForm.get(
          "taxablePaymentAmount"
        );
        let nonTaxablePaymentAmount = this.paymentInvoiceForm.get(
          "nonTaxablePaymentAmount"
        );
        totalAmount.clearValidators();
        taxablePaymentAmount.clearValidators();
        nonTaxablePaymentAmount.clearValidators();
        console.log("this.dataById.isPurchase", this.dataById.isPurchase);

        totalAmount.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.dataById.purchaseDueAmount),
        ]);
        taxablePaymentAmount.setValidators([
          Validators.min(0),
          Validators.max(this.dataById.taxableDue),
        ]);
        nonTaxablePaymentAmount.setValidators([
          Validators.min(0),
          Validators.max(this.dataById.nonTaxableDue),
        ]);
        taxablePaymentAmount.updateValueAndValidity();
        totalAmount.updateValueAndValidity();
        nonTaxablePaymentAmount.updateValueAndValidity();
        this.paymentInvoiceForm.patchValue({
          taxablePaymentAmount: Number(this.dataById.taxableDue),
          taxablePaymentMode: "Bank",
          nonTaxablePaymentMode: "Cash",
          nonTaxablePaymentAmount: Number(this.dataById.nonTaxableDue),
          paymentMode: "Bank / Cash"
        });
        this.onSalesPaymentAmountChanges()
      } else if (this.dataById.isSales) {
        let taxablePaymentAmount = this.paymentInvoiceForm.get(
          "taxablePaymentAmount"
        );
        let nonTaxablePaymentAmount = this.paymentInvoiceForm.get(
          "nonTaxablePaymentAmount"
        );
        totalAmount.clearValidators();
        taxablePaymentAmount.clearValidators();
        nonTaxablePaymentAmount.clearValidators();
        totalAmount.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.dataById.salesDueAmount),
        ]);
        taxablePaymentAmount.setValidators([
          Validators.min(0),
          Validators.max(this.dataById.taxableDue),
        ]);
        nonTaxablePaymentAmount.setValidators([
          Validators.min(0),
          Validators.max(this.dataById.nonTaxableDue),
        ]);
        taxablePaymentAmount.updateValueAndValidity();
        totalAmount.updateValueAndValidity();
        nonTaxablePaymentAmount.updateValueAndValidity();
        this.paymentInvoiceForm.patchValue({
          taxablePaymentAmount: Number(this.dataById.taxableDue),
          taxablePaymentMode: "Bank",
          nonTaxablePaymentMode: "Cash",
          nonTaxablePaymentAmount: Number(this.dataById.nonTaxableDue),
          paymentMode: "Bank / Cash"
        });
        this.onSalesPaymentAmountChanges()
      } else if (this.dataById.isSalesReturn) {
        totalAmount.clearValidators();
        console.log("this.dataById.isSalesReturn", this.dataById.isSalesReturn);

        totalAmount.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.dataById.salesDueAmount),
        ]);
        totalAmount.updateValueAndValidity();
      } else if (this.dataById.isPurchaseReturn) {
        totalAmount.clearValidators();
        totalAmount.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.dataById.purchaseDueAmount),
        ]);
        totalAmount.updateValueAndValidity();
      } else if (this.dataById.isSlabProcessing) {
        totalAmount.clearValidators();
        totalAmount.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.dataById.dueAmount),
        ]);
        totalAmount.updateValueAndValidity();
      }
    }
  }

  onSalesPaymentAmountChanges() {
    let totalAmount = this.paymentInvoiceForm.get("totalAmount");
    let taxablePaymentAmount = this.paymentInvoiceForm.get(
      "taxablePaymentAmount"
    );
    let nonTaxablePaymentAmount = this.paymentInvoiceForm.get(
      "nonTaxablePaymentAmount"
    );
    let total =
      Number(taxablePaymentAmount.value) +
      Number(nonTaxablePaymentAmount.value);
    totalAmount.setValue(total);

  }
  closeTheWindow() {
    this.close.emit();
    this.paymentInvoiceForm.reset();
  }

  onConfirm() {
    this.callbackModalForPayment.emit();
  }

  onPaymentModeChange(){
    const formData = this.paymentInvoiceForm.value;
    let paymentmode =`${formData.taxablePaymentMode} / ${formData.nonTaxablePaymentMode}`

    this.paymentInvoiceForm.get('paymentMode').setValue(paymentmode)
  }

  paymentInvoiceFormSubmit() {
    const formData = this.paymentInvoiceForm.value;

    if (this.dataById.isSalesReturn) {
      const payload = {
        customer: this.dataById.customer,
        paymentDate: formData.paymentDate,
        paymentMode: formData.paymentMode,
        salesReturnId: this.dataById.salesReturnId,
        amount: Number(formData.totalAmount),
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
      console.log("this is sales payment forms", this.paymentInvoiceForm.value)
      console.log("form status", this.paymentInvoiceForm.status); // Check if the form is invalid or valid

      const payload = [{
        customer: this.dataById.customer,
        paymentDate: formData.paymentDate,
        paymentMode: formData.paymentMode,
        sales: [
          {
            _id: this.dataById.salesId,
            amount: Number(formData.totalAmount),
            salesInvoiceNumber: this.dataById.salesInvoiceNumber,
          },
        ],
        taxablePaymentAmount: formData.taxablePaymentAmount
          ? {
            amount: formData.taxablePaymentAmount,
            paymentMode: formData.taxablePaymentMode,
          }
          : null,
        nonTaxablePaymentAmount: formData.nonTaxablePaymentAmount
          ? {
            amount: formData.nonTaxablePaymentAmount,
            paymentMode: formData.nonTaxablePaymentMode,
          }
          : null,
        note: formData.note,
      }]

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
      // for (const key of Object.keys(this.paymentInvoiceForm.controls)) {
      //   if (this.paymentInvoiceForm.controls[key].invalid) {
      //     console.log(`Invalid control: ${key}, Errors:`, this.paymentInvoiceForm.controls[key].errors);
      //   }
      // }
      const payload = [{
        supplier: this.dataById.supplier,
        paymentDate: formData.paymentDate,
        paymentMode: formData.paymentMode,
        purchase: [
          {
            _id: this.dataById.purchaseId,
            amount: Number(formData.totalAmount),
            purchaseInvoiceNumber: this.dataById.purchaseInvoiceNumber,
          },
        ],
        taxablePaymentAmount: formData.taxablePaymentAmount
          ? {
            amount: formData.taxablePaymentAmount,
            paymentMode: formData.taxablePaymentMode,
          }
          : null,
        nonTaxablePaymentAmount: formData.nonTaxablePaymentAmount
          ? {
            amount: formData.nonTaxablePaymentAmount,
            paymentMode: formData.nonTaxablePaymentMode,
          }
          : null,
        note: formData.note,
      }]


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
        amount: Number(formData.totalAmount),
        note: formData.note,
      };
      if (this.paymentInvoiceForm.valid) {
        this.purchaseReturnPaymentService
          .createPurchaseReturnPayment(payload)
          .subscribe((resp: any) => {
            console.log(resp);
            if (resp) {
              if (resp.status === "success") {
                const message = "Payment In has been added";
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

    //For slab Processing Payment
    if (this.dataById.isSlabProcessing) {
      const payload = {
        processor: this.dataById.customer,
        paymentDate: formData.paymentDate,
        paymentMode: formData.paymentMode,
        slabProcessing: {
          _id: this.dataById.slabProcessing_id,
          amount: Number(formData.totalAmount),
        },
        slabInvoiceNumber: this.dataById.processingInvoiceNo,
        note: formData.note,
      };
      if (this.paymentInvoiceForm.valid) {
        this.blockProcessorService
          .createPayment(payload)
          .subscribe((resp: any) => {
            console.log(resp);
            if (resp) {
              if (resp.status === "success") {
                const message = "Slab Processing Payment has been added";
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
  }
}
