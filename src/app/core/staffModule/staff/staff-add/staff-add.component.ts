import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { staffService } from "../staff-service.service";
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from "@angular/forms";
import { routes } from "src/app/shared/routes/routes";
import { Router } from "@angular/router";
import { WarehouseService } from "src/app/core/settings/warehouse/warehouse.service";
import { StaffDesignationService } from "src/app/core/settings/staff-designation/staff-designation.service";
import { validationRegex } from "src/app/core/validation";
import { A } from "@fullcalendar/core/internal-common";

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
    private StaffDesignationService: StaffDesignationService
  ) {
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


    this.addStaffForm = this.fb.group({
      firstName: [
        "",
        [Validators.required, Validators.pattern(validationRegex.nameREGEX)],
      ],
      lastName: [
        "",
        [Validators.required, Validators.pattern(validationRegex.nameREGEX)],
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
      upiId: ["", [Validators.pattern(/^[a-zA-Z0-9._%+!\-]{2,256}@[a-zA-Z0-9.-]{2,64}$/)]],
      bankName: ["", [Validators.pattern(validationRegex.threeToFiftyCharRegex)]],
      accountNumber: ["", [Validators.pattern(validationRegex.bankAccountNumberRegex)]],
      accountName: ["", [Validators.pattern(validationRegex.threeToFiftyCharRegex)]],
      ifscCode: ["", [Validators.pattern(validationRegex.ifscCodeRegexL)]],
      status: [],
      address: ["", [Validators.pattern(validationRegex.address3To500Regex)]],
      isActive: [""],
    });
  }

  idNumberValidator(event: any) {
    const idType = event?.value?.code;
    const idNumberControl = this.addStaffForm.get('idNumber');

    console.log("event", event);

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
      this.orgStaffDesignation.forEach((element) => {
        this.StaffDesignation.push({
          designation: element.designation,
          description: element.description
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
      pinCode: formData.pinCode,
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
      isActive: true,
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
