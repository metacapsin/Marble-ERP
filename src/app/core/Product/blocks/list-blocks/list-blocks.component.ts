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
import { LotService } from '../../lot/lot.service';
import { BlocksService } from '../blocks.service';

@Component({
  selector: 'app-list-blocks',
  standalone: true,
  imports: [CommonModule,SharedModule,ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './list-blocks.component.html',
  styleUrl: './list-blocks.component.scss'
})
export class ListBlocksComponent {

  public routes = routes;
  data: any = null;
  originalData:any = []
  public showDialog: boolean = false;
  modalData: any = {}
  blocksID: any;
  searchDataValue = "";
  selectedLot = [];

  constructor(public dialog: MatDialog, public router: Router, private service: BlocksService, private _snackBar: MatSnackBar, private messageService: MessageService) { }
  getBlocksList(): void {
    this.service.getBlocksList().subscribe((resp: any) => {
      this.data = resp.data;
      // map(lot=>{
      //   lot.currentStock=lot.openingStock-lot.
      // })
      this.originalData = resp.data;

      console.log("API", this.data);

    })
  }
  ngOnInit(): void {
    this.getBlocksList();
  }

  deleteBlocks(_id: any) {
    this.blocksID = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Block",
    }
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteBlocksById(this.blocksID).subscribe(resp => {
      const message = "Blocks has been deleted"
      this.messageService.add({ severity: 'success', detail: message });
      this.getBlocksList();
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

