import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class BlocksService {

  constructor(private http: HttpClient) { }
  // setting Blocks

CreateBlocks(data: {} | null) {
  return this.http.post(environment.apiUrl + "/Blocks", data);
}
getBlocksList() {
  return this.http.get(environment.apiUrl + "/getAllBlocksList");
}

getBlocksById(locationId: string) {
  return this.http.get(environment.apiUrl + "/getBlocksById/" + locationId);
}

updateBlocksById(data: {}) {
  return this.http.put(environment.apiUrl + "/updateBlocks" , data);
}


deleteBlocksById(id: string) {
  return this.http.delete(environment.apiUrl + "/deleteBlocks/" + id, {});
}

}
