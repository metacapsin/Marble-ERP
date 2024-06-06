import { Component, OnInit } from "@angular/core";
import { Sort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { DataService } from "src/app/shared/data/data.service";
import { SettingsService } from "src/app/shared/data/settings.service";
import { routes } from "src/app/shared/routes/routes";

@Component({
  selector: "app-payment-in-reports",
  templateUrl: "./payment-in-reports.component.html"
})
export class PaymentInReportComponent {
  public routes = routes;
  picker1: any;
  searchDataValue = ""  
  rangeDates: Date[] | undefined;
  invertoryData = [
    {
      Product: "Acer Aspire Desktop",
      itemCode: "6924912299",
      Category: "Desktops",
      Brand: "Acer",
      purchasePrice: "$601.00",
      salesPrice: "$618.00",
      currentStock: "102 pc",
      amount: "102 pc",
    },
    {
      Product: "adidas Golf Shoes",
      itemCode: "8501385280",
      Category: "Shoes",
      Brand: "Adidas",
      purchasePrice: "$44.00",
      salesPrice: "$56.00",
      currentStock: "13 pc",
      amount: "13 pc",
    },
    {
      Product: "adidas Tennis Shoes",
      itemCode: "4170463355",
      Category: "Shoes",
      Brand: "Adidas",
      purchasePrice: "$48.00",
      salesPrice: "$56.00",
      currentStock: "159 pc",
      amount: "159 pc",
    },
  ];

  searchByData = [
    "Today", "YesterDay", "Last 7 Days", "This Month", "Last 3 Months", "Last 6 Months", "This Year"
  ];

  onSearchByChange(event: any) {
    const value = event.value;
    const today = new Date();
    let startDate, endDate = today;

    switch (value) {
      case 'Today':
        startDate = today;
        endDate = today;
        break;
      case 'YesterDay':
        startDate = new Date(today.setDate(today.getDate() - 1));
        endDate = startDate;
        break;
      case 'Last 7 Days':
        startDate = new Date(today.setDate(today.getDate() - 7));
        endDate = new Date();
        break;
      case 'This Month':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'Last 3 Months':
        startDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
        break;
      case 'Last 6 Months':
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
        break;
      case 'This Year':
        startDate = new Date(today.getFullYear(), 0, 1);
        break;
    }

    this.rangeDates = [startDate, endDate];
  }

  searchData(value:any ){
    
  }
}

// last 3 month=>{
// today.getFullYear() return year = 2024;
// today.getMonth() return this month = 5 = june ; because jan index is 0 ;
// so 5- 3 = 2 = march;
// today.getDate( return) today date = 6 ;
// startdate= new Date(2024, 2, 6) = it return new date = 03/06/2024 
// }