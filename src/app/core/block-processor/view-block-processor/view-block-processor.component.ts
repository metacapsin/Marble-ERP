import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TableModule } from "primeng/table";
import { TabViewModule } from "primeng/tabview";
import { routes } from "src/app/shared/routes/routes";
import { blockProcessorService } from "../block-processor.service";
import { PaymentOutService } from "../../payment-out/payment-out.service";
import { PurchaseService } from "../../purchase/purchase.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { DialogModule } from "primeng/dialog";
import { DropdownModule } from "primeng/dropdown";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-view-block-processor",
  standalone: true,
  imports: [RouterModule, CommonModule, TabViewModule, SharedModule, ButtonModule, DialogModule, TableModule, DropdownModule],
  templateUrl: "./view-block-processor.component.html",
  styleUrl: "./view-block-processor.component.scss",
  providers: [MessageService]
})
export class ViewBlockProcessorComponent {
  routes = routes;
  addSlabProcessingForm!: FormGroup;
  id: any;
  blockProcessorData:any = {};
  paymentListData: any[] = [];
  slabProcessingDataList: any[] = [];

  slabListData: any[] = [];
  searchDataValue = "";
  addSlabVisible: boolean = false;

  constructor(
    private activeRoute: ActivatedRoute,
    private blockProcessorService: blockProcessorService,
    private PaymentOutService: PaymentOutService,
    private purchaseService: PurchaseService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.addSlabProcessingForm = this.fb.group({
      processingInvoiceNo: [''],
      processor: [''],
      slab: [''],
      processingCost: [''],
      note: [''],
    });
    this.id = this.activeRoute.snapshot.params["id"];
  }
  addSlabProcessing(){
    this.addSlabProcessingForm.reset()
    this.addSlabVisible = true
  }
  ngOnInit() {
    this.getBlockProcessor();

    this.blockProcessorService.getSlabsByProcessorId(this.id).subscribe((resp:any) => {
      this.slabListData = resp.data.map(e => ({
        slabName: e.slabName,
              _id: {
                _id: e._id,
                slabName: e.slabName,
                slabNo: e.slabNo,
                processingCost: e.purchaseCost
              }
      }));
      console.log(this.blockProcessorData);
      
    })

    this.PaymentOutService.getPurchasePaymentList().subscribe(
      (resp: any) => {
        console.log("payments of customer",resp)
        
        this.paymentListData = resp.data;

      }
    );
    this.blockProcessorService.getAllSlabProcessing().subscribe(
      (resp: any) => {
        this.slabProcessingDataList = resp.data;
      }
    );

  }
  getBlockProcessor() {
    this.blockProcessorService.getBlockProcessorDataById(this.id).subscribe((data: any) => {
      this.blockProcessorData = data; 
      console.log(this.blockProcessorData);
    });
  }

  onSlabSelect(value:any){
    this.addSlabProcessingForm.get('processingCost').patchValue(value.processingCost)
  }

  addSlabProcessingFormSubmit(){
    const payload = {
      processor: {
        _id: this.blockProcessorData._id,
        name: this.blockProcessorData.name,
      },
      slab: [
        this.addSlabProcessingForm.value.slab
      ],
      processingCost: this.addSlabProcessingForm.value.processingCost,
      processingInvoiceNo: this.addSlabProcessingForm.value.processingInvoiceNo,
      note: this.addSlabProcessingForm.value.note,
    };

    if(this.addSlabProcessingForm.valid){
      this.blockProcessorService.addSlabProcessing(payload).subscribe((resp:any) => {
        if (resp) {
          if (resp.status === "success") {
            this.addSlabVisible = false;
            const message = "Slab Processing has been added";
            this.messageService.add({ severity: "success", detail: message });
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }else{
      console.log("Form is Invalid");
      
    }
  }

  searchData(value: any){

  }


}
