import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { WarehouseService } from '../../settings/warehouse/warehouse.service';
import { BillingAddressService } from '../../settings/billing-Address/billingAddress.service';
import { Validators } from '@angular/forms';
import { validationRegex } from '../../validation';
import { TaxVendorsService } from '../tax-vendors.service';

@Component({
  selector: 'app-tax-vendor-edit',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tax-vendor-edit.component.html',
  styleUrl: './tax-vendor-edit.component.scss'
})
export class TaxVendorEditComponent {
  public routes = routes;
  editTaxVendorForm: FormGroup;
  wareHouseList: any = [];
  countriesList: []
  taxVendorId: any;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private BillingAddressService: BillingAddressService,
    private activeRoute: ActivatedRoute,
    private TaxVendorsService: TaxVendorsService

  ) {
    this.editTaxVendorForm = this.fb.group({
      city: ['', [Validators.required, Validators.pattern(validationRegex.cityNameRGEX)]],
      companyName: ['', [Validators.required, Validators.pattern(validationRegex.companyNameRGEX)]],
      postalCode: ['', [Validators.required, Validators.pattern(validationRegex.postalZipRGEX)]],
      country: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required, Validators.pattern(validationRegex.phoneRGEX)]],
      email: ['', [Validators.pattern(validationRegex.emailRegex)]],
      addressLine1: ['', [Validators.required, Validators.pattern(validationRegex.cityNameRGEX)]],
      addressLine2: ['', [Validators.pattern(validationRegex.cityNameRGEX)]],
      state: ['', [Validators.required, Validators.pattern(validationRegex.stateRegex)]],
    });
    this.taxVendorId = this.activeRoute.snapshot.params["id"];
  }

  ngOnInit(): void {
    this.BillingAddressService.getCountries().subscribe((resp: any) => {
      this.countriesList = [];
      this.countriesList = resp.data.map((e) => ({
        'name': e.name,
        'iso2': e.iso2
      }));
    })
    this.getTaxVendor();
  }

  getTaxVendor() {
    this.TaxVendorsService.getTaxVendorById(this.taxVendorId).subscribe((resp: any) => {
      console.log(resp);

    })
  }





  editTaxVendorFormSubmit() {
    console.log("this/form", this.editTaxVendorForm.value);

  }
}
