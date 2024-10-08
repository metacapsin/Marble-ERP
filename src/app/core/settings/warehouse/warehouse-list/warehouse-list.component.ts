import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  Renderer2,
  ViewChild,
} from "@angular/core";
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
  cols = [];
  exportColumns = [];
  

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
    private messageService: MessageService,
    private renderer: Renderer2,
    private elRef: ElementRef
  ) {
    // this.clickListener = this.renderer.listen('document', 'click', this.onClickOutside.bind(this));
    this.routerChangeSubscription = this.router.events.subscribe((event) => {
      this.currentRoute = this.router.url;
      // console.log(this.currentRoute)
    });
  }
  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent) {
    const overlay = document.querySelector(".p-column-filter-overlay");
    if (overlay != null) {
      console.log(overlay.classList);
      overlay.classList.add('none'); 
      return;
    }
    if (overlay && !this.elRef.nativeElement.contains(event.target as Node)) {
      console.log(overlay.className, overlay.classList);
    }
  }
  getAllWarehouseList(): void {
    this.service.getAllWarehouseList().subscribe((resp: any) => {
      this.data = resp.data;
      this.originalData = resp.data;
      this.cols = [
        { field: "name", header: "Name" },
        { field: "email", header: "Email" },
        { field: "phone", header: "Phone" },
        { field: "billingAddress", header: "Billing Address" },
        { field: "termsCondition", header: "Terms Condition" },
        { field: "createdOn", header: "Created On" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.data.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));
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
    this.service.deleteWarehouseById(this.warehouseID).subscribe((resp: any) => {
      if(resp.status == 'success') {
        this.messageService.add({ severity: "success", detail: resp.message });
        this.getAllWarehouseList();
        this.showDialog = false;
      } else {
        this.messageService.add({ severity: "error", detail: resp.message });
        this.showDialog = false;
      }
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
