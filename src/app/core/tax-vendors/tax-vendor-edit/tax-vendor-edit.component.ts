import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { WarehouseService } from "../../settings/warehouse/warehouse.service";
import { BillingAddressService } from "../../settings/billing-Address/billingAddress.service";
import { Validators } from "@angular/forms";
import { validationRegex } from "../../validation";
import { TaxVendorsService } from "../tax-vendors.service";

@Component({
  selector: "app-tax-vendor-edit",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./tax-vendor-edit.component.html",
  styleUrl: "./tax-vendor-edit.component.scss",
})
export class TaxVendorEditComponent implements OnInit{
  public routes = routes;
  editTaxVendorForm: FormGroup;
  wareHouseList: any = [];
  countriesList: [];
  taxVendorId: any;
  taxVendorsData: any = {}

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private BillingAddressService: BillingAddressService,
    private activeRoute: ActivatedRoute,
    private TaxVendorsService: TaxVendorsService
  ) {
    this.editTaxVendorForm = this.fb.group({
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
      country: ["", [Validators.required]],
      phoneNumber: [
        "",
        [Validators.required, Validators.pattern(validationRegex.phoneRGEX)],
      ],
      email: ["", [Validators.pattern(validationRegex.emailRegex)]],
      addressLine1: [
        "",
        [Validators.required, Validators.pattern(validationRegex.billingAddressRegex)],
      ],
      addressLine2: ["", [Validators.pattern(validationRegex.billingAddressRegex)]],
      state: [
        "",
        [Validators.required, Validators.pattern(validationRegex.stateRegex)],
      ],
    });
    this.taxVendorId = this.activeRoute.snapshot.params["id"];
  }
  patchForm(data) {
    console.log(data);
    this.editTaxVendorForm.patchValue({
      city: data.city,
      companyName: data.companyName,
      postalCode: data.postalCode,
      country: data.country,
      // zip: data.zip,
      phoneNumber: data.phoneNumber,
      email: data.email,
      addressLine1: data.addressLine1,
      addressLine2: data.addressLine2,
      // setAsDefault:data.setAsDefault,
      state: data.state,
    });
  }

  ngOnInit() {
    this.BillingAddressService.getCountries().subscribe((resp: any) => {
      this.countriesList = [];
      console.log(resp);

      this.countriesList = resp.data.map((e) => ({
        name: e.name,
        iso2: e.iso2,
      }));
    });
    this.getTaxVendorsById(); 
    
  }

  getTaxVendorsById() {
    this.TaxVendorsService.getTaxVendorById(this.taxVendorId).subscribe(
      (resp: any) => {
        console.log(resp);
        this.taxVendorId=resp.data._id
        this.taxVendorsData = resp.data;
        this.patchForm(this.taxVendorsData);

        console.log("this is tax vendors data", this.taxVendorsData);
      }
    );
  }

  editTaxVendorFormSubmit() {
    console.log("tax vendors form", this.editTaxVendorForm.value);
    const formData = this.editTaxVendorForm.value;

    const payload = {
      id:this.taxVendorId,
      city: formData.city,
      companyName: formData.companyName,
      postalCode: formData.postalCode,
      country: formData.country,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      addressLine1: formData.addressLine1,
      addressLine2: formData.addressLine2,
      state: formData.state,
      isTaxVendor: true,
    };
    console.log(payload);
    this.TaxVendorsService.updateTaxVendor(payload).subscribe((resp: any) => {
      if (resp) {
        if (resp.status === "success") {
          this.messageService.add({
            severity: "success",
            detail: resp.message,
          });
          setTimeout(() => {
            this.router.navigate(["/tax-vendors"]);
          }, 400);
        } else {
          this.messageService.add({ severity: "error", detail: resp.message });
        }
      }
    });
  }
}
