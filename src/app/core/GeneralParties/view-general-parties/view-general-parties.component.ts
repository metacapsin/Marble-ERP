import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { GeneralPartiesService } from '../general-parties.service';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-view-general-parties',
  templateUrl: './view-general-parties.component.html',
  styleUrls: ['./view-general-parties.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class ViewGeneralPartiesComponent implements OnInit {
  public routes = routes;
  public layout: string = 'horizontal';
  public showPassword: boolean = false;
  private id: string;
  public generalParty: any;
  public ledgerData: any[] = [
    {
      date: '2025-05-01',
      voucherType: 'Sales',
      voucherNo: 'INV-1001',
      debit: '₹10,000',
      credit: '',
      balance: '₹10,000',
      narration: 'Sale of slabs'
    },
    {
      date: '2025-05-03',
      voucherType: 'Receipt',
      voucherNo: 'RCPT-2001',
      debit: '',
      credit: '₹7,000',
      balance: '₹3,000',
      narration: 'Payment received via UPI'
    },
    {
      date: '2025-05-05',
      voucherType: 'Credit Note',
      voucherNo: 'CN-3001',
      debit: '₹2,000',
      credit: '',
      balance: '₹5,000',
      narration: 'Sales return - broken slab'
    },
    {
      date: '2025-05-10',
      voucherType: 'Receipt',
      voucherNo: 'RCPT-2002',
      debit: '',
      credit: '₹5,000',
      balance: '₹0',
      narration: 'Full payment done'
    }
  ];

  // Analytics Data
  public analytics = {
    totalBalance: 0,
    totalDebit: 0,
    totalCredit: 0,
    transactionCount: 0,
    lastTransactionDate: '',
    averageTransaction: 0,
    transactionTypes: {
      sales: 0,
      receipt: 0,
      creditNote: 0
    }
  };

  constructor(
    private generalPartiesService: GeneralPartiesService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadGeneralPartyData();
    this.calculateAnalytics();
  }

  loadGeneralPartyData() {
    this.generalPartiesService.GetGeneralPartyDataById(this.id).subscribe({
      next: (response) => {
        this.generalParty = response;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading general party data'
        });
        console.error('Error:', error);
      }
    });
  }

  calculateAnalytics() {
    // Calculate total debit and credit
    this.analytics.totalDebit = this.ledgerData.reduce((sum, item) => {
      return sum + (item.debit ? parseFloat(item.debit.replace('₹', '').replace(',', '')) : 0);
    }, 0);

    this.analytics.totalCredit = this.ledgerData.reduce((sum, item) => {
      return sum + (item.credit ? parseFloat(item.credit.replace('₹', '').replace(',', '')) : 0);
    }, 0);

    // Calculate total balance
    this.analytics.totalBalance = this.analytics.totalDebit - this.analytics.totalCredit;

    // Calculate transaction count
    this.analytics.transactionCount = this.ledgerData.length;

    // Get last transaction date
    if (this.ledgerData.length > 0) {
      this.analytics.lastTransactionDate = this.ledgerData[this.ledgerData.length - 1].date;
    }

    // Calculate average transaction amount
    this.analytics.averageTransaction = (this.analytics.totalDebit + this.analytics.totalCredit) / this.analytics.transactionCount;

    // Calculate transaction types
    this.analytics.transactionTypes = {
      sales: this.ledgerData.filter(item => item.voucherType === 'Sales').length,
      receipt: this.ledgerData.filter(item => item.voucherType === 'Receipt').length,
      creditNote: this.ledgerData.filter(item => item.voucherType === 'Credit Note').length
    };
  }
} 