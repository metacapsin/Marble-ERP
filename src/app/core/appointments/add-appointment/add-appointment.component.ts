import { Component, OnInit, ViewChild } from '@angular/core';
import { SettingsService } from 'src/app/shared/data/settings.service';
import { routes } from 'src/app/shared/routes/routes';
import { VisitReasonsService } from 'src/app/shared/data/visit-reasons.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AppointmentService } from 'src/app/shared/data/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmationService, MessageService } from 'primeng/api';
import { combineLatest, forkJoin, map } from 'rxjs';
import { Interval } from 'luxon';
interface data {
  value: string;
}
@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss'],
})
export class AddAppointmentComponent implements OnInit {
  public routes = routes;
  public selectedValue!: string;
  selectedList: data[] = [
    { value: 'Select Doctor' },
    { value: 'Dr.Bernardo James' },
    { value: 'Dr.Andrea Lalema' },
    { value: 'Dr.William Stephin' },
  ];
  appointmentSlots: any[] = [
    '12:00 AM',
    '12:15 AM',
    '12:30 AM',
    '12:45 AM',
    '1:00 AM',
    '1:15 AM',
    '1:30 AM',
    '1:45 AM',
    '2:00 AM',
    '2:15 AM',
    '2:30 AM',
    '2:45 AM',
    '3:00 AM',
    '3:15 AM',
    '3:30 AM',
    '3:45 AM',
    '4:00 AM',
    '4:15 AM',
    '4:30 AM',
    '4:45 AM',
    '5:00 AM',
    '5:15 AM',
    '5:30 AM',
    '5:45 AM',
    '6:00 AM',
    '6:15 AM',
    '6:30 AM',
    '6:45 AM',
    '7:00 AM',
    '7:15 AM',
    '7:30 AM',
    '7:45 AM',
    '8:00 AM',
    '8:15 AM',
    '8:30 AM',
    '8:45 AM',
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
    '5:15 PM',
    '5:30 PM',
    '5:45 PM',
    '6:00 PM',
    '6:15 PM',
    '6:30 PM',
    '6:45 PM',
    '7:00 PM',
    '7:15 PM',
    '7:30 PM',
    '7:45 PM',
    '8:00 PM',
    '8:15 PM',
    '8:30 PM',
    '8:45 PM',
    '9:00 PM',
    '9:15 PM',
    '9:30 PM',
    '9:45 PM',
    '10:00 PM',
    '10:15 PM',
    '10:30 PM',
    '10:45 PM',
    '11:00 PM',
    '11:15 PM',
    '11:30 PM',
    '11:45 PM',
  ];
  isReschedule:boolean=false;
  @ViewChild('multiCheck') multiCheck: any;
  visitReason=[];
  providerList:any=[];
  patientsList:any=[];
  serviceLocationOptions:any=[];
  daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  recurrenceTypeOptions = ["Day", "Week"];
  scheduleOptions:any=[];
  isAppointmentSubmit:boolean=false;
  appointmentForm: FormGroup;
  customRecurrenceForm: FormGroup;
  selectedCalendarIncrement:any;
  endSectionVisible:boolean=false;
  customEventDialog:boolean=false;
  isEditMode:boolean=false;
  isCustomRecurrenceSubmit:boolean=false;
  minDate:Date=new Date();
  weekDays=[
    {
      label:'Sun',
      value:'SU'
    },
    {
      label:'Mon',
      value:'MO'
    },
    {
      label:'Tue',
      value:'TU'
    },
    {
      label:'Wed',
      value:'WE'
    },
    {
      label:'Thu',
      value:'TH'
    },
    {
      label:'Fri',
      value:'FR'
    },
    {
      label:'Sat',
      value:'SA'
    }
  ]
  apptId;
  daySelected:any[];
  constructor(private settingService:SettingsService,private visitReasonService:VisitReasonsService, private fb:FormBuilder,private apptService:AppointmentService,private activeRoute:ActivatedRoute,private snackBar:MatSnackBar,private router:Router,private messageService:MessageService, private confirmationService:ConfirmationService) {
    this.activeRoute.params.subscribe((param) => {
      if(param['apptId']) {
        this.isEditMode = true;
        this.apptId = param['apptId'];
      } else{
        this.isEditMode = false;
      }
    });
   }

  ngOnInit (){
    this.getGeneralCalendarSetting();
    if(!this.isEditMode){
      this.getProvidersList();
      this.getVisitReason();
      this.getPatientsList();
      this.getServiceLocations();
    }
    this.initAppointmentForm();
    this.startDateChange();
    if(this.isEditMode){
      this.getAppointmentById();
    }
    this.initCustomRecurrenceForm();
  }
  
  initCustomRecurrenceForm(){
    this.customRecurrenceForm=this.fb.group({
      Interval:[1,[Validators.required]],
      RepeatType:['Day',Validators.required],
      RecurrenceValue:['onDate'],
      EndDate:[new Date(),],
      After:[10],
    })
    const endDateControl=this.customRecurrenceForm.controls['EndDate']
    this.customRecurrenceForm.value['RecurrenceValue']?endDateControl.disable():null;
    const afterControl=this.customRecurrenceForm.controls['After']
    afterControl.disable();
    this.customRecurrenceForm.controls['RecurrenceValue'].valueChanges.subscribe((val) => {
      if(val==='onDate'){
        afterControl.disable();
        endDateControl.enable();
      }
      else{
        afterControl.enable();
        endDateControl.disable();
      }
    })
  }
  formatDate=(date)=> {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed, so add 1
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };


  initAppointmentForm(){
    // })
    this.appointmentForm=this.fb.group({
      Provider:['', Validators.required],
      Patient:['', Validators.required],
      VisitReason:['', Validators.required],
      StartDate:[this.formatDate(new Date), Validators.required],
      StartTime:['', Validators.required],
      Duration:['', Validators.required],
      Recurrence:['none',Validators.required],
      RecurrenceValue:['onDate',Validators.required],
      EndDate:[this.formatDate(new Date)],
      After:[10],
      ServiceLocation:['',Validators.required],
      AppointmentMode:['inOffice',Validators.required],
      Note:[''],
      upcomingRecurrence:[false],
      Email:['',Validators.required],
      Phone:['',[Validators.required,Validators.pattern('^[0-9]*$'),Validators.minLength(10),Validators.maxLength(10)]],
    })
    const endDateControl=this.appointmentForm.controls['EndDate']
    endDateControl.disable();
    const afterControl=this.appointmentForm.controls['After']
    afterControl.disable();
    this.appointmentForm.controls['RecurrenceValue'].valueChanges.subscribe((val) => {
      if(val==='onDate'){
        afterControl.disable();
        endDateControl.enable();
      }
      else if (val==='after'){
        afterControl.enable();
        endDateControl.disable();
      }
      else{
        afterControl.disable();
        endDateControl.disable();
      }
    })
    
  }
  
  

  closeCustomDialog(){

  }

  showProvider(){
    console.log(this.getApptFormControls('Provider'))
    console.log(this.appointmentForm.value)
  }

  createCustomEvent(){
    console.log(this.daySelected)
    console.log(this.multiCheck)
    if(this.customRecurrenceForm.invalid){
      this.isCustomRecurrenceSubmit=true;
      return;
    }
    else{
      this.isCustomRecurrenceSubmit=false;
    }
    this.customEventDialog=false;
    // console.log(this.customRecurrenceForm.value)
  }

  startDateChange(){
    if(this.isValidDate(this.appointmentForm.value.StartDate)){
      const changedDate=new Date(this.appointmentForm.value.StartDate);
      this.generateRecurrenceOptions(changedDate);
    }
  }
  generateRecurrenceOptions(recurringDate:any=new Date()){
    const selectedDay=this.daysOfWeek[recurringDate.getDay()];
    const recurringDayNumber=this.getOrdinalSuffix(this.getRecurringDayNumber(recurringDate,recurringDate.getDay()));
    const monthName=recurringDate.toLocaleString('default', { month: 'long' })
    this.scheduleOptions=[
      {
        label:'Does not repeat',
        value:'none'
      },
      {
        label:`Weekly on ${selectedDay}`,
        value:'week'
      },
      {
        label:`Every other week on ${selectedDay}`,
        value:'other-week'
      },
      {
        label:`Monthly on ${recurringDayNumber} ${selectedDay}`,
        value:'month'
      },
      {
        label:`Annually on ${recurringDayNumber} ${selectedDay} of ${monthName}`,
        value:'annual'
      },
      {
        label:`Custom`,
        value:'custom'
      },
    ]
  }

  isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }
  getRecurringDayNumber(date,dayOfWeek) {
    const dObj=new Date(date);
    const year=dObj.getFullYear();
    const month=dObj.getMonth();
    const allSelectedDayRecurringDate=[]
    const targetDate = new Date(year, month, 1);
    while (targetDate.getDay() !== dayOfWeek) {
      targetDate.setDate(targetDate.getDate() + 1);
      if(targetDate.getDay()===dayOfWeek){
        allSelectedDayRecurringDate.push(new Date(targetDate))
      }
    }
    while (targetDate.getMonth() === month) {
        // count++;
        targetDate.setDate(targetDate.getDate() + 7)
        const copyTarget=new Date(targetDate)
        allSelectedDayRecurringDate.push(copyTarget)
        // targetDate.setDate(targetDate.getDate() + 7); 
    }
    const dayNumber= allSelectedDayRecurringDate.findIndex(x=>x.getTime()===dObj.getTime())+1
    return dayNumber;
}
getOrdinalSuffix(number) {
  if (number >= 11 && number <= 13) {
      return `${number} th`;
  }
  switch (number % 10) {
      case 1: return `${number}st`;
      case 2: return `${number}nd`;
      case 3: return `${number}rd`;
      default: return `${number}th`;
  }
}
generateTimeSlots(intervalMinutes=15) {
  const slots = [];
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0); // Set time to midnight

  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999); // Set time to just before midnight

  const currentTime = new Date(startDate);

  while (currentTime <= endDate) {
      let hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours %= 12;
      hours = hours || 12; // Handle midnight (0 hours)
      const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      slots.push(timeString);
      currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes);
  }

  return slots;
}

getGeneralCalendarSetting() {
  this.settingService.getGeneralCalendarSetting().subscribe((resp: any) => {
    if (resp.status==='success') {
      this.selectedCalendarIncrement=resp.data.calendarIncrement
      this.appointmentForm.patchValue({
        Duration:this.selectedCalendarIncrement
      })
      if(this.selectedCalendarIncrement){
        this.appointmentSlots= this.generateTimeSlots(this.selectedCalendarIncrement)
      }
      else{
        this.appointmentSlots=this.generateTimeSlots()
      }
    }
  })
}
selectPatient(){
  if(this.appointmentForm.value.Patient){
    this.appointmentForm.patchValue({
      Email:this.appointmentForm.value.Patient.email,
      Phone:this.appointmentForm.value.Patient.phone
    })
  }
}
  getProvidersList(){
    this.settingService.getProviderList().subscribe(
      (res:any)=>{
        if(res.status == "success"){
          // res.data.forEach(element => {
          //   const obj={
          //     ...element,
          //     providerName: element.firstName + ' '+ element.lastName,
          //     providerId:element._id
          //   }
          //   this.providerList.push(obj)
          // });
          this.providerList= res.data;
        }
      }
    )
  }

  getPatientsList(){
    this.settingService.AllpatientApi().subscribe(
      (res:any)=>{
        if(res.status == "success"){
          this.patientsList=res.data
        }
      }
    )
  }

  getVisitReason(){
    this.visitReasonService.getVisitReasonsList().subscribe(
      (res:any)=>{
        if(res.status == "success"){
          this.visitReason=res.data;
        }
      }
    )
  }
  getServiceLocations(){
    this.settingService.getServiceLocationList().subscribe(
      (res:any)=>{
        if(res.status == "success"){
          this.serviceLocationOptions=res.data;   
        }
      }
    )
  }

  getAppointmentById(){
    const providerGetAll=this.settingService.getProviderList().pipe(map((response: any) => response));
    const patientGetAll=this.settingService.AllpatientApi().pipe(map((response: any) => response));
    const visitReasonGetAll=this.visitReasonService.getVisitReasonsList().pipe(map((response: any) => response));
    const serviceLocationGetAll=this.settingService.getServiceLocationList().pipe(map((response: any) => response));
    forkJoin(providerGetAll,patientGetAll,visitReasonGetAll,serviceLocationGetAll).subscribe(
      ([providerResult, patientResult, visitReasonResult, serviceLocationResult]) => {
        // Perform actions based on the results of all APIs
        if(providerResult.status == "success"){
          this.providerList= providerResult.data;
        }
        if(patientResult.status == "success"){
          this.patientsList=patientResult.data
        }

        if(visitReasonResult.status == "success"){
          this.visitReason=visitReasonResult.data;
        }

        if(serviceLocationResult.status == "success"){
          this.serviceLocationOptions=serviceLocationResult.data;   
        }
        // Your actions here...
        this.apptService.getAppointmentById(this.apptId).subscribe((res:any)=>
        {
          if(res.status=="success"){
            console.log("Appointment Details",res.data);
            const data=res.data
            console.log(this.providerList)
            debugger
            console.log(this.providerList.find(x=> x._id==data.providerId))
            this.appointmentForm.patchValue({
              Provider:this.providerList.find(x=> x._id==data.providerId),
              Patient:this.patientsList.find(x=> x._id==data.patientId),
              VisitReason:this.visitReason.find(x=> x._id==data.visitReasonId),
              ServiceLocation:this.visitReason.find(x=> x._id==data.serviceLocationId),
            })
            console.log(this.appointmentForm.value)
            const getRecurrence=()=>{
              if(data.recurrence){
                if(data.recurrence.hasOwnProperty('never')&&data.recurrence.never==true){
                  return 'never'
              }
              else if(data.recurrence.hasOwnProperty('after')&&data.recurrence.after){
                return 'after'
              }
              else if(data.recurrence.hasOwnProperty('onDate')&&data.recurrence.after){ 
                return 'onDate'
              }
              else{
                return 'never';
              }
            }
            else{
              return 'never';
            }
          }
            this.appointmentForm.patchValue({
              Provider:{
                providerName:data.providerName?data.providerName:"",
                providerId:data.providerId?data.providerId:"",
              },
              Patient:this.patientsList.some(e=>e._id===data.patientId)?this.patientsList.find(e=>e._id===data.patientId):null,
              VisitReason:this.visitReason.some(e=>e._id===data.visitReasonId)?this.visitReason.find(e=>e._id===data.visitReasonId):null,
              StartDate:new Date(data.startDate),
              StartTime:data.startTime,
              Duration:data.duration,
              Recurrence:data.recurrenceCode,
              RecurrenceValue:getRecurrence(),
              EndDate:(getRecurrence()=='onDate')?data.recurrence.onDate:'',
              After:(getRecurrence()=='after')?data.recurrence.after:'',
              ServiceLocation:this.serviceLocationOptions.some(e=>e._id===data.serviceLocationId)?this.serviceLocationOptions.find(e=>e._id===data.serviceLocationId):null,
              Note:data.note,
              Phone:data.phoneNo,
              Email:data.emailTo,
            })
            this.toggleEndSectionVisibility();
          }else{
            alert('Error in getting appointment detail');
          }
        })
      },
    )
  }
checkAppointmentConflict(){
    const requestBody={
      providerId: this.appointmentForm.value.Provider.providerId,
      duration: this.appointmentForm.value.Duration,
      startTime:this.appointmentForm.value.StartTime,
      startDate: this.appointmentForm.value.StartDate,
      recurrenceCode: this.appointmentForm.value.Recurrence,
      recurrence: {
          never : this.appointmentForm.value.RecurrenceValue==='never'?true:false ,
          onDate : this.appointmentForm.value.RecurrenceValue==='onDate'?this.appointmentForm.value.EndDate:'',
          after : this.appointmentForm.value.RecurrenceValue==='after'?this.appointmentForm.value.After:''
       },
    }
    this.apptService.appointmentConflict(requestBody).subscribe(
      (res:any)=>{
        if(res.status==='success'){
          console.log(res)
        }
      },
      (err)=>{

      }
    )
  }
  
  getApptFormControls(controlName){
    return this.appointmentForm.get(controlName);
  }
  getCustomRecurrenceControls(controlName){
    return this.customRecurrenceForm.get(controlName);
  }

  createAppointment(event:Event){
    this.isAppointmentSubmit=true;
    console.log(this.appointmentForm)
    if(this.appointmentForm.invalid){
      return
    }
    const formValue=this.appointmentForm.value;
    const request={
      patientId: formValue.Patient._id,
      patientName: formValue.Patient.fullName,
      providerId: formValue.Provider._id,
      providerName: formValue.Provider.firstName,
      visitReasonId: formValue.VisitReason._id,
      visitReasonName: formValue.VisitReason.visitReasonName,
      duration: formValue.Duration,
      startTime: formValue.StartTime,
      startDate: formValue.StartDate,
      endDate: "",
      recurrenceCode: formValue.Recurrence,
      recurrence: {
          onDate : (formValue.Recurrence=='custom')?this.customRecurrenceForm.value.RecurrenceValue==='onDate'?this.customRecurrenceForm.value.EndDate:'':this.appointmentForm.value.RecurrenceValue==='onDate'?this.appointmentForm.value.EndDate:'',
          after : (formValue.Recurrence=='custom')?this.customRecurrenceForm.value.RecurrenceValue==='after'?this.customRecurrenceForm.value.After:'':this.appointmentForm.value.RecurrenceValue==='after'?this.appointmentForm.value.After:'',
          repeatType:(formValue.Recurrence=='custom')?this.customRecurrenceForm.value.RepeatType:'',
          interval:(formValue.Recurrence=='custom')?this.customRecurrenceForm.value.Interval:'',
          week:this.customRecurrenceForm.value.RepeatType=='Week'?this.daySelected:[],
      },
      // customRecurrence: {
      //     repeatType : this.customRecurrenceForm.value.RepeatType,
      //     repeatOn : this.customRecurrenceForm.value.RepeatOn,
      //     never : this.customRecurrenceForm.value.RecurrenceValue==='never'?true:false,
      //     onDate : this.customRecurrenceForm.value.RecurrenceValue==='onDate'?this.customRecurrenceForm.value.EndDate:'',
      //     after : this.customRecurrenceForm.value.RecurrenceValue==='after'?this.customRecurrenceForm.value.After:''
      // },
      serviceLocationId: this.appointmentForm.value.ServiceLocation._id,
      serviceLocationName: this.appointmentForm.value.ServiceLocation.name,
      note: this.appointmentForm.value.Note,
      phoneNo: this.appointmentForm.value.Phone,
      emailTo: this.appointmentForm.value.Email,
}   
    console.log(request);
    if(!this.isEditMode){
      this.apptService.createAppointment(request).subscribe((response:any)=>{
        if(response.status=='success'){
          if (response.status === 'success') {
            // const message = "Appointment created successfully";
            const message = response.message;
            this.messageService.add({ severity: 'success', detail: message});
          } else {
            const message = response.message
            this.messageService.add({ severity: 'error', detail: message });
          }
          this.router.navigate(['appointments/appointment-list'])
        }
      })
    }
    else{
      this.isReschedule=this.appointmentForm.value.upcomingRecurrence;
      this.updateAppointment(request)
      // this.confirmationService.confirm({
      //   target: event.target as EventTarget,
      //   message: "Apply changes to all upcoming appointments? (Yes to apply to all, No to apply only to this occurrence)",
      //   icon: 'pi pi-exclamation-triangle',
      //   acceptButtonStyleClass: 'btn btn-primary',
      //   accept: () => {
      //     this.updateAppointment(request)
      //   },
      //   reject: () => {
      //     this.isReschedule=false;
      //   }
      // });
      
    }
  }

  updateAppointment(request){
    request['_id']=this.apptId;
    request['reschedule']=this.isReschedule
    this.apptService.updateAppointment(request).subscribe((response:any)=>{
      if(response.status=='success'){
        if (response.status === 'success') {
          // const message = "Appointment created successfully";
          const message = response.message;
          this.apiResultNotification('success','Success',message)
          // this.messageService.add({ severity: 'success', summary:'Success', detail: message });
        } else {
          const message = response.message
          this.messageService.add({ severity: 'error',summary:'Error', detail: message });
        }
        this.router.navigate(['appointments/appointment-list'])
      }
    })
  }
  cancelAddAppointment(){
    this.router.navigate(['appointments/appointment-list'])
  }
  toggleEndSectionVisibility(){
    if(this.appointmentForm.value.Recurrence){
      if(this.appointmentForm.value.Recurrence !== 'custom'&& this.appointmentForm.value.Recurrence!=='none'){
        this.endSectionVisible = true;
        if(this.appointmentForm.value.RecurrenceValue==='onDate'){
          this.getApptFormControls('EndDate').setValidators(Validators.required)
        }
        else{
          this.getApptFormControls('EndDate').clearValidators();
          this.getApptFormControls('EndDate').updateValueAndValidity();
        }
        if(this.appointmentForm.value.RecurrenceValue==='after'){
          this.getApptFormControls('After').setValidators(Validators.required)
        }
        else{
          this.getApptFormControls('After').clearValidators();
          this.getApptFormControls('After').updateValueAndValidity();
        }
      }
      else{
        this.endSectionVisible=false
        this.getApptFormControls('EndDate').clearValidators();
        this.getApptFormControls('EndDate').updateValueAndValidity();
        this.getApptFormControls('After').clearValidators();
        this.getApptFormControls('After').updateValueAndValidity();
        if(this.appointmentForm.value.Recurrence==='custom'){
          // this.customEventDialog=true
        }
        else{
          this.customEventDialog=false;
        }
      }
    }
  }

  toggleRecurrenceTypeSelection(){
    // this.setDynamicValidator(this.customRecurrenceForm.value.RepeatType==='Week','Week');
    // this.setDynamicValidator(this.customRecurrenceForm.value.RepeatValue==='onDate','EndDate');
    // this.setDynamicValidator(this.customRecurrenceForm.value.RepeatValue==='after','After');
  }
  setDynamicValidator(condition,formKey){
    if(condition){
      this.getCustomRecurrenceControls(formKey).setValidators(Validators.required)
    }
    else{
      this.getCustomRecurrenceControls(formKey).clearValidators();
      this.getCustomRecurrenceControls(formKey).updateValueAndValidity();
    }
  }

  apiResultNotification(severity,summary,detail){
    this.messageService.add({severity:severity, summary: summary, detail: detail});
  }
}
