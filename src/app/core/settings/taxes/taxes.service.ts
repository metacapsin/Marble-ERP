import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TaxesService {

  constructor(private http: HttpClient) { }
  // setting Taxes

CreateTax(data: {} | null) {
  return this.http.post(environment.apiUrl + "/Setting/createTax", data);
}
getAllTaxList() {
  return this.http.get(environment.apiUrl + "/Setting/getTaxList");
}

getTaxById(TaxesId: string) {
  return this.http.get(environment.apiUrl + "/Setting/getTaxById/" + TaxesId);
}

updateTaxById(data: {}) {
  return this.http.put(environment.apiUrl + "/Setting/updateTax/" , data);
}


deleteTaxById(id: string) {
  return this.http.delete(environment.apiUrl + "/Setting/deleteTax/" + id, {});
}
}
