import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})

export class blockProcessorService {
  constructor(private http: HttpClient) { }
  // block Processor APIS
  creatBlockProcessor(data: any) {
    return this.http.post(environment.apiUrl + '/BlockProcessorController/createBlockProcessor', data);
  }
  getAllBlockProcessorData() {
    return this.http.get(environment.apiUrl + '/BlockProcessorController/getAllBlockProcessor');
  }
  getBlockProcessorDataById(id: any) {
    return this.http.get(environment.apiUrl + `/BlockProcessorController/getBlockProcessorById/${id}`);
  }

  updateBlockProcessorData(data: any) {
    return this.http.put(environment.apiUrl + '/BlockProcessorController/updateBlockProcessor', data);
  }
  DeleteBlockProcessor(id: any){
    return this.http.delete(environment.apiUrl + `/BlockProcessorController/deleteBlockProcessor/${id}`);
  }
}