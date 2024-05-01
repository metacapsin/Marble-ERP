import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { MessageService, TreeNode } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductsService } from '../products.service';
import { TreeModule } from 'primeng/tree';
import { TreeSelectModule } from 'primeng/treeselect';
import { UnitsService } from '../../units/units.service';
import { CategoriesService } from '../../categories/categories.service';
import { SubCategoriesService } from '../../sub-categories/sub-categories.service';
import { TaxesService } from '../../taxes/taxes.service';
import { WarehouseService } from '../../warehouse/warehouse.service';


@Component({
  selector: 'app-products-edit',
  standalone: true,
  templateUrl: './products-edit.component.html',
  styleUrl: './products-edit.component.scss',
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    ButtonModule,
    CheckboxModule,
    TreeSelectModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    TooltipModule,
    TreeSelectModule, // Make sure to import TreeSelectModule
    ToastModule,
],
  providers: [MessageService],
})
export class ProductsEditComponent {

  public routes = routes;
  productForm!: FormGroup;
  data: any;
  productId: any;


  warehouseList = [
    // { label: 'Bijainagar Chanda Colony', value: 'Bijainagar Chanda Colony' },
    // { label: 'Pipli Chouraha', value: 'Pipli Chouraha' },
    // { label: 'Rajdarbar', value: 'Rajdarbar' },
    // { label: 'Pragya College', value: 'Ambulance' },
    // { label: 'Rajnagar', value: 'Rajnagar' },
    // { label: 'Sathana Bazar', value: 'Sathana Bazar' },
    // { label: 'Bapu Bazar', value: 'Bapu Bazar' },
  ]


  
  subCategeoryList= []
  categeoryList: any = [
  //   {
  //     key: "0",
  //     label: "Electronics",
  //     data: "Electronics Folder",
  //     // icon: "fa-solid fa-bolt-lightning",
  //     children: [
  //       // Audio section
  //       {
  //         key: "0-0",
  //         label: "Audio",
  //         data: "Audio Folder",
  //         // icon: "fa-solid fa-bolt-lightning",
  //         children: [
  //           {
  //             key: "0-0-0",
  //             label: "Headphones",
  //             data: "Headphones Folder",
  //             // icon: "fa-solid fa-bolt-lightning",
  //           },
  //           {
  //             key: "0-0-1",
  //             label: "Soundbars",
  //             data: "Soundbars Folder",
  //             // icon: "fa-solid fa-bolt-lightning",
  //           },
  //         ],
  //       },
  
  //       // Mobile Section
  //       {
  //         key: "0-1",
  //         label: "Mobiles",
  //         data: "Mobiles Folder",
  //         // icon: "fa-solid fa-bolt-lightning",
  //       },
  
  //       // Televisions Section
  //       {
  //         key: "0-2",
  //         label: "Televisions",
  //         data: "Televisions Folder",
  //         // icon: "fa-solid fa-bolt-lightning",
  //         // children: [
  //         //     {
  //         //         key: '0-2-0',
  //         //         label: 'Headphones',
  //         //         data: 'Headphones Folder',
  //         //         icon: 'fa-solid fa-bolt-lightning',
  //         //     },
  //         //     {
  //         //         key: '0-2-1',
  //         //         label: 'Soundbars',
  //         //         data: 'Soundbars Folder',
  //         //         icon: 'fa-solid fa-bolt-lightning',
  //         //     },
  
  //         //         ]
  //       },
  
  //       // Computers Section
  //       {
  //         key: "0-3",
  //         label: "Computers",
  //         data: "Computers Folder",
  //         // icon: "fa-solid fa-bolt-lightning",
  //         children: [
  //           {
  //             key: "0-3-0",
  //             label: "Laptops",
  //             data: "Laptops Folder",
  //             // icon: "fa-solid fa-bolt-lightning",
  //           },
  //           {
  //             key: "0-3-1",
  //             label: "Desktops",
  //             data: "Desktops Folder",
  //             // icon: "fa-solid fa-bolt-lightning",
  //           },
  //           {
  //             key: "0-3-2",
  //             label: "Computer",
  //             data: "Computer Folder",
  //             // icon: "fa-solid fa-bolt-lightning",
  //             children: [
  //               {
  //                 key: "0-3-2-0",
  //                 label: "Peripheral",
  //                 data: "Peripheral Folder",
  //                 // icon: "fa-solid fa-bolt-lightning",
  //               },
  //               {
  //                 key: "0-3-2-1",
  //                 label: "Monitors",
  //                 data: "Monitors Folder",
  //                 // icon: "fa-solid fa-bolt-lightning",
  //               },
  //               {
  //                 key: "0-3-2-2",
  //                 label: "Printers",
  //                 data: "Printers Folder",
  //                 // icon: "fa-solid fa-bolt-lightning",
  //               },
  //             ],
  //           },
  //         ],
  //       },
  //     ],
  //   },
  
  //   // Fashion section
  //   {
  //     key: "1",
  //     label: "Fashion",
  //     data: "Fashion Folder",
  //     // icon: "fa-solid fa-bolt-lightning",
  //     children: [
  //       // Clothes section
  //       {
  //         key: "1-0",
  //         label: "Clothes",
  //         data: "Clothes Folder",
  //         // icon: "fa-solid fa-bolt-lightning",
  //         // children: [
  //         //     {
  //         //         key: '1-0-0',
  //         //         label: 'Headphones',
  //         //         data: 'Headphones Folder',
  //         //         icon: 'fa-solid fa-bolt-lightning',
  //         //     },
  //         //     {
  //         //         key: '1-0-1',
  //         //         label: 'Soundbars',
  //         //         data: 'Soundbars Folder',
  //         //         icon: 'fa-solid fa-bolt-lightning',
  //         //     },
  
  //         // ]
  //       },
  
  //       // Mobile Section
  //       {
  //         key: "1-1",
  //         label: "Shoes",
  //         data: "Shoes Folder",
  //         // icon: "fa-solid fa-bolt-lightning",
  //       },
  
  //       // Televisions Section
  //       // {
  //       //     key: '1-2',
  //       //     label: 'Televisions',
  //       //     data: 'Televisions Folder',
  //       //     icon: 'fa-solid fa-bolt-lightning',
  //       //     children: [
  //       //         {
  //       //             key: '1-2-0',
  //       //             label: 'Headphones',
  //       //             data: 'Headphones Folder',
  //       //             icon: 'fa-solid fa-bolt-lightning',
  //       //         },
  //       //         {
  //       //             key: '1-2-1',
  //       //             label: 'Soundbars',
  //       //             data: 'Soundbars Folder',
  //       //             icon: 'fa-solid fa-bolt-lightning',
  //       //         },
  
  //       //             ]
  //       // },
  //     ],
  //   },
  
  //   // Grocery section
  //   {
  //     key: "2",
  //     label: "Grocery",
  //     data: "Grocery Folder",
  //     // icon: "fa-solid fa-bolt-lightning",
  //   },
  
  // //   Home and Furnitures Section
  //   {
  //     key: "3",
  //     label: "Home and Furnitures",
  //     data: "Home and Furnitures Folder",
  //     // icon: "fa-solid fa-bolt-lightning",
  //   },
  
  //   Baby & Kids Section
  //   {
  //     key: "4",
  //     label: "Baby & Kids",
  //     data: "Baby & Kids Folder",
  //     // icon: "fa-solid fa-bolt-lightning",
  //   },
  
  // //   Main Category 1 Section
  //   {
  //     key: "5",
  //     label: "Main Category 1",
  //     data: "Main Category 1 Folder",
  //     // icon: "fa-solid fa-bolt-lightning",
  //     children: [
  //       // Clothes section
  //       {
  //         key: "5-0",
  //         label: "Category 1",
  //         data: "Category 1 Folder",
  //         // icon: "fa-solid fa-bolt-lightning",
  //         // children: [
  //         //     {
  //         //         key: '1-0-0',
  //         //         label: 'Headphones',
  //         //         data: 'Headphones Folder',
  //         //         icon: 'fa-solid fa-bolt-lightning',
  //         //     },
  //         //     {
  //         //         key: '1-0-1',
  //         //         label: 'Soundbars',
  //         //         data: 'Soundbars Folder',
  //         //         icon: 'fa-solid fa-bolt-lightning',
  //         //     },
  
  //         // ]
  //       },
  //     ],
  //   },
  ];

  unitList= [
    // { label: "Meter", value: "m" },
    // { label: "Liter", value: "L" },
    // { label: "Kilogram", value: "kg" },
    // { label: "Gram", value: "g" },
    // { label: "Centimeter", value: "cm" },
    // { label: "Milliliter", value: "mL" },
    // { label: "Piece", value: "pcs" }
  ]
  
  
  barcodeSymbologyList=[
    { label: "CODE128", value: "CODE128" },
    { label: "CODE39", value: "CODE39" },
    { label: "EAN-13", value: "EAN13" },
    { label: "EAN-8", value: "EAN8" },
    { label: "UPC-A", value: "UPCA" },
    { label: "UPC-E", value: "UPCE" }
  ]
  taxList= [
    // { label: "VAT (Value Added Tax)", value: "VAT" },
    // { label: "GST (Goods and Services Tax)", value: "GST" },
    // { label: "Sales Tax", value: "SalesTax" },
    // { label: "Excise Duty", value: "ExciseDuty" },
    // { label: "Customs Duty", value: "CustomsDuty" }
  ]
  



  constructor(
    private service: ProductsService,
    private fb: FormBuilder,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private unitService: UnitsService,
    private categoriesService: CategoriesService,
    private subCategoriesService: SubCategoriesService,
    private taxService: TaxesService,
    private warehouseServices:WarehouseService,
  ) {
    this.productForm = this.fb.group({
      name: [
        '',
        [, Validators.pattern(new RegExp(/^.{2,50}$/))],
      ],
      // slug: [
      //   '',
      //   [Validators.required, Validators.pattern(new RegExp(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))],
      // ],
      warehouse:[],
      category:[""],
      unit:[],
      quantityAlert:[],
      barcodeSymbology:[],
      itemCode:[],
      tax:[],
      openingStock:[],
      openingStockDate:[],
      purchasePrice:[],
      salesPrice:[],
      mRP:[],
      expiryDate:[],
      description:[
      ],
     
    });

  }


  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      this.productId = params['id']
      console.log("user id ", this.productId)
    })

    this.unitService.getAllUnitList().subscribe((resp: any) => {
      this.unitList = resp.data;
    });


    this.warehouseServices.getAllWarehouseList().subscribe((resp: any) => {
      this.warehouseList = resp.data;
    });

    this.categoriesService.getCategories().subscribe((resp: any) => {
      this.categeoryList = resp.data;
    });

    this.subCategoriesService.getSubCategories().subscribe((resp: any) => {
      this.subCategeoryList = resp.data;
    });
    this.taxService.getAllTaxList().subscribe((resp: any) => {
      this.taxList = resp.data;
    });

    this.service.getProductById(this.productId).subscribe((data: any) => {
      this.data = data.data; //assuming data is returned as expected
      console.log("User Data", this.data)
      this.productForm.patchValue({
        name: this.data.name,
        // slug: this.data.slug,
        warehouse:this.data.warehouse,
      category:this.data.category,
      unit:this.data.unit,
      quantityAlert:this.data.quantityAlert,
      barcodeSymbology:this.data.barcodeSymbology,
      itemCode:this.data.itemCode,
      tax:this.data.tax,
      openingStock:this.data.openingStock,
      openingStockDate:this.data.openingStockDate,
      purchasePrice:this.data.purchasePrice,
      salesPrice:this.data.salesPrice,
      mRP:this.data.mRP,
      expiryDate:this.data.expiryDate,
      description:this.data.description,

      });

    })

  }


  get f() {
    return this.productForm.controls;
  }

  ProductFormSubmit() {
    console.log(this.productForm.value)
    if (this.productForm.valid) {
      const requestBody = { ...this.productForm.value };
      requestBody.id = this.productId;
      this.service.updateProductById(requestBody).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === 'success') {
            const message = "Product has been updated";
            this.messageService.add({ severity: 'success', detail: message });
            setTimeout(() => {
              this.router.navigate(['/settings/product']);
            }, 400);
          } else {
            const message = resp.message
            this.messageService.add({ severity: 'error', detail: message });
          }
        }
      }, error => {
        console.error("Error occured while updating Product:", error);
      });

    } else {
      console.log('Form is invalid!');
    }
  }

}