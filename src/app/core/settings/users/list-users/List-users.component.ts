import { Component, OnInit } from "@angular/core";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { UsersdataService } from "../usersdata.service";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { Router } from "@angular/router";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ShowHideDirective } from "src/app/common-component/show-hide-directive/show-hide.directive";
import { routes } from "src/app/shared/routes/routes";
import { FilterPipe } from "src/app/core/filter.pipe";

@Component({
  selector: "app-edit-users",
  templateUrl: "./List-users.component.html",
  styleUrls: ["./List-users.component.scss"],
  imports: [SharedModule],
  standalone: true,
})
export class ListUsersComponent implements OnInit {
  public routes = routes;
  displayedColumns: string[] = ["firstName", "email", "status", "button"];
  public dataSource: any = [];
  usersApiData: any;
  searchDataValue = "";
  selectedProducts = [];
  originalData: any = [];
  cols = [];
  exportColumns = [];

  constructor(
    private userDataService: UsersdataService,
    private router: Router
  ) {}

  // Api for List User
  ngOnInit(): void {
    this.getuserList();
  }

  getuserList() {
    this.userDataService.GetUserData().subscribe((data) => {
      this.usersApiData = data;
      this.dataSource = this.usersApiData.data;
      this.originalData = this.usersApiData.data;
      this.cols = [
        { field: "name", header: "Name" },
        { field: "email", header: "Email" },
        { field: "phoneNumber", header: "Phone Number" },
        { field: "address", header: "Address" },
        { field: "isUserLocked", header: "Is User Locked" },
        { field: "createdOn", header: "Created On" },
        { field: "billingAddress", header: "Billing Address" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      this.exportColumns = this.dataSource.map((element) => ({
        title: element.header,
        dataKey: element.field,
      }));
      console.log("usersApiData ", this.usersApiData);
    });
  }
  goToEditPage(value: any) {
    this.router.navigate(["settings/users/edit-users/" + value]);
  }

  // delete
  deleteApiForAdd(id: any) {
    // this.userDataService.UserDeleteApi().subscribe((data)=>{
    //   console.log(data);
    // })
    console.log(id);
  }

  public searchData(value: any): void {
    this.dataSource = this.originalData.filter((i) =>
      i.name.toLowerCase().includes(value.trim().toLowerCase())
    );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.dataSource.slice(startIndex, endIndex);
  }
}
