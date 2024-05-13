import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { routes } from "src/app/shared/routes/routes";
import { CustomersdataService } from "../../Customers/customers.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ToastModule } from "primeng/toast";
import { DialogModule } from "primeng/dialog";
import { TabViewModule } from "primeng/tabview";
import { staffService } from "../staff.service";
@Component({
  selector: "app-staff-list",
  templateUrl: "./staff-list.component.html",
  styleUrls: ["./staff-list.component.scss"],
})
export class StaffListComponent {
  public routes = routes;

  public searchDataValue = "";
  selectedstaff = "";
  staffId: any;
  showDialoge = false;
  modalData: any = {};
  visible: boolean = false;
  staffData = [];

  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    private service: staffService
  ) {}

  deleteStaff(Id: any) {
    this.staffId = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this staff list Details",
    };
    this.showDialoge = true;
  }
  showNewDialog() {
    this.showDialoge = true;
  }
  callBackModal() {
    this.service.deleteStaffData(this.staffId).subscribe((resp: any) => {
      this.messageService.add({ severity: "success", detail: resp.message });
      this.getStaffData();
      this.showDialoge = false;
    });
  }
  close() {
    this.showDialoge = false;
  }

  editStaff(id: any) {
    this.router.navigate([`/staff/edit-staff/${id}`]);
  }
  getStaffData() {
    this.service.getStaffData().subscribe((resp: any) => {
      this.staffData = resp;
      console.log("Staff data", resp);
    });
  }
  ngOnInit(): void {
    this.getStaffData();
  }
}
