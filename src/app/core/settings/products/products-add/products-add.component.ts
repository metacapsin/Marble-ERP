import { Component } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  Validators,
} from "@angular/forms";
import { SettingsService } from "src/app/shared/data/settings.service";
import { Router } from "@angular/router";
import { routes } from "src/app/shared/routes/routes";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { ButtonModule } from "primeng/button";
import { CheckboxModule } from "primeng/checkbox";
import { DropdownModule } from "primeng/dropdown";
import { SharedModule } from "src/app/shared/shared.module";
import { ToastModule } from "primeng/toast";
import { MessageService, SelectItem } from "primeng/api";
import { CalendarModule } from "primeng/calendar";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { ProductsService } from "../products.service";
import { TreeSelectModule } from "primeng/treeselect";
import { TreeNode } from "primeng/api";

interface CategoryItem {
  label: string;
  value: string;
  children?: CategoryItem[];
}
@Component({
  selector: "app-products-add",
  standalone: true,
  templateUrl: "./products-add.component.html",
  styleUrl: "./products-add.component.scss",
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
export class ProductsAddComponent {
  public routes = routes;
  productForm!: FormGroup;

  warehouseList = [
    { label: "Bijainagar Chanda Colony", value: "Bijainagar Chanda Colony" },
    { label: "Pipli Chouraha", value: "Pipli Chouraha" },
    { label: "Rajdarbar", value: "Rajdarbar" },
    { label: "Pragya College", value: "Ambulance" },
    { label: "Rajnagar", value: "Rajnagar" },
    { label: "Sathana Bazar", value: "Sathana Bazar" },
    { label: "Bapu Bazar", value: "Bapu Bazar" },
  ];

  selectedCategeoryOption: any;
  categeoryOptions: any = [
    {
      key: "0",
      label: "Electronics",
      data: "Electronics Folder",
      // icon: "fa-solid fa-bolt-lightning",
      children: [
        // Audio section
        {
          key: "0-0",
          label: "Audio",
          data: "Audio Folder",
          // icon: "fa-solid fa-bolt-lightning",
          children: [
            {
              key: "0-0-0",
              label: "Headphones",
              data: "Headphones Folder",
              // icon: "fa-solid fa-bolt-lightning",
            },
            {
              key: "0-0-1",
              label: "Soundbars",
              data: "Soundbars Folder",
              // icon: "fa-solid fa-bolt-lightning",
            },
          ],
        },

        // Mobile Section
        {
          key: "0-1",
          label: "Mobiles",
          data: "Mobiles Folder",
          // icon: "fa-solid fa-bolt-lightning",
        },

        // Televisions Section
        {
          key: "0-2",
          label: "Televisions",
          data: "Televisions Folder",
          // icon: "fa-solid fa-bolt-lightning",
          // children: [
          //     {
          //         key: '0-2-0',
          //         label: 'Headphones',
          //         data: 'Headphones Folder',
          //         icon: 'fa-solid fa-bolt-lightning',
          //     },
          //     {
          //         key: '0-2-1',
          //         label: 'Soundbars',
          //         data: 'Soundbars Folder',
          //         icon: 'fa-solid fa-bolt-lightning',
          //     },

          //         ]
        },

        // Computers Section
        {
          key: "0-3",
          label: "Computers",
          data: "Computers Folder",
          // icon: "fa-solid fa-bolt-lightning",
          children: [
            {
              key: "0-3-0",
              label: "Laptops",
              data: "Laptops Folder",
              // icon: "fa-solid fa-bolt-lightning",
            },
            {
              key: "0-3-1",
              label: "Desktops",
              data: "Desktops Folder",
              // icon: "fa-solid fa-bolt-lightning",
            },
            {
              key: "0-3-2",
              label: "Computer",
              data: "Computer Folder",
              // icon: "fa-solid fa-bolt-lightning",
              children: [
                {
                  key: "0-3-2-0",
                  label: "Peripheral",
                  data: "Peripheral Folder",
                  // icon: "fa-solid fa-bolt-lightning",
                },
                {
                  key: "0-3-2-1",
                  label: "Monitors",
                  data: "Monitors Folder",
                  // icon: "fa-solid fa-bolt-lightning",
                },
                {
                  key: "0-3-2-2",
                  label: "Printers",
                  data: "Printers Folder",
                  // icon: "fa-solid fa-bolt-lightning",
                },
              ],
            },
          ],
        },
      ],
    },

    // Fashion section
    {
      key: "1",
      label: "Fashion",
      data: "Fashion Folder",
      // icon: "fa-solid fa-bolt-lightning",
      children: [
        // Clothes section
        {
          key: "1-0",
          label: "Clothes",
          data: "Clothes Folder",
          // icon: "fa-solid fa-bolt-lightning",
          // children: [
          //     {
          //         key: '1-0-0',
          //         label: 'Headphones',
          //         data: 'Headphones Folder',
          //         icon: 'fa-solid fa-bolt-lightning',
          //     },
          //     {
          //         key: '1-0-1',
          //         label: 'Soundbars',
          //         data: 'Soundbars Folder',
          //         icon: 'fa-solid fa-bolt-lightning',
          //     },

          // ]
        },

        // Mobile Section
        {
          key: "1-1",
          label: "Shoes",
          data: "Shoes Folder",
          // icon: "fa-solid fa-bolt-lightning",
        },

        // Televisions Section
        // {
        //     key: '1-2',
        //     label: 'Televisions',
        //     data: 'Televisions Folder',
        //     icon: 'fa-solid fa-bolt-lightning',
        //     children: [
        //         {
        //             key: '1-2-0',
        //             label: 'Headphones',
        //             data: 'Headphones Folder',
        //             icon: 'fa-solid fa-bolt-lightning',
        //         },
        //         {
        //             key: '1-2-1',
        //             label: 'Soundbars',
        //             data: 'Soundbars Folder',
        //             icon: 'fa-solid fa-bolt-lightning',
        //         },

        //             ]
        // },
      ],
    },

    // Grocery section
    {
      key: "2",
      label: "Grocery",
      data: "Grocery Folder",
      // icon: "fa-solid fa-bolt-lightning",
    },

    //   Home and Furnitures Section
    {
      key: "3",
      label: "Home and Furnitures",
      data: "Home and Furnitures Folder",
      // icon: "fa-solid fa-bolt-lightning",
    },

    //   Baby & Kids Section
    {
      key: "4",
      label: "Baby & Kids",
      data: "Baby & Kids Folder",
      // icon: "fa-solid fa-bolt-lightning",
    },

    //   Main Category 1 Section
    {
      key: "5",
      label: "Main Category 1",
      data: "Main Category 1 Folder",
      // icon: "fa-solid fa-bolt-lightning",
      children: [
        // Clothes section
        {
          key: "5-0",
          label: "Category 1",
          data: "Category 1 Folder",
          // icon: "fa-solid fa-bolt-lightning",
          // children: [
          //     {
          //         key: '1-0-0',
          //         label: 'Headphones',
          //         data: 'Headphones Folder',
          //         icon: 'fa-solid fa-bolt-lightning',
          //     },
          //     {
          //         key: '1-0-1',
          //         label: 'Soundbars',
          //         data: 'Soundbars Folder',
          //         icon: 'fa-solid fa-bolt-lightning',
          //     },

          // ]
        },
      ],
    },
  ];

  unitList = [
    { label: "Meter", value: "m" },
    { label: "Liter", value: "L" },
    { label: "Kilogram", value: "kg" },
    { label: "Gram", value: "g" },
    { label: "Centimeter", value: "cm" },
    { label: "Milliliter", value: "mL" },
    { label: "Piece", value: "pcs" },
  ];

  barcodeSymbologyList = [
    { label: "CODE128", value: "CODE128" },
    { label: "CODE39", value: "CODE39" },
    { label: "EAN-13", value: "EAN13" },
    { label: "EAN-8", value: "EAN8" },
    { label: "UPC-A", value: "UPCA" },
    { label: "UPC-E", value: "UPCE" },
  ];
  taxList = [
    { label: "VAT (Value Added Tax)", value: "VAT" },
    { label: "GST (Goods and Services Tax)", value: "GST" },
    { label: "Sales Tax", value: "SalesTax" },
    { label: "Excise Duty", value: "ExciseDuty" },
    { label: "Customs Duty", value: "CustomsDuty" },
  ];

  nameRegex = /^[a-zA-Z\s]{1,50}$/; // No specific regex for name field

  quantityAlertRegex = /^[0-9]+$/;
  itemCodeRegex = /^(?:.{1,20})$/;
  openingStockRegex = /^[0-9]+$/;

  purchasePriceRegex = /^[0-9]+$/;
  salesPriceRegex = /^[0-9]+$/;
  mrpRegex = /^[0-9]+$/;
  descriptionRegex = /^(?:.{1,500})$/;

  // itemCode: string;
  // barcodeImage: string | ArrayBuffer | null;

  constructor(
    private service: ProductsService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    // this.itemCode = ''; // Initialize itemCode
    // this.barcodeImage = null; // Initialize barcodeImage
    this.productForm = this.fb.group({
      name: ["", [Validators.required, Validators.pattern(this.nameRegex)]],
      // slug: [
      //   '',
      //   [Validators.required, Validators.pattern(new RegExp(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))],
      // ],
      warehouse: [],
      category: [],
      unit: [],
      quantityAlert: [
        "",
        [Validators.required, Validators.pattern(this.quantityAlertRegex)],
      ],
      barcodeSymbology: [],
      itemCode: ["", [Validators.required, Validators.pattern(this.itemCodeRegex)]],
      tax: [],
      openingStock: [
        "",
        [Validators.required, Validators.pattern(this.openingStockRegex)],
      ],
      openingStockDate: [],
      purchasePrice: [
        "",
        [Validators.required, Validators.pattern(this.purchasePriceRegex)],
      ],
      salesPrice: [
        "",
        [Validators.required, Validators.pattern(this.salesPriceRegex)],
      ],
      mRP: ["", [Validators.required, Validators.pattern(this.mrpRegex)]],
      expiryDate: [],
      description: [
        "",
        [Validators.required, Validators.pattern(this.descriptionRegex)],
      ],
    });
  }
  get f() {
    return this.productForm.controls;
  }

  //   generateBarcode() {
  //     if (this.itemCode) {
  //         // Barcode options
  //         const options = {
  //             bcid: 'code128', // Barcode type
  //             text: this.itemCode, // Text to encode
  //             scale: 3, // Bar scale factor
  //             height: 10, // Bar height, in millimeters
  //             includetext: true, // Show human-readable text
  //             textxalign: 'center', // Text alignment
  //         };

  //         // Generate barcode
  //         bwipjs.toCanvas('barcodeCanvas', options, (err: any, canvas: any) => {
  //             if (err) {
  //                 console.error('Barcode generation error:', err);
  //             } else {
  //                 console.log('Barcode generated successfully.');
  //             }
  //         });
  //     } else {
  //         console.error('Item code is empty.');
  //     }
  // }

  ProductFormSubmit() {
    console.log(this.productForm.value);
    if (this.productForm.valid) {
      this.service
        .CreateProduct(this.productForm.value)
        .subscribe((resp: any) => {
          if (resp.status === "success") {
            const message = "Product has been added";
            this.messageService.add({ severity: "success", detail: message });
            setTimeout(() => {
              this.router.navigate(["/settings/product"]);
            }, 400);
          } else {
            const message = resp.message;
            this.messageService.add({ severity: "error", detail: message });
          }
        });
    } else {
      console.log("Form is invalid!");
    }
  }
}
