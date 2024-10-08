import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { RouterModule } from "@angular/router";
import { MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { routes } from "src/app/shared/routes/routes";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { ConfirmDialogComponent } from "src/app/common-component/modals/confirm-dialog/confirm-dialog.component";
import { ShowHideDirective } from "src/app/common-component/show-hide-directive/show-hide.directive";
import { ToastModule } from "primeng/toast";
import { AddCategoriesComponent } from "../add-categories/add-categories.component";
import { EditCategoriesComponent } from "../edit-categories/edit-categories.component";
import { CategoriesService } from "../categories.service";
import { SharedModule } from "src/app/shared/shared.module";
import { FilterPipe } from "src/app/core/filter.pipe";

@Component({
  selector: "app-categories-list",
  templateUrl: "./categories-list.component.html",
  styleUrl: "./categories-list.component.scss",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
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
  cols = [];
  exportColumns = [];

  constructor(
    public dialog: MatDialog,
    public service: CategoriesService,
    private messageService: MessageService
  ) {}

  openAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; // Prevent closing with escape key
    const dialogRef = this.dialog.open(AddCategoriesComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((dialog) => {
      if (dialog === true) return;
      this.service.CreateCategories(dialog).subscribe((resp: any) => {
        if (resp.status === "success") {
          this.messageService.add({
            severity: "success",
            detail: resp.message,
          });
          this.getCategoriesData();
        } else {
          const message = resp.message;
          this.messageService.add({ severity: "error", detail: message });
        }
      });
    });
  }
  openEditDialog(categoryID: string) {
    if (!categoryID) return;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; // Prevent closing with escape key
    dialogConfig.data = categoryID; // Pass categoryID to the dialog

    const dialogRef = this.dialog.open(EditCategoriesComponent,dialogConfig)

    dialogRef.afterClosed().subscribe((dialog) => {
      if (dialog === true) return;
      dialog.id = categoryID;
      this.service.updateCategories(dialog).subscribe((resp: any) => {
        if (resp.status === "success") {
          this.messageService.add({
            severity: "success",
            detail: resp.message,
          });
          this.getCategoriesData();
        } else {
          const message = resp.message;
          this.messageService.add({ severity: "error", detail: message });
        }
      });
    });
  }

  getCategoriesData(): void {
    console.log(this.service);
    this.service.getCategories().subscribe((resp: any) => {
      this.categoriesListData = resp.data;
      this.originalData = resp.data;
      this.cols = [
        { field: "name", header: "Name" },
        { field: "description", header: "Description" },
        { field: "createdOn", header: "Created On" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.categoriesListData.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
    });
  }

  ngOnInit() {
    this.getCategoriesData();
  }

  deleteCategory(Id: any) {
    this.categoryID = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Category",
    };
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteCategoriesById(this.categoryID).subscribe((resp) => {
      const message = "Category has been deleted";
      this.messageService.add({ severity: "success", detail: message });
      this.getCategoriesData();
      this.showDialog = false;
    });
  }

  close() {
    this.showDialog = false;
  }

  public searchData(value: any): void {
    this.categoriesListData = this.originalData.filter((i) =>
      i.name.toLowerCase().includes(value.trim().toLowerCase())
    );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
  }
}
