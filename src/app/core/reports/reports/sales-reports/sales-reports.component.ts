import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/shared/data/data.service';
import { pageSelection, apiResultFormat, invoicereport } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
interface data {
  value: string ;
}

@Component({
  selector: 'app-sales-reports',
  // standalone: true,
  // imports: [],
  templateUrl: './sales-reports.component.html',
  styleUrl: './sales-reports.component.scss'
})
export class SalesReportsComponent implements OnInit {
  public routes = routes;
  picker1: any;


  public selectedValue !: string  ;
  public invoiceReports: Array<invoicereport> = [];
  dataSource!: MatTableDataSource<invoicereport>;

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

  constructor(public data : DataService){

  }
  ngOnInit() {
    this.getTableData();
  }
  private getTableData(): void {
    this.invoiceReports = [];
    this.serialNumberArray = [];

    this.data.getInvoiceReports().subscribe((data: apiResultFormat) => {
      this.totalData = data.totalData;
      data.data.map((res: invoicereport, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
        
          this.invoiceReports.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<invoicereport>(this.invoiceReports);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.invoiceReports = this.dataSource.filteredData;
  }

  public sortData(sort: Sort) {
    const data = this.invoiceReports.slice();

    if (!sort.active || sort.direction === '') {
      this.invoiceReports = data;
    } else {
      this.invoiceReports = data.sort((a, b) => {
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
  selectedList: data[] = [
    {value: 'Select Patient'},
    {value: 'Bernardo James'},
    {value: 'Galaviz Lalema'},
    {value: 'Tarah Williams'},
  ];
  SalesData = [
    {
      invoiceNumber: "SALE-107",
      salesDate: "16-04-2024",
      Customer: "Walk In Customer",
      salesStatus: "Delivered",
      paidAmount: "$0.00",
      totalAmount: "$41.00",
      paymentStatus: "Unpaid",
    },
    {
      invoiceNumber: "SALE-106",
      salesDate: "16-04-2024",
      Customer: "Sanford Daugherty III",
      salesStatus: "Delivered",
      paidAmount: "$96.00",
      totalAmount: "$96.00",
      paymentStatus: "Paid",
    },
    {
      invoiceNumber: "SALE-105",
      salesDate: "16-04-2024",
      Customer: "Walk In Customer",
      salesStatus: "Delivered",
      paidAmount: "$50.00",
      totalAmount: "$47.00",
      paymentStatus: "Paid",
    },
    {
      invoiceNumber: "SALE-104",
      salesDate: "16-04-2024",
      Customer: "Walk In Customer",
      salesStatus: "Delivered",
      paidAmount: "$34.00",
      totalAmount: "$34.00",
      paymentStatus: "Paid",
    },
    {
      invoiceNumber: "SALE-103",
      salesDate: "15-04-2024",
      Customer: "Walk In Customer",
      salesStatus: "Delivered",
      paidAmount: "$0.00",
      totalAmount: "$75.00",
      paymentStatus: "Unpaid",
    },
    {
      invoiceNumber: "SALE-102",
      salesDate: "15-04-2024",
      Customer: "Walk In Customer",
      salesStatus: "Delivered",
      paidAmount: "$100.00",
      totalAmount: "$91.00",
      paymentStatus: "Paid",
    },
    {
      invoiceNumber: "SALE-101",
      salesDate: "15-04-2024",
      Customer: "Walk In Customer",
      salesStatus: "Delivered",
      paidAmount: "$0.00",
      totalAmount: "$234.00",
      paymentStatus: "Unpaid",
    },
    {
      invoiceNumber: "SALE-100",
      salesDate: "15-04-2024",
      Customer: "Walk In Customer",
      salesStatus: "Delivered",
      paidAmount: "$0.00",
      totalAmount: "$20.00",
      paymentStatus: "Unpaid",
    },
    {
      invoiceNumber: "SALE-99",
      salesDate: "15-04-2024",
      Customer: "Walk In Customer",
      salesStatus: "Delivered",
      paidAmount: "$12.00",
      totalAmount: "$41.00",
      paymentStatus: "Partially Paid",
    },
    {
      invoiceNumber: "SALE-98",
      salesDate: "15-04-2024",
      Customer: "goita",
      salesStatus: "Delivered",
      paidAmount: "$0.00",
      totalAmount: "$180.00",
      paymentStatus: "Unpaid",
    },
  ];
}
