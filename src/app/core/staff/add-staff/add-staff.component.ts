import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { routes } from "src/app/shared/routes/routes";
import { staffService } from "../staff.service";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
interface data {
  value: string;
}
@Component({
  selector: "app-add-staff",
  templateUrl: "./add-staff.component.html",
  styleUrls: ["./add-staff.component.scss"],
})
export class AddStaffComponent {
  public routes = routes;
  addStaffForm!: FormGroup;
  public selectedValue!: string;

  Designation = [
    { value: "Select  Designation" },
    { value: "Labor" },
    { value: "Gaurd" },
    { value: "Accountant" },
    { value: "Sales Manager" },
    { value: "Transporter" },
    { value: "Marketing Manager" },
  ];
  warehouseData = [];
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
    private service: staffService,
    private messageService: MessageService,
    private router: Router,
    private warehouseService: WarehouseService
  ) {
    this.addStaffForm = this.fb.group({
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
      pincode: ["", [Validators.required, Validators.pattern(this.pinRegex)]],
      designation: ["", [Validators.required]],
      city: ["", [Validators.required, Validators.pattern(this.AddressRegex)]],
      address: ["", [Validators.pattern(this.AddressRegex)]],
      bankName: ["", [Validators.pattern(this.AddressRegex)]],
      accountName: ["", [Validators.pattern(this.AddressRegex)]],
      accountNumber: ["", [Validators.pattern(this.AccountNumberRegex)]],
      ifscCode: ["", [Validators.pattern(this.IfscCodeRegex)]],
    });
  }

  ngOnInit(): void {
    this.warehouseService.getAllWarehouseList().subscribe((resp: any) => {
      this.warehouseData = resp.data;
    });
  }

  addStaffFormSubmit() {
    debugger;
    console.log(this.addStaffForm.value);
    const paylode = {
      firstName: "kavya",
      lastName: "Choudhary",
      dateOfBirth: "30-09-2003",
      email: "test@gmail.com",
      mobile: 999999999,
      warehouseDetails: {
        _id: "123",
        name: "test",
      },
      designation: "test",
      city: "jaipur",
      pinCode: "302029",
      address: "sanganer",
      upiId: "235254364@ypl",
      bankName: "Sbi",
      accountName: "Vishnu Choudhary",
      accountNumber: 23865265932,
      ifscCode: "SBINOO1234",
    };
    if (this.addStaffForm.valid) {
      console.log("Form is valid", this.addStaffForm.value);
      this.service.addStaffData(paylode).subscribe((resp: any) => {
        console.log(resp);
        debugger;
        if (resp) {
          if (resp.status === "success") {
            const message = "Staff has been added";
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
    } else {
      console.log("Form is inValid!");
    }
  }
}
