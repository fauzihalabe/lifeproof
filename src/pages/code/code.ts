import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@IonicPage()
@Component({
  selector: 'page-code',
  templateUrl: 'code.html',
})
export class CodePage {

  code;
  proof;
  have = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private firebaseProvider: FirebaseProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private androidPermissions: AndroidPermissions
  ) {
    // this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
    // this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE)

    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
    //   result => console.log('Has permission?', result.hasPermission),
    //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
    // );
    // this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(
    //   result => console.log('Has permission?', result.hasPermission),
    //   err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE)
    // );
  }

  confirm() {
    if (this.code) {
      let load = this.loadingCtrl.create()
      load.present()

      this.firebaseProvider.verifyCode(this.code)
        .then((c) => {
          console.log(c)
          if (c.hasOwnProperty('opened')) {
            load.dismiss()
            if (c['opened'] === true) {
              let alert = this.alertCtrl.create({
                title: 'Ops!',
                subTitle: 'Esse arquivo já foi aberto.',
                buttons: ['Ok']
              });
              alert.present();
            }
            else {
              this.have = true
              this.proof = c

              if (this.proof.type === 'photo') {
                setTimeout(() => {
                  this.firebaseProvider.updateProof(this.proof.id)
                    .then(() => {
                      this.navCtrl.setRoot(CodePage)
                    })
                }, 30000)
              }

            }
          }
          else {
            load.dismiss()
            let alert = this.alertCtrl.create({
              title: 'Ops!',
              subTitle: 'O código não corresponde à nenhum arquivo.',
              buttons: ['Ok']
            });
            alert.present();
          }
        })
    }
  }


  vidEnded() {
    this.firebaseProvider.updateProof(this.proof.id)
      .then(() => {
        this.navCtrl.setRoot(CodePage)
      })
  }

  ionViewDidLoad() {
  }

}
