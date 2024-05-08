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
import { LotService } from '../lot.service';


@Component({
  selector: 'app-list-lot',
  standalone: true,
  imports: [CommonModule,SharedModule,ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './list-lot.component.html',
  styleUrl: './list-lot.component.scss'
})
export class ListLotComponent {

  public routes = routes;
  data: any = null;
  originalData:any = []
  public showDialog: boolean = false;
  modalData: any = {}
  lotID: any;
  searchDataValue = "";
  selectedLot = [];

  constructor(public dialog: MatDialog, public router: Router, private service: LotService, private _snackBar: MatSnackBar, private messageService: MessageService) { }
  getLotList(): void {
    this.service.getLotList().subscribe((resp: any) => {
      this.data = resp.data;
      // map(lot=>{
      //   lot.currentStock=lot.openingStock-lot.
      // })
      this.originalData = resp.data;

      console.log("API", this.data);

    })
  }
  ngOnInit(): void {
    this.getLotList();
  }

  deleteLot(_id: any) {
    this.lotID = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Lot",
    }
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteLotById(this.lotID).subscribe(resp => {
      const message = "Lot has been deleted"
      this.messageService.add({ severity: 'success', detail: message });
      this.getLotList();
      this.showDialog = false;

    })
  }

  close() {
    this.showDialog = false;
  }

  public searchData(value: any): void {
    this.data = this.originalData.filter(i =>
    i.name.toLowerCase().includes(value.trim().toLowerCase())
  );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows; 
    const currentPageData = this.data.slice(startIndex, endIndex);
  }

}

