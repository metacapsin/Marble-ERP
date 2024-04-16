import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
@Component({
  selector: 'app-addsales',
  standalone: true,
  imports: [CommonModule,SharedModule, MultiSelectModule, DropdownModule,CalendarModule ],
  templateUrl: './addsales.component.html',
  styleUrl: './addsales.component.scss'
})
export class AddsalesComponent {
public routes = routes;
CustomerList=[
  {customerName:"Adnan"},
  {customerName:"Nadim"},
  {customerName:"Kavya"},
]
productsList=[
  {productsName:'Earphone'},
  {productsName:'Mobiles'},
  {productsName:'Computers'}
]
orderStatusList=[
  {orderStatus:"Ordered"},
  {orderStatus:"Confirmed"},
  {orderStatus:"Processing"},
  {orderStatus:"Shipping"},
  {orderStatus:"Delivered"},
]
// public checkboxes: string[] = [];
public itemDetails:  number[] = [0];
public chargesArray: number[]= [0];
public recurringInvoice   = false;
public selectedValue! : string  ;
date = new FormControl(new Date());

// public openCheckBoxes(val: string) {
//   if (this.checkboxes[0] != val) {
//     this.checkboxes[0] = val;
//   } else {
//     this.checkboxes = [];
//   }
// }
addItem() {
  this.itemDetails.push(0);
}
deleteItem(index:number){
  this.itemDetails.splice(index,1)
}
addCharges(){
  this.chargesArray.push(1)
}
deleteCharges(index:number){
  this.chargesArray.splice(index, 1)
}
recurringInvoiceFunc(){
  this.recurringInvoice = !this.recurringInvoice
}
// selecedList: data[] = [
//   {value: 'By month'},
//   {value: 'March'},
//   {value: 'April'},
//   {value: 'May'},
//   {value: 'June'},
//   {value: 'July'}
// ];
}
