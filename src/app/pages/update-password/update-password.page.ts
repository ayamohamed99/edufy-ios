import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import {AccountService} from "../../services/Account/account.service";
import { LoadingViewService } from "src/app/services/LoadingView/loading-view.service";


@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.page.html',
  styleUrls: ['./update-password.page.scss'],
})
export class UpdatePasswordPage implements OnInit {

  currentPassword = "";
  currentPasswordValidityResult = "";

  newPassword="";
  newPasswordValidityResult="";

  newPasswordConfirm="";
  newPasswordConfirmMatchResult="";

  userId:number ;

  GOOD_PASSWORD = "GOOD_PASSWORD";
  YOUR_lAST_USAGE_DID_NOT_EXCEEED_2_MONTH = "YOUR_lAST_USAGE_DID_NOT_EXCEEED_2_MONTH"
  AUTHENTICATED_USER_PASSWORD_NOT_MATCHED = "AUTHENTICATED_USER_PASSWORD_NOT_MATCHED";
  AUTHENTICATED_USER_PASSWORD_IS_OLD = "AUTHENTICATED_USER_PASSWORD_IS_OLD";

  errorIndicator: boolean;

  constructor(public modalCtrl: ModalController,
              private alertController: AlertController,
              private load: LoadingViewService,
              public accountServ: AccountService) { }

  ngOnInit() {
    this.userId = this.accountServ.getUserId();
    this.errorIndicator = false;
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
  close() {
    //update password
    //show result  
    this.modalCtrl.dismiss();
  }

  passOn = false;
  newPassOn = false;
  newPassConfOn = false;
  showPassword(password: string){
    if(password == "CURRENT") this.passOn = !this.passOn;
    else if (password == "NEW") this.newPassOn = !this.newPassOn;
    else  this.newPassConfOn = !this.newPassConfOn;
  }

  checkPassword(password, passwordResult){
    this.accountServ.checkPasswordValidity(password, this.userId).subscribe(
      (response) => {
        console.log(response);
      },
      (err)=> {
        passwordResult = err.error.text;
        console.log(passwordResult);
        if(passwordResult != this.GOOD_PASSWORD){
          this.errorIndicator = true;
        }else{
          this.errorIndicator = false;
        }
      }
    );
  }

  matchNewPasswords(){
    if(this.newPassword !== this.newPasswordConfirm){
      this.newPasswordConfirmMatchResult = "Password does not match";
      this.errorIndicator = true;
    }else{
      this.newPasswordConfirmMatchResult = "";
      this.errorIndicator = false;
    }
  }

  changePassword(){
    this.load.startNormalLoading("Changing password...");
    this.accountServ.changePassword(this.currentPassword, this.newPassword).subscribe(
      async (response)=>{
        this.load.stopLoading();
        const alert = await this.alertController.create({
          header: "Password is changed successfully",
          buttons: ["OK"],
        });
    
        await alert.present();
        this.dismiss();
      },
      async (err) => {
        this.load.stopLoading();
        let msg = "Please contact administrator";
        if(err.error === this.AUTHENTICATED_USER_PASSWORD_NOT_MATCHED 
          || err.error === this.AUTHENTICATED_USER_PASSWORD_IS_OLD){
          msg = "Current password is wrong"
        }
        
        const alert = await this.alertController.create({
          header: "Password can't be changed",
          message: msg,
          buttons: ["OK"],
        });
        await alert.present();
        console.log(err);
      }
    )
  }
}
