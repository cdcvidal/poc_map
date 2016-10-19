import { Component } from '@angular/core';
import { BackgroundGeolocation } from 'ionic-native';


@Component({
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {
  constructor() {

  }
  stopLocation(){
    BackgroundGeolocation.stop();
    console.log("stop location");
  }
  restartLocation(){
    console.log("restart location without option");
    BackgroundGeolocation.start();
  }
}
