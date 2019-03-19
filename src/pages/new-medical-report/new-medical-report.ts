import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {
  FabContainer,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  LoadingController,
  ViewController,
  ToastController
} from 'ionic-angular';
import {MedicalCareService} from "../../services/medicalcare";
import {Class, Student} from "../../models";
import {ClassesService} from "../../services/classes";
import {StudentsService} from "../../services/students";
import {MedicalRecord} from "../../models/medical-record";
import {TransFormDate} from "../../services/transFormDate";
import {FormControl} from "@angular/forms";
import {AccountService} from "../../services/account";
import {TemplateShape} from "../../models/template_Shape";
import {CheckboxFunctionService} from "../../services/checkboxFunctionService";
import {Network} from "@ionic-native/network";
import {Postattachment} from "../../models/postattachment";
import {ImageCompressorService} from "../../services/image-compress";
import {BackgroundMedicalcareService} from "../../services/background-medicalcare";

/**
 * Generated class for the NewMedicalReportPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-medical-report',
  templateUrl: 'new-medical-report.html',
})
export class NewMedicalReportPage {

  todayDate;
  pageName;
  operation;
  addCheckup: boolean = false;
  newIncident: boolean = false;
  allStudents: any;
  showAllStudents: any;
  allclasses: any;
  classesLoading: boolean;
  studentsLoading: boolean;
  templateLoading: boolean = false;
  incidentMinDate;
  incidentMaxDate;
  checkupMinDate;
  checkupMaxDate;
  incidentShowDate;
  checkupShowDate;
  medicalRecord: MedicalRecord = new MedicalRecord();
  prescription = {'id': null, 'medicalRecords': null, 'medications': []};
  fullMedicalReport: any;
  incident;
  checkup;
  /////Templet Data INCIDENT///////
  incidentTemplate: any;
  incidentQuestions: any = [];
  incidentQuestionsFirst;
  incidentAnswer: any[] = [];
  incidentAnswersNoOfItems: any[] = [];
  incidentQuestionsEditParamTemps: any[] = [];
  @ViewChild('file') inputEl: ElementRef;
  /////Templet Data CHECKUP///////
  checkupTemplate: any;
  checkupQuestions: any;
  checkupAnswer: any;
  checkupQuestionsFirst: any;
  checkupAnswersNoOfItems: any[] = [];
  checkupQuestionsEditParamTemps: any[] = [];
  loopData;
  showAllTimes = [{'id': '', 'time': '00:00'}, {'id': '', 'time': '00:30'}, {'id': '', 'time': '01:00'}, {'id': '', 'time': '01:30'}, {'id': '', 'time': '02:00'}, {'id': '', 'time': '02:30'}, {'id': '', 'time': '03:00'}, {'id': '', 'time': '03:30'}, {'id': '', 'time': '04:00'}, {'id': '', 'time': '04:30'}, {'id': '', 'time': '05:00'}, {'id': '', 'time': '05:30'}, {'id': '', 'time': '06:00'}, {'id': '', 'time': '06:30'}, {'id': '', 'time': '07:00'}, {'id': '', 'time': '07:30'}, {'id': '', 'time': '08:00'}, {'id': '', 'time': '08:30'}, {'id': '', 'time': '09:00'}, {'id': '', 'time': '09:30'}, {'id': '', 'time': '10:00'}, {'id': '', 'time': '10:30'}, {'id': '', 'time': '11:00'}, {'id': '', 'time': '11:30'}, {'id': '', 'time': '12:00'}, {'id': '', 'time': '12:30'}, {'id': '', 'time': '13:00'}, {'id': '', 'time': '13:30'}, {'id': '', 'time': '14:00'}, {'id': '', 'time': '14:30'}, {'id': '', 'time': '15:00'}, {'id': '', 'time': '15:30'}, {'id': '', 'time': '16:00'}, {'id': '', 'time': '16:30'}, {'id': '', 'time': '17:00'}, {'id': '', 'time': '17:30'}, {'id': '', 'time': '18:00'}, {'id': '', 'time': '18:30'}, {'id': '', 'time': '19:00'}, {'id': '', 'time': '19:30'}, {'id': '', 'time': '20:00'}, {'id': '', 'time': '20:30'}, {'id': '', 'time': '21:00'}, {'id': '', 'time': '21:30'}, {'id': '', 'time': '22:00'}, {'id': '', 'time': '22:30'}, {'id': '', 'time': '23:00'}, {'id': '', 'time': '23:30'}];
  fileTypes = ["jpg", "jpeg", "png", "gif", "ico", "bmp", "webp", "tiff", "pdf", "txt", "xls", "xlsx", "doc", "docx", "ppt", "pptx", "mp4", "flv", "avi", "mov", "wmv", "mp3", "wma"];
  MULTI_SHORT_TEXT_ONE_VIEW_SELECTED_Index;
  DROPDOWN_MENU_ONE_VIEW_SELECTED_index;
  SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED_INDEX;
  ////data////////
  selectedClass;
  selectedStudent;
  incidentTitle;
  checkupTitle;
  incidentSelectedDate;
  checkupSelectedDate;
  selectedIncidentTime;
  selectedCheckupTime;
  phoneNumber: string = '';
  //////////////EDIT VIEW///////////////
  EditView = false;
  tempFullMedicalRecord;


  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
              private medicalService: MedicalCareService, private alrtCtrl: AlertController, private loadCtrl: LoadingController,
              private classServ: ClassesService, private studentServ: StudentsService, private viewCtrl: ViewController,
              private transDate: TransFormDate, private accountServ: AccountService, private checkboxFunctionService: CheckboxFunctionService,
              public network: Network,private compress:ImageCompressorService,private toastCtrl:ToastController,
              private bkgInc:BackgroundMedicalcareService) {
    this.todayDate = this.transDate.transformTheDate(new Date(), "dd-MM-yyyy");
    this.operation = navParams.get("operation");
    this.templateLoading = true;
    if (navParams.get("for")) {
      this.pageName = "New " + navParams.get("for");
      this.addCheckup = false;
      if(this.operation == "edit"){
        this.EditView = true;
        this.pageName = navParams.get("pageName");
      }
      if (navParams.get("for") == "Incident") {
        this.newIncident = true;
        this.incidentMinDate = new Date(2016, 0, 1);
        this.incidentMaxDate = new Date();
        this.incidentShowDate = new FormControl(new Date()).value;
        this.selectedIncidentTime = {'id': '', 'time': '00:00'};
        this.incidentSelectedDate = this.transDate.transformTheDate(new Date(), "dd-MM-yyyy");
        this.incidentAnswer[0] = {
          "incidentAnswersObjectsList": []
        };
        if(this.operation == "new") {
          this.getIncidentTemplate();
        }
      } else {
        this.checkupMinDate = new Date(2016, 0, 1);
        this.checkupMaxDate = new Date();
        this.checkupShowDate = new FormControl(new Date()).value;
        this.selectedCheckupTime = {'id': '', 'time': '00:00'};
        this.checkupSelectedDate = this.transDate.transformTheDate(new Date(), "dd-MM-yyyy");
        this.checkupAnswer = {
          "checkupAnswersObjectsList": []
        };
        if(this.operation == "new") {
          this.getCheckUpTemplate();
        }
      }
    } else if(navParams.get("forAdd") &&navParams.get("operation") == 'new'){
      let date = navParams.get("selectedIncidentDate");
      this.pageName = "Add " + navParams.get("forAdd");
      this.addCheckup = true;
      this.checkupMinDate = new Date(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[0]));
      this.checkupMaxDate = new Date();
      this.checkupShowDate = new FormControl(new Date()).value;
      this.selectedCheckupTime = {'id': '', 'time': '00:00'};
      this.checkupSelectedDate = this.transDate.transformTheDate(new Date(), "dd-MM-yyyy");
      this.checkupAnswer = {
        "checkupAnswersObjectsList": []
      };
      this.getCheckUpTemplate();
    }
    this.setupMedicalRecord();
    if (!this.addCheckup) {
      this.classesLoading = true;
      this.studentsLoading = true;
      this.getAllClasses();
      this.getAllStudents();
    }


    if(this.operation == "edit"){
      this.EditView = true;
      this.tempFullMedicalRecord = navParams.get("medicalRecord");
      this.setSelectedClassFromEdit(this.tempFullMedicalRecord.medicalRecord.student.classes);
      this.setSelectedStudentFromEdit(this.tempFullMedicalRecord.medicalRecord.student);
      this.medicalRecord=this.tempFullMedicalRecord.medicalRecord;
      if (navParams.get("for") == "Incident") {
        this.newIncident = true;
        this.incidentTitle = this.tempFullMedicalRecord.medicalRecord.incident.title;
        if(this.tempFullMedicalRecord.medicalRecord.incident.followUpPhone) {
          this.phoneNumber = this.tempFullMedicalRecord.medicalRecord.incident.followUpPhone.toString();
        }
        let Date_time_Array = this.tempFullMedicalRecord.medicalRecord.incident.incidentDate.split(" ");
        let DateArray = Date_time_Array[0].split("-");
        this.incidentSelectedDate =Date_time_Array[0];
        this.prescription = this.tempFullMedicalRecord.medicalRecord.prescription;
        this.incidentShowDate =new Date(parseInt(DateArray[2]),parseInt(DateArray[1])-1,parseInt(DateArray[0]));
        this.selectedIncidentTime = {'id': '', 'time': Date_time_Array[1]};
        this.incident = this.tempFullMedicalRecord.medicalRecord.incident;
        this.incident.answers = this.tempFullMedicalRecord.incidentAnswers;
        if(this.tempFullMedicalRecord.medicalRecord.checkup){
          this.checkup = this.tempFullMedicalRecord.medicalRecord.checkup;
        }
        this.setIncidentTempletFromEdit(this.tempFullMedicalRecord.incidentTemplate);
      }else{
        this.checkupTitle = this.tempFullMedicalRecord.medicalRecord.checkup.title;
        this.prescription = this.tempFullMedicalRecord.medicalRecord.prescription;
        let Date_time_Array = this.tempFullMedicalRecord.medicalRecord.checkup.checkupDate.split(" ");
        let DateArray = Date_time_Array[0].split("-");
        this.checkupSelectedDate =Date_time_Array[0];
        this.checkupShowDate =new Date(parseInt(DateArray[2]),parseInt(DateArray[1])-1,parseInt(DateArray[0]));
        this.selectedCheckupTime = {'id': '', 'time': Date_time_Array[1]};
        this.checkup = this.tempFullMedicalRecord.medicalRecord.checkup;
        this.checkup.answers = this.tempFullMedicalRecord.checkupAnswers;
        this.setCheckupTempletFromEdit(this.tempFullMedicalRecord.checkupTemplate);
      }
    }

    if(navParams.get("forAdd") && navParams.get("operation") == 'edit') {
      let date = navParams.get("selectedIncidentDate");
      this.pageName = "Add " + navParams.get("forAdd");
      this.addCheckup = true;
      this.checkupMinDate = new Date(parseInt(date[2]), parseInt(date[1])-1, parseInt(date[0]));
      this.checkupMaxDate = new Date();
      this.checkupShowDate = new FormControl(new Date()).value;
      this.selectedCheckupTime = {'id': '', 'time': '00:00'};
      this.checkupSelectedDate = this.transDate.transformTheDate(new Date(), "dd-MM-yyyy");
      this.checkupAnswer = {
        "checkupAnswersObjectsList": []
      };
      this.getCheckUpTemplate();
    }

  }

  close() {
    this.viewCtrl.dismiss();
  }

  enableDoneAllButton() {
    if (this.addCheckup) {
      if (this.checkupTitle) {
        return false;
      } else {
        return true;
      }
    } else {
      if (this.newIncident) {
        let phoneNumberFound = false;
        if(this.phoneNumber.length < 1 || this.phoneNumber.length > 7){
          phoneNumberFound = true;
        }
        if (this.incidentTitle && this.selectedStudent && this.selectedClass && phoneNumberFound) {
          return false;
        } else {
          return true;
        }
      } else {
        if (this.checkupTitle && this.selectedStudent && this.selectedClass) {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  fabSelected(index, fab: FabContainer) {
    let dateArray:any[];
    if(this.incidentSelectedDate){
      dateArray = this.incidentSelectedDate.split("-");
    }else{
      dateArray = this.checkupSelectedDate.split("-");
    }

    fab.close();
    let modal;
    if (index == 0) {
      modal = this.modalCtrl.create('NewMedicalReportMedicinePage', {Date: this.todayDate, operation: 'new'});
    } else {
      modal = this.modalCtrl.create('NewMedicalReportPage', {
        forAdd: "Checkup",
        Date: this.todayDate,
        operation: this.operation,
        selectedIncidentDate:dateArray
      });
    }
    modal.onDidDismiss(
      data => {
        console.log(data);
        if (data) {
          if (data.medication) {
            if(this.prescription) {
              this.prescription.medications.push(data.medication);
            }else{
              this.prescription = {'id': null, 'medicalRecords': null, 'medications': []};
              this.prescription.medications.push(data.medication);
            }
          } else if (data.checkup) {
            this.checkup = data.checkup;
            this.checkupAnswer = data.checkupAnswers;
            this.checkupTemplate = data.checkupTemplate;
            this.checkupQuestions = data.checkupTemplate.questionsList;
          }
        }
      });
    modal.present();
  }

  setStudents() {
    this.studentsLoading = true;
    this.showAllStudents = [];
    let tempStudents: any[] = JSON.parse(JSON.stringify(this.allStudents));
    if (this.selectedClass.classWithGrade) {
      for (let student of tempStudents) {
        if (student.searchByClassGrade == this.selectedClass.classWithGrade) {
          this.showAllStudents.push(student);
        }
      }
      this.studentsLoading = false;
    }
  }

  setupMedicalRecord() {
    this.fullMedicalReport = {'checkupAnswers': [], 'incidentAnswers': [], 'medicalRecord': null};
    this.incident = {
      'attachmentsList': [],
      'followUpPhone': "",
      'id': null,
      'details': "",
      'incidentDate': this.transDate.transformTheDate(new Date(), "dd-MM-yyyy"),
      'title': "",
      'answer': []
    };
    this.checkup = {'id': null, "title": '', "details": '', 'checkupTemplate': null, "checkupDate": this.transDate.transformTheDate(new Date(), "dd-MM-yyyy")};
  }


  allDataDone() {
    if (this.addCheckup) {
      this.checkup.title = this.checkupTitle;
      this.checkup.checkupDate = this.checkupSelectedDate + " " + this.selectedCheckupTime.time;
      this.checkup.checkupTemplate = this.checkupTemplate.id;
      this.viewCtrl.dismiss({
        checkup: this.checkup,
        checkupAnswers: this.checkupAnswer,
        checkupTemplate: this.checkupTemplate
      });
    } else {
      if (this.newIncident) {
        this.incident.followUpPhone = this.phoneNumber;
        this.incident.incidentDate = this.incidentSelectedDate + " " + this.selectedIncidentTime.time;
        this.incident.incidentTemplate = this.incidentTemplate.id;
        this.incident.title = this.incidentTitle;
        this.bkgInc.addIncident(this.checkup,this.checkupAnswer,this.incident,this.incidentSelectedDate,this.selectedIncidentTime,
          this.operation,this.checkupTemplate,this.incidentTemplate,this.prescription,this.medicalRecord,this.selectedStudent,
          this.viewCtrl,this.incidentQuestions,this.incidentAnswer,this.checkupQuestions);
      } else {
        this.checkup.title = this.checkupTitle;
        this.checkup.checkupDate = this.checkupSelectedDate + " " + this.selectedCheckupTime.time;
        this.checkup.checkupTemplate = this.checkupTemplate.id;
        this.bkgInc.addCheckup(this.checkup,this.checkupAnswer,this.incident,this.incidentSelectedDate,this.selectedIncidentTime,
          this.operation,this.checkupTemplate,this.incidentTemplate,this.prescription,this.medicalRecord,this.selectedStudent,
          this.viewCtrl,this.incidentQuestions,this.incidentAnswer,this.checkupQuestions);
        // this.medicalRecord.checkup = this.checkup;
      }
      // this.medicalRecord.student = {'id': this.selectedStudent.id};
      // this.fullMedicalReport.medicalRecord = this.medicalRecord;
      // this.fullMedicalReport.incidentAnswers = ;
      // this.fullMedicalReport.checkupAnswers = ;
      // this.viewCtrl.dismiss();
    }
  }

  setSelectedDate(from, ev) {
    if (this.newIncident) {
      this.incidentSelectedDate = this.transDate.transformTheDate(ev.value, "dd-MM-yyyy");
    } else {
      this.checkupSelectedDate = this.transDate.transformTheDate(ev.value, "dd-MM-yyyy");
    }
  }


  deleteAttach(attachIndex: any,qNumber) {
    let alert = this.alrtCtrl.create({
      title: 'Alert',
      message: 'Are you sure that you want to delete this attachment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.incidentAnswer[0].incidentAnswersObjectsList[qNumber].answer.splice(attachIndex, 1);
          }
        }
      ]
    });
    alert.present();
  }

  deleteData(from, index) {
    if (from == "Medication") {
      this.prescription.medications.splice(index, 1);
    } else if (from == "Checkup") {
      this.checkup = {'id': null, "title": '', "details": '', 'checkupTemplate': null, "checkupDate": this.transDate.transformTheDate(new Date(), "dd-MM-yyyy")};
    }
  }

////////////////////////////////////////////GET CLASSES AND STUDENTS
  getAllClasses() {
    this.classServ.getClassList("Medical Care", 2, null, null, null, null).subscribe(
      classVal => {
        let allData: any = classVal;
        this.allclasses = [];
        for (let data of allData) {
          let item = new Class();
          item.id = data.id;
          item.name = data.name;
          item.grade.id = data.grade.id;
          item.grade.name = data.grade.name;
          item.branch.id = data.branch.id;
          item.branch.name = data.branch.name;
          item.branch.managerId = data.branch.managerId;
          item.classWithGrade = data.grade.name + " - " + data.name;
          this.allclasses.push(item);
        }
        this.classesLoading = false;
      }, classErr => {
        this.classesLoading = false;
        this.alrtCtrl.create({
          title: 'Error',
          subTitle: 'Something went wrong, please refresh the page',
          buttons: ['OK']
        }).present();
      });
  }

  getAllStudents() {
    this.studentServ.getAllStudents(7, "Medical Care").subscribe(
      studentVal => {
        let data: any = studentVal;
        this.allStudents = [];
        for (let value of data) {
          let students = new Student();

          students.classes.id = value.classes.id;
          students.classes.name = value.classes.name;
          students.classes.grade.id = value.classes.grade.id;
          students.classes.grade.name = value.classes.grade.name;
          students.classes.branch.id = value.classes.branch.id;
          students.classes.branch.name = value.classes.branch.name;
          students.classes.branch.managerId = value.classes.branch.managerId;
          students.id = value.id;
          students.name = value.name;
          students.address = value.address;
          students.searchByClassGrade = value.classes.grade.name + " - " + value.classes.name;

          this.allStudents.push(students);
        }
        this.studentsLoading = false;
      }, studentErr => {
        this.studentsLoading = false;
        this.alrtCtrl.create({
          title: 'Error',
          subTitle: 'Something went wrong, please refresh the page',
          buttons: ['OK']
        }).present();
      });
  }


  ////////////////////////////////////////////////////////////////////////Get The Template Data
  getIncidentTemplate() {
    this.medicalService.getIncidentTemplate().subscribe(
      val => {
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

        this.medicalService.getCheckupTemplate().subscribe();
      }, err => {

        this.templateLoading = false;

        this.alrtCtrl.create({
          title: 'Error',
          subTitle: 'Something went wrong, can\'t load incident template',
          buttons: ['OK']
        }).present();
      });
  }

  getCheckUpTemplate() {
    this.medicalService.getCheckupTemplate().subscribe(
      val => {
        this.templateLoading = false;
        this.checkupTemplate = val;
        if (this.addCheckup) {
          this.checkupQuestions = [];
          this.checkupQuestions[0] = this.checkupTemplate.questionsList;
        } else {
          this.checkupQuestions = this.checkupTemplate.questionsList;
        }

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
        if (this.addCheckup) {
          this.checkupQuestions[0] = this.checkupQuestionsFirst;
        } else {
          this.checkupQuestions = this.checkupQuestionsFirst;
        }

        if (this.addCheckup) {
          for (let i = 0; i < this.checkupQuestions[0].length; i++) {

            this.mappingDefaultAnswers(this.checkupAnswer.checkupAnswersObjectsList[i], this.checkupQuestions[0][i]);

            this.checkupQuestionsEditParamTemps[i] = {};
            this.checkupQuestionsEditParamTemps[i].parameters = [];

            for (let j = 0; j < this.checkupQuestions[0][i].parametersList.length; j++) {
              let param = {
                "id": '',
                "key": '',
                "value": ''
              };
              this.checkupQuestionsEditParamTemps[i].parameters[j] = param;
              this.checkupQuestionsEditParamTemps[i].parameters[j].key = this.checkupQuestions[0][i].parametersList[j].key;
            }

          }

        } else {
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

        }


        if (this.addCheckup) {
          this.loopData = this.checkupQuestions[0];
        } else {
          this.loopData = this.checkupQuestions;
        }


      }, err => {
        this.templateLoading = false;
        this.alrtCtrl.create({
          title: 'Error',
          subTitle: 'Something went wrong, can\'t load checkup template',
          buttons: ['OK']
        }).present();
      });
  }

  ///////////////////////////TEMPLET MEATHODS/////////////////////////////

  mappingDefaultAnswers(defaultcheckupAnswer, question) {
    return defaultcheckupAnswer.answer = this.getDefaultValue(question);
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

  //////////////////////////////// VIEW ORGANIZE ///////////////////////////////////

  openDataMULTI_SHORT_TEXT_ONE_VIEW_SELECTED(i) {
    this.MULTI_SHORT_TEXT_ONE_VIEW_SELECTED_Index = i;
  }

  openDataDROPDOWN_MENU_ONE_VIEW_SELECTED(i) {
    this.DROPDOWN_MENU_ONE_VIEW_SELECTED_index = i;
  }

  openDataSINGLE_SHORT_TEXT_ONE_VIEW_SELECTED(i) {
    this.SINGLE_SHORT_TEXT_ONE_VIEW_SELECTED_INDEX = i;
  }

  setImageOrLable(question,pramName){
    return 'Label';
  }
  checkIfChangesAnswer = false;

  dataChanges() {
    this.checkIfChangesAnswer = true;
  }

  ///////////////////////////////
  loading;
  showSupportFiles:boolean;
  async filesChange(qNumber,QID) {
    let inputEl: HTMLInputElement = this.inputEl.nativeElement;
    let fileCount: number = inputEl.files.length;
    let faildFilesNamesSize: any[] = [];
    let faildFilesNameseExtantion: any[] = [];
    if (fileCount > 0) { // a file was selected
      for (let i = 0; i < fileCount; i++) {
        let num: number = inputEl.files.item(i).size;
        let fileName = inputEl.files.item(i).name;
        let fileExtintion: string = fileName.slice(fileName.length - 4);
        fileExtintion = fileExtintion.replace('.', '');
        if (num <= 26214400 && this.fileTypes.find(x => x == fileExtintion)) {
          let formData = new FormData();
          // debugger;
          let file: File=inputEl.files.item(i);
          let fileType = this.getFileType(inputEl.files.item(i).name);
          if (fileType == "IMAGE") {
            this.compress.compressImage(inputEl.files.item(i)).subscribe(
              result=>{
                // debugger;
                file = result;
                formData.append('file', result,result.name);
                console.log(JSON.stringify(formData));
                this.organizeData(inputEl,i,formData,result,fileType,fileName,qNumber,QID);
              },error => {
                console.log('😢 Oh no!', error);
              });

          }else{
            file = inputEl.files.item(i);
            formData.append('file', file);
            console.log(JSON.stringify(formData));
            this.organizeData(inputEl,i,formData,inputEl.files.item(i),fileType,fileName,qNumber,QID);
          }



        } else if (num > 26214400) {
          faildFilesNamesSize.push(inputEl.files.item(i).name);
        } else {
          faildFilesNameseExtantion.push(inputEl.files.item(i).name);
        }
      }
    }
    if (faildFilesNamesSize.length > 0 && faildFilesNameseExtantion.length <= 0) {
      alert('Can\'t upload files name: ' + faildFilesNamesSize.join(',') + ' because it is bigger than 25 Mb');
    } else if (faildFilesNamesSize.length <= 0 && faildFilesNameseExtantion.length > 0) {
      this.showSupportFiles = true;
      alert('Can\'t upload files name: ' + faildFilesNameseExtantion.join(',') + ' because it is not supported');
    } else if (faildFilesNamesSize.length > 0 && faildFilesNameseExtantion.length > 0) {
      this.showSupportFiles = true;
      alert('Can\'t upload files name: ' + faildFilesNamesSize.join(',') + ' because it is bigger than 25 Mb and' +
        ' files name: ' + faildFilesNameseExtantion.join(',') + ' because it is not supported.');
    }
  }

  organizeData(inputEl,i,formData,file,fileType,fileName,qNumber,QID){
    // this.uploadAttach(formData);

    if (fileType == "IMAGE") {

      this.readFile(file,qNumber,QID);
    } else {
      let attach = new Postattachment();
      attach.name = fileName;
      attach.type = fileType;
      attach.file = inputEl.files.item(i);
      attach.data = file;
      attach.questionId = QID;

      this.incidentAnswer[0].incidentAnswersObjectsList[qNumber].answer.push(attach);
    }
  }


  getFileType(fileName) {
    let pos = fileName.lastIndexOf('.');
    let extension = fileName.substring(pos + 1);

    switch (extension.toLowerCase()) {
      case "jpg":
        return "IMAGE";
      case "jpeg":
        return "IMAGE";
      case "png":
        return "IMAGE";
      case "gif":
        return "IMAGE";
      case "ico":
        return "IMAGE";
      case "bmp":
        return "IMAGE";
      case "webp":
        return "IMAGE";
      case "tiff":
        return "IMAGE";

      case "pdf":
        return "PDF";

      case "txt":
        return "TXT";

      case "xls":
        return "EXCEL";
      case "xlsx":
        return "EXCEL";
      case "doc":
      case "docx":
        return "WORD";
      case "ppt":
      case "pptx":
        return "POWERPOINT";
      case "mp4":
        return "VIDEO";
      case "flv":
        return "VIDEO";
      case "avi":
        return "VIDEO";
      case "mov":
        return "VIDEO";
      case "wmv":
        return "VIDEO";
      case "mp3":
        return "AUDIO";
      case "wma":
        return "AUDIO";
      default:
        return "OTHER";
    }
  }

  readFile(file: File,qNumber,QID){
    let that = this;
    let reader = new FileReader();
    reader.onloadend = function(e){
      // you can perform an action with readed data here
      console.log(reader.result);
      let attach = new Postattachment();
      attach.name = file.name;
      attach.type = "IMAGE";
      attach.url = reader.result;
      attach.file = file;
      attach.questionId = QID;
      that.incidentAnswer[0].incidentAnswersObjectsList[qNumber].answer.push(attach);
    };
    reader.readAsDataURL(file);
  }



  setSelectedClassFromEdit(data){
    let item = new Class();
    item.id = data.id;
    item.name = data.name;
    item.grade.id = data.grade.id;
    item.grade.name = data.grade.name;
    item.branch.id = data.branch.id;
    item.branch.name = data.branch.name;
    item.branch.managerId = data.branch.managerId;
    item.classWithGrade = data.grade.name + " - " + data.name;
    this.selectedClass = item;
  }

  setSelectedStudentFromEdit(value){
    let students = new Student();
    students.classes.id = value.classes.id;
    students.classes.name = value.classes.name;
    students.classes.grade.id = value.classes.grade.id;
    students.classes.grade.name = value.classes.grade.name;
    students.classes.branch.id = value.classes.branch.id;
    students.classes.branch.name = value.classes.branch.name;
    students.classes.branch.managerId = value.classes.branch.managerId;
    students.id = value.id;
    students.name = value.name;
    students.address = value.address;
    students.searchByClassGrade = value.classes.grade.name + " - " + value.classes.name;
    this.selectedStudent = students;
  }
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
    if (this.addCheckup) {
      this.checkupQuestions = [];
      this.checkupQuestions[0] = this.checkupTemplate.questionsList;
    } else {
      this.checkupQuestions = this.checkupTemplate.questionsList;
    }

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
    if (this.addCheckup) {
      this.checkupQuestions[0] = this.checkupQuestionsFirst;
    } else {
      this.checkupQuestions = this.checkupQuestionsFirst;
    }

    if (this.addCheckup) {
      for (let i = 0; i < this.checkupQuestions[0].length; i++) {

        this.mappingDefaultAnswers(this.checkupAnswer.checkupAnswersObjectsList[i], this.checkupQuestions[0][i]);

        this.checkupQuestionsEditParamTemps[i] = {};
        this.checkupQuestionsEditParamTemps[i].parameters = [];

        for (let j = 0; j < this.checkupQuestions[0][i].parametersList.length; j++) {
          let param = {
            "id": '',
            "key": '',
            "value": ''
          };
          this.checkupQuestionsEditParamTemps[i].parameters[j] = param;
          this.checkupQuestionsEditParamTemps[i].parameters[j].key = this.checkupQuestions[0][i].parametersList[j].key;
        }

      }

    } else {
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

    }


    if (this.addCheckup) {
      this.loopData = this.checkupQuestions[0];
    } else {
      this.loopData = this.checkupQuestions;
    }
  }

}
