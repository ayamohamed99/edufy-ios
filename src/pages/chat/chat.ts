import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {StudentsService} from "../../services/students";
import {Storage} from "@ionic/storage";
import {Student} from "../../models";

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  allStudents:any = [];
  lastStudents:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public studentServ:StudentsService,
              public platform:Platform,private storage:Storage) {

    if (platform.is('core')) {
      studentServ.putHeader(localStorage.getItem('LOCAL_STORAGE_TOKEN'));
    }else{
      storage.get('LOCAL_STORAGE_TOKEN').then(
        val => {
          studentServ.putHeader(val);
        });
    }
    this.getChatStudent();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatPage');
  }

  onSearchInput(event){

  }

  onSearchCancel(event){

  }


  getChatStudent(){
    this.studentServ.getAllStudents(7,null).subscribe(
      value => {
        console.log(value);
        let Data:any = value;
        for(let student of Data){
          let Stud = new Student();
          Stud.studentId = student.id;
          Stud.studentName = student.name;
          Stud.studentAddress = student.address;
          Stud.studentClass = student.classes;
          Stud.studentImageUrl = student.profileImg;
          this.allStudents.push(Stud);
        }
      },error2 => {
        console.log(error2);
      });
  }

}
