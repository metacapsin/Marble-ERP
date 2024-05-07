import { Component, OnInit } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";
import { pageSelection, apiResultFormat, staffholidays } from 'src/app/shared/models/models';
import { DataService } from 'src/app/shared/data/data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CustomersdataService } from '../../Customers/customers.service';

@Component({
  selector: 'app-staff-holiday',
  templateUrl: './staff-holiday.component.html',
  styleUrls: ['./staff-holiday.component.scss']
})
export class StaffHolidayComponent{
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

  HolidayData= [
      {
        "Title": "New Year",
        "Holiday": "01.01.2022",
        "Day": "Sunday",
        "Description": "Common Holiday"
      },
      {
        "Title": "Pongal",
        "Holiday": "14.01.2022",
        "Day": "Monday",
        "Description": "Religious Holiday"
      },
      {
        "Title": "Pongal Holiday",
        "Holiday": "15.01.2022",
        "Day": "Monday",
        "Description": "Religious Holiday"
      },
      {
        "Title": "Tamil New Year",
        "Holiday": "14.04.2022",
        "Day": "Tuesday",
        "Description": "Religious Holiday"
      },
      {
        "Title": "Good Friday",
        "Holiday": "05.01.2022",
        "Day": "Friday",
        "Description": "Religious Holiday"
      },
      {
        "Title": "May Day",
        "Holiday": "15.01.2022",
        "Day": "Wednesday",
        "Description": "Common Holiday"
      },
      {
        "Title": "Ramzan",
        "Holiday": "10.08.2022",
        "Day": "Monday",
        "Description": "Religious Holiday"
      },
      {
        "Title": "Independence day",
        "Holiday": "26.01.2022",
        "Day": "Friday",
        "Description": "Common Holiday"
      }
    ]
  
  
}
