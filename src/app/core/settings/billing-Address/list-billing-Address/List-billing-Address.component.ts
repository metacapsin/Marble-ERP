import { Component, OnInit } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { BillingAddressService } from "../billingAddress.service";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { Router } from "@angular/router";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ShowHideDirective } from "src/app/common-component/show-hide-directive/show-hide.directive";
import { routes } from "src/app/shared/routes/routes";
import { FilterPipe } from "src/app/core/filter.pipe";
import { MessageService } from "primeng/api";
import { __values } from "tslib";

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
  modalData: { title: string; messege: string };
  showDialog: boolean;
  cols: (
    | { field: string; header: string; customExportHeader: string }
    | { field: string; header: string; customExportHeader?: undefined }
  )[];
  exportColumns: { title: string; dataKey: string }[];

  constructor(
    private userDataService: BillingAddressService,
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

      this.cols = [
        { field: "companyName", header: "Company Name" },
        { field: "country.name", header: "Country Name" },
        { field: "addressLine1", header: "Address Line 1" },
        { field: "addressLine2", header: "Address Line 2" },
        { field: "state", header: "State" },
        { field: "city", header: "City" },
        { field: "phoneNumber", header: "Phone Number" },
        { field: "email", header: "Email" },
        { field: "postalCode", header: "Postal Code" },
        { field: "setAsDefault", header: "Set As Default" },
        { field: "createdOn", header: "Created On" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.dataSource.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
      console.log("usersApiData ", this.usersApiData);
    });
  }
  edit(id: any) {
    this.router.navigate([
      "/settings/billing-Address/edit-billing-Address/" + id,
    ]);
  }

  delete(values: any) {
    console.log(values);
    // debugger
    if (values.setAsDefault == true) {
      const message = "Please add default a address first";
      return this.messageService.add({ severity: "error", detail: message });
    } else {
      this.billingAddressID = values._id;

      this.modalData = {
        title: "Delete",
        messege: "Are you sure you want to delete this Billing Address",
      };
      this.showDialog = true;
    }
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.userDataService
      .deleteBillingAddressById(this.billingAddressID)
      .subscribe((resp) => {
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
