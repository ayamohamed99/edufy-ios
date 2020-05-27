import { Component, OnInit } from '@angular/core';
import {NgSelectConfig} from '@ng-select/ng-select';
import {AlertController, ModalController, Platform} from '@ionic/angular';
import {ClassesService} from '../../services/Classes/classes.service';
import {StudentsService} from '../../services/Students/students.service';
import {Storage} from "@ionic/storage";
import {TransFormDateService} from '../../services/TransFormDate/trans-form-date.service';
import {PassDataService} from '../../services/pass-data.service';

@Component({
  selector: 'app-filter-view',
  templateUrl: './filter-view.page.html',
  styleUrls: ['./filter-view.page.scss'],
})
export class FilterViewPage implements OnInit {

  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  search;
  pageName;
  doneButton;
  classesLoading = true;
  studentsLoading = true;
  allStudents:any[]=[];
  showAllStudents:any[]=[];
  allclasses:any[]=[];
  selectedStudent;
  selectedClass;
  fromMinDate;
  fromMaxDate;
  fromSelectedDate;
  toMinDate;
  toMaxDate;
  toSelectedDate;
  fromAnyDate =true;
  toAnyDate = true;

  constructor(private config: NgSelectConfig, public platform:Platform,private alrtCtrl: AlertController,
              private classServ:ClassesService,private studentServ:StudentsService,private storage:Storage,private transDate:TransFormDateService,
              private viewCtrl:ModalController, public passData:PassDataService) {
    this.config.notFoundText = 'Custom not found';
    this.search = JSON.parse(passData.dataToPass.theFilter);
    if(passData.dataToPass.pageName){
      this.pageName=passData.dataToPass.pageName;
    }else{
      this.pageName = 'Search';
    }

    if(passData.dataToPass.doneButton){
      this.doneButton=passData.dataToPass.doneButton;
    }else{
      this.doneButton = 'Apply';
    }
    this.search.object.classes.classWithGrade = "All Classes";


    let studentsData = passData.dataToPass.students;
    let classesData = passData.dataToPass.classes;

    this.setAllClasses(classesData);
    this.setAllStudent(studentsData);

    this.fromMinDate = new Date(2016,0,1);
    this.toMinDate = new Date(2016,0,1);
    this.fromMaxDate = new Date();
    this.toMaxDate = new Date();
    this.search.object.date.from = null;
    this.search.object.date.to = null;
    this.search.object.to = null;
  }

  setStudents() {
    this.studentsLoading = true;
    this.showAllStudents = [];
    let defaultStudent = {
      'id':0,
      'name':'All Students'
    };
    this.selectedStudent = defaultStudent;
    if (this.search.object.classes.id != 0) {
      let tempStudents: any[] = JSON.parse(JSON.stringify(this.allStudents));
      if (this.search.object.classes.classWithGrade) {
        for (let student of tempStudents) {
          if (student.searchByClassGrade == this.search.object.classes.classWithGrade) {
            this.showAllStudents.push(student);
          }
        }
        this.studentsLoading = false;
      }
    }else{
      let tempStudents: any[] = JSON.parse(JSON.stringify(this.allStudents));
      this.showAllStudents = tempStudents;
      this.studentsLoading = false;
    }
  }

  addSelectedDate(picker,event){
    if(picker == "From"){
      let dateArry:any[] = this.transDate.transformTheDate(event.value,"MM/dd/yyyy").split("/");
      this.toMinDate = new Date(parseInt(dateArry[2]),parseInt(dateArry[0])-1,parseInt(dateArry[1]));
      this.fromSelectedDate = this.transDate.transformTheDate(event.value,"dd-MM-yyyy") +" "+ this.transDate.transformTheDate(new Date(),"HH:mm");
      this.search.object.date.from = event.value;
    } else if(picker == "To") {
      this.search.object.date.to = event.value;
      this.search.object.to = event.value;
      this.toSelectedDate = this.transDate.transformTheDate(event.value, "dd-MM-yyyy") +" "+ this.transDate.transformTheDate(new Date(),"HH:mm");
    }
  }

  close(from){
    if(from=='done'){
      this.viewCtrl.dismiss({search:this.search});
    }else{
      this.viewCtrl.dismiss();
    }
  }


  setAllClasses(allData){
    for (let data of allData) {
      data.classWithGrade = data.grade.name + " - " + data.name;
      this.allclasses.push(data);
    }
    this.classesLoading = false;
  }


  setAllStudent(allData){
    for (let value of allData) {
      value.searchByClassGrade = value.classes.grade.name + " - " + value.classes.name;

      this.allStudents.push(value);
      this.showAllStudents.push(value);
    }
    this.studentsLoading = false;
  }

  defaultDate(from){
    if(from =='from' && this.fromAnyDate){
      this.search.object.date.from = null;
    }
    if(from == 'to' && this.toAnyDate){
      this.search.object.date.to = null;
      this.search.object.to = null;
    }
  }


  ngOnInit() {
  }

}
