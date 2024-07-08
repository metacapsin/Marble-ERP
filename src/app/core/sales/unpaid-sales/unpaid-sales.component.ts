import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from '../../Customers/customers.service';

@Component({
  selector: 'app-unpaid-sales',
  templateUrl: './unpaid-sales.component.html',
  styleUrl: './unpaid-sales.component.scss',
  standalone: true,
  imports:[ SharedModule ]
})
export class UnpaidSalesComponent   implements OnInit{
  public routes = routes;

  public searchDataValue = '';
  maxDate = new Date();
  customerList = [];
  customerData = [
    {
      name: "Supplier 1",
      email: "Supplier@gmail.com",
      phoneNumber: "234324",
      openingBalance: "50.00",
      billingAddress: "Supplier Billing Address",
      creditPeriod: "30 day(s)",
      creditLimit: "20.00",
      balance: "300.00",
      taxNumber: "12389524",
    },
  ];
  salesItem=[
    {salesProduct:"Electronic",
      salesQuantity:"3",
      salesUnitPrice:"120",
      salesDiscount:"20",
      salesTax:"10",
      salesSubTotal:"350"
    },
  ]
  salesData = [
    {
      salesInvoiceNumber: 1112,
      salesDate: "16 April 2024",
      salesCustomer: "Adnan",
      salesStatus: "Delivered",
      salesPaidAmount: "$2250",
      salesTotalAmount: "$3000",
      salesPaymentStatus: "Paid",
    }
  ];


  constructor(
    private customerService: CustomersdataService,) { }

  ngOnInit() {

    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.customerList = resp;

      console.log("customer", this.customerList);

    })

  }

}