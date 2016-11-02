import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar } from 'ionic-native';
import { LocationService } from '../providers/location.service';


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
    public menu: MenuController,
    public locationService: LocationService,
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
      this.startGeoloc();
    });
  }

  startGeoloc(){
    this.locationService.startTracking();
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component, page.params);
  }
}
