import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { WarehouseService } from '../warehouse.service';


@Component({
  selector: 'app-warehouse-list',
  standalone: true,
  templateUrl: './warehouse-list.component.html',
  styleUrl: './warehouse-list.component.scss',
  imports: [CommonModule,SharedModule,ButtonModule, ToastModule],
  providers: [MessageService]
})
export class WarehouseListComponent {
  public routes = routes;
  data: any = null;
  originalData:any = []
  public showDialog: boolean = false;
  modalData: any = {}
  warehouseID: any;
  searchDataValue = "";
  selectedProducts = [];
  



  staticValues = [
    { name: 'Warehouse 1', email: 'warehouse1@example.com', phone: '123-456-7890',  },
    { name: 'Warehouse 2', email: 'warehouse2@example.com', phone: '987-654-3210',},
    { name: 'Warehouse 3', email: 'warehouse3@example.com', phone: '555-555-5555',}
  ];

  constructor(public dialog: MatDialog, public router: Router, private service: WarehouseService, private _snackBar: MatSnackBar, private messageService: MessageService) { }

  getAllWarehouseList(): void {
    this.service.getAllWarehouseList().subscribe((resp: any) => {
      this.data = resp.data;
      this.originalData = resp.data;

      console.log("API", this.data);

    })
  }

  ngOnInit(): void {
    this.getAllWarehouseList();
  }

  deleteLocation(_id: any) {
    this.warehouseID = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Warehouse",
    }
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteWarehouseById(this.warehouseID).subscribe(resp => {
      const message = "Warehouse has been deleted"
      this.messageService.add({ severity: 'success', detail: message });
      this.getAllWarehouseList();
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
