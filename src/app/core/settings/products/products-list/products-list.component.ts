import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products-list',
  standalone: true,
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
  imports: [CommonModule,SharedModule,ButtonModule, ToastModule],
  providers: [MessageService]
})
export class ProductsListComponent {
  public routes = routes;
  data: any = null;
  originalData:any = []
  public showDialog: boolean = false;
  modalData: any = {}
  productsID: any;
  searchDataValue = "";
  selectedProducts = [];





  constructor(public dialog: MatDialog, public router: Router, private service: ProductsService, private _snackBar: MatSnackBar, private messageService: MessageService) { }

  getProductList(): void {
    this.service.getProductList().subscribe((resp: any) => {
      this.data = resp.data;
      // map(product=>{
      //   product.currentStock=product.openingStock-product.
      // })
      this.originalData = resp.data;

      console.log("API", this.data);

    })
  }

  ngOnInit(): void {
    this.getProductList();
  }

  deleteProduct(_id: any) {
    this.productsID = _id;

    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this Product",
    }
    this.showDialog = true;
  }

  showNewDialog() {
    this.showDialog = true;
  }

  callBackModal() {
    this.service.deleteProductById(this.productsID).subscribe(resp => {
      const message = "Product has been deleted"
      this.messageService.add({ severity: 'success', detail: message });
      this.getProductList();
      this.showDialog = false;

    })
  }

  close() {
    this.showDialog = false;
  }

  public searchData(value: any): void {
    this.data = this.originalData.filter(i =>
    i.name.toLowerCase().includes(value.trim().toLowerCase())
  );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows; 
    const currentPageData = this.data.slice(startIndex, endIndex);
  }

}
