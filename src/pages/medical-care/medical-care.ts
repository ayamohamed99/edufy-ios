import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';

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
  instructions:any[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl:PopoverController) {
    this.times = ["11:30","02:00","04:00","09:30","02:00","04:00","09:30","02:00","04:00","09:30","02:00","04:00","09:30"];
    this.instructions = ["Kill Him","Kill Here","Drink water after take it","dont drink after one hour","sleep for 30h","walk","juice"];
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


  optimizeBackData(){
    let lineNumber = this.times.length %4;
    if(lineNumber > 0){
      // let height = 220 + (((this.times.length-lineNumber)/4)*40);
      let cardContainer = document.getElementById('cardContainer');
      let buttonDiv = document.getElementById('instDiv');
      if(cardContainer) {
        let getheight = buttonDiv.clientHeight;
        let height = 220 + (getheight - 40);
        cardContainer.style.height = height + "px";
      }
    }
  }

  openMenu(ev:Event){
    ev.stopPropagation();
    let popover = this.popoverCtrl.create('PopoverMedicalCareCardPage', {data:"Wait"});

    popover.onDidDismiss(data => {
      if(data == null) {
      }else{
        if(data == "edit"){

        }
        if(data == "delete"){

        }
      }
    });

    popover.present({ev: event});
  }


}
