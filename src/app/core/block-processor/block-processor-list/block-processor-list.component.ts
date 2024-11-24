import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { routes } from "src/app/shared/routes/routes";
import { DialogModule } from "primeng/dialog";
import { ButtonModule } from "primeng/button";
import { ToastModule } from "primeng/toast";
import { SharedModule } from "src/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { blockCustomersDataService } from "../../processing/block-customer/block-customer.service";
import { blockProcessorService } from "../block-processor.service";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";
import { FilterPipe } from "../../filter.pipe";
@Component({
  selector: 'app-block-processor-list',
  standalone: true,
  imports: [
    SharedModule,
    ],
  templateUrl: './block-processor-list.component.html',
  styleUrl: './block-processor-list.component.scss',
  providers: [MessageService],
})
export class BlockProcessorListComponent {

  public blockProcessorData: any = []
  public originalData: any = []
  settingCategory = "";
  routes = routes;
  selectedCustomer = [];
  searchDataValue: any;
  showDialoge = false;
  modalData: any = {};
  blockProcessorId: any;
  visible: boolean = false;
  currentUrl: any;
  cols = [];
  exportColumns = [];
  constructor(private router: Router,
  private Service: blockProcessorService, 
  private messageService: MessageService,private localStorageService:LocalStorageService
) { }
  ngOnInit() {
    this.getCustomers()
    this.currentUrl = this.router.url;
    console.log(this.currentUrl)
    console.log("this is current url on purchase page",this.currentUrl)

    // this.localStorageService.removeItem('returnUrl'); 
  }
  getCustomers() {
    this.Service.getAllBlockProcessorData().subscribe((data) => {
      this.blockProcessorData = data
      this.originalData = data;

      this.cols = [
        { field: "name", header: "Name" },
        { field: "email", header: "Email" },
        { field: "phoneNo", header: "Phone No" },
        { field: "status", header: "Status" },
        { field: "createdOn", header: "Created On" },
      ];

      this.exportColumns = this.cols.map((col) => ({
        title: col.header,
        dataKey: col.field,
      }));
      // this.exportColumns = this.blockProcessorData.map((element) => ({
      //   title: element.header,
      //   dataKey: element.field,
      // }));

      console.log(
        data
      );
    })
  }

  showDialog() {
    this.visible = true;
  }
  editBlockProcessor(id) {
    console.log(id);
    this.router.navigate(["/block-processor/edit-block-processor/" + id]);
    const returnUrl = this.router.url;
    this.localStorageService.setItem('returnUrl',returnUrl);
  }
  vewBlockProcessor(id) {
    console.log(id);
    this.router.navigate(["/block-processor/view-block-processor/" + id]);
  }
  navigateToCreateBlockProcessor() {
    const returnUrl = this.router.url;
    this.router.navigate(["/block-processor/add-block-processor/"]);
    this.localStorageService.setItem('returnUrl',returnUrl);

    // this.router.navigate(['/purchase/add-purchase'], { state: { returnUrl: this.currentUrl } });
  }

  deleteBlockProcessor(Id: any) {
    this.blockProcessorId = Id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure you want to delete this Block Processor"
    }
    this.showDialoge = true;
  }

  showNewDialog() {
    this.showDialoge = true;
  }

  callBackModal() {
    this.Service.DeleteBlockProcessor(this.blockProcessorId).subscribe((resp: any) => {
      this.messageService.add({ severity: 'success', detail: resp.message });
      this.getCustomers();
      this.showDialoge = false;
    })
  }

  close() {
    this.showDialoge = false;
  }

  public searchData(value: any): void {
    this.blockProcessorData = this.originalData.filter(i =>
      i.name.toLowerCase().includes(value.trim().toLowerCase())
    );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows;
    const currentPageData = this.blockProcessorData.slice(startIndex, endIndex);
  }


}
