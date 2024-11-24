import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { BillingAddressService } from "../billingAddress.service";
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MessageService } from "primeng/api";
import { routes } from "src/app/shared/routes/routes";
import { WarehouseService } from "../../warehouse/warehouse.service";
import { SharedModule } from "src/app/shared/shared.module";
import { validationRegex } from "src/app/core/validation";


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
  editBillingAddress: UntypedFormGroup;
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
    private UserEditData: BillingAddressService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private messageService: MessageService,
  ) {
    this.id = this.activeRoute.snapshot.params["id"];
    this.editBillingAddress = this.fb.group({
      city: ['', [Validators.required,Validators.pattern(validationRegex.cityNameRGEX)]],
      setAsDefault: [''],
      companyName:['',[Validators.required, Validators.pattern(validationRegex.companyNameRGEX)]],
      postalCode:['',[Validators.required,Validators.pattern(validationRegex.postalZipRGEX)]],
      country: ['',[Validators.required]],
      phoneNumber: ['',[Validators.required,Validators.pattern(validationRegex.phoneRGEX)]],
      email:['',[Validators.pattern(validationRegex.emailRegex)]],
      addressLine1:['',[Validators.required,Validators.pattern(validationRegex.billingAddressRegex)]],
      addressLine2:['',[Validators.pattern(validationRegex.billingAddressRegex)]],
      state:['',[Validators.required,Validators.pattern(validationRegex.stateRegex)]],
    });
  }
  patchForm(data) {
    console.log(data);
    this.editBillingAddress.patchValue({
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
      phoneNumber: data.phoneNumber,
      email:data.email,
      setAsDefault:data.setAsDefault,
      postalCode:data.postalCode,
      companyName:data.companyName,
      addressLine1:data.addressLine1,
      addressLine2:data.addressLine2,
    });
  }

  editBillingAddressForm() {
    const formData = this.editBillingAddress.value;
    console.log(formData);
      const payload = {
        id: this.id,
        companyName:formData.companyName,
        addressLine1:formData.addressLine1,
        addressLine2:formData.addressLine2,
        city: formData.city,
        state: formData.state,
        postalCode:formData.postalCode,
        country: formData.country,
        phoneNumber: formData.phoneNumber,
        email:formData.email,
        setAsDefault:formData.setAsDefault,
      };
      console.log(payload);

      if (this.editBillingAddress.value) {
        this.UserEditData.updateBillingAddress(payload).subscribe(
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
