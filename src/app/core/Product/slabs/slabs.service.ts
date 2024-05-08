import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SlabsService {

  constructor(private http: HttpClient) { }
  // setting Slabs

CreateSlabs(data: {} | null) {
  return this.http.post(environment.apiUrl + "/slabs", data);
}
getSlabsList() {
  return this.http.get(environment.apiUrl + "/getAllSlabsList");
}

getSlabsById(locationId: string) {
  return this.http.get(environment.apiUrl + "/Setting/getSlabsById/" + locationId);
}

updateSlabsById(data: {}) {
  return this.http.put(environment.apiUrl + "/Setting/updateSlabs" , data);
}


deleteSlabsById(id: string) {
  return this.http.delete(environment.apiUrl + "/Setting/deleteSlabs/" + id, {});
}

}
