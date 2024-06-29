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
import { MultiSelectModule } from "primeng/multiselect";
import { WarehouseService } from "../../warehouse/warehouse.service";
import { ShowHideDirective } from "src/app/common-component/show-hide-directive/show-hide.directive";

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
    MultiSelectModule,
    ShowHideDirective
  ],
  providers: [MessageService],
})
export class EditUserComponent implements OnInit {
  public routes = routes;
  id = "";
  EditUserData: any;
  editUserGroup: UntypedFormGroup;
  data: any = null;
  wareHousedata: any = [];
  wareHouseLists = [];

  ngOnInit(): void {
    this.UserEditData.GetUserDataByID(this.id).subscribe((resp: any) => {
      this.EditUserData = resp.data;
      this.patchForm();
    });

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

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  emailRegex: string = '^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  
  addressRegex = /^.{3,500}$/s;

  phoneRegex = /^[0-9]{10}$/;

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
      name: ["", [Validators.required, Validators.pattern(this.nameRegex)]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(this.phoneRegex)],
      ],
      email: ["", [Validators.pattern(this.emailRegex)]],
      status: [""],
      address: [
        "",
        [Validators.required, Validators.pattern(this.addressRegex)],
      ],
      warehouse: [""],
      adminCheckBox: [""],
      SalesmanCheckBox: [""],
      stockManagerCheckBox: [""],
    });
  }
  patchForm() {
    this.editUserGroup.patchValue({
      name: this.EditUserData.name,
      phoneNumber: this.EditUserData.phoneNumber,
      email: this.EditUserData.email,
      status: this.EditUserData.status,
      address: this.EditUserData.address,
      warehouse: this.EditUserData.warehouse,
      adminCheckBox:
        this.EditUserData.role.indexOf("admin") != -1 ? true : false,
      SalesmanCheckBox:
        this.EditUserData.role.indexOf("Salesman") > -1 ? true : false,
      stockManagerCheckBox:
        this.EditUserData.role.indexOf("stockManager") > -1 ? true : false,
      isUserLocked: this.EditUserData.isUserLocked ? true : false,
    });
  }

  editUserForm() {
    const formData = this.editUserGroup.value;
    console.log(formData);
    const _roles = ['admin'];
    if (formData.adminCheckBox) {
      _roles.push("admin");
    }
    if (formData.SalesmanCheckBox) {
      _roles.push("super-admin");
    }
    if (formData.stockManagerCheckBox) {
      _roles.push("stockManager");
    }
    if (!_roles.length) {
      const message = "Please select at least one role.";
      this.messageService.add({ severity: "error", detail: message });
      console.log(message);
    } else {
      const payload = {
        id: this.id,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        role: _roles,
        status: formData.status,
        address: formData.address,
        warehouse: formData.warehouse,
      };
      console.log(payload);

      if (this.editUserGroup.value) {
        this.UserEditData.UpDateUserApi(this.id, payload).subscribe(
          (resp: any) => {
            if (resp) {
              if (resp.status === "success") {
                const message = "User has been updated";
                this.messageService.add({
                  severity: "success",
                  detail: message,
                });
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
}
