import {Component, ViewChild} from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams, Platform} from 'ionic-angular';
import {StudentsService} from "../../services/students";
import {Storage} from "@ionic/storage";
import {Student} from "../../models";
import {ChatDialoguePage} from "../chat-dialogue/chat-dialogue";

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {
  @ViewChild('LastOpenedContainer') private LastOpenedContainer: any;
  allStudents:any = [];
  lastStudents:any = [];
  MAIN_STUDENTS_ARRAY:any[] = [];
  loading = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public studentServ:StudentsService,
              public platform:Platform,private storage:Storage,public alrt:AlertController, public modalCtrl:ModalController) {
    if (platform.is('core')) {
      studentServ.putHeader(localStorage.getItem('LOCAL_STORAGE_TOKEN'));
      this.getChatStudent();
    }else{
      storage.get('LOCAL_STORAGE_TOKEN').then(
        val => {
          studentServ.putHeader(val);
          this.getChatStudent();
        });
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  onSearchInput(event){
    // set val to the value of the searchbar
    const val = event.target.value;
    console.log('Search'+val);

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.allStudents = [];
      for(let j=0; j<this.MAIN_STUDENTS_ARRAY.length; j++){
        let studentName = this.MAIN_STUDENTS_ARRAY[j].studentName.toLowerCase();
        let studentClassGrade = this.MAIN_STUDENTS_ARRAY[j].searchByClassGrade.toLowerCase();
        let searchValue = val.toLowerCase();
        if(studentName.indexOf(searchValue) > -1
        || studentClassGrade.indexOf(searchValue) > -1){
          this.allStudents.push(this.MAIN_STUDENTS_ARRAY[j]);
        }
      }
    }else{
      this.allStudents = [];
      this.allStudents = this.MAIN_STUDENTS_ARRAY.map(value => {
        return {... value};
      });
    }
  }

  onSearchCancel(event){
    const val = event.target.value;
    console.log('Search'+val);
    this.allStudents = this.MAIN_STUDENTS_ARRAY.map(value => {
      return {... value};
    });
  }


  getChatStudent(){
    this.loading = true;
    this.studentServ.getAllStudents(7,null).subscribe(
      value => {
        this.loading = false;
        console.log(value);
        let Data:any = value;
        for(let student of Data){
          let Stud = new Student();
          Stud.studentId = student.id;
          Stud.studentName = student.name;
          Stud.studentAddress = student.address;
          Stud.studentClass = student.classes;
          Stud.studentImageUrl = student.profileImg;
          Stud.searchByClassGrade = student.classes.grade.name+" "+student.classes.name;
          this.allStudents.push(Stud);
          this.MAIN_STUDENTS_ARRAY.push(Stud);
        }
      },error2 => {
        this.loading = false;
        this.alrt.create({
          subTitle: 'An Error happen when try to get your students!',
          buttons: [
          {
            text: 'Retry',
            handler: () => {
              this.getChatStudent();
            }
          },{
            text: 'Cancel',
            role:'cancel'
          }]}).present();
        console.log(error2);

      });
  }

  getFristName(Name){
    let FIRST_NAME:string
      let arrayName = Name.split(' ');
    FIRST_NAME = arrayName[0];
    return FIRST_NAME;
  }

  openDialog(student,index,From){
    let modal = this.modalCtrl.create('ChatDialoguePage',
      {studentData:student});
    modal.onDidDismiss(data=>{
      this.viewListsEffect(student,index,From);
    });
    modal.present();
  }

  viewListsEffect(student,index,From){
    if(!this.lastStudents.some( value =>value.studentId == student.studentId)
      && index == -1 && From == 'All'){
      this.lastStudents.splice(0, 0,student);
    }else if(index > -1 && From == 'Last'){
      try {
        this.LastOpenedContainer.nativeElement.scrollLeft = 0;
      } catch (err) {
      }
      this.lastStudents.splice(index, 1);
      this.lastStudents.splice(0, 0,student);
    }
  }

}
