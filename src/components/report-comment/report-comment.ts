import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ReportCommentProvider} from "../../providers/report-comment/report-comment";
import {ReportComment} from "../../models/reportComment";
import {Student} from "../../models";
import {AccountService} from "../../services/account";
import {ActionSheetController} from "ionic-angular";

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
export class ReportCommentComponent implements OnInit, AfterViewInit {
  @Input() date:string;
  @Input() student:Student;
  @Input() reportId:string;
  public inEditModeComments: object = {};
  public shouldShowComments:boolean = false;
  public canSubmitComment:boolean = false;
  public newCommentToBeSubmitted:string ="";
  public currentReportComments:ReportComment[];
  public isCommentsSectionExpanded:boolean = false;
  public isSendingComment:boolean = false;
  public isEditedCommentsLoading: object = {};
  @ViewChild('commentsContainer') private commentsContainer: any;

  constructor(private commentsProvider: ReportCommentProvider, private accountService: AccountService,
              public actionSheetCtrl: ActionSheetController) {
      this.shouldShowComments = this.accountService.getUserRole().dailyReportCommentView;
      this.canSubmitComment =  this.accountService.getUserRole().dailyReportCommentCreate;
  }

  ngOnInit() {
    // this.scrollToBottom();
  }

  ngAfterViewInit() {
    // this.scrollToBottom();
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
          this.commentsContainer.changes.subscribe(() => {
            const containerElement: HTMLElement = this.commentsContainer.nativeElement;
            containerElement.lastElementChild.scrollIntoView(true);
          });

        },error1 => {
          console.log("errr");
        })
    }

  }

  submitNewComment() {
    this.isSendingComment = true;
    this.commentsProvider.postNewComment(this.date,this.student.studentId,
      this.newCommentToBeSubmitted.trim(), this.reportId)
      .subscribe(newlySubmittedComment => {
        this.newCommentToBeSubmitted = "";
        this.isSendingComment = false;
        this.currentReportComments.push(newlySubmittedComment)
      }, error1 => {
        this.isSendingComment = false;
        console.log("errr");
      });
  }


  onDeleteComment(comment: ReportComment, index: number) {
    this.isEditedCommentsLoading[comment.id] = true;
    this.commentsProvider.deleteComment(comment.id)
      .subscribe(() => {
        this.isEditedCommentsLoading[comment.id] = false;
        this.currentReportComments.splice(index, 1);
      }, error1 => {
        this.isEditedCommentsLoading[comment.id] = false;
        console.log("errr");
      })
  }

  toggleEditMode(comment: ReportComment) {
    if (this.inEditModeComments[comment.id]) {
      this.isEditedCommentsLoading[comment.id] = true;
      this.commentsProvider.editComment(this.date, this.student.studentId,
        comment.comment, comment.id, this.reportId)
        .subscribe(() => {
          this.isEditedCommentsLoading[comment.id] = false;
          this.inEditModeComments[comment.id] = false;
        }, error1 => {
          this.isEditedCommentsLoading[comment.id] = false;
          this.inEditModeComments[comment.id] = false;
          console.log("errr");
        });
    } else {
      this.isEditedCommentsLoading[comment.id] = false;
      this.inEditModeComments[comment.id] = true;
    }
  }

  presentCommentActionSheet(comment: ReportComment, index: number) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Comment options',
      enableBackdropDismiss: true,
      buttons: [
        {
          text: 'Edit',
          icon: "ios-create-outline",
          handler: () => {
            this.toggleEditMode(comment);
          }
        },
        {
          text: 'Delete',
          icon: "ios-trash-outline",
          role: 'destructive',
          handler: () => {
            this.onDeleteComment(comment, index)
          }
        }
      ]
    });

    actionSheet.present();
  }

  trimComment(commentText: string) {
    return commentText.trim();
  }
}
