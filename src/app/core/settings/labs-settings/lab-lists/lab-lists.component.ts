import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { routes } from 'src/app/shared/routes/routes';
import { Router } from '@angular/router';
import { AddLabDialogComponent } from '../labs-dialog/add-dialog/add-dialog.component';
import { EditLabDialogComponent } from '../labs-dialog/edit-dialog/edit-dialog.component';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-lab-lists',
  templateUrl: './lab-lists.component.html',
  styleUrls: ['./lab-lists.component.scss'],
  standalone: true,
  imports: [CommonModule,
    SharedModule,
    ButtonModule,
    ToastModule],
  providers: [MessageService]
})

export class LabListsComponent {
  public routes = routes;
  loading = false;
  displayedColumns: string[] = ['labCategory', 'labName', 'labDiscription'];
  public Labdata: any = [];
  labID: string = ""
  public showDialog: boolean = false;
  data: any = {}
  searchDataValue = "";
  selectedProducts: []
  originalData: any = []

  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private service: SettingsService,
    private _liveAnnouncer: LiveAnnouncer,
    private messageService: MessageService) { }

  getLabsLists() {
    this.loading = true;
    this.service.getLabList().subscribe((resp: any) => {
      this.Labdata = resp.data;
      this.originalData = resp.data;
      this.loading = false;
    })
  }

  ngOnInit(): void {
    this.getLabsLists();
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(AddLabDialogComponent);
    dialogRef.afterClosed().subscribe(dialog => {
      if (dialog === true) return;
      this.service.addNewLab(dialog.value).subscribe((resp: any) => {
        if (resp.status === 'success') {
          const message = "Lab has been added"
          this.messageService.add({ severity: 'success', detail: message });
          this.getLabsLists();
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }
      })
    });
  }

  openEditDialog(labId: any) {
    const dialogRef = this.dialog.open(EditLabDialogComponent, {
      data: labId
    });
    dialogRef.afterClosed().subscribe(dialog => {
      if (dialog === true) return;
      dialog.value.id = labId;
      this.service.updateLabById(dialog.value).subscribe((resp: any) => {
        if (resp.status === 'success') {
          const message = "Lab has been updated"
          this.messageService.add({ severity: 'success', detail: message });
          this.getLabsLists();
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }
      })
    });
  }

  deleteLab(_id: any) {
    this.labID = _id;
    this.data = {
      title: "Delete",
      messege: "Are you sure want to delete this Lab"
    }
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteLabById(this.labID).subscribe(resp => {
      const message = "Lab has been deleted"
      this.messageService.add({ severity: 'success', detail: message });
      this.getLabsLists();
      this.showDialog = false;

    })
  }

  close() {
    this.showDialog = false;
  }

  @ViewChild(MatSort) sort!: MatSort;
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  public searchData(value: any): void {
    this.Labdata = this.originalData.map(i => {
      if (i.labCategory.toLowerCase().includes(value.trim().toLowerCase())) {
        return i;
      }
    });
  }
}
