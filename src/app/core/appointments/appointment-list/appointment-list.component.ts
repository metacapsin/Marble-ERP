import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { AppointmentService } from 'src/app/shared/data/appointment.service';
import { DataService } from 'src/app/shared/data/data.service';
import { pageSelection, apiResultFormat, appointmentList } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.scss']
})
export class AppointmentListComponent  implements OnInit {
  @ViewChild('dt') dt: Table | undefined;
  public routes = routes;
  public appointmentList: Array<appointmentList> = [];
  dataSource!: MatTableDataSource<appointmentList>;

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
  showDialog:boolean=false;
  apptId:string='';
  modalData:any;
  constructor(private apptService:AppointmentService, private router:Router,private _snackbar:MatSnackBar){

  }
  ngOnInit() {
    this.getTableData();
  }
  getTableData(): void {
    this.appointmentList = [];
    this.serialNumberArray = [];
    this.apptService.getAppointmentList().subscribe(
      (res:any)=>{
        if(res.status=='success'){
          this.appointmentList=res.data;
          console.log("hey", this.appointmentList);
          
        }
      }
    )
    // this.data.getAppointmentList().subscribe((data: apiResultFormat) => {
    //   this.totalData = data.totalData;
    //   data.data.map((res: appointmentList, index: number) => {
    //     var serialNumber = index + 1;
    //     if (index >= this.skip && serialNumber <= this.limit) {
         
    //       this.appointmentList.push(res);
    //       this.serialNumberArray.push(serialNumber);
    //     }
    //   });
    //   this.dataSource = new MatTableDataSource<appointmentList>(this.appointmentList);
    //   this.calculateTotalPages(this.totalData, this.pageSize);
    // });
  }
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.appointmentList = this.dataSource.filteredData;
  }

  editAppointment(apptId){

    this.router.navigate([`appointments/edit-appointment/${apptId}`])
  }
 
  public sortData(sort: Sort) {
    const data = this.appointmentList.slice();

    if (!sort.active || sort.direction === '') {
      this.appointmentList = data;
    } else {
      this.appointmentList = data.sort((a, b) => {
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

  applyFilterGlobal($event, stringVal) {
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
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
      var limit = pageSize * i;
      var skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
  deleteConfirmation(apptId){
    this.apptId=apptId

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this appointment"
    }
    this.showDialog=true;
  }

  deleteAppointment(){
    this.apptService.deleteAppointment(this.apptId).subscribe(
      (res:any)=>{
        if(res.status==='success'){
          this._snackbar.open(res.message, 'OK', {
            duration: 3000
          });
          this.showDialog=false;
        }
      }
    )
  }

  
  close(){
    this.showDialog=false;
  }

}
