import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { PaymentInService } from "src/app/core/payment-in/payment-in.service";
import { PurchaseService } from "src/app/core/purchase/purchase.service";
import { SalesService } from "src/app/core/sales/sales.service";
import { AESEncryptDecryptService } from "src/app/shared/auth/AESEncryptDecryptService ";
import { AuthService } from "src/app/shared/auth/auth.service";
import { CombinedPaymentService } from "src/app/shared/data/combined-payment.service";
import { DataService } from "src/app/shared/data/data.service";
import { MenuItem, SideBarData } from "src/app/shared/models/models";
import { Role } from "src/app/shared/models/role";
import { routes } from "src/app/shared/routes/routes";
import { SideBarService } from "src/app/shared/side-bar/side-bar.service";
// @Component({
//   selector: 'app-header',
//   templateUrl: './header.component.html',
//   styleUrls: ['./header.component.scss'],
// })
// export class HeaderComponent implements OnInit {
//   public routes = routes;
//   public openBox = false;
//   public miniSidebar = false;
//   public addClass = false;
//   sidebarData: any;
//   base = '';
//   page = '';
//   currentUrl = '';
//   userData: any = {};
//   items: any[] | undefined = [];

//   constructor(public router: Router, private sideBar: SideBarService, private data: DataService, private crypto: AESEncryptDecryptService, public auth: AuthService) {
//     //this.sidebarData = this.data.sideBar;
//     //this.sidebarData = this.data.sideBar;
//     router.events.subscribe((event: object) => {
//       if (event instanceof NavigationEnd) {
//         this.getRoutes(event);
//       }
//     });
//     this.getRoutes(this.router);
//     this.sideBar.toggleSideBar.subscribe((res: string) => {
//       if (res == 'true') {
//         this.miniSidebar = true;
//       } else {
//         this.miniSidebar = false;
//       }
//     });
//     this.userData = this.crypto.getData('currentUser');
//     let _menus: any = []
//     this.userData = this.crypto.getData('currentUser');
//     this.data.sideBar.menu.forEach(item => {
//       if(this.userData?.role.indexOf(Role.SuperAdmin) > -1){
//         _menus.push(item);
//         return;
//       }
//       for (let index = 0; index < this.userData?.role.length; index++) {
//         const element = this.userData?.role[index];
//         if(item.role.indexOf(element) > -1){
//           _menus.push(item);
//           return;
//         }

//       }
//       // if (JSON.stringify(item.role) === JSON.stringify(this.userData?.role)) {
//       //   _menus.push(item);
//       // }

//     });
//     this.sidebarData = _menus;
//   }

//   ngOnInit(): void {
//     this.auth.getUserProfile().subscribe((user: any) => {
//       this.crypto.setData("currentUser", user.data);
//     });
//   }

//   logout() {
//     localStorage.removeItem("token");
//     setTimeout(() => {
//       this.router.navigate([routes.login])
//     }, 200);
//   }

//   private getRoutes(route: { url: string }): void {
//     const bodyTag = document.body;

//     bodyTag.classList.remove('slide-nav')
//     bodyTag.classList.remove('opened')
//     this.currentUrl = route.url;

//     const splitVal = route.url.split('/');

//     this.base = splitVal[1];
//     this.page = splitVal[2];
//   }

//   public expandSubMenus(menu: MenuItem): void {
//     sessionStorage.setItem('menuValue', menu.menuValue);
//     this.sidebarData.map((mainMenus: any) => {
//       if (mainMenus.menuValue == menu.menuValue) {
//         menu.showSubRoute = !menu.showSubRoute;
//       } else {
//         mainMenus.showSubRoute = false;
//       }
//     });
//   }

//   openBoxFunc() {
//     this.openBox = !this.openBox;
//     /* eslint no-var: off */
//     var mainWrapper = document.getElementsByClassName('main-wrapper')[0];
//     if (this.openBox) {
//       mainWrapper.classList.add('open-msg-box');
//     } else {
//       mainWrapper.classList.remove('open-msg-box');
//     }
//   }

//   public toggleSideBar(): void {
//     this.sideBar.switchSideMenuPosition();
//   }
//   public toggleMobileSideBar(): void {
//     this.sideBar.switchMobileSideBarPosition();

//     this.addClass = !this.addClass;
//     /* eslint no-var: off */
//     var root = document.getElementsByTagName('html')[0];
//     /* eslint no-var: off */
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     var sidebar: any = document.getElementById('sidebar')

//     if (this.addClass) {
//       root.classList.add('menu-opened');
//       sidebar.classList.add('opened');
//     }
//     else {
//       root.classList.remove('menu-opened');
//       sidebar.classList.remove('opened');
//     }
//   }
// }

export interface Payment {
  // _id: string;
  // salesId?: string;
  // purchaseId?: string;
  id: string;
  amount: number;
  date: string;
  customer?: {
    name: string;
  };
  supplier?: {
    name: string;
  };
  user?: {
    name: string;
    avatarUrl?: string;
  };
}

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",

  styleUrls: ["./header.component.scss"],
  providers: [MessageService],
})
export class HeaderComponent {
  public routes = routes;
  public openBox = false;
  public miniSidebar = false;
  public addClass = false;
  public currentUrl = "";
  base = "";
  page = "";
  sidebarData: any;
  userData: any = {};
  latestPayments: Payment[] = [];
  public isFullScreen: boolean = false;

  // showInvoiceDialog: boolean = false; // to enable sales invoice popup
  // notificationDataShowById: any[];
  // paymentDataListById: any;
  // header = "";
  // paymentIDs: { salesId?: string; purchaseId?: string }[] = []; // Declare the paymentIDs array

  constructor(
    public router: Router,
    private sideBar: SideBarService,
    private data: DataService,
    private crypto: AESEncryptDecryptService,
    public auth: AuthService,
    public messageService: MessageService,
    // private salesService: SalesService,
    // private purchaseService: PurchaseService,
    private combinedPaymentService: CombinedPaymentService,
    private paymentservice: PaymentInService
  ) {
    this.sideBar.toggleSideBar.subscribe((res: string) => {
      if (res == "true") {
        this.miniSidebar = true;
      } else {
        this.miniSidebar = false;
      }
    });

    this.userData = this.crypto.getData("currentUser");
    let _menus: any = [];
    this.userData = this.crypto.getData("currentUser");
  }
  ngOnInit(): void {
    this.auth.getUserProfile().subscribe((user: any) => {
      this.crypto.setData("currentUser", user.data);
    });
  }
  logout() {
    localStorage.removeItem("token");
    setTimeout(() => {
      this.router.navigate([routes.login]);
    }, 200);
  }

  // toggleFullScreen(): void {
  //   if (!this.isFullScreen) {
  //     if (document.documentElement.requestFullscreen) {
  //       document.documentElement.requestFullscreen();
  //     }
  //     this.isFullScreen = true;
  //   } else {
  //     if (document.exitFullscreen) {
  //       document.exitFullscreen();
  //     }
  //     this.isFullScreen = false;
  //   }
  // }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  private getRoutes(route: { url: string }): void {
    const bodyTag = document.body;

    bodyTag.classList.remove("slide-nav");
    bodyTag.classList.remove("opened");
    this.currentUrl = route.url;

    const splitVal = route.url.split("/");

    this.base = splitVal[1];
    this.page = splitVal[2];
  }
  openBoxFunc() {
    this.openBox = !this.openBox;
    /* eslint no-var: off */
    var mainWrapper = document.getElementsByClassName("main-wrapper")[0];
    if (this.openBox) {
      mainWrapper.classList.add("open-msg-box");
    } else {
      mainWrapper.classList.remove("open-msg-box");
    }
  }
  // showInvoiceDialoge(ids: { salesId?: string, purchaseId?: string ,}) {
  //   if (ids.salesId) {
  //     // It's a sales ID
  //     console.log("Sales ID passed to invoice dialog:", ids.salesId);
  //     this.salesService.GetSalesDataById(ids.salesId).subscribe((resp: any) => {
  //       this.showInvoiceDialog = true;
  //       this.notificationDataShowById = [resp.data];
  //       this.header = "Payment Notification Invoice";
  //       console.log("Notification data by id on dialog:", this.notificationDataShowById);
  //     });

  //     this.salesService.getSalesPaymentList(ids.salesId).subscribe((resp: any) => {
  //       this.paymentDataListById = resp.data;
  //       console.log("Payment data by sales id:", this.paymentDataListById);
  //     });
  //   } else if (ids.purchaseId) {
  //     // It's a purchase ID
  //     console.log("Purchase ID passed to invoice dialog:", ids.purchaseId);
  //     this.purchaseService.GetPurchaseDataById(ids.purchaseId).subscribe((resp: any) => {
  //       this.showInvoiceDialog = true;
  //       this.notificationDataShowById = [resp.data];
  //       this.header = "Payment Notification Invoice";
  //       console.log("Notification data by id on dialog:", this.notificationDataShowById);
  //     });

  //     this.purchaseService.getPurchasePaymentList(ids.purchaseId).subscribe((resp: any) => {
  //       this.paymentDataListById = resp.data;
  //       console.log("Payment data by purchase id:", this.paymentDataListById);
  //     });
  //   }
  // }
  // close() {
  //   console.log("close dialog triggered");
  //   this.showInvoiceDialog = false;
  // }

  // callBackModal() {
  // if (this.salesId) {
  //   // Delete Sales logic
  //   this.salesService.DeleteSalesData(this.salesId).subscribe((resp: any) => {
  //     this.messageService.add({ severity: "success", detail: resp.message });
  //     this.getsales();
  //     this.getPaymentListByCustomerId();
  //     this.getsalesReturn();
  //     this.getSalesReturnPaymentListByCustomerId();
  //      this.showDialoge = false;
  //   });
  // } else if (this.salesReturnID) {
  //   // Delete Sales Return logic
  //   this.salesReturnService.deleteSalesReturn(this.salesReturnID).subscribe((resp: any) => {
  //     this.messageService.add({ severity: "success", detail: resp.message });
  //     this.getsales();
  //     this.getPaymentListByCustomerId();
  //     this.getsalesReturn();
  //     this.getSalesReturnPaymentListByCustomerId();
  //     this.showDialoge = false;
  //   });
  // }
  // else if (this.salesPaymentId) {
  //   // Delete Sales Payment logic
  //   this.salesPayment.deletePaymentById(this.salesPaymentId).subscribe((resp: any) => {
  //     this.messageService.add({ severity: "success", detail: resp.message });
  //     this.getsales();
  //     this.getPaymentListByCustomerId();
  //     this.showDialoge = false;
  //   });
  // }
  // else if (this.salesReturnPaymentId) {
  //   // Delete Sales Return logic
  //   this.salesReturnService.deleteSalesReturnPayment(this.salesReturnPaymentId).subscribe((resp: any) => {
  //     this.messageService.add({ severity: "success", detail: resp.message });
  //     this.getsalesReturn();
  //     this.getSalesReturnPaymentListByCustomerId();
  //     this.showDialoge = false;
  //   });
  // }
  // }

  loadLatestPayments(): void {
    // this.combinedPaymentService.getCombinedPayments().subscribe(
    //   (data: Payment[]) => {
    //     console.log("This is the latest 10 payments:", data);
    //     this.latestPayments = data.sort(
    //       (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    //     );
    //   },
    //   (error) => {
    //     const message = error.message;
    //     this.messageService.add({ severity: "warn", detail: message });
    //     console.error("Error fetching payments:", error);
    //   }
    // );

    this.paymentservice.getLatestPaymentList().subscribe(
      (data: any) => {
        console.log("object", data);
        this.latestPayments = data?.data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        console.log('this.latestPayments',this.latestPayments)
      },
     
      (error) => {
        const message = error.message;
        this.messageService.add({ severity: "warn", detail: message });
        console.error("Error fetching payments:", error);
      }

      
    );
  }
  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }
  public toggleMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();

    this.addClass = !this.addClass;
    /* eslint no-var: off */
    var root = document.getElementsByTagName("html")[0];
    /* eslint no-var: off */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var sidebar: any = document.getElementById("sidebar");

    if (this.addClass) {
      root.classList.add("menu-opened");
      sidebar.classList.add("opened");
    } else {
      root.classList.remove("menu-opened");
      sidebar.classList.remove("opened");
    }
  }

  logOut(){
    localStorage.removeItem('lastSelectDate')
    localStorage.removeItem('Private Key for My EMR_token')
    localStorage.removeItem('currentUser')
    this.router.navigate(['/login']);
  }
}
