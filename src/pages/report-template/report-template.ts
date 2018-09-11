import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AccountService} from "../../services/account";

/**
 * Generated class for the ReportTemplatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-report-template',
  templateUrl: 'report-template.html',
})
export class ReportTemplatePage {
  console = console;
  PageName;
  reportDate;
  reportTemplate;
  drQuestion;

  constructor(public navCtrl: NavController, public navParams: NavParams,public accountServ:AccountService) {

    //this is your html write the directive here
    this.reportTemplate ="";

    ////PageName
    let selectedListOfStudents = [];
    selectedListOfStudents = this.navParams.get('selected');
    if(selectedListOfStudents.length > 1){
      if (this.accountServ.reportId == -1) {
        this.PageName = selectedListOfStudents.length + " daily reports are selected";
      } else {
        this.PageName = selectedListOfStudents.length +this.accountServ.reportPage+" are selected";
      }
    }else{
      if (this.accountServ.reportId == -1) {
        this.PageName =  selectedListOfStudents[0].studentName +"'s daily report";
      } else {
        this.PageName =  selectedListOfStudents[0].studentName +"'s "+this.accountServ.reportPage+" report";
      }
    }
    /////Date of Page
    this.reportDate = this.navParams.get('reportDate');
    let reportQuestinsFirst =[];
    reportQuestinsFirst = this.navParams.get('template');
    this.drQuestion = reportQuestinsFirst;
  }








  ////The template of report

  getTemplate(itm) {
    if (itm.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER_WITH_EDIT' ) {
      let checkList = "";
      let textarea = "";
      for (let i = 0; i < itm.parametersList.length; i++) {
        if (itm.parametersList[i].key == "OPTION_ANSWER") {
          checkList += '<label class="checkbox col-md-2 col-sm-4 col-xs-4"><input type="checkbox" name="checkbox' + itm.questionNumber + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[' + i + ']"><i></i>' + itm.parametersList[i].value + '</label>'
        }
        else {
          textarea = '<label class="formLabel">' + itm.parametersList[i].value + ':</label><label class="textarea"><textarea rows="3" cols="50" class="custom-scroll" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[' + i + ']"></textarea></label>';
        }
      }
      this.reportTemplate += '<label class="formLabel">' + itm.question + ':</label><div class="inline-group">' + checkList + '</div><div style=" clear: both;">' + textarea + '</div>';
    }

    else if (itm.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT' ) {
      let radioList = "";
      let textarea = "";
      for (let i = 0; i < itm.parametersList.length; i++) {
        if (itm.parametersList[i].key == "OPTION_ANSWER") {
          radioList += '<label class="radio"><input type="radio" name="radio-inline' + itm.questionNumber + '" value="' + itm.parametersList[i].value + '" ng-change="enableOther(' + itm.questionNumber + ',' + i + ')" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[0]"><i></i>' + itm.parametersList[i].value + '</label>';
        }
        else if (itm.parametersList[i].key == "OPTION_ANSWER_WITH_EDIT") {
          radioList += '<label class="radio"><input type="radio" name="radio-inline' + itm.questionNumber + '" value="' + itm.parametersList[i].value + '"  ng-change="enableOther(' + itm.questionNumber + ',' + i + ')" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[0]"><i></i>' + itm.parametersList[i].value + '</label>';
          textarea = '<label class="formLabel">' + itm.parametersList[i].value + ':</label><label class="textarea"><textarea rows="1" style="width:40%" class="custom-scroll" ng-disabled="enableOtherNote[' + itm.questionNumber + ']" ng-init="enableOtherNote[' + itm.questionNumber + ']=' + true + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[1]"></textarea></label>';
        }
      }
      this.reportTemplate += '<label class="formLabel">' + itm.question + ':</label><div class="row"><div class="col col-12 inline-group">' + radioList + '</div></div><div style="clear:both; class="col-md-6>' + textarea + '</div>';
    }

    else if (itm.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER' ) {
      let radioList = "";
      for (let i = 0; i < itm.parametersList.length; i++) {
        radioList += '<label class="radio"><input type="radio" name="radio-inline' + itm.questionNumber + '" value="' + itm.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer"><i></i>' + itm.parametersList[i].value + '</label>';
      }
      this.reportTemplate += '<label class="formLabel">' + itm.question + ':</label><div class="inline-group">' + radioList + '</div>';
    }

    else if (itm.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION' ) {
      let radioList = "";
      let textarea = "";
      for (let i = 0; i < itm.parametersList.length; i++) {
        if (itm.parametersList[i].key == "OPTION_ANSWER") {
          radioList += '<label class="radio"><input type="radio" name="radio-inline' + itm.questionNumber + '" value="' + itm.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[0]"><i></i>' + itm.parametersList[i].value + '</label>';
        }
        else {
          textarea = '<label class="formLabel">' + itm.parametersList[i].value + ':</label><label class="textarea"><textarea rows="2" cols="50" class="custom-scroll" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[1]"></textarea></label>';
        }
      }
      this.reportTemplate += '<label class="formLabel">' + itm.question + ':</label><div class=""><div class="inline-group">' + radioList + '</div></div><div style=" clear: both;" >' + textarea + '</div>';
    }

    else if (itm.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION' ) {
      let checkList = "";
      let textarea = "";
      for (let i = 0; i < itm.parametersList.length; i++) {
        if (itm.parametersList[i].key == "OPTION_ANSWER") {
          checkList += '<label class="checkbox"><input type="checkbox" name="checkbox' + itm.questionNumber + '" ng-change="disableNote(dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[0],' + itm.questionNumber + ')" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[0]"><i></i>' + itm.parametersList[i].value + '</label>';
        }
        else {
          textarea = '<label class="formLabel">' + itm.parametersList[i].value + ':</label><label class="textarea"><textarea  ng-disabled="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[0]"  rows="3" class="custom-scroll" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[1]"></textarea></label>';
        }
      }
      this.reportTemplate += '<label class="formLabel">' + itm.question + ':</label><div class="row"><div class="col col-12">' + checkList + '</div></div><div>' + textarea + '</div>';
    }

    // else if (itm.dailyReportQuestionType.title == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED' ) {
    //   let label = "";
    //   let row = "";
    //   let radioList = "";
    //   let textList = "";
    //   let countRow = 0;
    //   let countParameters = 0;
    //   let helpertext = false;
    //   let count = 0;
    //   let optionAnswerCounter = 0;
    //   let optionHelperText = 0;
    //   let switchToHelper = 0
    //   for (let i = 0; i < itm.parametersList.length; i++) {
    //     if (itm.parametersList[i].key == "OPTION_ANSWER") {
    //       optionAnswerCounter++;
    //
    //     }
    //     else if (itm.parametersList[i].key == "OPTION_HELPER_TEXT") {
    //       optionHelperText++;
    //
    //     }
    //   }
    //   switchToHelper = (optionAnswerCounter / (optionHelperText)) - 1;
    //   console.log("Hi From Question Directive");
    //   console.log('optionAnswerCounter= ' + optionAnswerCounter + ', optionHelperText= ' + optionHelperText + ', switchToHelper= ' + switchToHelper);
    //   for (let i = 0; i < itm.parametersList.length; i++) {
    //     if (itm.parametersList[i].key == "OPTION_HELPER_TITLE") {
    //       label += '<div class="col col-6"><label class="formLabel">' + itm.parametersList[i].value + ':</label></div>';
    //       // countParameters++;
    //     }
    //     else if (itm.parametersList[i].key == "OPTION_HELPER_TEXT") {
    //       if (helpertext) {
    //         row += '<div class="row"><div class="col-md-3"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
    //         radioList = "";
    //         textList = "";
    //         countRow++;
    //         textList += '<section class="col-md-5" style="margin-left: 14px;"><label class="" style="">' + itm.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
    //         countParameters++;
    //         helpertext = false;
    //         count = 0;
    //       }
    //       else {
    //         textList += '<section class="col-md-5" style="margin-left: 14px;"><label class="" style="">' + itm.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
    //         countParameters++;
    //       }
    //     }
    //     else {
    //       if (count != switchToHelper) {
    //         helpertext = true;
    //         radioList += '<label class="radio"><input type="radio" name="radio-inline' + itm.questionNumber + countRow + '" value="' + itm.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
    //         count++;
    //       }
    //       else {
    //         helpertext = true;
    //         radioList += '<label class="radio"><input type="radio" name="radio-inline' + itm.questionNumber + countRow + '" value="' + itm.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
    //         countParameters++;
    //
    //       }
    //     }
    //   }
    //   row += '<div class="row"><div class="col-md-3"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
    //
    //
    //   this.reportTemplate +=  '<label class="formLabel">' + itm.question + ':</label><div>' + label + '</div><div>' + row + '</div>';
    // }
    //
    // else if (itm.dailyReportQuestionType.title == 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED' ) {
    //   let label = "";
    //   let row = "";
    //   let radioList = "";
    //   let textList = "";
    //   let countRow = 0;
    //   let countParameters = 0;
    //   let helpertext = false;
    //   let count = 0;
    //   let optionAnswerCounter = 0;
    //   let optionHelperText = 0;
    //   let switchToHelper = 0
    //   for (let i = 0; i < itm.parametersList.length; i++) {
    //     if (itm.parametersList[i].key == "OPTION_ANSWER") {
    //       optionAnswerCounter++;
    //
    //     }
    //     else if (itm.parametersList[i].key == "OPTION_HELPER_TEXT") {
    //       optionHelperText++;
    //
    //     }
    //   }
    //   switchToHelper = (optionAnswerCounter / (optionHelperText / 2)) - 1;
    //   console.log("Hi From Question Directive");
    //   console.log(switchToHelper);
    //   for (let i = 0; i < itm.parametersList.length; i++) {
    //     if (itm.parametersList[i].key == "OPTION_HELPER_TITLE") {
    //       label += '<div class="col col-6"><label class="formLabel">' + itm.parametersList[i].value + ':</label></div>';
    //       // countParameters++;
    //     }
    //     else if (itm.parametersList[i].key == "OPTION_HELPER_TEXT") {
    //       if (helpertext) {
    //         row += '<div class="row"><div class="col-md-4 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
    //         radioList = "";
    //         textList = "";
    //         countRow++;
    //         textList += '<section class="col-md-3" style="margin-left: 14px;"><label class="" style="">' + itm.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
    //         countParameters++;
    //         helpertext = false;
    //         count = 0;
    //       }
    //       else {
    //         textList += '<section class="col-md-3" style="margin-left: 14px;"><label class="" style="">' + itm.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
    //         countParameters++;
    //       }
    //     }
    //     else {
    //       if (count != switchToHelper) {
    //         helpertext = true;
    //         radioList += '<label class="radio"><input type="radio" name="radio-inline' + itm.questionNumber + countRow + '" value="' + itm.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
    //         count++;
    //       }
    //       else {
    //         helpertext = true;
    //         radioList += '<label class="radio"><input type="radio" name="radio-inline' + itm.questionNumber + countRow + '" value="' + itm.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
    //         countParameters++;
    //
    //       }
    //     }
    //   }
    //   row += '<div class="row"><div class="col-md-4 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
    //
    //
    //   this.reportTemplate +=  '<label class="formLabel">' + itm.question + ':</label><div>' + label + '</div><div>' + row + '</div>';
    // }
    //
    // else if (itm.dailyReportQuestionType.title == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER' ||
    //   itm.dailyReportQuestionType.title == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER') {
    //   this.reportTemplate +=  '<div class="formLabel" style="width:100%;">' + itm.question +
    //     ':<button type="button" class="btn btn-outline-warning btn-sm" ng-if="dailyReportQuestions[' + itm.questionNumber + '].editQuestion" ng-click="cancelEditigQuestion(' + itm.questionNumber + ')"  style="float:right; margin-left: 7px;" ><i style="font-size:15px; color: #3B9FF3;"  >Cancel </i></button><button type="button" class="btn btn-outline-warning btn-sm" ng-if="editQuestionAllowed" ng-click="editSaveQuestion(' + drQuestion.questionNumber + ')" style="float:right; margin-right: 8px;" >' +
    //     '<i style="font-size:15px; color: #3B9FF3;" ng-if="dailyReportQuestions[' + itm.questionNumber + '].editQuestion" >Save </i><span ng-hide="dailyReportQuestions[' + itm.questionNumber + '].editQuestion" class="glyphicon glyphicon-edit" style="font-size:15px; color: #3B9FF3;"></span></button></div><div class="row" style="width:99%;"><div class="col col-12" style="width:101%;">' +
    //     '<label class="checkbox" *ngFor="parameter of itm.parametersList" style="width:100%;"><input type="checkbox" name="checkbox' + itm.questionNumber +
    //     '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + itm.questionNumber + '].answer[parameter.id]"><i></i>{{parameter.value}} <a style="font-size:20px; color:firebrick; float:right;" ng-if="dailyReportQuestions[' + itm.questionNumber + '].editQuestion"><span class="btn btn-link-danger glyphicon glyphicon-remove" ng-click="removeQuestionParameter(' + drQuestion.questionNumber + ',parameter.id)"></span></a></label></div>' +
    //     '</div><div style="width:100%;" ng-if="dailyReportQuestions[' + itm.questionNumber + '].editQuestion" class="input-group"><div><label class="formLabel"><i></i><span></span></label></div><div class="input-group"><input type="text" ng-model="dailyReportQuestionsEditParamTemps[' + itm.questionNumber + '].parameters[0].value" class="form-control" placeholder=" Pleas enter your new question" /><span class="input-group-btn" style="padding-left:10px;"><button class="btn btn-secondary btn-sm" ng-click="addParameterForQuestion(' + drQuestion.questionNumber + ')"><span class="glyphicon glyphicon-plus" style="font-size:15px; color: #4CAF50;"></span><i style="font-size:15px; color: #3B9FF3;"> Add<i></button></span></div>'
    //     + '</div>';
    // }
    //
    // else if (drQuestion.dailyReportQuestionType.title == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER' ){
    //   let radioList = "";
    //   for (let i = 0; i < drQuestion.parametersList.length; i++) {
    //     radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer"><i></i>' + drQuestion.parametersList[i].value + '</label>';
    //   }
    //   this.reportTemplate += '<label class="formLabel">' + drQuestion.question + ':</label><div class="row"><div class="col col-12">' + radioList + '</div></div>';
    // }
    //
    // else if (drQuestion.dailyReportQuestionType.title == 'CONSTANT_SHORT_HELPER_TEXT_QUESTION' ){
    //   let textList = "";
    //   for (let i = 0; i < drQuestion.parametersList.length; i++) {
    //     textList += '<section class="col col-2" style="margin-left: 9px;"><label class="formLabel ng-scope" style="margin-top: 5px;">' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer.' + i + '"></label></section>';
    //   }
    //   this.reportTemplate += '<label class="formLabel">' + drQuestion.question + ':</label><div class="row" style="">' + textList + '</div>';
    // }
    //
    // else if (drQuestion.dailyReportQuestionType.title == 'SHORT_HELPER_TEXT_QUESTION' ){
    //   let textList = "";
    //   for (let i = 0; i < drQuestion.parametersList.length; i++) {
    //     textList += '<section class="col col-2" style="margin-left: 9px;"><label class="formLabel ng-scope" style="margin-top: 5px;">' + drQuestion.parametersList[i].value + ':</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer.' + i + '"></label></section>';
    //   }
    //   this.reportTemplate += '<label class="formLabel">' + drQuestion.question + ':</label><div class="row" style="">' + textList + '</div>';
    //
    // }
    //
    // else if (drQuestion.dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN' ||
    //   drQuestion.dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR'){
    //   let label = "";
    //   let row = "";
    //   let radioList = "";
    //   let textList = "";
    //   let countRow = 0;
    //   let countParameters = 0;
    //   let helpertext = false;
    //   let count = 0;
    //   let optionAnswerCounter = 0;
    //   let optionHelperText = 0;
    //   let switchToHelper = 0;
    //   let choiceList = [];
    //
    //
    //   for (let i = 0; i < drQuestion.parametersList.length; i++) {
    //     if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
    //       optionAnswerCounter++;
    //
    //     }
    //     else if (drQuestion.parametersList[i].key == "OPTION_DROP_DOWN") {
    //       optionHelperText++;
    //
    //     }
    //   }
    //   switchToHelper = (optionAnswerCounter / (optionHelperText)) - 1;
    //   console.log("Hi From Question Directive");
    //   console.log(switchToHelper);
    //   for (let i = 0; i < drQuestion.parametersList.length; i++) {
    //     if (drQuestion.parametersList[i].key == "OPTION_HELPER_TITLE") {
    //       label += '<div class="col col-6"><label class="formLabel">' + drQuestion.parametersList[i].value + ':</label></div>';
    //       // countParameters++;
    //     }
    //     else if (drQuestion.parametersList[i].key == "OPTION_DROP_DOWN") {
    //       if (helpertext) {
    //
    //
    //         row += '<div class="row"><div class="col-md-6 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-6 inline-group" style="margin-top:20px;">' + radioList + '</div>';
    //         radioList = "";
    //         textList = "";
    //         countRow++;
    //         textList += '<section class="col-md-12" style="margin-left: 14px;"><label class="" style="width=100%">' + drQuestion.parametersList[i].value + '</label>' +
    //           ' <ui-select ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" theme="bootstrap" style="width:100%;"  ng-click="selectAction(' + drQuestion.id + ')">' +
    //           ' <ui-select-match style="width:100%; font-size: x-small;">{{$select.selected}}</ui-select-match>' +
    //           ' <ui-select-choices repeat=" item in selectOptions |filter: $select.search" >' +
    //           ' <div ng-bind-html="item| highlight: $select.search"></ui-select-choices>  </ui-select></section >'
    //
    //         helpertext = false
    //         countParameters++;
    //         ;
    //         count = 0;
    //       }
    //       else {
    //
    //         textList += '<section class="col-md-12 " style="margin-left: 14px;"><label class="" style="width=100%">' + drQuestion.parametersList[i].value + '</label>' +
    //           ' <ui-select ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" theme="bootstrap" style="width:100%;   "  ng-click="selectAction(' + drQuestion.id + ')">' +
    //           ' <ui-select-match style="width:100%; font-size: x-small;">{{$select.selected}}</ui-select-match>' +
    //           ' <ui-select-choices repeat=" item in selectOptions|filter: $select.search">' +
    //           ' <div ng-bind-html=" item | highlight: $select.search"></ui-select-choices> </ui-select></section >'
    //
    //         countParameters++;
    //       }
    //
    //
    //     }
    //     else {
    //       if (count != switchToHelper) {
    //         helpertext = true;
    //         radioList += '<label class="radio" style="margin-right: 0px;margin-left: 35px;"><input type="radio" name="radio-inline' + drQuestion.questionNumber + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']"><i></i>' + drQuestion.parametersList[i].value + '</label>';
    //         count++;
    //       }
    //       else {
    //         helpertext = true;
    //         radioList += '<label class="radio" style="margin-right: 0px;margin-left: 35px;"><input type="radio" name="radio-inline' + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']"><i></i>' + drQuestion.parametersList[i].value + '</label> </div>';
    //         countParameters++;
    //
    //       }
    //
    //     }
    //
    //   }
    //   row += '<div class="row"><div class="col-md-6 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-6 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
    //
    //   this.reportTemplate += '<label class="formLabel">' + drQuestion.question + ':</label><div>' + label + '</div><div>' + row + '</div>';
    // }
    //
    // else{
    //   console.info("ThigetTemplates type not mapped: " + drQuestion.dailyReportQuestionType.title);
    //   this.reportTemplate += '<label class="formLabel">' + drQuestion.question + ':</label><div class="row"><div class="col col-4"></div></div>';
    //
    // }
    }


}
