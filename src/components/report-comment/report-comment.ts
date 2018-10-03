import {Component, ElementRef, ViewChild} from '@angular/core';

/**
 * Generated class for the ReportCommentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'report-comment',
  templateUrl: 'report-comment.html'
})
export class ReportCommentComponent {
  public isCommentsSectionExpanded:boolean = false;

  constructor() {

  }


  toggleCommentsSection(){
    this.isCommentsSectionExpanded = !this.isCommentsSectionExpanded;
  }

}
