import {Injectable} from "@angular/core";
import 'rxjs/add/operator/map';
import {Url_domain} from "../models/url_domain";
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/mergeMap';
import {HttpClient} from "@angular/common/http";
import {AlertController, LoadingController, Platform, ToastController} from "ionic-angular";
import {NotificationService} from "./notification";
import {Pendingnotification} from "../models/pendingnotification";
import {BackgroundMode} from "@ionic-native/background-mode";
import {Storage} from "@ionic/storage";
import {Postattachment} from "../models/postattachment";
import {Send_student_notification} from "../models/send_student_notification";
import {Network} from "@ionic-native/network";
import {FCMService} from "./fcm";
import {LocalNotifications} from "@ionic-native/local-notifications";
import {AccountService} from "./account";
import {MedicalRecord} from "../models/medical-record";
import {MedicalCareService} from "./medicalcare";
import {CheckboxFunctionService} from "./checkboxFunctionService";

@Injectable()
export class BackgroundMedicalcareService {
  medicalRecord: MedicalRecord = new MedicalRecord();
  prescription = {'id': null, 'medicalRecords': null, 'medications': []};
  //////////INCIDENTS VARIABLE////////////////////
  incident;
  incidentTemplate:any;
  incidentQuestions: any = [];
  incidentAnswer: any[] = [];
  incidentAnswersList: any[] = [];
  finalIncidentTemplateAnswers;
  attachmentArray: any[] = [];
  arrayOfFormData:any[]=[];
  //////////CHECKUP VARIABLE////////////////////
  checkup;
  checkupTemplate:any;
  checkupQuestions: any;
  checkupAnswer:any;
  checkupAnswersList: any[] = [];
  finalCheckupTemplateAnswers;
  ////data////////
  operation;
  selectedStudent;
  incidentSelectedDate;
  selectedIncidentTime;
  //////Views//////
  viewCtrl;
  LoadView;
  constructor(private accountServ:AccountService,private  medicalService:MedicalCareService,private toastCtrl:ToastController,
              private checkboxFunctionService:CheckboxFunctionService,private localNotifications: LocalNotifications,
              private notiServ:NotificationService,private alrtCtrl:AlertController,private loadCtrl:LoadingController){

  }

  addIncident(checkup,checkupAnswer,incident,incidentSelectedDate,selectedIncidentTime,operation,checkupTemplate,incidentTemplate,
              prescription,medicalRecord,selectedStudent,viewCtrl,incidentQuestions,incidentAnswer,checkupQuestions){
    this.checkup = checkup;
    this.checkupAnswer = checkupAnswer;
    this.incident=incident;
    this.incidentSelectedDate=incidentSelectedDate;
    this.selectedIncidentTime=selectedIncidentTime;
    this.operation=operation;
    this.checkupTemplate=checkupTemplate;
    this.incidentTemplate=incidentTemplate;
    this.prescription=prescription;
    this.medicalRecord=medicalRecord;
    this.selectedStudent=selectedStudent;
    this.viewCtrl=viewCtrl;
    this.incidentQuestions=incidentQuestions;
    this.incidentAnswer=incidentAnswer;
    this.checkupQuestions=checkupQuestions;

    this.LoadView = this.loadCtrl.create({
      content: '',
      cssClass:"loadingWithoutBackground"
    });
    this.LoadView.present();
    let icidentQ=this.incidentQuestions[0];
    let foundIMAGE_WITH_DESCRIPTION_Q = false;
    let IMAGE_WITH_DESCRIPTION_ARRAY:any[]=[];
    for(let i=0;i<icidentQ.length;i++){
      if(icidentQ[i].questionType.title == "IMAGES_WITH_DESCRIPTION"){
        foundIMAGE_WITH_DESCRIPTION_Q = true;
        IMAGE_WITH_DESCRIPTION_ARRAY.push(icidentQ[i].id);
      }
    }

    if(foundIMAGE_WITH_DESCRIPTION_Q) {
      if (IMAGE_WITH_DESCRIPTION_ARRAY) {
        let promisesArray = [];
        for (let i=0;i< this.incidentAnswer.length;i++) {
          // let form: FormData = this.arrayFormData[index];
          let attachmentsArray = this.incidentAnswer[i].incidentAnswersObjectsList[0].answer;

          for(let j=0;j<attachmentsArray.length;j++){
            let found = false;
            for(let I of IMAGE_WITH_DESCRIPTION_ARRAY){
              if(I == attachmentsArray[j].questionId){
                found = true;
              }
            }
            if(found) {
              let form = new FormData();
              form.append('file', attachmentsArray[j].file);
              promisesArray.push(this.uploadAttach(form, i, j,attachmentsArray[j].description));
            }
          }
        }
        Promise.all(promisesArray).then(data => {
          this.sendIncident(null);
        });
      }
    }else{
      this.sendIncident(null);
    }
  }

  addCheckup(checkup,checkupAnswer,incident,incidentSelectedDate,selectedIncidentTime,operation,checkupTemplate,incidentTemplate,
             prescription,medicalRecord,selectedStudent,viewCtrl,incidentQuestions,incidentAnswer,checkupQuestions){
    this.checkup = checkup;
    this.checkupAnswer = checkupAnswer;
    this.incident=incident;
    this.incidentSelectedDate=incidentSelectedDate;
    this.selectedIncidentTime=selectedIncidentTime;
    this.operation=operation;
    this.checkupTemplate=checkupTemplate;
    this.incidentTemplate=incidentTemplate;
    this.prescription=prescription;
    this.medicalRecord=medicalRecord;
    this.selectedStudent=selectedStudent;
    this.viewCtrl=viewCtrl;
    this.incidentQuestions=incidentQuestions;
    this.incidentAnswer=incidentAnswer;
    this.checkupQuestions=checkupQuestions;

    this.LoadView = this.loadCtrl.create({
      content: '',
      cssClass:"loadingWithoutBackground"
    });
    this.LoadView.present();

    this.sendCheckup(null);
  }

  sendIncident(calledFrom) {

    /////templates
    this.incidentAnswersList = [];
    this.checkupAnswersList = [];

    this.getIncidentAnswersObject();
    let incidentAnswersList = this.incidentAnswersList;


    this.setIncidentTemplateAnswers();
    let incidentfinalTemplate = this.finalIncidentTemplateAnswers;


    if (this.finalIncidentTemplateAnswers) {
      for (let i = 0; i < this.finalIncidentTemplateAnswers.length; i++) {
        let obj1 = this.incidentAnswersList[i];
        let obj2 = this.finalIncidentTemplateAnswers[i];
        obj2.incidentId = obj1.incidentId;
      }

    }


    if (this.checkup.title.length > 1) {
      if (this.checkupAnswer) {
        this.getCheckupAnswersObject();
        let checkupAnswersList = this.checkupAnswersList;
        //
        this.setCheckupTemplateAnswers();
        let finalcheckupTemplate = this.finalCheckupTemplateAnswers;

        if (this.finalCheckupTemplateAnswers) {
          for (let i = 0; i < this.finalCheckupTemplateAnswers.length; i++) {
            let obj1 = this.checkupAnswersList[i];
            let obj2 = this.finalCheckupTemplateAnswers[i];

            obj2.checkupId = obj1.checkupId;
          }
        }
      }
    }

    //

    this.incident.incidentDate = this.incidentSelectedDate + " " + this.selectedIncidentTime.time;
    if (this.checkup.title.length > 1) {
      this.checkup.checkupDate = this.checkup.checkupDate;
      if (this.operation == 'new')
        this.checkup.checkupTemplate = this.checkupTemplate.id;
    }

    this.incident.incidentTemplate = this.incidentTemplate.id;

    if (this.prescription)
      if (this.prescription.medications.length < 1)
        this.prescription = null;

    let attachmentList = [];
    // if ($rootScope.allFilesResponse.length > 0) {
    //   for (let counterInsideNgFlowFiles = 0; counterInsideNgFlowFiles < $rootScope.allFilesResponse.length; counterInsideNgFlowFiles++) {
    //     if ($rootScope.allFilesResponse[counterInsideNgFlowFiles].url) {
    //       fileType = functionsService.checkFileType($rootScope.allFilesResponse[counterInsideNgFlowFiles].name);
    //       attachment = {
    //         "type": fileType,
    //         "name": $rootScope.allFilesResponse[counterInsideNgFlowFiles].name,
    //         "url": $rootScope.allFilesResponse[counterInsideNgFlowFiles].url,
    //         "uploadDate": $rootScope.allFilesResponse[counterInsideNgFlowFiles].date
    //       };
    //       attachmentList.push(attachment);
    //     }
    //   }
    //   console.log("I am sending Notification !!");
    //   console.log(attachmentList);
    // }
    this.medicalRecord.student = {id: this.selectedStudent.studentId};
    this.medicalRecord.incident = this.incident;
    this.medicalRecord.incident = {
      "id": this.incident.id,
      "title": this.incident.title,
      "incidentDate": this.incident.incidentDate,
      "incidentTemplate": this.incident.incidentTemplate,
      "attachmentsList": attachmentList,
      "followUpPhone": this.incident.followUpPhone
    };
    if (this.checkup.title.length > 1) {
      this.medicalRecord.checkup = this.checkup;
    }
    if (this.checkup.title.length > 1) {
      this.medicalRecord.checkup = {
        "id": this.checkup.id,
        "title": this.checkup.title,
        "checkupDate": this.checkup.checkupDate,
        "checkupTemplate": this.checkup.checkupTemplate
      };
    }
    this.medicalRecord.prescription = this.prescription;


    let medicalRecords = [];
    medicalRecords.push(this.medicalRecord);

    let medicalRecordObject = {
      "medicalRecord": this.medicalRecord,
      "incidentAnswers": this.finalIncidentTemplateAnswers,
      "checkupAnswers": this.finalCheckupTemplateAnswers
    };

    console.log(medicalRecordObject);

    if (true) {
      // this.isSending = true;
      if (this.operation == 'edit') {
        // this.addnewIncidentButton = "Updating....";

        this.medicalService.updateMedicalRecord(medicalRecordObject, 'incident').subscribe(
          response => {
            // this.allFilesResponse = [];
            let result = response;
            // messageService.message("success", messageService.messageSubject.successUpdateIncident);
            this.presentToast('Incident was updated successfully.');
            this.LoadView.dismiss();
            this.viewCtrl.dismiss();

          }, reason => {
            this.LoadView.dismiss();
            this.presentToast('Something went wrong, can\'t update incident report');
            console.error('Medical Care : Error Updating Incident From Server' + reason);
            // $modalInstance.close('incident');

          });
      } else if (this.operation == 'new') {
        // $scope.addnewIncidentButton = "Sending....";

        this.medicalService.postMedicalRecord(medicalRecordObject).subscribe(
          response => {
            // $rootScope.allFilesResponse = [];
            let result = response;
            this.LoadView.dismiss();
            if (!this.accountServ.getUserRole().medicalRecordCanApprove && !this.accountServ.getUserRole().medicalRecordApproved) {
              this.presentToast('Incident is waiting Approval.');
            } else {
              this.presentToast('Incident was sent successfully.');
            }
            this.viewCtrl.dismiss();
          }, function (reason) {
            this.LoadView.dismiss();
            this.presentToast('Something went wrong, can\'t send incident report.');
            console.error('Medical Care : Error Addin Incident From Server' + reason);
          });

      }

    }

  }


  sendCheckup(calledFrom){
    this.getCheckupAnswersObject();
    let checkupAnswersList = this.checkupAnswersList;

    this.setCheckupTemplateAnswers();

    let fincaltemplateAnswers = this.finalCheckupTemplateAnswers;

    if(this.finalCheckupTemplateAnswers) {
      for (let i = 0; i < this.finalCheckupTemplateAnswers.length; i++) {
        let obj1 = this.checkupAnswersList[i];
        let obj2 = this.finalCheckupTemplateAnswers[i];

        obj2.checkupId = obj1.checkupId;
      }
    }


    // this.checkup.checkupDate = this.incidentSelectedDate + " " + this.selectedIncidentTime.time;;
    let checkup = this.checkup;
    this.checkup.checkupTemplate = this.checkupTemplate.id;

    // var prescription = {"medications": $scope.prescription};

    if(this.prescription)
      if(this.prescription.medications.length<1)
        this.prescription = null;

    let medicalRecords = [];
    medicalRecords.push(this.medicalRecord);

    if (true) {
      // $scope.isSending = true;
      if (this.operation == 'new' || this.checkup.requestCheckup) {

        this.medicalRecord.incident=null;

        this.medicalRecord.student={id:this.selectedStudent.studentId};
        if(this.incident.title.length > 1) {
          this.medicalRecord.incident = this.incident;
        }

        this.medicalRecord.checkup=this.checkup;
        if(this.checkup)
          this.medicalRecord.checkup={
            "id":this.checkup.id,
            "title":this.checkup.title,
            "checkupDate":this.checkup.checkupDate,
            "checkupTemplate":this.checkup.checkupTemplate,
            "requestCheckup":this.checkup.requestCheckup
          };
        this.medicalRecord.prescription=this.prescription;


        medicalRecords = [];
        medicalRecords.push(this.medicalRecord);

        let medicalRecordObject = {
          "medicalRecord":this.medicalRecord,
          "checkupAnswers":this.finalCheckupTemplateAnswers
        };




        // $scope.addnewCheckupButton = "Sending....";
        this.medicalService.postMedicalRecord(medicalRecordObject).subscribe(
          response=> {
            this.LoadView.dismiss();
            let result = response;
          if(!this.accountServ.getUserRole().medicalRecordCanApprove &&  !this.accountServ.getUserRole().medicalRecordApproved){
            this.presentToast("Checkup is waiting Approval.");
          }else {
            this.presentToast("Checkup was sent successfully.");
          }
          this.viewCtrl.dismiss();

        }, function (reason) {
            this.LoadView.dismiss();
            this.presentToast("Failed to send checkup.");
          console.error('Medical Care : Error Add Checkup From Server' + reason);
        });
      }
      else if (this.operation == 'edit') {

        this.medicalRecord.student=this.selectedStudent;

        if(this.medicalRecord.incident){
          this.incident = this.medicalRecord.incident ;
          this.medicalRecord.incident={
            "id":this.incident.id,
            "title":this.incident.title,
            "incidentDate":this.incident.incidentDate,
            "incidentTemplate":this.incident.incidentTemplate
          };
        }

        this.medicalRecord.checkup=this.checkup;
        if(this.checkup)
          this.medicalRecord.checkup={
            "id":this.checkup.id,
            "title":this.checkup.title,
            "checkupDate":this.checkup.checkupDate,
            "checkupTemplate":this.checkup.checkupTemplate
          };
        this.medicalRecord.prescription=this.prescription;


        medicalRecords = [];
        medicalRecords.push(this.medicalRecord);

        let medicalRecordObject = {
          "medicalRecord":this.medicalRecord,
          "checkupAnswers":this.finalCheckupTemplateAnswers
        };





        // $scope.addnewCheckupButton = "Updating....";

        this.medicalService.updateMedicalRecord(medicalRecordObject, 'checkup').subscribe(
          response=> {
            this.LoadView.dismiss();
          let result = response;
            this.presentToast("Checkup was updated successfully.");
          this.viewCtrl.dismiss();
        }, function (reason) {
            this.LoadView.dismiss();
            this.presentToast("Failed to update checkup.");
          console.error('Medical Care : Error Update Checkup From Server' + reason);
        });
      }
    }
  }



  getIncidentAnswersObject() {
    this.incidentAnswersList = [];

    for (let i = 0; i < this.incidentQuestions[0].length; i++) {
      let questionsId = this.incidentQuestions[0][i].id;
      let questionNumber = this.incidentQuestions[0][i].questionNumber;

      let answer = this.incidentAnswer[0].incidentAnswersObjectsList[questionNumber].answer;
      let answerObject;
      if (this.operation == 'new') {
        answerObject = {
          "answer": answer,
          "questionId": questionsId,
          "incidentId": ''
        };
      } else {
        answerObject = {
          "answer": answer,
          "questionId": questionsId,
          "incidentId": this.incidentTemplate.id
        };
      }


      this.incidentAnswersList.push(answerObject);

    }
  }


  setIncidentTemplateAnswers() {
    let newReport = {
      "reportAnswersObjectsList": []
    };

    for (let i = 0; i < this.incidentQuestions[0].length; i++) {
      newReport.reportAnswersObjectsList[i] = {
        "answer": "",
        "questionId": this.incidentQuestions[0][i].id,
        "incidentId": ''
      };

      let question = this.incidentQuestions[0][i];
      question.questionNumber = i;
      let value = this.getViewAnswers(question.questionNumber, 'incident');

      switch (question.questionType.title) {
        case 'TEXT_QUESTION':
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
        case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], value);
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
        case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
        case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
          let selecteditems = this.checkboxFunctionService.convert_CheckListObject_To_DailyReportAnswer(value, question.parametersList);
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], selecteditems);
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
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          break;

        case 'MULTI_SHORT_TEXT_MULTISELECT_VIEW_SELECTED':
          selecteditems = this.checkboxFunctionService.convert_CheckListObject_To_DailyReportAnswer(value, question.parametersList);
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], selecteditems);
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION':
          answer = "";
          if (value[1] == undefined) {
            answer = value[0] + "$$" + "";
          } else {
            answer = value[0] + "$$" + value[1];
          }
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION':
          answer = "";
          if (value[0] == true) {
            answer = question.parametersList[0].value;
          } else {
            answer = value[1];
          }
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT':
          answer = "";

          if (value[1] == undefined || value[1] == null || value[1] == "") {
            answer = value[0];
          } else {
            answer = value[0] + "$$" + value[1];
          }
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);

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

            } else if (question.parametersList[j].key == "OPTION_ANSWER") {

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
                  idAnswer += question.parametersList[a].id;
                } else {
                  let n = value[question.parametersList[a].id];

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

          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer + "||" + idAnswer);
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
            } else if (question.parametersList[j].key == "OPTION_ANSWER") {
              if (firstTimeFullArray) {
                answerValueArray[counter] = {};
                answerValueArray[counter].key = question.parametersList[j].key;
                counter++;
                firstTimeFullArray = false;
              } else {

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

          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          break;
        case 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED':
        case 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED':
          counter = 0;
          answerValueArray = [];
          firstTimeFullAnswer = true;
          counter = 0;
          firstTimeFullArray = true;
          answer = "";
          let defaultAnswerForMulti = null;

          for (let j = 0; j < question.parametersList.length; j++) {

            if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

            } else if (question.parametersList[j].key == "OPTION_HELPER_TEXT") {
              answerValueArray[counter] = {};
              answerValueArray[counter].key = question.parametersList[j].key;
              counter++;
              firstTimeFullArray = true;
            } else if (question.parametersList[j].key == "OPTION_ANSWER") {
              if (firstTimeFullArray) {
                answerValueArray[counter] = {};
                answerValueArray[counter].key = question.parametersList[j].key;
                counter++;
                firstTimeFullArray = false;
              } else {

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
              if (question.reportQuestionType.title == "SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED") {

                if (value[a] == "") {
                  value[a] = question.parametersList[1].value;
                  answer += "&&" + value[a] + "$$";

                } else {
                  answer += "&&" + value[a] + "$$";
                }

                firstTimeFullAnswer = true;

              } else if (question.reportQuestionType.title == "MULTI_SHORT_TEXT_ONE_VIEW_SELECTED") {
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

          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
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
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          break;
        case 'IMAGES_WITH_DESCRIPTION':
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], JSON.stringify(value));
          break;
      }
    }


    this.finalIncidentTemplateAnswers = newReport.reportAnswersObjectsList;

  }

  getCheckupAnswersObject() {
    this.checkupAnswersList = [];

    for (let i = 0; i < this.checkupQuestions.length; i++) {
      let questionsId = this.checkupQuestions[i].id;
      let questionNumber = this.checkupQuestions[i].questionNumber;

      let answer = this.checkupAnswer.checkupAnswersObjectsList[questionNumber].answer;

      let answerObject;
      if (this.operation == 'new') {
        answerObject = {
          "answer": answer,
          "questionId": questionsId,
          "checkupId": ''
        };
      } else {
        answerObject = {
          "answer": answer,
          "questionId": questionsId,
          "checkupId": this.checkupTemplate.id
        };
      }

      this.checkupAnswersList.push(answerObject);

    }
  }


  setCheckupTemplateAnswers() {
    let newReport = {
      "reportAnswersObjectsList": []
    };

    for (let i = 0; i < this.checkupQuestions.length; i++) {
      newReport.reportAnswersObjectsList[i] = {
        "answer": "",
        "questionId": this.checkupQuestions[i].id,
        "checkupId": ''
      };

      let question = this.checkupQuestions[i];
      question.questionNumber = i;
      let value = this.getViewAnswer(question.questionNumber);

      switch (question.questionType.title) {
        case 'TEXT_QUESTION':
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
        case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER':
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], value);
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
        case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_MULTIPLE_ANSWER':
        case 'LONG_TEXT_MULTISELECT_VIEW_SELECTED_NONE_ANSWER':
          let selecteditems = this.checkboxFunctionService.convert_CheckListObject_To_DailyReportAnswer(value, question.parametersList);
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], selecteditems);
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
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          break;

        case 'MULTI_SHORT_TEXT_MULTISELECT_VIEW_SELECTED':
          selecteditems = this.checkboxFunctionService.convert_CheckListObject_To_DailyReportAnswer(value, question.parametersList);
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], selecteditems);
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_TEXT_QUESTION':
          answer = "";
          if (value[1] == undefined) {
            answer = value[0] + "$$" + "";
          } else {
            answer = value[0] + "$$" + value[1];
          }
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_MULTISELECT_ANSWER_WITH_TEXT_QUESTION':
          answer = "";
          if (value[0] == true) {
            answer = question.parametersList[0].value;
          } else {
            answer = value[1];
          }
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          break;
        case 'SHORT_TEXT_MULTISELECT_VIEW_SELECTED_ONE_ANSWER_WITH_EDIT':
          answer = "";

          if (value[1] == undefined || value[1] == null || value[1] == "") {
            answer = value[0];
          } else {
            answer = value[0] + "$$" + value[1];
          }
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);

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

            } else if (question.parametersList[j].key == "OPTION_ANSWER") {

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
                  idAnswer += question.parametersList[a].id;
                } else {
                  let n = value[question.parametersList[a].id];

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

          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer + "||" + idAnswer);
          break;
        case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_AR':
        case 'DROPDOWN_MENU_ONE_VIEW_SELECTED_EN':
          counter = 0;
          answerValueArray = [];
          let firstTimeFullAnswer = true;
          counter = 0;
          let firstTimeFullArray = true;
          answer = "";

          for (let j = 0; j < question.parametersList.length; j++) {

            if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

            } else if (question.parametersList[j].key == "OPTION_DROP_DOWN") {
              answerValueArray[counter] = {};
              answerValueArray[counter].key = question.parametersList[j].key;
              counter++;
              firstTimeFullArray = true;
            } else if (question.parametersList[j].key == "OPTION_ANSWER") {
              if (firstTimeFullArray) {
                answerValueArray[counter] = {};
                answerValueArray[counter].key = question.parametersList[j].key;
                counter++;
                firstTimeFullArray = false;
              } else {

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

          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          break;
        case 'SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED':
        case 'MULTI_SHORT_TEXT_ONE_VIEW_SELECTED':
          counter = 0;
          answerValueArray = [];
          firstTimeFullAnswer = true;
          counter = 0;
          firstTimeFullArray = true;
          answer = "";
          let defaultAnswerForMulti = null;

          for (let j = 0; j < question.parametersList.length; j++) {

            if (question.parametersList[j].key == "OPTION_HELPER_TITLE") {

            } else if (question.parametersList[j].key == "OPTION_HELPER_TEXT") {
              answerValueArray[counter] = {};
              answerValueArray[counter].key = question.parametersList[j].key;
              counter++;
              firstTimeFullArray = true;
            } else if (question.parametersList[j].key == "OPTION_ANSWER") {
              if (firstTimeFullArray) {
                answerValueArray[counter] = {};
                answerValueArray[counter].key = question.parametersList[j].key;
                counter++;
                firstTimeFullArray = false;
              } else {

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
              if (question.reportQuestionType.title == "SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED") {

                if (value[a] == "") {
                  value[a] = question.parametersList[1].value;
                  answer += "&&" + value[a] + "$$";

                } else {
                  answer += "&&" + value[a] + "$$";
                }

                firstTimeFullAnswer = true;

              } else if (question.reportQuestionType.title == "MULTI_SHORT_TEXT_ONE_VIEW_SELECTED") {
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

          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
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
          this.mappingAnswers(newReport.reportAnswersObjectsList[i], answer);
          break;
      }
    }


    this.finalCheckupTemplateAnswers = newReport.reportAnswersObjectsList;

  }

  mappingAnswers(checkupObject, value) {
    return checkupObject.answer = value;
  }

  getViewAnswers(questionNumber, view) {
    if (view == 'incident') {
      return this.incidentAnswer[0].incidentAnswersObjectsList[questionNumber].answer;
    } else if (view == 'checkup') {
      return this.checkupAnswer.checkupAnswersObjectsList[questionNumber].answer;
    }

  }

  getViewAnswer(questionNumber) {
    return this.checkupAnswer.checkupAnswersObjectsList[questionNumber].answer;
  }


  uploadAttach(formData,indexIncident,indexAnswer,description){
    let errorAppear:boolean;
    debugger;
    return this.notiServ.postAttachment(formData).toPromise().then(
      s=> {
        console.log('Success post => ' + JSON.stringify(s));
        let allData:any = s;

        let attach = {
          'name':allData.name,
          'type':allData.type,
          'url':allData.url,
          'uploadDate':allData.date,
          'description':description
      };
        this.incidentAnswer[indexIncident].incidentAnswersObjectsList[0].answer[indexAnswer]=attach;

      },
      e=> {
        console.log('error post => '+JSON.stringify(e));
        if(errorAppear) {
          errorAppear = false;
          this.alrtCtrl.create({
            title: 'Error',
            subTitle: 'Can\'t upload the attachment, please try later',
            buttons: ['OK']
          }).present();
        }
      }
    );
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }
}
