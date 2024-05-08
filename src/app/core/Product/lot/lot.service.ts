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
  return this.http.post(environment.apiUrl + "/Lot", data);
}
getLotList() {
  return this.http.get(environment.apiUrl + "/getAllLotList");
}

getLotById(locationId: string) {
  return this.http.get(environment.apiUrl + "/Setting/getLotById/" + locationId);
}

updateLotById(data: {}) {
  return this.http.put(environment.apiUrl + "/Setting/updateLot" , data);
}


deleteLotById(id: string) {
  return this.http.delete(environment.apiUrl + "/Setting/deleteLot/" + id, {});
}
}
