import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ButtonModule } from "primeng/button";
import { DialogModule } from "primeng/dialog";
import { TableModule } from "primeng/table";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { UnitsService } from "../units.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-units-list",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToastModule,
  ],
  templateUrl: "./units-list.component.html",
  styleUrl: "./units-list.component.scss",
  providers: [MessageService],
})
export class UnitsListComponent {
  public routes = routes;
  addUnitForm!: FormGroup;
  editUnitForm!: FormGroup;
  showDialog = false;
  modalData: any = {};
  unitID: any;
  unitByID: any;
  addvisible: boolean = false;
  editvisible: boolean = false;

  searchDataValue = "";
  selectedUnit = "";
  unitListData = [];
  unitDataById = [];
  originalData = [];

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;
  shortNameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{1,10})$/;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private Service: UnitsService
  ) {
    this.addUnitForm = this.fb.group({
      unitName: ["", [Validators.required, Validators.pattern(this.nameRegex)]],
      shortName: [
        "",
        [Validators.required, Validators.pattern(this.shortNameRegex)],
      ],
    });
    this.editUnitForm = this.fb.group({
      unitName: ["", [Validators.required, Validators.pattern(this.nameRegex)]],
      shortName: [
        "",
        [Validators.required, Validators.pattern(this.shortNameRegex)],
      ],
    });
  }

  openAddDialog() {
    this.addUnitForm.reset();
    this.addvisible = true;
  }
  openEditDialog(_id: any) {
    this.unitByID = _id;
    this.editvisible = true;
    this.Service.getUnitById(_id).subscribe((resp: any) => {
      this.unitDataById = resp.data;
      this.patchValuesForm(this.unitDataById);
    });
  }

  ngOnInit(): void {
    this.getUnitList();
  }
  getUnitList() {
    this.Service.getAllUnitList().subscribe((resp: any) => {
      this.unitListData = resp.data;
      this.originalData = resp.data;
    });
  }

  deleteUnit(Id: any) {
    this.unitID = Id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Unit Details",
    };
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.Service.deleteUnitById(this.unitID).subscribe((resp) => {
      const message = "Tax Details has been deleted";
      this.messageService.add({ severity: "success", detail: message });
      this.getUnitList();
      this.showDialog = false;
    });
  }

  close() {
    this.showDialog = false;
  }

  patchValuesForm(data: any) {
    this.editUnitForm.patchValue({
      unitName: data.unitName,
      shortName: data.shortName,
    });
  }

  public searchData(value: any): void {
    this.unitListData = this.originalData.filter((i) =>
      i.unitName.toLowerCase().includes(value.trim().toLowerCase())
    );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.unitListData.slice(startIndex, endIndex);
  }

  addUnitFormSubmit() {
    if (this.addUnitForm.valid) {
      this.Service.CreateUnit(this.addUnitForm.value).subscribe((resp: any) => {
        if (resp.status === "success") {
          this.addvisible = false;
          const message = "Unit has been added";
          this.messageService.add({ severity: "success", detail: message });
          this.getUnitList();
        } else {
          const message = resp.message;
          this.messageService.add({ severity: "error", detail: message });
        }
      });
    } else {
      console.log("Form is invalid!");
    }
  }

  editUnitFormSubmit() {
    if (this.editUnitForm.valid) {
      this.editUnitForm.value.id = this.unitByID;
      this.Service.updateUnitById(this.editUnitForm.value).subscribe(
        (resp: any) => {
          if (resp.status === "success") {
            this.editvisible = false;
            const message = "Unit has been updated";
            this.messageService.add({ severity: "success", detail: message });
            this.getUnitList();
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
