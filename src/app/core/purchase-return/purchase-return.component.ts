import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { Validators } from 'ngx-editor';
import { el } from '@fullcalendar/core/internal-common';
import { allInvoice, apiResultFormat, pageSelection } from 'src/app/shared/models/models';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/shared/data/data.service';
import { Sort } from '@angular/material/sort';
import { PurchaseReturnService } from './purchase-return.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InvoiceDialogComponent } from 'src/app/common-component/modals/invoice-dialog/invoice-dialog.component';
@Component({
  selector: 'app-purchase-return',
  standalone: true,
  imports: [CommonModule,SharedModule, ToastModule, DropdownModule,CalendarModule,InvoiceDialogComponent ],
  templateUrl: './purchase-return.component.html',
  styleUrl: './purchase-return.component.scss',
  providers: [MessageService],
})
export class PurchaseReturnComponent {
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
  purchaseReturnData: any;
  originalData: any;
  purchaseReturn: number;
  modalData: { title: string; messege: string; };
  showDialoge: boolean;
  showInvoiceDialog: boolean;
  selectedPurchaseReturn:''
  header: string;
  PurchaseReturnListData: any[];

  constructor(public data : DataService,private service:PurchaseReturnService,private router: Router,private messageService: MessageService,){

  }
  ngOnInit() {
    this.getPurchaseReturn();
  }
  getPurchaseReturn() {
    this.service.getPurchaseReturnList().subscribe((resp: any) => {
      this.purchaseReturnData = resp.data;
    });
  }
  purchaseReturnUpdate(id:any){
    this.router.navigate(["/purchase-return/edit-purchase-return/" + id]);
  }
  purchaseReturnDelete(id: number) {
    this.purchaseReturn = id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Customer",
    };
    this.showDialoge = true;
  }
    callBackModal() {
      this.showDialoge = false;
      this.service.deletePurchaseReturn(this.purchaseReturn).subscribe((resp: any) => {
        if(resp.status == "success"){
          this.messageService.add({ severity: "success", detail: resp.message });
        }else{
          this.messageService.add({ severity: "error", detail: resp.message });
        }
      this.getPurchaseReturn();
    });
  }
  close() {
    // this.visible = false;
    this.showInvoiceDialog = false;
      this.showDialoge = false;
    
  }
  showInvoiceDialoge(id: any)  {
    let totalTax = 0;
    console.log("id pass to invoice dialoge", id);
    console.log("showInvoiceDialoge is triggered ");
    this.service.getPurchaseReturnById(id).subscribe((resp: any) => {
      this.showInvoiceDialog = true;
      this.PurchaseReturnListData = [resp.data];
      this.header = "Purchase Invoice";
      console.log(this.PurchaseReturnListData[0].lotDetails);
      console.log(this.PurchaseReturnListData);
      console.log(resp);


      // if (resp.data.lotDetails) {
      //   this.service
      //     .getBlockDetailByLotId(resp.data.lotDetails._id)
      //     .subscribe((resp: any) => {
      //       this.blockDetailsTable = resp.data.blockDetails;
      //     });
      // }
    })}
  public searchData(value: any): void {
    this.purchaseReturnData.filter = value.trim().toLowerCase();
    this.originalData = this.purchaseReturnData.filteredData;
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
      // this.getTableData();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      // this.getTableData();
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
    // this.getTableData();
  }
  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    // this.getTableData();
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
