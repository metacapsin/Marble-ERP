import { CommonModule } from '@angular/common';
import { Component} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MessageService, SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { routes } from 'src/app/shared/routes/routes';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/common-component/modals/confirm-dialog/confirm-dialog.component';
import { ShowHideDirective } from 'src/app/common-component/show-hide-directive/show-hide.directive';
import { ToastModule } from 'primeng/toast';
import { AddSubCategoriesComponent } from '../add-sub-categories/add-sub-categories.component';
import { EditSubCategoriesComponent } from '../edit-sub-categories/edit-sub-categories.component';
import { SubCategoriesService } from '../sub-categories.service';

@Component({
  selector: 'app-sub-categories-list',
  templateUrl: './sub-categories-list.component.html',
  styleUrl: './sub-categories-list.component.scss',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButtonModule, MatIconModule, SharedModule, TableModule, CommonModule,
    SharedModule, RouterModule, ButtonModule, FormsModule, ConfirmDialogComponent, ShowHideDirective, ToastModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MessageService]
})
export class SubCategoriesListComponent  {
  public routes = routes;
  searchDataValue = "";
  selectedCategory = [];
  originalData: any = [];
  showDialog = false;
  modalData: any = {};
  subCategoryId: any;
  subCategoriesData = [
    {
      subCategoriesName: "Mobiles",
      subCategoriesSlug: ""
    },
    {
      subCategoriesName: "Computer",
      subCategoriesSlug: ""
    },
    {
      subCategoriesName: "Electrics",
      subCategoriesSlug: ""
    }
  ]

  constructor(public dialog: MatDialog,
    private service: SubCategoriesService,
    private messageService: MessageService) {

  }

  openAddDialog() {
    
    const dialogRef = this.dialog.open(AddSubCategoriesComponent);
    dialogRef.afterClosed().subscribe(dialog => {
      if (dialog === true) return;
      this.service.CreateSubCategories(dialog).subscribe((resp: any) => {
        if (resp.status === 'success') {
          const message = "Sub Category has been added";
          this.messageService.add({ severity: 'success', detail: message });
          this.getSubCategoriesData();
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }
      })
    })
  }
  openEditDialog(reasonId: string) {
    // if (!reasonId) return;
    const dialogRef = this.dialog.open(EditSubCategoriesComponent, {
      data: reasonId
    });

    dialogRef.afterClosed().subscribe(dialog => {
      // if (dialog === true) return;
      // dialog.value.id = reasonId;
      // this.service.updateSubCategories(dialog.value).subscribe((resp: any) => {
      //   if (resp.status === 'success') {
      //     const message = "Sub Category has been updated"
      //     this.messageService.add({ severity: 'success', detail: message });
      //     this.getSubCategoriesData();
      //   } else {
      //     const message = resp.message
      //     this.messageService.add({ severity: 'error', detail: message });
      //   }
      // })
    })
  }

  ngOnInit() {
    this.getSubCategoriesData();
  }

  getSubCategoriesData(){
    this.service.getSubCategories().subscribe((resp: any) => {
      // this.categoriesListData = resp.data;
      this.originalData = resp.data;
    })

  }

  deleteSubCategory(Id: any) {
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Sub Category"
    }
    this.showDialog = true;
    
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteSubCategoriesById(this.subCategoryId).subscribe(resp => {
      const message = "Sub Category has been deleted"
      this.messageService.add({ severity: 'success', detail: message });
      this.getSubCategoriesData();
      this.showDialog = false;
    })
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
