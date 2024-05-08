import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-blocks-list',
  standalone: true,
  imports: [CommonModule, SharedModule, ButtonModule, TableModule, ToastModule],
  templateUrl: './blocks-list.component.html',
  styleUrl: './blocks-list.component.scss'
})
export class BlocksListComponent {
  routes = routes;
  selectedBlocks= ""
  searchDataValue= " ";

  blockDataList=[{
    lotNo: 145205,
    blockNo: 12,
    vaccume: 145,
    pasting: 12,
    dressing: 12,
    // Dressing: {
    //   height: 12,
    //   width: 25,
    //   length: 20,
    // },

  }]
  public searchData(value: any): void {
  //   this.categoriesListData = this.originalData.filter(i =>
  //   i.name.toLowerCase().includes(value.trim().toLowerCase())
  // );
  }

  onPageChange(event) {
    const startIndex = event.first;
    const endIndex = startIndex + event.rows; 
    const currentPageData = this.blockDataList.slice(startIndex, endIndex);
  }
}
