import {AfterViewChecked, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ReportCommentProvider} from "../../providers/report-comment/report-comment";
import {ReportComment} from "../../models/reportComment";
import {Student} from "../../models";
import {AccountService} from "../../services/account";
import {ActionSheetController, ToastController} from "ionic-angular";

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
  @Input() reportId: number;

  public shouldShowComments:boolean = false;
  public canSubmitComment:boolean = false;
  public canDeleteComment: boolean = false;
  public canEditComment: boolean = false;

  public newCommentToBeSubmitted:string ="";
  public currentReportComments:ReportComment[];

  public isCommentsSectionExpanded:boolean = false;
  public isSendingComment:boolean = false;
  public isEditedCommentsLoading: object = {};
  public inEditModeComments: object = {};
  public isLoadingComments: boolean = false;
  private shouldScrollToBottom: boolean = true;
  @ViewChild('commentsContainer') private commentsContainer: any;

  constructor(private commentsProvider: ReportCommentProvider, public accountService: AccountService,
              public actionSheetCtrl: ActionSheetController, private toastCtrl: ToastController) {
    if (this.reportId == undefined || this.reportId == null) {
      this.shouldShowComments = this.accountService.getUserRole().dailyReportCommentView;
      this.canSubmitComment =  this.accountService.getUserRole().dailyReportCommentCreate;
      this.canDeleteComment = this.accountService.getUserRole().dailyReportCommentDelete;
      this.canEditComment = this.accountService.getUserRole().dailyReportCommentEdit;
    } else {
      this.shouldShowComments = this.accountService.getUserRole().reportCommentView;
      this.canSubmitComment = this.accountService.getUserRole().reportCommentCreate;
      this.canDeleteComment = this.accountService.getUserRole().dailyReportCommentDelete;
      this.canEditComment = this.accountService.getUserRole().dailyReportCommentEdit;
    }

  }

  ngOnInit() {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.shouldScrollToBottom) {
      try {
        this.commentsContainer.nativeElement.scrollTop = this.commentsContainer.nativeElement.scrollHeight;
      } catch (err) {
      }
    }
  }

  toggleCommentsSection(){
    this.isCommentsSectionExpanded = !this.isCommentsSectionExpanded;
    if(this.isCommentsSectionExpanded){
      this.isLoadingComments = true;
      this.commentsProvider.getComments(this.date,this.student.studentId,this.reportId)
        .subscribe(comments =>{
          this.shouldScrollToBottom = true;
          this.isLoadingComments = false;
          this.currentReportComments = comments;
        },error1 => {
          this.showErrorToast("retrieve report comments");
        })
    }

  }

  submitNewComment() {
    this.isSendingComment = true;
    this.commentsProvider.postNewComment(this.date,this.student.studentId,
      this.newCommentToBeSubmitted.trim(), this.reportId)
      .subscribe(newlySubmittedComment => {
        this.shouldScrollToBottom = true;
        this.newCommentToBeSubmitted = "";
        this.isSendingComment = false;
        this.currentReportComments.push(newlySubmittedComment)
      }, error1 => {
        this.isSendingComment = false;
        this.showErrorToast("submit new comment");
      });
  }


  onDeleteComment(comment: ReportComment, index: number) {
    this.shouldScrollToBottom = false;
    this.isEditedCommentsLoading[comment.id] = true;
    this.commentsProvider.deleteComment(comment.id, this.reportId)
      .subscribe(() => {
        this.isEditedCommentsLoading[comment.id] = false;
        this.currentReportComments.splice(index, 1);
      }, error1 => {
        this.isEditedCommentsLoading[comment.id] = false;
        this.showErrorToast("delete comment");
      })
  }

  toggleEditMode(comment: ReportComment) {
    this.shouldScrollToBottom = false;
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
          this.showErrorToast("edit comment");
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
    });
    if (this.canEditComment) {
      actionSheet.addButton({
        text: 'Edit',
        icon: "ios-create-outline",
        handler: () => {
          this.toggleEditMode(comment);
        }
      });
    }
    if (this.canDeleteComment) {
      actionSheet.addButton({
        text: 'Delete',
        icon: "ios-trash-outline",
        role: 'destructive',
        handler: () => {
          this.onDeleteComment(comment, index)
        }
      })
    }
    actionSheet.present();
  }

  showErrorToast(operationName: string) {
    let toast = this.toastCtrl.create({
      message: 'Failed to ' + operationName,
      duration: 3000,
    });
    toast.present();
  }
}
