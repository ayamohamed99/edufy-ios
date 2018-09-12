import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AccountService} from "../../services/account";
import {DomSanitizer} from "@angular/platform-browser";

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
export class ReportTemplatePage{
  console = console;
  PageName;
  reportDate;
  reportTemplate;
  drQuestion;
  enableOtherNote = [];
  dailyReportAnswer;
  dailyReportAnswersNoOfItems;
  dailyReportQuestionsRecovery;
  dailyReportQuestionsEditParamTemps;
  editQuestionAllowed;
  helperTextSSTOVS = false;
  switchToHelperSSTOVS = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,public accountServ:AccountService, public sanitizer:DomSanitizer) {

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

    this.dailyReportAnswer = this.navParams.get('dailyReportAnswer');
    this.dailyReportAnswersNoOfItems = this.navParams.get('dailyReportAnswersNoOfItems');
    this.dailyReportQuestionsRecovery = this.navParams.get('dailyReportQuestionsRecovery');
    this.dailyReportQuestionsEditParamTemps = this.navParams.get('dailyReportQuestionsEditParamTemps');
    this.editQuestionAllowed = this.navParams.get('editQuestionAllowed');

    for(let tw of this.drQuestion){
      this.reportTemplate += this.getTemplate(tw) + '<br><br>';
    }

  }

  // doSwitchHelperSSTOVS(listToGetPrams){
  //   let optionAnswerCounter = 0;
  //   let optionHelperText = 0;
  //   let countParameters =0;
  //   let countSSTOVS =0;
  //
  //   for (let i = 0; i < listToGetPrams.parametersList.length; i++) {
  //     if (listToGetPrams.parametersList[i].key == "OPTION_ANSWER") {
  //       optionAnswerCounter++;
  //
  //     }
  //     else if (listToGetPrams.parametersList[i].key == "OPTION_HELPER_TEXT") {
  //       optionHelperText++;
  //
  //     }
  //   }
  //   this.switchToHelperSSTOVS = (optionAnswerCounter / (optionHelperText)) - 1;
  // }

  ////The template of report

  getTemplate(drQuestion) {

    switch (drQuestion.dailyReportQuestionType.title) {
      case 'TEXT_QUESTION':
        return '<label class="formLabel">' + drQuestion.question + ':</label><label class="textarea"><textarea rows="3" class="custom-scroll" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer"></textarea></label>';
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
        var checkList = "";
        let checkboxForSTMVSMA = '';
        for (let parameter of drQuestion.parametersList){
          checkboxForSTMVSMA += '<label class="checkbox  col-md-2 col-sm-4 col-xs-4">' +
          '<input type="checkbox" name="checkbox' + drQuestion.questionNumber + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer['+parameter.id+']">' +
          '<i></i>' + parameter.value + '</label></div>'
        }

        return '<label class="formLabel">'
          + drQuestion.question + ':' +
          '</label>' +
          '<div class="inline-group">' + checkboxForSTMVSMA;
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_EN':
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_AR':
        checkList = "";
        var textArea = "";
        var row = '<label class="formLabel">' + drQuestion.question + ':</label>';
        for (var i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
            checkList += '<div class="inline-group" ><label class="checkbox col-md-9 col-sm-9 col-xs-9" ><input type="checkbox" name="checkbox' + drQuestion.questionNumber + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + drQuestion.parametersList[i].id + ']"><i></i><input type="text"   only-digits ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + drQuestion.parametersList[i + 1] + ']" style="width:40px;left: 0px;position: relative;margin-left: 10px;margin-right: 10px;  height: 17px;top: 2px;padding-bottom: 4px;top: -3px;" ng-disabled="!dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + drQuestion.parametersList[i].id + ']">' + drQuestion.parametersList[i].value + '</label></div>';
            row += checkList;
            checkList = "";
          }

          /*
              * if(drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
              *
              * textArea +='<label class="textarea col-md-1" ><input
              * type="text"
              * ng-model="dailyReportAnswer.dailyReportAnswersObjectsList['+drQuestion.questionNumber+'].answer['+drQuestion.parametersList[i].id+']"
              * style="width:40px"></label></div>'; row+=textArea;
              * textArea=""; }
              */

        }
        return row;
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER_WITH_EDIT':
        checkList = "";
        var textarea = "";
        for (i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
            checkList += '<label class="checkbox col-md-2 col-sm-4 col-xs-4"><input type="checkbox" name="checkbox' + drQuestion.questionNumber + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + i + ']"><i></i>' + drQuestion.parametersList[i].value + '</label>'
          }
          else {
            textarea = '<label class="formLabel">' + drQuestion.parametersList[i].value + ':</label><label class="textarea"><textarea rows="3" cols="50" class="custom-scroll" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + i + ']"></textarea></label>';
          }
        }
        return '<label class="formLabel">' + drQuestion.question + ':</label><div class="inline-group">' + checkList + '</div><div style=" clear: both;">' + textarea + '</div>';
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT':
        var radioList = "";
        textarea = "";
        for (i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
            radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + '" value="' + drQuestion.parametersList[i].value + '" ng-change="enableOther(' + drQuestion.questionNumber + ',' + i + ')" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[0]"><i></i>' + drQuestion.parametersList[i].value + '</label>';
          }
          else if (drQuestion.parametersList[i].key == "OPTION_ANSWER_WITH_EDIT") {
            radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + '" value="' + drQuestion.parametersList[i].value + '"  ng-change="enableOther(' + drQuestion.questionNumber + ',' + i + ')" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[0]"><i></i>' + drQuestion.parametersList[i].value + '</label>';
            textarea = '<label class="formLabel">' + drQuestion.parametersList[i].value + ':</label><label class="textarea"><textarea rows="1" style="width:40%" class="custom-scroll" ng-disabled="enableOtherNote[' + drQuestion.questionNumber + ']" ng-init="enableOtherNote[' + drQuestion.questionNumber + ']=' + true + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[1]"></textarea></label>';
          }
        }
        return '<label class="formLabel">' + drQuestion.question + ':</label><div class="row"><div class="col col-12 inline-group">' + radioList + '</div></div><div style="clear:both; class="col-md-6>' + textarea + '</div>';
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
        radioList = "";
        for (i = 0; i < drQuestion.parametersList.length; i++) {
          radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer"><i></i>' + drQuestion.parametersList[i].value + '</label>';
        }
        return '<label class="formLabel">' + drQuestion.question + ':</label><div class="inline-group">' + radioList + '</div>';
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION':
        radioList = "";
        textarea = "";
        for (i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
            radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[0]"><i></i>' + drQuestion.parametersList[i].value + '</label>';
          }
          else {
            textarea = '<label class="formLabel">' + drQuestion.parametersList[i].value + ':</label><label class="textarea"><textarea rows="2" cols="50" class="custom-scroll" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[1]"></textarea></label>';
          }
        }
        return '<label class="formLabel">' + drQuestion.question + ':</label><div class=""><div class="inline-group">' + radioList + '</div></div><div style=" clear: both;" >' + textarea + '</div>';

      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION':
        checkList = "";
        textarea = "";
        for (i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
            checkList += '<label class="checkbox"><input type="checkbox" name="checkbox' + drQuestion.questionNumber + '" ng-change="disableNote(dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[0],' + drQuestion.questionNumber + ')" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[0]"><i></i>' + drQuestion.parametersList[i].value + '</label>';
          }
          else {
            textarea = '<label class="formLabel">' + drQuestion.parametersList[i].value + ':</label><label class="textarea"><textarea  ng-disabled="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[0]"  rows="3" class="custom-scroll" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[1]"></textarea></label>';
          }
        }
        return '<label class="formLabel">' + drQuestion.question + ':</label><div class="row"><div class="col col-12">' + checkList + '</div></div><div>' + textarea + '</div>';

      case 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED':
        var label = "";
        row = "";
        radioList = "";
        var textList = "";
        var countRow = 0;
        var countParameters = 0;
        var helpertext = false;
        var count = 0;
        var optionAnswerCounter = 0;
        var optionHelperText = 0;
        var switchToHelper = 0
        for (i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
            optionAnswerCounter++;

          }
          else if (drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
            optionHelperText++;

          }
        }
        switchToHelper = (optionAnswerCounter / (optionHelperText)) - 1;
        console.log("Hi From Question Directive");
        console.log('optionAnswerCounter= ' + optionAnswerCounter + ', optionHelperText= ' + optionHelperText + ', switchToHelper= ' + switchToHelper);
        for (i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_HELPER_TITLE") {
            label += '<div class="col col-6"><label class="formLabel">' + drQuestion.parametersList[i].value + ':</label></div>';
            // countParameters++;
          }
          else if (drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
            if (helpertext) {
              row += '<div class="row"><div class="col-md-3"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
              radioList = "";
              textList = "";
              countRow++;
              textList += '<section class="col-md-5" style="margin-left: 14px;"><label class="" style="">' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
              countParameters++;
              helpertext = false;
              count = 0;
            }
            else {
              textList += '<section class="col-md-5" style="margin-left: 14px;"><label class="" style="">' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
              countParameters++;
            }
          }
          else {
            if (count != switchToHelper) {
              helpertext = true;
              radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
              count++;
            }
            else {
              helpertext = true;
              radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
              countParameters++;

            }
          }
        }
        row += '<div class="row"><div class="col-md-3"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';


        return '<label class="formLabel">' + drQuestion.question + ':</label><div>' + label + '</div><div>' + row + '</div>';
      case 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED':
        label = "";
        row = "";
        radioList = "";
        textList = "";
        countRow = 0;
        countParameters = 0;
        helpertext = false;
        count = 0;
        optionAnswerCounter = 0;
        optionHelperText = 0;
        switchToHelper = 0
        for (i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
            optionAnswerCounter++;

          }
          else if (drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
            optionHelperText++;

          }
        }
        switchToHelper = (optionAnswerCounter / (optionHelperText / 2)) - 1;
        console.log("Hi From Question Directive");
        console.log(switchToHelper);
        for (i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_HELPER_TITLE") {
            label += '<div class="col col-6"><label class="formLabel">' + drQuestion.parametersList[i].value + ':</label></div>';
            // countParameters++;
          }
          else if (drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
            if (helpertext) {
              row += '<div class="row"><div class="col-md-4 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
              radioList = "";
              textList = "";
              countRow++;
              textList += '<section class="col-md-3" style="margin-left: 14px;"><label class="" style="">' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
              countParameters++;
              helpertext = false;
              count = 0;
            }
            else {
              textList += '<section class="col-md-3" style="margin-left: 14px;"><label class="" style="">' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
              countParameters++;
            }
          }
          else {
            if (count != switchToHelper) {
              helpertext = true;
              radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
              count++;
            }
            else {
              helpertext = true;
              radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
              countParameters++;

            }
          }
        }
        row += '<div class="row"><div class="col-md-4 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';


        return '<label class="formLabel">' + drQuestion.question + ':</label><div>' + label + '</div><div>' + row + '</div>';

      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
        return '<div class="formLabel" style="width:100%;">' + drQuestion.question +
          ':<button type="button" class="btn btn-outline-warning btn-sm" ng-if="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion" ng-click="cancelEditigQuestion(' + drQuestion.questionNumber + ')"  style="float:right; margin-left: 7px;" ><i style="font-size:15px; color: #3B9FF3;"  >Cancel </i></button><button type="button" class="btn btn-outline-warning btn-sm" ng-if="editQuestionAllowed" ng-click="editSaveQuestion(' + drQuestion.questionNumber + ')" style="float:right; margin-right: 8px;" >' +
          '<i style="font-size:15px; color: #3B9FF3;" ng-if="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion" >Save </i><span ng-hide="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion" class="glyphicon glyphicon-edit" style="font-size:15px; color: #3B9FF3;"></span></button></div><div class="row" style="width:99%;"><div class="col col-12" style="width:101%;">' +
          '<label class="checkbox" ng-repeat="parameter in drQuestion.parametersList" style="width:100%;"><input type="checkbox" name="checkbox' + drQuestion.questionNumber +
          '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[parameter.id]"><i></i>{{parameter.value}} <a style="font-size:20px; color:firebrick; float:right;" ng-if="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion"><span class="btn btn-link-danger glyphicon glyphicon-remove" ng-click="removeQuestionParameter(' + drQuestion.questionNumber + ',parameter.id)"></span></a></label></div>' +
          '</div><div style="width:100%;" ng-if="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion" class="input-group"><div><label class="formLabel"><i></i><span></span></label></div><div class="input-group"><input type="text" ng-model="dailyReportQuestionsEditParamTemps[' + drQuestion.questionNumber + '].parameters[0].value" class="form-control" placeholder=" Pleas enter your new question" /><span class="input-group-btn" style="padding-left:10px;"><button class="btn btn-secondary btn-sm" ng-click="addParameterForQuestion(' + drQuestion.questionNumber + ')"><span class="glyphicon glyphicon-plus" style="font-size:15px; color: #4CAF50;"></span><i style="font-size:15px; color: #3B9FF3;"> Add<i></button></span></div>'
          + '</div>';
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
        radioList = "";
        for (i = 0; i < drQuestion.parametersList.length; i++) {
          radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer"><i></i>' + drQuestion.parametersList[i].value + '</label>';
        }
        return '<label class="formLabel">' + drQuestion.question + ':</label><div class="row"><div class="col col-12">' + radioList + '</div></div>';
      case 'CONSTANT_SHORT_HELPER_TEXT_QUESTION':
        textList = "";
        for (i = 0; i < drQuestion.parametersList.length; i++) {
          textList += '<section class="col col-2" style="margin-left: 9px;"><label class="formLabel ng-scope" style="margin-top: 5px;">' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer.' + i + '"></label></section>';
        }
        return '<label class="formLabel">' + drQuestion.question + ':</label><div class="row" style="">' + textList + '</div>';
      case 'SHORT_HELPER_TEXT_QUESTION':
        textList = "";
        for (i = 0; i < drQuestion.parametersList.length; i++) {
          textList += '<section class="col col-2" style="margin-left: 9px;"><label class="formLabel ng-scope" style="margin-top: 5px;">' + drQuestion.parametersList[i].value + ':</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer.' + i + '"></label></section>';
        }
        return '<label class="formLabel">' + drQuestion.question + ':</label><div class="row" style="">' + textList + '</div>';
      case'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN':
      case'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR':
        label = "";
        row = "";
        radioList = "";
        textList = "";
        countRow = 0;
        countParameters = 0;
        helpertext = false;
        count = 0;
        optionAnswerCounter = 0;
        optionHelperText = 0;
        switchToHelper = 0;
        var choiceList = [];


        for (i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
            optionAnswerCounter++;

          }
          else if (drQuestion.parametersList[i].key == "OPTION_DROP_DOWN") {
            optionHelperText++;

          }
        }
        switchToHelper = (optionAnswerCounter / (optionHelperText)) - 1;
        console.log("Hi From Question Directive");
        console.log(switchToHelper);
        for (i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_HELPER_TITLE") {
            label += '<div class="col col-6"><label class="formLabel">' + drQuestion.parametersList[i].value + ':</label></div>';
            // countParameters++;
          }
          else if (drQuestion.parametersList[i].key == "OPTION_DROP_DOWN") {
            if (helpertext) {


              row += '<div class="row"><div class="col-md-6 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-6 inline-group" style="margin-top:20px;">' + radioList + '</div>';
              radioList = "";
              textList = "";
              countRow++;
              textList += '<section class="col-md-12" style="margin-left: 14px;"><label class="" style="width=100%">' + drQuestion.parametersList[i].value + '</label>' +
                ' <ui-select ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" theme="bootstrap" style="width:100%;"  ng-click="selectAction(' + drQuestion.id + ')">' +
                ' <ui-select-match style="width:100%; font-size: x-small;">{{$select.selected}}</ui-select-match>' +
                ' <ui-select-choices repeat=" item in selectOptions |filter: $select.search" >' +
                ' <div ng-bind-html="item| highlight: $select.search"></ui-select-choices>  </ui-select></section >'

              helpertext = false
              countParameters++;
              ;
              count = 0;
            }
            else {

              textList += '<section class="col-md-12 " style="margin-left: 14px;"><label class="" style="width=100%">' + drQuestion.parametersList[i].value + '</label>' +
                ' <ui-select ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" theme="bootstrap" style="width:100%;   "  ng-click="selectAction(' + drQuestion.id + ')">' +
                ' <ui-select-match style="width:100%; font-size: x-small;">{{$select.selected}}</ui-select-match>' +
                ' <ui-select-choices repeat=" item in selectOptions|filter: $select.search">' +
                ' <div ng-bind-html=" item | highlight: $select.search"></ui-select-choices> </ui-select></section >'

              countParameters++;
            }


          }
          else {
            if (count != switchToHelper) {
              helpertext = true;
              radioList += '<label class="radio" style="margin-right: 0px;margin-left: 35px;"><input type="radio" name="radio-inline' + drQuestion.questionNumber + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']"><i></i>' + drQuestion.parametersList[i].value + '</label>';
              count++;
            }
            else {
              helpertext = true;
              radioList += '<label class="radio" style="margin-right: 0px;margin-left: 35px;"><input type="radio" name="radio-inline' + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']"><i></i>' + drQuestion.parametersList[i].value + '</label> </div>';
              countParameters++;

            }

          }

        }
        row += '<div class="row"><div class="col-md-6 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-6 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';

        return '<label class="formLabel">' + drQuestion.question + ':</label><div>' + label + '</div><div>' + row + '</div>';
      default:
        console.info("ThigetTemplates type not mapped: " + drQuestion.dailyReportQuestionType.title);
        return '<label class="formLabel">' + drQuestion.question + ':</label><div class="row"><div class="col col-4"></div></div>';
    }
    }

  enableOther(questionN, i) {
    let question = this.drQuestion[questionN];
    let key = question.parametersList[i].key;
    if (key == "OPTION_ANSWER_WITH_EDIT") {
      this.enableOtherNote[questionN] = false;
    } else {
      this.enableOtherNote[questionN] = true;
      this.dailyReportAnswer.dailyReportAnswersObjectsList[questionN].answer[1] = "";
    }

  }
}
