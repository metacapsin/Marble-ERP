import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { SharedModule } from "src/app/shared/shared.module";
import { StepperModule } from "primeng/stepper";
import { ButtonModule } from "primeng/button";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CalendarModule } from "primeng/calendar";
import { DropdownModule } from "primeng/dropdown";
import { AddLotComponent } from "../../Product/lot/add-lot/add-lot.component";

@Component({
  selector: "app-add-new-purchase",
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    StepperModule,
    ButtonModule,
    CalendarModule,
    AddLotComponent,
    DropdownModule,
  ],
  templateUrl: "./add-new-purchase.component.html",
  styleUrl: "./add-new-purchase.component.scss",
})
export class AddNewPurchaseComponent {
  public routes = routes;
  maxDate = new Date();
  SupplierLists:any[] = [
    { id: 1, name: 'Supplier 1' },
    { id: 2, name: 'Supplier 2' },
    { id: 3, name: 'Supplier 3' }
  ];
  lotsNoArray = [
    { name: "Lot", _id: "lot" },
    { name: "Slabs", _id: "slab" },
  ];
  addNewPurchaseForm!: FormGroup;
  lotTypeValue: any;
  constructor(private router: Router, private fb: FormBuilder) {
    this.addNewPurchaseForm = this.fb.group({
      supplier: [""],
      invoiceNumber: [""],
      purchaseDate: [""],
      purchaseType: [""],
      purchaseCost: [""],
      lotWeight: [''],
    });
  }
  lotType(value:any){
    console.log("1",value);
    this.lotTypeValue = value; 
    // if(value == "lot"){

    // }
    // if(value == "slab"){

    // }
  }
  addNewPurchaseFormSubmit(){
    console.log("object");
  }
}
