import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { Router } from '@angular/router';
import { routes } from 'src/app/shared/routes/routes';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CalendarModule } from 'primeng/calendar';

@Component({
  selector: 'app-products-add',
  standalone: true,
  templateUrl: './products-add.component.html',
  styleUrl: './products-add.component.scss',
  imports: [CommonModule,
    SharedModule,
    MatButtonModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    CalendarModule,
  ToastModule],
  providers: [MessageService],
})
export class ProductsAddComponent {


  public routes = routes;
  productForm!: FormGroup;


  warehouseList = [
    { label: 'Bijainagar Chanda Colony', value: 'Bijainagar Chanda Colony' },
    { label: 'Pipli Chouraha', value: 'Pipli Chouraha' },
    { label: 'Rajdarbar', value: 'Rajdarbar' },
    { label: 'Pragya College', value: 'Ambulance' },
    { label: 'Rajnagar', value: 'Rajnagar' },
    { label: 'Sathana Bazar', value: 'Sathana Bazar' },
    { label: 'Bapu Bazar', value: 'Bapu Bazar' },
  ]

  categoriesList:[
    {
      "name": "Electronics",
      "subcategories": [
        {
          "name": "Audio",
          "subcategories": [
            { "name": "Headphones" },
            { "name": "Soundbars" }
          ]
        },
        { "name": "Mobiles" },
        { "name": "Televisions" },
        {
          "name": "Computers",
          "subcategories": [
            { "name": "Laptops" },
            { "name": "Desktops" },
            {
              "name": "Computer",
              "subcategories": [
                { "name": "Peripheral" },
                { "name": "Monitors" },
                { "name": "Printers" }
              ]
            }
          ]
        }
      ]
    },
    {
      "name": "Fashion",
      "subcategories": [
        { "name": "Clothes" },
        { "name": "Shoes" }
      ]
    },
    { "name": "Grocery" },
    { "name": "Home and Furnitures" },
    { "name": "Baby & Kids" },
    {
      "name": "Main Category 1",
      "subcategories": [
        { "name": "Category 1" }
      ]
    }
  ]

  unitList:[]
  barcodeSymbologyList:[]
  taxList:[]


  constructor(
    private service: SettingsService,
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService
  ) {
    this.productForm = this.fb.group({
      name: [
        '',
        [Validators.required, Validators.pattern(new RegExp(/^.{2,50}$/))],
      ],
      slug: [
        '',
        [Validators.required, Validators.pattern(new RegExp(/^[a-z0-9]+(?:-[a-z0-9]+)*$/))],
      ],
      email: [
        '',
        [Validators.required, Validators.pattern(new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/))],
      ],
      warehouse:[],
      category:[],
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
        '',
        [Validators.required, Validators.pattern(new RegExp(/^.{5,500}$/))],
      ],
      bankDetails:[ '',
      [Validators.pattern(new RegExp(/^[A-Za-z0-9\s-]+$/))
    ],],
      placeServiceCode: ['Default', []],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(
            new RegExp(/^\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/)
          ),
        ],
      ],
     
    });

    
  }
  get f() {
    return this.productForm.controls;
  }

  ProductFormSubmit() {
    if (this.productForm.valid) {
      this.service
        .CreateProduct(this.productForm.value)
        .subscribe((resp:any) => {
          if (resp.status === 'success') {
            const message = "Product has been added";
            this.messageService.add({ severity: 'success', detail: message });
            setTimeout(() => {
              this.router.navigate(['/settings/product']);
            }, 400);
          } else {
            const message = resp.message
            this.messageService.add({ severity: 'error', detail: message });
          }
        });
    } else {
      console.log('Form is invalid!');
    }
  }
}