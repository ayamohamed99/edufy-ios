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

  constructor() {

  }

  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("myAllnav").style.width = "0";
  }

}
