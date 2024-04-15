import { Directive, ElementRef, Input } from '@angular/core';
import { AESEncryptDecryptService } from 'src/app/shared/auth/AESEncryptDecryptService ';

@Directive({
  selector: '[appShowHide]',
  standalone: true
})
export class ShowHideDirective {

  constructor(private elementRef: ElementRef, private crypto: AESEncryptDecryptService) {}

  @Input() roles: string[] = [];
  userData : any = {}

  ngOnInit() {
    this.userData = this.crypto.getData('currentUser');
    const userRoles = this.userData.role;
    const hasRole = userRoles.some(role => this.roles.includes(role));

    if (!hasRole) {
      this.elementRef.nativeElement.style.display = 'none';
    }
  }
}