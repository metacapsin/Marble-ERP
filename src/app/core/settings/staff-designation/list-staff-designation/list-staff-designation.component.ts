import { Component } from "@angular/core";
import { MessageService } from "primeng/api";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { StaffDesignationService } from "../staff-designation.service";

@Component({
  selector: "app-list-staff-designation",
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  templateUrl: "./list-staff-designation.component.html",
  styleUrl: "./list-staff-designation.component.scss",
})
export class ListStaffDesignationComponent {
  routes = routes;
  public dataSource: any = [];
  public originalData: any = [];
  staffDesignaiton = "";
  selectedStaffDesignation = [];
  searchDataValue: any;
  showDialoge = false;
  modalData: any = {};
  expenseId: any;
  ExpensesByID: any;
  ExpensesDataById: any;
  addStaffDesignationForm: FormGroup;
  editStaffDesignationForm: FormGroup;
  id: any;
  visible: boolean = false;
  visible1: boolean = false;

  descriptionRegex = /^.{3,500}$/s;
  cols: { field: string; header: string; }[];
  exportColumns: { title: string; dataKey: string; }[];

  constructor(
    private Service: StaffDesignationService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.addStaffDesignationForm = this.fb.group({
      designation: ["", [Validators.required]],
      description: ["", [Validators.pattern(this.descriptionRegex)]],
    });
    this.editStaffDesignationForm = this.fb.group({
      designation: ["", [Validators.required]],
      description: ["", [Validators.pattern(this.descriptionRegex)]],
    });
  }
  getStaffDesignationList() {
    this.Service.getStaffDesignation().subscribe((resp: any) => {
      this.dataSource = resp.data;
      this.originalData = resp.data;
      this.cols = [
        { field: "designation", header: "Designation" },
        { field: "description", header: "Description" },
        { field: "createdOn", header: "Created On" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
    });
  }

  ngOnInit() {
    this.getStaffDesignationList();
  }
  showDialog() {
    this.visible = true;
    this.addStaffDesignationForm.reset();
  }
  addCloseDialog() {
    this.visible = false;
  }
  closeDialogEdit() {
    this.visible1 = false;
  }
  showDialogEdit(id: any) {
    // this.editStaffDesignationForm.reset();
    this.visible1 = true;
    this.ExpensesByID = id;
    this.Service.getStaffDesignationById(id).subscribe((resp: any) => {
      this.patchValuesForm(resp.data);
    });
  }
  patchValuesForm(data: any) {
    this.editStaffDesignationForm.patchValue({
      designation: data.designation,
      description: data.description,
    });
  }
  // for delete api
  deleteStaffDesignation(Id: any) {
    this.expenseId = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Staff Designation",
    };
    this.showNewDialog();
  }
  showNewDialog() {
    this.showDialoge = true;
  }
  callBackModal() {
    this.Service.deleteStaffDesignationById(this.expenseId).subscribe(
      (resp: any) => {
        this.messageService.add({ severity: "success", detail: resp.message });
        this.getStaffDesignationList();
        this.close();
      }
    );
  }
  close() {
    this.showDialoge = false;
  }
  //

  public searchData(value: any): void {
    this.dataSource = this.originalData.filter((i) =>
      i.designation.toLowerCase().includes(value.trim().toLowerCase())
    );
  }
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.dataSource.slice(startIndex, endIndex);
  }

  addStaffDesignationFormsubmit() {
    const payload = {
      designation: this.addStaffDesignationForm.value.designation,
      description:
        this.addStaffDesignationForm.value.description,
    };
    if (this.addStaffDesignationForm.valid) {
      this.Service.CreateStaffDesignation(payload).subscribe((resp: any) => {
        this.visible = false;
        if (resp) {
          if (resp.status === "success") {
            const message = "Staff Designation has been added";
            this.messageService.add({ severity: "success", detail: message });
            this.getStaffDesignationList();
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    } else {
      console.log("Form is invalid");
    }
  }

  editStaffDesignationFormSubmit() {
    const payload = {
      id: this.ExpensesByID,
      designation: this.editStaffDesignationForm.value.designation,
      description:
        this.editStaffDesignationForm.value.description,
    };

    if (this.editStaffDesignationForm.valid) {
      this.Service.updateStaffDesignation(payload).subscribe(
        (resp: any) => {
          if (resp.status === "success") {
            this.closeDialogEdit();
            const message = "Staff Designation has been updated";
            this.messageService.add({ severity: "success", detail: message });
            this.getStaffDesignationList();
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      );
    } else {
      console.log("Form is invalid!");
    }
  }
}
