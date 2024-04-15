import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { MessageService, SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { VisitReasonAddDialogComponent } from '../visit-reason-dialog/visit-reason-add-dialog/visit-reason-add-dialog.component';
import { routes } from 'src/app/shared/routes/routes';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VisitReasonsService } from 'src/app/shared/data/visit-reasons.service';
import { VisitReasonEditDialogComponent } from '../visit-reason-dialog/visit-reason-edit-dialog/visit-reason-edit-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/common-component/modals/confirm-dialog/confirm-dialog.component';
import { ShowHideDirective } from 'src/app/common-component/show-hide-directive/show-hide.directive';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-visit-reasons-list',
  templateUrl: './visit-reasons-list.component.html',
  styleUrls: ['./visit-reasons-list.component.scss'],
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, SharedModule, TableModule, CommonModule,
    SharedModule, RouterModule, ButtonModule, FormsModule, ConfirmDialogComponent, ShowHideDirective, ToastModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers:[MessageService]


})
export class VisitReasonListComponent implements AfterViewInit, OnInit {
  loading = true;
  VisitReasondata: any = null;
  public routes = routes;
  displayedColumns: string[] = ['visitReasonName', 'visitReasonColorInCalender', 'visitReasonDuration', 'visitReasonServices'];
  public VisitReasonData: any = []
  showDialog = false;
  modalData: any = {}
  reasonID = ""
  searchDataValue = "";
  selectedProducts = [];
  originalData: any = []



  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngAfterViewInit() {
    this.VisitReasonData.paginator = this.paginator;
    this.VisitReasonData.sort = this.sort;

  }

  constructor(public dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private service: VisitReasonsService,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) { }


  getVisitReasonData() {
    this.loading = true;
    this.service.getVisitReasonsList().subscribe((resp: any) => {
      this.VisitReasonData = resp.data;
      this.originalData = resp.data;
      this.loading = false;
      console.log("visit reasons ", this.VisitReasonData)
    })


  }
  ngOnInit(): void {
    this.getVisitReasonData()
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(VisitReasonAddDialogComponent);
    dialogRef.afterClosed().subscribe(dialog => {
      debugger
      if (dialog === true) return;
      this.service.CreateVisitReason(dialog).subscribe((resp: any) => {
        if (resp.status === 'success') {
          const message = "Visit Reason has been added";
          this.messageService.add({ severity: 'success', detail: message });
          this.getVisitReasonData();
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }
      })
    })
  }

  openEditDialog(reasonId: string) {
    if (!reasonId) return;
    const dialogRef = this.dialog.open(VisitReasonEditDialogComponent, {
      data: reasonId
    });

    dialogRef.afterClosed().subscribe(dialog => {
      if (dialog === true) return;
      dialog.value.id = reasonId;
      this.service.updateVisitReason(dialog.value).subscribe((resp: any) => {
        if (resp.status === 'success') {
          const message = "Visit Reason has been updated"
          this.messageService.add({ severity: 'success', detail: message });
          this.getVisitReasonData();
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }
      })
    })
  }


  deleteVisitReason(reasonId: any) {
    this.reasonID = reasonId;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Visit Reasons"
    }
    this.showDialog = true;
    
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteVisitReasonById(this.reasonID).subscribe(resp => {
      const message = "Visit Reason  has been deleted"
      this.messageService.add({ severity: 'success', detail: message });
      this.getVisitReasonData();
      this.showDialog = false;
    })
  }

  close() {
    this.showDialog = false;
  }



  // deleteVisitReason(reasonId: string) {
  //   this.service.deleteVisitReasonById(reasonId).subscribe(resp => {
  //     this._snackBar.open("Information is Deleted!", '', {
  //       duration: 2000,
  //       verticalPosition: 'top',
  //       horizontalPosition: 'right',
  //       panelClass: "blue",
  //     });
  //     this.getVisitReasonData();
  //   })
  // }


  @ViewChild(MatSort) sort!: MatSort;
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  // searchData(data) {

  // }

  public searchData(value: any): void {
    this.VisitReasonData = this.originalData.map(i => {
      if (i.visitReasonName.toLowerCase().includes(value.trim().toLowerCase())) {
        return i;
      }
    });
  }
}
