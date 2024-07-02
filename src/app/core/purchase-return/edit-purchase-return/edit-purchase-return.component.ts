import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
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
import { PaymentOutService } from "../../payment-out/payment-out.service";
import { PurchaseReturnService } from "../purchase-return.service";
import { SlabsService } from "../../Product/slabs/slabs.service";
import { MessageService } from "primeng/api";
import { ToastModule } from "primeng/toast";
import { ActivatedRoute, Router } from "@angular/router";
import { NewPurchaseService } from "../../new-purchase/new-purchase.service";
import { LocalStorageService } from "src/app/shared/data/local-storage.service";

@Component({
  selector: "app-edit-purchase-return",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MultiSelectModule,
    DropdownModule,
    CalendarModule,
    ToastModule,
  ],
  templateUrl: "./edit-purchase-return.component.html",
  styleUrl: "./edit-purchase-return.component.scss",
  providers: [MessageService],
})
export class EditPurchaseReturnComponent {
  editPurchaseReturnForm!: FormGroup;
  public routes = routes;
  maxDate = new Date();
  PurchaseReturnDataById: any = {};
  SupplierLists: any = [];
  purchaseDataByInvoiceNumber = [];
  GridDataForSlab: any;
  // slabValuesAdd: any[];
  isProcess: any;
  supplier: any = [];
  returnUrl: string;
  purchaseReturnId: string = "";

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private PurchaseReturnService: PurchaseReturnService,
    private Service: SuppliersdataService,
    private NewPurchaseService: NewPurchaseService,
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private activeRoute: ActivatedRoute
  ) {
    this.editPurchaseReturnForm = this.fb.group({
      purchaseReturnInvoiceNumber: ["", [Validators.required]],
      purchaseReturnSupplier: ["", [Validators.required]],
      purchaseReturnDate: ["", [Validators.required]],
      purchaseReturnNotes: [""],
      purchaseReturnTotalAmount: [""],
      purchaseGrossTotal: [""],
      otherCharges: [""],
      purchaseSlab: [[]],
    });
    this.purchaseReturnId = this.activeRoute.snapshot.params["id"];
  }
  // onSuppliersSelect(_id: any) {
  //   this.GridDataForSlab = [];
  //   this.NewPurchaseService.getPurchaseWithSlabDetail(_id).subscribe(
  //     (resp: any) => {
  //       if (resp.status == "error") {
  //         this.messageService.add({ severity: "error", detail: resp.message });
  //         this.purchaseDataByInvoiceNumber=[]
  //       }
  //       this.purchaseDataByInvoiceNumber = resp.data.map((e) => ({
  //         purchaseInvoiceNumber: e.purchaseInvoiceNumber,
  //         _id: {
  //           _id: e._id,
  //         purchaseInvoiceNumber: e.purchaseInvoiceNumber,
  //         },
  //       }));
  //       // this.resetTotalAmounts()
  //     },
  //     );
  // }

  onInvoiceNumber(purchaseId: any) {
    this.GridDataForSlab = [];
    this.PurchaseReturnService.GetPurchaseDataById(purchaseId).subscribe((resp: any) => {
      this.PurchaseReturnDataById = resp.data;
      this.GridDataForSlab = [resp.data.slabDetails];
      // if (this.PurchaseReturnDataById.purchaseType == "slab") {
      //   const totalCosting = parseFloat(this.PurchaseReturnDataById.slabDetails.purchaseCost);
      //   if (!this.editPurchaseReturnForm.value.purchaseReturnTotalAmount) {
      //     this.editPurchaseReturnForm.patchValue({
      //       purchaseGrossTotal: totalCosting,
      //       purchaseReturnTotalAmount: totalCosting,
      //     });
      //   }
      // }
    }
    );
  }

  ngOnInit(): void {
    this.supplier = this.localStorageService.getItem("supplier1");
    this.returnUrl = this.localStorageService.getItem('returnUrl')
    console.log(this.returnUrl)
    
    // this.Service.GetSupplierData().subscribe((resp: any) => {
    //   this.SupplierLists = [];
    //   resp.forEach((element: any) => {
    //     this.SupplierLists.push({
    //       name: element.name,
    //       _id: {
    //         _id: element._id,
    //         name: element.name,
    //       },
    //     });
    //   });
    // });
    this.PurchaseReturnService.getPurchaseReturnById(
      this.purchaseReturnId
    ).subscribe((resp: any) => {
      this.patchForm(resp.data);
    });
  }

  calculateTotalPurchaseAmount() {
    let purchaseGrossTotal = this.editPurchaseReturnForm.get('purchaseGrossTotal').value || 0;
    let ReturnOtherCharges = this.editPurchaseReturnForm.get('otherCharges').value || 0;
    let purchaseReturnTotalAmount = purchaseGrossTotal - ReturnOtherCharges;

    this.editPurchaseReturnForm.get('purchaseReturnTotalAmount').patchValue(purchaseReturnTotalAmount);
    console.log(
      this.editPurchaseReturnForm.get('purchaseReturnTotalAmount').value); 
  }

  patchForm(data) {this.editPurchaseReturnForm.patchValue({
      purchaseReturnInvoiceNumber: data.purchaseInvoiceNumber,
      purchaseReturnSupplier: data.supplier,
      purchaseReturnDate: data.returnDate,
      otherCharges: data.purchaseReturnOtherCharges,
      purchaseReturnNotes: data.purchaseReturnNotes,
      purchaseReturnTotalAmount: data.purchaseReturnTotalAmount,
      purchaseGrossTotal: data.purchaseGrossTotal,
      purchaseReturnItemDetails: data.purchaseReturnItemDetails
    });
    this.onInvoiceNumber(data.purchaseInvoiceNumber._id);
  }

  editPurchaseReturnFormSubmit() {
    const payload = {
      id: this.purchaseReturnId,
      purchaseReturnInvoiceNumber: this.editPurchaseReturnForm.value.purchaseReturnInvoiceNumber,
      purchaseReturnSupplier: this.editPurchaseReturnForm.value.purchaseReturnSupplier,
      purchaseReturnDate: this.editPurchaseReturnForm.value.purchaseReturnDate,
      purchaseReturnOtherCharges: this.editPurchaseReturnForm.value.otherCharges,
      purchaseReturnNotes: this.editPurchaseReturnForm.value.purchaseReturnNotes,
      purchaseReturnTotalAmount: this.editPurchaseReturnForm.value.purchaseReturnTotalAmount,
      purchaseGrossTotal: this.editPurchaseReturnForm.value.purchaseGrossTotal,
      purchaseReturnItemDetails: this.GridDataForSlab,
            purchaseReturnOrderStatus: "Static",

    };
    if (this.editPurchaseReturnForm.valid) {
      this.PurchaseReturnService.updatePurchaseReturn(payload).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === "success") {
            this.messageService.add({ severity: "success", detail: resp.message });
            setTimeout(() => {
              this.router.navigateByUrl(this.returnUrl);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        }
      });
    }
    else {
      console.log("invalid form");
    }
  }
}
