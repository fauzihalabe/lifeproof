import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, Events } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase';
import { HomePage } from '../home/home';
import { CodePage } from '../code/code';

@IonicPage()
@Component({
  selector: 'page-auth',
  templateUrl: 'auth.html',
})
export class AuthPage {

  login: boolean = false;
  registro = {
    nome: '',
    email: '',
    senha: ''
  }
  log = {
    email: '',
    senha: ''
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private firebaseProvider: FirebaseProvider,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public events: Events
  ) {
  }

  changeView() {
    this.login = !this.login
  }

  ionViewDidLoad() {
  }

  fazerLog() {
    if (
      (this.log.email)
      && (this.log.senha)
    ) {
      let load = this.loadingCtrl.create();
      load.present()

      this.firebaseProvider.login(this.log)
        .then((data) => {
          localStorage.setItem('cUser', JSON.stringify(data));
          localStorage.setItem('logado', 'true');
          load.dismiss();
          this.events.publish('user');
          this.navCtrl.setRoot(CodePage)
        })
        .catch(() => {
          load.dismiss()
          let alert = this.alertCtrl.create({
            title: 'Ops!',
            subTitle: 'Houve um erro. Por favor, tente novamente mais tarde.',
            buttons: ['Ok']
          });
          alert.present();
        })
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Ops!',
        subTitle: 'Por favor, preencha todos os campos antes de continuar.',
        buttons: ['Ok']
      });
      alert.present();
    }
  }


  cadastrar() {
    if (
      (this.registro.nome)
      && (this.registro.email)
      && (this.registro.senha)
    ) {
      if (this.registro.senha.length < 6) {
        let alert = this.alertCtrl.create({
          title: 'Ops!',
          subTitle: 'Por favor, escolha uma senha com 6 ou mais caracteres.',
          buttons: ['Ok']
        });
        alert.present();
      }
      else {
        let load = this.loadingCtrl.create();
        load.present()

        this.firebaseProvider.register(this.registro)
          .then((uid) => {
            let data = {
              uid: uid,
              nome: this.registro.nome,
              email: this.registro.email
            };

            localStorage.setItem('cUser', JSON.stringify(data));
            localStorage.setItem('logado', 'true');
            load.dismiss();
            this.events.publish('user');
            this.navCtrl.setRoot(CodePage)
          })
          .catch(() => {
            load.dismiss()
            let alert = this.alertCtrl.create({
              title: 'Ops!',
              subTitle: 'Houve um erro. Por favor, tente novamente mais tarde.',
              buttons: ['Ok']
            });
            alert.present();
          })
      }
    }
    else {
      let alert = this.alertCtrl.create({
        title: 'Ops!',
        subTitle: 'Por favor, preencha todos os campos antes de continuar.',
        buttons: ['Ok']
      });
      alert.present();
    }
  }

}
