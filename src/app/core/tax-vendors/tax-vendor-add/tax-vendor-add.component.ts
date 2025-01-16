import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { validationRegex } from "../../validation";
import { BillingAddressService } from "../../settings/billing-Address/billingAddress.service";
import { TaxVendorsService } from "../tax-vendors.service";

@Component({
  selector: "app-tax-vendor-add",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./tax-vendor-add.component.html",
  styleUrl: "./tax-vendor-add.component.scss",
})
export class TaxVendorAddComponent implements OnInit {
  public routes = routes;
  addTaxVendorForm: FormGroup;
  wareHouseList: any = [];
  countriesList: [];

  taxNumberRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{15}$/;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private TaxVendorsService: TaxVendorsService,
    private BillingAddressService: BillingAddressService
  ) {
    this.addTaxVendorForm = this.fb.group({
      city: [
        "",
        [Validators.required, Validators.pattern(validationRegex.cityNameRGEX)],
      ],
      companyName: [
        "",
        [
          Validators.required,
          Validators.pattern(validationRegex.companyNameRGEX),
        ],
      ],
      postalCode: [
        "",
        [
          Validators.required,
          Validators.pattern(validationRegex.postalZipRGEX),
        ],
      ],
      country: [{ iso2: "IN", name: "India" }, [Validators.required]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(validationRegex.phoneRGEX)],
      ],
      email: ["", [Validators.pattern(validationRegex.emailRegex)]],
      addressLine1: [
        "",
        [
          Validators.required,
          Validators.pattern(validationRegex.billingAddressRegex),
        ],
      ],
      addressLine2: [
        "",
        [Validators.pattern(validationRegex.billingAddressRegex)],
      ],
      state: [
        "",
        [Validators.required, Validators.pattern(validationRegex.stateRegex)],
      ],
      taxNo: [
        "",
    
      ],
    });
  }

  ngOnInit(): void {
    this.BillingAddressService.getCountries().subscribe((resp: any) => {
      this.countriesList = [];
      this.countriesList = resp.data.map((e) => ({
        name: e.name,
        iso2: e.iso2,
      }));
      console.log(this.countriesList);
    });
  }

  addTaxVendorFormSubmit() {
    const formData = this.addTaxVendorForm.value;
    console.log("this/form", formData);

    if (this.addTaxVendorForm.valid) {
      console.log("this/form", this.addTaxVendorForm.value);
      const payload = {
        city: formData.city,
        companyName: formData.companyName,
        postalCode: formData.postalCode,
        country: formData.country,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        state: formData.state,
        taxNo: formData.taxNo,
        isTaxVendor: true,
      };
      this.TaxVendorsService.createTaxVendor(payload).subscribe((resp: any) => {
        if (resp) {
          console.log("payload", payload);

          if (resp.status === "success") {
            this.messageService.add({
              severity: "success",
              detail: resp.message,
            });
            setTimeout(() => {
              this.router.navigate(["/tax-vendors"]);
            }, 400);
          } else {
            this.messageService.add({
              severity: "error",
              detail: resp.message,
            });
          }
        }
      });
    }
  }
}
