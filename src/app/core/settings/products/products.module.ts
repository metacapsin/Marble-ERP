import { NgModule } from '@angular/core';
import { ProductsListComponent } from './products-list/products-list.component';
import { ProductsAddComponent } from './products-add/products-add.component';
import { ProductsEditComponent } from './products-edit/products-edit.component';
import { ProductsRoutingModule } from './products-routing.module';
import { BrowserModule } from '@angular/platform-browser';
// import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { SharedModule } from 'primeng/api';
// import { ButtonModule } from 'primeng/button';
// import { CheckboxModule } from 'primeng/checkbox';
// import { DropdownModule } from 'primeng/dropdown';
// import { TreeSelectModule } from 'primeng/treeselect';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { FormsModule } from '@angular/forms';




@NgModule({
  declarations: [],
  imports: [
    ProductsListComponent,
    ProductsAddComponent,
    ProductsEditComponent,
    ProductsRoutingModule,
  ],
  providers: [],
})
export class ProductsModule { }
