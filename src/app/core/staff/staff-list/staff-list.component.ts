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
@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.scss'],
  // providers:[MessageService  ]
})
export class StaffListComponent {
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
  
   staffData = [
    {
      "Name": "Dr.Smith Bruklin",
      "Department": "Urology",
      "Specialization": "Prostate",
      "Degree": "MBBS, MS",
      "Mobile": "9610237965",
      "Email": "example@email.com",
      "JoiningDate": "01.10.2022"
    },
    {
      "Name": "Dr.William Stephin",
      "Department": "Radiology",
      "Specialization": "Cancer",
      "Degree": "MBBS, MS",
      "Mobile": "9610237965",
      "Email": "example@email.com",
      "JoiningDate": "01.10.2022"
    },
    {
      "Name": "Andrea Lalema",
      "Department": "Otolaryngology",
      "Specialization": "Infertility",
      "Degree": "MBBS, MS",
      "Mobile": "9610237965",
      "Email": "example@email.com",
      "JoiningDate": "01.10.2022"
    },
    {
      "Name": "Cristina Groves",
      "Department": "Gynocolgy",
      "Specialization": "Prostate",
      "Degree": "MBBS",
      "Mobile": "7737640566",
      "Email": "example@email.com",
      "JoiningDate": "01.10.2022"
    },
    {
      "Name": "Mark Hay Smith",
      "Department": "Gynocolgy",
      "Specialization": "Prostate",
      "Degree": "MBBS, MS",
      "Mobile": "9610237965",
      "Email": "example@email.com",
      "JoiningDate": "01.10.2022"
    },
    {
      "Name": "Bernardo James",
      "Department": "Dentist",
      "Specialization": "Prostate",
      "Degree": "MBBS, MS",
      "Mobile": "9610237965",
      "Email": "example@email.com",
      "JoiningDate": "01.10.2022"
    }
  ]

}
