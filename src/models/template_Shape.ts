import {ParamData} from "./paramData";

export class TemplateShape{

  row = [];

  constructor(){

  }

  makeTheTemplateShape(reportQuestion){
    return this.getTemplate(reportQuestion);
  }




  getTemplate(drQuestion) {

    switch (drQuestion.dailyReportQuestionType.title) {
      case 'TEXT_QUESTION':
        return drQuestion.parametersList;


      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
        return drQuestion.parametersList;


      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_EN':
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_AR':
        return drQuestion.parametersList;


      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER_WITH_EDIT':
        return drQuestion.parametersList;


      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT':
        return drQuestion.parametersList;


      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
        return drQuestion.parametersList;


      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION':
        return drQuestion.parametersList;

      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION':
        return drQuestion.parametersList;

      case 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED':
        let label = [];
        let row = [];
        let tempRow = [];
        var countRow = 0;
        var countParameters = 0;
        var helpertext = false;
        var count = 0;
        var optionAnswerCounter = 0;
        var optionHelperText = 0;
        var switchToHelper = 0
        for (let i = 0; i < drQuestion.parametersList.length; i++) {
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
        for (let i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_HELPER_TITLE") {
            row.push(drQuestion.parametersList[i]);
            // countParameters++;
          }
          else if (drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
            if (helpertext) {
              for(let temp of tempRow){
                row.push(temp);
              }
              tempRow = [];
              countRow++;
              tempRow.push(drQuestion.parametersList[i]);
              countParameters++;
              helpertext = false;
              count = 0;
            }
            else {
              tempRow.push(drQuestion.parametersList[i]);
              countParameters++;
            }
          }
          else {
            if (count != switchToHelper) {
              helpertext = true;
              tempRow.push(drQuestion.parametersList[i]);
              count++;
            }
            else {
              helpertext = true;
              tempRow.push(drQuestion.parametersList[i]);
              countParameters++;

            }
          }
        }

        for(let temp of tempRow){
          row.push(temp);
        }

        return row;

      default:
        return drQuestion.parametersList;
      // case 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED':
      //   label = "";
      //   row = "";
      //   radioList = "";
      //   textList = "";
      //   countRow = 0;
      //   countParameters = 0;
      //   helpertext = false;
      //   count = 0;
      //   optionAnswerCounter = 0;
      //   optionHelperText = 0;
      //   switchToHelper = 0
      //   for (i = 0; i < drQuestion.parametersList.length; i++) {
      //     if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
      //       optionAnswerCounter++;
      //
      //     }
      //     else if (drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
      //       optionHelperText++;
      //
      //     }
      //   }
      //   switchToHelper = (optionAnswerCounter / (optionHelperText / 2)) - 1;
      //   console.log("Hi From Question Directive");
      //   console.log(switchToHelper);
      //   for (i = 0; i < drQuestion.parametersList.length; i++) {
      //     if (drQuestion.parametersList[i].key == "OPTION_HELPER_TITLE") {
      //       label += '<div class="col col-6"><label class="formLabel">' + drQuestion.parametersList[i].value + ':</label></div>';
      //       // countParameters++;
      //     }
      //     else if (drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
      //       if (helpertext) {
      //         row += '<div class="row"><div class="col-md-4 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
      //         radioList = "";
      //         textList = "";
      //         countRow++;
      //         textList += '<section class="col-md-3" style="margin-left: 14px;"><label class="" style="">' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
      //         countParameters++;
      //         helpertext = false;
      //         count = 0;
      //       }
      //       else {
      //         textList += '<section class="col-md-3" style="margin-left: 14px;"><label class="" style="">' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
      //         countParameters++;
      //       }
      //     }
      //     else {
      //       if (count != switchToHelper) {
      //         helpertext = true;
      //         radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
      //         count++;
      //       }
      //       else {
      //         helpertext = true;
      //         radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
      //         countParameters++;
      //
      //       }
      //     }
      //   }
      //   row += '<div class="row"><div class="col-md-4 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
      //
      //
      //   return '<label class="formLabel">' + drQuestion.question + ':</label><br><div>' + label + '</div><div>' + row + '</div>';
      //
      // case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
      // case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
      //
      //   let pramData = "";
      //   for(let parameter of drQuestion.parametersList){
      //     pramData += '<div style="width: 100%"><label class="checkbox" style="width:100%;"><input type="checkbox" name="checkbox' + drQuestion.questionNumber + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer['+parameter.id+']">' +
      //       '<i></i>' +'   '+ parameter.value + '<a style="font-size:20px; color:firebrick; float:right;" *ngIf="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion">\n' +
      //       '<span class="btn btn-link-danger glyphicon glyphicon-remove" (click)="removeQuestionParameter(' + drQuestion.questionNumber + ','+parameter.id+')">\n' +
      //       '</span></a></label></div>';
      //   }
      //
      //   return '<div class="formLabel" style="width:100%;">' + drQuestion.question + ':<button type="button" class="btn btn-outline-warning btn-sm" \n' +
      //     '  *ngIf="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion" (click)="cancelEditigQuestion(' + drQuestion.questionNumber + ')" \n' +
      //     '  style="float:right; margin-left: 7px;" ><i style="font-size:15px; color: #3B9FF3;"  >Cancel</i></button><button type="button" \n' +
      //     '  class="btn btn-outline-warning btn-sm" *ngIf="editQuestionAllowed" (click)="editSaveQuestion(' + drQuestion.questionNumber + ')" \n' +
      //     '  style="float:right; margin-right: 8px;" ><i style="font-size:15px; color: #3B9FF3;" *ngIf="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion" >\n' +
      //     '  Save</i><span hideWhen="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion" class="glyphicon glyphicon-edit" \n' +
      //     '  style="font-size:15px; color: #3B9FF3;"></span></button></div><div class="row" style="width:99%;"><div class="col col-12" style="width:101%;">'
      //     + pramData +
      //     '</div></div><div style="width:100%;" *ngIf="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion" class="input-group"><div>\n' +
      //     '  <label class="formLabel"><i></i><span></span></label></div><div class="input-group" style="width: 100%"><input  type="text" style="width: 80%"\n' +
      //     '  ng-model="dailyReportQuestionsEditParamTemps[' + drQuestion.questionNumber + '].parameters[0].value" class="form-control" placeholder=" Pleas enter your new question" />\n' +
      //     '  <span class="input-group-btn" style="padding-left:10px;"><button class="btn btn-secondary btn-sm" (click)="addParameterForQuestion(' + drQuestion.questionNumber + ')">\n' +
      //     '  <span class="glyphicon glyphicon-plus" style="font-size:15px; color: #4CAF50;"></span><i style="font-size:15px; color: #3B9FF3;">Add</i></button>\n' +
      //     '  </span></div></div>';
      //
      // case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
      //   radioList = "";
      //   for (i = 0; i < drQuestion.parametersList.length; i++) {
      //     radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer"><i></i>' + drQuestion.parametersList[i].value + '</label>';
      //   }
      //   return '<label class="formLabel">' + drQuestion.question + ':</label><br><div class="row"><div class="col col-12">' + radioList + '</div></div>';
      //
      // case 'CONSTANT_SHORT_HELPER_TEXT_QUESTION':
      //   textList = "";
      //   for (i = 0; i < drQuestion.parametersList.length; i++) {
      //     textList += '<section class="col col-2" style="margin-left: 9px;display: inline-block"><label class="formLabel ng-scope" style="margin-top: 5px">  ' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer.' + i + '"></label></section>';
      //   }
      //   return '<label class="formLabel">' + drQuestion.question + ':</label><br><div class="row" style="">' + textList + '</div>';
      //
      // case 'SHORT_HELPER_TEXT_QUESTION':
      //   textList = "";
      //   for (i = 0; i < drQuestion.parametersList.length; i++) {
      //     let textListName = drQuestion.parametersList[i].value+" :      ";
      //     textList += '<div style="display: inline-block"><section class="section" style="margin-left: 9px;width: '+100/drQuestion.parametersList.length+'%"><label class="formLabel ng-scope" style="margin-top: 5px;font-weight: normal">' + textListName + '</label><label class="input"><input style="width: 70px; height: 35px;" type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer.' + i + '"></label></section></div>';
      //   }
      //   return '<label class="formLabel">' + drQuestion.question + ':</label><br><div class="row" style="">' + textList + '</div>';
      //
      // case'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN':
      // case'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR':
      //   label = "";
      //   row = "";
      //   radioList = "";
      //   textList = "";
      //   countRow = 0;
      //   countParameters = 0;
      //   helpertext = false;
      //   count = 0;
      //   optionAnswerCounter = 0;
      //   optionHelperText = 0;
      //   switchToHelper = 0;
      //   var choiceList = [];
      //
      //
      //   for (i = 0; i < drQuestion.parametersList.length; i++) {
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
      //   for (i = 0; i < drQuestion.parametersList.length; i++) {
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
      //   return '<label class="formLabel">' + drQuestion.question + ':</label><br><div>' + label + '</div><div>' + row + '</div>';
      //
      // default:
      //   console.info("ThigetTemplates type not mapped: " + drQuestion.dailyReportQuestionType.title);
      //   return '<label class="formLabel">' + drQuestion.question + ':</label><br><div class="row"><div class="col col-4"></div></div>';
    }
  }

}
