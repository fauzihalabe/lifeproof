import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CodePage } from './code';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    CodePage,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(CodePage),
  ],
})
export class CodePageModule {}
