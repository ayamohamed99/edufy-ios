import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavController, NavParams, Platform,AlertController,ViewController } from 'ionic-angular';
import {ClassesService} from "../../services/classes";
import {StudentsService} from "../../services/students";
import {Storage} from "@ionic/storage";
import {Class, Student} from "../../models";
import {TransFormDate} from "../../services/transFormDate";
import {FormControl} from "@angular/forms";

@IonicPage()
@Component({
  selector: 'page-filter-view',
  templateUrl: 'filter-view.html',
})
export class FilterViewPage {

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

  constructor(public navCtrl: NavController, public navParams: NavParams,public platform:Platform,private alrtCtrl: AlertController,
              private classServ:ClassesService,private studentServ:StudentsService,private storage:Storage,private transDate:TransFormDate,
              private viewCtrl:ViewController) {
    this.search = JSON.parse(navParams.get('theFilter'));
    if(navParams.get('pageName')){
      this.pageName=navParams.get('pageName')
    }else{
      this.pageName = 'Search';
    }

    if(navParams.get('doneButton')){
      this.doneButton=navParams.get('doneButton')
    }else{
      this.doneButton = 'Apply';
    }
    this.search.object.classes.classWithGrade = "All Classes";


    let studentsData = navParams.get('students');
    let classesData = navParams.get('classes');

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



}
