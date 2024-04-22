import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from '../Customers/customers.service';

@Component({
  selector: "app-sales",
  templateUrl: "./sales.component.html",
  styleUrls: ["./sales.component.scss"],
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, CalendarModule]
})
export class SalesComponent implements OnInit {
  public routes = routes;

  public searchDataValue = '';

  customerList = [];
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

  salesItem=[
    {salesProduct:"Electronic",
      salesQuantity:"3",
      salesUnitPrice:"120",
      salesSubTotal:"350"
    },
    {salesProduct:"Electronic",
      salesQuantity:"3",
      salesUnitPrice:"120",
      salesSubTotal:"350"
    },
  ]
  


  constructor(
    private customerService: CustomersdataService,) { }

  ngOnInit() {

    this.customerService.GetCustomerData().subscribe((resp: any) => {
      this.customerList = resp;

      console.log("customer", this.customerList);

    })

  }

}
