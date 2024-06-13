import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { staffService } from "../staff.service";
import { MessageService } from "primeng/api";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
interface data {
  value: string;
}
@Component({
  selector: "app-edit-staff",
  templateUrl: "./edit-staff.component.html",
  styleUrls: ["./edit-staff.component.scss"],
  providers: [MessageService],
})
export class EditStaffComponent {
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
  // warehouseDetails = [
  //   { name: "bijainagar" },
  //   { name: "gulabpura" },
  //   { name: "kisangarh" },
  // ];
  personNameRegex = /^(?! )[A-Za-z](?:[A-Za-z ]{0,28}[A-Za-z])?$/;
  AddressRegex = /^(?! )[A-Za-z]{3,100}(?: [A-Za-z]{3,100})?$/;
  AccountNumberRegex = /^[0-9]{14}$/;
  phoneRegex = /^[0-9]{10}$/;
  IfscCodeRegex = /^[0-9]{11}$/;
  pinRegex = /^\d{6}$/;
  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";
  constructor(
    private fb: FormBuilder,
    private Service: staffService,
    private messageService: MessageService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private warehouseService: WarehouseService
  ) {
    this.editStaffForm = this.fb.group({
      upiId: ["", [Validators.pattern(this.personNameRegex)]],
      dateOfBirth: ["", Validators.required],
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
      city: ["", [Validators.required, Validators.pattern(this.AddressRegex)]],
      address: ["", [Validators.pattern(this.AddressRegex)]],
      bankName: ["", [Validators.pattern(this.AddressRegex)]],
      accountName: ["", [Validators.pattern(this.AddressRegex)]],
      accountNumber: ["", [Validators.pattern(this.AccountNumberRegex)]],
      ifscCode: ["", [Validators.pattern(this.IfscCodeRegex)]],
    });
    this.staffId = this.activeRoute.snapshot.params["id"];
  }

  // }

  ngOnInit(): void {
    this.Service.getStaffDataById(this.staffId).subscribe((resp: any) => {
      this.staffDataById = resp;
      console.log("resp dta", resp);
      this.patchForm(resp);
    })
    this.warehouseService.getAllWarehouseList().subscribe((resp: any) => {
      this.warehouseDetails = resp.data;
    })
  }

  patchForm(data) {
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
      mobile: data.mobile,
      pinCode: data.pinCode,
      upiId: data.upiId,
      warehouseDetails: data.warehouseDetails,
    });
  }

  editStaffFormSubmit() {
    console.log(this.editStaffForm.value)
    const payload = {
      id:this.staffId,
      firstName: this.editStaffForm.value.firstName,
      lastName: this.editStaffForm.value.lastName,
      dateOfBirth: this.editStaffForm.value.dateOfBirth,
      email: this.editStaffForm.value.email,
      mobile:this.editStaffForm.value.mobile,
      warehouseDetails:this.editStaffForm.value.warehouseDetails,
      designation: this.editStaffForm.value.designation,
      city: this.editStaffForm.value.city,
      pinCode: this.editStaffForm.value.pinCode,
      address: this.editStaffForm.value.address,
      upiId: this.editStaffForm.value.upiId,
      bankName: this.editStaffForm.value.bankName,
      accountName: this.editStaffForm.value.accountName,
      accountNumber: this.editStaffForm.value.accountNumber,
      ifscCode: this.editStaffForm.value.ifscCode,
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
              this.router.navigate(["/staff/staff-list"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
  }

}
