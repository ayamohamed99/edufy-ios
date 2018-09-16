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
        let radios = [];
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
              tempRow.push(radios);
              for(let temp of tempRow) {
                row.push(temp);
              }
              countRow++;
              tempRow = [];
              radios = [];
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
              radios.push(drQuestion.parametersList[i]);
              count++;
            }
            else {
              helpertext = true;
              radios.push(drQuestion.parametersList[i]);
              countParameters++;

            }
          }
        }
        tempRow.push(radios);
        for(let temp of tempRow) {
          row.push(temp);
        }


        return row;

      case 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED':
        row = [];
        tempRow = [];
        radios = [];
        countRow = 0;
        countParameters = 0;
        helpertext = false;
        count = 0;
        optionAnswerCounter = 0;
        optionHelperText = 0;
        switchToHelper = 0
        for (let i = 0; i < drQuestion.parametersList.length; i++) {
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
        for (let i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_HELPER_TITLE") {
            row.push(drQuestion.parametersList[i]);
            // countParameters++;
          }
          else if (drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
            if (helpertext) {
              tempRow.push(radios);
              countRow++;
              row.push(drQuestion.parametersList[i]);
              countParameters++;
              helpertext = false;
              count = 0;
            }
            else {
              row.push(drQuestion.parametersList[i]);
              countParameters++;
            }
          }
          else {
            if (count != switchToHelper) {
              helpertext = true;
              row.push(drQuestion.parametersList[i]);
              count++;
            }
            else {
              helpertext = true;
              row.push(drQuestion.parametersList[i]);
              countParameters++;

            }
          }
        }

        return row;

      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':

        return drQuestion.parametersList;

      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
        let radioList = [];
        for (let i = 0; i < drQuestion.parametersList.length; i++) {
          radioList.push(drQuestion.parametersList[i]);
        }
        return radioList;

      case 'CONSTANT_SHORT_HELPER_TEXT_QUESTION':
        let textList = [];
        for (let i = 0; i < drQuestion.parametersList.length; i++) {
          textList.push(drQuestion.parametersList[i]);
        }
        return textList;

      case 'SHORT_HELPER_TEXT_QUESTION':
        textList = [];
        for (let i = 0; i < drQuestion.parametersList.length; i++) {
          textList.push(drQuestion.parametersList[i]);
        }
        return textList;

      case'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN':
      case'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR':
        row = [];
        radios = [];
        tempRow = [];
        countRow = 0;
        countParameters = 0;
        helpertext = false;
        count = 0;
        optionAnswerCounter = 0;
        optionHelperText = 0;
        switchToHelper = 0;
        var choiceList = [];


        for (let i = 0; i < drQuestion.parametersList.length; i++) {
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
        for (let i = 0; i < drQuestion.parametersList.length; i++) {
          if (drQuestion.parametersList[i].key == "OPTION_HELPER_TITLE") {
            row.push(drQuestion.parametersList[i]);
            // countParameters++;
          }
          else if (drQuestion.parametersList[i].key == "OPTION_DROP_DOWN") {
            if (helpertext) {
              tempRow.push(radios);
              for(let temp of tempRow) {
                row.push(temp);
              }
              countRow++;
              tempRow = [];
              radios = [];
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
              radios.push(drQuestion.parametersList[i]);
              count++;
            }
            else {
              helpertext = true;
              radios.push(drQuestion.parametersList[i]);
              countParameters++;

            }
          }
        }
        tempRow.push(radios);
        for(let temp of tempRow) {
          row.push(temp);
        }


        return row;

      default:
        console.info("ThigetTemplates type not mapped: " + drQuestion.dailyReportQuestionType.title);
        return drQuestion.parametersList;
    }
  }

}
