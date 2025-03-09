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
getSlabHistoryById(data: {} | null) {
  return this.http.get(environment.apiUrl + "/SlabController/getSlabHistoryById/" + data);
}

updateSlabsById(data: {}) {
  return this.http.put(environment.apiUrl + "/SlabController/updateSlab" , data);
}
updateSlabExpense(data: {}) {
  return this.http.put(environment.apiUrl + "/SlabController/updateSlabExpense" , data);
}





deleteSlabExpenseById(id: string) {
  return this.http.delete(environment.apiUrl + "/SlabController/deleteSlabExpense/" + id,);
}
deleteSlabsById(id: string) {
  return this.http.delete(environment.apiUrl + "/SlabController/deleteSlab/" + id,);
}

getNotProcessedBlocksByLotId(id: string) {
  return this.http.get(environment.apiUrl + "/SlabController/getNotProcessedBlocksByLotId/" + id,);
}
getSlabListByWarehouseId(id: string) {
  return this.http.get(environment.apiUrl + "/SlabController/getSlabListByWarehouseId/" + id,);
}
getBlockDetailByLotId(id: string) {
  return this.http.get(environment.apiUrl + "/SlabController/getBlockDetailByLotId/" + id,);
}

updateBlockProcessorByLotId(data: {}) {
  return this.http.put(environment.apiUrl + "/LotController/updateBlockProcessorByLotId" , data);
}

}
