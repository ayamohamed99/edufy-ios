import { Component } from '@angular/core';

/**
 * Generated class for the ReportFilterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'report-filter',
  templateUrl: 'report-filter.html'
})
export class ReportFilterComponent {

  text: string;

  constructor() {
    console.log('Hello ReportFilterComponent Component');
    this.text = 'Hello World';
  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
  }

}
