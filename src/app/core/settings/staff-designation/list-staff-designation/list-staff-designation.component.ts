import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MessageService } from "primeng/api";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { AddStaffDesignationComponent } from "../add-staff-designation/add-staff-designation.component";
import { StaffDesignationService } from "../staff-designation.service";
import { EditStaffDesignationComponent } from "../edit-staff-designation/edit-staff-designation.component";

@Component({
  selector: 'app-list-staff-designation',
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  templateUrl: './list-staff-designation.component.html',
  styleUrl: './list-staff-designation.component.scss'
})
export class ListStaffDesignationComponent {
  public routes = routes;
  searchDataValue = "";
  selectedStaffDesignation = [];
  originalData: any = [];
  showDialog = false;
  modalData: any = {};
  staffDesignationId: any;
  staffDesignationListData = [];

  constructor(
    public dialog: MatDialog,
    public service: StaffDesignationService,
    private messageService: MessageService
  ) {}

  openAddDialog() {
    console.log(this.staffDesignationListData);

    const dialogRef = this.dialog.open(AddStaffDesignationComponent);
    dialogRef.afterClosed().subscribe((dialog) => {
      if (dialog === true) return;
      this.service.CreateStaffDesignation(dialog).subscribe((resp: any) => {
        if (resp.status === "success") {
          const message = "Staff Designation has been added";
          this.messageService.add({ severity: "success", detail: message });
          this.getStaffDesignationListData();
        } else {
          const message = resp.message;
          this.messageService.add({ severity: "error", detail: message });
        }
      });
    });
  }
  openEditDialog(staffDesignationId: string) {
    if (!staffDesignationId) return;
    const dialogRef = this.dialog.open(EditStaffDesignationComponent, {
      data: staffDesignationId,
    });

    dialogRef.afterClosed().subscribe((dialog) => {
      if (dialog === true) return;
      dialog.id = staffDesignationId;
      this.service.updateStaffDesignation(dialog).subscribe((resp: any) => {
        if (resp.status === "success") {
          const message = "Staff Designation has been updated";
          this.messageService.add({ severity: "success", detail: message });
          this.getStaffDesignationListData();
        } else {
          const message = resp.message;
          this.messageService.add({ severity: "error", detail: message });
        }
      });
    });
  }

  getStaffDesignationListData(): void {
    console.log(this.service);
    this.service.getStaffDesignation().subscribe((resp: any) => {
      this.staffDesignationListData = resp.data;
      this.originalData = resp.data;
      console.log("List Data",this.staffDesignationListData)
    });
  }

  ngOnInit() {
    this.getStaffDesignationListData();

  }

  deleteStaffDesignation(Id: any) {
    this.staffDesignationId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Staff Designation",
    };
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteStaffDesignationById(this.staffDesignationId).subscribe((resp) => {
      const message = "Staff Designation has been deleted";
      this.messageService.add({ severity: "success", detail: message });
      this.getStaffDesignationListData();
      this.showDialog = false;
    });
  }

  close() {
    this.showDialog = false;
  }

  public searchData(value: any): void {
    this.staffDesignationListData = this.originalData.filter((i) =>
      i.name.toLowerCase().includes(value.trim().toLowerCase())
    );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.staffDesignationListData.slice(startIndex, endIndex);
  }

}
