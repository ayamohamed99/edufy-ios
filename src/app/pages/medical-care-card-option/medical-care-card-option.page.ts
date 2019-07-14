import {Component, Input, OnInit} from '@angular/core';
import {AlertController, NavParams, Platform, PopoverController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {AccountService} from '../../services/Account/account.service';
import {NotificationService} from '../../services/Notification/notification.service';
import {LoadingViewService} from '../../services/LoadingView/loading-view.service';

@Component({
  selector: 'app-medical-care-card-option',
  templateUrl: './medical-care-card-option.page.html',
  styleUrls: ['./medical-care-card-option.page.scss'],
})
export class MedicalCareCardOptionPage implements OnInit {

  loading:any;
  localStorageToken:string = 'LOCAL_STORAGE_TOKEN';
  enableEdit = false;
  enableDelete = false;

  // Data passed in by componentProps
  @Input() Edit: boolean;
  @Input() Delete: boolean;

  constructor(public popCtrl: PopoverController,
              public platform:Platform,public storage:Storage,public accountServ:AccountService,
              public notiServ:NotificationService, public load:LoadingViewService, public alrtCtrl:AlertController)
  {
    this.enableEdit = this.Edit;
    this.enableDelete = this.Delete;
    let plat=this.platform.is('desktop');

    if(plat){
      let token = localStorage.getItem(this.localStorageToken);
      notiServ.putHeader(token);
    }else{
      storage.get(this.localStorageToken).then(value => this.notiServ.putHeader(value));
    }
  }

  ngOnInit() {
  }

  editNotification() {
    this.popCtrl.dismiss({done:'edit'});
    console.log('startedit');
  }


  deleteNotification() {
    this.popCtrl.dismiss({done:'delete'});
  }

}
