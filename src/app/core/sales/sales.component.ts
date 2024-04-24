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

  salesPopupData = [
    {
      salesInvoiceNumber: "abc@11234",
      salesCustomerName: "Adnan Hussain",
      salesDate: "25 April 2024",
      salesOrderTakenBy: "Adnan Hussain",
      salesOrderStatus: "Ordered",
      salesCategory: "Electronics",
      salesName: "Mobile",
      salesQuantity: "3",
      salesUnitPrice: "120",
      salesSubTotal: "350",
      salesOrderTax: "20",
      salesShipping: "200",
      salesDiscount: "50",
      salesTotalAmount: "1250",

    }
  ];

  salesListData = [

    { 
      salesCustomerName: "Harfol Gurjar",
      salesOrderTakenBy: "Adnan Hussain",
      salesDate: "20 April 2014",
      salesDiscount: "200",
      salesInvoiceNumber: "abc@998",
      salesItemDetails: [
        {
          salesCategory: "Computers",
          salesName: "PC",
          salesQuantity: "2",
          salesUnitPrice: "120",
          salesSubTotal: "350",
        },
        {
          salesCategory: "Mobile",
          salesName: "Oppo",
          salesQuantity: "3",
          salesUnitPrice: "120",
          salesSubTotal: "350",
        }
      ],
      salesNotes: "Notes",
      salesOrderStatus: "Ordered",
      salesOrderTax: "12",
      salesShipping: "200",
      salesTermsAndCondition: "term and conditions",
      salesTotalAmount: "1500",
    },
    {
      salesCustomerName: "Jayesh Khatri",
      salesOrderTakenBy: "Adnan Hussain",
      salesDate: "25 April 2024",
      salesDiscount: "50",
      salesInvoiceNumber: "abc@335",
      salesItemDetails: [
        {
          salesCategory: "Marble",
          salesName: "Stone",
          salesQuantity: "3",
          salesUnitPrice: "120",
          salesSubTotal: "350",
        },
        {
          salesCategory: "Electronics",
          salesName: "Mobile",
          salesQuantity: "3",
          salesUnitPrice: "120",
          salesSubTotal: "350",
        }
      ],
      salesNotes: "sales Notes",
      salesOrderStatus: "Processing",
      salesOrderTax: "5",
      salesShipping: "600",
      salesTermsAndCondition: "sales Term conditions",
      salesTotalAmount: "20200",
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
