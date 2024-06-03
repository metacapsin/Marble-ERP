import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StockTransferService {
  constructor(private http: HttpClient) { }
  addStockTransfer(data: {} | null) {
  return this.http.post(environment.apiUrl + "/StockTransferController/addStockTransfer", data);
}
getStockTransferList() {
  return this.http.get(environment.apiUrl + "/StockTransferController/getStockTransferList");
}

getStockTransferById(locationId: string) {
  return this.http.get(environment.apiUrl + "/StockTransferController/getStockTransferById/" + locationId);
}
updateStockTransfer(data: {}) {
  return this.http.put(environment.apiUrl + "/StockTransferController/updateStockTransfer" , data);
}

deleteStockTransfer(id: string) {
  return this.http.delete(environment.apiUrl + "/StockTransferController/deleteStockTransfer/" + id);
}
}
