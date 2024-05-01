import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class SuppliersdataService {
  constructor(private http: HttpClient) { }
  // user APIS
  GetSupplierData() {
    return this.http.get(environment.apiUrl + '/Supplier/getAllSupplier');
  }
  AddSupplierdata(data: any) {
    return this.http.post(environment.apiUrl + '/Supplier/createSupplier', data);
  }
  GetSupplierDataById(id: any) {
    return this.http.get(environment.apiUrl + `/Supplier/getSupplierById/${id}`);
  }
  UpDataSupplierApi(data: any) {
    return this.http.put(environment.apiUrl + `/Supplier/updateSupplier`, data);
  }
  DeleteSupplierApi(id: any){
    return this.http.delete(environment.apiUrl + `/Supplier/deleteSupplier/${id}`);
  }
}