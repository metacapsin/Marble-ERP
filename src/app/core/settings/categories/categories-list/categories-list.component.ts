import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { MessageService} from 'primeng/api';
import { TableModule } from 'primeng/table';
import { routes } from 'src/app/shared/routes/routes';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogComponent } from 'src/app/common-component/modals/confirm-dialog/confirm-dialog.component';
import { ShowHideDirective } from 'src/app/common-component/show-hide-directive/show-hide.directive';
import { ToastModule } from 'primeng/toast';
import { AddCategoriesComponent } from '../add-categories/add-categories.component';
import { EditCategoriesComponent } from '../edit-categories/edit-categories.component';
import { CategoriesService } from '../categories.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilterPipe } from 'src/app/core/filter.pipe';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrl: './categories-list.component.scss',
  standalone: true,
  imports: [ TableModule, CommonModule,SharedModule, RouterModule, FilterPipe,ButtonModule, FormsModule, ConfirmDialogComponent, ShowHideDirective, ToastModule],
  providers: [MessageService]
})
export class CategoriesListComponent {
  public routes = routes;
  searchDataValue = "";
  selectedCategory = [];
  originalData: any = [];
  showDialog = false;
  modalData: any = {};
  categoryID: any;
  categoriesListData = [];

  constructor(public dialog: MatDialog,
    public service: CategoriesService,
    private messageService: MessageService
  ) {

  }

  openAddDialog() {
    console.log(this.categoriesListData);
    
    const dialogRef = this.dialog.open(AddCategoriesComponent);
    dialogRef.afterClosed().subscribe(dialog => {
      if (dialog === true) return;
      this.service.CreateCategories(dialog).subscribe((resp: any) => {
        if (resp.status === 'success') {
          const message = "Category has been added";
          this.messageService.add({ severity: 'success', detail: message });
          this.getCategoriesData();
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }
      })
    })
  }
  openEditDialog(categoryID: string) {
    if (!categoryID) return;
    const dialogRef = this.dialog.open(EditCategoriesComponent, {
      data: categoryID
    });

    dialogRef.afterClosed().subscribe(dialog => {
      if (dialog === true) return;
      dialog.id = categoryID;
      this.service.updateCategories(dialog).subscribe((resp: any) => {
        if (resp.status === 'success') {
          const message = "Category has been updated"
          this.messageService.add({ severity: 'success', detail: message });
          this.getCategoriesData();
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }
      })
    })
  }

  
  getCategoriesData(): void {
    console.log(this.service)
    this.service.getCategories().subscribe((resp: any) => {
      this.categoriesListData = resp.data;
      this.originalData = resp.data;
    })
    
  }
  
  ngOnInit() {
this.getCategoriesData();
  }

  deleteCategory(Id: any) {

    this.categoryID = Id;

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
    this.service.deleteCategoriesById(this.categoryID).subscribe(resp => {
      const message = "Category has been deleted"
      this.messageService.add({ severity: 'success', detail: message });
      this.getCategoriesData();
      this.showDialog = false;
    })
  }

  close() {
    this.showDialog = false;
  }


  public searchData(value: any): void {
    this.categoriesListData = this.originalData.filter(i =>
    i.name.toLowerCase().includes(value.trim().toLowerCase())
  );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows; 
    const currentPageData = this.categoriesListData.slice(startIndex, endIndex);
  }

}
