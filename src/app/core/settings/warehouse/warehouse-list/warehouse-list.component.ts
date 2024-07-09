import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { WarehouseService } from "../warehouse.service";
import { Subscription } from "rxjs";
import { FilterPipe } from "src/app/core/filter.pipe";

@Component({
  selector: "app-warehouse-list",
  standalone: true,
  templateUrl: "./warehouse-list.component.html",
  styleUrl: "./warehouse-list.component.scss",
  imports: [SharedModule],
  providers: [MessageService],
})
export class WarehouseListComponent {
  public routes = routes;
  data: any = null;
  originalData: any = [];
  public showDialog: boolean = false;
  modalData: any = {};
  warehouseID: any;
  searchDataValue = "";
  selectedProducts = [];
  currentRoute!: string;
  routerChangeSubscription: Subscription;

  isRouteActive(text) {
    if (!this.currentRoute) return "";
    let str = this.currentRoute?.includes(text);
    if (str) {
      return "active";
    } else {
      return "non-active";
    }
  }
  constructor(
    public dialog: MatDialog,
    public router: Router,
    private service: WarehouseService,
    private _snackBar: MatSnackBar,
    private messageService: MessageService
  ) {
    this.routerChangeSubscription = this.router.events.subscribe((event) => {
      this.currentRoute = this.router.url;
      // console.log(this.currentRoute)
    });
  }

  getAllWarehouseList(): void {
    this.service.getAllWarehouseList().subscribe((resp: any) => {
      this.data = resp.data;
      this.originalData = resp.data;

      console.log("API", this.data);
    });
  }

  ngOnInit(): void {
    this.getAllWarehouseList();
  }

  deleteLocation(_id: any) {
    this.warehouseID = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Warehouse",
    };
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteWarehouseById(this.warehouseID).subscribe((resp) => {
      const message = "Warehouse has been deleted";
      this.messageService.add({ severity: "success", detail: message });
      this.getAllWarehouseList();
      this.showDialog = false;
    });
  }

  close() {
    this.showDialog = false;
  }

  public searchData(value: any): void {
    this.data = this.originalData.filter((i) =>
      i.name.toLowerCase().includes(value.trim().toLowerCase())
    );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.data.slice(startIndex, endIndex);
  }
}
