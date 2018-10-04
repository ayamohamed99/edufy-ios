import {AfterViewChecked, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ReportCommentProvider} from "../../providers/report-comment/report-comment";
import {ReportComment} from "../../models/reportComment";
import {Student} from "../../models";
import {AccountService} from "../../services/account";

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
export class ReportCommentComponent implements OnInit, AfterViewChecked {
  @Input() date:string;
  @Input() student:Student;
  @Input() reportId:string;
  @ViewChild('commentsContainer') private commentsContainer: ElementRef;
  public shouldShowComments:boolean = false;
  public canSubmitComment:boolean = false;
  public newCommentToBeSubmitted:string ="";
  public currentReportComments:ReportComment[];
  public isCommentsSectionExpanded:boolean = false;
  public isSendingComment:boolean = false;

  constructor(private commentsProvider:ReportCommentProvider,private accountService: AccountService) {
      this.shouldShowComments = this.accountService.getUserRole().dailyReportCommentView;
      this.canSubmitComment =  this.accountService.getUserRole().dailyReportCommentCreate;
  }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.commentsContainer.nativeElement.scrollTop = this.commentsContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  toggleCommentsSection(){
    this.isCommentsSectionExpanded = !this.isCommentsSectionExpanded;
    if(this.isCommentsSectionExpanded){
      this.commentsProvider.getComments(this.date,this.student.studentId,this.reportId)
        .subscribe(comments =>{
          this.currentReportComments = comments;
        },error1 => {

        })
    }

  }

  submitNewComment() {
    this.isSendingComment = true;
    this.commentsProvider.postNewComment(this.date,this.student.studentId,
      this.newCommentToBeSubmitted,this.reportId)
      .subscribe(newlySubmittedComment => {
        this.newCommentToBeSubmitted = "";
        this.isSendingComment = false;
        console.log(newlySubmittedComment);
        this.currentReportComments.push(newlySubmittedComment)
      });
  }
}
