import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

  constructor(private http: HttpClient) { }
  // setting warehouse

CreateWarehouse(data: {} | null) {
  return this.http.post(environment.apiUrl + "/setting/createWarehouse", data);
}
getAllWarehouseList() {
  return this.http.get(environment.apiUrl + "/Setting/getAllWarehouse");
}

getWarehouseById(warehouseId: string) {
  return this.http.get(environment.apiUrl + "/Setting/getWarehouseById/" + warehouseId);
}

updateWarehouseById(data: {}) {
  return this.http.put(environment.apiUrl + "/Setting/updateWarehouse " , data);
}


deleteWarehouseById(id: string) {
  return this.http.delete(environment.apiUrl + "/Setting/deleteWarehouse/" + id, {});
}
}
