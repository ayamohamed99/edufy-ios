import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import {  NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the MedicalReportViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-medical-report-view',
  templateUrl: 'medical-report-view.html',
})
export class MedicalReportViewPage {

  viewName;
  fullMedicalReport;
  incidentfound = false;
  reportTitle;
  templateLoading = true;
  operation = "view";
  ////////////////Incident/////////////////////
  incident;
  incidentAnswer:any[]=[];
  ////////////////Checkup//////////////////////
  checkupTemplate;
  checkup;
  checkupAnswer;
  checkupQuestions;
  checkupQuestionsFirst;
  checkupAnswersNoOfItems:any[]=[];
  checkupQuestionsEditParamTemps:any[]=[];
  loopData;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController) {
    this.viewName ="View " + navParams.get('viewName');
    this.fullMedicalReport = navParams.get('medicalReport');
    if(navParams.get('viewName') == "Incident"){
      this.incidentfound = true;
    }
    this.reportTitle = navParams.get('viewName')+" Title";

    this.incidentAnswer[0] = {
      "incidentAnswersObjectsList": []
    };

    this.checkupAnswer = {
      "checkupAnswersObjectsList": []
    };





    if (navParams.get('viewName') == "Incident") {
      this.incident = this.fullMedicalReport.medicalRecord.incident;
      this.incident.answers = this.fullMedicalReport.incidentAnswers;
      this.setIncidentTempletFromEdit(this.fullMedicalReport.incidentTemplate);
    }else{
      this.checkup = this.fullMedicalReport.medicalRecord.checkup;
      this.checkup.answers = this.fullMedicalReport.checkupAnswers;
      this.setCheckupTempletFromEdit(this.fullMedicalReport.checkupTemplate);
    }




  }

  close() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicalReportViewPage');
  }

  incidentTemplate;
  incidentQuestions:any[]=[];
  incidentQuestionsFirst;
  incidentAnswersNoOfItems:any[]=[];
  incidentQuestionsEditParamTemps:any[]=[];

  setIncidentTempletFromEdit(val){
    this.templateLoading = false;
    this.incidentTemplate = val;

    this.incidentQuestions[0] = this.incidentTemplate.questionsList;

    this.incidentQuestionsFirst = this.incidentTemplate.questionsList;

    for (let i = 0; i < this.incidentQuestionsFirst.length; i++) {
      this.incidentQuestionsFirst[i].questionNumber = i;
      this.incidentAnswer[0].incidentAnswersObjectsList[i] = {
        answer: null
      };
      this.incidentAnswersNoOfItems[i] = {
        noOfItems: null
      };
      this.incidentQuestionsFirst[i].editQuestion = false;
      this.incidentQuestionsFirst[i].isEdited = false;
    }

    this.incidentQuestions[0] = this.incidentQuestionsFirst;


    for (let i = 0; i < this.incidentQuestions[0].length; i++) {
      this.mappingDefaultAnswers(this.incidentAnswer[0].incidentAnswersObjectsList[i], this.incidentQuestions[0][i]);

      if (this.operation == 'edit' || this.operation == 'view') {
        this.mappingIncidentAnswers(this.incidentAnswer[0].incidentAnswersObjectsList[i], this.incidentQuestions[0][i].id, this.incident);
        this.incidentAnswer[0].incidentAnswersObjectsList[i].answer = this.getViewQuestionAnswer(this.incidentQuestions[0][i], this.incident.answers[i].answer);
      }
      this.incidentQuestionsEditParamTemps[i] = {};
      this.incidentQuestionsEditParamTemps[i].parameters = [];

      for (let j = 0; j < this.incidentQuestions[0][i].parametersList.length; j++) {
        let param = {
          "id": '',
          "key": '',
          "value": ''
        };
        this.incidentQuestionsEditParamTemps[i].parameters[j] = param;
        this.incidentQuestionsEditParamTemps[i].parameters[j].key = this.incidentQuestions[0][i].parametersList[j].key;
      }

    }
  }


  setCheckupTempletFromEdit(val){
    this.templateLoading = false;
    this.checkupTemplate = val;
    this.checkupQuestions = this.checkupTemplate.questionsList;

    this.checkupQuestionsFirst = this.checkupTemplate.questionsList;

    for (let i = 0; i < this.checkupQuestionsFirst.length; i++) {
      this.checkupQuestionsFirst[i].questionNumber = i;
      this.checkupAnswer.checkupAnswersObjectsList[i] = {
        answer: null
      };
      this.checkupAnswersNoOfItems[i] = {
        noOfItems: null
      };
      this.checkupQuestionsFirst[i].editQuestion = false;
      this.checkupQuestionsFirst[i].isEdited = false;
    }

    this.checkupQuestions = this.checkupQuestionsFirst;

    for (let i = 0; i < this.checkupQuestions.length; i++) {
      this.mappingDefaultAnswers(this.checkupAnswer.checkupAnswersObjectsList[i], this.checkupQuestions[i]);

      if (this.operation == 'edit' || this.operation == 'view') {
        this.mappingCheckupAnswers(this.checkupAnswer.checkupAnswersObjectsList[i], this.checkupQuestions[i].id, this.checkup);
        this.checkupAnswer.checkupAnswersObjectsList[i].answer =
          this.getViewQuestionAnswer(this.checkupQuestions[i], this.checkup.answers[i].answer);
      }

      this.checkupQuestionsEditParamTemps[i] = {};
      this.checkupQuestionsEditParamTemps[i].parameters = [];

      for (let j = 0; j < this.checkupQuestions[i].parametersList.length; j++) {
        let param = {
          "id": '',
          "key": '',
          "value": ''
        };
        this.checkupQuestionsEditParamTemps[i].parameters[j] = param;
        this.checkupQuestionsEditParamTemps[i].parameters[j].key = this.checkupQuestions[i].parametersList[j].key;
      }

    }

    this.loopData = this.checkupQuestions;
  }

  mappingIncidentAnswers(answersObject, questionId, incident) {
    for (let i = 0; i < incident.answers.length; i++) {
      let answer = incident.answers[i];
      if (answer.questionId == questionId) {
        return answersObject.answer = answer.answer;
      }
    }
  }

  mappingCheckupAnswers(answersObject, questionId, checkup) {
    for (let i = 0; i < checkup.answers.length; i++) {
      let answer = checkup.answers[i];
      if (answer.questionId == questionId) {
        return answersObject.answer = answer.answer;
      }
    }
  }

  mappingDefaultAnswers(defaultcheckupAnswer, question) {
    return defaultcheckupAnswer.answer = this.getDefaultValue(question);
  }

  getDefaultValue(Question) {
    switch (Question.questionType.title) {
      case 'TEXT_QUESTION':
        return "";
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_EN':
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_AR':
        let val = [];
        let firstTime = true;
        let firstTextField = true;
        let counter = 0;
        let defailtValueArray = [];

        for (let v = 0; v < Question.parametersList.length; v++) {

          if (Question.parametersList[v].key == "OPTION_HELPER_TITLE") {

          } else if (Question.parametersList[v].key == "OPTION_HELPER_TEXT") {

            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = Question.parametersList[v].key;
            defailtValueArray[counter].value = "";
            counter++;

          } else if (Question.parametersList[v].key == "OPTION_ANSWER") {

            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = Question.parametersList[v].key;
            defailtValueArray[counter].value = Question.parametersList[v].value;
            counter++;

          } else {

          }

        }

        for (let d = 0; d < defailtValueArray.length; d++) {
          if (defailtValueArray[d].key == "OPTION_HELPER_TEXT") {
            val[d] = defailtValueArray[d].value;
          } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
            val[d] = defailtValueArray[d].value;
          }

        }
        return val;

      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
        return {};
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER_WITH_EDIT':
        return {};
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT':
        return [Question.parametersList[0].value];
      case 'MULTI_SHORT_TEXT_MULTISELECT_VIEW_SELECTED':
        return {};
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION':
        return [Question.parametersList[0].value];
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION':
        return [true];
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
        return Question.parametersList[0].value;

      case 'CONSTANT_SHORT_HELPER_TEXT_QUESTION':
      case 'CONSTANT_LONG_HELPER_TEXT_QUESTION':
      case 'SHORT_HELPER_TEXT_QUESTION':
      case 'LONG_HELPER_TEXT_QUESTION':
        return {};
      case 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED':
        val = [];
        firstTime = true;
        counter = 0;
        defailtValueArray = [];

        for (let v = 0; v < Question.parametersList.length; v++) {

          if (Question.parametersList[v].key == "OPTION_HELPER_TITLE") {

          } else if (Question.parametersList[v].key == "OPTION_HELPER_TEXT") {
            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = Question.parametersList[v].key;
            defailtValueArray[counter].value = "";
            counter++;

            firstTime = true;
          } else if (Question.parametersList[v].key == "OPTION_ANSWER") {
            if (firstTime) {
              defailtValueArray[counter] = {};
              defailtValueArray[counter].key = Question.parametersList[v].key;
              defailtValueArray[counter].value = Question.parametersList[v].value;
              counter++;
              firstTime = false;
            } else {

            }
          }

        }

        for (let d = 0; d < defailtValueArray.length; d++) {
          if (defailtValueArray[d].key == "OPTION_HELPER_TEXT") {
            val[d] = defailtValueArray[d].value;
          } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
            val[d] = defailtValueArray[d].value;
          }

        }
        return val;
      case 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED':
        val = [];
        firstTime = true;
        firstTextField = true;
        counter = 0;
        defailtValueArray = [];

        for (let v = 0; v < Question.parametersList.length; v++) {

          if (Question.parametersList[v].key == "OPTION_HELPER_TITLE") {

          } else if (Question.parametersList[v].key == "OPTION_HELPER_TEXT") {
            if (firstTextField) {
              defailtValueArray[counter] = {};
              defailtValueArray[counter].key = Question.parametersList[v].key;
              defailtValueArray[counter].value = "";
              counter++;
              firstTextField = false;
            } else {
              defailtValueArray[counter] = {};
              defailtValueArray[counter].key = Question.parametersList[v].key;
              defailtValueArray[counter].value = "00";
              counter++;
              firstTextField = true;

            }

            firstTime = true;
          } else if (Question.parametersList[v].key == "OPTION_ANSWER") {
            if (firstTime) {
              defailtValueArray[counter] = {};
              defailtValueArray[counter].key = Question.parametersList[v].key;
              defailtValueArray[counter].value = Question.parametersList[v].value;
              counter++;
              firstTime = false;
            } else {

            }
          }

        }

        for (let d = 0; d < defailtValueArray.length; d++) {
          if (defailtValueArray[d].key == "OPTION_HELPER_TEXT") {
            val[d] = defailtValueArray[d].value;
          } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
            val[d] = defailtValueArray[d].value;
          }

        }
        return val;
      case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR':
      case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN':
        val = [];
        firstTime = true;
        counter = 0;
        defailtValueArray = [];

        for (let v = 0; v < Question.parametersList.length; v++) {

          if (Question.parametersList[v].key == "OPTION_HELPER_TITLE") {

          } else if (Question.parametersList[v].key == "OPTION_DROP_DOWN") {
            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = Question.parametersList[v].key;
            defailtValueArray[counter].value = "";
            counter++;
            firstTime = true;
          } else if (Question.parametersList[v].key == "OPTION_ANSWER") {
            if (firstTime) {
              defailtValueArray[counter] = {};
              defailtValueArray[counter].key = Question.parametersList[v].key;
              defailtValueArray[counter].value = Question.parametersList[v].value;
              counter++;
              firstTime = false;
            } else {

            }
          }

        }

        for (let d = 0; d < defailtValueArray.length; d++) {
          if (defailtValueArray[d].key == "OPTION_DROP_DOWN") {
            val[d] = "";
          } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
            val[d] = defailtValueArray[d].value;
          }

        }
        return val;

      case 'IMAGES_WITH_DESCRIPTION':
        return [];
      default:
        /*
         * console .info("This type not mapped: " +
         * drQuestion.reportQuestionType.title);
         */
        return "";
    }
  }

  getViewQuestionAnswer(question, dbAnswer) {
    switch (question.questionType.title) {
      case 'TEXT_QUESTION':
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return "";
        }
        return dbAnswer;

      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        let midResult = dbAnswer.split("||");

        let arrayIds = midResult[1].split("$$");
        let value = {};
        for (let i = 0; i < arrayIds.length; i++) {
          value[arrayIds[i]] = true;
        }
        return value;
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER_WITH_EDIT':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        let answersList = dbAnswer.split("$$");
        value = {};
        for (var i = 0; i < question.parametersList.length; i++) {
          if (question.parametersList[i].key == "OPTION_ANSWER") {

            if (answersList.indexOf(question.parametersList[i].value) > -1) {
              value[i] = true
            } else {
              value[i] = false;
            }
          } else if (question.parametersList[i].key == "OPTION_HELPER_TEXT") {
            if (answersList[answersList.length - 1] == null || answersList[answersList.length - 1] == "" || answersList[answersList.length - 1] == " " || answersList[answersList.length - 1] == undefined || answersList[answersList.length - 1] == "undefined") {
              value[i] = "";
            } else {
              value[i] = answersList[answersList.length - 1];
            }

          }
        }
        return value;
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        answersList = dbAnswer.split("$$");
        value = {};
        value[0] = answersList[0];
        if (answersList[1] == null || answersList[1] == "" || answersList[1] == " ") {

        } else {
          value[1] = answersList[1];
        }
        return value;
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        answersList = dbAnswer.split("$$");
        value = {};
        value[0] = answersList[0];
        value[1] = answersList[1];

        return value;
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        value = {};
        if (dbAnswer == question.parametersList[0].value) {
          value[0] = true;
        } else {
          value[0] = false;
          value[1] = dbAnswer;
        }
        return value;
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_EN':
      case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_AR':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        midResult = dbAnswer.split("||");

        let arrayValues = midResult[0].split(/[$&]+/);
        arrayIds = midResult[1].split(/[$&]+/);
        value = {};
        for (let i = 0; i < arrayIds.length; i++) {
          if ((i % 2) == 0) {
            if (arrayValues[i] == null || arrayValues[i] == "" || arrayValues[i] == " " || arrayValues[i] == "0") {
              value[arrayIds[i]] = false;
            } else {
              value[arrayIds[i]] = true;
            }

          } else {
            if (arrayValues[i] == "0") {
              value[arrayIds[i]] = "";
            } else {
              value[arrayIds[i]] = arrayValues[i];
            }

          }

        }
        return value;
      case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR':
      case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN':
        let counter = 0;
        let getAnswerValueArray = [];
        let firstTimeFullArray = true;
        let questionCount = 0;

        for (let j = 0; j < question.parametersList.length; j++) {

          if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

          } else if (question.parametersList[j].key == "OPTION_DROP_DOWN") {
            getAnswerValueArray[counter] = {};
            getAnswerValueArray[counter].key = question.parametersList[j].key;
            counter++;
            firstTimeFullArray = true;
          } else if (question.parametersList[j].key == "OPTION_ANSWER") {
            if (firstTimeFullArray) {
              getAnswerValueArray[counter] = {};
              getAnswerValueArray[counter].key = question.parametersList[j].key;
              counter++;
              firstTimeFullArray = false;
              questionCount++;
            } else {

            }
          }

        }
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }

        let answersQuestionList = dbAnswer.replace(/&/g, "$").split("$$");

        value = {};

        for (let i = 0; i < getAnswerValueArray.length; i++) {
          if (answersQuestionList[i] == 0) {
            value[i] = "";
          } else {
            value[i] = answersQuestionList[i];
          }

        }
        return value;
      case 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED':
      case 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED':

        counter = 0;
        getAnswerValueArray = [];
        firstTimeFullArray = true;
        questionCount = 0;

        for (let j = 0; j < question.parametersList.length; j++) {

          if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

          } else if (question.parametersList[j].key == "OPTION_HELPER_TEXT") {
            getAnswerValueArray[counter] = {};
            getAnswerValueArray[counter].key = question.parametersList[j].key;
            counter++;
            firstTimeFullArray = true;
          } else if (question.parametersList[j].key == "OPTION_ANSWER") {
            if (firstTimeFullArray) {
              getAnswerValueArray[counter] = {};
              getAnswerValueArray[counter].key = question.parametersList[j].key;
              counter++;
              firstTimeFullArray = false;
              questionCount++;
            } else {

            }
          }

        }
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        // var answersQuestionList =
        // dbAnswer.split("||");
        answersQuestionList = dbAnswer.replace(/&/g, "$").split("$$");

        value = {};

        for (let i = 0; i < getAnswerValueArray.length; i++) {

          value[i] = answersQuestionList[i];

        }
        return value;
      case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR':
      case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN':
        counter = 0;
        getAnswerValueArray = [];
        firstTimeFullArray = true;
        questionCount = 0;

        for (let j = 0; j < question.parametersList.length; j++) {

          if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

          } else if (question.parametersList[j].key == "OPTION_DROP_DOWN") {
            getAnswerValueArray[counter] = {};
            getAnswerValueArray[counter].key = question.parametersList[j].key;
            counter++;
            firstTimeFullArray = true;
          } else if (question.parametersList[j].key == "OPTION_ANSWER") {
            if (firstTimeFullArray) {
              getAnswerValueArray[counter] = {};
              getAnswerValueArray[counter].key = question.parametersList[j].key;
              counter++;
              firstTimeFullArray = false;
              questionCount++;
            } else {

            }
          }

        }
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }

        answersQuestionList = dbAnswer.replace(/&/g, "$").split("$$");

        value = {};

        for (let i = 0; i < getAnswerValueArray.length; i++) {

          value[i] = answersQuestionList[i];

        }
        return value;

      case 'CONSTANT_SHORT_HELPER_TEXT_QUESTION':
      case 'CONSTANT_LONG_HELPER_TEXT_QUESTION':
      case 'SHORT_HELPER_TEXT_QUESTION':
      case 'LONG_HELPER_TEXT_QUESTION':
        if (dbAnswer == null || dbAnswer == "" || dbAnswer == " ") {
          return {};
        }
        answersList = dbAnswer.split("$$");
        value = {};
        for (let i = 0; i < question.parametersList.length; i++) {
          value[i] = answersList[i];
        }
        return value;
      case 'IMAGES_WITH_DESCRIPTION':
        return JSON.parse(dbAnswer)
    }
  }
  MULTI_SHORT_TEXT_ONE_VIEW_SELECTED_Index =0;
  DROPDOWN_MENU_ONE_VIEW_SELECTED_index = 0;
  SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED_INDEX=0;
  openDataMULTI_SHORT_TEXT_ONE_VIEW_SELECTED(i){
    this.MULTI_SHORT_TEXT_ONE_VIEW_SELECTED_Index = i;
  }
  openDataDROPDOWN_MENU_ONE_VIEW_SELECTED(i){
    this.DROPDOWN_MENU_ONE_VIEW_SELECTED_index=i;
  }
  openDataSINGLE_SHORT_TEXT_ONE_VIEW_SELECTED(i){
    this.SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED_INDEX=i;
  }

}
