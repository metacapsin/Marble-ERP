import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgxBootstrapModule } from "./ngx-bootstrap/ngx-bootstrap.module";
import { CountUpModule } from "ngx-countup";
import { NgApexchartsModule } from "ng-apexcharts";
import { NgCircleProgressModule } from "ng-circle-progress";
import { materialModule } from "./material.module";
import { NgxEditorModule } from "ngx-editor";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { FullCalendarModule } from "@fullcalendar/angular";
import { HttpClientModule } from "@angular/common/http";
import { DataService } from "./data/data.service";
import { MatSortModule } from "@angular/material/sort";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { PracticeDialogModule } from './practice-dialog/practice-dialog.module';
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { MenubarModule } from "primeng/menubar";
import { DataViewModule } from "primeng/dataview";
import { TagModule } from "primeng/tag";
import { TableModule } from "primeng/table";
import { ConfirmDialogComponent } from "../common-component/modals/confirm-dialog/confirm-dialog.component";
import { DateMaskDirective } from "./directives/date-mask.directive";
import { ShowHideDirective } from "../common-component/show-hide-directive/show-hide.directive";
import { IndianCurrencyPipe } from "./directives/indian-currency.pipe";
import { WordWrapPipe } from "./directives/word-wrap.pipe";
import { FilterPipe } from "../core/filter.pipe";
import { ToastModule } from "primeng/toast";
import { CalendarModule } from "primeng/calendar";
import { DialogModule } from "primeng/dialog";
import { TabViewModule } from "primeng/tabview";
import { DropdownModule } from "primeng/dropdown";
import { MessageService } from "primeng/api";
import { MultiSelectModule } from "primeng/multiselect";
import { RouterModule } from "@angular/router";
import { PanelMenuModule } from "primeng/panelmenu";
import { ButtonModule } from "primeng/button";

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NgxBootstrapModule,
    CountUpModule,
    NgApexchartsModule,
    NgCircleProgressModule.forRoot({
      radius: 40,
      space: -10,
      outerStrokeWidth: 10,
      innerStrokeWidth: 10,
      animationDuration: 1000,
      clockwise: false,
      startFromZero: false,
      lazy: false,
      outerStrokeLinecap: "square",
      showSubtitle: false,
      showTitle: false,
      showUnits: false,
      showBackground: false,
    }),
    SlickCarouselModule,
    materialModule,
    NgxEditorModule,
    FullCalendarModule,
    HttpClientModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    MenubarModule,
    DataViewModule,
    TagModule,
    TableModule,
    ConfirmDialogComponent,
    DateMaskDirective,
    ShowHideDirective,
    IndianCurrencyPipe,
    WordWrapPipe,
    FilterPipe,
    ToastModule,
    CalendarModule,
    DialogModule,
    TabViewModule,
    DropdownModule,
    MultiSelectModule,
    RouterModule,
    PanelMenuModule,
    ButtonModule
    
  ],
  exports: [
    CommonModule,
    NgxBootstrapModule,
    CountUpModule,
    NgApexchartsModule,
    NgCircleProgressModule,
    SlickCarouselModule,
    materialModule,
    NgxEditorModule,
    FullCalendarModule,
    HttpClientModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    ProgressSpinnerModule,
    MenubarModule,
    DataViewModule,
    TagModule,
    TableModule,
    ConfirmDialogComponent,
    DateMaskDirective,
    ShowHideDirective,
    IndianCurrencyPipe,
    WordWrapPipe,
    FilterPipe,
    ToastModule,
    CalendarModule,
    DialogModule,
    TabViewModule,
    DropdownModule,
    RouterModule,
    PanelMenuModule,
    ButtonModule

  ],
  providers: [DataService,MessageService],
})
export class SharedModule {}
