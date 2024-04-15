import { Component, ViewChild } from '@angular/core';

import { routes } from 'src/app/shared/routes/routes';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import { DataService } from 'src/app/shared/data/data.service';
import { CalendarOptions } from '@fullcalendar/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  public routes = routes;
  @ViewChild('cal') cal:any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: CalendarOptions ;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: any[] = [];

  constructor(private data: DataService,private router:Router) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // this.data.getEvents().subscribe((events: any) => {
    //   this.events = events;
    //   this.options = { ...this.options, ...{ events: events } };
    // });
    this.options = {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialDate: new Date(),
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      initialView: 'dayGridMonth',
      editable: true,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      events:[
        { title: 'event 1', date: '2024-04-01' },
        { title: 'event 2', date: '2024-04-02' }
      ],
      dateClick:function(info){
        console.log(info)
      },
      
    };
    
  }
  onDateClick(res:any){
    if(!res.allDay){
      this.router.navigate(['appointments/add-appointment'],{queryParams:{slotDate:res.dateStr}})
    }
    console.log(res)
    
  }
  ngAfterViewInit(){
    console.log(this.cal.getApi())
    const calendarApi=this.cal.getApi();
    // For changing the  view of the Calendar
    // calendarApi.changeView('dayGrid',{
    //   start: '2024-03-21',
    //   end: '2024-04-05'
    // })
    this.options={
      initialView:'dayGridMonth',
      // events:[
      //   { title: 'event 1', date: '2024-04-01' },
      //   { title: 'event 2', date: '2024-04-02' }
      // ],
      dateClick:this.onDateClick.bind(this)
    }
  }
}
