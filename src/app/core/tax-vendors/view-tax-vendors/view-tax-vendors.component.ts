import { Component } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-view-tax-vendors',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './view-tax-vendors.component.html',
  styleUrl: './view-tax-vendors.component.scss'
})
export class ViewTaxVendorsComponent {
  public routes = routes;
  viewTaxVendorData = {
    "_id": 121,
    "companyName": "MetaCaps",
    "addressLine1": "Sidharth Colony",
    "addressLine2": "Baral Road",
    "city": "Bijainagar",
    "state": "Rajasthan",
    "postalCode": "305624",
    "country": {
      id: "dd",
      name: "India"
    },
    "phoneNumber": "9876543210",
    "email": "metacaps@gmail.com"
  }
}
