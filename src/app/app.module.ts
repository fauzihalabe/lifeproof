import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

//Modules
import { AuthPageModule } from '../pages/auth/auth.module'
import { CodePageModule } from '../pages/code/code.module'
import { MomentModule } from 'angular2-moment';

//Providers
import { FirebaseProvider } from '../providers/firebase';
import { UploadProvider } from '../providers/upload';
import { Camera } from '@ionic-native/camera';
import { SocialSharing } from '@ionic-native/social-sharing';
import { File } from '@ionic-native/file';
import { Media } from '@ionic-native/media';
import { MediaCapture } from '@ionic-native/media-capture';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';

// ********* FIREBASE PROD *********
export const firebaseconfig = {
  //YOUR FIREBASE CREDENTIALS
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseconfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AuthPageModule,
    MomentModule,
    CodePageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage
  ],
  providers: [
    AndroidPermissions,
    FileChooser,
    MediaCapture,
    File,
    Media,
    FilePath,
    SocialSharing,
    UploadProvider,
    FirebaseProvider,
    Camera,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
