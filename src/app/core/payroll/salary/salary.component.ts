import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from '../../Customers/customers.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { TabViewModule } from 'primeng/tabview';
import { payrollService } from '../payroll.service';
@Component({
  selector: 'app-salary',
  templateUrl: './salary.component.html',
  styleUrls: ['./salary.component.scss'],
  providers: [MessageService],
  standalone: true,
  imports: [CommonModule, SharedModule, DropdownModule, CalendarModule, ToastModule, DialogModule,TabViewModule]

})
export class SalaryComponent {
  public routes = routes;

  public searchDataValue = '';
  selectedsalary = "";
  salaryId: any;
  showDialoge = false;
  modalData: any = {};
  salaryData = [];
  visible: boolean = false;

  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    public service: payrollService
) {}



  deleteSalaryList(Id: any) {
    this.salaryId = Id;

    console.log("ID", this.salaryId);
    

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Employee Salary details"
    }
    this.showDialoge = true;
  }
  
  showNewDialog() {
    this.showDialoge = true;
  }
  callBackModal() {
    this.service.deleteEmployeeSalaryData(this.salaryId).subscribe((resp: any) => {
      this.messageService.add({ severity: 'success', detail: resp.message });
      this.getEmployeeSalaryData();
      this.showDialoge = false;
    });
  }

  close() {
    this.showDialoge = false;
  }
  editSalary(id: any) {
    this.router.navigate([`/payroll/edit-salary/${id}`]);
  }
  getEmployeeSalaryData() {
    this.service.getEmployeeSalaryData().subscribe((resp: any) => {
      this.salaryData = resp;
      console.log("salary data", resp);
    });
  }

  ngOnInit(): void {
    this.getEmployeeSalaryData();
  }

  }