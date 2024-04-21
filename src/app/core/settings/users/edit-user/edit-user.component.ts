import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { UsersdataService } from "../usersdata.service";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SharedModule } from "primeng/api";
import { MatRadioModule } from "@angular/material/radio";
import { MatTabsModule } from "@angular/material/tabs";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { routes } from "src/app/shared/routes/routes";
import { DropdownModule } from "primeng/dropdown";
import { CheckboxModule } from "primeng/checkbox";
import { MultiSelectModule } from 'primeng/multiselect';
import { WarehouseService } from "../../warehouse/warehouse.service";


@Component({
  selector: "app-edit-user",
  templateUrl: "./edit-user.component.html",
  styleUrls: ["./edit-user.component.scss"],
  standalone: true,
  imports: [
    SharedModule,
    MatTabsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatRadioModule,
    CommonModule,
    ReactiveFormsModule,  
    RouterModule,
    ToastModule,
    DropdownModule,
    CheckboxModule,
    MultiSelectModule
  ],
  providers: [MessageService],
})
export class EditUserComponent implements OnInit {
  public routes = routes;
  id = "";
  EditUserData: any;
  editUserGroup: UntypedFormGroup;
  data: any = null;
  wareHousedata:any = []

  ngOnInit(): void {
    this.UserEditData.GetUserDataByID(this.id).subscribe((resp: any) => {
      this.EditUserData = resp.data;
      this.patchForm();
    });

    this.service.getAllWarehouseList().subscribe((resp: any) => {
      this.wareHousedata = resp.data;
    })

  }

  constructor(
    private activeRoute: ActivatedRoute,
    private UserEditData: UsersdataService,
    private form: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private router: Router,
    private fb: UntypedFormBuilder,
    private messageService: MessageService,
    private service: WarehouseService
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
    this.editUserGroup = this.fb.group({
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
      address: ["", [Validators.pattern(new RegExp(/^.{1,50}$/))]],
      wareHouse:[''],
      adminCheckBox: [""],
      SalesmanCheckBox: [""],
      stockManagerCheckBox: [""],
    });
  }
  patchForm() {
    this.editUserGroup.patchValue({
      name: this.EditUserData[0].name,
      phoneNumber: this.EditUserData[0].phoneNumber,
      email: this.EditUserData[0].email,
      status: this.EditUserData[0].status,
      address: this.EditUserData[0].address,
      wareHouse: this.EditUserData[0].warehouse,
      adminCheckBox:
        this.EditUserData[0].role.indexOf("admin") != -1 ? true : false,
        SalesmanCheckBox:
        this.EditUserData[0].role.indexOf("Salesman") > -1 ? true : false,
        stockManagerCheckBox:
        this.EditUserData[0].role.indexOf("stockManager") > -1 ? true : false,
      isUserLocked: this.EditUserData[0].isUserLocked ? true : false,
    });
  }

  editUserForm() {
    const formData = this.editUserGroup.value;
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
      id: this.id,
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      role: _roles,
      status: formData.status,
      address: formData.address,
      wareHouse: formData.wareHouse,
    };
    console.log(payload);

    if (this.editUserGroup.value) {
      this.UserEditData.UpDateUserApi(this.id, payload).subscribe(
        (resp: any) => {
          if (resp) {
            if (resp.status === "success") {
              const message = "User has been updated";
              this.messageService.add({ severity: "success", detail: message });
              setTimeout(() => {
                this.router.navigate(["settings/users"]);
              }, 400);
            } else {
              const message = resp.message;
              this.messageService.add({ severity: "error", detail: message });
            }
          }
        }
      );
    } else {
      console.log("Form is invalid!");
    }
  }
}
