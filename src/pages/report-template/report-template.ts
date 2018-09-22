import {Component, OnInit} from '@angular/core';
import {
  FabContainer, IonicPage, LoadingController, NavController, NavParams, Platform,
  ToastController, ViewController
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
  MULTI_SHORT_TEXT_ONE_VIEW_SELECTED_Index;
  DROPDOWN_MENU_ONE_VIEW_SELECTED_index;
  SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED_INDEX;
  console = console;
  localStorageToken: string = 'LOCAL_STORAGE_TOKEN';
  PageName;
  reportDate;
  reportTemplate;
  drQuestion = [];
  enableOtherNote = [];
  dailyReportAnswer;
  dailyReportDefultAnswer;
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
  selectedClassId;
  dateForData;
  recoveryQuestion;

  openDataMULTI_SHORT_TEXT_ONE_VIEW_SELECTED(i){
    this.MULTI_SHORT_TEXT_ONE_VIEW_SELECTED_Index = i;
  }
  openDataDROPDOWN_MENU_ONE_VIEW_SELECTED(i){
    this.DROPDOWN_MENU_ONE_VIEW_SELECTED_index=i;
  }
  openDataSINGLE_SHORT_TEXT_ONE_VIEW_SELECTED(i){
    this.SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED_INDEX=i;
  }
  removeCount(){
    this.countParameters = 0;
  }
  constructor(public navCtrl: NavController, public navParams: NavParams,public accountServ:AccountService, public sanitizer:DomSanitizer,
              public platform: Platform, public storage: Storage,public dailyReportServ:DailyReportService, public loadCtrl: LoadingController,
              private toastCtrl: ToastController, private viewCtrl:ViewController) {

    //this is your html write the directive here
    this.reportTemplate ="";
    this.drQuestion = [];
    this.drQuestion = this.navParams.get('template');
    this.recoveryQuestion = this.navParams.get('template');
    this.selectedClassId = this.navParams.get('classId');
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

    this.dailyReportDefultAnswer = this.navParams.get('dailyReportAnswer');
    this.dailyReportAnswer = this.dailyReportDefultAnswer;
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
      for(let i=0; i<this.drQuestion.length;i++){
        if(this.drQuestion[i].dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN' || this.drQuestion[i].dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR'){
          this.callDataAndWait();
          break;
        }
      }
    } else {
      storage.get(this.localStorageToken).then(
        val => {
          this.dailyReportServ.putHeader(val);
          for(let i=0; i<this.drQuestion.length;i++){
            if(this.drQuestion[i].dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN' || this.drQuestion[i].dailyReportQuestionType.title == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR'){
              this.callDataAndWait();
              break;
            }
          }
        });

    }
  }

  close(){
    this.viewCtrl.dismiss({name:'dismissed'});
  }

  ionViewWillLeave(){
    this.drQuestion = this.recoveryQuestion;
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
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
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


  override() {
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

    this.load = this.load.create({
      content: ""
    });
    this.load.present();

    for (let i = 0; i < this.drQuestion.length; i++) {
      if (this.drQuestion[i].isEdited) {
        /*
         * console.log('Saving Question ' + i + ' ...');
         */
        let questionId = this.drQuestion[i].id;
        let questionParameters = this.drQuestion[i].parametersList;
        let questionNumber = this.drQuestion[i].questionNumber;
        this.dailyReportServ.saveDailyReportTemplateQuestionParameters(questionId, questionParameters, i).subscribe(
          response => {
            this.load.dismiss();
            this.presentToast("Question edited successfully.");
            let data ;
              data = response;
            console.log('Saving done!');
            this.drQuestion[data.questionNumber].isEdited = false;
            console.log('Template Saved!!');
        },reason => {
            this.load.dismiss();
            if(reason.status == 200) {
              this.presentToast("Question edited successfully.");
              let data ;
              data = reason;
              console.log('Saving done!');
              this.drQuestion[data.questionNumber].isEdited = false;
              console.log('Template Saved!!');
            } else {
              this.cancelEditigQuestion(questionNumber);
              this.presentToast("Failed question editing.");
              console.log(reason);
            }
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
    let copy;

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
}
