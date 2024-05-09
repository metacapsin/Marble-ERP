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
  return this.http.post(environment.apiUrl + "/createLot", data);
}
getLotList() {
  return this.http.get(environment.apiUrl + "/getAllLotList");
}

getLotById(locationId: string) {
  return this.http.get(environment.apiUrl + "/getLotById/" + locationId);
}

updateLotById(data: {}) {
  return this.http.put(environment.apiUrl + "/updateLot" , data);
}


deleteLotById(id: string) {
  return this.http.delete(environment.apiUrl + "/deleteLot/" + id, {});
}
}
