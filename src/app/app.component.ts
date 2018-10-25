import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { AuthPage } from '../pages/auth/auth';
import { CodePage } from '../pages/code/code';

import { FirebaseProvider } from '../providers/firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public firebase: FirebaseProvider, public events: Events) {
    this.initializeApp();

    //Buid pages by user role by event
    this.events.subscribe('user', () => {
      this.firebase.getUser()
        .then((u) => {
          console.log('current user', u);
          //Usuário comum
          if (u.hasOwnProperty('admin')) {
            this.pages = [
              { title: 'Enviar', component: HomePage },
              { title: 'Meus envios', component: ListPage },
              { title: 'Visualizar', component: CodePage }
            ];
          }
          else {
            this.pages = [
              { title: 'Visualizar', component: CodePage }
            ];
          }
        })
        .catch(() => {
          console.log('não há usuário logado')
        })
    });
    //Buid pages by user role 
    this.firebase.getUser()
      .then((u) => {
        console.log('current user', u);
        //Usuário comum
        if (u.hasOwnProperty('admin')) {
          this.pages = [
            { title: 'Enviar', component: HomePage },
            { title: 'Meus envios', component: ListPage },
            { title: 'Visualizar', component: CodePage }
          ];
        }
        else {
          this.pages = [
            { title: 'Visualizar', component: CodePage }
          ];
        }
      })
      .catch(() => {
        console.log('não há usuário logado')
      })

  }

  initializeApp() {
    let login = localStorage.getItem('logado');
    if (login === 'true') {
      this.rootPage = CodePage
    }
    else {
      this.rootPage = AuthPage
    }

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      setTimeout(() => {
        this.splashScreen.hide();
      });
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
