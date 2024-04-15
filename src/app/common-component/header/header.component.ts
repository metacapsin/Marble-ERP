import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AESEncryptDecryptService } from 'src/app/shared/auth/AESEncryptDecryptService ';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { DataService } from 'src/app/shared/data/data.service';
import { MenuItem, SideBarData } from 'src/app/shared/models/models';
import { Role } from 'src/app/shared/models/role';
import { routes } from 'src/app/shared/routes/routes';
import { SideBarService } from 'src/app/shared/side-bar/side-bar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  public routes = routes;
  public openBox = false;
  public miniSidebar = false;
  public addClass = false;
  sidebarData: any;
  base = '';
  page = '';
  currentUrl = '';
  userData: any = {};
  items: any[] | undefined = [];

  constructor(public router: Router, private sideBar: SideBarService, private data: DataService, private crypto: AESEncryptDecryptService, public auth: AuthService) {
    //this.sidebarData = this.data.sideBar;
    //this.sidebarData = this.data.sideBar;
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        this.getRoutes(event);
      }
    });
    this.getRoutes(this.router);
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res == 'true') {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });
    this.userData = this.crypto.getData('currentUser');
    let _menus: any = []
    this.userData = this.crypto.getData('currentUser');
    this.data.sideBar.menu.forEach(item => {
      if(this.userData?.role.indexOf(Role.SuperAdmin) > -1){
        _menus.push(item);
        return;
      }
      for (let index = 0; index < this.userData?.role.length; index++) {
        const element = this.userData?.role[index];
        if(item.role.indexOf(element) > -1){
          _menus.push(item);
          return;
        }
        
      }
      // if (JSON.stringify(item.role) === JSON.stringify(this.userData?.role)) {
      //   _menus.push(item);
      // }

    });
    this.sidebarData = _menus;
  }

  ngOnInit(): void {
    this.auth.getUserProfile().subscribe((user: any) => {
      this.crypto.setData("currentUser", user.data);
    });
  }

  logout() {
    localStorage.removeItem("token");
    setTimeout(() => {
      this.router.navigate([routes.login])
    }, 200);
  }

  private getRoutes(route: { url: string }): void {
    const bodyTag = document.body;

    bodyTag.classList.remove('slide-nav')
    bodyTag.classList.remove('opened')
    this.currentUrl = route.url;

    const splitVal = route.url.split('/');


    this.base = splitVal[1];
    this.page = splitVal[2];
  }

  public expandSubMenus(menu: MenuItem): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.sidebarData.map((mainMenus: any) => {
      if (mainMenus.menuValue == menu.menuValue) {
        menu.showSubRoute = !menu.showSubRoute;
      } else {
        mainMenus.showSubRoute = false;
      }
    });
  }

  openBoxFunc() {
    this.openBox = !this.openBox;
    /* eslint no-var: off */
    var mainWrapper = document.getElementsByClassName('main-wrapper')[0];
    if (this.openBox) {
      mainWrapper.classList.add('open-msg-box');
    } else {
      mainWrapper.classList.remove('open-msg-box');
    }
  }

  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }
  public toggleMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();

    this.addClass = !this.addClass;
    /* eslint no-var: off */
    var root = document.getElementsByTagName('html')[0];
    /* eslint no-var: off */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var sidebar: any = document.getElementById('sidebar')

    if (this.addClass) {
      root.classList.add('menu-opened');
      sidebar.classList.add('opened');
    }
    else {
      root.classList.remove('menu-opened');
      sidebar.classList.remove('opened');
    }
  }
}
