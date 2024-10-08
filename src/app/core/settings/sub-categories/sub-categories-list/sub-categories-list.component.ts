import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { RouterModule } from "@angular/router";
import { MessageService } from "primeng/api";
import { TableModule } from "primeng/table";
import { routes } from "src/app/shared/routes/routes";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { FormsModule } from "@angular/forms";
import { ConfirmDialogComponent } from "src/app/common-component/modals/confirm-dialog/confirm-dialog.component";
import { ShowHideDirective } from "src/app/common-component/show-hide-directive/show-hide.directive";
import { ToastModule } from "primeng/toast";
import { AddSubCategoriesComponent } from "../add-sub-categories/add-sub-categories.component";
import { EditSubCategoriesComponent } from "../edit-sub-categories/edit-sub-categories.component";
import { SubCategoriesService } from "../sub-categories.service";
import { FilterPipe } from "src/app/core/filter.pipe";
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: "app-sub-categories-list",
  templateUrl: "./sub-categories-list.component.html",
  styleUrl: "./sub-categories-list.component.scss",
  standalone: true,
  imports: [SharedModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MessageService],
})
export class SubCategoriesListComponent {
  public routes = routes;
  searchDataValue = "";
  selectedCategory = [];
  originalData: any = [];
  showDialog = false;
  modalData: any = {};
  subCategoryId: any;
  cols = [];
  exportColumns = [];
  // subCategoriesData = [
  //   {
  //     subCategoriesName: "Mobiles",
  //     subCategoriesSlug: ""
  //   },
  //   {
  //     subCategoriesName: "Computer",
  //     subCategoriesSlug: ""
  //   },
  //   {
  //     subCategoriesName: "Electrics",
  //     subCategoriesSlug: ""
  //   }
  // ]
  subCategoriesListData = [];

  constructor(
    public dialog: MatDialog,
    private service: SubCategoriesService,
    private messageService: MessageService
  ) {}

  openAddDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; // Prevent closing with escape key
    const dialogRef = this.dialog.open(AddSubCategoriesComponent,dialogConfig);
    dialogRef.afterClosed().subscribe((dialog) => {
      if (dialog === true) return;
      this.service.CreateSubCategories(dialog).subscribe((resp: any) => {
        if (resp.status === "success") {
          const message = "Sub Category has been added";
          this.messageService.add({ severity: "success", detail: message });
          this.getSubCategoriesData();
        } else {
          const message = resp.message;
          this.messageService.add({ severity: "error", detail: message });
        }
      });
    });
  }
  openEditDialog(Id: string) {
    if (!Id) return;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true; // Prevent closing with escape key
    dialogConfig.data = Id; // Pass ID to the dialog
    const dialogRef = this.dialog.open(EditSubCategoriesComponent,dialogConfig)

    dialogRef.afterClosed().subscribe((dialog) => {
      if (dialog === true) return;
      dialog.id = Id;
      this.service.updateSubCategories(dialog).subscribe((resp: any) => {
        if (resp.status === "success") {
          const message = "Sub Category has been updated";
          this.messageService.add({ severity: "success", detail: message });
          this.getSubCategoriesData();
        } else {
          const message = resp.message;
          this.messageService.add({ severity: "error", detail: message });
        }
      });
    });
  }

  ngOnInit() {
    this.getSubCategoriesData();
  }

  getSubCategoriesData() {
    this.service.getSubCategories().subscribe((resp: any) => {
      this.subCategoriesListData = resp.data;
      this.originalData = resp.data;
      
      this.cols = [
        { field: "name", header: "Name" },
        { field: "categoryId.name", header: "Category Name" },
        { field: "description", header: "Description" },
        { field: "createdOn", header: "Created On" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.subCategoriesListData.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
    });
  }

  deleteSubCategory(Id: any) {
    this.subCategoryId = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Sub Category",
    };
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service
      .deleteSubCategoriesById(this.subCategoryId)
      .subscribe((resp) => {
        const message = "Sub Category has been deleted";
        this.messageService.add({ severity: "success", detail: message });
        this.getSubCategoriesData();
        this.showDialog = false;
      });
  }

  close() {
    this.showDialog = false;
  }

  public searchData(value: any): void {
    this.subCategoriesListData = this.originalData.filter((i) =>
      i.name.toLowerCase().includes(value.trim().toLowerCase())
    );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.subCategoriesListData.slice(
      startIndex,
      endIndex
    );
  }
}
