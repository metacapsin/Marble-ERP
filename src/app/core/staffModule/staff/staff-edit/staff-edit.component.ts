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
import { validationRegex } from "src/app/core/validation";

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

  maxDate = new Date();
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
    private StaffDesignationService: StaffDesignationService
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
      firstName: [
        "",
        [Validators.required, Validators.pattern(validationRegex.threeTothirtyCharRegex)],
      ],
      lastName: [
        "",
        [Validators.required, Validators.pattern(validationRegex.threeTothirtyCharRegex)],
      ],
      dateOfBirth: ["", [Validators.required, ageValidator]], // Apply the custom validator
      mobile: ["", [Validators.required, Validators.pattern(validationRegex.phoneRGEX)]],
      designation: ["", [Validators.required]],
      warehouseDetails: ["", Validators.required],
      email: ["", [Validators.pattern(validationRegex.emailRegex)]],
      idType: ["",],
      idNumber: [""],
      pinCode: ["", [Validators.pattern(validationRegex.pinCodeRegex)]],
      city: ["", [Validators.pattern(validationRegex.threeTothirtyCharRegex)]],
      upiId: ["", [Validators.pattern(validationRegex.upiIdRegex)]],
      bankName: ["", [Validators.pattern(validationRegex.threeToFiftyCharRegex)]],
      accountNumber: ["", [Validators.pattern(validationRegex.bankAccountNumberRegex)]],
      accountName: ["", [Validators.pattern(validationRegex.threeToFiftyCharRegex)]],
      ifscCode: ["", [Validators.pattern(validationRegex.ifscCodeRegexL)]],
      status: [],
      address: ["", [Validators.pattern(validationRegex.address3To500Regex)]],
      isActive: [""],
    });
    this.staffId = this.activeRoute.snapshot.params["id"];
  }

  idNumberValidator(event: any) {
    const idType = event?.value?.code;
    const idNumberControl = this.editStaffForm.get('idNumber');
    idNumberControl.reset();
    idNumberControl.clearValidators();

    if (idType) {
      switch (idType) {
        case 'Aadhaar':
          idNumberControl.setValidators([Validators.required, Validators.pattern(validationRegex.aadharRegex)]);
          break;
        case 'Passport':
          idNumberControl.setValidators([Validators.required, Validators.pattern(validationRegex.passportRegex)]);
          break;
        case 'PAN':
          idNumberControl.setValidators([Validators.required, Validators.pattern(validationRegex.panCardRegex)]);
          break;
        case 'VID':
          idNumberControl.setValidators([Validators.required, Validators.pattern(validationRegex.voterIdRegex)]);
          break;
        case 'SSN':
          idNumberControl.setValidators([Validators.required, Validators.pattern(validationRegex.ssnRegex)]);
          break;
        case 'DL':
          idNumberControl.setValidators([Validators.required, Validators.pattern(validationRegex.drivingLicenceRegex)]);
          break;
        case 'NID':
          idNumberControl.setValidators([Validators.required, Validators.pattern(validationRegex.nationalIdRegex)]);
          break;
        case 'RP':
          idNumberControl.setValidators([Validators.required, Validators.pattern(validationRegex.residentPermitRegex)]);
          break;
        default:
          break;
      }
    } else {
      idNumberControl.clearValidators();
    }
    idNumberControl.updateValueAndValidity();
  }

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
          name: element.name,
          code: element.code,
        })
      });
      console.log(this.IdTypeList);
    });
    this.StaffDesignationService.getStaffDesignation().subscribe((resp: any) => {
      this.orgStaffDesignation = resp.data;
      this.StaffDesignation = [];
      this.orgStaffDesignation.forEach((element) => {
        this.StaffDesignation.push({
          designation: element.designation,
          description: element.description
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
          const message = "Staff details updated successfully";
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
