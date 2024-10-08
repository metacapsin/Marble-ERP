import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { routes } from "src/app/shared/routes/routes";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { SharedModule } from "src/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { blockCustomersDataService } from "../block-customer.service";

@Component({
  selector: 'app-block-customer-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    DialogModule,
    ToastModule,
    ButtonModule],
  templateUrl: './block-customer-list.component.html',
  styleUrl: './block-customer-list.component.scss',
  providers: [MessageService],
})
export class BlockCustomerListComponent {
  items: MenuItem[] = [];

  public blockCustomerData: any = []
  public originalData: any = []
  settingCategory = "";
  routes = routes;
  currentRoute!: string;
  routerChangeSubscription: Subscription;
  selectedCustomer = [];
  searchDataValue: any;
  showDialoge = false;
  modalData: any = {};
  blockCustomerId: any;
  visible: boolean = false;
  constructor(private router: Router, private Service: blockCustomersDataService, private messageService: MessageService) { }
  ngOnInit() {
    this.getCoustomers()
  }
  getCoustomers() {
    this.Service.getAllBlockCustomerData().subscribe((data) => {
      this.blockCustomerData = data
      this.originalData = data
    })
  }

  showDialog() {
    this.visible = true;
  }

  // vewCustomer(e: string) {
  //   console.log(e);
  //   this.router.navigate(["/customers/view-customers/" + e]);
  // }
  editBlockCustomer(id) {
    console.log(id);
    this.router.navigate(["/block-customer/edit-block-customer/" + id]);
  }

  deleteBlockCustomer(Id: any) {
    this.blockCustomerId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Block Customer"
    }
    this.showDialoge = true;
  }

  showNewDialog() {
    this.showDialoge = true;
  }

  callBackModal() {
    this.Service.DeleteBlockCustomer(this.blockCustomerId).subscribe((resp: any) => {
      this.messageService.add({ severity: 'success', detail: resp.message });
      this.getCoustomers();
      this.showDialoge = false;
    })
  }

  close() {
    this.showDialoge = false;
  }

  public searchData(value: any): void {
    this.blockCustomerData = this.originalData.filter(i =>
      i.name.toLowerCase().includes(value.trim().toLowerCase())
    );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.blockCustomerData.slice(startIndex, endIndex);
  }


}
