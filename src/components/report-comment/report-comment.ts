import {AfterViewChecked, Component, Input, OnInit, ViewChild} from '@angular/core';
import {ReportCommentProvider} from "../../providers/report-comment/report-comment";
import {ReportComment} from "../../models/reportComment";
import {Student} from "../../models";
import {AccountService} from "../../services/account";
import {ActionSheetController, ToastController} from "ionic-angular";
import {animate, group, query, style, transition, trigger} from "@angular/animations";

/**
 * Generated class for the ReportCommentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'report-comment',
  templateUrl: 'report-comment.html',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate(300, style({opacity: 0.35}))
      ]),
      transition(':leave', [
        animate(300, style({opacity: 0}))
      ])
    ]),
    trigger('commentAddRemove', [
      transition('void => loaded', [
        query(".comment-message-bubble", [
          style({opacity: '0'})
        ]),
        query(".comment-message-bubble", [
          animate("0.5s ease", style({opacity: '1'}))
        ]),
      ]),
      transition('loaded => void, added => void', [
        query(".comment-message-bubble", [
          style({opacity: '1'})
        ]),
        query(".comment-message-bubble", [
          animate("0.25s ease", style({opacity: '0'}))
        ]),
      ]),
      transition('deleted => void', [
        query(".comment-message-bubble", [
          style({opacity: '1', height: "*", 'margin-bottom': '*'}),
        ]),
        query(".comment-message-bubble", [
          group([
            animate("0.35s ease-in", style({height: 0, 'margin-bottom': '0'})),
            animate("0.25s ease-out", style({opacity: '0'})),
          ])
        ])
      ]),
      transition('void => added', [
        style({height: 0}),
        query(".comment-message-bubble", [
          style({opacity: '0', transform: 'translateY(25%)'}),
        ]),
        group([
          animate("0.75s ease-out", style({height: '*'})),
          query(".comment-message-bubble", [
            group([
              animate("0.5s ease-out", style({transform: 'translateY(0)'})),
              animate("0.35s ease-in", style({opacity: '1'})),
            ])
          ])
        ])
      ])
    ])
  ]
})
export class ReportCommentComponent implements OnInit, AfterViewChecked {
  @Input() date: string;
  @Input() student: Student;
  @Input() reportId: number;

  public shouldShowComments: boolean = false;
  public canSubmitComment: boolean = false;
  public canDeleteComment: boolean = false;
  public canEditComment: boolean = false;

  public newCommentToBeSubmitted: string = "";
  public currentReportComments: ReportComment[];

  public isCommentsSectionExpanded: boolean = false;
  public isSendingComment: boolean = false;
  public isEditedCommentsLoading: object = {};
  public inEditModeComments: object = {};
  public isLoadingComments: boolean = false;
  private shouldScrollToBottom: boolean = true;
  @ViewChild('commentsContainer') private commentsContainer: any;

  constructor(private commentsProvider: ReportCommentProvider, public accountService: AccountService,
              public actionSheetCtrl: ActionSheetController, private toastCtrl: ToastController) {
    if (this.reportId == undefined || this.reportId == null) {
      this.shouldShowComments = this.accountService.getUserRole().dailyReportCommentView;
      this.canSubmitComment = this.accountService.getUserRole().dailyReportCommentCreate;
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

  toggleCommentsSection() {
    this.isCommentsSectionExpanded = !this.isCommentsSectionExpanded;
    if (this.isCommentsSectionExpanded) {
      this.isLoadingComments = true;
      this.commentsProvider.getComments(this.date, this.student.studentId, this.reportId)
        .subscribe(comments => {
          this.shouldScrollToBottom = true;
          this.isLoadingComments = false;
          comments.forEach(value => value.animationStatus = 'loaded');
          this.currentReportComments = comments;
        }, error1 => {
          this.showErrorToast("retrieve report comments");
        })
    }

  }

  submitNewComment() {
    this.isSendingComment = true;
    this.commentsProvider.postNewComment(this.date, this.student.studentId,
      this.newCommentToBeSubmitted.trim(), this.reportId)
      .subscribe(newlySubmittedComment => {
        this.shouldScrollToBottom = true;
        this.newCommentToBeSubmitted = "";
        this.isSendingComment = false;
        newlySubmittedComment.animationStatus = "added";
        this.currentReportComments.push(newlySubmittedComment);
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
        comment.animationStatus = 'deleted';
        this.isEditedCommentsLoading[comment.id] = false;
        setTimeout(() => this.currentReportComments.splice(index, 1), 100);

      }, error1 => {
        comment.animationStatus = 'add';
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
    this.shouldScrollToBottom = false;
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
