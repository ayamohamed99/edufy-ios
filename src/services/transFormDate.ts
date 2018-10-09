import {Injectable} from "@angular/core";
import {DatePipe} from "@angular/common";

@Injectable()
export class TransFormDate{
  constructor(private datePipe: DatePipe){}

  transformTheDate(date, dateFormate:string) {
    return this.datePipe.transform(date, dateFormate); //whatever format you need.
  }
}
