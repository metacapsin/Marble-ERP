import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
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
import { NewPurchaseService } from "src/app/core/new-purchase/new-purchase.service";
import { PaymentInService } from "src/app/core/payment-in/payment-in.service";
import { PaymentOutService } from "src/app/core/payment-out/payment-out.service";
import { PurchaseReturnService } from "src/app/core/purchase-return/purchase-return.service";
import { SalesReturnService } from "src/app/core/sales-return/sales-return.service";
import { SuppliersdataService } from "src/app/core/Suppliers/suppliers.service";
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
  @Output() formSubmitted = new EventEmitter<void>();
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
    },
  ];
  taxableDue = 0;
  nonTaxableDue = 0;

  notesRegex = /^(?:.{2,100})$/;
  supplierList: any[];
  originalSuppliersData: any;
  invoiceNumberList: any[];
  noPaymentsAvailable: boolean = false;
  invoiceDataByInvoiceId: any;
  supplierObject: this;
  selectedSupplier: any;
  currentDate: Date = new Date();
  constructor(
    private paymentInService: PaymentInService,
    private paymentOutService: PaymentOutService,
    private purchaseReturnPaymentService: PurchaseReturnService,
    private blockProcessorService: blockProcessorService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private salesReturnService: SalesReturnService,
    private SuppliersService: SuppliersdataService,
    private PurchaseService: NewPurchaseService
  ) {
    this.paymentInvoiceForm = this.fb.group({
      paymentDate: [this.getFormattedDate(this.currentDate), Validators.required],
      paymentMode: ["", [Validators.required]],
      note: [""],
      totalAmount: [
        this.dataById.salesDueAmount,
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
      supplier: [],
      invoiceNumber: [],
    });
  }


// Function to format the date in dd/ mm/yyyy format
getFormattedDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');  // Ensure 2 digits for day
  const month = String(date.getMonth() + 1).padStart(2, '0');  // Months are 0-indexed, so add 1
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}

  ngOnInit() {
    this.onFormChanges();
    this.SuppliersService.GetSupplierData().subscribe((resp: any) => {
      this.originalSuppliersData = resp;
      console.log("supplier list");
      this.supplierList = this.originalSuppliersData.map((element) => ({
        name: element.name,
        _id: element._id,
      }));
    });
  }

  // Fetch invoices when a supplier is selected
  onSuppliersSelect(event: any) {
    console.log("supplier id on supplier select", event);
    // Store the selected supplier in the object
    this.selectedSupplier = this.supplierList.find(
      (supplier) => supplier._id === event
    );
    console.log("Selected supplier object:", this.selectedSupplier);

    this.PurchaseService.getPendingPurchaseBySupplierId(event).subscribe(
      (resp: any) => {
        if (resp && Array.isArray(resp.data)) {
          console.log("supplierinvoice", resp);
          console.log("first purchase", resp.data.purchaseInvoiceNumber);
          this.invoiceNumberList = resp.data.map((invoice) => ({
            label: invoice.purchaseInvoiceNumber,
            value: invoice._id,
            taxable: invoice.taxable,
            taxableDue: invoice.taxableDue,
            nonTaxable: invoice.nonTaxable,
            nonTaxableDue: invoice.nonTaxableDue,
            dueAmount: invoice.dueAmount,
            taxVendor: invoice.taxVendor,
            purchaseTotalAmount: invoice.purchaseTotalAmount,
          }));
          // After invoice is fetched, compare the dues and patch form values
          //  this.autoPatchInvoiceAmounts();
          console.log(this.invoiceNumberList, "this is invoice number list");
        } else {
          this.invoiceNumberList = [];
          this.noPaymentsAvailable = true;
        }
      }
    );
  }
  // Populate taxable and non-taxable amounts when an invoice is selected
  onInvoiceNumberSelect(invoiceId: any) {
    // console.log("invoiceId on invoice number select", invoiceId);
    this.invoiceDataByInvoiceId = invoiceId;
    // console.log("data on invoice select", this.invoiceDataByInvoiceId);
    const selectedInvoice = this.invoiceNumberList.find(
      (invoice) => invoice.value === invoiceId.value
    );
    // console.log("selected invoice", selectedInvoice);
    const taxablePaymentAmountControl = this.paymentInvoiceForm.get(
      "taxablePaymentAmount"
    );
    const nonTaxablePaymentAmountControl = this.paymentInvoiceForm.get(
      "nonTaxablePaymentAmount"
    );

    const customerTaxableDue = this.dataById.taxableDue; // Customer taxable due
    const customerNonTaxableDue = this.dataById.nonTaxableDue; // Customer non-taxable due

    if (selectedInvoice) {
      // console.log("Selected Invoice Taxable Due:", selectedInvoice.taxableDue);
      // console.log(
      //   "Selected Invoice Non-Taxable Due:",
      //   selectedInvoice.nonTaxableDue
      // );
      // console.log("Customer Taxable Due:", customerTaxableDue);
      // console.log("Customer Non-Taxable Due:", customerNonTaxableDue);
      // console.log("Supplier total due amount:", selectedInvoice.dueAmount);

      if (selectedInvoice.taxVendor) {
        // If taxVendor exists, only patch non-taxable amount
        // console.log("TaxVendor exists");

        // Check if dueAmount is non-taxable
        // const isNonTaxableDue =
        //   selectedInvoice.dueAmount === selectedInvoice.nonTaxableDue;

        if (
          // isNonTaxableDue &&
          // selectedInvoice.dueAmount > 0 &&
          selectedInvoice.nonTaxableDue > 0 &&
          selectedInvoice.nonTaxableDue < customerNonTaxableDue
        ) {
          console.log(
            "Patching non-taxable amount with invoice due:",
            selectedInvoice.nonTaxableDue
          );
          nonTaxablePaymentAmountControl.patchValue(
            Number(selectedInvoice.nonTaxableDue)
          );
        }
        // else if (!isNonTaxableDue) {
        //   console.log(
        //     "Due amount is taxable; no need to patch non-taxable amount."
        //   );
        // }
        else {
          console.log(
            "No need to patch non-taxable amount, customer due is less or equal."
          );
        }
        // taxablePaymentAmountControl.patchValue(null); // Clear taxable amount only for supplier
      } else {
        // If no tax vendor, patch both amounts based on dues
        if (
          selectedInvoice.taxableDue > 0 &&
          selectedInvoice.taxableDue < customerTaxableDue
        ) {
          // console.log(
          //   "Patching taxable amount with invoice due:",
          //   selectedInvoice.taxableDue
          // );
          taxablePaymentAmountControl.patchValue(
            Number(selectedInvoice.taxableDue)
          );
        } else {
          console.log(
            "No need to patch taxable amount, customer due is less or equal."
          );
        }

        if (
          selectedInvoice.nonTaxableDue > 0 &&
          selectedInvoice.nonTaxableDue < customerNonTaxableDue
        ) {
          // console.log(
          //   "Patching non-taxable amount with invoice due:",
          //   selectedInvoice.nonTaxableDue
          // );
          nonTaxablePaymentAmountControl.patchValue(
            Number(selectedInvoice.nonTaxableDue)
          );
        } else {
          // console.log(
          //   "No need to patch non-taxable amount, customer due is less or equal."
          // );
        }
      }
    } else {
      console.log("No selected invoice found.");
    }
    this.onSalesPaymentAmountChanges();
  }
  onFormChanges(): void {
    this.paymentInvoiceForm.valueChanges.subscribe(() => {
      const taxablePayment = this.paymentInvoiceForm?.get(
        "taxablePaymentAmount"
      )?.value;
      const nonTaxablePayment = this.paymentInvoiceForm?.get(
        "nonTaxablePaymentAmount"
      )?.value;

      // If either one of the amounts is filled, mark the form as valid
      if (taxablePayment || nonTaxablePayment) {
        this.paymentInvoiceForm?.get("totalAmount")?.setValidators(null); // Remove validators from totalAmount
        this.paymentInvoiceForm
          ?.get("totalAmount")
          ?.updateValueAndValidity({ emitEvent: false });
      } else {
        // If neither is filled, keep the form invalid
        this.paymentInvoiceForm
          ?.get("totalAmount")
          ?.setValidators([Validators.required, Validators.min(1)]);
        this.paymentInvoiceForm
          ?.get("totalAmount")
          ?.updateValueAndValidity({ emitEvent: false });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("this.dataById", this.dataById);

    if (this.ShowPaymentInvoice) {
      const totalAmount = this.paymentInvoiceForm.get("totalAmount");
      const taxablePaymentAmount = this.paymentInvoiceForm.get(
        "taxablePaymentAmount"
      );
      const nonTaxablePaymentAmount = this.paymentInvoiceForm.get(
        "nonTaxablePaymentAmount"
      );

      totalAmount.clearValidators();
      taxablePaymentAmount.clearValidators();
      nonTaxablePaymentAmount.clearValidators();

      if (this.dataById.isPurchase || this.dataById.isSales) {
        totalAmount.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(
            this.dataById.isPurchase
              ? this.dataById.purchaseDueAmount
              : this.dataById.salesDueAmount
          ),
        ]);
        taxablePaymentAmount.setValidators([
          Validators.min(0),
          Validators.max(this.dataById.taxableDue),
        ]);
        nonTaxablePaymentAmount.setValidators([
          Validators.min(0),
          Validators.max(this.dataById.nonTaxableDue),
        ]);

        this.paymentInvoiceForm.patchValue({
          taxablePaymentAmount: Number(this.dataById.taxableDue),
          taxablePaymentMode: "Bank",
          nonTaxablePaymentMode: "Cash",
          nonTaxablePaymentAmount: Number(this.dataById.nonTaxableDue),
          paymentMode: "Bank / Cash",
          paymentDate:this.getFormattedDate(this.currentDate),
        });
        this.onSalesPaymentAmountChanges();
      } else if (this.dataById.isSalesReturn) {
        totalAmount.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.dataById.salesDueAmount),
        ]);
        this.paymentInvoiceForm.patchValue({
          totalAmount: this.dataById.salesDueAmount,
          paymentMode: "Cash",
        });
        console.log(this.paymentInvoiceForm.get("totalAmount")?.errors);
        console.log(this.paymentInvoiceForm.get("totalAmount")?.valid);
      } else if (this.dataById.isPurchaseReturn) {
        totalAmount.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.dataById.purchaseDueAmount),
        ]);
        this.paymentInvoiceForm.patchValue({
          totalAmount: this.dataById.purchaseDueAmount,
          paymentMode: "Cash",
        });
        console.log(this.paymentInvoiceForm.get("totalAmount")?.errors);
        console.log(this.paymentInvoiceForm.get("totalAmount")?.valid);
      } else if (this.dataById.isSlabProcessing) {
        totalAmount.setValidators([
          Validators.required,
          Validators.min(1),
          Validators.max(this.dataById.dueAmount),
        ]);
        this.paymentInvoiceForm.patchValue({
          totalAmount: this.dataById.dueAmount,
          paymentMode: "Cash",
        });
        console.log(this.paymentInvoiceForm.get("totalAmount")?.errors);
        console.log(this.paymentInvoiceForm.get("totalAmount")?.valid);
      }

      totalAmount.updateValueAndValidity();
      taxablePaymentAmount.updateValueAndValidity();
      nonTaxablePaymentAmount.updateValueAndValidity();
    }
  }

  onSalesPaymentAmountChanges() {
    let salesDtl = this.dataItemsGrid[0];
    const formData = this.paymentInvoiceForm.value;
    console.log('formdata',formData)
    let totalAmount = this.paymentInvoiceForm.get("totalAmount");
    let nontaxAmount = this.paymentInvoiceForm.get("nonTaxablePaymentAmount");
    console.log('nontaxAmount',typeof nontaxAmount.value)
    let taxablePaymentAmount = this.paymentInvoiceForm.get(
      "taxablePaymentAmount"
    );
    let nonTaxablePaymentAmount = this.paymentInvoiceForm.get(
      "nonTaxablePaymentAmount"
    );

    if (taxablePaymentAmount.value && nonTaxablePaymentAmount.value) {
      let paymentmode = `${formData.taxablePaymentMode} / ${formData.nonTaxablePaymentMode}`;

      this.paymentInvoiceForm.get("paymentMode").setValue(paymentmode);
    } 

    if (!taxablePaymentAmount.value) {
      this.paymentInvoiceForm.get("taxablePaymentMode")?.setValue(null);
      this.paymentInvoiceForm.get("paymentMode").setValue(formData.nonTaxablePaymentMode);
    }

    // Reset nonTaxablePaymentMode if nonTaxablePaymentAmount is cleared
    if (!nonTaxablePaymentAmount.value) {
      this.paymentInvoiceForm.get("nonTaxablePaymentMode")?.setValue(null);
      this.paymentInvoiceForm.get("paymentMode").setValue(formData.taxablePaymentMode);
    }

   

    let discountAmount =
      Number(salesDtl?.salesDiscount) ||
      Number(salesDtl?.lotDetails?.purchaseDiscount) ||
      Number(salesDtl?.quotationDiscount);
    // console.log("discountAmount", discountAmount);
    let total =
      Number(taxablePaymentAmount.value) +
      Number(nonTaxablePaymentAmount.value);
    // console.log("total", total);
    let nontxAmount = Number(nontaxAmount.value || 0) - Number(discountAmount || 0);
    console.log('nontxAmount',nontxAmount)
    let allTotlAmnt = Number(total || 0) - Number(discountAmount || 0);
    nontaxAmount.setValue(Number(nontxAmount.toFixed(2)));
    totalAmount.setValue(allTotlAmnt.toFixed(2));

    console.log(" this.paymentInvoiceForm..", this.paymentInvoiceForm.value);
  }
  closeTheWindow() {
    this.paymentInvoiceForm.reset();
    this.close.emit();
   
  }

  onConfirm() {
    this.callbackModalForPayment.emit();
  }

  onPaymentModeChange() {
    const formData = this.paymentInvoiceForm.value;
    let paymentmode = `${formData.taxablePaymentMode} / ${formData.nonTaxablePaymentMode}`;

    this.paymentInvoiceForm.get("paymentMode").setValue(paymentmode);
  }

  paymentInvoiceFormSubmit() {
    const formData = this.paymentInvoiceForm.value;

    if(formData.taxablePaymentAmount && !formData.taxablePaymentMode){
      console.log('object',formData)
      const message = "Please Select Payment Mode";
      this.messageService.add({ severity: "error", detail: message });
      return
    }
    if(formData.nonTaxablePaymentAmount && !formData.nonTaxablePaymentMode){
      const message = "Please Select Payment Mode";
      this.messageService.add({ severity: "error", detail: message });
      return
    }

    if (formData.totalAmount > 0) {
      if (
        this.dataById.isSalesReturn &&
        this.dataById.salesInvoiceNumber !== "Opening Balance"
      ) {
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
                  this.messageService.add({
                    severity: "error",
                    detail: message,
                  });
                }
              }
            });
        } else {
          console.log("invalid form");
        }
      }

      if (
        this.dataById.isSales &&
        this.dataById.salesInvoiceNumber !== "Opening Balance"
      ) {
        console.log(
          "this is sales payment forms",
          this.paymentInvoiceForm.value
        );
        console.log("form status", this.paymentInvoiceForm.status); // Check if the form is invalid or valid

        const payloadForCustomer = [
          {
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
          },
        ];

        console.log("payload for customer", payloadForCustomer);

        const customerTotalPayment =
          formData.taxablePaymentAmount + formData.nonTaxablePaymentAmount;

        // Calculate non-taxable and remaining payments for supplier
        let supplierNonTaxablePayment = Math.min(
          customerTotalPayment,
          this.invoiceDataByInvoiceId?.nonTaxableDue || 0
        );
        let remainingPaymentForTaxable =
          customerTotalPayment - supplierNonTaxablePayment;

        // Conditionally set the taxable payment
        let supplierTaxablePayment = this.invoiceDataByInvoiceId?.taxVendor
          ? null
          : Math.min(
              remainingPaymentForTaxable,
              this.invoiceDataByInvoiceId?.taxableDue || 0
            );

        // Determine the purchase amount based on conditions
        let purchaseAmount;
        if (this.invoiceDataByInvoiceId?.taxVendor) {
          // Condition 1: If taxVendor exists, only use non-taxable amount
          if (this.invoiceDataByInvoiceId?.nonTaxableDue) {
            purchaseAmount = supplierNonTaxablePayment;
          } else {
            purchaseAmount = null; // Clear purchase amount if no valid non-taxable due
          }
        } else if (
          supplierNonTaxablePayment > 0 ||
          supplierTaxablePayment > 0
        ) {
          // Condition 2: No taxVendor, both non-taxable and taxable payments apply
          purchaseAmount =
            (supplierNonTaxablePayment || 0) + (supplierTaxablePayment || 0);
        } else {
          // Condition 3: No due amounts, purchase amount should remain undefined or null
          purchaseAmount = null;
        }
        const isNonTaxableDueValid =
          this.invoiceDataByInvoiceId?.nonTaxableDue > 0;

        // Construct the payload
        const payloadforSupplier = [
          {
            supplier: this?.selectedSupplier,
            paymentDate: formData?.paymentDate,
            paymentMode: formData?.paymentMode,
            purchase: purchaseAmount
              ? [
                  {
                    _id: this.invoiceDataByInvoiceId?.value,
                    amount: purchaseAmount, // Conditionally set based on above logic
                    purchaseInvoiceNumber: this.invoiceDataByInvoiceId?.label,
                  },
                ]
              : [], // Skip purchase field if purchaseAmount is null
            taxablePaymentAmount: this.invoiceDataByInvoiceId?.taxVendor
              ? null
              : supplierTaxablePayment
              ? {
                  amount: supplierTaxablePayment,
                  paymentMode: formData?.taxablePaymentMode,
                }
              : null,
            nonTaxablePaymentAmount:
              isNonTaxableDueValid && supplierNonTaxablePayment > 0
                ? {
                    amount: supplierNonTaxablePayment,
                    paymentMode: formData?.nonTaxablePaymentMode,
                  }
                : null,
            note: formData?.note,
          },
        ];
        console.log("Payload for supplier", payloadforSupplier);

        if (this.paymentInvoiceForm.valid) {
          this.paymentInService
            .createPayment(payloadForCustomer)
            .subscribe((resp: any) => {
              console.log(resp);
              if (resp) {
                if (resp.status === "success") {
                  const message = "Payment has been added";
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
                  this.messageService.add({
                    severity: "error",
                    detail: message,
                  });
                }
              }
            });
          if (this.selectedSupplier) {
            console.log(
              "selected supplier condition is true",
              this.selectedSupplier
            );
            if (purchaseAmount > 0) {
              this.paymentOutService
                .createPayment(payloadforSupplier)
                .subscribe((resp: any) => {
                  console.log(resp);
                  if (resp) {
                    if (resp.status === "success") {
                      const message = "Payment has been added";
                      console.log(message);
                      // this.messageService.add({ severity: "success", detail: message });
                      setTimeout(() => {
                        this.close.emit();
                        this.paymentInvoiceForm.reset();
                      }, 400);
                    } else {
                      const message = resp.message;
                      // this.messageService.add({
                      //   severity: "error",
                      //   detail: message,
                      // });
                      console.log(message);
                    }
                  }
                });
            }
          } else {
            console.log("Supplier Is Not Select in the form");
          }
        } else {
          console.log("invalid form");
        }
      }
      // console.log(this.dataById.isPurchase);
      // for create purchase payment
      if (
        this.dataById.isPurchase &&
        this.dataById.salesInvoiceNumber !== "Opening Balance"
      ) {
        console.log("this.dataById", this.dataById);
        console.log("dataItemsGrid", this.dataItemsGrid);

        const payload = [
          {
            supplier: this.dataById.supplier,
            paymentDate: formData.paymentDate,
            paymentMode: formData.paymentMode,
            purchase: [
              {
                _id: this.dataById.purchaseId,
                amount: !this.dataItemsGrid[0]?.taxVendor
                  ? Number(formData.totalAmount)
                  : formData.nonTaxablePaymentAmount,
                purchaseInvoiceNumber: this.dataById.purchaseInvoiceNumber,
              },
            ],
            taxablePaymentAmount: formData.taxablePaymentAmount
              ? {
                  amount: !this.dataItemsGrid[0]?.taxVendor
                    ? formData.taxablePaymentAmount
                    : 0,
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
          },
        ];

        if (this.paymentInvoiceForm.valid) {
          this.paymentOutService
            .createPayment(payload)
            .subscribe((resp: any) => {
              console.log(resp);
              if (resp) {
                if (resp.status === "success") {
                  const message = "Payment has been added";
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
                  this.messageService.add({
                    severity: "error",
                    detail: message,
                  });
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
                  this.messageService.add({
                    severity: "error",
                    detail: message,
                  });
                }
              }
            });
        } else {
          console.log("invalid form");
        }
      }

      //For slab Processing Payment
      if (
        this.dataById.isSlabProcessing &&
        this.dataById.salesInvoiceNumber !== "Opening Balance"
      ) {
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
                  this.messageService.add({
                    severity: "error",
                    detail: message,
                  });
                }
              }
            });
        } else {
          console.log("invalid form");
        }
      }

      if (this.dataById.salesInvoiceNumber === "Opening Balance") {
        const payload = {
          _id: this.dataById.customerId,
          paymentAmount: formData.totalAmount,
          paymentDate: formData.paymentDate,
          paymentMode: formData.paymentMode,
          note: formData.note,
        };
        if (this.paymentInvoiceForm.valid) {
          this.blockProcessorService
            .createOpeningBal(payload)
            .subscribe((resp: any) => {
              console.log(resp);
              if (resp) {
                if (resp.status === "success") {
                  const message = "Opening Balance Payment has been added";
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
                  this.messageService.add({
                    severity: "error",
                    detail: message,
                  });
                }
              }
            });
        } else {
          console.log("invalid form");
        }
      }
      // this.formSubmitted.emit();
    } else {
      const message = "Oops! your Amount is less then 1 ";
      this.messageService.add({ severity: "error", detail: message });
    }
  }
}
