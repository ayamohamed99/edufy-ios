import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AccountService} from "../../services/account";

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  classesList:any = [];
  studentsList:any = [];

  pageName:string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public accountServ:AccountService) {
    this.pageName = this.accountServ.reportPage;




  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad '+this.accountServ.reportPage+"its id : "+this.accountServ.reportId);

    var coll = document.getElementsByClassName("collapsible");
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        }
      });
    }


  }

}
