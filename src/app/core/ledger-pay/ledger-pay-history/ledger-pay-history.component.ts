import { Component, OnInit, ViewChild } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';

interface Payment {
  id: number;
  date: Date;
  ledgerName: string;
  paymentType: string;
  amount: number;
  reference: string;
  status: string;
}

@Component({
  selector: 'app-ledger-pay-history',
  templateUrl: './ledger-pay-history.component.html',
  styleUrls: ['./ledger-pay-history.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class LedgerPayHistoryComponent implements OnInit {
  @ViewChild('dt') dt: Table;
  public routes = routes;
  
  payments: Payment[] = [];
  loading: boolean = false;
  rows: number = 10;
  totalRecords: number = 0;
  first: number = 0;

  // Filter properties
  dateRange: Date[] = [];
  paymentTypes: any[] = [
    { label: 'All Types', value: null },
    { label: 'Payment In', value: 'Payment In' },
    { label: 'Payment Out', value: 'Payment Out' }
  ];
  selectedPaymentType: any = null;
  searchQuery: string = '';

  cols: any[] = [
    { field: 'date', header: 'Date' },
    { field: 'ledgerName', header: 'Ledger Name' },
    { field: 'paymentType', header: 'Payment Type' },
    { field: 'amount', header: 'Amount' },
    { field: 'reference', header: 'Reference' },
    { field: 'status', header: 'Status' }
  ];

  constructor() { }

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    // Mock data for demonstration
    this.payments = [
      {
        id: 1,
        date: new Date(),
        ledgerName: 'Customer A',
        paymentType: 'Payment In',
        amount: 5000,
        reference: 'INV-001',
        status: 'Completed'
      },
      {
        id: 2,
        date: new Date(),
        ledgerName: 'Supplier B',
        paymentType: 'Payment Out',
        amount: 3000,
        reference: 'PO-001',
        status: 'Pending'
      }
    ];
    this.totalRecords = this.payments.length;
  }

  onDateRangeChange(event: any): void {
    console.log('Date range changed:', event);
    // Implement date range filter logic
  }

  onPaymentTypeChange(event: any): void {
    console.log('Payment type changed:', event);
    // Implement payment type filter logic
  }

  applyFilters(): void {
    console.log('Applying filters:', {
      dateRange: this.dateRange,
      paymentType: this.selectedPaymentType,
      searchQuery: this.searchQuery
    });
    // Implement filter logic here
    this.loadPayments(); // Reload data with filters
  }

  resetFilters(): void {
    this.dateRange = [];
    this.selectedPaymentType = null;
    this.searchQuery = '';
    this.loadPayments(); // Reload data without filters
  }

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
    // Handle pagination changes if needed
    console.log('Page changed:', event);
  }

  onSort(event: any): void {
    // TODO: Implement sorting with API
    console.log('Sort event:', event);
  }

  customExportHeader() {
    return this.cols.map(col => col.header);
  }
} 