import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { DataService } from 'src/app/shared/data/data.service';
import { pageSelection, apiResultFormat, allInvoice } from 'src/app/shared/models/models';
import { routes } from "src/app/shared/routes/routes";

@Component({
  selector: 'app-unpaid-purchase-return',
  standalone: true,
  imports:[CommonModule, SharedModule, DropdownModule, CalendarModule],
  templateUrl: './unpaid-purchase-return.component.html',
  styleUrl: './unpaid-purchase-return.component.scss'
})
export class UnpaidPurchaseReturnComponent {
  public routes = routes;
  public checkboxes: string[] = [];

  public allInvoice: Array<allInvoice> = [];
  dataSource!: MatTableDataSource<allInvoice>;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;

  salesData = [
    {
      salesInvoiceNumber:1112,
      salesDate:"16 April 2024",
      salesCustomer:"Adnan",
      salesStatus:"Delivered",
      salesPaidAmount:"$2250",
      salesTotalAmount:"$3000",
      salesPaymentStatus:"Paid",
    }
  ];

  CustomerList=[
    {customerName:"Adnan"},
    {customerName:"Nadim"},
    {customerName:"Kavya"},
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

  constructor(public data : DataService){

  }
  ngOnInit() {
    this.getTableData();
  }
  private getTableData(): void {
    this.allInvoice = [];
    this.serialNumberArray = [];

    this.data.getAllInvoice().subscribe((data: apiResultFormat) => {
      this.totalData = data.totalData;
      data.data.map((res: allInvoice, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
        
          this.allInvoice.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<allInvoice>(this.allInvoice);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.allInvoice = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.allInvoice.slice();

    if (!sort.active || sort.direction === '') {
      this.allInvoice = data;
    } else {
      this.allInvoice = data.sort((a, b) => {
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
         // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableData();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
  public openCheckBoxes(val: string){
    if (this.checkboxes[0] != val) {
      this.checkboxes[0] = val;
    } else {
      this.checkboxes = [];
    }
  }
}

