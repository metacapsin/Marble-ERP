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
import { PurchaseService } from './purchase.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [CommonModule,SharedModule,DialogModule,DropdownModule,CalendarModule,ToastModule,TabViewModule],
  templateUrl: './purchase.component.html',
  styleUrl: './purchase.component.scss',
  providers: [MessageService],
})
export class PurchaseComponent {
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
  originalData:any
  purchaseData:any
  purchase:any
  showDialoge:any
  modalData:any
  PurchaseListData:any
  visible: boolean = false
  addTaxTotal:any
  setDataInPopPu:any



  CustomerList=[
    {customerName:"Adnan"},
    {customerName:"Nadim"},
    {customerName:"Kavya"},
  ];

  constructor(public data : DataService,private Service:PurchaseService,private router: Router,private messageService: MessageService){

  }
  ngOnInit() {
    this.getTableData();
    this.getPurchase();
    // this.Service.GetPurchaseDataById("66321c9e409a10ebdff231e6").subscribe((resp: any) => {
    //   this.PurchaseListData = [resp.data];
    // })
  }
  getPurchase() {
    this.Service.GetPurchaseData().subscribe((data:any) => {
      this.purchaseData = data.data;
      this.originalData = data
    });
  }
  blocksEdit(id:any){
    console.log(id);
  }
  purchaseUpdate(id:number){
    this.router.navigate(['/purchase/edit-purchase/'+ id]);
  }


  showDialogView(id:any) {
    let totalTax = 0;
    this.visible = true;
    this.Service.GetPurchaseDataById(id).subscribe((resp: any) => {
      this.PurchaseListData = [resp.data];
      this.setDataInPopPu = this.PurchaseListData[0]
      resp.data.appliedTax.forEach(element => {
        totalTax += Number(element.taxRate);
      });
      this.addTaxTotal = resp.data.purchaseGrossTotal * totalTax / 100;
    });

    // this.Service.GetPurchaseDataById(_id).subscribe((resp: any) => {
    //   this.PurchaseListData = [resp.data];
    //   console.log("payment id ser ", resp);
    // })
  }




  purchaseDelete(id:number){
    this.purchase = id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Customer"
    }
    this.showDialoge = true;
  }

  showNewDialog() {
    this.showDialoge = true;
  }

  callBackModal() {
    this.Service.DeletePurchaseData(this.purchase).subscribe((resp:any) => {
      let message = "Purchase has been Deleted"
      this.messageService.add({ severity: 'success', detail:message });
      this.getPurchase();
      this.showDialoge = false;
    })
  }

  close() {
    this.showDialoge = false;
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
