import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MenuItem, MessageService } from "primeng/api";
import { Subscription } from "rxjs";
import { routes } from "src/app/shared/routes/routes";
import { GeneralPartiesService } from "./general-parties.service";

@Component({
  selector: "app-general-parties",
  templateUrl: "./general-parties.component.html",
  styleUrls: ["./general-parties.component.scss"],
})
export class GeneralPartiesComponent {
  items: MenuItem[] = [];
  settingCategory = "";
  routes = routes;
  currentRoute!: string;
  routerChangeSubscription: Subscription;
  selectedProducts = [];
  searchDataValue: any;
  getGeneralPartiesShow: any;
  generalPartiesId: any;
  showDialoge = false;
  modalData: any = {};
  originalData: any = [];
  cols = [];
  exportColumns = [];
  visible = false;
  file: File | null = null;

  constructor(
    private router: Router,
    private Service: GeneralPartiesService,
    private messageService: MessageService
  ) {
    this.routerChangeSubscription = this.router.events.subscribe((event) => {
      this.currentRoute = this.router.url;
    });
  }

  ngOnInit() {
    this.getGeneralParties();
  }

  getGeneralParties() {
    this.Service.GetGeneralPartiesData().subscribe((data) => {
      this.getGeneralPartiesShow = data;
      this.originalData = data;
      this.cols = [
        { field: "name", header: "Name" },
        { field: "email", header: "Email" },
        { field: "status", header: "Status" },
        { field: "billingAddress", header: "Billing Address" },
        { field: "taxNo", header: "Tax No" },
        { field: "phoneNo", header: "Phone No" },
        { field: "createdOn", header: "Created On" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
    });
  }

  onPageChange(event: any) {
    // Handle page change event
  }

  generalPartiesView(id: any) {
    this.router.navigate(["/general-parties/view-general-parties/" + id]);
  }

  editGeneralParties(id: any) {
    this.router.navigate(["/general-parties/edit-general-parties/" + id]);
  }

  deleteGeneralParties(id: any) {
    this.generalPartiesId = id;
    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this General Party",
    };
    this.showDialoge = true;
  }

  callBackModal() {
    this.Service.DeleteGeneralPartyApi(this.generalPartiesId).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: "success",
          summary: "Success",
          detail: "General party deleted successfully",
        });
        this.getGeneralParties();
        this.showDialoge = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Error",
          detail: "Error deleting general party",
        });
        console.error("Error:", error);
      },
    });
  }

  close() {
    this.showDialoge = false;
  }
} 