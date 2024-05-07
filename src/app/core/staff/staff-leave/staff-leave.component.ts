import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from 'src/app/shared/data/data.service';
import { pageSelection, apiResultFormat, staffleave } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { CustomersdataService } from '../../Customers/customers.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-staff-leave',
  templateUrl: './staff-leave.component.html',
  styleUrls: ['./staff-leave.component.scss']
})
export class StaffLeaveComponent {
  public routes = routes;
  // public staffData= [];
  public searchDataValue = '';
  saleId: any;
  showDialoge = false;
  modalData: any = {};
originalData = [];
  visible: boolean = false;
  addTaxTotal: any;
  salesReturnDataById= []
  salesReturnListData = []  


  constructor(
    // private messageService: MessageService,
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

  
    LeaveData = [
      {
        "EmployeeName": "Andrea Lalema",
        "LeaveType": "Medical Leave",
        "From": "02.10.2022",
        "To": "04.10.2022",
        "NoOfDays": "2 Days",
        "Reason": "Not Feeling well",
        "Status": "Approved"
      },
      {
        "EmployeeName": "Andrea Lalema",
        "LeaveType": "Medical Leave",
        "From": "02.10.2022",
        "To": "04.10.2022",
        "NoOfDays": "2 Days",
        "Reason": "Family Function",
        "Status": "Approved"
      },
      {
        "EmployeeName": "Bernardo James",
        "LeaveType": "Casual Leave",
        "From": "08.10.2022",
        "To": "10.10.2022",
        "NoOfDays": "2 Days",
        "Reason": "Going to Vacation",
        "Status": "New"
      },
      {
        "EmployeeName": "Mark Hay Smith",
        "LeaveType": "Medical Leave",
        "From": "02.10.2022",
        "To": "04.10.2022",
        "NoOfDays": "2 Days",
        "Reason": "Not Feeling well",
        "Status": "Approved"
      },
      {
        "EmployeeName": "Smith Bruklin",
        "LeaveType": "Casual Leave",
        "From": "02.10.2022",
        "To": "04.10.2022",
        "NoOfDays": "2 Days",
        "Reason": "Not Feeling well",
        "Status": "Approved"
      },
      {
        "EmployeeName": "Cristina Groves",
        "LeaveType": "Medical Leave",
        "From": "02.10.2022",
        "To": "04.10.2022",
        "NoOfDays": "2 Days",
        "Reason": "Family Function",
        "Status": "Approved"
      },
      {
        "EmployeeName": "Smith Bruklin",
        "LeaveType": "Casual Leave",
        "From": "04.10.2022",
        "To": "06.10.2022",
        "NoOfDays": "2 Days",
        "Reason": "Going to Vacation",
        "Status": "Pending"
      },
      {
        "EmployeeName": "William Stephin",
        "LeaveType": "Casual Leave",
        "From": "02.10.2022",
        "To": "04.10.2022",
        "NoOfDays": "2 Days",
        "Reason": "Family Function",
        "Status": "Declined"
      }
    ]
  
  

}
