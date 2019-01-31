import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the MedicalCarePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-medical-care',
  templateUrl: 'medical-care.html',
})
export class MedicalCarePage {

  times:any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.times = ["11:30","02:00","04:00","09:30","02:00","04:00","09:30","02:00","04:00","09:30","02:00","04:00","09:30"];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MedicalCarePage');
  }

  flipCard(order){
    if(order && order=="turn"){
      document.getElementById('card').classList.toggle("flipped");
    }
  }

  confirmTime(ev:Event,selectedButton){
    ev.stopPropagation();
    console.log("Pitch *****Pitch *****Pitch *****Pitch *****Pitch *****Pitch");
    let data = document.getElementById(selectedButton);
      data.classList.toggle("confirmTime");
  }

  optimizeData(){
    let lineNumber = this.times.length %4;
    if(lineNumber > 0){
      // let height = 220 + (((this.times.length-lineNumber)/4)*40);
      let cardContainer = document.getElementById('cardContainer');
      let buttonDiv = document.getElementById('buttonDiv');
      if(cardContainer) {
        let getheight = buttonDiv.clientHeight;
        let height = 220 + (getheight - 40);
        cardContainer.style.height = height + "px";
      }
    }
  }

}
