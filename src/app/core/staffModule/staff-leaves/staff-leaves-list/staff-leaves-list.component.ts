import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/shared/data/data.service';
import { pageSelection, apiResultFormat, staffleave } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { staffLeavesService } from '../staff-leaves.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-staff-leaves-list',
  standalone: true,
  imports: [CommonModule,
    SharedModule,
     DropdownModule,
     CalendarModule
     , ToastModule,
      DialogModule,
      TabViewModule,
      ],
  templateUrl: './staff-leaves-list.component.html',
  styleUrl: './staff-leaves-list.component.scss',
  providers: [MessageService]
})
export class StaffLeavesListComponent {

  public routes = routes;
  // public staffData= [];
  public searchDataValue = '';
  leaveId: any;
  showDialoge = false;
  selectedLeave = '';
  modalData: any = {};
originalData = [];
  visible: boolean = false;
  addTaxTotal: any;
  LeaveData = []  


  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private service: staffLeavesService
  ) { }


    deleteLeave(Id: any) {
      this.leaveId = Id;
      this.modalData = {
        title: "Delete",
        messege: "Are you sure you want to delete this leave request Details",
      };
      this.showDialoge = true;
    }
    showNewDialog() {
      this.showDialoge = true;
    }
    callBackModal() {
      this.service.deleteLeaveData(this.leaveId).subscribe((resp: any) => {
        this.messageService.add({ severity: "success", detail: resp.message });
        this.getLeaveData();
        this.showDialoge = false;
      });
    }
    close() {
      this.showDialoge = false;
    }
  
    editLeave(id: any) {
      this.router.navigate([`/staff-leaves/edit-staff-leaves/${id}`]);
    }
    getLeaveData() {
      this.service.getLeaveData().subscribe((resp: any) => {
        this.LeaveData = resp;
        this.originalData = resp;
        console.log("Leave request data", resp);
      });
    }
    ngOnInit(): void {
      this.getLeaveData();
    }
  
    public searchData(value: any): void {
      this.LeaveData = this.originalData.filter(i =>
      i.employee.toLowerCase().includes(value.trim().toLowerCase())
    );
    }
  
    onPageChange(event) {
      const startIndex = event.first;
      const endIndex = startIndex + event.rows; 
      const currentPageData = this.LeaveData.slice(startIndex, endIndex);
    }

}
