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
@Component({
  selector: 'app-block-processor-list',
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    DialogModule,
    ToastModule,
    ButtonModule],
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
  constructor(private router: Router,
  private Service: blockProcessorService, 
  private messageService: MessageService) { }
  ngOnInit() {
    this.getCustomers()
  }
  getCustomers() {
    this.Service.getAllBlockProcessorData().subscribe((data) => {
      this.blockProcessorData = data
      this.originalData = data
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
  }
  vewBlockProcessor(id) {
    console.log(id);
    this.router.navigate(["/block-processor/view-block-processor/" + id]);
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
