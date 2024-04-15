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
import { routes } from 'src/app/shared/routes/routes';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VisitReasonsService } from 'src/app/shared/data/visit-reasons.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/common-component/modals/confirm-dialog/confirm-dialog.component';
import { ShowHideDirective } from 'src/app/common-component/show-hide-directive/show-hide.directive';
import { ToastModule } from 'primeng/toast';
import { AddCategoriesComponent } from '../add-categories/add-categories.component';
import { EditCategoriesComponent } from '../edit-categories/edit-categories.component';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, SharedModule, TableModule, CommonModule,
    SharedModule, RouterModule, ButtonModule, FormsModule, ConfirmDialogComponent, ShowHideDirective, ToastModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MessageService]
})
export class CategoriesListComponent {
  public routes = routes;
  searchDataValue = "";
  selectedCategory = [];
  originalData: any = [];
  showDialog = false;
  modalData: any = {};
  CategoriesData = [
    {
      CategoriesName: "Mobiles",
      CategoriesSlug: ""
    },
    {
      CategoriesName: "Computer",
      CategoriesSlug: ""
    },
    {
      CategoriesName: "Electrics",
      CategoriesSlug: ""
    }
  ]

  constructor(public dialog: MatDialog) {

  }

  openAddDialog() {
    console.log(this.CategoriesData);
    
    const dialogRef = this.dialog.open(AddCategoriesComponent);
    dialogRef.afterClosed().subscribe(dialog => {
      debugger
      if (dialog === true) return;
      // this.service.CreateVisitReason(dialog).subscribe((resp: any) => {
      //   if (resp.status === 'success') {
      //     const message = "Visit Reason has been added";
      //     this.messageService.add({ severity: 'success', detail: message });
      //     this.getVisitReasonData();
      //   } else {
      //     const message = resp.message
      //     this.messageService.add({ severity: 'error', detail: message });
      //   }
      // })
    })
  }
  openEditDialog(reasonId: string) {
    // if (!reasonId) return;
    const dialogRef = this.dialog.open(EditCategoriesComponent, {
      data: reasonId
    });

    dialogRef.afterClosed().subscribe(dialog => {
      // if (dialog === true) return;
      // dialog.value.id = reasonId;
      // this.service.updateVisitReason(dialog.value).subscribe((resp: any) => {
      //   if (resp.status === 'success') {
      //     const message = "Visit Reason has been updated"
      //     this.messageService.add({ severity: 'success', detail: message });
      //     this.getVisitReasonData();
      //   } else {
      //     const message = resp.message
      //     this.messageService.add({ severity: 'error', detail: message });
      //   }
      // })
    })
  }
  deleteCategory(Id: any) {
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Category"
    }
    this.showDialog = true;
    
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    // this.service.deleteVisitReasonById(this.reasonID).subscribe(resp => {
    //   const message = "Visit Reason  has been deleted"
    //   this.messageService.add({ severity: 'success', detail: message });
    //   this.getVisitReasonData();
    //   this.showDialog = false;
    // })
  }

  close() {
    this.showDialog = false;
  }


  public searchData(value: any): void {
    // this.CategoryData = this.originalData.map(i => {
    //   if (i.CategoriesName.toLowerCase().includes(value.trim().toLowerCase())) {
    //     return i;
    //   }
    // });
  }

}
