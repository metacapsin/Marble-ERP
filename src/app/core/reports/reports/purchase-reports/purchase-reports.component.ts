import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-purchase-reports',
  // standalone: true,
  // imports: [],
  templateUrl: './purchase-reports.component.html',
  styleUrl: './purchase-reports.component.scss'
})
export class PurchaseReportsComponent {
  public routes = routes;
  picker1: any;
  searchDataValue = ""

  maxDate = new Date();
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


  searchData(value: any){

  }
}