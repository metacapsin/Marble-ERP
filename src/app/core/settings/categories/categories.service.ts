import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  constructor(private http: HttpClient) { }


  CreateCategories(data: {} | null) {
      return this.http.post(environment.apiUrl + "/Setting/createCategory", data);
    }

  getCategories() {
    return this.http.get(environment.apiUrl + "/Setting/getAllCategoryList");
  }

  
  getCategoriesById(id: string) {
    return this.http.get(environment.apiUrl + "/Setting/getCategoryById/" + id);
  }

  updateCategories(data: {}) {
      return this.http.put(environment.apiUrl + "/Setting/updateCategory", data);
  }

  deleteCategoriesById(id: any) {
      return this.http.delete(environment.apiUrl + "/Setting/deleteCategory/" + id, {});
  }
  

}