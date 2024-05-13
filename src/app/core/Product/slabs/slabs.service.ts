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
  return this.http.post(environment.apiUrl + "/SlabController/createSlab", data);
}
getSlabsList() {
  return this.http.get(environment.apiUrl + "/SlabController/getSlabList");
}

getSlabsById(locationId: string) {
  return this.http.get(environment.apiUrl + "/SlabController/getSlabById/" + locationId);
}

updateSlabsById(data: {}) {
  return this.http.put(environment.apiUrl + "/SlabController/updateSlab" , data);
}


deleteSlabsById(id: string) {
  return this.http.delete(environment.apiUrl + "/SlabController/deleteSlab/" + id,);
}

}
