import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataManagementAddDialogComponent } from 'src/app/shared/dialog/data-managements-dialog/data-management-add-dialog/data-management-add-dialog.component';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-data-managements',
  templateUrl: './data-managements.component.html',
  styleUrls: ['./data-managements.component.scss']
})
export class DataManagementsComponent {
  dataManagementCategory = 'I';
  public routes = routes;
  RecentImports = [
    {
      recentImportDate: "12/12/12",
      recentImportStatus: "success",
      recentImportDuplicate: "No",
      recentImportErrors: "Error"
    },
    {
      recentImportDate: "12/12/12",
      recentImportStatus: "success",
      recentImportDuplicate: "Yes",
      recentImportErrors: "No Error"
    }
  ];

  patientSummaryData = [
    {
      patientFirstName: "Adnan",
      patientLastName: "Hussain",
      patientPhoneNo: "12122",
      patientEmail: "adnan@gmail.com",
      patientCity: "Ca"
    },
    {
      patientFirstName: "Kavya",
      patientLastName: "Dadhich",
      patientPhoneNo: "33442",
      patientEmail: "kavya@gmail.com",
      patientCity: "Sydny"
    }
  ];

  constructor(public dialog: MatDialog,) {

  }

  changeDataManagementCategory(dataManagementCategory: string) {
    this.dataManagementCategory = dataManagementCategory;
  }



  openAddDialog() {
    const dialogRef = this.dialog.open(DataManagementAddDialogComponent);
  }

}
