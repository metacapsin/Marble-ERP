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
import { FilterPipe } from "src/app/core/filter.pipe";

@Component({
  selector: "app-staff-list",
  templateUrl: "./staff-list.component.html",
  styleUrls: ["./staff-list.component.scss"],
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
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
  cols = [];
  exportColumns = [];

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
      messege: "Are you sure you want to delete this Staff Details.",
    };
    this.showDialoge = true;
  }
  showNewDialog() {
    this.showDialoge = true;
  }
  callBackModal() {
    this.service.deleteStaffData(this.staffId).subscribe((resp: any) => {
      const message = 'Staff details deleted successfully.';
      this.messageService.add({ severity: "success", detail: message });
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
      this.staffData = [];
      this.originalData = resp;
      this.staffData = resp.map((element) => {
        console.log(element);
        return {
          ...element,
          statusText: element.isActive ? "Active" : "Inactive",
        };
      });

      this.cols = [
        { field: "firstName", header: "First Name" },
        { field: "lastName", header: "Last Name" },
        { field: "mobile", header: "Mobile" },
        { field: "city", header: "City" },
        { field: "pinCode", header: "Pin Code" },
        { field: "address", header: "Address" },
        { field: "statusText", header: "Status" },
        { field: "email", header: "Email" },
        { field: "upiId", header: "UpiId" },
        { field: "ifscCode", header: "IFSC Code" },
        { field: "idType.name", header: "Id Type" },
        { field: "idNumber", header: "Id Number" },
        { field: "designation.designation", header: "Designation" },
        { field: "warehouseDetails.name", header: "Warehouse Details" },
        { field: "createdOn", header: "Created On" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.staffData.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
      console.log("Staff data", resp);
    });
  }
  ngOnInit(): void {
    this.getStaffData();
  }
  public searchData(value: any): void {
    this.staffData = this.originalData.filter((i) =>
      i.firstName.toLowerCase().includes(value.trim().toLowerCase())
    );
  }
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.staffData.slice(startIndex, endIndex);
  }
}
