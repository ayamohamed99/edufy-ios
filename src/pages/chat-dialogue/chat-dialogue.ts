import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the ChatDialoguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat-dialogue',
  templateUrl: 'chat-dialogue.html',
})
export class ChatDialoguePage {

  student;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController){
    this.student = this.navParams.get('studentData');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChatDialoguePage');
  }

  close(){
    this.viewCtrl.dismiss({name:'dismissed'});
  }
}
