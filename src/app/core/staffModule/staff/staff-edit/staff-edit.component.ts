import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { ToastModule } from "primeng/toast";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { staffService } from "../staff-service.service";
import { MessageService } from "primeng/api";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
import { StaffDesignationService } from "src/app/core/settings/staff-designation/staff-designation.service";

@Component({
  selector: "app-staff-edit",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./staff-edit.component.html",
  styleUrl: "./staff-edit.component.scss",
  providers: [MessageService],
})
export class StaffEditComponent {
  public routes = routes;
  public deleteIcon = true;
  editStaffForm!: FormGroup;
  staffId: any;
  staffDataById = [];
  warehouseDetails = [];

  Designation = [
    { value: "Select  Designation" },
    { value: "Labor" },
    { value: "Gaurd" },
    { value: "Accountant" },
    { value: "Sales Manager" },
    { value: "Transporter" },
    { value: "Marketing Manager" },
  ];
  idType = [
    { value: "Labor" },
    { value: "Gaurd" },
  ];
  // personNameRegex = /^(?! )[A-Za-z](?:[A-Za-z ]{0,28}[A-Za-z])?$/;
  // AddressRegex = /^(?! )[A-Za-z]{3,100}(?: [A-Za-z]{3,100})?$/;
  // AccountNumberRegex = /^[0-9]{14}$/;
  // phoneRegex = /^[0-9]{10}$/;
  // IfscCodeRegex = /^[0-9]{11}$/;
  // pinRegex = /^\d{6}$/;
  maxDate = new Date();
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
  orgIdTypeList: any;
  IdTypeList: any[];
  warehouseData: any;
  orgWarehouseData: any;
  orgStaffDesignation: any;
  StaffDesignation: any[];
  constructor(
    private fb: FormBuilder,
    private Service: staffService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private warehouseService: WarehouseService,
    private StaffDesignationService:StaffDesignationService
  ) {
     // Define the age validator function
     const ageValidator: ValidatorFn = (control: AbstractControl): { [key: string]: any } | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }
      
      const dob = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const month = today.getMonth() - dob.getMonth();
      
      if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
        age--;
      }

      return age >= 18 ? null : { 'ageInvalid': { value: control.value } };
    };


    this.editStaffForm = this.fb.group({
      upiId: ["", [Validators.pattern(this.REGX_For_UID)]],
      dateOfBirth: ["", [Validators.required,ageValidator]], // Apply the custom validator
      idNumber: ["", Validators.required],
      status: ["",],
      idType: ["", Validators.required],
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
      pinCode: ["", [Validators.required, Validators.pattern(this.pinRegex)]],
      designation: ["", [Validators.required]],
      city: [
        "",
        [Validators.required, Validators.pattern(this.personNameRegex)],
      ],
      address: ["", [Validators.pattern(this.addressRegex)]],
      bankName: ["", [Validators.pattern(this.BankName)]],
      accountName: ["", [Validators.pattern(this.accountHolderRegex)]],
      accountNumber: ["", [Validators.pattern(this.AccountNumberRegex)]],
      ifscCode: ["", [Validators.pattern(this.IfscCodeRegex)]],
      isActive:[''],
    });
    this.staffId = this.activeRoute.snapshot.params["id"];
  }

  // }

  ngOnInit(): void {
    this.Service.getStaffDataById(this.staffId).subscribe((resp: any) => {
      this.staffDataById = resp;
      console.log("resp dta", resp);
      this.patchForm(resp);
    });
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
    this.Service.getIdTypeList().subscribe((resp: any) => {
      this.orgIdTypeList = resp.data;
      this.IdTypeList = [];
      this.orgIdTypeList.forEach(element => {
        this.IdTypeList.push({
          name:element.name,
          code:element.code,
        })
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

  patchForm(data) {
    console.log(data);
    this.editStaffForm.patchValue({
      accountName: data.accountName,
      accountNumber: data.accountNumber,
      address: data.address,
      bankName: data.bankName,
      city: data.city,
      dateOfBirth: data.dateOfBirth,
      designation: data.designation,
      email: data.email,
      firstName: data.firstName,
      ifscCode: data.ifscCode,
      lastName: data.lastName,
      idType: data.idType,
      status: data.status,
      idNumber: data.idNumber,
      mobile: data.mobile,
      pinCode: data.pinCode,
      upiId: data.upiId,
      isActive: data.isActive,
      warehouseDetails: data.warehouseDetails,
    });
  }

  editStaffFormSubmit() {
    console.log(this.editStaffForm.value);
    const payload = {
      id: this.staffId,
      firstName: this.editStaffForm.value.firstName,
      lastName: this.editStaffForm.value.lastName,
      dateOfBirth: this.editStaffForm.value.dateOfBirth,
      email: this.editStaffForm.value.email,
      mobile: this.editStaffForm.value.mobile,
      warehouseDetails: this.editStaffForm.value.warehouseDetails,
      designation: this.editStaffForm.value.designation,
      city: this.editStaffForm.value.city,
      pinCode: this.editStaffForm.value.pinCode,
      address: this.editStaffForm.value.address,
      upiId: this.editStaffForm.value.upiId,
      bankName: this.editStaffForm.value.bankName,
      accountName: this.editStaffForm.value.accountName,
      accountNumber: this.editStaffForm.value.accountNumber,
      ifscCode: this.editStaffForm.value.ifscCode,
      idNumber: this.editStaffForm.value.idNumber,
      idType: this.editStaffForm.value.idType,
      isActive: this.editStaffForm.value.isActive,
    };
    //  if (this.editStaffForm.valid) {
    console.log("valid form");
    console.log(payload);
    this.Service.updateStaffData(payload).subscribe((resp: any) => {
      console.log(resp);
      if (resp) {
        if (resp.status === "success") {
          const message = "Sales has been updated";
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
  }
}
