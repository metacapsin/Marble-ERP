import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { TaxVendorsService } from '../tax-vendors.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-tax-vendor-list',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './tax-vendor-list.component.html',
  styleUrl: './tax-vendor-list.component.scss'
})
export class TaxVendorListComponent {
  public routes = routes;
  searchDataValue: string = "";
  taxVendorList = []

  constructor(private router: Router,
    private TaxVendorsService: TaxVendorsService,
    private messageService: MessageService,
  ) {


  }

  ngOnInit(): void {
    this.TaxVendorsService.getTaxVendorList().subscribe((resp: any) => {
      this.taxVendorList = resp.data

    })
  }


  goToTaxVendorAdd() {
    this.router.navigate(['/tax-vendors/add-tax-vendor'])
  }
  goToTaxVendorEdit(_id: any) {
    this.router.navigate([`/tax-vendors/edit-tax-vendor/${_id}`])
  }
  goToTaxVendorView(_id: any) {
    this.router.navigate([`/tax-vendors/view-tax-vendor/${_id}`])
  }
  deleteTaxVendors(_id: any) {

  }
}
