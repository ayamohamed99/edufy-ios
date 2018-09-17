import {Component, OnInit} from '@angular/core';
import {
  FabContainer, IonicPage, LoadingController, NavController, NavParams, Platform,
  ToastController
} from 'ionic-angular';
import {AccountService} from "../../services/account";
import {DomSanitizer} from "@angular/platform-browser";
import {TemplateShape} from "../../models/template_Shape";
import {Storage} from "@ionic/storage";
import {DailyReportService} from "../../services/dailyreport";

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
  localStorageToken: string = 'LOCAL_STORAGE_TOKEN';
  PageName;
  reportDate;
  reportTemplate;
  drQuestion = [];
  enableOtherNote = [];
  dailyReportAnswer;
  dailyReportAnswersNoOfItems;
  dailyReportQuestionsRecovery;
  dailyReportQuestionsEditParamTemps;
  editQuestionAllowed;
  helperTextSSTOVS = false;
  switchToHelperSSTOVS = 0;
  templateViewObjects = [];
  singleQuestionRow = [];
  countParameters = 0;
  load;
  selectionData = new Map();
  overrideAnswer = false;
  isUserEditing;

  addCount(){
    this.countParameters +=this.countParameters;
  }
  removeCount(){
    this.countParameters = 0;
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,public accountServ:AccountService, public sanitizer:DomSanitizer,
              public platform: Platform, public storage: Storage,public dailyReportServ:DailyReportService, public loadCtrl: LoadingController,
              private toastCtrl: ToastController) {

    //this is your html write the directive here
    this.reportTemplate ="";
    this.drQuestion = [];
    this.drQuestion = this.navParams.get('template');

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

    this.dailyReportAnswer = this.navParams.get('dailyReportAnswer');
    this.dailyReportAnswersNoOfItems = this.navParams.get('dailyReportAnswersNoOfItems');
    this.dailyReportQuestionsRecovery = this.navParams.get('dailyReportQuestionsRecovery');
    this.dailyReportQuestionsEditParamTemps = this.navParams.get('dailyReportQuestionsEditParamTemps');
    this.editQuestionAllowed = this.navParams.get('editQuestionAllowed');

    let editDropOrNot = true;
    let editSingleOrNot = true;
    for(let i=0; i<this.drQuestion.length;i++){
      if(this.drQuestion[i].dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN' || this.drQuestion[i].dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR'){
        for(let itm of this.drQuestion[i].parametersList) {
          if (itm.key == "OPTION_ANSWER") {
            editDropOrNot = false;
          }
        }
      }
      else if(this.drQuestion[i].dailyReportQuestionType.title == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED'){
        for(let itm of this.drQuestion[i].parametersList) {
          if (itm.key == "OPTION_ANSWER") {
            editSingleOrNot = false;
          }
        }
      }
    }

    let template = new TemplateShape();
    for(let i=0; i<this.drQuestion.length;i++){

      let temp = template.makeTheTemplateShape(this.drQuestion[i]);
      if(temp.length >0) {
        if(this.drQuestion[i].dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN' || this.drQuestion[i].dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR'){
          if(editDropOrNot == false){
            this.drQuestion[i].parametersList = temp;
          }
        }
        else if(this.drQuestion[i].dailyReportQuestionType.title == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED'){
          if(editSingleOrNot == false){
            this.drQuestion[i].parametersList = temp;
          }
        }else{
          this.drQuestion[i].parametersList = temp;
        }
      }
    }


    if (platform.is('core')) {
      this.dailyReportServ.putHeader(localStorage.getItem(this.localStorageToken));
      this.callDataAndWait();
    } else {
      storage.get(this.localStorageToken).then(
        val => {
          this.dailyReportServ.putHeader(val);
          this.callDataAndWait();
        });

    }

  }

  callDataAndWait(){
    this.load = this.loadCtrl.create({
      content: "loading DropDown list Data ..."
    });
    this.load.present();
    let promises = [];
    for(let i=0; i<this.drQuestion.length;i++){
      if(this.drQuestion[i].dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN' || this.drQuestion[i].dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR'){
        for(let itm of this.drQuestion[i].parametersList) {
          if (itm.key == "OPTION_DROP_DOWN") {
            promises.push(this.getDropDownListIfFound(this.drQuestion[i].id));
          }
        }
      }
    }

    Promise.all(promises).then(
      val =>{
        this.load.dismiss();
      }
    ).catch(
      err =>{
        console.log(err);
        this.load.dismiss();
      }
    )
  }

  getDropDownListIfFound(questionKey){
    return this.dailyReportServ.getDropDownPremeter(questionKey).toPromise().then(
      val=>{
        this.selectionData.set(questionKey,val);
      }
    ).catch(
      eer=>{
        console.log(eer);
        this.load.dismiss();
      }
    )

  }

  changeEditMode(index,button,questionNumber){

    if (button == "save"){
      this.drQuestion[index].editQuestion =  false;
      this.drQuestion[index].isEdited =  true;
    }
  }

  removeQuestionParameter(questionNumber, parameterId) {
    // console.log('remove ... questionNumber=
    // '+questionNumber+', parameterId=
    // '+parameterId);
    let newQuestionParameters = [];
    let oldQuestionParameters = this.drQuestion[questionNumber].parametersList;
    // console.log('Old:');
    // console.log(oldQuestionParameters);
    let ctr = 0;
    for (let i = 0; i < oldQuestionParameters.length; i++) {

      if (oldQuestionParameters[i].id !== parameterId) {
        newQuestionParameters[ctr] = oldQuestionParameters[i];
        ctr++;
      }
    }
    console.log('New:');
    console.log(this.drQuestion);
    this.drQuestion[questionNumber].parametersList = newQuestionParameters;
  }

  addParameterForQuestion (questionNumber) {

    // console.log($scope.dailyReportQuestionsEditParamTemps);

    let numberOfParams = this.drQuestion[questionNumber].parametersList.length;
    let id = 0;
    let parametersList = this.drQuestion[questionNumber].parametersList;

    // give temporary Id to the new parameter
    if (parametersList.length > 0) {
      id = parametersList[0].id;
      var isInList = true;
      while (isInList) {
        id = id + 1;
        var found = false;
        for (var i = 0; i < parametersList.length; i++) {
          if (id === parametersList[i].id) {
            found = true;
          }
        }
        if (found === false) {
          isInList = false;
        }
      }
    }
    switch (this.drQuestion[questionNumber].dailyReportQuestionType.title) {
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
        let value = this.dailyReportQuestionsEditParamTemps[questionNumber].parameters[0].value;
        if (value === '' || value.replace(" ", "") === '' || value === "" || value.replace(" ", "") === "") {
          return;
        }
        this.drQuestion[questionNumber].parametersList[numberOfParams] = {};
        this.drQuestion[questionNumber].parametersList[numberOfParams].id = id;
        this.drQuestion[questionNumber].parametersList[numberOfParams].value = this.dailyReportQuestionsEditParamTemps[questionNumber].parameters[0].value;
        this.drQuestion[questionNumber].parametersList[numberOfParams].key = this.dailyReportQuestionsEditParamTemps[questionNumber].parameters[0].key;

        // clear variables
        this.dailyReportQuestionsEditParamTemps[questionNumber].parameters[0].value = '';

        console.log('LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER  parameter added!');
        console.log(this.drQuestion[questionNumber].parametersList);
        break;
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


  override = function () {
    this.overrideAnswer = true;
  }

  editSaveQuestion(questionNumber) {
    if (this.drQuestion[questionNumber].editQuestion) {
      // save the edited question

      // check if there is any question still
      // editing if so $scope.isUserEditing must
      // still true
      this.drQuestion[questionNumber].editQuestion = false;
      this.drQuestion[questionNumber].isEdited = true;
      var tmp = false;
      for (var i = 0; i < this.drQuestion.length; i++) {
        if (this.drQuestion[i].editQuestion) {
          tmp = true;
          break;
        }
      }
      this.isUserEditing = tmp;
      if (!this.isUserEditing) {
        this.saveTemplateAfterEdit();
      }
      // console.log('saved! ');
    } else {

      // take a copy of current editing question
      // for recovery if cancel
      this.dailyReportQuestionsRecovery[questionNumber] = this.getNewInstanceOf(this.drQuestion[questionNumber]);

      // start edit question -questionNumber-
      this.isUserEditing = true;
      this.drQuestion[questionNumber].editQuestion = true;
      for (var i = 0; i < this.drQuestion.length; i++) {
        this.dailyReportQuestionsEditParamTemps[i].parameters = [];

        for (var j = 0; j < this.drQuestion[i].parametersList.length; j++) {
          var param = {
            "id": '',
            "key": '',
            "value": ''
          };
          this.dailyReportQuestionsEditParamTemps[i].parameters[j] = param;
          this.dailyReportQuestionsEditParamTemps[i].parameters[j].key = this.drQuestion[i].parametersList[j].key;
        }

      }

      console.log('start Edit! ');
      console.log(this.drQuestion);
      // console.log($scope.dailyReportQuestionsEditParamTemps);
      // console.log(dailyReportQuestionsRecovery);
    }
  }

  saveTemplateAfterEdit() {

    for (let i = 0; i < this.drQuestion.length; i++) {
      if (this.drQuestion[i].isEdited) {
        /*
         * console.log('Saving Question ' + i + ' ...');
         */
        let questionId = this.drQuestion[i].id;
        let questionParameters = this.drQuestion[i].parametersList;
        let questionNumber = this.drQuestion[i].questionNumber;
        this.dailyReportServ.saveDailyReportTemplateQuestionParameters(questionId, questionParameters, i).subscribe(
          (response) => {
            this.presentToast("Question edited successfully.");
            let data ;
              data = response;
            console.log('Saving done!');
            this.drQuestion[data.questionNumber].isEdited = false;
            console.log('Template Saved!!');
        },  (reason) => {
          this.cancelEditigQuestion(questionNumber);
            this.presentToast("Failed question editing.");
          /*
           * console .log('Saving failed! ' + reason);
           */
        });

      }
    }

  }


  fabSelected(button,fab: FabContainer){
    fab.close();
  }

  cancelEditigQuestion(qNumber){
    this.drQuestion[qNumber] = this.getNewInstanceOf(this.dailyReportQuestionsRecovery[qNumber]);
    var tmp = false;
    for (var i = 0; i < this.drQuestion.length; i++) {
      if ((typeof this.drQuestion[i].editQuestion !== "undefined") && this.drQuestion[i].editQuestion) {
        tmp = true;
        break;
      }
    }
    this.isUserEditing = tmp;
    console.log('Canceled!');
  }



  getNewInstanceOf(obj) {
    var copy;

    // Handle the 3 simple types, and null or
    // undefined
    if (null == obj || "object" != typeof obj)
      return obj;

    // Handle Date
    if (obj instanceof Date) {
      copy = new Date();
      copy.setTime(obj.getTime());
      return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
      copy = [];
      for (var i = 0, len = obj.length; i < len; i++) {
        copy[i] = this.getNewInstanceOf(obj[i]);
      }
      return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
      copy = {};
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr))
          copy[attr] = this.getNewInstanceOf(obj[attr]);
      }
      return copy;
    }

    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  mappingDefaultAnswers(defaultDailyReportAnswer, question) {
    return defaultDailyReportAnswer.answer = this.getDefaultValue(question);
  };

  getDefaultValue(drQuestion) {
    if(drQuestion.dailyReportQuestionType.title == 'TEXT_QUESTION')
    {
      return "";
    }
    else if(drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_EN' ||
      drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_AR')
    {
      let val = [];
      let firstTime = true;
      let firstTextField = true;
      let counter = 0;
      let defailtValueArray = [];

      for (let v = 0; v < drQuestion.parametersList.length; v++) {

        if (drQuestion.parametersList[v].key == "OPTION_HELPER_TITLE") {

        } else if (drQuestion.parametersList[v].key == "OPTION_HELPER_TEXT") {

          defailtValueArray[counter] = {};
          defailtValueArray[counter].key = drQuestion.parametersList[v].key;
          defailtValueArray[counter].value = "";
          counter++;

        }

        else if (drQuestion.parametersList[v].key == "OPTION_ANSWER") {

          defailtValueArray[counter] = {};
          defailtValueArray[counter].key = drQuestion.parametersList[v].key;
          defailtValueArray[counter].value = drQuestion.parametersList[v].value;
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
    }
    else if (drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER' ||
      drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER' ||
      drQuestion.dailyReportQuestionType.title == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER' ||
      drQuestion.dailyReportQuestionType.title == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER' )
    {
      return {};
    }
    else if(drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER_WITH_EDIT')
    {
      return {};
    }
    else if (drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT')
    {
      return [drQuestion.parametersList[0].value];
    }
    else if (drQuestion.dailyReportQuestionType.title == 'MULTI_SHORT_TEXT_MULTISELECT_VIEW_SELECTED')
    {
      return {};
    }
    else if (drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION')
    {
      return [drQuestion.parametersList[0].value];
    }
    else if (drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION')
    {
      return [false];
    }
    else if (drQuestion.dailyReportQuestionType.title == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER' ||
      drQuestion.dailyReportQuestionType.title == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER'
    )
    {
      return drQuestion.parametersList[0].value;
    }
    else if (drQuestion.dailyReportQuestionType.title == 'CONSTANT_SHORT_HELPER_TEXT_QUESTION' ||
      drQuestion.dailyReportQuestionType.title == 'CONSTANT_LONG_HELPER_TEXT_QUESTION' ||
      drQuestion.dailyReportQuestionType.title == 'SHORT_HELPER_TEXT_QUESTION' ||
      drQuestion.dailyReportQuestionType.title == 'LONG_HELPER_TEXT_QUESTION'
    )
    {
      return {};
    }
    else if (drQuestion.dailyReportQuestionType.title == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED')
    {
      let val = {};
      let firstTime = true;
      let counter = 0;
      let defailtValueArray = [];

      for (let v = 0; v < drQuestion.parametersList.length; v++) {

        if (drQuestion.parametersList[v].key == "OPTION_HELPER_TITLE") {

        } else if (drQuestion.parametersList[v].key == "OPTION_HELPER_TEXT") {
          defailtValueArray[counter] = {};
          defailtValueArray[counter].key = drQuestion.parametersList[v].key;
          defailtValueArray[counter].value = "";
          counter++;

          firstTime = true;
        }

        else if (drQuestion.parametersList[v].key == "OPTION_ANSWER") {
          if (firstTime) {
            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = drQuestion.parametersList[v].key;
            defailtValueArray[counter].value = drQuestion.parametersList[v].value;
            counter++;
            firstTime = false;
          } else {

          }
        }

      }
      let textTemp = 0;
      for (let d = 0; d < defailtValueArray.length; d++) {
        if (defailtValueArray[d].key == "OPTION_HELPER_TEXT") {
          textTemp = d+1;
          val['OPTION_HELPER_TEXT'+d] = defailtValueArray[d].value;
        } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
          val['OPTION_ANSWER'+textTemp] = defailtValueArray[d].value;
        }

      }
      return val;
    }
    else if (drQuestion.dailyReportQuestionType.title == 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED')
    {
      let val = [];
      let firstTime = true;
      let firstTextField = true;
      let counter = 0;
      let defailtValueArray = [];

      for (let v = 0; v < drQuestion.parametersList.length; v++) {

        if (drQuestion.parametersList[v].key == "OPTION_HELPER_TITLE") {

        } else if (drQuestion.parametersList[v].key == "OPTION_HELPER_TEXT") {
          if (firstTextField) {
            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = drQuestion.parametersList[v].key;
            defailtValueArray[counter].value = "";
            counter++;
            firstTextField = false;
          } else {
            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = drQuestion.parametersList[v].key;
            defailtValueArray[counter].value = "00";
            counter++;
            firstTextField = true;

          }

          firstTime = true;
        }

        else if (drQuestion.parametersList[v].key == "OPTION_ANSWER") {
          if (firstTime) {
            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = drQuestion.parametersList[v].key;
            defailtValueArray[counter].value = drQuestion.parametersList[v].value;
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
    }
    else if (drQuestion.dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR' ||
      drQuestion.dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN')
    {
      let val = {};
      let firstTime = true;
      let counter = 0;
      let defailtValueArray = [];

      for (let v = 0; v < drQuestion.parametersList.length; v++) {

        if (drQuestion.parametersList[v].key == "OPTION_HELPER_TITLE") {

        } else if (drQuestion.parametersList[v].key == "OPTION_DROP_DOWN") {
          defailtValueArray[counter] = {};
          defailtValueArray[counter].key = drQuestion.parametersList[v].key;
          defailtValueArray[counter].value = "";
          counter++;
          firstTime = true;
        }

        else if (drQuestion.parametersList[v].key == "OPTION_ANSWER") {
          if (firstTime) {
            defailtValueArray[counter] = {};
            defailtValueArray[counter].key = drQuestion.parametersList[v].key;
            defailtValueArray[counter].value = drQuestion.parametersList[v].value;
            ;
            counter++;
            firstTime = false;
          } else {

          }
        }

      }
      let tempDrop = 0;
      for (var d = 0; d < defailtValueArray.length; d++) {
        if (defailtValueArray[d].key == "OPTION_DROP_DOWN") {
          tempDrop = d;
          val["OPTION_DROP_DOWN"+d] = "";
        } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
          val["OPTION_ANSWER"+(tempDrop+1)] = defailtValueArray[d].value;
        }

      }
      return val;
    }else{
      return "";
    }
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
















  // getTemplate(drQuestion) {
  //
  //   switch (drQuestion.dailyReportQuestionType.title) {
  //     case 'TEXT_QUESTION':
  //       return '<label class="formLabel">' + drQuestion.question + ':</label><br><br><label class="textarea"><textarea rows="3" class="custom-scroll" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer"></textarea></label>';
  //     case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
  //     case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
  //       var checkList = "";
  //       for (let parameter of drQuestion.parametersList){
  //         checkList += '<div class="LoopContain"><label class="checkbox">' +
  //           '<input type="checkbox" name="checkbox' + drQuestion.questionNumber + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer['+parameter.id+']">' +
  //           '<i></i>  ' + parameter.value + '</label></div>'
  //       }
  //
  //       return '<label class="formLabel">'
  //         + drQuestion.question + ':' +
  //         '</label>' +
  //         '<div class="inline-group">' + checkList;
  //     case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_EN':
  //     case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_AR':
  //       checkList = "";
  //       var textArea = "";
  //       var row = '<label class="formLabel">' + drQuestion.question + ':</label><br>';
  //       for (var i = 0; i < drQuestion.parametersList.length; i++) {
  //         if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
  //           checkList += '<div class="inline-group" ><label class="checkbox col-md-9 col-sm-9 col-xs-9" ><input type="checkbox" name="checkbox' + drQuestion.questionNumber + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + drQuestion.parametersList[i].id + ']"><i></i><input type="text"   only-digits ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + drQuestion.parametersList[i + 1] + ']" style="width:40px;left: 0px;position: relative;margin-left: 10px;margin-right: 10px;  height: 17px;top: 2px;padding-bottom: 4px;top: -3px;" ng-disabled="!dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + drQuestion.parametersList[i].id + ']">' + drQuestion.parametersList[i].value + '</label></div>';
  //           row += checkList;
  //           checkList = "";
  //         }
  //
  //         /*
  //             * if(drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
  //             *
  //             * textArea +='<label class="textarea col-md-1" ><input
  //             * type="text"
  //             * ng-model="dailyReportAnswer.dailyReportAnswersObjectsList['+drQuestion.questionNumber+'].answer['+drQuestion.parametersList[i].id+']"
  //             * style="width:40px"></label></div>'; row+=textArea;
  //             * textArea=""; }
  //             */
  //
  //       }
  //       return row;
  //     case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER_WITH_EDIT':
  //       checkList = "";
  //       var textarea = "";
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
  //           checkList += '<label class="checkbox col-md-2 col-sm-4 col-xs-4"><input type="checkbox" name="checkbox' + drQuestion.questionNumber + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + i + ']"><i></i>' + drQuestion.parametersList[i].value + '</label>'
  //         }
  //         else {
  //           textarea = '<label class="formLabel">' + drQuestion.parametersList[i].value + ':</label><label class="textarea"><textarea rows="3" cols="50" class="custom-scroll" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + i + ']"></textarea></label>';
  //         }
  //       }
  //       return '<label class="formLabel">' + drQuestion.question + ':</label><br><div class="inline-group">' + checkList + '</div><div style=" clear: both;">' + textarea + '</div>';
  //     case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT':
  //       var radioList = "";
  //       textarea = "";
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
  //           radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + '" value="' + drQuestion.parametersList[i].value + '" ng-change="enableOther(' + drQuestion.questionNumber + ',' + i + ')" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[0]"><i></i>' + drQuestion.parametersList[i].value + '</label>';
  //         }
  //         else if (drQuestion.parametersList[i].key == "OPTION_ANSWER_WITH_EDIT") {
  //           radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + '" value="' + drQuestion.parametersList[i].value + '"  ng-change="enableOther(' + drQuestion.questionNumber + ',' + i + ')" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[0]"><i></i>' + drQuestion.parametersList[i].value + '</label>';
  //           textarea = '<label class="formLabel">' + drQuestion.parametersList[i].value + ':</label><label class="textarea"><textarea rows="1" style="width:40%" class="custom-scroll" ng-disabled="enableOtherNote[' + drQuestion.questionNumber + ']" ng-init="enableOtherNote[' + drQuestion.questionNumber + ']=' + true + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[1]"></textarea></label>';
  //         }
  //       }
  //       return '<label class="formLabel">' + drQuestion.question + ':</label><br><div class="row"><div class="col col-12 inline-group">' + radioList + '</div></div><div style="clear:both; class="col-md-6>' + textarea + '</div>';
  //     case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
  //       radioList = "";
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         radioList += '<div class="LoopContain"><label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer"><i></i>  ' + drQuestion.parametersList[i].value + '</label></div>';
  //       }
  //       return '<label class="formLabel">' + drQuestion.question + ':</label><br><div class="inline-group">' + radioList + '</div>';
  //     case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION':
  //       radioList = "";
  //       textarea = "";
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
  //           let radioName = "    "+drQuestion.parametersList[i].value;
  //           radioList += '<div class="LoopContainWithoutWidth" style="width: '+100/drQuestion.parametersList.length+'%"><label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[0]"><i></i>' + radioName+ '</label></div>';
  //         }
  //         else {
  //           textarea = '<label class="formLabel">' + drQuestion.parametersList[i].value + ':</label><label class="textarea"><textarea rows="2" cols="50" class="custom-scroll" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[1]"></textarea></label>';
  //         }
  //       }
  //       return '<label class="formLabel">' + drQuestion.question + ':</label><br><div class="row"><div class="inline-group">' + radioList + '</div></div><div style=" clear: both;" >' + textarea + '</div>';
  //
  //     case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION':
  //       checkList = "";
  //       textarea = "";
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
  //           checkList += '<label class="checkbox"><input type="checkbox" name="checkbox' + drQuestion.questionNumber + '" ng-change="disableNote(dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[0],' + drQuestion.questionNumber + ')" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[0]"><i></i>' + drQuestion.parametersList[i].value + '</label>';
  //         }
  //         else {
  //           textarea = '<label class="formLabel">' + drQuestion.parametersList[i].value + ':</label><label class="textarea"><textarea  ng-disabled="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[0]"  rows="3" class="custom-scroll" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[1]"></textarea></label>';
  //         }
  //       }
  //       return '<label class="formLabel">' + drQuestion.question + ':</label><br><div class="row"><div class="col col-12">' + checkList + '</div></div><div>' + textarea + '</div>';
  //
  //     case 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED':
  //       var label = "";
  //       row = "";
  //       radioList = "";
  //       var textList = "";
  //       var countRow = 0;
  //       var countParameters = 0;
  //       var helpertext = false;
  //       var count = 0;
  //       var optionAnswerCounter = 0;
  //       var optionHelperText = 0;
  //       var switchToHelper = 0
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
  //           optionAnswerCounter++;
  //
  //         }
  //         else if (drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
  //           optionHelperText++;
  //
  //         }
  //       }
  //       switchToHelper = (optionAnswerCounter / (optionHelperText)) - 1;
  //       console.log("Hi From Question Directive");
  //       console.log('optionAnswerCounter= ' + optionAnswerCounter + ', optionHelperText= ' + optionHelperText + ', switchToHelper= ' + switchToHelper);
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         if (drQuestion.parametersList[i].key == "OPTION_HELPER_TITLE") {
  //           label += '<div class="col col-6"><label class="formLabel">' + drQuestion.parametersList[i].value + ':</label></div>';
  //           // countParameters++;
  //         }
  //         else if (drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
  //           if (helpertext) {
  //             row += '<div class="row"><div class="col-md-3"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
  //             radioList = "";
  //             textList = "";
  //             countRow++;
  //             textList += '<section class="col-md-5" style="margin-left: 14px;"><label class="" style="">' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
  //             countParameters++;
  //             helpertext = false;
  //             count = 0;
  //           }
  //           else {
  //             textList += '<section class="col-md-5" style="margin-left: 14px;"><label class="" style="">' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
  //             countParameters++;
  //           }
  //         }
  //         else {
  //           if (count != switchToHelper) {
  //             helpertext = true;
  //             radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
  //             count++;
  //           }
  //           else {
  //             helpertext = true;
  //             radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
  //             countParameters++;
  //
  //           }
  //         }
  //       }
  //       row += '<div class="row"><div class="col-md-3"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
  //
  //
  //       return '<label class="formLabel">' + drQuestion.question + ':</label><br><div>' + label + '</div><div>' + row + '</div>';
  //
  //     case 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED':
  //       label = "";
  //       row = "";
  //       radioList = "";
  //       textList = "";
  //       countRow = 0;
  //       countParameters = 0;
  //       helpertext = false;
  //       count = 0;
  //       optionAnswerCounter = 0;
  //       optionHelperText = 0;
  //       switchToHelper = 0
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
  //           optionAnswerCounter++;
  //
  //         }
  //         else if (drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
  //           optionHelperText++;
  //
  //         }
  //       }
  //       switchToHelper = (optionAnswerCounter / (optionHelperText / 2)) - 1;
  //       console.log("Hi From Question Directive");
  //       console.log(switchToHelper);
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         if (drQuestion.parametersList[i].key == "OPTION_HELPER_TITLE") {
  //           label += '<div class="col col-6"><label class="formLabel">' + drQuestion.parametersList[i].value + ':</label></div>';
  //           // countParameters++;
  //         }
  //         else if (drQuestion.parametersList[i].key == "OPTION_HELPER_TEXT") {
  //           if (helpertext) {
  //             row += '<div class="row"><div class="col-md-4 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
  //             radioList = "";
  //             textList = "";
  //             countRow++;
  //             textList += '<section class="col-md-3" style="margin-left: 14px;"><label class="" style="">' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
  //             countParameters++;
  //             helpertext = false;
  //             count = 0;
  //           }
  //           else {
  //             textList += '<section class="col-md-3" style="margin-left: 14px;"><label class="" style="">' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"></label></section>'
  //             countParameters++;
  //           }
  //         }
  //         else {
  //           if (count != switchToHelper) {
  //             helpertext = true;
  //             radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
  //             count++;
  //           }
  //           else {
  //             helpertext = true;
  //             radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" ng-change="override()"><i></i>' + drQuestion.parametersList[i].value + '</label>';
  //             countParameters++;
  //
  //           }
  //         }
  //       }
  //       row += '<div class="row"><div class="col-md-4 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-7 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
  //
  //
  //       return '<label class="formLabel">' + drQuestion.question + ':</label><br><div>' + label + '</div><div>' + row + '</div>';
  //
  //     case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
  //     case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
  //
  //       let pramData = "";
  //       for(let parameter of drQuestion.parametersList){
  //         pramData += ;
  //       }
  //
  //       return '<div class="formLabel" style="width:100%;">' + drQuestion.question + ':<button type="button" class="btn btn-outline-warning btn-sm" \n' +
  //         '  *ngIf="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion" (click)="cancelEditigQuestion(' + drQuestion.questionNumber + ')" \n' +
  //         '  style="float:right; margin-left: 7px;" ><i style="font-size:15px; color: #3B9FF3;"  >Cancel</i></button><button type="button" \n' +
  //         '  class="btn btn-outline-warning btn-sm" *ngIf="editQuestionAllowed" (click)="editSaveQuestion(' + drQuestion.questionNumber + ')" \n' +
  //         '  style="float:right; margin-right: 8px;" ><i style="font-size:15px; color: #3B9FF3;" *ngIf="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion" >\n' +
  //         '  Save</i><span hideWhen="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion" class="glyphicon glyphicon-edit" \n' +
  //         '  style="font-size:15px; color: #3B9FF3;"></span></button></div><div class="row" style="width:99%;"><div class="col col-12" style="width:101%;">'


  //         '<div style="width: 100%"><label class="checkbox" style="width:100%;"><input type="checkbox" name="checkbox' + drQuestion.questionNumber + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer['+parameter.id+']">' +
  //           '<i></i>' +'   '+ parameter.value + '<a style="font-size:20px; color:firebrick; float:right;" *ngIf="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion">\n' +
  //           '<span class="btn btn-link-danger glyphicon glyphicon-remove" (click)="removeQuestionParameter(' + drQuestion.questionNumber + ','+parameter.id+')">\n' +
  //           '</span></a></label></div>'


  //         '</div></div><div style="width:100%;" *ngIf="dailyReportQuestions[' + drQuestion.questionNumber + '].editQuestion" class="input-group"><div>\n' +
  //         '  <label class="formLabel"><i></i><span></span></label></div><div class="input-group" style="width: 100%"><input  type="text" style="width: 80%"\n' +
  //         '  ng-model="dailyReportQuestionsEditParamTemps[' + drQuestion.questionNumber + '].parameters[0].value" class="form-control" placeholder=" Pleas enter your new question" />\n' +
  //         '  <span class="input-group-btn" style="padding-left:10px;"><button class="btn btn-secondary btn-sm" (click)="addParameterForQuestion(' + drQuestion.questionNumber + ')">\n' +
  //         '  <span class="glyphicon glyphicon-plus" style="font-size:15px; color: #4CAF50;"></span><i style="font-size:15px; color: #3B9FF3;">Add</i></button>\n' +
  //         '  </span></div></div>';
  //
  //     case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
  //       radioList = "";
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         radioList += '<label class="radio"><input type="radio" name="radio-inline' + drQuestion.questionNumber + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer"><i></i>' + drQuestion.parametersList[i].value + '</label>';
  //       }
  //       return '<label class="formLabel">' + drQuestion.question + ':</label><br><div class="row"><div class="col col-12">' + radioList + '</div></div>';
  //
  //     case 'CONSTANT_SHORT_HELPER_TEXT_QUESTION':
  //       textList = "";
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         textList += '<section class="col col-2" style="margin-left: 9px;display: inline-block"><label class="formLabel ng-scope" style="margin-top: 5px">  ' + drQuestion.parametersList[i].value + '</label><label class="input"><input type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer.' + i + '"></label></section>';
  //       }
  //       return '<label class="formLabel">' + drQuestion.question + ':</label><br><div class="row" style="">' + textList + '</div>';
  //
  //     case 'SHORT_HELPER_TEXT_QUESTION':
  //       textList = "";
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         let textListName = drQuestion.parametersList[i].value+" :      ";
  //         textList += '<div style="display: inline-block"><section class="section" style="margin-left: 9px;width: '+100/drQuestion.parametersList.length+'%"><label class="formLabel ng-scope" style="margin-top: 5px;font-weight: normal">' + textListName + '</label><label class="input"><input style="width: 70px; height: 35px;" type="text" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer.' + i + '"></label></section></div>';
  //       }
  //       return '<label class="formLabel">' + drQuestion.question + ':</label><br><div class="row" style="">' + textList + '</div>';
  //
  //     case'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN':
  //     case'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR':
  //       label = "";
  //       row = "";
  //       radioList = "";
  //       textList = "";
  //       countRow = 0;
  //       countParameters = 0;
  //       helpertext = false;
  //       count = 0;
  //       optionAnswerCounter = 0;
  //       optionHelperText = 0;
  //       switchToHelper = 0;
  //       var choiceList = [];
  //
  //
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         if (drQuestion.parametersList[i].key == "OPTION_ANSWER") {
  //           optionAnswerCounter++;
  //
  //         }
  //         else if (drQuestion.parametersList[i].key == "OPTION_DROP_DOWN") {
  //           optionHelperText++;
  //
  //         }
  //       }
  //       switchToHelper = (optionAnswerCounter / (optionHelperText)) - 1;
  //       console.log("Hi From Question Directive");
  //       console.log(switchToHelper);
  //       for (i = 0; i < drQuestion.parametersList.length; i++) {
  //         if (drQuestion.parametersList[i].key == "OPTION_HELPER_TITLE") {
  //           label += '<div class="col col-6"><label class="formLabel">' + drQuestion.parametersList[i].value + ':</label></div>';
  //           // countParameters++;
  //         }
  //         else if (drQuestion.parametersList[i].key == "OPTION_DROP_DOWN") {
  //           if (helpertext) {
  //
  //
  //             row += '<div class="row"><div class="col-md-6 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-6 inline-group" style="margin-top:20px;">' + radioList + '</div>';
  //             radioList = "";
  //             textList = "";
  //             countRow++;
  //             textList += '<section class="col-md-12" style="margin-left: 14px;"><label class="" style="width=100%">' + drQuestion.parametersList[i].value + '</label>' +
  //               ' <ui-select ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" theme="bootstrap" style="width:100%;"  ng-click="selectAction(' + drQuestion.id + ')">' +
  //               ' <ui-select-match style="width:100%; font-size: x-small;">{{$select.selected}}</ui-select-match>' +
  //               ' <ui-select-choices repeat=" item in selectOptions |filter: $select.search" >' +
  //               ' <div ng-bind-html="item| highlight: $select.search"></ui-select-choices>  </ui-select></section >'
  //
  //             helpertext = false
  //             countParameters++;
  //             ;
  //             count = 0;
  //           }
  //           else {
  //             changeEditMode(index,button){
  //
  //               textList += '<section class="col-md-12 " style="margin-left: 14px;"><label class="" style="width=100%">' + drQuestion.parametersList[i].value + '</label>' +
  //                 ' <ui-select ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']" theme="bootstrap" style="width:100%;   "  ng-click="selectAction(' + drQuestion.id + ')">' +
  //                 ' <ui-select-match style="width:100%; font-size: x-small;">{{$select.selected}}</ui-select-match>' +
  //                 ' <ui-select-choices repeat=" item in selectOptions|filter: $select.search">' +
  //                 ' <div ng-bind-html=" item | highlight: $select.search"></ui-select-choices> </ui-select></section >'
  //
  //               countParameters++;
  //             }
  //
  //
  //           }
  //         else {
  //             if (count != switchToHelper) {
  //               helpertext = true;
  //               radioList += '<label class="radio" style="margin-right: 0px;margin-left: 35px;"><input type="radio" name="radio-inline' + drQuestion.questionNumber + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']"><i></i>' + drQuestion.parametersList[i].value + '</label>';
  //               count++;
  //             }
  //             else {
  //               helpertext = true;
  //               radioList += '<label class="radio" style="margin-right: 0px;margin-left: 35px;"><input type="radio" name="radio-inline' + countRow + '" value="' + drQuestion.parametersList[i].value + '" ng-model="dailyReportAnswer.dailyReportAnswersObjectsList[' + drQuestion.questionNumber + '].answer[' + countParameters + ']"><i></i>' + drQuestion.parametersList[i].value + '</label> </div>';
  //               countParameters++;
  //
  //             }
  //
  //           }
  //
  //         }
  //         row += '<div class="row"><div class="col-md-6 col-sm-12"><div class="">' + textList + '</div></div><div class="col-md-6 inline-group" style="margin-top:20px;">' + radioList + '</div></div>';
  //
  //         return '<label class="formLabel">' + drQuestion.question + ':</label><br><div>' + label + '</div><div>' + row + '</div>';
  //         if(button == "create" || button == "cancel"){
  //           this.drQuestion[index].editQuestion =  !this.drQuestion[index].editQuestion;
  //         }else if (button == "save"){
  //           this.drQuestion[index].editQuestion =  !this.drQuestion[index].editQuestion;
  //           this.drQuestion[index].isEdited =  true;
  //         }else{
  //
  //         default:
  //           console.info("ThigetTemplates type not mapped: " + drQuestion.dailyReportQuestionType.title);
  //           return '<label class="formLabel">' + drQuestion.question + ':</label><br><div class="row"><div class="col col-4"></div></div>';
  //         }
  //       }
  //
  //   }









  }
