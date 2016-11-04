import { Injectable, NgZone } from '@angular/core';
import { Geolocation, Geoposition, BackgroundGeolocation } from 'ionic-native';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CurrentLocation } from './currentlocation.model';

import 'rxjs/add/operator/filter';

/*
  TODO :
  - Test if location is enable see doc Background Geolocation,
  - test foreground with BG
*/

/*
  Generated class for the LocationTracker provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LocationService {

  public watch: any;
  public lat: number = 0;
  public lng: number = 0;

  private _userLocation$: BehaviorSubject<CurrentLocation[]> = new BehaviorSubject([]);
  // private dataStore: {  // This is where we will store our data in memory
  //   lastUpdate: number,
  //   items: CurrentLocation[]
  // };
  constructor( public zone: NgZone ) {
    console.log('Hello LocationTracker Provider');
  }

  get userLocation$(){
    return this._userLocation$.asObservable();
  }

  startTracking() {
    let config = {
      stationaryRadius: 50,
      distanceFilter: 50,
      desiredAccuracy: 10,
      debug: true,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      notificationIconColor: '#FEDD1E',
      notificationIconLarge: 'mappointer_large',
      notificationIconSmall: 'mappointer_small',
      locationProvider: 0,//backgroundGeolocation.provider.ANDROID_DISTANCE_FILTER_PROVIDER,
      interval: 10,
      fastestInterval: 5,
      activitiesInterval: 10,
      stopOnTerminate: false,
      startOnBoot: false,
      startForeground: true,
      stopOnStillActivity: true,
      activityType: 'AutomotiveNavigation',

      pauseLocationUpdates: false,
      saveBatteryOnBackground: false,
      maxLocations: 100
    };

    BackgroundGeolocation.watchLocationMode().then((enabled) => {
      if(enabled)
        console.log('BackgroundGeolocation watch is enabled', enabled);
      else
        console.log('BackgroundGeolocation watch is disabled', enabled);
    }, (err) => {
      console.log('Error watching location mode. Error:' + err);
    });

    BackgroundGeolocation.isLocationEnabled().then((locEnabled) => {
      if(locEnabled){
        // Turn ON the background-geolocation system.
        BackgroundGeolocation.start().then((ok) => {
          console.log('BackgroundGeolocation is started.');
        }, (error) => {
          if (error.code === 2) {
            if (window.confirm('Not authorized for location updates. Would you like to open app settings?')) {
              BackgroundGeolocation.showAppSettings();
            }
          } else {
            window.alert('Start failed: ' + error.message);
          }
        })
      } else {
        if (window.confirm('Location is disabled. Would you like to open location settings?')) {
           BackgroundGeolocation.showLocationSettings();
         }
      }
    });


    BackgroundGeolocation.configure((location) => {

      console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);

      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
        this._userLocation$.next(location);
      });

      BackgroundGeolocation.finish();

     }, (err) => {
       console.log(err);
       if(err === 2){
          if (window.confirm('Not authorized for location updates. Would you like to open app settings?')) {
            BackgroundGeolocation.showAppSettings();
          }
        } else {
          console.log('BackgroundGeolocation Start failed: ' + err.message);
        }

    }, config);



    if(!(<any>window).cordova){
      // Foreground Tracking with plugin Geolocation
      let options = {
        frequency: 3000,
        enableHighAccuracy: true
      };

      this.watch = Geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {

        console.log(position);

        // Run update inside of Angular's zone
        this.zone.run(() => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        });

      });

    }



 }

 stopTracking() {
    console.log('stopTracking');

    BackgroundGeolocation.finish();
    this.watch.unsubscribe();

 }

}
