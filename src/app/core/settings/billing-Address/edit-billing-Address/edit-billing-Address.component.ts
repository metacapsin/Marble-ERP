import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { UsersdataService } from "../billingAddress.service";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar } from "@angular/material/snack-bar";
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
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: "app-edit-billing-Address",
  templateUrl: "./edit-billing-Address.component.html",
  styleUrls: ["./edit-billing-Address.component.scss"],
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
})
export class EditBillingAddressComponent implements OnInit {
  public routes = routes;
  id = "";
  EditUserData: any;
  editUserGroup: UntypedFormGroup;
  data: any = null;
  wareHousedata: any = [];
  wareHouseLists = [];
  orgCountriesList: any;
  countriesList: any[];
  billingAddressData: any;

  ngOnInit(): void {
    this.UserEditData.getBillingAddressById(this.id).subscribe((resp: any) => {
      this.billingAddressData = resp.data;
      this.patchForm(this.billingAddressData);
    });

    this.UserEditData.getCountries().subscribe((resp: any) => {
      this.countriesList = [];
      this.orgCountriesList = resp.data
      this.orgCountriesList.forEach((element)=>{
        this.countriesList.push({
          name:element.name,
          iso2:element.iso2,
        })
      })
      console.log(this.countriesList);
    })
  }

  nameRegex = /^(?=[^\s])([a-zA-Z\d\/\- ]{3,50})$/;

  emailRegex: string =
    "^(?!.*\\s)[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

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
      city: [''],
      state: [''],
      ZIP: [''],
      companyName:[''],
      postalCode:[''],
      country: [''],
      phoneNumber: [''],
      email:[''],
      addressLine1:[''],
      addressLine2:[''],
      setAsDefault:['']
    });
  }
  patchForm(data) {
    this.editUserGroup.patchValue({
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      phoneNumber: data.phoneNumber,
      email:data.email,
      setAsDefault:data.setAsDefaul,
      postalCode:data.postalCode,
      companyName:data.companyName,
      addressLine1:data.addressLine1,
      addressLine2:data.addressLine2,
    });
  }

  editUserForm() {
    const formData = this.editUserGroup.value;
    console.log(formData);
      const payload = {
        id: this.id,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        country: formData.country,
        phoneNumber: formData.phoneNumber,
        email:formData.email,
        setAsDefault:formData.setAsDefaul,
        postalCode:formData.postalCode,
        companyName:formData.companyName,
        addressLine1:formData.addressLine1,
        addressLine2:formData.addressLine2,
      };
      console.log(payload);

      if (this.editUserGroup.value) {
        this.UserEditData.UpDateUserApi(this.id, payload).subscribe(
          (resp: any) => {
            if (resp) {
              if (resp.status === "success") {
                const message = "Billing Address has been updated";
                this.messageService.add({
                  severity: "success",
                  detail: message,
                });
                setTimeout(() => {
                  this.router.navigate(["/settings/billing-Address"]);
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
