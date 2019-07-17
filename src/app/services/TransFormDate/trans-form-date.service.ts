import { Injectable } from '@angular/core';
import {DatePipe} from "@angular/common";
import * as dateFNS from "date-fns";

@Injectable({
  providedIn: 'root'
})
export class TransFormDateService {
  constructor(private datePipe: DatePipe){}

  transformTheDate(date, dateFormate:string) {
    let dates = this.datePipe.transform(date, dateFormate); //whatever format you need.
    return dates
  }

  getStartDateOfWeek(date, dateFormat) {
    let startWeek = dateFNS.startOfWeek(date);
    return this.transformTheDate(startWeek, dateFormat);
  }

  getEndDateOfWeek(date, dateFormat){
    let endWeek = dateFNS.endOfWeek(date);
    return this.transformTheDate(endWeek, dateFormat);
  }

  getWeekBeforeFromStartDateOfWeek(theStartDate, dateSeparator, dateFormat){
    let arrDate = theStartDate.split(dateSeparator);
    let year = arrDate[0];
    let month = arrDate[1];
    let day = arrDate[2];
    let pereviousyear;
    let pereviousMonth;
    let pereviousDay;
    if(day != 1) {
      pereviousDay = Number(day) - 1;
      pereviousMonth = month;
      pereviousyear = year;
    }else if(day == 1 && month != 1){
      pereviousDay = 27;
      pereviousMonth = Number(month) - 1;
      pereviousyear = year;
    }else if(day == 1 && month == 1){
      pereviousDay = 27;
      pereviousMonth = 12;
      pereviousyear = Number(year) - 1;
    }

    let startDate = this.getStartDateOfWeek(pereviousyear + '-' + pereviousMonth + '-' + pereviousDay, dateFormat);

    let endDate = this.getEndDateOfWeek(pereviousyear + '-' + pereviousMonth + '-' + pereviousDay, dateFormat);

    return {'start':startDate, 'end':endDate}
  }

  getWeekAfterFromEndDateOfWeek(theEndDate,dateSeparator, dateFormat){
    let arrDate = theEndDate.split(dateSeparator);
    let year = arrDate[0];
    let month = arrDate[1];
    let day = arrDate[2];
    let nextYear;
    let nextMonth;
    let nextDay;
    if(day != 31 && (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12)) {
      nextDay = Number(day) + 1;
      nextMonth = month;
      nextYear = year;
    }else if(day != 30 && (month == 4 || month == 6 || month == 9 || month == 11)){
      nextDay = 1;
      nextMonth = month;
      nextYear = year;
    }else if((day != 28 || day != 29) && month == 2){
      nextDay = 1;
      nextMonth = month;
      nextYear = year;
    }else if(day == 31 && (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10)) {
      nextDay = 1;
      nextMonth = Number(month) + 1;
      nextYear = year;
    }else if(day == 31 && month == 12) {
      nextDay = 1;
      nextMonth = 1;
      nextYear = Number(year) + 1;
    }else if(day != 30 && (month == 4 || month == 6 || month == 9 || month == 11)){
      nextDay = 1;
      nextMonth = Number(month) + 1;
      nextYear = year;
    }else if((day != 28 || day != 29) && month == 2){
      nextDay = 1;
      nextMonth = Number(month) + 1;
      nextYear = year;
    }

    let startDate = this.getStartDateOfWeek(nextYear + '-' + nextMonth + '-' + nextDay, dateFormat);

    let endDate = this.getEndDateOfWeek(nextYear + '-' + nextMonth + '-' + nextDay, dateFormat);

    return {'start':startDate, 'end':endDate}
  }


}
