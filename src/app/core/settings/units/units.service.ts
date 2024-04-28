import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UnitsService {

  constructor(private http: HttpClient) { }

CreateUnit(data: {} | null) {
  return this.http.post(environment.apiUrl + "/Setting/createUnit", data);
}
getAllUnitList() {
  return this.http.get(environment.apiUrl + "/Setting/getUnitList");
}

getUnitById(id: string) {
  return this.http.get(environment.apiUrl + "/Setting/getUnitById/" + id);
}

updateUnitById(data: {}) {
  return this.http.put(environment.apiUrl + "/Setting/updateUnit/" , data);
}


deleteUnitById(id: string) {
  return this.http.delete(environment.apiUrl + "/Setting/deleteUnitById/" + id, {});
}
}
