import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { routes } from "src/app/shared/routes/routes";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { ToastModule } from "primeng/toast";
import { DialogModule } from "primeng/dialog";
import { TabViewModule } from "primeng/tabview";
import { staffService } from "../staff-service.service";

@Component({
  selector: "app-staff-list",
  templateUrl: "./staff-list.component.html",
  styleUrls: ["./staff-list.component.scss"],
  standalone: true,
  imports: [CommonModule, 
    SharedModule, 
    DropdownModule, 
    CalendarModule, ToastModule, DialogModule,TabViewModule,],
    providers: [MessageService]
})
export class StaffListComponent {
  public routes = routes;
  originalData = [];
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
      this.showDialoge = false;
      this.getStaffData();
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
      this.originalData = resp;
      console.log("Staff data", resp);
    });
  }
  ngOnInit(): void {
    this.getStaffData();
  }
  public searchData(value: any): void {
    this.staffData = this.originalData.filter(i =>
    i.firstName.toLowerCase().includes(value.trim().toLowerCase())
  );
  }
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows; 
    const currentPageData = this.staffData.slice(startIndex, endIndex);
  }
}
