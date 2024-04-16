import { Component } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
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

@Component({
  selector: "app-add-users",
  standalone: true,
  templateUrl: "./add-users.component.html",
  styleUrls: ["./add-users.component.scss"],
  imports: [
    SharedModule,
    MatTabsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    CommonModule,
    DropdownModule,
    ToastModule,
    CheckboxModule,
    MultiSelectModule,
  ],
  providers: [MessageService],
})
export class AddUsersComponent {
  public routes = routes;
  addUserGroup: UntypedFormGroup;
  public passwordClass = false;

  constructor(
    private fb: UntypedFormBuilder,
    private Addusersdata: UsersdataService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) {
    this.addUserGroup = this.fb.group({
      name: [
        "",
        [Validators.required, Validators.pattern(new RegExp(/^.{1,50}$/))],
      ],
      phoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(
            new RegExp(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
          ),
        ],
      ],
      email: ["", [Validators.required, Validators.email]],
      status: ["", [Validators.pattern(new RegExp(/^.{1,50}$/))]],
      password: [
        "",
        [Validators.required, Validators.pattern(new RegExp(/^.{5,50}$/))],
      ],
      address: ["", [Validators.required, Validators.pattern(new RegExp(/^.{2,50}$/))]],
      wareHouse: ["", [Validators.required]],
      adminCheckBox: [""],
      SalesmanCheckBox: [""],
      stockManagerCheckBox: [""],
      isUserLocked:['']
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
    const _roles = [];
    if (formData.adminCheckBox) {
      _roles.push("admin");
    }
    if (formData.SalesmanCheckBox) {
      _roles.push("Salesman");
    }
    if (formData.stockManagerCheckBox) {
      _roles.push("stockManager");
    }
    const payload = {
      // name: formData.name,
      // phoneNumber: formData.phoneNumber,
      // email: formData.email,
      // password: formData.password,
      // role: _roles,
      // status: formData.status.name,
      // address: formData.address,
      // wareHouse: formData.wareHouse.name,

      warehouse: [
        {
          id: "jgg",
          name: formData.name,
        },
      ],

      role: _roles,
      name: formData.name,
      phoneNo: formData.phoneNumber,
      email: formData.email,
      status: true,
      password: formData.password,
      address: formData.address,
      isUserLocked: formData.isUserLocked,
    };
    // set = {
    //   warehouse: [
    //     {
    //       id: "jgg",

    //       name: "Test Ware",
    //     },
    //   ],

    //   role: ["admin"],

    //   name: "Test Admin",

    //   phoneNo: "67668",

    //   email: "test@test1.com",

    //   status: true,

    //   password: "admin@123",

    //   address: "test address",

    //   isUserLocked: false,
    // };
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
  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
}
