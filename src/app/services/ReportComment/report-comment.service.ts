import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {AccountService} from '../Account/account.service';
import {ReportComment} from '../../models/reportComment';
import {Url_domain} from '../../models/url_domain';
import {HTTP} from '@ionic-native/http/ngx';
import {Platform} from '@ionic/angular';
import {from} from 'rxjs';


const GET_DAILY_REPORT_COMMENTS_URL = Url_domain.Domain + '/authentication/comments.ent?operationId=3&date={0}&studentId={1}';
const SEND_DAILY_REPORT_COMMENTS_URL = Url_domain.Domain + '/authentication/comments.ent?operationId=1';
const SEND_DAILY_REPORT_COMMENTS_APPROVE_URL = Url_domain.Domain + '/authentication/comments.ent?operationId=2';
const DELETE_DAILY_REPORT_COMMENTS_URL = Url_domain.Domain + '/authentication/comments.ent?id={0}';
const GET_CUSTOM_REPORT_COMMENTS_URL = Url_domain.Domain + '/authentication/reportComments.ent?operationId=3&date={0}&studentId={1}&reportId={2}';
const SEND_CUSTOM_REPORT_COMMENTS_URL = Url_domain.Domain + '/authentication/reportComments.ent?operationId=1';
const DELETE_CUSTOM_REPORT_COMMENTS_URL = Url_domain.Domain + '/authentication/reportComments.ent?id={0}';


@Injectable({
  providedIn: 'root'
})
export class ReportCommentService {

  private httpHeader;
  val;
  constructor(public http: HttpClient, public httpN:HTTP, private platform:Platform,private accountService: AccountService) {

  }

  getComments(date: string, studentId: number, reportId?: number) {
    let url;
    if (reportId == undefined || reportId == null) {
      // @ts-ignore
      url = GET_DAILY_REPORT_COMMENTS_URL.format(date, studentId);
    } else {
      // @ts-ignore
      url = GET_CUSTOM_REPORT_COMMENTS_URL.format(date, studentId, reportId);
    }

    // if(this.platform.is('cordova')){
    //   // @ts-ignore
    //   return from(this.httpN.get<ReportComment[]>(url, {}, {'Authorization': this.val}))
    //       .pipe(map(data => {
    //         // @ts-ignore
    //         let commentsResponse:[ReportComment] = JSON.parse(data.data);
    //
    //         return commentsResponse.filter(comment =>
    //             (comment.approved || (!comment.approved && this.accountService.getUserRole().dailyReportCommentApprove)
    //                 || (!comment.approved && this.accountService.userId == comment.senderObject.id)));
    //       }));
    // }else{
      return this.http.get<ReportComment[]>(url, {headers: this.httpHeader})
          .pipe(map(commentsResponse => {
            return commentsResponse.filter(comment =>
                (comment.approved || (!comment.approved && this.accountService.getUserRole().dailyReportCommentApprove)
                    || (!comment.approved && this.accountService.userId == comment.senderObject.id)));
          }));
    // }

  }

  postNewComment(date: string, studentId: number, commentText: string, reportId?: number) {
    let url;
    let newCommentSubmission;
    if (reportId == undefined || reportId == null) {
      url = SEND_DAILY_REPORT_COMMENTS_URL;
      newCommentSubmission = {
        studentId,
        senderId: this.accountService.userId,
        senderType: 'USER',
        comment: commentText,
        dailyReportDate: date,
        postDate: ''
      };
    } else {
      url = SEND_CUSTOM_REPORT_COMMENTS_URL;
      newCommentSubmission = {
        studentId,
        senderId: this.accountService.userId,
        senderType: 'USER',
        comment: commentText,
        reportDate: date,
        reportId,
        postDate: ''
      };
    }

    // if(this.platform.is('cordova')){
    //   // @ts-ignore
    //   return from(this.httpN.post<ReportComment>(url, newCommentSubmission, {'Authorization': this.val}))
    //       .pipe(map(data => {
    //         // @ts-ignore
    //         let newCommentResponse = data.data;
    //         newCommentResponse.senderObject = {
    //           id: newCommentResponse.senderId,
    //           type: newCommentResponse.senderType,
    //           name: this.accountService.getUserName()
    //         };
    //         return newCommentResponse;
    //       }));
    // }else{
      return this.http.post<ReportComment>(url, newCommentSubmission, {headers: this.httpHeader})
          .pipe(map(newCommentResponse => {
            newCommentResponse.senderObject = {
              id: newCommentResponse.senderId,
              type: newCommentResponse.senderType,
              name: this.accountService.getUserName()
            };
            return newCommentResponse;
          }));
    // }


  }

  deleteComment(commentId: number, reportId?: number) {
    let url;
    if (reportId == undefined || reportId == null) {
      // @ts-ignore
      url = DELETE_DAILY_REPORT_COMMENTS_URL.format(commentId);
    } else {
      // @ts-ignore
      url = DELETE_CUSTOM_REPORT_COMMENTS_URL.format(commentId);
    }

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.delete(url, {}, {'Authorization': this.val}));
    // }else{
      return this.http.delete(url, {headers: this.httpHeader});
    // }
  }

  editComment(date, studentId, commentText, commentId, reportId , operationId) {
    let url;
    let editedCommentRequest;
    if ((reportId == undefined || reportId == null) && operationId == 1) {
      url = SEND_DAILY_REPORT_COMMENTS_URL;
      editedCommentRequest = {
        comment: commentText,
        dailyReportDate: date,
        id: commentId,
        senderId: this.accountService.userId,
        studentId,
      };
    } else if (operationId == 2) {
      url = SEND_DAILY_REPORT_COMMENTS_APPROVE_URL;
      editedCommentRequest = {
        id: commentId
      };
    } else {
      url = SEND_CUSTOM_REPORT_COMMENTS_URL;
      editedCommentRequest = {
        comment: commentText,
        reportDate: date,
        reportId,
        id: commentId,
        senderId: this.accountService.userId,
        studentId,
      };
    }

    // if(this.platform.is('cordova')){
    //   return from(this.httpN.put(url, editedCommentRequest, {'Authorization': this.val}));
    // }else{
      return this.http.put(url, editedCommentRequest, {headers: this.httpHeader});
    // }
  }

  putHeader(value) {
    this.httpHeader = new HttpHeaders({Authorization: value});
    this.val = value;
  }


}
