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

interface data {
  value: string ;
}
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
  selectedsalary = ""
  selectedSales = '';
  customerList = [];
  saleId: any;
  showDialoge = false;
  modalData: any = {};
originalData = [];
  visible: boolean = false;
  addTaxTotal: any;
  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private customerService: CustomersdataService,) { }



  deleteSalesReturn(Id: any) {
    this.saleId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Sales Return Details"
    }
    this.showDialoge = true;
  }

  showNewDialog() {
    this.showDialoge = true;
  }


  close() {
    this.showDialoge = false;
  }

  // salary json
  salaryData = [
    {
      "employeeID": "EID-001",
      "employeeName": "Andrea Lalema",
      "Email": "example@gmail.com",
      "joiningDate": "01.05.2020",
      "Role": "Nurse",
      "Salary": "1000",
      "Status": "Generate Slip"
    },
    {
      "employeeID": "EID-002",
      "employeeName": "William Stephin",
      "Email": "example@gmail.com",
      "joiningDate": "03.05.2020",
      "Role": "Accountant",
      "Salary": "2000",
      "Status": "Generate Slip"
    },
    {
      "employeeID": "EID-003",
      "employeeName": "Smith Bruklin",
      "Email": "example@gmail.com",
      "joiningDate": "04.05.2020",
      "Role": "Pharmacist",
      "Salary": "1500",
      "Status": "Generate Slip"
    },
    {
      "employeeID": "EID-004",
      "employeeName": "Bernardo James",
      "Email": "example@gmail.com",
      "joiningDate": "06.06.2020",
      "Role": "Nurse",
      "Salary": "3000",
      "Status": "Generate Slip"
    },
    {
      "employeeID": "EID-005",
      "employeeName": "Cristina Groves",
      "Email": "example@gmail.com",
      "joiningDate": "13.05.2020",
      "Role": "Accountant",
      "Salary": "5000",
      "Status": "Generate Slip"
    },
    {
      "employeeID": "EID-006",
      "employeeName": "Mark Hay Smith",
      "Email": "example@gmail.com",
      "joiningDate": "11.12.2020",
      "Role": "Pharmacist",
      "Salary": "2000",
      "Status": "Generate Slip"
    },
    {
      "employeeID": "EID-007",
      "employeeName": "Andrea Lalema",
      "Email": "example@gmail.com",
      "joiningDate": "01.05.2020",
      "Role": "Accountant",
      "Salary": "1000",
      "Status": "Generate Slip"
    },
    {
      "employeeID": "EID-008",
      "employeeName": "Smith Bruklin",
      "Email": "example@gmail.com",
      "joiningDate": "01.05.2020",
      "Role": "Nurse",
      "Salary": "2000",
      "Status": "Generate Slip"
    }
  ]

  }

// selectedList1: data[] = [
//   {value: 'Select Role'},
//   {value: 'Accountant'},
//   {value: 'Nurse'},
//   {value: 'Pharmacist'},
// ];
// selectedList2: data[] = [
//   {value: 'Select Leave Status'},
//   {value: 'Pending'},
//   {value: 'Approved'},
//   {value: 'Rejected'},
// ];