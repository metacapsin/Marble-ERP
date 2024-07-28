import { Component, OnInit } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { UsersdataService } from "../billingAddress.service";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { Router } from "@angular/router";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ShowHideDirective } from "src/app/common-component/show-hide-directive/show-hide.directive";
import { routes } from "src/app/shared/routes/routes";
import { FilterPipe } from "src/app/core/filter.pipe";
import { MessageService } from "primeng/api";

@Component({
  selector: "app-edit-billing-Address",
  templateUrl: "./List-billing-Address.component.html",
  styleUrls: ["./List-billing-Address.component.scss"],
  imports: [SharedModule],
  standalone: true,
  providers: [MessageService],
})
export class ListBillingAddressComponent implements OnInit {
  public routes = routes;
  displayedColumns: string[] = ["firstName", "email", "status", "button"];
  public dataSource: any = [];
  usersApiData: any;
  searchDataValue = "";
  selectedProducts = [];
  originalData: any = [];
  billingAddressID: any;
  modalData: { title: string; messege: string; };
  showDialog: boolean;

  constructor(
    private userDataService: UsersdataService,
    private router: Router,
    private messageService: MessageService
  ) {}

  // Api for List User
  ngOnInit(): void {
    this.getuserList();
  }

  getuserList() {
    this.userDataService.getBillingAddressList().subscribe((data) => {
      this.usersApiData = data;
      this.dataSource = this.usersApiData.data;
      this.originalData = this.usersApiData.data;
      console.log("usersApiData ", this.usersApiData);
    });
  }
  edit(id:any){
    console.log(id);
    this.router.navigate(["/settings/billing-Address/edit-billing-Address/" + id]);
  }

  delete(Id: any) {
    this.billingAddressID = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Billing Address",
    };
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.userDataService.deleteBillingAddressById(this.billingAddressID).subscribe((resp) => {
      const message = "Billing Address has been deleted";
      this.messageService.add({ severity: "success", detail: message });
      this.getuserList();
      this.showDialog = false;
    });
  }

  close() {
    this.showDialog = false;
  }
  deleteApiForAdd(id: any) {
    console.log(id);
  }
  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.dataSource.slice(startIndex, endIndex);
  }
}
