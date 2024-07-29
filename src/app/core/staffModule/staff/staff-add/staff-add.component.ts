import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { staffService } from "../staff-service.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { routes } from "src/app/shared/routes/routes";
import { Router } from "@angular/router";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
import { StaffDesignationService } from "src/app/core/settings/staff-designation/staff-designation.service";

@Component({
  selector: "app-staff-add",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./staff-add.component.html",
  styleUrl: "./staff-add.component.scss",
  providers: [MessageService],
})
export class StaffAddComponent {
  public routes = routes;
  addStaffForm!: FormGroup;
  public selectedValue!: string;
  maxDate = new Date();
  Designation = [
    { value: "Labor" },
    { value: "Gaurd" },
    { value: "Accountant" },
    { value: "Sales Manager" },
    { value: "Transporter" },
    { value: "Marketing Manager" },
  ];
  idType = [{ value: "Labor" }, { value: "Gaurd" }];
  warehouseData = [];
  personNameRegex = /^(?! )[A-Za-z](?:[A-Za-z ]{0,28}[A-Za-z])?$/;
  phoneRegex = /^[0-9]{10}$/;
  emailRegex = "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  REGX_For_UID = /^[\w.-]+@[\w.-]+$/;
  pinRegex = /^\d{6}$/;
  upiIdRegex = /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z]{2,64}$/;
  BankName = /^[A-Za-z\s]+$/;
  password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@])[A-Za-z\d@]{8,16}$/;
  AddressRegex = /^(?! )[A-Za-z]{3,100}(?: [A-Za-z]{3,100})?$/;
  accountHolderRegex = /^[A-Za-z\s]{3,20}$/;
  AccountNumberRegex = /^\d{9,18}$/;
  IfscCodeRegex = /^[^\s]{4}\d{7}$/;
  addressRegex = /^(?!\s)(?:.{3,500})$/;
  IdTypeList: any;
  orgIdTypeList: any;
  orgWarehouseData: any;
  orgStaffDesignation: any;
  StaffDesignation: any[];

  constructor(
    private fb: FormBuilder,
    private service: staffService,
    private messageService: MessageService,
    private router: Router,
    private warehouseService: WarehouseService,
    private StaffDesignationService:StaffDesignationService
  ) {
    this.addStaffForm = this.fb.group({
      upiId: ["", [Validators.pattern(this.REGX_For_UID)]],
      dateOfBirth: [""],
      idNumber: [""],
      idType: [""],
      status: [],
      warehouseDetails: ["", Validators.required],
      firstName: [
        "",
        [Validators.required, Validators.pattern(this.personNameRegex)],
      ],
      lastName: [
        "",
        [Validators.required, Validators.pattern(this.personNameRegex)],
      ],
      mobile: ["", [Validators.required, Validators.pattern(this.phoneRegex)]],
      email: ["", [Validators.pattern(this.emailRegex)]],
      pincode: ["", [, Validators.pattern(this.pinRegex)]],
      designation: ["", [Validators.required]],
      city: ["", [, Validators.pattern(this.personNameRegex)]],
      address: ["", [Validators.pattern(this.addressRegex)]],
      bankName: ["", [Validators.pattern(this.BankName)]],
      accountName: ["", [Validators.pattern(this.accountHolderRegex)]],
      accountNumber: ["", [Validators.pattern(this.AccountNumberRegex)]],
      ifscCode: ["", [Validators.pattern(this.IfscCodeRegex)]],
      isActive: [""],
    });
  }

  ngOnInit(): void {
    this.warehouseService.getAllWarehouseList().subscribe((resp: any) => {
      this.orgWarehouseData = resp.data;
      this.warehouseData = [];
      this.orgWarehouseData.forEach((element) => {
        this.warehouseData.push({
          name: element.name,
          _id: element._id,
        });
      });
    });
    this.service.getIdTypeList().subscribe((resp: any) => {
      this.orgIdTypeList = resp.data;
      this.IdTypeList = [];
      this.orgIdTypeList.forEach((element) => {
        this.IdTypeList.push({
          name: element.name,
          code: element.code,
        });
      });
      console.log(this.IdTypeList);
    });
    this.StaffDesignationService.getStaffDesignation().subscribe((resp: any) => {
      this.orgStaffDesignation = resp.data;
      this.StaffDesignation = [];
      this.orgStaffDesignation.forEach((element)=>{
        this.StaffDesignation.push({
          designation:element.designation,
          description:element.description
        })
      })
      console.log(this.orgStaffDesignation);
    });

  }

  addStaffFormSubmit() {
    const formData = this.addStaffForm.value;

    const paylode = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      dateOfBirth: formData.dateOfBirth,
      mobile: formData.mobile,
      designation: formData.designation,
      warehouseDetails: formData.warehouseDetails,
      pinCode: formData.pincode,
      city: formData.city,
      email: formData.email,
      upiId: formData.upiId,
      idNumber: formData.idNumber,
      bankName: formData.bankName,
      accountName: formData.accountName,
      accountNumber: formData.accountNumber,
      ifscCode: formData.ifscCode,
      address: formData.address,
      idType: formData.idType,
      isActive: formData.isActive,
    };
    console.log("Form is valid", this.addStaffForm.value);
    if (this.addStaffForm.valid) {
      console.log("Form is valid", this.addStaffForm.value);
      this.service.addStaffData(paylode).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            const message = "Staff has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/staff"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    } else {
      console.log("Form is inValid!");
    }
  }
}
