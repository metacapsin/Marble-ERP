import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LotService {
  constructor(private http: HttpClient) { }
  // setting Lot

CreateLot(data: {} | null) {
  return this.http.post(environment.apiUrl + "/LotController/createLot", data);
}
getLotList() {
  return this.http.get(environment.apiUrl + "/LotController/getLotList");
}

getLotById(locationId: string) {
  return this.http.get(environment.apiUrl + "/LotController/getLotById/" + locationId);
}

updateLotById(data: {}) {
  return this.http.put(environment.apiUrl + "/LotController/updateLot" , data);
}

deleteLotById(id: string) {
  return this.http.delete(environment.apiUrl + "/LotController/deleteLot/" + id);
}
lotByWarehouse(id:any) {
  return this.http.get(environment.apiUrl + "/LotController/lotByWarehouse/" + id);
}

getFilesystem() {
  return Promise.resolve(this.getLotList());
}
}