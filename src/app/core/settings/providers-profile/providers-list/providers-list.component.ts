import { Component } from '@angular/core';
import { routes } from 'src/app/shared/routes/routes';
import { Router } from '@angular/router';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ButtonModule } from 'primeng/button';

interface Product {
  id?: string;
  code?: string;
  name?: string;
  description?: string;
  price?: number;
  quantity?: number;
  inventoryStatus?: string;
  category?: string;
  image?: string;
  rating?: number;
}

@Component({
  selector: 'app-providers-list',
  templateUrl: './providers-list.component.html',
  styleUrls: ['./providers-list.component.scss'],
  standalone: true,
  imports:[CommonModule,
    SharedModule,
    ReactiveFormsModule,
    ButtonModule]
})
export class ProvidersListComponent {
  public routes = routes;
  data: any = []
  constructor(private router: Router, private service: SettingsService) { }
  id: any = null;
  searchDataValue = "";
  selectedProducts = [];
  originalData:any = []


  ngOnInit(): void {
      this.getProvidersList()
  }

  getProvidersList(){
    this.service.getProviderList().subscribe((resp: any) => {
      this.data = resp.data;
      this.originalData = resp.data;
      console.log("API", this.data);
    })
  }

  providerView(id: any) {
    this.router.navigate(['/settings/providers-profiles/view/' + id])
  }

  providerEdit(id: any){
    // console.log("hi",id);
    this.router.navigate(['/settings/providers-profiles/edit/' + id]);
  }

  // public searchData(value: any): void {
  //   // this.dataSource.filter = value.trim().toLowerCase();
  //   // this.patientsList = this.dataSource.filteredData;
  // }

  public searchData(value: any): void {
    this.data = this.originalData.map(i => {
      if(i.firstName.toLowerCase().includes(value.trim().toLowerCase())){
        return i;
      }
    });
  }
}