import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormGroup,
} from "@angular/forms";
import { MatTabsModule } from "@angular/material/tabs";
import { Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { SharedModule } from "src/app/shared/shared.module";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { UsersdataService } from "../usersdata.service";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { routes } from "src/app/shared/routes/routes";
import { DropdownModule } from "primeng/dropdown";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { CheckboxModule } from "primeng/checkbox";
import { MultiSelectModule } from "primeng/multiselect";
import { WarehouseService } from "../../warehouse/warehouse.service";

@Component({
  selector: "app-add-users",
  standalone: true,
  templateUrl: "./add-users.component.html",
  styleUrls: ["./add-users.component.scss"],
  imports: [SharedModule],
  providers: [MessageService],
})
export class AddUsersComponent implements OnInit {
  public routes = routes;
  addUserGroup: UntypedFormGroup;
  public passwordClass = false;
  wareHousedata: any = [];
  wareHouseLists = [];

  // Regex pattern

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  addressRegex = /^.{3,500}$/s;

  phoneRegex = /^[0-9]{10}$/;
  passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

  constructor(
    private fb: UntypedFormBuilder,
    private Addusersdata: UsersdataService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private service: WarehouseService
  ) {
    this.addUserGroup = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(this.nameRegex)]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(this.phoneRegex)],
      ],
      email: ["", [Validators.pattern(this.emailRegex)]],
      status: [""],
      password: [
        "",
        [Validators.required, Validators.pattern(this.passwordRegex)],
      ],
      address: [
        "",
        [Validators.required, Validators.pattern(this.addressRegex)],
      ],
      wareHouse: [""],
      adminCheckBox: [""],
      SalesmanCheckBox: [""],
      stockManagerCheckBox: [""],
      isUserLocked: [""],
      billingAddress: [''],
    });
  }
  ngOnInit(): void {
    this.service.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data;
      this.wareHouseLists = [];
      this.wareHousedata.forEach((element: any) => {
        this.wareHouseLists.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
          },
        });
        console.log(this.wareHouseLists);
      });
    });
  }

  cities = [
    { name: "New York", code: "NY" },
    { name: "Rome", code: "RM" },
    { name: "London", code: "LDN" },
    { name: "Istanbul", code: "IST" },
    { name: "Paris", code: "PRS" },
  ];

  addUserForm() {
    const formData = this.addUserGroup.value;
    console.log(formData);
    const _roles = ["admin"];
    if (formData.adminCheckBox) {
      _roles.push("admin");
    }
    if (formData.SalesmanCheckBox) {
      _roles.push("Salesman");
    }
    if (formData.stockManagerCheckBox) {
      _roles.push("stockManager");
    }
    if (!_roles.length) {
      const message = "Please select at least one role.";
      this.messageService.add({ severity: "error", detail: message });
      console.log("hi");
    } else {
      const payload = {
        warehouse: formData.wareHouse,
        role: _roles,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        status: true,
        password: formData.password,
        address: formData.address,
        isUserLocked: formData.isUserLocked,
        billingAddress: formData.billingAddress,
      };

      console.log(payload);

      this.Addusersdata.AddUserdata(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "User has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["settings/users"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }
  }

  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
}
