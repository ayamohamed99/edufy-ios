import {Component, OnInit} from '@angular/core';
import {
  AlertController,
  FabContainer, IonicPage, LoadingController, NavController, NavParams, Platform,
  ToastController, ViewController
} from 'ionic-angular';
import {AccountService} from "../../services/account";
import {DomSanitizer} from "@angular/platform-browser";
import {TemplateShape} from "../../models/template_Shape";
import {Storage} from "@ionic/storage";
import {DailyReportService} from "../../services/dailyreport";
import {CheckboxFunctionService} from "../../services/checkboxFunctionService";
import {DatePicker} from "@ionic-native/date-picker";
import {TransFormDate} from "../../services/transFormDate";

/**
 * Generated class for the ReportTemplatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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
  reportId;
  reportTemplate;
  drQuestion = [];
  enableOtherNote = [];
  reportAnswer;
  reportDefultAnswer;
  reportAnswersNoOfItems;
  reportQuestionsRecovery;
  reportQuestionsEditParamTemps;
  editQuestionAllowed;
  helperTextSSTOVS = false;
  switchToHelperSSTOVS = 0;
  templateViewObjects = [];
  singleQuestionRow = [];
  countParameters = 0;
  load;
  selectionData = new Map();
  overrideAnswer = true;
  isUserEditing;
  selectedClassIndex;
  selectedClassId;
  selectedClass;
  selectedReportDate;
  dateForData;
  recoveryQuestion;
  conflict = [];
  reportAnswerObj;
  selectedListOfStudents = [];
  selectedListOfStudentsID = [];
  imgsFoodName = ['All', 'Few', 'Half', 'Little','More', 'Most', 'None', 'Quarter','Some'];
  imgsMilkName = ['All', 'None', 'Some'];
  imgsMoodName = ['Active', 'Aggressive', 'Cheerful', 'Cranky','Different', 'Difficult', 'Energetic',
                  'Excellent','Fazzy', 'Good', 'Happy', 'Irretated', 'Lazy', 'Missed My Mummy','Naughty',
                  'Normal', 'On_off', 'Quiet','Sad', 'Sick', 'Sleepy', 'Tired', 'Unhappy', 'Very Good'];




  ///////////////////// HERE ORGANIZE THE VIEW//////////////////////
  showNames(){
    let selectedListOfStudents = [];
    selectedListOfStudents = this.navParams.get('selected');
    let studentsNames = "";
    for(let i=0;i<selectedListOfStudents.length;i++){
      if(i==(selectedListOfStudents.length -1)){
        studentsNames += selectedListOfStudents[i].studentName
      }else {
        studentsNames += selectedListOfStudents[i].studentName + " & ";
      }
    }
    if(selectedListOfStudents.length > 1) {
      this.alrtCtrl.create({
        title: 'Selected students of this report',
        subTitle: studentsNames,
        buttons: ['OK']
      }).present();
    }
  }
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

  setImageOrLable(question,pramName){
    let pramNameFound = false;
    let qName = question.toLowerCase();
    if(qName.includes('food')|| qName.includes('snack') || qName.includes('breakfast') || qName.includes('lunch') || qName.includes('late snack') || qName.includes('meal') || qName.includes('extra meal')){
      for(let name of this.imgsFoodName){
        if(name == pramName){
          pramNameFound = true;
        }
      }
      if(pramNameFound) {
        return 'Food';
      }else{
        return 'Label';
      }
    }else if(qName.includes('mood') || qName.includes('behaviour') || qName.includes('my day was')){
      for(let name of this.imgsMoodName){
        if(name == pramName){
          pramNameFound = true;
        }
      }
      if(pramNameFound) {
        return 'Mood';
      }else{
        return 'Label';
      }
    }else if(qName.includes('milk') || qName.includes('milk / juice') || qName.includes('juice') || qName.includes('drinks') || qName.includes('drink')){
      for(let name of this.imgsMilkName){
        if(name == pramName){
          pramNameFound = true;
        }
      }
      if(pramNameFound) {
        return 'Milk';
      }else{
        return 'Label';
      }
    }else{
      return 'Label';
    }

  }
  showSaveOrUpdate(){

    if(this.navParams.get('theClassIsSelected')){

      let noOfStudentFinalized;
      if(this.accountServ.reportId == -1){
        noOfStudentFinalized = this.selectedClass.noOfStudentDailyReportFinalized;
      }else{
        noOfStudentFinalized = this.selectedClass.noOfStudentReportFinalized;
      }

      if(noOfStudentFinalized == 0){
        return 'save';
      }else{
        return 'update';
      }
    }else{
      let foundStudentThatFinalized = false;
      for(let student of this.navParams.get('selected')){
        if(student.reportFinalized){
          foundStudentThatFinalized = true;
        }
      }

      if(foundStudentThatFinalized){
        return 'update';
      }else{
        return 'save';
      }
    }
  }

  showButtonOfSaveOrUpdate(){
    if(this.accountServ.reportId == -1) {
      if (this.showSaveOrUpdate() == 'save' && this.accountServ.getUserRole().dailyReportCreate) {
        return true;
      } else if (this.showSaveOrUpdate() == 'update' && this.accountServ.getUserRole().dailyReportUpdate) {
        return true;
      } else {
        return false;
      }
    }else{
      if (this.showSaveOrUpdate() == 'save' && this.accountServ.getUserRole().reportCreate) {
        return true;
      } else if (this.showSaveOrUpdate() == 'update' && this.accountServ.getUserRole().reportUpdate) {
        return true;
      } else {
        return false;
      }
    }
  }

  showRestButton(){
    let foundFinalizedStudent;
    for(let i in this.selectedListOfStudents){
      if(this.selectedListOfStudents[i].reportFinalized){
        foundFinalizedStudent = true;
      }
    }
    if(this.accountServ.reportId == -1) {
      if(this.accountServ.getUserRole().dailyReportReset && foundFinalizedStudent){
        return true;
      }else{
        return false;
      }
    }else{
      if(this.accountServ.getUserRole().reportReset && foundFinalizedStudent){
        return true;
      }else{
        return false;
      }
    }
  }

  showApproveButton(){
    if(this.accountServ.reportId == -1) {
      return this.accountServ.getUserRole().dailyReportApprove;
    }else{
      return this.accountServ.getUserRole().reportApprove;
    }
  }

  showEditButton(){
    if(this.accountServ.reportId == -1) {
      return this.accountServ.getUserRole().dailyReportEditQuestionCreate;
    }else{
      return this.accountServ.getUserRole().reportEditQuestionCreate;
    }
  }

  showConflict(drIndex){
    if(this.conflict) {
      if (this.conflict.length != 0) {
        if (!this.conflict[drIndex]) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }else{
      return false;
    }
  }





  /////////////////// HERE THE CODE START /////////////////////////////////// ABOVE CODE FOR VIEW ONLY TO APPEAR //////////////////
  constructor(public navCtrl: NavController, public navParams: NavParams,public accountServ:AccountService, public sanitizer:DomSanitizer,
              public platform: Platform, public storage: Storage,public dailyReportServ:DailyReportService, public loadCtrl: LoadingController,
              private toastCtrl: ToastController, private viewCtrl:ViewController,public alrtCtrl: AlertController,
              public checkboxFunctionService:CheckboxFunctionService,private datePicker: DatePicker,private tranformDate:TransFormDate) {

    if(this.accountServ.reportId == -1){
      this.reportId = null;
    }else{
      this.reportId = this.accountServ.reportId;
    }
    //this is your html write the directive here
    this.reportTemplate ="";
    this.drQuestion = [];
    this.drQuestion = this.navParams.get('template');
    this.recoveryQuestion = this.navParams.get('template');
    this.selectedClassId = this.navParams.get('class').classId;
    this.selectedClass = this.navParams.get('class');
    ////PageName
    this.selectedListOfStudents = this.navParams.get('selected');
    if(this.selectedListOfStudents.length > 1){
      if (this.accountServ.reportId == -1) {
        this.PageName = this.selectedListOfStudents.length + " daily reports are selected";
      } else {
        this.PageName = this.selectedListOfStudents.length +this.accountServ.reportPage+" are selected";
      }
    }else{
      if (this.accountServ.reportId == -1) {
        this.PageName =  this.selectedListOfStudents[0].studentName +"'s daily report";
      } else {
        this.PageName =  this.selectedListOfStudents[0].studentName +"'s "+this.accountServ.reportPage;
      }
    }
    for(let i in this.selectedListOfStudents) {
      this.selectedListOfStudentsID.push({id: this.selectedListOfStudents[i].studentId});
    }
    /////Date of Page
    this.reportDate = this.navParams.get('reportDate');
    this.selectedClassIndex = this.navParams.get('classIndex');
    this.selectedReportDate = this.navParams.get('selectedDate');

    this.reportDefultAnswer = this.navParams.get('reportAnswer');
    this.reportAnswer = this.reportDefultAnswer;
    console.log(this.reportAnswer);
    this.reportAnswersNoOfItems = this.navParams.get('reportAnswersNoOfItems');
    this.reportQuestionsRecovery = this.navParams.get('reportQuestionsRecovery');
    this.reportQuestionsEditParamTemps = this.navParams.get('reportQuestionsEditParamTemps');
    this.editQuestionAllowed = this.navParams.get('editQuestionAllowed');
    if(this.selectedListOfStudents.length > 1) {
      this.conflict = this.navParams.get('reportConflict');
    }

    let editDropOrNot = true;
    let editSingleOrNot = true;
    for(let i=0; i<this.drQuestion.length;i++){
      let questionTitle;
      if(this.accountServ.reportId == -1){
        questionTitle = this.drQuestion[i].dailyReportQuestionType.title;
      }else{
        questionTitle = this.drQuestion[i].reportQuestionType.title;
      }
      if(questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN' || questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR'){
        for(let itm of this.drQuestion[i].parametersList) {
          if (itm.key == "OPTION_ANSWER") {
            editDropOrNot = false;
          }
        }
      }
      else if(questionTitle == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED'){
        for(let itm of this.drQuestion[i].parametersList) {
          if (itm.key == "OPTION_ANSWER") {
            editSingleOrNot = false;
          }
        }
      }
    }

    let template = new TemplateShape();
    for(let i=0; i<this.drQuestion.length;i++){

      let questionTitle;
      if(this.accountServ.reportId == -1){
        questionTitle = this.drQuestion[i].dailyReportQuestionType.title;
      }else{
        questionTitle = this.drQuestion[i].reportQuestionType.title;
      }

      let temp = template.makeTheTemplateShape(this.drQuestion[i],this.accountServ.reportId);
      if(temp.length >0) {
        if(questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN' || questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR'){
          if(editDropOrNot == false){
            this.drQuestion[i].parametersList = temp;
          }
        }
        else if(questionTitle == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED'){
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
        let questionTitle;
        if(this.accountServ.reportId == -1){
          questionTitle = this.drQuestion[i].dailyReportQuestionType.title;
        }else{
          questionTitle = this.drQuestion[i].reportQuestionType.title;
        }

        if(questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN' || questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR'){
          this.callDataAndWait();
          break;
        }
      }
    } else {
      storage.get(this.localStorageToken).then(
        val => {
          this.dailyReportServ.putHeader(val);
          for(let i=0; i<this.drQuestion.length;i++){

            let questionTitle;
            if(this.accountServ.reportId == -1){
              questionTitle = this.drQuestion[i].dailyReportQuestionType.title;
            }else{
              questionTitle = this.drQuestion[i].reportQuestionType.title;
            }

            if(questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN' || questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR'){
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

      let questionTitle;
      if(this.accountServ.reportId == -1){
        questionTitle = this.drQuestion[i].dailyReportQuestionType.title;
      }else{
        questionTitle = this.drQuestion[i].reportQuestionType.title;
      }

      if(questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN' || questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR'){
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
    return this.dailyReportServ.getDropDownPremeter(questionKey,this.reportId).toPromise().then(
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

    // console.log($scope.reportQuestionsEditParamTemps);

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

    let questionTitle;
    if(this.accountServ.reportId == -1){
      questionTitle = this.drQuestion[questionNumber].dailyReportQuestionType.title;
    }else{
      questionTitle = this.drQuestion[questionNumber].reportQuestionType.title;
    }

    switch (questionTitle) {
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
      case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
        let value = this.reportQuestionsEditParamTemps[questionNumber].parameters[0].value;
        if (value === '' || value.replace(" ", "") === '' || value === "" || value.replace(" ", "") === "") {
          return;
        }
        this.drQuestion[questionNumber].parametersList[numberOfParams] = {};
        this.drQuestion[questionNumber].parametersList[numberOfParams].id = id;
        this.drQuestion[questionNumber].parametersList[numberOfParams].value = this.reportQuestionsEditParamTemps[questionNumber].parameters[0].value;
        this.drQuestion[questionNumber].parametersList[numberOfParams].key = this.reportQuestionsEditParamTemps[questionNumber].parameters[0].key;

        // clear variables
        this.reportQuestionsEditParamTemps[questionNumber].parameters[0].value = '';

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
      this.reportAnswer.dailyReportAnswersObjectsList[questionN].answer[1] = "";
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
      this.reportQuestionsRecovery[questionNumber] = this.getNewInstanceOf(this.drQuestion[questionNumber]);

      // start edit question -questionNumber-
      this.isUserEditing = true;
      this.drQuestion[questionNumber].editQuestion = true;
      for (let i = 0; i < this.drQuestion.length; i++) {
        this.reportQuestionsEditParamTemps[i].parameters = [];

        for (let j = 0; j < this.drQuestion[i].parametersList.length; j++) {
          var param = {
            "id": '',
            "key": '',
            "value": ''
          };
          this.reportQuestionsEditParamTemps[i].parameters[j] = param;
          this.reportQuestionsEditParamTemps[i].parameters[j].key = this.drQuestion[i].parametersList[j].key;
        }

      }

      console.log('start Edit! ');
      console.log(this.drQuestion);
      // console.log($scope.reportQuestionsEditParamTemps);
      // console.log(reportQuestionsRecovery);
    }
  }

  saveTemplateAfterEdit() {

    this.load = this.loadCtrl.create({
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
        this.dailyReportServ.saveDailyReportTemplateQuestionParameters(questionId, questionParameters, i,this.reportId).subscribe(
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

    let noFinalize = 0;
    if(this.accountServ.reportId == -1) {
      noFinalize = this.selectedClass.noOfStudentDailyReportFinalized;
    }else{
      noFinalize = this.selectedClass.noOfStudentReportFinalized;
    }
    if(button == 'approve'){
      this.approveDailyReport(this.selectedClassId, this.selectedClass.className, this.selectedClass.grade.gradeName, this.selectedClass.noOfAllStudent, noFinalize);
    }else if(button == 'save'){
      this.saveDailyReport();
    }else if(button == 'update'){
      this.updateDailyReport();
    } else if(button == 'rest'){
      this.rollbackReport(this.navParams.get('selected')[0].studentId,this.navParams.get('selected')[0].studentName,null,null)
    }
  }

  cancelEditigQuestion(qNumber){
    this.drQuestion[qNumber] = this.getNewInstanceOf(this.reportQuestionsRecovery[qNumber]);
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
    let questionTitle;
    if(this.accountServ.reportId == -1){
      questionTitle = drQuestion.dailyReportQuestionType.title;
    }else {
      questionTitle = drQuestion.reportQuestionType.title;
    }

    if(questionTitle == 'TEXT_QUESTION')
    {
      return "";
    }
    else if(questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_EN' ||
      questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_AR')
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
    else if (questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER' ||
      questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER' ||
      questionTitle == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER' ||
      questionTitle == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER' )
    {
      return {};
    }
    else if(questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER_WITH_EDIT')
    {
      return {};
    }
    else if (questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT')
    {
      return [drQuestion.parametersList[0].value];
    }
    else if (questionTitle == 'MULTI_SHORT_TEXT_MULTISELECT_VIEW_SELECTED')
    {
      return {};
    }
    else if (questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION')
    {
      return [drQuestion.parametersList[0].value];
    }
    else if (questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION')
    {
      return [false];
    }
    else if (questionTitle == 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER' ||
      questionTitle == 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER'
    )
    {
      return drQuestion.parametersList[0].value;
    }
    else if (questionTitle == 'CONSTANT_SHORT_HELPER_TEXT_QUESTION' ||
      questionTitle == 'CONSTANT_LONG_HELPER_TEXT_QUESTION' ||
      questionTitle == 'SHORT_HELPER_TEXT_QUESTION' ||
      questionTitle == 'LONG_HELPER_TEXT_QUESTION'
    )
    {
      return {};
    }
    else if (questionTitle == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED')
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

        else if (drQuestion.parametersList[v].key != "OPTION_HELPER_TITLE" || drQuestion.parametersList[v].key != "OPTION_HELPER_TEXT") {
          for(let pram of drQuestion.parametersList[v]) {
            if (firstTime) {
              defailtValueArray[counter] = {};
              defailtValueArray[counter].key = pram.key;
              defailtValueArray[counter].value = pram.value;
              counter++;
              firstTime = false;
            } else {

            }
          }
        }

      }
      let textTemp = 0;
      for (let d = 0; d < defailtValueArray.length; d++) {
        if (defailtValueArray[d].key == "OPTION_HELPER_TEXT") {
          textTemp = d+1;
          val[d] = defailtValueArray[d].value;
        } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
          val[textTemp] = defailtValueArray[d].value;
        }

      }
      return val;
    }
    else if (questionTitle == 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED')
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
    else if (questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR' ||
      questionTitle == 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN')
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

        else if (drQuestion.parametersList[v].key != "OPTION_HELPER_TITLE" && drQuestion.parametersList[v].key != "OPTION_DROP_DOWN") {
          for(let pram of drQuestion.parametersList[v]) {
            if(pram.key == "OPTION_ANSWER") {
              if (firstTime) {
                defailtValueArray[counter] = {};
                defailtValueArray[counter].key = pram.key;
                defailtValueArray[counter].value = pram.value;
                ;
                counter++;
                firstTime = false;
              } else {

              }
            }
          }
        }

      }
      let tempDrop = 0;
      for (var d = 0; d < defailtValueArray.length; d++) {
        if (defailtValueArray[d].key == "OPTION_DROP_DOWN") {
          tempDrop = d;
          val[d] = "";
        } else if (defailtValueArray[d].key == "OPTION_ANSWER") {
          val[(tempDrop+1)] = defailtValueArray[d].value;
        }

      }
      return val;
    }else{
      return "";
    }
  }


  approveDailyReport(classId, className, classGradeName, noOfAllStudents, noOfFinalized) {

    let noOfUnFinalized = noOfAllStudents - noOfFinalized;
    this.alrtCtrl.create({
      title: 'Approve Report',
      subTitle: 'Do you want to approve the reports for the selected student(s) ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.load = this.loadCtrl.create({
              content: "the report is approving now ..."
            });
            this.load.present();

            let studentsIdsArray = [];
            for(let student of this.navParams.get('selected')){
              studentsIdsArray.push(student.studentId);
            }

            this.dailyReportServ.approveReportByStudent(this.selectedReportDate,studentsIdsArray,this.reportId).subscribe(
              response =>{
                this.load.dismiss();
                this.presentToast("The report was Approved");
              },err=>{
                this.console.log(err);
                this.load.dismiss();
                this.alrtCtrl.create({
                  title: 'Approve Report',
                  subTitle: 'The Report didn\'t approved',
                  buttons: ['Ok']
                }).present();
              });


          }
        }
        ]}).present();
  }

  rollbackReport(studentId, studentName, selectedDate, classId) {
    this.alrtCtrl.create({
      title: 'Reset Student Report',
      subTitle: 'Are you sure you want to reset '+studentName +' \'s report?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.load = this.loadCtrl.create({
              content: "the report is now reset..."
            });
            this.load.present();

            if(this.navParams.get('selected').length == 1) {
              this.dailyReportServ.deleteStudnetReport(this.navParams.get('selected')[0].studentId, this.selectedReportDate,this.reportId).subscribe(
                response => {
                  this.load.dismiss();
                  this.viewCtrl.dismiss(
                    {closeView:"The report was reset"}
                  )
                }, err => {
                  this.console.log(err);
                  this.load.dismiss();
                  this.alrtCtrl.create({
                    title: 'Reset Student Report',
                    subTitle: 'The Report didn\'t Reset',
                    buttons: ['Ok']
                  });
                });
            }else{
              this.load.dismiss();
              this.alrtCtrl.create({
                title: 'Reset Student Report',
                subTitle: 'You can\'t reset report for mor than one student',
                buttons: ['Ok']
              });
            }

          }
        }
      ]}).present();
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





  saveDailyReport() {
    var newReport;
    if(this.accountServ.reportId == -1) {
      newReport = {
        "dailyReportAnswersObjectsList": []
      };
    }else{
      newReport = {
        "reportAnswersObjectsList": []
      };
    }
    let index = this.selectedClassIndex;
    for (let i = 0; i < this.drQuestion.length; i++) {

      if(this.accountServ.reportId == -1) {
        newReport.dailyReportAnswersObjectsList[i] = {
          "answer": "",
          "studentsList": this.selectedListOfStudentsID,
          "classId": this.selectedClassId,
          "questionId": this.drQuestion[i].id
        };
      }else{
        newReport.reportAnswersObjectsList[i] = {
          "answer": "",
          "studentsList": this.selectedListOfStudentsID,
          "classId": this.selectedClassId,
          "questionId": this.drQuestion[i].id
        };
      }

      let question = this.drQuestion[i];
      question.questionNumber = i;
      let value = this.getViewAnswers(question.questionNumber);

      let questionTitle;
      if(this.accountServ.reportId == -1) {
        questionTitle = question.dailyReportQuestionType.title;
      }else{
        questionTitle = question.reportQuestionType.title;
      }

      switch (questionTitle) {
        case 'TEXT_QUESTION':
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
        case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], value);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], value);
          }
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
        case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
        case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
          let selecteditems = this.checkboxFunctionService.convert_CheckListObject_To_DailyReportAnswer(value, question.parametersList);
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], selecteditems);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], selecteditems);
          }
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER_WITH_EDIT':
          let answer = "";
          let firstTime = true;
          for (let j = 0; j < question.parametersList.length; j++) {
            if (question.parametersList[j].key == "OPTION_ANSWER") {
              if (value[j] == true) {
                if (firstTime) {
                  answer = question.parametersList[j].value + "$$";
                  firstTime = false;
                } else {
                  answer += question.parametersList[j].value + "$$";
                }
              }

            } else if (question.parametersList[j].key == "OPTION_HELPER_TEXT") {
              if (value[j] == undefined || value[j] == null || value[j] == "" || value[j] == "undefined") {
                answer += "";

              } else {
                answer += value[j];
              }
            }

          }
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          }
          break;

        case 'MULTI_SHORT_TEXT_MULTISELECT_VIEW_SELECTED':
          selecteditems = this.checkboxFunctionService.convert_CheckListObject_To_DailyReportAnswer(value, question.parametersList);
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], selecteditems);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], selecteditems);
          }
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION':
          answer = "";
          if (value[1] == undefined) {
            answer = value[0] + "$$" + "";
          } else {
            answer = value[0] + "$$" + value[1];
          }
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          }
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION':
          answer = "";
          if (value[0] == true) {
            answer = question.parametersList[0].value;
          } else {
            answer = value[1];
          }
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          }
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT':
          answer = "";

          if (value[1] == undefined || value[1] == null || value[1] == "") {
            answer = value[0];
          } else {
            answer = value[0] + "$$" + value[1];
          }
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          }

          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_AR':
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_EN':
          let counter = 0;
          let answerValueArray = [];
          let firstTimeAnswer = true;
          counter = 0;

          answer = "";

          let idAnswer = "";
          for (let j = 0; j < question.parametersList.length; j++) {

            if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

            } else if (question.parametersList[j].key == "OPTION_HELPER_TEXT") {
              answerValueArray[counter] = {};
              answerValueArray[counter].key = question.parametersList[j].key;
              counter++;

            }

            else if (question.parametersList[j].key == "OPTION_ANSWER") {

              answerValueArray[counter] = {};
              answerValueArray[counter].key = question.parametersList[j].key;
              counter++;

            }

          }
          for (var a = 0; a < answerValueArray.length; a++) {
            if (answerValueArray[a].key == "OPTION_ANSWER") {
              if (firstTimeAnswer) {
                firstTimeAnswer = false;
                if (value[question.parametersList[a].id] == null || value[question.parametersList[a].id] == "" || value[question.parametersList[a].id] == " ") {
                  answer += 0;
                  idAnswer += question.parametersList[a].id;
                } else {
                  var n = value[question.parametersList[a].id];

                  answer += value[a];
                  idAnswer += question.parametersList[a].id
                }
              } else {
                if (value[question.parametersList[a].id] == null || value[question.parametersList[a].id] == "" || value[question.parametersList[a].id] == " ") {
                  answer += "$$" + 0;
                  idAnswer += "$$" + question.parametersList[a].id
                } else {

                  answer += "$$" + value[a];
                  idAnswer += "$$" + question.parametersList[a].id
                }
              }
            } else if (answerValueArray[a].key == "OPTION_HELPER_TEXT") {
              if (value[question.parametersList[a].id] == null || value[question.parametersList[a].id] == "" || value[question.parametersList[a].id] == " ") {
                answer += "&&" + 0;
                idAnswer += "$$" + question.parametersList[a].id
              } else {

                answer += "&&" + value[question.parametersList[a].id];
                idAnswer += "$$" + question.parametersList[a].id
              }

            }
          }
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer + "||" + idAnswer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer + "||" + idAnswer);
          }
          break;
        case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR':
        case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN':
          counter = 0;
          answerValueArray = [];
          let firstTimeFullAnswer = true;
          counter = 0;
          let firstTimeFullArray = true;
          answer = "";

          for (var j = 0; j < question.parametersList.length; j++) {

            if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

            } else if (question.parametersList[j].key == "OPTION_DROP_DOWN") {
              answerValueArray[counter] = {};
              answerValueArray[counter].key = question.parametersList[j].key;
              counter++;
              firstTimeFullArray = true;
            }

            else if (question.parametersList[j].key != "OPTION_HELPER_TITLE" && question.parametersList[j].key != "OPTION_DROP_DOWN") {
              for(let pram of question.parametersList[j]) {
                if(pram.key == "OPTION_ANSWER") {
                  if (firstTimeFullArray) {
                    answerValueArray[counter] = {};
                    answerValueArray[counter].key = pram.key;
                    counter++;
                    firstTimeFullArray = false;
                  } else {

                  }
                }
              }
            }

          }
          for (let a = 0; a < answerValueArray.length; a++) {
            if (answerValueArray[a].key == "OPTION_DROP_DOWN") {
              if (firstTimeFullAnswer) {
                firstTimeFullAnswer = false;
                if (value[a] == null || value[a] == "" || value[a] == " ") {
                  answer += 0;
                } else {
                  let n = value[a].indexOf('-');
                  let initialValue = value[a];
                  answer += initialValue.slice(n + 1);
                }
              } else {
                if (value[a] == null || value[a] == "" || value[a] == " ") {
                  answer += "&&" + 0;
                } else {
                  let n = value[a].indexOf('-');
                  let initialValue = value[a];
                  answer += "&&" + initialValue.slice(n + 1);
                }
              }
            } else if (answerValueArray[a].key == "OPTION_ANSWER") {
              answer += "&&" + value[a] + "$$";
              firstTimeFullAnswer = true;

            }
          }

          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          }
          break;
        case 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED':
        case 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED':
          counter = 0;
          answerValueArray = [];
          firstTimeFullAnswer = true;
          counter = 0;
          firstTimeFullArray = true;
          answer = "";

          for (let j = 0; j < question.parametersList.length; j++) {

            if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

            } else if (question.parametersList[j].key == "OPTION_HELPER_TEXT") {
              answerValueArray[counter] = {};
              answerValueArray[counter].key = question.parametersList[j].key;
              counter++;
              firstTimeFullArray = true;
            }

            else if (question.parametersList[j].key != "OPTION_HELPER_TITLE" || question.parametersList[j].key != "OPTION_HELPER_TEXT") {
              if(question.dailyReportQuestionType.title == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED'){
                for(let pram of question.parametersList[j]){
                  if (pram.key == "OPTION_ANSWER") {
                    if (firstTimeFullArray) {
                      answerValueArray[counter] = {};
                      answerValueArray[counter].key = pram.key;
                      counter++;
                      firstTimeFullArray = false;
                    } else {

                    }
                  }
                }
              }else {
                if (question.parametersList[j].key == "OPTION_ANSWER") {
                  if (firstTimeFullArray) {
                    answerValueArray[counter] = {};
                    answerValueArray[counter].key = question.parametersList[j].key;
                    counter++;
                    firstTimeFullArray = false;
                  } else {

                  }
                }
              }
            }

          }
          for (let a = 0; a < answerValueArray.length; a++) {
            if (answerValueArray[a].key == "OPTION_HELPER_TEXT") {
              if (firstTimeFullAnswer) {
                firstTimeFullAnswer = false;
                if (value[a] == null || value[a] == "" || value[a] == " ") {
                  answer += 0;
                } else {
                  answer += value[a];
                }
              } else {
                if (value[a] == null || value[a] == "" || value[a] == " ") {
                  answer += "&&" + 0;
                } else {
                  answer += "&&" + value[a];
                }
              }
            } else if (answerValueArray[a].key == "OPTION_ANSWER") {
              answer += "&&" + value[a] + "$$";
              firstTimeFullAnswer = true;

            }
          }

          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          }
          break;
        case 'CONSTANT_SHORT_HELPER_TEXT_QUESTION':
        case 'CONSTANT_LONG_HELPER_TEXT_QUESTION':
        case 'SHORT_HELPER_TEXT_QUESTION':
        case 'LONG_HELPER_TEXT_QUESTION':
          answer = "";
          firstTime = true;
          for (let j = 0; j < question.parametersList.length; j++) {
            if (value[j] == undefined || value[j] == null || value[j] == "") {
              value[j] = 0;
            }

            if (firstTime) {
              firstTime = false;
              answer += value[j];
            } else {
              answer += "$$" + value[j];
            }
          }

          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          }
          break;
      }
    }
    // if (this.selectedListOfStudentsID.length > 2) {
      this.load = this.loadCtrl.create({
        content: 'Please wait until the save is complete.'
      });
      this.load.present();
    // }

    let searchDate = this.selectedReportDate;

    // if(checkDifferenceWithDatabase) {
    //
    //   var databaseAnswersWithStudents = $scope.TeststudnetsAnswersList;
    //   var databaseAnswers = {};
    //
    //   for (i in $scope.selectedMultiStudent) {
    //     var selectedStudent = $scope.selectedMultiStudent[i];
    //     for (studentID in databaseAnswersWithStudents) {
    //       if (studentID == selectedStudent) {
    //         databaseAnswers = databaseAnswersWithStudents[studentID];
    //       }
    //     }
    //   }
    //
    //   var currentAnswers = newReport.dailyReportAnswersObjectsList;
    //   var answersBeforeEdit = $scope.AnswersBeforeEdit;
    //
    //   for (i in currentAnswers) {
    //     var currentAnswer = currentAnswers[i];
    //     var databaseAnswer = databaseAnswers[i];
    //     var beforeAnswer = answersBeforeEdit[i];
    //     currentAnswer.isEditted = true;
    //     if (currentAnswer.answer == beforeAnswer.answer) {
    //       currentAnswer.isEditted = false;
    //     }
    //   }
    //
    //   for (i in currentAnswers) {
    //     var currentAnswer = currentAnswers[i];
    //     var databaseAnswer = databaseAnswers[i];
    //     if (databaseAnswer && currentAnswer) {
    //       if (!currentAnswer.isEditted) {
    //         currentAnswer.answer = databaseAnswer.answer;
    //       } else if (currentAnswer.answer != databaseAnswer.answer) {
    //         if (currentAnswer.answer == '' || currentAnswer.answer == '||' || currentAnswer.answer == '0$$0') {
    //           currentAnswer.answer = databaseAnswer.answer;
    //           break;
    //         }
    //       }
    //     }
    //   }
    //
    //   var reportAnswers = [];
    //   for (i in currentAnswers) {
    //     var answer = currentAnswers[i];
    //     var obj = {
    //       'answer': answer.answer,
    //       'classId': answer.classId,
    //       'questionId': answer.questionId,
    //       'studentsList': answer.studentsList
    //     };
    //     reportAnswers.push(obj);
    //   }
    //
    //   newDailyReport.dailyReportAnswersObjectsList = reportAnswers;
    // }

    this.dailyReportServ.saveReport(newReport, searchDate, this.reportId).subscribe(
      (response) => {
        this.load.dismiss();
        let successMsg;
        if(this.accountServ.reportId == -1){
          successMsg = 'Success saved daily report.';
        }else{
          successMsg = 'Success saved report.';
        }
        this.presentToast(successMsg);
        if(this.selectedListOfStudentsID.length == 1){
          ///Get the next student in list if there is one
          this.getNextStudent();
        }
    },
      (reason) => {
      /*
       * console .error('Error:
       * dailyReport.module>DailyReportCtrl>saveDailyReport> cannot save
       * dailyReportTemplate - ' + reason);
       */
      console.log(reason);
      this.load.dismiss();
      let errorMsg;
      if(this.accountServ.reportId == -1){
        errorMsg = 'Problem saving daily report.';
      }else{
        errorMsg = 'Problem saving report.';
      }

        this.alrtCtrl.create({
          title: 'Failed',
          subTitle: errorMsg,
          buttons: ['Ok']
        }).present();
    });

  }




  getViewAnswers(questionNumber) {
    if(this.accountServ.reportId == -1) {
      return this.reportAnswer.dailyReportAnswersObjectsList[questionNumber].answer;
    }else{
      return this.reportAnswer.reportAnswersObjectsList[questionNumber].answer;
    }
  }

  mappingAnswers(reportObject, value) {
    return reportObject.answer = value;
  }



  KEEP_ORIGINAL_PATERN = "^_KEEP_ORIGINAL_^";
  updateDailyReport() {

    // $rootScope.isdisabled = true;
    let index = this.selectedClassIndex;
    let newReport;
    if(this.accountServ.reportId == -1) {
      newReport = {
        "dailyReportAnswersObjectsList": []
      };
    }else{
      newReport = {
        "reportAnswersObjectsList": []
      };
    }
    for (let i = 0; i < this.drQuestion.length; i++) {

      if(this.accountServ.reportId == -1) {
        newReport.dailyReportAnswersObjectsList[i] = {
          "answer": "",
          "studentsList": this.selectedListOfStudentsID,
          "classId": this.selectedClassId,
          "questionId": this.drQuestion[i].id
        };
      }else{
        newReport.reportAnswersObjectsList[i] = {
          "answer": "",
          "studentsList": this.selectedListOfStudentsID,
          "classId": this.selectedClassId,
          "questionId": this.drQuestion[i].id
        };
      }
      let question = this.drQuestion[i];
      question.questionNumber = i;
      let value = this.getViewAnswers(question.questionNumber);

      let questionTitle;
      if(this.accountServ.reportId == -1) {
        questionTitle = question.dailyReportQuestionType.title;
      }else{
        questionTitle = question.reportQuestionType.title;
      }

      switch (questionTitle) {

        case 'TEXT_QUESTION':
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
        case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], value);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], value);
          }
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
        case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
        case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
          let selecteditems = this.checkboxFunctionService.convert_CheckListObject_To_DailyReportAnswer(value, question.parametersList);
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], selecteditems);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], selecteditems);
          }
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER_WITH_EDIT':
          let answer = "";
          let firstTime = true;
          for (var j = 0; j < question.parametersList.length; j++) {
            if (question.parametersList[j].key == "OPTION_ANSWER") {
              if (value[j] == true) {
                if (firstTime) {
                  answer = question.parametersList[j].value;
                  firstTime = false;
                } else {
                  answer += "$$" + question.parametersList[j].value;
                }
              }
            } else if (question.parametersList[j].key == "OPTION_HELPER_TEXT") {
              if (value[j] == undefined || value[j] == null || value[j] == "" || value[j] == "undefined") {
                answer += "$$";
              } else {
                answer += "$$" + value[j];
              }

            }

          }
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          }
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT':
          answer = "";

          if (value[1] == undefined || value[1] == null || value[1] == "") {
            answer = value[0];
          } else {
            answer = value[0] + "$$" + value[1];
          }

          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          }

          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION':
          if (value[1] == undefined) {
            answer = value[0] + "$$" + "";
          } else {
            if (value[0] == "" && value[1].length > 0) {
              value[0] = this.KEEP_ORIGINAL_PATERN;
            }else if (value[0] == ""){
              value[0] = this.drQuestion[i].parametersList[0].value;
            }
            answer = value[0] + "$$" + value[1];
          }

          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          }
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION':
          answer = "";
          if (value[0] == true) {
            answer = question.parametersList[0].value;
          } else {
            answer = value[1];
          }
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          }
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_AR':
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER_INPUT_BOX_EN':
          let counter = 0;
          let answerValueArray = [];
          let firstTimeAnswer = true;
          counter = 0;

          answer = "";

          let idAnswer = "";
          for (let j = 0; j < question.parametersList.length; j++) {

            if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

            } else if (question.parametersList[j].key == "OPTION_HELPER_TEXT") {
              answerValueArray[counter] = {};
              answerValueArray[counter].key = question.parametersList[j].key;
              counter++;

            }

            else if (question.parametersList[j].key == "OPTION_ANSWER") {

              answerValueArray[counter] = {};
              answerValueArray[counter].key = question.parametersList[j].key;
              counter++;

            }

          }
          for (let a = 0; a < answerValueArray.length; a++) {
            if (answerValueArray[a].key == "OPTION_ANSWER") {
              if (firstTimeAnswer) {
                firstTimeAnswer = false;
                if (value[question.parametersList[a].id] == null || value[question.parametersList[a].id] == "" || value[question.parametersList[a].id] == " ") {
                  answer += 0;
                  idAnswer += question.parametersList[a].id
                } else {
                  let n = value[question.parametersList[a].id];

                  answer += question.parametersList[a].value;
                  idAnswer += question.parametersList[a].id
                }
              } else {
                if (value[question.parametersList[a].id] == null || value[question.parametersList[a].id] == "" || value[question.parametersList[a].id] == " ") {
                  answer += "$$" + 0;
                  idAnswer += "$$" + question.parametersList[a].id
                } else {

                  answer += "$$" + question.parametersList[a].value;
                  idAnswer += "$$" + question.parametersList[a].id
                }
              }
            } else if (answerValueArray[a].key == "OPTION_HELPER_TEXT") {
              if (value[question.parametersList[a].id] == null || value[question.parametersList[a].id] == "" || value[question.parametersList[a].id] == " ") {
                answer += "&&" + 0;
                idAnswer += "$$" + question.parametersList[a].id
              } else {

                answer += "&&" + value[question.parametersList[a].id];
                idAnswer += "$$" + question.parametersList[a].id
              }

            }
          }
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer + "||" + idAnswer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer + "||" + idAnswer);
          }
          break;

        case 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED':
        case 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED':
          counter = 0;
          answerValueArray = [];
          let firstTimeFullAnswer = true;
          counter = 0;
          let firstTimeFullArray = true;
          answer = "";
          let defaultAnswerForMulti = null;

          if (this.overrideAnswer) {
            for (let j = 0; j < question.parametersList.length; j++) {

              if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

              } else if (question.parametersList[j].key == "OPTION_HELPER_TEXT") {
                answerValueArray[counter] = {};
                answerValueArray[counter].key = question.parametersList[j].key;
                counter++;
                firstTimeFullArray = true;
              }

              else if (question.parametersList[j].key != "OPTION_HELPER_TITLE" || question.parametersList[j].key != "OPTION_HELPER_TEXT") {
                if(question.dailyReportQuestionType.title == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED'){
                  for(let pram of question.parametersList[j]){
                    if (pram.key == "OPTION_ANSWER") {
                      if (firstTimeFullArray) {
                        answerValueArray[counter] = {};
                        answerValueArray[counter].key = pram.key;
                        counter++;
                        firstTimeFullArray = false;
                      } else {

                      }
                    }
                  }
                }else {
                  if (question.parametersList[j].key == "OPTION_ANSWER") {
                    if (firstTimeFullArray) {
                      answerValueArray[counter] = {};
                      answerValueArray[counter].key = question.parametersList[j].key;
                      counter++;
                      firstTimeFullArray = false;
                    } else {

                    }
                  }
                }
              }

            }
            for (let a = 0; a < answerValueArray.length; a++) {
              if (answerValueArray[a].key == "OPTION_HELPER_TEXT") {
                if (firstTimeFullAnswer) {
                  firstTimeFullAnswer = false;
                  if (value[a] == null || value[a] == "" || value[a] == " ") {
                    answer += 0;
                  } else {
                    answer += value[a];
                  }
                } else {
                  if (value[a] == null || value[a] == "" || value[a] == " ") {
                    answer += "&&" + 0;
                  } else {
                    answer += "&&" + value[a];
                  }
                }
              } else if (answerValueArray[a].key == "OPTION_ANSWER") {
                if (question.dailyReportQuestionType.title == "SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED") {

                  if (value[a] == "") {
                    value[a] = question.parametersList[1].value;
                    answer += "&&" + value[a] + "$$";

                  } else {
                    answer += "&&" + value[a] + "$$";
                  }

                  firstTimeFullAnswer = true;

                } else if (question.dailyReportQuestionType.title == "MULTI_SHORT_TEXT_ONE_VIEW_SELECTED") {
                  if (!defaultAnswerForMulti) {
                    for (let j = 0; j < question.parametersList.length; j++) {
                      if (question.parametersList[j].key == "OPTION_ANSWER") {
                        defaultAnswerForMulti = question.parametersList[j].value;
                        break;
                      }

                    }
                  }
                  if (value[a] == "") {
                    value[a] = defaultAnswerForMulti;
                    answer += "&&" + value[a] + "$$";

                  } else {
                    answer += "&&" + value[a] + "$$";
                  }

                  firstTimeFullAnswer = true;

                }
              }
            }
            if(this.accountServ.reportId == -1) {
              this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
            }else{
              this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
            }
          }

          break;
        case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR':
        case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN':
          counter = 0;
          answerValueArray = [];
          firstTimeFullAnswer = true;
          counter = 0;
          firstTimeFullArray = true;
          answer = "";
          for (let j = 0; j < question.parametersList.length; j++) {

            if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

            } else if (question.parametersList[j].key == "OPTION_DROP_DOWN") {
              answerValueArray[counter] = {};
              answerValueArray[counter].key = question.parametersList[j].key;
              counter++;
              firstTimeFullArray = true;
            }

            else if (question.parametersList[j].key != "OPTION_HELPER_TITLE" && question.parametersList[j].key != "OPTION_DROP_DOWN") {
              for(let pram of question.parametersList[j]) {
                if(pram.key == "OPTION_ANSWER") {
                  if (firstTimeFullArray) {
                    answerValueArray[counter] = {};
                    answerValueArray[counter].key = pram.key;
                    counter++;
                    firstTimeFullArray = false;
                  } else {

                  }
                }
              }
            }

          }
          for (let a = 0; a < answerValueArray.length; a++) {
            if (answerValueArray[a].key == "OPTION_DROP_DOWN") {
              if (firstTimeFullAnswer) {
                firstTimeFullAnswer = false;
                if (value[a] == null || value[a] == "" || value[a] == " ") {
                  answer += 0;
                } else {
                  let n = value[a].indexOf('-');
                  let initialValue = value[a];
                  answer += initialValue.slice(n + 1);

                }
              } else {
                if (value[a] == null || value[a] == "" || value[a] == " ") {
                  answer += "&&" + 0;
                } else {
                  let n = value[a].indexOf('-');
                  let initialValue = value[a];
                  answer += "&&" + initialValue.slice(n + 1);
                }
              }
            } else if (answerValueArray[a].key == "OPTION_ANSWER") {
              answer += "&&" + value[a] + "$$";
              firstTimeFullAnswer = true;

            }
          }
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          }
          break;
        case 'CONSTANT_SHORT_HELPER_TEXT_QUESTION':
        case 'CONSTANT_LONG_HELPER_TEXT_QUESTION':
        case 'SHORT_HELPER_TEXT_QUESTION':
        case 'LONG_HELPER_TEXT_QUESTION':
          answer = "";
          firstTime = true;
          for (let j = 0; j < question.parametersList.length; j++) {
            if (value[j] === undefined || value[j] === null || value[j] === "") {
              value[j] = 0;
            }

            if (firstTime) {
              firstTime = false;
              answer += value[j];
            } else {
              answer += "$$" + value[j];
            }
          }
          if(this.accountServ.reportId == -1) {
            this.mappingAnswers(newReport.dailyReportAnswersObjectsList[i], answer);
          }else{
            this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          }
          break;
      }
    }

    // if (this.selectedMultiStudent.length > 2) {
      this.load = this.loadCtrl.create({
        content: 'Please wait until the update is complete.'
      });
      this.load.present();
    // }

    // *************

    let searchDate = this.selectedReportDate;

    // if(checkDifferenceWithDatabase) {
    //   var databaseAnswersWithStudents = $scope.TeststudnetsAnswersList;
    //   var databaseAnswers = {};
    //
    //   for (i in $scope.selectedMultiStudent) {
    //     var selectedStudent = $scope.selectedMultiStudent[i];
    //     for (studentID in databaseAnswersWithStudents) {
    //       if (studentID == selectedStudent) {
    //         databaseAnswers = databaseAnswersWithStudents[studentID];
    //       }
    //     }
    //   }
    //
    //   var currentAnswers = newReport.dailyReportAnswersObjectsList;
    //   var answersBeforeEdit = $scope.AnswersBeforeEdit;
    //
    //   for (i in currentAnswers) {
    //     var currentAnswer = currentAnswers[i];
    //     var databaseAnswer = databaseAnswers[i];
    //     var beforeAnswer = answersBeforeEdit[i];
    //     currentAnswer.isEditted = true;
    //     if (currentAnswer && beforeAnswer && currentAnswer.answer == beforeAnswer.answer) {
    //       currentAnswer.isEditted = false;
    //     }
    //   }
    //
    //   for (i in currentAnswers) {
    //     var currentAnswer = currentAnswers[i];
    //     var databaseAnswer = databaseAnswers[i];
    //     if (databaseAnswer && currentAnswer) {
    //       if (!currentAnswer.isEditted) {
    //         currentAnswer.answer = databaseAnswer.answer;
    //       } else if (currentAnswer.answer != databaseAnswer.answer) {
    //         if (currentAnswer.answer == '' || currentAnswer.answer == '||' || currentAnswer.answer == '0$$0') {
    //           currentAnswer.answer = databaseAnswer.answer;
    //           break;
    //         }
    //       }
    //     }
    //   }
    //
    //   var reportAnswers = [];
    //   for (i in currentAnswers) {
    //     var answer = currentAnswers[i];
    //     var obj = {
    //       'answer': answer.answer,
    //       'classId': answer.classId,
    //       'questionId': answer.questionId,
    //       'studentsList': answer.studentsList
    //     };
    //     reportAnswers.push(obj);
    //   }
    //
    //   newDailyReport.dailyReportAnswersObjectsList = reportAnswers;
    //
    //   // ********
    // }

    this.dailyReportServ.updateReport(newReport, searchDate, this.reportId).subscribe(
      (response)=> {
        let successMsg;
        this.load.dismiss();
        if(this.accountServ.reportId == -1){
          successMsg = 'Success updated daily report.';
        }else{
          successMsg = 'Success updated report.';
        }
        this.presentToast(successMsg);
        if(this.selectedListOfStudentsID.length == 1){
          ///Get the next student in list if there is one
          this.getNextStudent();
        }


    }, (reason)=> {
      /*
       * console .error('Error:
       * dailyReport.module>DailyReportCtrl>saveDailyReport> cannot save
       * dailyReportTemplate - ' + reason);
       */
      console.log(reason);
      this.load.dismiss();
      let errorMsg;
      if(this.accountServ.reportId == -1){
        errorMsg = 'Problem updating daily report';
      }else{
        errorMsg = 'Problem updating report.';
      }

     this.alrtCtrl.create({
        title: 'Failed',
        subTitle: errorMsg,
        buttons: ['Ok']
      }).present();
    });
  }

  nextStudentNumb;
  getNextStudent(){
    let student_list = this.selectedClass.studentsList;
    let lastOneInList = student_list.length;
    if(this.selectedListOfStudents.length == 1){
      console.log('selectedListOfStudents Number'+this.selectedListOfStudents.length);
      this.nextStudentNumb = this.selectedListOfStudents[0].numberInList + 1;
      if(this.nextStudentNumb < lastOneInList){
        console.log('selectedListOfStudents Numberin list'+this.selectedListOfStudents[0].numberInList);

        if (this.accountServ.reportId == -1) {
          this.PageName =  student_list[this.nextStudentNumb].studentName +"'s daily report";
        } else {
          this.PageName =  student_list[this.nextStudentNumb].studentName +"'s "+this.accountServ.reportPage;
        }
        this.selectedListOfStudents[0] = student_list[this.nextStudentNumb];
        for(let i in this.selectedListOfStudents) {
          this.selectedListOfStudentsID = [];
          this.selectedListOfStudentsID.push({id: this.selectedListOfStudents[i].studentId});
        }

        this.getStudentsAnswer();

      }
    }
  }


  getStudentsAnswer(){
    let loadAnswer = this.loadCtrl.create({
      content: "loading next student answers ..."
    });
    loadAnswer.present();

    this.dailyReportServ.getStudentReportAnswers(this.selectedClassId,this.selectedReportDate,this.reportId).subscribe(
      resp=>{
        loadAnswer.dismiss();
        this.getMultiSelectedStudents(this.selectedListOfStudentsID[0].id, this.nextStudentNumb, false, this.selectedListOfStudents[0].reportFinalized,this.selectedListOfStudents[0].studentName,this.selectedClassIndex);
      },err =>{
        this.presentToast("Can't get students reports answer");
        loadAnswer.dismiss();
      }
    );

  }



  Sellected;
  selectedMultiStudent;
  selectedMultiStudentId;
  isChecked;
  listOfFinalized;
  studentsSelected;
  isNotValid;
  classChecked;
  reportAnswerForSelectedStudent;
  isSave;
  studnetsAnswersList;
  firstStudentId;
  reportQuestions;
  questionsToBeReset;
  getMultiSelectedStudents(StudentId, index, isChecked, studentFinalized,studentName,classIndex) {
    this.Sellected = 1000;
    this.selectedMultiStudent = [];
    this.isChecked = [];
    this.listOfFinalized = [];
    this.classChecked = [];
    this.studnetsAnswersList = [];
    this.reportQuestions = this.navParams.get('template');

    let idx = this.selectedMultiStudent.indexOf(StudentId);
    if (idx > -1) {
      this.selectedMultiStudent.splice(idx, 1);
      this.isChecked[index] = {};
      this.isChecked[index].checked = false;
      this.listOfFinalized.splice(idx, 1);
    }
    else {
      this.listOfFinalized.push(studentFinalized);
      this.selectedMultiStudent.push(StudentId);
      this.isChecked[index] = {};
      this.isChecked[index].checked = true;
      this.studentsSelected = true;
    }

    this.isNotValid = false;
    this.selectedMultiStudentId = [];
    for (var i = 0; i < this.selectedMultiStudent.length; i++) {
      this.selectedMultiStudentId[i] = {};
      this.selectedMultiStudentId[i].id = this.selectedMultiStudent[i];
    }
    this.getDailyReportData(StudentId, index, this.isChecked[index].checked, 'checkBox', studentName, studentFinalized,classIndex);
  }


  getDailyReportData (studentId, index, checkedSudent, caller, studentName, studentFinalized,selectedClassIndex) {
    // this.studentName = studentName + '\'s daily report';
    let studentID = studentId;
    if (caller == 'checkBox' && checkedSudent == true) {
      this.classChecked[selectedClassIndex] = {};
      this.classChecked[selectedClassIndex].selected = false;
      if (this.selectedMultiStudent.length == 1) {
        this.reportAnswerForSelectedStudent = [];
        console.log(this.dailyReportServ.reportClassQuestionsGroups);
        for (let qId of Object.keys(this.dailyReportServ.reportClassQuestionsGroups)) {
          console.log(qId);
          for (let answer of Object.keys(this.dailyReportServ.reportClassQuestionsGroups[qId])) {
            console.log(answer);
            for(let answerTemp of this.dailyReportServ.reportClassQuestionsGroups[qId][answer]) {
              console.log(answerTemp);
              console.log(studentID);
              if (answerTemp == studentID) {
                this.reportAnswerForSelectedStudent.push({"questionId": qId, "answer": answer});
                console.log(this.reportAnswerForSelectedStudent);
              }
            }
          }
        }
        console.log(this.reportAnswerForSelectedStudent.length);
        if (this.reportAnswerForSelectedStudent.length == 0) {
          this.isSave = true;
          this.isNotValid = false;
          this.resetReportTemplate(null,null);
        } else {
          this.studnetsAnswersList[studentId] = this.reportAnswerForSelectedStudent;
          this.isNotValid = false;
          this.isSave = false;
          this.reverseAnswerToViewAnswer(this.reportAnswerForSelectedStudent);
        }
      }
      else if (this.selectedMultiStudent.length > 1) {
        if (this.isChecked[index].checked) {
          this.reportAnswerForSelectedStudent = [];
          console.log(this.dailyReportServ.reportClassQuestionsGroups);
          for (let qId of Object.keys(this.dailyReportServ.reportClassQuestionsGroups)) {
            console.log(qId);
            for (let answer of Object.keys(this.dailyReportServ.reportClassQuestionsGroups[qId])) {
              console.log(answer);
              for(let answerTemp of this.dailyReportServ.reportClassQuestionsGroups[qId][answer]) {
                console.log(answerTemp);
                console.log(studentID);
                if (answerTemp == studentID) {
                  this.reportAnswerForSelectedStudent.push({"questionId": qId, "answer": answer});
                  console.log(this.reportAnswerForSelectedStudent);
                }
              }
            }
          }
          if (this.reportAnswerForSelectedStudent.length == 0) {
            this.isSave = true;
            this.isNotValid = false;
            let idx = this.listOfFinalized.indexOf(true);
            if (idx == -1) {
              this.isNotValid = false;
              this.isSave = true;
              this.firstStudentId = this.selectedMultiStudent[0];
            } else {
              this.isNotValid = false;
              this.isSave = false;
              this.firstStudentId = this.selectedMultiStudent[0];
            }
          } else {
            this.studnetsAnswersList[studentId] = this.reportAnswerForSelectedStudent;
            for (var i = 0; i < this.reportAnswerForSelectedStudent.length; i++) {
              var questionIdGroup = this.dailyReportServ.reportClassQuestionsGroups[this.reportAnswerForSelectedStudent[i].questionId];
              var sameAnswerStudentsIds = questionIdGroup[this.reportAnswerForSelectedStudent[i].answer];
              var sameAnswers = true;
              for (let key of this.studnetsAnswersList) {
                let intKey = parseInt(key, 10);
                if (!sameAnswerStudentsIds.some(e => e === intKey)) {
                  sameAnswers = false;
                  break;
                }
              }
              this.questionsToBeReset[i] = sameAnswers;
            }
            this.resetReportTemplate(this.questionsToBeReset, this.reportAnswerForSelectedStudent);
            this.isNotValid = false;
            this.isSave = false;
          }
        }
      }
    } else if (caller == 'checkBox' && checkedSudent == false) {
      this.studnetsAnswersList.splice(studentId, 1);
      if (this.studnetsAnswersList.length < 1) {
        this.resetReportTemplate(null,null);
      } else {
        this.reportAnswerForSelectedStudent = [];
        let oneStudentCheckedId = parseInt(Object.keys(this.studnetsAnswersList)[0], 10);
        console.log(this.dailyReportServ.reportClassQuestionsGroups);
        for (let qId of Object.keys(this.dailyReportServ.reportClassQuestionsGroups)) {
          console.log(qId);
          for (let answer of Object.keys(this.dailyReportServ.reportClassQuestionsGroups[qId])) {
            console.log(answer);
            for(let answerTemp of this.dailyReportServ.reportClassQuestionsGroups[qId][answer]) {
              console.log(answerTemp);
              console.log(studentID);
              if (answerTemp == oneStudentCheckedId) {
                this.reportAnswerForSelectedStudent.push({"questionId": qId, "answer": answer});
                console.log(this.reportAnswerForSelectedStudent);
              }
            }
          }
        }

        if (this.reportAnswerForSelectedStudent.length == 0) {
          this.isSave = true;
          this.isNotValid = false;
          this.resetReportTemplate(null,null);
        } else {
          this.isNotValid = false;
          this.isSave = false;
        }
        for (let i = 0; i < this.reportAnswerForSelectedStudent.length; i++) {
          let questionIdGroup = this.dailyReportServ.reportClassQuestionsGroups[this.reportAnswerForSelectedStudent[i].questionId];
          let sameAnswerStudentsIds = questionIdGroup[this.reportAnswerForSelectedStudent[i].answer];
          let sameAnswers = true;
          for (let key of this.studnetsAnswersList) {
            var intKey = parseInt(key, 10);
            if (!sameAnswerStudentsIds.includes(intKey)) {
              sameAnswers = false;
              break;
            }
          }
          this.questionsToBeReset[i] = sameAnswers;
        }
        this.resetReportTemplate(this.questionsToBeReset, this.reportAnswerForSelectedStudent);
      }
      if (this.selectedMultiStudent.length == 1) {
        for (var j = 0; j < this.selectedClass.studentsList.length; j++) {
          if (this.selectedClass.studentsList[j].id == this.selectedMultiStudentId[0].id) {
            // this.studentName = this.classesList[selectedClassIndex].studentsList[j].name + '\'s daily report';
            break;
          }
        }
      }
    }

    console.log(this.reportAnswerForSelectedStudent);
    console.log(this.selectedMultiStudentId);
    console.log(this.reportAnswer);
    console.log(this.isChecked);
  }



  resetReportTemplate(questionsToBeReset, answers) {
    if (!questionsToBeReset) {
      for (let i = 0; i < this.reportQuestions.length; i++) {
        if(this.accountServ.reportId == -1) {
          this.mappingDefaultAnswers(this.reportAnswer.dailyReportAnswersObjectsList[i], this.reportQuestions[i]);
        }else{
          this.mappingDefaultAnswers(this.reportAnswer.reportAnswersObjectsList[i], this.reportQuestions[i]);
        }
        // $('#' + $scope.reportQuestions[i].id).addClass("ng-hide");
        // this.studentName = "";

      }
    } else {
      for (let i = 0; i < this.reportQuestions.length; i++) {
        if (!questionsToBeReset[i]) {
          // not same answer>>> display empty answer.
          // $('#' + $scope.reportQuestions[i].id).removeClass("ng-hide");

          // mappingDefaultAnswers(
          // $scope.reportAnswer.dailyReportAnswersObjectsList[i],
          // $scope.reportQuestions[i]);
          let questionTitle;
          if(this.accountServ.reportId == -1){
            questionTitle = this.reportQuestions[i].dailyReportQuestionType.title;
          }else{
            questionTitle = this.reportQuestions[i].reportQuestionType.title;
          }

          switch (questionTitle) {

            case "TEXT_QUESTION":
            case "SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER":
              if(this.accountServ.reportId == -1) {
                this.reportAnswer.dailyReportAnswersObjectsList[i] = {
                  "answer": ""
                };
              }else{
                this.reportAnswer.reportAnswersObjectsList[i] = {
                  "answer": ""
                };
              }
              break;
            case "SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION":
              if(this.accountServ.reportId == -1) {
                this.reportAnswer.dailyReportAnswersObjectsList[i] = {
                  "answer": ["", ""]
                };
              }else{
                this.reportAnswer.reportAnswersObjectsList[i] = {
                  "answer": ["", ""]
                };
              }
              break;
            default:
              let questionTitle;
              if(this.accountServ.reportId == -1){
                questionTitle = this.reportQuestions[i].dailyReportQuestionType.title;
              }else{
                questionTitle = this.reportQuestions[i].reportQuestionType.title;
              }

              if (questionTitle == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED' || questionTitle == 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED') {
                this.overrideAnswer = true;
              }

              if (this.reportQuestions[i].parametersList) {
                var emptyAnswer = [];
                for (var j = 0; j < this.reportQuestions[i].parametersList.length; j++) {
                  emptyAnswer.push("");
                }
                if(this.accountServ.reportId == -1){
                  this.reportAnswer.dailyReportAnswersObjectsList[i] = {
                    "answer": emptyAnswer
                  }
                }else{
                  this.reportAnswer.reportAnswersObjectsList[i] = {
                    "answer": emptyAnswer
                  }
                }
              }
              break;

          }

        } else {
          if(this.accountServ.reportId == -1) {
            this.reportAnswer.dailyReportAnswersObjectsList[i].answer = this.getViewQuestionAnswer(this.reportQuestions[i], answers[i].answer);
          }else{
            this.reportAnswer.reportAnswersObjectsList[i].answer = this.getViewQuestionAnswer(this.reportQuestions[i], answers[i].answer);
          }
          // $('#' + $scope.reportQuestions[i].id).addClass("ng-hide");
        }

      }
    }

  }

  getViewQuestionAnswer(question, dbAnswer) {
    let questionTitle;
    if(this.accountServ.reportId == -1){
      questionTitle = question.dailyReportQuestionType.title;
    }else{
      questionTitle = question.reportQuestionType.title;
    }

    switch (questionTitle) {
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
        for (let i = 0; i < question.parametersList.length; i++) {
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
        ;
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
          }

          else if (question.parametersList[j].key != "OPTION_HELPER_TITLE" && question.parametersList[j].key != "OPTION_DROP_DOWN") {
            for(let pram of question.parametersList[j]) {
              if(pram.key == "OPTION_ANSWER") {
                if (firstTimeFullArray) {
                  getAnswerValueArray[counter] = {};
                  getAnswerValueArray[counter].key = pram.key;
                  counter++;
                  firstTimeFullArray = false;
                } else {

                }
              }
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
          }

          if(question.dailyReportQuestionType.title == 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED'){
            for(let pram of question.parametersList[j]){
              if (pram.key == "OPTION_ANSWER") {
                if (firstTimeFullArray) {
                  getAnswerValueArray[counter] = {};
                  getAnswerValueArray[counter].key = pram.key;
                  counter++;
                  firstTimeFullArray = false;
                } else {

                }
              }
            }
          }else {
            if (question.parametersList[j].key == "OPTION_ANSWER") {
              if (firstTimeFullArray) {
                getAnswerValueArray[counter] = {};
                getAnswerValueArray[counter].key = question.parametersList[j].key;
                counter++;
                firstTimeFullArray = false;
              } else {

              }
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
        console.log('SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED');
        console.log(value);
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
          }

          else if (question.parametersList[j].key != "OPTION_HELPER_TITLE" && question.parametersList[j].key != "OPTION_DROP_DOWN") {
            for(let pram of question.parametersList[j]) {
              if (firstTimeFullArray) {
                getAnswerValueArray[counter] = {};
                getAnswerValueArray[counter].key = pram.key;
                counter++;
                firstTimeFullArray = false;
                questionCount++;
              } else {

              }
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
    }
  }

  reverseAnswerToViewAnswer(reportAnswerDb) {
    let reportAnswerView;
    if(this.accountServ.reportId == -1) {
      reportAnswerView = {
        "dailyReportAnswersObjectsList": []
      };
    }else{
      reportAnswerView = {
        "reportAnswersObjectsList": []
      };
    }

    for (let i = 0; i < this.reportQuestions.length; i++) {
      let question = this.reportQuestions[i];
      if(this.accountServ.reportId == -1) {
        reportAnswerView.dailyReportAnswersObjectsList[i] = {
          "answer": this.getViewQuestionAnswer(question, reportAnswerDb[i].answer)
        };
      }else{
        reportAnswerView.reportAnswersObjectsList[i] = {
          "answer": this.getViewQuestionAnswer(question, reportAnswerDb[i].answer)
        };
      }
    }

    this.reportAnswer = reportAnswerView;

  }


  onClickonMenuCalenderFromReport(){
    let date = this.selectedReportDate.split('-');
    let year = date [2];
    let month = date [1];
    let day = date [0];

    let dateMaxmum = this.tranformDate.transformTheDate(new Date(),'dd-MM-yyyy');
    let dateMaxData = dateMaxmum.split('-');
    let yearMaxmum:number = +dateMaxData [2];
    let monthMaxmum:number = +dateMaxData [1];
    let dayMaxmum:number = +dateMaxData [0];

    this.datePicker.show({
      date: new Date(year, month-1, day),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT,
      minDate:new Date(2014, 0, 1).valueOf(),
      maxDate: new Date(yearMaxmum, (monthMaxmum-1), dayMaxmum).valueOf(),
      allowFutureDates:false
    }).then(
      date => {
        console.log('Got date: ', this.tranformDate.transformTheDate(date,'dd-MM-yyyy'));
        this.presentToast(this.tranformDate.transformTheDate(date,'dd-MM-yyyy'));
        this.selectedReportDate = this.tranformDate.transformTheDate(date,'dd-MM-yyyy');
        this.reportDate = this.tranformDate.transformTheDate(date,'dd/MM/yyyy');
        this.getStudentsAnswer();
      },
      err =>{
        console.log('Error occurred while getting date: ', err);
      }
    );
  }

}
