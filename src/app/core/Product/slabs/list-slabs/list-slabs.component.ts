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
import { SlabsService } from '../slabs.service';
@Component({
  selector: 'app-list-slabs',
  standalone: true,
  imports: [CommonModule,SharedModule,ButtonModule, ToastModule],
  providers: [MessageService],
  templateUrl: './list-slabs.component.html',
  styleUrl: './list-slabs.component.scss'
})
export class ListSlabsComponent {
  public routes = routes;
  data: any = null;
  originalData:any = []
  public showDialog: boolean = false;
  modalData: any = {}
  slabsID: any;
  searchDataValue = "";
  selectedSlabs = [];

  constructor(public dialog: MatDialog, public router: Router, private service: SlabsService, private _snackBar: MatSnackBar, private messageService: MessageService) { }

  getSlabsList(): void {
    this.service.getSlabsList().subscribe((resp: any) => {
      this.data = resp.data;
      // map(slabs=>{
      //   slabs.currentStock=slabs.openingStock-slabs.
      // })
      this.originalData = resp.data;

      console.log("API", this.data);

    })
  }
  ngOnInit(): void {
    this.getSlabsList();
  }

  deleteSlabs(_id: any) {
    this.slabsID = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Slabs",
    }
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteSlabsById(this.slabsID).subscribe(resp => {
      const message = "Slabs has been deleted"
      this.messageService.add({ severity: 'success', detail: message });
      this.getSlabsList();
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

