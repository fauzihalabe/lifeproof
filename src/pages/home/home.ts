import { Component } from '@angular/core';
import { NavController, ActionSheetController, LoadingController } from 'ionic-angular';
import { stringify } from '@angular/compiler/src/util';
import { Camera } from '@ionic-native/camera';
import { FirebaseProvider } from '../../providers/firebase';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { MediaCapture, MediaFile, CaptureError, CaptureVideoOptions } from '@ionic-native/media-capture';
import { FilePath } from '@ionic-native/file-path';
import { FileChooser } from '@ionic-native/file-chooser';
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  type: string;
  bigImg;
  smallImg;
  load;
  uploaded: boolean = false;
  img: string;
  video: string;
  code: string;
  user: any;
  fileName;
  carregar;

  constructor(
    public navCtrl: NavController,
    public actionSheet: ActionSheetController,
    public camera: Camera,
    public uploadService: FirebaseProvider,
    public loadingCtrl: LoadingController,
    private social: SocialSharing,
    private filePathPlugin: FilePath,
    private file: File,
    private media: Media,
    private mediaCapture: MediaCapture,
    public fileChooser: FileChooser,
  ) {
    let user = JSON.parse(localStorage.getItem('cUser'));
    this.user = user;
    let initUid = user.uid.substring(0, 2);
    let endUid = user.uid.substring(5, 7);
    let date = new Date();
    let d = date.getDate();
    let s = date.getSeconds();
    let m = date.getMinutes();
    let h = date.getHours();
    let mm = date.getMonth();
    let code = initUid + d + s + m + h + endUid + mm;
    this.code = code;
  }

  share() {
    let message = 'Olá, tudo bem? Estou compartilhando algo importante com você. Para visualizar, baixe o app Lifeproof (disponível para Android) e insira o código: ' + this.code;
    this.social.shareViaWhatsApp(message, null, null)
  }

  fechar() {
    this.navCtrl.setRoot(HomePage)
  }

  upload() {
    let actionSheet = this.actionSheet.create({
      title: 'Escolha o tipo do seu arquivo',
      buttons: [
        {
          text: 'Foto',
          handler: () => {
            this.type = 'photo';
            this.pegarFoto()
          }
        },
        {
          text: 'Vídeo',
          handler: () => {
            this.type = 'video';
            this.uploadVideo()
          }
        },
      ]
    });

    actionSheet.present();
  }

  uploadVideo() {
    this.fileChooser.open()
      .then((uri) => {
        (<any>window).resolveLocalFileSystemURL(uri, (res) => {
          res.file((resFile) => {
            console.log('resfile', resFile)

            this.fileName = new Date();

            var reader = new FileReader();
            reader.readAsArrayBuffer(resFile);
            reader.onloadend = (evt: any) => {
              var imgBlob = new Blob([evt.target.result], { type: 'video/mp4' });
              console.log('blob', imgBlob)
              this.carregar = this.loadingCtrl.create();
              this.carregar.present()
              let storageRef = firebase.storage().ref();
              let metadata = {
                contentType: 'video/mp4',
              };

              let voiceRef = storageRef.child(`records/${this.fileName}`).put(imgBlob);
              voiceRef.on(firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
                console.log("uploading");
              }, (e) => {
                console.log(JSON.stringify(e, null, 2));
              }, () => {
                console.log('sucesso')
                this.download()
                this.carregar.dismiss()
              });
            }
          })
        })
      })
  }

  download() {
    let storageRef = firebase.storage().ref();
    storageRef.child(`records/${this.fileName}`).getMetadata().then((metadata) => {
      console.log('metadata', metadata)
    })
    storageRef.child(`records/${this.fileName}`).getDownloadURL().then((url) => {
      this.uploaded = true;
      this.img = url;

      let code = this.code.toLowerCase()
      let data = {
        owner: this.user.uid,
        file: url,
        type: this.type,
        opened: false,
        createdAt: new Date(),
        openedAt: null,
        openedBy: [],
        code: code
      }
      this.uploadService.postFile(data)
    })
  }

  pegarVideo() {
    this.camera.getPicture({
      quality: 100,
      // sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      // destinationType: this.camera.DestinationType.DATA_URL,
      // encodingType: this.camera.EncodingType.JPEG,
      mediaType: 1
    }).then(imageData => {
      console.log(imageData)
      // let base64data = 'data:video/mp4;base64,' + imageData;

      // console.log(base64data)
      // let imgToUp = base64data.split(',')[1];
      // console.log(imgToUp)

      // this.uploadService.uploadVideo(imgToUp)
      //   .then((savedPicture) => {
      //     // load.dismiss();
      //     console.log(savedPicture.downloadURL);
      //   })
      //   .catch((err) => {
      //     // load.dismiss()
      //   })
    }, error => {
    });
  }

  pegarFoto() {
    this.camera.getPicture({
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      // sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      correctOrientation: true,
      allowEdit: true,
      targetWidth: 500,
      targetHeight: 500,
      mediaType: 0
    }).then(imageData => {
      this.load = this.loadingCtrl.create();
      this.load.present()
      let base64data = 'data:image/jpeg;base64,' + imageData;
      this.bigImg = base64data;
      //Get image size
      this.createThumbnail();
    }, error => {
    });
  }

  createThumbnail() {
    this.generateFromImage(this.bigImg, 1000, 1000, 100, data => {
      this.smallImg = data;
      let imgToUp = this.smallImg.split(',')[1];
      this.uploadService.uploadPhoto(imgToUp)
        .then((savedPicture) => {
          this.uploaded = true;
          this.img = savedPicture.downloadURL;

          let code = this.code.toLowerCase()
          let data = {
            owner: this.user.uid,
            file: savedPicture.downloadURL,
            type: this.type,
            opened: false,
            createdAt: new Date(),
            openedAt: null,
            openedBy: [],
            code: code
          }
          this.uploadService.postFile(data)
          this.load.dismiss();
        })
        .catch((err) => {
          this.load.dismiss();
        })
    });
  }

  generateFromImage(img, MAX_WIDTH, MAX_HEIGHT, quality, callback) {
    var canvas: any = document.createElement("canvas");
    var image = new Image();
    image.onload = () => {
      var width = image.width;
      var height = image.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }
      canvas.width = width;
      canvas.height = height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, width, height);
      // IMPORTANT: 'jpeg' NOT 'jpg'
      var dataUrl = canvas.toDataURL('image/jpeg', quality);
      callback(dataUrl)
    }
    image.src = img;
  }
}
