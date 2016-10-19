import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar } from 'ionic-native';
import { BackgroundGeolocation } from 'ionic-native';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';
import { MapPage } from '../pages/map/map';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage: any = HelloIonicPage;
  pages: Array<{title: string, component: any, params: any }>;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      { title: 'Hello Ionic', component: HelloIonicPage, params: '' },
      { title: 'My First List', component: ListPage, params: '' },
      { title: 'My Map', component: MapPage, params: {id: 'all'} }

    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();

      // BackgroundGeolocation is highly configurable. See platform specific configuration options
      let config = {
              desiredAccuracy: 10,
              stationaryRadius: 20,
              distanceFilter: 30,
              debug: true, //  enable this hear sounds for background-geolocation life-cycle.
              stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      };

      BackgroundGeolocation.configure((location) => {
        console.log('[js] BackgroundGeolocation callback:  ' + location.latitude + ',' + location.longitude);

         // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
         // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
         // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
         BackgroundGeolocation.finish(); // FOR IOS ONLY

      }, (error) => {
          console.log('BackgroundGeolocation error');
      }, config);

     // Turn ON the background-geolocation system.  The user will be tracked whenever they suspend the app.
     BackgroundGeolocation.start();

     //INIT IGN
     


    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component, page.params);
  }
}
