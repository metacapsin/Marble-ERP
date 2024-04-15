import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { BehaviorSubject } from 'rxjs';
import { routes } from '../routes/routes';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private router: Router, private http:HttpClient) {}

  // public login(): void {
  //   localStorage.setItem('authenticated', 'true');
  //   this.router.navigate([routes.adminDashboard]);
  // }

  login(email: string | null, password: string | null) {
    return this.http.post(environment.apiUrl + "/login", {
      "username":email,
      "password":password
    })
  }

  forgotPassword(email: string| null) {
    return this.http.post(environment.apiUrl + "/forgotPassword", {
      "email":email,
    })
  }

  resetPassword(password: string | null, token:string) {
    return this.http.post(environment.apiUrl + "/resetPassword", {
      "password":password,
      "token":token
    })
  }

  getUserProfile() {
    return this.http.get(environment.apiUrl + "/Users/getUserProfile ")
  }
}
