import { Injectable } from '@angular/core';
// import * as firebase from 'firebase';

@Injectable()
export class UploadProvider {
    userAuth: any;
    public myPhotosRef: any;
    public myPhoto: any;
    public myPhotoURL: any;
    public fileName: any;

    constructor(
    ) {
        // Path
        // this.myPhotosRef = firebase.storage().ref('Images/');
    }


    // uploadPhoto(myPhoto) {
    //     return this.myPhotosRef.child('/files/' + new Date())
    //         .putString(myPhoto, 'base64', { contentType: 'image/jpeg' })
    // }
}