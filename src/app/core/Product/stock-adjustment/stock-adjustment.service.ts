import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StockAdjustmentService {
  constructor(private http: HttpClient) { }
  addNewAdjustment(data: {} | null) {
  return this.http.post(environment.apiUrl + "/StockAdjustmentController/addNewAdjustment", data);
}
getAdjustmentList() {
  return this.http.get(environment.apiUrl + "/StockAdjustmentController/getAdjustmentList");
}

getAdjustmentById(locationId: string) {
  return this.http.get(environment.apiUrl + "/StockAdjustmentController/getAdjustmentById/" + locationId);
}
getAdjustmentListByWarehouseId(locationId: string) {
  return this.http.get(environment.apiUrl + "/StockAdjustmentController/getAdjustmentListByWarehouseId/" + locationId);
}

updateAdjustment(data: {}) {
  return this.http.put(environment.apiUrl + "/StockAdjustmentController/updateAdjustment" , data);
}

deleteAdjustment(id: string) {
  return this.http.delete(environment.apiUrl + "/StockAdjustmentController/deleteAdjustment/" + id);
}
}
