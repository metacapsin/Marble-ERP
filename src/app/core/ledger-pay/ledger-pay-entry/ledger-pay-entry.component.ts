import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';
import { ToastModule } from 'primeng/toast';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FileUploadModule } from 'primeng/fileupload';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

interface Invoice {
  id: number;
  invoiceNo: string;
  date: Date;
  amount: number;
  balance: number;
  selected: boolean;
  status: 'PAID' | 'PARTIAL' | 'UNPAID';
  paidAmount: number;
}

interface PaymentSummary {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  paidInvoices: number;
  partialInvoices: number;
  unpaidInvoices: number;
}

@Component({
  selector: 'app-ledger-pay-entry',
  templateUrl: './ledger-pay-entry.component.html',
  styleUrls: ['./ledger-pay-entry.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    DropdownModule,
    CalendarModule,
    FileUploadModule,
    RouterModule,
    TooltipModule
  ],
  providers: [MessageService]
})
export class LedgerPayEntryComponent implements OnInit {
  routes = routes;
  public maxDate: Date = new Date();
  
  paymentForm: FormGroup;
  showInvoiceLinking = false;
  unpaidInvoices: Invoice[] = [];
  selectedInvoices: Invoice[] = [];
  selectedFile: File | null = null;
  paymentSummary: PaymentSummary = {
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    paidInvoices: 0,
    partialInvoices: 0,
    unpaidInvoices: 0
  };

  paymentTypes = [
    { label: 'Payment In', value: 'IN' },
    { label: 'Payment Out', value: 'OUT' }
  ];

  partyOptions = [
    { label: 'Ram (Customer)', value: 'CUSTOMER' },
    { label: 'Shayam (Supplier)', value: 'SUPPLIER' },
    { label: 'Mohan (General)', value: 'GENERAL' }
  ];

  ledgerOptions = [
    { label: 'Cash', value: 'CASH' },
    { label: 'Bank', value: 'BANK' }
  ];

  paymentModes = [
    { label: 'Cash', value: 'CASH' },
    { label: 'Bank Transfer', value: 'BANK_TRANSFER' },
    { label: 'Cheque', value: 'CHEQUE' },
    { label: 'UPI', value: 'UPI' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.paymentForm = this.fb.group({
      paymentType: ['', Validators.required],
      paymentDate: ['', Validators.required],
      ledger: ['', Validators.required],
      party: ['', Validators.required],
      paymentMode: ['', Validators.required],
      referenceNumber: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      remarks: ['']
    });

    // Subscribe to amount changes
    this.paymentForm.get('amount')?.valueChanges.subscribe(amount => {
      if (amount === 0 || amount === null || amount === '') {
        this.paymentForm.patchValue({ amount: null }, { emitEvent: false });
        this.resetAllPaidAmounts();
      } else if (amount) {
        this.settleInvoices(amount);
      }
    });
  }

  ngOnInit(): void {
    this.loadUnpaidInvoices();
  }

  loadUnpaidInvoices(): void {
    // TODO: Replace with actual API call
    this.unpaidInvoices = [
      {
        id: 1,
        invoiceNo: 'INV-001',
        date: new Date('2024-03-01'),
        amount: 1000,
        balance: 1000,
        selected: false,
        status: 'UNPAID',
        paidAmount: 0
      },
      {
        id: 2,
        invoiceNo: 'INV-002',
        date: new Date('2024-03-15'),
        amount: 2000,
        balance: 2000,
        selected: false,
        status: 'UNPAID',
        paidAmount: 0
      },
      {
        id: 3,
        invoiceNo: 'INV-003',
        date: new Date('2024-03-20'),
        amount: 1500,
        balance: 1500,
        selected: false,
        status: 'UNPAID',
        paidAmount: 0
      },
      {
        id: 4,
        invoiceNo: 'INV-004',
        date: new Date('2024-03-25'),
        amount: 3000,
        balance: 3000,
        selected: false,
        status: 'UNPAID',
        paidAmount: 0
      }
    ];
    this.updatePaymentSummary();
  }

  resetAllPaidAmounts(): void {
    this.unpaidInvoices.forEach(invoice => {
      invoice.paidAmount = 0;
      invoice.status = 'UNPAID';
      invoice.selected = false;
    });
    this.selectedInvoices = [];
    this.updatePaymentSummary();
  }

  settleInvoices(totalAmount: number): void {
    let remainingAmount = totalAmount;
    let paidInvoices = 0;
    let partialInvoices = 0;
    let unpaidInvoices = 0;
    let totalPaidAmount = 0;

    // Reset all paid amounts first
    this.unpaidInvoices.forEach(invoice => {
      invoice.paidAmount = 0;
      invoice.status = 'UNPAID';
    });

    // Sort invoices by date (oldest first)
    const sortedInvoices = [...this.unpaidInvoices].sort((a, b) => a.date.getTime() - b.date.getTime());

    for (const invoice of sortedInvoices) {
      if (remainingAmount <= 0) {
        invoice.status = 'UNPAID';
        invoice.paidAmount = 0;
        unpaidInvoices++;
        continue;
      }

      if (remainingAmount >= invoice.balance) {
        // Full payment
        invoice.status = 'PAID';
        invoice.paidAmount = invoice.balance;
        remainingAmount -= invoice.balance;
        totalPaidAmount += invoice.balance;
        paidInvoices++;
      } else {
        // Partial payment
        invoice.status = 'PARTIAL';
        invoice.paidAmount = remainingAmount;
        totalPaidAmount += remainingAmount;
        remainingAmount = 0;
        partialInvoices++;
      }
    }

    this.updatePaymentSummary();
  }

  updatePaymentSummary(): void {
    const totalAmount = this.unpaidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paidAmount = this.unpaidInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const remainingAmount = totalAmount - paidAmount;

    this.paymentSummary = {
      totalInvoices: this.unpaidInvoices.length,
      totalAmount,
      paidAmount,
      remainingAmount,
      paidInvoices: this.unpaidInvoices.filter(inv => inv.status === 'PAID').length,
      partialInvoices: this.unpaidInvoices.filter(inv => inv.status === 'PARTIAL').length,
      unpaidInvoices: this.unpaidInvoices.filter(inv => inv.status === 'UNPAID').length
    };

    // Update form amount if it's different from paid amount
    const currentAmount = this.paymentForm.get('amount')?.value;
    if (currentAmount !== paidAmount) {
      this.paymentForm.patchValue({ amount: paidAmount });
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PAID':
        return 'icon-check-circle text-success';
      case 'PARTIAL':
        return 'icon-clock text-warning';
      case 'UNPAID':
        return 'icon-x-circle text-danger';
      default:
        return '';
    }
  }

  toggleInvoiceSelection(invoice: Invoice): void {
    invoice.selected = !invoice.selected;
    if (invoice.selected) {
      this.selectedInvoices.push(invoice);
      // Auto-settle the selected invoice
      this.settleSelectedInvoice(invoice);
    } else {
      this.selectedInvoices = this.selectedInvoices.filter(i => i.id !== invoice.id);
      // Reset the invoice status
      invoice.status = 'UNPAID';
      invoice.paidAmount = 0;
      this.updatePaymentSummary();
    }
  }

  settleSelectedInvoice(invoice: Invoice): void {
    const currentAmount = this.paymentForm.get('amount')?.value || 0;
    const newAmount = currentAmount + invoice.balance;
    this.paymentForm.patchValue({ amount: newAmount });
    this.settleInvoices(newAmount);
  }

  adjustAmount(invoice: Invoice, amount: number): void {
    if (amount < 0 && Math.abs(amount) > invoice.paidAmount) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Cannot reduce amount below 0'
      });
      return;
    }

    if (amount > invoice.balance) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Amount cannot exceed invoice balance'
      });
      return;
    }

    invoice.paidAmount = amount;
    if (amount === 0) {
      invoice.status = 'UNPAID';
    } else if (amount === invoice.balance) {
      invoice.status = 'PAID';
    } else {
      invoice.status = 'PARTIAL';
    }

    this.updatePaymentSummary();
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const selectedInvoices = this.unpaidInvoices.filter(inv => inv.selected);
      const formData = {
        ...this.paymentForm.value,
        selectedInvoices,
        paymentProof: this.selectedFile,
        paymentSummary: this.paymentSummary
      };
      console.log('Form submitted:', formData);
      // TODO: Implement API call to save payment
      this.router.navigate(['/ledger-pay/history']);
    }
  }

  onCancel(): void {
    this.router.navigate([this.routes.ledgerPay]);
  }
} 