import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from "angularfire2/firestore";
import { AngularFireAuth } from "angularfire2/auth";
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseProvider {

    public myPhotosRef: any;


    constructor(
        private afs: AngularFirestore,
        private afAuth: AngularFireAuth,
    ) {
        this.myPhotosRef = firebase.storage().ref('files/');
    }

    uploadPhoto(myPhoto) {
        return this.myPhotosRef.child('/' + new Date())
            .putString(myPhoto, 'base64', { contentType: 'image/jpeg' })
    }

    uploadVideo(myPhoto) {
        return this.myPhotosRef.child('/' + new Date())
            .putString(myPhoto, 'base64', { contentType: 'video/mp4' })
    }

    postFile(data) {
        return this.afs.firestore.collection('proofs').add(data)
    }

    getUser() {
        return new Promise((resolve, reject) => {
            let uid = JSON.parse(localStorage.getItem('cUser')).uid;

            if (uid) {
                this.afs.firestore.collection('users').doc(uid).get()
                    .then((u) => {
                        resolve(u.data())
                    })
            }
            else {
                reject()
            }

        })
    }

    register(data) {
        return new Promise((resolve, reject) => {
            this.afAuth.auth.createUserWithEmailAndPassword(data.email, data.senha)
                .then((r) => {
                    let uid = r.uid;

                    this.afs.firestore.collection('users').doc(uid).set({
                        nome: data.nome,
                        email: data.email,
                        uid: uid
                    })
                        .then(() => {
                            resolve(uid)
                        })
                })
                .catch(() => {
                    reject()
                })
        })
    }

    getFilesByOwner(uid) {
        return new Promise((resolve, reject) => {
            let items = [];
            this.afs.firestore.collection('proofs').where('owner', '==', uid).get()
                .then((result) => {
                    result.forEach((i) => {
                        let item = i.data();
                        item.id = i.id;
                        items.push(item)
                    });
                    resolve(items)
                })
        })
    }

    login(data) {
        return new Promise((resolve, reject) => {
            this.afAuth.auth.signInWithEmailAndPassword(data.email, data.senha)
                .then((r) => {
                    let uid = r.uid;

                    this.afs.firestore.collection('users').doc(uid).get()
                        .then((u) => {
                            resolve(u.data())
                        })
                })
                .catch(() => {
                    reject()
                })
        })
    }

    updateProof(id) {
        return this.afs.firestore.collection('proofs').doc(id).update({ opened: true, openedBy: [{ open: true }] })
    }

    verifyCode(c) {
        let code = c.toLowerCase();
        console.log(code)
        return new Promise((resolve, reject) => {
            let items = [];
            this.afs.firestore.collection('proofs').where('code', '==', code).get()
                .then((result) => {
                    result.forEach((i) => {
                        let item = i.data();
                        item.id = i.id;
                        items.push(item)
                    });

                    console.log(items)
                    if (items.length > 0) {
                        resolve(items[0])
                    }
                    else {
                        resolve({})
                    }
                })
        })
    }
}
