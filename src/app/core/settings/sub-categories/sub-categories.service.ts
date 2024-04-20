import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class SubCategoriesService {
  constructor(private http: HttpClient) { }


  CreateSubCategories(data: {} | null) {
      return this.http.post(environment.apiUrl + "/Setting/createSubCategory", data);
    }

  getSubCategories() {
    return this.http.get(environment.apiUrl + "/Setting/getAllSubCategoryList");
  }

  
  getSubCategoriesById(id: string) {
    return this.http.get(environment.apiUrl + "/Setting/getSubCategoryById/" + id);
  }

  updateSubCategories(data: {}) {
      return this.http.put(environment.apiUrl + "/Setting/updateSubCategory", data);
  }

  deleteSubCategoriesById(id: any) {
      return this.http.delete(environment.apiUrl + "/Setting/deleteSubCategory/" + id, {});
  }
  

}