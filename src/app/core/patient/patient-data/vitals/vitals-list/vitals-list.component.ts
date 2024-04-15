import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute } from '@angular/router';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { routes } from 'src/app/shared/routes/routes';
import { PaginatorModule } from 'primeng/paginator';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexResponsive,
  ApexPlotOptions,
  ApexLegend,
  ApexTooltip,
} from 'ng-apexcharts';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

export type ChartOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  series: ApexAxisChartSeries | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chart: ApexChart | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  xaxis: ApexXAxis | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataLabels: ApexDataLabels | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grid: ApexGrid | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fill: ApexFill | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  markers: ApexMarkers | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  yaxis: ApexYAxis | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stroke: ApexStroke | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  title: ApexTitleSubtitle | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  labels: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  responsive: ApexResponsive[] | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plotOptions: ApexPlotOptions | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tooltip: ApexTooltip | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  legend: ApexLegend | any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
};

@Component({
  selector: 'app-vitals-list',
  templateUrl: './vitals-list.component.html',
  styleUrl: './vitals-list.component.scss',
  standalone: true,
  imports: [
    SharedModule,
    DialogModule,
    CalendarModule,
    CommonModule,
    PaginatorModule,
    ToastModule
  ],
  providers: [MessageService]
})
export class VitalsListComponent {
  vitalsForm!: FormGroup;
  valueChanges: Observable<any> | null
  displayedColumns: string[] = ['recorded', 'bp', 'hr', 'rr', 'temp', 'height', 'weight', 'bmi', 'spo2', 'inhatedo2', 'headcirc', 'comments', 'action'];
  usersApiData: any;
  searchDataValue = "";
  selectedProducts = [];
  addVitalsDialog = false;
  minSelectableDate: Date;
  minSelectableTime: string;
  patientId = ""
  vitalsList = [];

  public routes = routes;
  @ViewChild('chart') chart!: ChartComponent;
  public chartOptionsOne: Partial<ChartOptions>;
  public chartOptionsTwo: Partial<ChartOptions>;
  public chartOptionsThree: Partial<ChartOptions>;
  public chartOptionsFour: Partial<ChartOptions>;
  public chartOptionsFive: Partial<ChartOptions>;


  selected!: Date | null;
  public selectedValue !: string;
  slideConfig = {
    slidesToShow: 3, slidesToScroll: 3, centerMode: true, centerPadding: '30px'
  };
  showVitalsDialog = false;
  first: number = 0;

  rows: number = 1;

  onPageChange(event: any) {
    this.first = event.first;
    this.rows = event.rows;
  }
  constructor(
    private activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private messageService: MessageService,
    private service: SettingsService,
    private fb: FormBuilder) {
    this.minSelectableDate = new Date();
    this.vitalsForm = this.fb.group({
      vitalsRecordedDate: [''],
      vitalsRecordedTime: [''],
      vitalsSystolicBloodPressure: ['', [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(180)]],
      vitalsDiastolicBloodPressure: ['', [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(180)]],
      vitalsHeightInFeet: ['', [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(10)]],
      vitalsHeightInInch: ['', [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(11)]],
      vitalsWeightLbs: ['', [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(500)]],
      vitalsWeightOz: ['', [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(15)]],
      vitalsHeartRate: ['', [Validators.pattern(/^\d+$/), Validators.min(60), Validators.max(100)]],
      vitalsRespiratoryRate: ['', [Validators.pattern(/^\d+$/), Validators.min(10), Validators.max(20)]],
      vitalsTemperature: ['', [Validators.pattern(/^\d+(\.\d+)?$/), Validators.min(90), Validators.max(105)]],
      vitalsBodyMassIndex: [null, { disabled: true }],
      // vitalsBodyMassIndex: ['', [Validators.pattern(/^\d+$/), Validators.min(15), Validators.max(30)]],
      vitalsSpO2: ['', [Validators.pattern(/^\d+$/), Validators.min(0), Validators.max(100)]],
      vitalsInhaledO2: ['', [Validators.pattern(/^\d+$/), Validators.min(21), Validators.max(100)]],
      vitalsHeadCircumference: ['', [Validators.pattern(/^\d+(\.\d+)?$/), Validators.min(0), Validators.max(20)]],
      vitalsComments: [''],
      vitalsCreatedByProvider: ['Ar'],
      patientId: [this.patientId]

    })
    this.activatedRoute.parent.params.subscribe(
      (params: any) => {
        console.log(params?.id);
      });

    this.chartOptionsOne = {
      chart: {
        height: 170,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      series: [
        {
          name: 'Health',
          color: '#00D3C7',
          data: [20, 40, 85, 25, 50, 30, 50, 20, 50, 40, 30, 20],
        },
      ],
      xaxis: {
        categories: [
          'Jan',
          'Feb',
          'Mar',
          'Apr',
          'May',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Oct',
          'Nov',
          'Dec',
        ],
      },
    };
    this.chartOptionsTwo = {
      chart: {
        height: 200,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      series: [
        {
          name: 'Health',
          color: '#FF3667',
          data: [20, 20, 85, 35, 60, 30, 20],
        },
      ],
      xaxis: {
        categories: ['0', '1', '2', '3', '4', '5', '6'],
      },
    };
    this.chartOptionsThree = {
      chart: {
        height: 230,
        type: 'bar',
        stacked: false,
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: 'bottom',
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '90%',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 6,
        colors: ['transparent'],
      },
      series: [
        {
          name: 'Low',
          color: '#D5D7ED',
          data: [10, 30, 10, 30, 10, 30, 30],
        },
        {
          name: 'High',
          color: '#2E37A4',
          data: [20, 20, 20, 20, 20, 20, 20],
        },
      ],
      xaxis: {
        categories: ['1', '10', '20', '30', '40', '50', '60'],
      },
    };
    this.chartOptionsFour = {
      chart: {
        height: 220,
        type: 'bar',
        stacked: true,
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: '30%',
          endingShape: 'rounded',
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 1,
      },
      series: [
        {
          name: 'High',
          color: '#2E37A4',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
        {
          name: 'Low',
          color: 'rgba(46, 55, 164, 0.05)',
          data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
        },
      ],
      tooltip: {
        y: {
          formatter: function (val: string) {
            return '$ ' + val + ' thousands';
          },
        },
      },
    };
    this.chartOptionsFive = {
      chart: {
        height: 200,
        type: 'line',
        toolbar: {
          show: false,
        },
      },
      grid: {
        show: true,
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      series: [
        {
          name: 'Sleep',
          color: '#2E37A4',
          data: [20, 21, 20, 21, 20, 21, 22],
        },
      ],
      xaxis: {
        categories: ['0', '1', '2', '3', '4', '5', '6'],
      },
    };
  }

  public searchData(value: any): void {
    this.vitalsList = this.vitalsList.map(i => {
      if (i.vitalsSystolicBloodPressure.toLowerCase().includes(value.trim().toLowerCase())) {
        return i;
      }
    });
  }
  calculateBMI() {
    console.log("Enter in calBMI");

    const heightFeet = this.vitalsForm.get('vitalsHeightInFeet').value || 0;
    const heightInch = this.vitalsForm.get('vitalsHeightInInch').value || 0;
    const weightLbs = this.vitalsForm.get('vitalsWeightLbs').value || 0;
    const weightOz = this.vitalsForm.get('vitalsWeightOz').value || 0;

    const totalHeightInInches = heightFeet * 12 + heightInch;
    const heightInMeters = totalHeightInInches * 0.0254;

    const totalWeightInPounds = weightLbs + (weightOz / 16);
    const weightInKilograms = totalWeightInPounds * 0.453592;

    const bmi = weightInKilograms / (heightInMeters * heightInMeters);

    this.vitalsForm.get('vitalsBodyMassIndex').setValue(bmi.toFixed(2));
  }

  openAddVitals() {
    this.addVitalsDialog = true;
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.patientId = params['id'];
      console.log("patient id in vitals", this.patientId);
    });
    this.vitalsForm.get('vitalsHeightInFeet').valueChanges.subscribe(() => this.calculateBMI());
    this.vitalsForm.get('vitalsHeightInInch').valueChanges.subscribe(() => this.calculateBMI());
    this.vitalsForm.get('vitalsWeightLbs').valueChanges.subscribe(() => this.calculateBMI());
    this.vitalsForm.get('vitalsWeightOz').valueChanges.subscribe(() => this.calculateBMI());

    this.getPatientVitals();
  }

  getPatientVitals() {
    this.service.getPatientVitalsList(this.patientId).subscribe(resp => {
      this.vitalsList = (resp as any).data;
      console.log("resp of vitals", resp);
    })
  }

  vitalsFormSubmit() {
    if (this.vitalsForm.valid) {
      // console.log("Form is valid");
      // console.log(this.vitalsForm.value);
      this.vitalsForm.value.patientId = this.patientId;
      this.service.createPatientVitals(this.vitalsForm.value).subscribe((resp: any) => {
        if (resp) {
          if (resp.status === 'success') {
            const message = "Vitals has been added";
            this.messageService.add({ severity: 'success', detail: message });
          } else {
            const message = resp.message
            this.messageService.add({ severity: 'error', detail: message });
          }
          this.addVitalsDialog = false;
          this.getPatientVitals();
        }
      })
    }
    else {
      console.log("Form is invalid");

    }
  }

  public sortData(sort: Sort) {
    const data = this.vitalsList.slice();

    if (!sort.active || sort.direction === '') {
      this.vitalsList = data;
    } else {
      this.vitalsList = data.sort((a, b) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }
}
