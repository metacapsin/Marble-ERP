import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http: HttpClient) { }
  // setting Product

CreateProduct(data: {} | null) {
  return this.http.post(environment.apiUrl + "/Setting/createProduct", data);
}
getProductList() {
  return this.http.get(environment.apiUrl + "/Setting/getAllProductList");
}

getProductById(locationId: string) {
  return this.http.get(environment.apiUrl + "/Setting/getProductById/" + locationId);
}

updateProductById(data: {}) {
  return this.http.put(environment.apiUrl + "/Setting/updateProduct" , data);
}


deleteProductById(id: string) {
  return this.http.delete(environment.apiUrl + "/Setting/deleteProduct/" + id, {});
}



}




// 'POST /Setting/createProduct': 'Setting/SettingController.createProduct',
// 'GET /Setting/getAllProductList': 'Setting/SettingController.getAllProductList',
// 'GET /Setting/getProductById/:id': 'Setting/SettingController.getProductById',
// 'DELETE /Setting/deleteProduct/:id': 'Setting/SettingController.deleteProduct',
// 'PUT /Setting/updateProduct': 'Setting/SettingController.updateProduct',
