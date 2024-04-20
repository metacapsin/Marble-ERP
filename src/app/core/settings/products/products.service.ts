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
  return this.http.post(environment.apiUrl + "/Product/createProduct", data);
}
getProductList() {
  return this.http.get(environment.apiUrl + "/Product/getProductList");
}

getProductById(locationId: string) {
  return this.http.get(environment.apiUrl + "/Product/getProductById/" + locationId);
}

updateProductById(data: {}) {
  return this.http.put(environment.apiUrl + "/Product/updateProduct" , data);
}


deleteProductById(id: string) {
  return this.http.delete(environment.apiUrl + "/Product/deleteProductById/" + id, {});
}

}
