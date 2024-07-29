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
import { UsersdataService } from "../billingAddress.service";
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
  selector: "app-add-billing-Address",
  standalone: true,
  templateUrl: "./add-billing-Address.component.html",
  styleUrls: ["./add-billing-Address.component.scss"],
  imports: [SharedModule],
  providers: [MessageService],
})
export class AddBillingAddressComponent implements OnInit {
  public routes = routes;
  addBillingAddress: UntypedFormGroup;
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
  countriesList: any;
  orgCountriesList: any;

  constructor(
    private fb: UntypedFormBuilder,
    private Addusersdata: UsersdataService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private service: WarehouseService
  ) {
    this.addBillingAddress = this.fb.group({
      // name: ["", [Validators.required, Validators.pattern(this.nameRegex)]],
      // phoneNumber: [
      //   "",
      //   [Validators.required, Validators.pattern(this.phoneRegex)],
      // ],
      // email: ["", [Validators.pattern(this.emailRegex)]],
      // status: [""],
      // password: [
      //   "",
      //   [Validators.required, Validators.pattern(this.passwordRegex)],
      // ],
      // address: [
      //   "",
      //   [Validators.required, Validators.pattern(this.addressRegex)],
      // ],
      // wareHouse: [""],
      // adminCheckBox: [""],
      // SalesmanCheckBox: [""],
      // stockManagerCheckBox: [""],
      // isUserLocked: [""],
      // billingAddress: [''],
      city: [''],
      setAsDefault: [''],
      companyName:['',[Validators.required]],
      postalCode:['',[Validators.required]],
      country: ['',[Validators.required]],
      phoneNumber: ['',[Validators.required]],
      email:[''],
      addressLine1:['',[Validators.required]],
      addressLine2:[''],
      state:[''],
    });
  }
  ngOnInit(): void {
    this.Addusersdata.getCountries().subscribe((resp: any) => {
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

  addBillingAddressFrom() {
    const formData = this.addBillingAddress.value;
    console.log(formData);
   
      const payload = {
      city: formData.city,
      zip: formData.zip,
      country: formData.country,
      phoneNumber: formData.phoneNumber,
      email:formData.email,
      state:formData.state,
      setAsDefault:formData.setAsDefault,
      postalCode:formData.postalCode,
      companyName:formData.companyName,
      addressLine1:formData.addressLine1,
      addressLine2:formData.addressLine2,
      };

      console.log(payload);

      this.Addusersdata.createBillingAddress(payload).subscribe((resp: any) => {
        console.log(resp);
        if (resp) {
          if (resp.status === "success") {
            const message = "Billing Address has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/settings/billing-Address"]);
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
