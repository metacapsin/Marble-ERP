import { Component, OnInit } from "@angular/core";
import { routes } from "src/app/shared/routes/routes";
import { ReportsService } from "../reports.service";
import { CategoriesService } from "src/app/core/settings/categories/categories.service";
import { SubCategoriesService } from "src/app/core/settings/sub-categories/sub-categories.service";
@Component({
  selector: "app-inventory-reports",
  templateUrl: "./inventory-reports.component.html",
  styleUrl: "./inventory-reports.component.scss",
})
export class InventoryReportsComponent  {
  public routes = routes;
  picker1: any;
  searchDataValue = ""
  rangeDates: Date[] | undefined;
  stockListData = [];
  originalData = [];

  categoryDataList = [];
  subCategoryDataList = [];

  cols= [];
  exportColumns = [];

  byCategory : any
  bySubCategory : any

  constructor(
    private service: ReportsService,
    private CategoriesService: CategoriesService,
    private SubCategoriesService: SubCategoriesService,
  ) {}
  // Function to generate the stock report export filename
  getStockExportFilename(): string {
    const categoryName = this.byCategory?.name || 'All Categories';
    const subCategoryName = this.bySubCategory?.name || 'All Sub-Categories';
    return `Stock Report - ${categoryName} - ${subCategoryName}`;
  }
  getStockReportData() {

    const data = {
      categoryDetail: this.byCategory,
      subCategoryDetail: this.bySubCategory
    };

    this.service.getStockReports(data).subscribe((resp: any) => {
      this.stockListData = resp.slab
      this.originalData = resp.slab

      this.cols = [
        { field: 'slabNo', header: 'Slab Number' },
        { field: 'slabName', header: 'Slab Name' },
        { field: 'categoryDetail.name', header: 'Category' },
        { field: 'subCategoryDetail.name', header: 'Sub Category' },
        { field: 'warehouseDetails.name', header: 'Warehouse' },
        { field: 'totalSQFT', header: 'Current stock ( Square Feet ) ' },
        { field: 'totalSlabSQFT', header: 'Stock When Made ( Square Feet )' },
        { field: 'costPerSQFT', header: 'Cost / Square Feet' },
        { field: 'sellingPricePerSQFT', header: 'Selling Price / Square Feet' }
      ];

      this.exportColumns = this.cols.map(col => ({
        title: col.header,
        dataKey: col.field
      }));
    });
    // this.exportColumns = this.stockListData.map((element) => ({ title: element.header, dataKey: element.field }));
  }

  onCategoryChange(value: any){
    this.byCategory = value;
    this.getStockReportData();
  }
  onSubCategoryChange(value: any){
    this.bySubCategory = value;
    this.getStockReportData();

  }
  ngOnInit(): void {
    this.CategoriesService.getCategories().subscribe((resp:any) => {
      this.categoryDataList = resp.data.map((element) => ({
        name: element.name,
        categoryDetail: {
          _id: element._id,
          name: element.name
        }
      }));
    });
    this.SubCategoriesService.getSubCategories().subscribe((resp:any) => {
      this.subCategoryDataList = resp.data.map((element) => ({
        name: element.name,
        subCategoryDetail: {
          _id: element._id,
          name: element.name
        }
      }));
    });

    this.getStockReportData();
  }

  public searchData(value: any): void {
    this.stockListData = this.originalData.filter(i =>
      i.slabName.toLowerCase().includes(value.trim().toLowerCase())
    );
}
}
