import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService} from 'primeng/api';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { routes } from 'src/app/shared/routes/routes';
import { SharedModule } from 'src/app/shared/shared.module';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { SettingsTabsModule } from '../../settings-tabs/settings-tabs.module';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-calendar-settings-home',
  templateUrl: './calendar-settings-home.component.html',
  styleUrls: ['./calendar-settings-home.component.scss'],
  standalone: true,
  imports: [
    SettingsTabsModule,
    SharedModule,
    DialogModule,
    ButtonModule,
    DividerModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    ToastModule
  ],
  providers:[MessageService]
})
export class CalendarSettingsHomeComponent implements OnInit {
  public routes = routes;
  settingCategory = 'G';
  providerHoursDialog = false;
  currentProvider: any;
  providerHourForm: FormGroup;
  newTimeOffDialog = false;
  newHolidayDialog = false;
  timeOffForm!: FormGroup;
  holidayForm!: FormGroup;
  providerData: any;
  selectedProviderData: any;
  breaksDuration:any=[
    "15 mins",
    "30 mins",
    "45 mins",
    "1 hr",
    "1.5 hr",
    "2 hr",
  ]

  
  timeZonesList: any = [
    { "label": "(GMT-12:00) International Date Line West", "value": "Etc/GMT+12" },
    { "label": "(GMT-11:00) Midway Island, Samoa", "value": "Pacific/Midway" },
    { "label": "(GMT-10:00) Hawaii", "value": "Pacific/Honolulu" },
    { "label": "(GMT-09:00) Alaska", "value": "US/Alaska" },
    { "label": "(GMT-08:00) Pacific Time (US & Canada)", "value": "America/Los_Angeles" },
    { "label": "(GMT-08:00) Tijuana, Baja California", "value": "America/Tijuana" },
    { "label": "(GMT-07:00) Arizona", "value": "US/Arizona" },
    { "label": "(GMT-07:00) Chihuahua, La Paz, Mazatlan", "value": "America/Chihuahua" },
    { "label": "(GMT-07:00) Mountain Time (US & Canada)", "value": "US/Mountain" },
    { "label": "(GMT-06:00) Central America", "value": "America/Managua" },
    { "label": "(GMT-06:00) Central Time (US & Canada)", "value": "US/Central" },
    { "label": "(GMT-06:00) Guadalajara, Mexico City, Monterrey", "value": "America/Mexico_City" },
    { "label": "(GMT-06:00) Saskatchewan", "value": "Canada/Saskatchewan" },
    { "label": "(GMT-05:00) Bogota, Lima, Quito, Rio Branco", "value": "America/Bogota" },
    { "label": "(GMT-05:00) Eastern Time (US & Canada)", "value": "US/Eastern" },
    { "label": "(GMT-05:00) Indiana (East)", "value": "US/East-Indiana" },
    { "label": "(GMT-04:00) Atlantic Time (Canada)", "value": "Canada/Atlantic" },
    { "label": "(GMT-04:00) Caracas, La Paz", "value": "America/Caracas" },
    { "label": "(GMT-04:00) Manaus", "value": "America/Manaus" },
    { "label": "(GMT-04:00) Santiago", "value": "America/Santiago" },
    { "label": "(GMT-03:30) Newfoundland", "value": "Canada/Newfoundland" },
    { "label": "(GMT-03:00) Brasilia", "value": "America/Sao_Paulo" },
    { "label": "(GMT-03:00) Buenos Aires, Georgetown", "value": "America/Argentina/Buenos_Aires" },
    { "label": "(GMT-03:00) Greenland", "value": "America/Godthab" },
    { "label": "(GMT-03:00) Montevideo", "value": "America/Montevideo" },
    { "label": "(GMT-02:00) Mid-Atlantic", "value": "America/Noronha" },
    { "label": "(GMT-01:00) Cape Verde Is.", "value": "Atlantic/Cape_Verde" },
    { "label": "(GMT-01:00) Azores", "value": "Atlantic/Azores" },
    { "label": "(GMT+00:00) Casablanca, Monrovia, Reykjavik", "value": "Africa/Casablanca" },
    { "label": "(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London", "value": "Etc/Greenwich" },
    { "label": "(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna", "value": "Europe/Amsterdam" },
    { "label": "(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague", "value": "Europe/Belgrade" },
    { "label": "(GMT+01:00) Brussels, Copenhagen, Madrid, Paris", "value": "Europe/Brussels" },
    { "label": "(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb", "value": "Europe/Sarajevo" },
    { "label": "(GMT+01:00) West Central Africa", "value": "Africa/Lagos" },
    { "label": "(GMT+02:00) Amman", "value": "Asia/Amman" },
    { "label": "(GMT+02:00) Athens, Bucharest, Istanbul", "value": "Europe/Athens" },
    { "label": "(GMT+02:00) Beirut", "value": "Asia/Beirut" },
    { "label": "(GMT+02:00) Cairo", "value": "Africa/Cairo" },
    { "label": "(GMT+02:00) Harare, Pretoria", "value": "Africa/Harare" },
    { "label": "(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius", "value": "Europe/Helsinki" },
    { "label": "(GMT+02:00) Jerusalem", "value": "Asia/Jerusalem" },
    { "label": "(GMT+02:00) Minsk", "value": "Europe/Minsk" },
    { "label": "(GMT+02:00) Windhoek", "value": "Africa/Windhoek" },
    { "label": "(GMT+03:00) Kuwait, Riyadh, Baghdad", "value": "Asia/Kuwait" },
    { "label": "(GMT+03:00) Moscow, St. Petersburg, Volgograd", "value": "Europe/Moscow" },
    { "label": "(GMT+03:00) Nairobi", "value": "Africa/Nairobi" },
    { "label": "(GMT+03:00) Tbilisi", "value": "Asia/Tbilisi" },
    { "label": "(GMT+03:30) Tehran", "value": "Asia/Tehran" },
    { "label": "(GMT+04:00) Abu Dhabi, Muscat", "value": "Asia/Muscat" },
    { "label": "(GMT+04:00) Baku", "value": "Asia/Baku" },
    { "label": "(GMT+04:00) Yerevan", "value": "Asia/Yerevan" },
    { "label": "(GMT+04:30) Kabul", "value": "Asia/Kabul" },
    { "label": "(GMT+05:00) Yekaterinburg", "value": "Asia/Yekaterinburg" },
    { "label": "(GMT+05:00) Islamabad, Karachi, Tashkent", "value": "Asia/Karachi" },
    { "label": "(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi", "value": "Asia/Calcutta" },
    { "label": "(GMT+05:30) Sri Jayawardenapura", "value": "Asia/Calcutta" },
    { "label": "(GMT+05:45) Kathmandu", "value": "Asia/Katmandu" },
    { "label": "(GMT+06:00) Almaty, Novosibirsk", "value": "Asia/Almaty" },
    { "label": "(GMT+06:00) Astana, Dhaka", "value": "Asia/Dhaka" },
    { "label": "(GMT+06:30) Yangon (Rangoon)", "value": "Asia/Rangoon" },
    { "label": "(GMT+07:00) Bangkok, Hanoi, Jakarta", "value": "Asia/Bangkok" },
    { "label": "(GMT+07:00) Krasnoyarsk", "value": "Asia/Krasnoyarsk" },
    { "label": "(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi", "value": "Asia/Hong_Kong" },
    { "label": "(GMT+08:00) Kuala Lumpur, Singapore", "value": "Asia/Kuala_Lumpur" },
    { "label": "(GMT+08:00) Irkutsk, Ulaan Bataar", "value": "Asia/Irkutsk" },
    { "label": "(GMT+08:00) Perth", "value": "Australia/Perth" },
    { "label": "(GMT+08:00) Taipei", "value": "Asia/Taipei" },
    { "label": "(GMT+09:00) Osaka, Sapporo, Tokyo", "value": "Asia/Tokyo" },
    { "label": "(GMT+09:00) Seoul", "value": "Asia/Seoul" },
    { "label": "(GMT+09:00) Yakutsk", "value": "Asia/Yakutsk" },
    { "label": "(GMT+09:30) Adelaide", "value": "Australia/Adelaide" },
    { "label": "(GMT+09:30) Darwin", "value": "Australia/Darwin" },
    { "label": "(GMT+10:00) Brisbane", "value": "Australia/Brisbane" },
    { "label": "(GMT+10:00) Canberra, Melbourne, Sydney", "value": "Australia/Canberra" },
    { "label": "(GMT+10:00) Hobart", "value": "Australia/Hobart" },
    { "label": "(GMT+10:00) Guam, Port Moresby", "value": "Pacific/Guam" },
    { "label": "(GMT+10:00) Vladivostok", "value": "Asia/Vladivostok" },
    { "label": "(GMT+11:00) Magadan, Solomon Is., New Caledonia", "value": "Asia/Magadan" },
    { "label": "(GMT+12:00) Auckland, Wellington", "value": "Pacific/Auckland" },
    { "label": "(GMT+12:00) Fiji, Kamchatka, Marshall Is.", "value": "Pacific/Fiji" },
    { "label": "(GMT+13:00) Nuku'alofa", "value": "Pacific/Tongatapu" }
  ];
  selectedCalendarIncrement:any;
  calendarIncrementList:any=[
    {label: '5 minutes', value:5},
    {label: '10 minutes', value:10},
    {label: '15 minutes', value:15},
    {label: '20 minutes', value:20},
    {label: '30 minutes', value:30},
    {label: '60 minutes', value:60},
  ]
  selectedTimeZone;

  staticTimeSlots: any = [
    '9:00 AM',
    '9:15 AM',
    '9:30 AM',
    '9:45 AM',
    '10:00 AM',
    '10:15 AM',
    '10:30 AM',
    '10:45 AM',
    '11:00 AM',
    '11:15 AM',
    '11:30 AM',
    '11:45 AM',
    '12:00 PM',
    '12:15 PM',
    '12:30 PM',
    '12:45 PM',
    '1:00 PM',
    '1:15 PM',
    '1:30 PM',
    '1:45 PM',
    '2:00 PM',
    '2:15 PM',
    '2:30 PM',
    '2:45 PM',
    '3:00 PM',
    '3:15 PM',
    '3:30 PM',
    '3:45 PM',
    '4:00 PM',
    '4:15 PM',
    '4:30 PM',
    '4:45 PM',
    '5:00 PM',
    // '5:15 PM',
    // '5:30 PM',
    // '5:45 PM',
    // '6:00 PM',
  ];
  breakSlotsOptions = [
    '12:00 PM',
    '12:15 PM',
    '12:30 PM',
    '12:45 PM',
    '1:00 PM',
  ];
  daysArray = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  staffTimeOffList = [];
  serviceLocationOptions: any = [];
  holidaysList: any = [

  ];
  providerHoursData: any = [];
  selectedTimeOff;
  showDialog=false;
  modalData:any;
  selectedHolidayId:any;
  selectedTimeOffId:any;
  currentWarning;
  isSubmitTimeOff=false;
  constructor(
    public dialog: MatDialog,
    private router: Router,
    private service: SettingsService,
    private fb: FormBuilder,
    private settingApiService: SettingsService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }
  ngOnInit() {
    this.providerHourForm = this.fb.group({
      Days: this.fb.array([]),
    });
    this.addDay();
    this.initTimeOffForm();
    this.initHolidayForm();
    this.getProviderCalendarSettings();
    this.getPracticeList();
    this.getAllStaffTimeOff();
    // this.getTimezone();
    this.getHolidayList();
    this.getGeneralCalendarSetting();
    this.selectedTimeZone = this.timeZonesList[0].value;


  }
  changeCalendarSettingCategory(settingCategory: string) {
    this.settingCategory = settingCategory;
  }

  getProviderCalendarSettings() {
    this.settingApiService.getProviderCalendarList().subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.providerHoursData = res.data;
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }

  getPracticeList() {
    this.settingApiService
      .getPracticeInformationList()
      .subscribe((res: any) => {
        res.data.forEach((element) => {
          const obj = {
            key: element._id,
            value: element.name,
          };
          this.serviceLocationOptions.push(obj);
        });
      });
  }

  getTimezone() {
    this.settingApiService.getTimeZone().subscribe((res: any) => {
      console.log(res);
    });
  }

  getHolidayList() {
    this.settingApiService.getHolidayList().subscribe((resp: any) => {
      if (resp) {
        this.holidaysList = resp?.data;
      }
    })
  }

  getGeneralCalendarSetting() {
    this.settingApiService.getGeneralCalendarSetting().subscribe((resp: any) => {
      if (resp.status==='success') {
        this.selectedTimeZone = resp.data.timeZone;
        this.selectedCalendarIncrement=resp.data.calendarIncrement
      }
    })
  }

  createPracticeHoliday() {
    const request = this.holidayForm.value;
    this.settingApiService.createPracticeHoliday(request).subscribe((resp: any) => {
      if (resp) {
        if (resp.status === 'success') {
          const message = "Custom Holiday has been added";
          this.messageService.add({ severity: 'success', detail: message });
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }
        this.newHolidayDialog = false;
        this.getHolidayList();
      }
    })
  }

  deletePracticeHoliday(id: string) {
    this.selectedHolidayId=id
    this.currentWarning='holiday';
    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this holiday"
    }
    this.showDialog = true;
  }
  deleteConfirmation(){
    if(this.currentWarning == 'holiday'){
      this.settingApiService.deletePracticeHoliday(this.selectedHolidayId).subscribe((resp:any) => {
        if (resp) {
          const message = "Holiday has been deleted"
          this.messageService.add({ severity: 'success', detail: message });
          this.close();
          this.getHolidayList();
        }
      })
    }
    else if(this.currentWarning='timeOff'){
      this.settingApiService.deleteStaffTimeOff(this.selectedTimeOffId).subscribe(resp => {
        if (resp) {
          const message = "Staff Time Off has been deleted"
          this.messageService.add({ severity: 'success', detail: message });
          this.showDialog=false;
          this.getAllStaffTimeOff();
        }
      })
    }

  }

  endDateValidator(control) {
    if (this.timeOffForm.get('EndDate').touched && this.timeOffForm.get('StartDate').value &&control.value ) {
      const startDate = new Date(this.timeOffForm.get('StartDate').value);
      const endDate = new Date(control.value);
      return endDate >= startDate ? null : { endDateError: true };
    }
    else{
      return null;
    }
  }

  endTimeValidator(control) {
    if(this.timeOffForm.get('EndTime').touched &&this.timeOffForm.get('StartDate').value &&this.timeOffForm.get('StartTime').value){
      const startDate = this.timeOffForm.get('StartDate').value;
      const endDate = this.timeOffForm.get('EndDate').value;
      const startTime = this.timeOffForm.get('StartTime').value;
      const endTime = control.value;
  
      // Combine start date and time
      const startDateTime = new Date(startDate + ' ' + startTime);
      // Combine end date and time
      const endDateTime = new Date(endDate + ' ' + endTime);
  
      return endDateTime > startDateTime ? null : { endTimeError: true };
    }
    else{
      return null
    }
  }

  close(){
    this.showDialog=false;
  }

  deleteStaffTimeOff(id: string) {
    this.selectedTimeOffId=id;
    this.currentWarning='timeoff';
    this.modalData = {
      title: "Delete",
      messege: "Are you sure want to delete this time off"
    }
    this.showDialog=true;
   
  }
  createGeneralCalendarSetting() {
    console.log(this.selectedTimeZone)
    const request = {
      "timeZone": this.selectedTimeZone,
      "calendarIncrement": this.selectedCalendarIncrement,
      "groupAppointment": true
    }

    this.settingApiService.createGeneralCalendarSetting(request).subscribe((resp: any) => {
      if (resp) {
        if (resp.status === 'success') {
          const message = "Genral Calendar Setting has been updated";
          this.messageService.add({ severity: 'success', detail: message });
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }
      }
    })
  }


  patchServiceLocationName(i, wIndex) {
    this.getWorkHours(i).controls[wIndex].patchValue({
      serrviceLocationName: this.serviceLocationOptions.find(
        (x) => x.key == this.getWorkHours(i).value[wIndex].serrviceLocationId
      ).value,
    });
  }

  getTrimmedDays(value: any) {
    let trimmedValue;
    if (value && value != '') {
      trimmedValue = value.split('').splice(0, 3).join('');
    }
    return trimmedValue;
  }

  editProviderHours(providerData: any) {
    const providerId = providerData.userId;
    this.selectedProviderData = providerData;
    this.settingApiService.getProviderCalendarById(providerId).subscribe(
      (res: any) => {
        if (res.status == 'success') {
          if (res.data) {
            const data = res.data.officeHours;
            this.daysArray.forEach((day, index) => {
              const dayData = data[day];
              dayData.workingTime.forEach((element, index2) => {
                this.addWorkHours(index);
              });
              dayData.breakTime.forEach((element, index2) => {
                this.addBreakHours(index);
              });
              this.Days.at(index).patchValue({
                DayName: day,
              });
              this.getWorkHours(index).patchValue(dayData.workingTime);
              this.getBreakHours(index).patchValue(dayData.breakTime);
            });
          } else {
            console.log('no data found');
          }
          this.providerHoursDialog = true;
        }
      },
      (err) => {
        console.error(err);
      }
    );
    // this.currentProvider=this.providerHoursData.find((element)=>{return element.Id==providerId});
  }

  initTimeOffForm() {
    this.timeOffForm = this.fb.group({
      Staff: [null, Validators.required],
      Reason: [null,  [Validators.required, Validators.pattern(new RegExp(/^.{0,50}$/))]],
      StartDate: ['', Validators.required],
      StartTime: ['', Validators.required],
      EndDate: ['', Validators.required],
      EndTime: ['', Validators.required],
    });
    // Custom validation for start and end date
    this.timeOffForm.get('EndDate').setValidators(Validators.compose([this.endDateValidator.bind(this), Validators.required]));
    this.timeOffForm.get('EndTime').setValidators(Validators.compose([this.endTimeValidator.bind(this), Validators.required]));

    // this.timeOffForm.get('EndDate').setValidators(this.endDateValidator.bind(this));
    // this.timeOffForm.get('EndTime').setValidators(this.endTimeValidator.bind(this));
    this.timeOffForm.get('StartDate').valueChanges.subscribe(()=>{
      this.timeOffForm.get('EndDate').updateValueAndValidity();
    })
    this.timeOffForm.get('StartTime').valueChanges.subscribe(()=>{
      this.timeOffForm.get('EndDate').updateValueAndValidity();
    })
    this.timeOffForm.get('EndDate').valueChanges.subscribe(() => {
      this.timeOffForm.get('EndTime').updateValueAndValidity();
    });
  }
  initHolidayForm() {
    this.holidayForm = this.fb.group({
      name: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  addDay() {
    this.daysArray.forEach((element) => {
      const item = this.fb.group({
        DayName: [element],
        WorkHours: this.fb.array([]),
        BreakHours: this.fb.array([]),
      });
      this.Days.push(item);
    });
  }

  get Days(): FormArray {
    return this.providerHourForm.get('Days') as FormArray;
  }

  getWorkHours(dayIndex: number): FormArray {
    return this.Days.at(dayIndex).get('WorkHours') as FormArray;
  }

  getBreakHours(dayIndex: number): FormArray {
    return this.Days.at(dayIndex).get('BreakHours') as FormArray;
  }

  initWorkHours(): FormGroup {
    return this.fb.group({
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      serrviceLocationId: ['', Validators.required],
      serrviceLocationName: ['', Validators.required],
    });
  }
  initBreakHours(): FormGroup {
    return this.fb.group({
      duration: ['', Validators.required],
      title: ['', Validators.required],
      atOclock: ['', Validators.required],
    });
  }

  addWorkHours(dayIndex: number) {
    this.getWorkHours(dayIndex).push(this.initWorkHours());
  }
  addBreakHours(dayIndex: number) {
    this.getBreakHours(dayIndex).push(this.initBreakHours());
  }

  removeWorkHours(dayIndex: number, workHourIndex: number) {
    this.getWorkHours(dayIndex).removeAt(workHourIndex);
  }
  removeBreakHours(dayIndex: number, breakHourIndex: number) {
    this.getBreakHours(dayIndex).removeAt(breakHourIndex);
  }

  closeProviderHoursDialog() {
    this.Days.clear();
    this.providerHourForm.reset();
    this.addDay();
  }

  openTimeOffDialog() {
    this.newTimeOffDialog = true;
  }

  closeTimeOffDialog() {
    this.isSubmitTimeOff=false;
    this.timeOffForm.reset();
  }

  getTimeOffControl(controlName){
    return this.timeOffForm.get(controlName);
  }
  getHolidayControl(controlName){
    return this.holidayForm.get(controlName);
  }
  createNewTimeOff() {
    if (this.timeOffForm.invalid) {
      return
    }
    const userName = this.providerHoursData.some(x => x.userId === this.timeOffForm.value.Staff) ? this.providerHoursData.find(x => x.userId === this.timeOffForm.value.Staff) : ''
    const requestBody = {
      userId: this.timeOffForm.value.Staff,
      name: userName.firstName + " " + userName.lastName,
      reason: this.timeOffForm.value.Reason,
      startDate: this.timeOffForm.value.StartDate,
      startTime: this.timeOffForm.value.StartTime,
      endDate: this.timeOffForm.value.EndDate,
      endTime: this.timeOffForm.value.EndTime,
    };
    console.log(requestBody);
    this.settingApiService.staffTimeOffCreate(requestBody).subscribe(
      (resp: any) => {
        if (resp.status === 'success') {
          const message = "Staff Time off has been added";
          this.messageService.add({ severity: 'success', detail: message });
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }
        this.newTimeOffDialog = false
        this.timeOffForm.reset();
        this.getAllStaffTimeOff();
      }
    )
  }
  updateTimeOff() {
    if (this.timeOffForm.invalid) {
      return
    }
    const userName = this.providerHoursData.some(x => x.userId === this.timeOffForm.value.Staff) ? this.providerHoursData.find(x => x.userId === this.timeOffForm.value.Staff) : ''
    const requestBody = {
      id: this.selectedTimeOff._id,
      userId: this.timeOffForm.value.Staff,
      name: userName.firstName + " " + userName.lastName,
      reason: this.timeOffForm.value.Reason,
      startDate: this.timeOffForm.value.StartDate,
      startTime: this.timeOffForm.value.StartTime,
      endDate: this.timeOffForm.value.EndDate,
      endTime: this.timeOffForm.value.EndTime,
    };
    console.log(requestBody);
    this.settingApiService.staffTimeOffUpdate(requestBody).subscribe(
      (res) => {
        console.log(res)
        this.newTimeOffDialog = false;
        this.timeOffForm.reset();
        this.getAllStaffTimeOff();
      }
    )
    // console.log(this.timeOffForm.value);
  }

  getAllStaffTimeOff() {
    this.settingApiService.getStaffTimeOffList().subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.selectedTimeOff = undefined
          this.staffTimeOffList = res.data
        }
      }
    )
  }
  getStaffTimeOffById(id) {
    this.settingApiService.getStaffTimeOffById(id).subscribe(
      (res: any) => {
        if (res.status === 'success') {
          this.selectedTimeOff = res.data
          this.timeOffForm.patchValue({
            Staff: this.selectedTimeOff.userId,
            StartDate: this.selectedTimeOff.startDate,
            StartTime: this.selectedTimeOff.startTime,
            EndDate: this.selectedTimeOff.endDate,
            EndTime: this.selectedTimeOff.endTime,
            Reason: this.selectedTimeOff.reason,
          })
          this.newTimeOffDialog = true
        }
      }
    )
  }

  openHolidayDialog() {
    this.newHolidayDialog = true;
  }

  closeHolidayDialog() {
    this.holidayForm.reset();
  }
  createNewHoliday() {
    console.log(this.holidayForm.value);
  }

  updateProviderHours() {
    const officeHours = {};
    this.providerHourForm.value.Days.forEach((element) => {
      officeHours[element.DayName] = {
        workingTime: element.WorkHours,
        breakTime: element.BreakHours,
      };
    });
    const requestBody = {
      userId: this.selectedProviderData.userId,
      officeHours: officeHours,
    };
    this.settingApiService.updateProviderCalendar(requestBody).subscribe(
      (resp:any) => {
        if (resp.status === 'success') {
          const message = "Provider calendar has been updated";
          this.messageService.add({ severity: 'success', detail: message });
        } else {
          const message = resp.message
          this.messageService.add({ severity: 'error', detail: message });
        }
      
        this.providerHoursDialog = false;
        this.getProviderCalendarSettings();
      },
      (err) => {
        console.error(err);
      }
    );
  }

  preSetTime() {
    this.closeProviderHoursDialog();
    this.Days.controls.forEach((day, index) => {
      this.addWorkHours(index);
      this.addBreakHours(index);
      this.getWorkHours(index).patchValue([
        {
          startTime: '9:00 AM',
          endTime: '5:00 PM',
          serrviceLocationId: this.serviceLocationOptions[0].key,
          serrviceLocationName: this.serviceLocationOptions[0].value,
        },
      ]);
      this.getBreakHours(index).patchValue([
        {
          duration: '1 hr',
          title: 'Dinner',
          atOclock: this.breakSlotsOptions[0],
        },
      ]);
    });
  }
  resetTime(event: Event) {
    // this.confirmationService.confirm({
    //   target: event.target as EventTarget,
    //   message: "This'll clear all the current information?",
    //   header: 'Confirmation',
    //   icon: 'pi pi-exclamation-triangle',
    //   acceptIcon: 'none',
    //   rejectIcon: 'none',
    //   rejectButtonStyleClass: 'p-button-text',
    //   accept: () => {
    //     this.closeProviderHoursDialog();
    //   },
    //   reject: () => {

    //   },
    // });
    this.closeProviderHoursDialog();
  }
}
