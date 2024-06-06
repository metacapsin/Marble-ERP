import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from '../../Customers/customers.service';

@Component({
  selector: 'app-paid-sales',
  templateUrl: './paid-sales.component.html',
  styleUrl: './paid-sales.component.scss',  
  standalone: true,
  imports:[CommonModule, SharedModule, DropdownModule, CalendarModule]
})
export class PaidSalesComponent  implements OnInit{
  public routes = routes;

  public searchDataValue = '';
  maxDate = new Date();
  customerList = [];
  salesPopupData=[
    {
      salesInvoiceNumber:"abc@11234",
      salesCustomerName: "Adnan Hussain",
      salesDate: "25 April 2024",
      salesOrderTakenBy: "Adnan Hussain",
      salesOrderSatus: "Ordered",
      salesCategory: "Electronics",
      salesName: "Mobile",
      salesQuantity:"3",
      salesUnitPrice:"120",
      salesSubTotal:"350",
      salesOrderTax: "20",
      salesShipping: "200",
      salesDiscount: "50",
      salesTotalAmount: "1250",

    }
  ];
  salesData = [
    {
      salesInvoiceNumber: 1112,
      salesDate: "16 April 2024",
      salesCustomer: "Adnan",
      salesStatus: "Delivered",
      salesTotalAmount: "$3000",
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