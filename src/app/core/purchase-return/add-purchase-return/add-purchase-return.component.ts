import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { CalendarModule } from "primeng/calendar";
import { TaxesService } from "../../settings/taxes/taxes.service";
import { UnitsService } from "../../settings/units/units.service";
import { SubCategoriesService } from "../../settings/sub-categories/sub-categories.service";
import { CategoriesService } from "../../settings/categories/categories.service";
import { SuppliersdataService } from "../../Suppliers/suppliers.service";
import { NewPurchaseService } from "../../new-purchase/new-purchase.service";
import { PurchaseReturnService } from "../purchase-return.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { Router } from "@angular/router";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

@Component({
  selector: "app-add-purchase-return",
  standalone: true,
  imports: [SharedModule],
  templateUrl: "./add-purchase-return.component.html",
  styleUrl: "./add-purchase-return.component.scss",
  providers: [MessageService],
})
export class AddPurchaseReturnComponent implements OnInit {
  addPurchaseReturnForm!: FormGroup;
  public routes = routes;
  maxDate = new Date();
  PurchaseReturnDataById: any = {};
  selectedSlabs: any[] = [];
  SupplierLists: any = [];
  purchaseDataByInvoiceNumber = [];
  GridDataForSlab: any;
  // slabValuesAdd: any[];
  isProcess: any;
  supplier: any = [];
  returnUrl: string;
  returnMaxValue: number = 0;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private PurchaseReturnService: PurchaseReturnService,
    private Service: SuppliersdataService,
    private NewPurchaseService: NewPurchaseService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService
  ) {
    this.addPurchaseReturnForm = this.fb.group({
      purchaseReturnInvoiceNumber: ["", [Validators.required]],
      purchaseReturnSupplier: ["", [Validators.required]],
      purchaseReturnDate: ["", [Validators.required]],
      purchaseReturnNotes: [""],
      purchaseReturnTotalAmount: [""],
      purchaseGrossTotal: [""],
      otherCharges: ["", [Validators.min(0), Validators.max(100000)]],
      purchaseSlab: [[]],
    });
  }
  onSuppliersSelect(_id: any) {
    // this.GridDataForLot = [];
    this.GridDataForSlab = [];
    // this.purchaseSlabData = [];
    // this.selectedLots = [];
    this.NewPurchaseService.getPurchaseWithSlabDetail(_id).subscribe(
      (resp: any) => {
        if (resp.status == "error") {
          this.messageService.add({ severity: "error", detail: resp.message });
        }
       
        this.purchaseDataByInvoiceNumber = resp.data.map((e) => ({
          _id: e._id,
          purchaseInvoiceNumber: e.purchaseInvoiceNumber,
        }));
      }

      // (error) => {
      //   console.error("Error fetching data from service", error);
      // }
    );
    console.log(this.purchaseDataByInvoiceNumber);
  }

  calculateTotalPurchaseAmount() {
    let purchaseGrossTotal =
      this.addPurchaseReturnForm.get("purchaseGrossTotal").value || 0;
      console.log('purchaseGrossTotal',purchaseGrossTotal)
    let ReturnOtherCharges =
      this.addPurchaseReturnForm.get("otherCharges").value || 0;
    let purchaseReturnTotalAmount = purchaseGrossTotal - ReturnOtherCharges;

    console.log("ReturnOtherCharges",ReturnOtherCharges);
    
    this.addPurchaseReturnForm
      .get("purchaseReturnTotalAmount")
      .patchValue(purchaseReturnTotalAmount);
    console.log(
      this.addPurchaseReturnForm.get("purchaseReturnTotalAmount").value
    );
  }

  onInvoiceNumber(purchaseId: any) {
    this.GridDataForSlab = [];
    this.PurchaseReturnService.GetPurchaseDataById(purchaseId).subscribe(
      (resp: any) => {
        this.PurchaseReturnDataById = resp.data;
        this.GridDataForSlab = resp.data.slabDetails;
        console.log('this.GridDataForSlab',this.GridDataForSlab)
        if (this.PurchaseReturnDataById.purchaseType == "slab") {
          const totalCosting = this.PurchaseReturnDataById.slabDetails.reduce(
            (sum, slab) => sum + parseFloat(slab.purchaseCost || 0), 
            0
          );
          this.returnMaxValue = totalCosting;
          
          if (!isNaN(totalCosting)) {
            this.addPurchaseReturnForm.patchValue({
              purchaseGrossTotal: totalCosting,
              purchaseReturnTotalAmount: totalCosting,
            });
          }
        }
      }
    );
  }

  ngOnInit(): void {
    this.getSupplierData();

    this.supplier = this.localStorageService.getItem("supplier1");
    this.returnUrl = this.localStorageService.getItem("returnUrl");
    console.log(this.returnUrl);

    if (this.supplier) {
      this.addPurchaseReturnForm.patchValue({
        purchaseReturnSupplier: this.supplier,
      });
      this.onSuppliersSelect(this.supplier._id);
    }

    this.getSupplierData();
  }

  getSupplierData() {
    this.Service.GetSupplierData().subscribe((resp: any) => {
      this.SupplierLists = [];
      resp.forEach((element: any) => {
        this.SupplierLists.push({
          name: element.name,
          _id: {
            _id: element._id,
            name: element.name,
            billingAddress: element.billingAddress,
          },
        });
      });
    });
  }
  addPurchaseReturnFormSubmit() {

    // console.log('selectedSlabs',this.selectedSlabs)

    if(this.selectedSlabs.length <= 0){
      const message = "Oops! Please select Slab";
      this.messageService.add({ severity: "error", detail: message });

      return
    }

    const payload = {
      purchaseReturnInvoiceNumber:
        this.addPurchaseReturnForm.value.purchaseReturnInvoiceNumber,
      purchaseReturnSupplier:
        this.addPurchaseReturnForm.value.purchaseReturnSupplier,
      purchaseReturnDate: this.addPurchaseReturnForm.value.purchaseReturnDate,
      purchaseReturnOtherCharges: Number(this.addPurchaseReturnForm.value.otherCharges),
      purchaseReturnNotes: this.addPurchaseReturnForm.value.purchaseReturnNotes,
      purchaseReturnTotalAmount:
        Number(this.addPurchaseReturnForm.value.purchaseReturnTotalAmount),
      purchaseGrossTotal: Number(this.addPurchaseReturnForm.value.purchaseGrossTotal),
      purchaseReturnItemDetails: this.selectedSlabs,
      // purchaseReturnOrderStatus: "Static",
      
    };
    console.log(payload);
    if (this.addPurchaseReturnForm.valid) {
      console.log("valid form");
      if(this.GridDataForSlab[0].totalSQFT === 0){
        const message = "This Purchase has been already return!";
        this.messageService.add({ severity: "error", detail: message });
      } else if (payload.purchaseReturnOtherCharges >= payload.purchaseReturnTotalAmount) {
        const message = "Return Other Charges cannot be greater than or equal to the Total Amount.";
        this.messageService.add({ severity: "error", detail: message });
    } 
      else {
        this.PurchaseReturnService.createPurchaseReturn(payload).subscribe(
          (resp: any) => {
            console.log(resp);
            if (resp) {
              if (resp.status === "success") {
                this.messageService.add({
                  severity: "success",
                  detail: resp.message,
                });
                setTimeout(() => {
                  this.router.navigateByUrl(this.returnUrl);
                }, 400);
              } else {
                const message = resp.message;
                this.messageService.add({ severity: "error", detail: message });
              }
            }
          }
        );

      }
    } else {
      console.log("invalid form");
    }
  }
}
