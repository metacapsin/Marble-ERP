import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class TaxVendorsService {
  constructor(private http: HttpClient) { }
  createTaxVendor(data: any) {
    return this.http.post(environment.apiUrl + '/TaxVendorController/createTaxVendor', data);
  }
  getTaxVendorList() {
    return this.http.get(environment.apiUrl + '/TaxVendorController/getTaxVendorList');
  }
  getTaxVendorById(id: any) {
    return this.http.get(environment.apiUrl + `/TaxVendorController/getTaxVendorById/${id}`);
  }

  updateTaxVendor(data: any) {
    return this.http.put(environment.apiUrl + '/TaxVendorController/updateTaxVendor', data);
  }
  deleteTaxVendor(id: any) {
    return this.http.delete(environment.apiUrl + `/TaxVendorController/deleteTaxVendor/${id}`);
  }

} 