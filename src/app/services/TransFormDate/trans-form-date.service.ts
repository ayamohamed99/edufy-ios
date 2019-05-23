import { Injectable } from '@angular/core';
import {DatePipe} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class TransFormDateService {
  constructor(private datePipe: DatePipe){}

  transformTheDate(date, dateFormate:string) {
    return this.datePipe.transform(date, dateFormate); //whatever format you need.
  }
}
