import { Component } from '@angular/core';

import { MapContentModal } from '../map/map.modal';

import { ModalController } from 'ionic-angular';




@Component({
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  constructor(
    public modalCtrl: ModalController,
  ) { }

  openModal() {
   let modal = this.modalCtrl.create(MapContentModal);
   modal.present();
 }

}
