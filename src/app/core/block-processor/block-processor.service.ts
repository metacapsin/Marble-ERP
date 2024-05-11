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
    return this.http.post(environment.apiUrl + '', data);
  }
  getAllBlockProcessorData() {
    return this.http.get(environment.apiUrl + '');
  }
  getBlockProcessorDataById(id: any) {
    return this.http.get(environment.apiUrl + `${id}`);
  }

  updateBlockProcessorData(data: any) {
    return this.http.put(environment.apiUrl + '', data);
  }
  DeleteBlockProcessor(id: any){
    return this.http.delete(environment.apiUrl + `${id}`);
  }
}