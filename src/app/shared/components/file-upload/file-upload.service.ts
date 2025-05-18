import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadFiles(type: string, files: File[]): Observable<any> {
    const formData = new FormData();
    formData.append('type', type);
    files.forEach(file => {
      formData.append("fileName", file.name);
      formData.append('files', file);
    });
    return this.http.post(`${this.apiUrl}/Purchase/upload-attachments`, formData);
  }

  deleteFile(filename: string, path: string): Observable<any> {
    const payload = {
      filename: filename,
      path: path
    };
    return this.http.post(`${this.apiUrl}/Purchase/delete-attachment`, payload);
  }
} 