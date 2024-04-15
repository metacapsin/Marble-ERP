import { Injectable } from '@angular/core';
import {
  
  CanActivate,
  Router,
  
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { routes } from '../routes/routes';
import { AESEncryptDecryptService } from '../auth/AESEncryptDecryptService ';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private crypto:AESEncryptDecryptService) {}
  canActivate(
    
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
      if (JSON.parse(window.localStorage.getItem(`Private Key for My EMR_token`) as string)) {
        return true;
      } else {
        this.router.navigate([routes.login]);
        return false;
      }
  }
}
