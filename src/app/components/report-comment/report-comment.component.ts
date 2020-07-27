import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {animate, group, query, style, transition, trigger} from '@angular/animations';
import {ReportComment} from '../../models/reportComment';
import {ToastViewService} from '../../services/ToastView/toast-view.service';
import {ActionSheetController, Platform} from '@ionic/angular';
import {AccountService} from '../../services/Account/account.service';
import {ReportCommentService} from '../../services/ReportComment/report-comment.service';
import {Storage} from '@ionic/storage';

@Component({
  selector: 'app-report-comment',
  templateUrl: './report-comment.component.html',
  styleUrls: ['./report-comment.component.scss'],
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
export class ReportCommentComponent implements OnInit {
  @Input() date: string;
  @Input() studentId: number;
  @Input() reportId: number;
  @Input() expanded: boolean;

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
  @ViewChild('commentsContainer', { static: false }) private commentsContainer: any;

  constructor(private commentsProvider: ReportCommentService, public accountService: AccountService,
              public actionSheetCtrl: ActionSheetController, private toastCtrl: ToastViewService,
              public storage:Storage, private platform:Platform)
  {

    this.isCommentsSectionExpanded = this.expanded;
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


    if (platform.is('desktop')) {
      this.commentsProvider.putHeader(localStorage.getItem('LOCAL_STORAGE_TOKEN'));
    } else {
      storage.get('LOCAL_STORAGE_TOKEN').then(
          val => {
            this.commentsProvider.putHeader(val);
          });
    }

  }

  ngOnInit()
  {
    if (this.expanded) {
      this.toggleCommentsSection();
    }
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
      this.commentsProvider.getComments(this.date, this.studentId, this.reportId)
          .subscribe(val => {

            let comments = val;
            // if(this.platform.is('cordova')){
            //   // @ts-ignore
            //   comments = JSON.parse(val.data);
            // }
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
    this.commentsProvider.postNewComment(this.date, this.studentId,
        this.newCommentToBeSubmitted.trim(), this.reportId)
        .subscribe(data => {
          let newlySubmittedComment = data;

          // if(this.platform.is('cordova')){
          //   newlySubmittedComment = JSON.parse(data.data);
          // }

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
      this.commentsProvider.editComment(this.date, this.studentId,
          comment.comment, comment.id, this.reportId,1)
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

  async presentCommentActionSheet(comment: ReportComment, index: number) {
    this.shouldScrollToBottom = false;
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Comment options',
      buttons: [],
    });
    if (this.canEditComment) {
      actionSheet.buttons.push({
        text: 'Edit',
        icon: "ios-create-outline",
        handler: () => {
          this.toggleEditMode(comment);
        }
      });
    }
    if (this.canDeleteComment) {
      actionSheet.buttons.push({
        text: 'Delete',
        icon: "ios-trash-outline",
        role: 'destructive',
        handler: () => {
          this.onDeleteComment(comment, index)
        }
      })
    }
    await actionSheet.present();
  }

  showErrorToast(operationName: string) {
    // let toast = this.toastCtrl.create({
    //   message: 'Failed to ' + operationName,
    //   duration: 3000,
    // });
    // toast.present();
    this.toastCtrl.presentTimerToast('Failed to ' + operationName);
  }


  approveComment(index){

    var comment = this.currentReportComments[index] ;
    this.commentsProvider.editComment(null, null,
        null, comment.id, null , 2)
        .subscribe(response => {
          let res:any = response;
          // if(this.platform.is('cordova')){
          //   //@ts-ignore
          //   res = response.data;
          // }
          this.isEditedCommentsLoading[comment.id] = false;
          this.inEditModeComments[comment.id] = false;
          let elItem = document.getElementById("itemView"+index);
          let elButton = document.getElementById("buttonView"+index);


          elButton.style.backgroundColor = '#04af23';
          elButton.style.borderColor = '#ffffff';
          elButton.style.color = '#ffffff';
          comment.approved = res.approved;
          comment.awaiting = res.approved;
        }, error1 => {
          this.isEditedCommentsLoading[comment.id] = false;
          this.inEditModeComments[comment.id] = false;
          this.showErrorToast("approve comment");
        });
  }



}
