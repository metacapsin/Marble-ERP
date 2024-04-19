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

  staticValues = [
    {
        product: "Product 1",
        category: "Category 1",
        brand: "Brand 1",
        salesPrice: 100,
        purchasePrice: 80,
        currentStock: 50
    },
    {
        product: "Product 2",
        category: "Category 2",
        brand: "Brand 2",
        salesPrice: 150,
        purchasePrice: 120,
        currentStock: 30
    },
    {
        product: "Product 3",
        category: "Category 1",
        brand: "Brand 1",
        salesPrice: 80,
        purchasePrice: 60,
        currentStock: 70
    },
    {
      product: "Product 4",
      category: "Category 2",
      brand: "Brand 3",
      salesPrice: 120,
      purchasePrice: 90,
      currentStock: 40
  },
  {
      product: "Product 5",
      category: "Category 3",
      brand: "Brand 2",
      salesPrice: 200,
      purchasePrice: 150,
      currentStock: 20
  },
  {
      product: "Product 6",
      category: "Category 1",
      brand: "Brand 3",
      salesPrice: 90,
      purchasePrice: 70,
      currentStock: 60
  },
  {
      product: "Product 7",
      category: "Category 2",
      brand: "Brand 1",
      salesPrice: 110,
      purchasePrice: 85,
      currentStock: 55
  },
  {
      product: "Product 8",
      category: "Category 3",
      brand: "Brand 2",
      salesPrice: 170,
      purchasePrice: 130,
      currentStock: 25
  },
  {
      product: "Product 9",
      category: "Category 1",
      brand: "Brand 3",
      salesPrice: 95,
      purchasePrice: 75,
      currentStock: 65
  },
  {
      product: "Product 10",
      category: "Category 2",
      brand: "Brand 1",
      salesPrice: 140,
      purchasePrice: 100,
      currentStock: 45
  }
  
    
]



  constructor(public dialog: MatDialog, public router: Router, private service: ProductsService, private _snackBar: MatSnackBar, private messageService: MessageService) { }

  getProductList(): void {
    this.service.getProductList().subscribe((resp: any) => {
      this.data = resp.data;
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

  // public searchData(value: any): void {
  //   // this.dataSource.filter = value.trim().toLowerCase();
  //   // this.patientsList = this.dataSource.filteredData;
  // }

  public searchData(value: any): void {
    this.data = this.originalData.map(i => {
        if(i.name.toLowerCase().includes(value.trim().toLowerCase())){
          return i;
        }
    });
}

}
