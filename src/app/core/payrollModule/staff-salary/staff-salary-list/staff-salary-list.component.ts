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
import { StaffSalaryService } from "../staff-salary.service";
import { FilterPipe } from "src/app/core/filter.pipe";
@Component({
  selector: "app-staff-salary-list",
  providers: [MessageService],
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: "./staff-salary-list.component.html",
  styleUrl: "./staff-salary-list.component.scss",
})
export class StaffSalaryListComponent {
  public routes = routes;
  public searchDataValue = "";
  selectedsalary = "";
  salaryId: any;
  showDialoge = false;
  modalData: any = {};
  salaryData = [];
  visible: boolean = false;
  originalData = [];
  cols = [];
  exportColumns = [];

  constructor(
    private messageService: MessageService,
    private router: Router,
    public dialog: MatDialog,
    public service: StaffSalaryService
  ) {}

  deleteSalaryList(Id: any) {
    this.salaryId = Id;

    console.log("ID", this.salaryId);

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Employee Salary details",
    };
    this.showDialoge = true;
  }

  showNewDialog() {
    this.showDialoge = true;
  }
  callBackModal() {
    this.service
      .deleteEmployeeSalaryData(this.salaryId)
      .subscribe((resp: any) => {
        this.messageService.add({ severity: "success", detail: resp.message });
        this.getEmployeeSalaryData();
        this.showDialoge = false;
      });
  }

  close() {
    this.showDialoge = false;
  }
  editSalary(id: any) {
    this.router.navigate([`/staff-salary/edit-staff-salary/${id}`]);
  }
  getEmployeeSalaryData() {
    this.service.getEmployeeSalaryData().subscribe((resp: any) => {
      this.salaryData = resp;
      this.originalData = resp;
      this.cols = [
        { field: "employee.name", header: "Employee Name" },
        { field: "basicSalary", header: "Basic Salary" },
        { field: "netSalary", header: "Net Salary" },
        { field: "lta", header: "LTA" },
        { field: "hra", header: "HRA" },
        { field: "deductions", header: "Deductions" },
        { field: "createdOn", header: "Created On" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.salaryData.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
      console.log("salary data", resp);
    });
  }

  ngOnInit(): void {
    this.getEmployeeSalaryData();
  }
  public searchData(value: any): void {
    this.salaryData = this.originalData.filter((i) =>
      i.employee.name.toLowerCase().includes(value.trim().toLowerCase())
    );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.salaryData.slice(startIndex, endIndex);
  }
}
