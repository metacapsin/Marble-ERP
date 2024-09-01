import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { BillingAddressService } from '../../settings/billing-Address/billingAddress.service';
import { TaxVendorsService } from '../tax-vendors.service';

@Component({
  selector: 'app-view-tax-vendors',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './view-tax-vendors.component.html',
  styleUrls: ['./view-tax-vendors.component.scss'] // Fix: 'styleUrl' should be 'styleUrls'
})
export class ViewTaxVendorsComponent implements OnInit {
  public routes = routes;
  id: any;
  taxVendorsData: any = {};
  taxVendorsId: any;

  salesDataShowById=[
    {
      salesInvoiceNumber: 'INV001',
      salesDate: '2024-09-01',
      salesOrderStatus: 'Completed',
      paymentStatus: 'Paid',
      paidAmount: 5000,
      dueAmount: 0,
      salesTotalAmount: 5000
    },
    {
      salesInvoiceNumber: 'INV002',
      salesDate: '2024-09-02',
      salesOrderStatus: 'Processing',
      paymentStatus: 'Partial Paid',
      paidAmount: 3000,
      dueAmount: 2000,
      salesTotalAmount: 5000
    },
    // Add more sales records as needed
  ];


  paymentListDataByCustomerId=[
    {
      salesInvoiceNumber: 'INV001',
      transactionNo: 'TXN123456',
      paymentDate: '2024-09-01',
      paymentMode: 'Credit Card',
      amount: 1500.00
    },
    {
      salesInvoiceNumber: 'INV002',
      transactionNo: 'TXN123457',
      paymentDate: '2024-09-02',
      paymentMode: 'Bank Transfer',
      amount: 2500.00
    },
    {
      salesInvoiceNumber: 'INV003',
      transactionNo: 'TXN123458',
      paymentDate: '2024-09-03',
      paymentMode: 'Cash',
      amount: 1200.00
    }]

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private BillingAddressService: BillingAddressService,
    private activeRoute: ActivatedRoute,
    private TaxVendorsService: TaxVendorsService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit() {
    this.getTaxVendorsById(); 
  }
  getTaxVendorsById() {
    this.TaxVendorsService.getTaxVendorById(this.id).subscribe((data: any) => {
      console.log("Tax Vendors Data By Id", data.data);
      this.taxVendorsId = data.data._id;
      this.taxVendorsData = data.data;
    });
  }
}
