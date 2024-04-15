import { Component, ViewChild, OnInit } from '@angular/core';
import {
  CalendarOptions,
  DateSelectArg,
  EventClickArg,
  EventApi,
} from '@fullcalendar/core';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import {
  UntypedFormGroup
} from '@angular/forms';
import { Calendar } from './calendar.model';
import { CalendarService } from './calendar.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Direction } from '@angular/cdk/bidi';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { MatButtonModule } from '@angular/material/button';
import { CheckboxModule } from 'primeng/checkbox';
import { AppointmentService } from 'src/app/shared/data/appointment.service';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { routes } from 'src/app/shared/routes/routes';
import { SettingsService } from 'src/app/shared/data/settings.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SharedModule,
    MatButtonModule,
    MatCheckboxModule,
    FullCalendarModule,
    CheckboxModule
  ],
})
export class CalendarComponent
  implements OnInit {
  public routes = routes
  @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent
  calendar: Calendar | null;
  public addCusForm: UntypedFormGroup;
  dialogTitle: string;
  filterOptions = 'All';
  calendarData!: Calendar;
  providerListData = []
  serviceLocationsListData = []
  appointmentList = [];
  calendarEventsList = [];
  selectedProvider:any[]=[];

  calendarEvents?: EventInput[];

  defaultSlotDuration=20;
  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
    },
    initialView: 'timeGridDay',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
    buttonText:{
      today:'Today'
    }
  };

  constructor(
    public calendarService: CalendarService,
    private apptService: AppointmentService,
    private service: SettingsService,
  ) {
    this.dialogTitle = 'Add New Event';
    const blankObject = {} as Calendar;
    this.calendar = new Calendar(blankObject);
  }

  public ngOnInit(): void {
    this.getTableData();
    this.getProvidersList();
    this.getServiceLocationsList();
    this.getDefaultSlotDuration();
  }

  getProvidersList() {
    this.service.getProviderList().subscribe((resp: any) => {
      this.providerListData = resp.data;
    });
  }
  getServiceLocationsList() {
    this.service.getServiceLocationList().subscribe((resp: any) => {
      this.serviceLocationsListData = resp.data;
    });
  }

  getTableData(data=[]): void {
    this.apptService.getAppointmentList(data).subscribe(
      (res: any) => {
        if (res.status == 'success') {
          this.appointmentList = res.data;
          this.calendarEventsList = [];
          for (const obj of this.appointmentList) {
            this.calendarEventsList.push({
              id: obj.patientId,
              title: obj.visitReasonName,
              start: new Date(obj.startDate),
              end: new Date(obj.endDate),
              allDay: false,
              className: "fc-event-warning",
              groupId: "personal",
              details: obj.patientName,
            });
          }
          this.calendarComponent.events = this.calendarEventsList

        }
      },
      (error) => {
        console.error('Error fetching appointment list:', error);
      }
    );
  }

  getDefaultSlotDuration(){
    this.service.getGeneralCalendarSetting().subscribe((resp: any) => {
      if (resp.status==='success') {
        this.defaultSlotDuration=resp.data.calendarIncrement
      }
      this.calendarOptions['slotDuration']=`00:${this.defaultSlotDuration}:00`
    })
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    this.addNewEvent();
  }

  addNewEvent() {
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.eventClick(clickInfo);
  }

  eventClick(row: EventClickArg) {
    const calendarData = {
      id: row.event.id,
      title: row.event.title,
      category: row.event.groupId,
      startDate: row.event.start,
      endDate: row.event.end,
      details: row.event.extendedProps['details'],
    };
    let tempDirection: Direction;
    if (localStorage.getItem('isRtl') === 'true') {
      tempDirection = 'rtl';
    } else {
      tempDirection = 'ltr';
    }
  }
  
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleEvents(events: EventApi[]) {
    // this.currentEvents = events;
  }
  filterAppointments(){
    console.log(this.selectedProvider)
    this.getTableData(this.selectedProvider);
  }

  getClassNameValue(category: string) {
    let className;
    if (category === 'work') className = 'fc-event-success';
    else if (category === 'personal') className = 'fc-event-warning';
    else if (category === 'important') className = 'fc-event-primary';
    else if (category === 'travel') className = 'fc-event-danger';
    else if (category === 'friends') className = 'fc-event-info';

    return className;
  }
}
