import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {ReportCommentProvider} from "../../providers/report-comment/report-comment";

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
  @Input() date:string;
  @Input() studentId:string;
  @Input() reportId:string;

  public currentReportComments:Comment[];
  public isCommentsSectionExpanded:boolean = false;


  constructor(private commentsProvider:ReportCommentProvider) {

  }


  toggleCommentsSection(){
    this.isCommentsSectionExpanded = !this.isCommentsSectionExpanded;
    if(this.isCommentsSectionExpanded){
      this.commentsProvider.getComments(this.date,this.studentId,this.reportId)
        .subscribe(comments =>{
          this.currentReportComments = comments;
        },error1 => {

        })
    }

  }

}
