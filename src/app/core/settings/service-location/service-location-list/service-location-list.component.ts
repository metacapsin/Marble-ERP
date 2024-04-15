import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-service-location-list',
  templateUrl: './service-location-list.component.html',
  styleUrls: ['./service-location-list.component.scss'],
  standalone: true,
  imports: [CommonModule,SharedModule,ButtonModule, ToastModule],
  providers: [MessageService]
})
export class ServiceLocationListComponent {
  public routes = routes;
  data: any = null;
  originalData:any = []
  public showDialog: boolean = false;
  modalData: any = {}
  serviceLocationID: any;
  searchDataValue = "";
  selectedProducts = [];


  constructor(public dialog: MatDialog, public router: Router, private service: SettingsService, private _snackBar: MatSnackBar, private messageService: MessageService) { }

  getServiceLocationList(): void {
    this.service.getServiceLocationList().subscribe((resp: any) => {
      this.data = resp.data;
      this.originalData = resp.data;

      console.log("API", this.data);

    })
  }

  ngOnInit(): void {
    this.getServiceLocationList();
  }

  deleteLocation(_id: any) {
    this.serviceLocationID = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Service Location",
    }
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteServiceLocationById(this.serviceLocationID).subscribe(resp => {
      const message = "Service Location has been deleted"
      this.messageService.add({ severity: 'success', detail: message });
      this.getServiceLocationList();
      this.showDialog = false;

    })
  }

  close() {
    this.showDialog = false;
  }

  // public searchData(value: any): void {
  //   // this.dataSource.filter = value.trim().toLowerCase();
  //   // this.patientsList = this.dataSource.filteredData;
  // }

  public searchData(value: any): void {
    this.data = this.originalData.map(i => {
        if(i.name.toLowerCase().includes(value.trim().toLowerCase())){
          return i;
        }
    });
}

}
