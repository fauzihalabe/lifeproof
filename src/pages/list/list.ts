import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  items: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public firebaseService: FirebaseProvider,
  ) {
    let user = JSON.parse(localStorage.getItem('cUser'));
    this.firebaseService.getFilesByOwner(user.uid)
    .then((result) => {
      this.items = result
      console.log(this.items)
    })
  }


}
