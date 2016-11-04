import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ViewController  } from 'ionic-angular';

import { LocationService } from '../../providers/location.service';

// npm install @types/leaflet --save-dev --save-exact
import L from "leaflet";

/*
TODO :
- Refresh map when location is successful,
- Remove the marker and the possibilty to move it
*/

import { Device } from 'ionic-native';

/*
  Generated class for the Map page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  template: `
      <ion-header>
        <ion-toolbar>
          <ion-title>
            MAP MODAL
          </ion-title>
          <ion-buttons start>
            <button ion-button (click)="dismiss()">
              <span color="primary" showWhen="ios">Cancel</span>
              <ion-icon name="md-close" showWhen="android,windows"></ion-icon>
            </button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="location">
          <h3>Current Latitude: {{locationService.lat}}</h3>
          <h3>Current Longitude: {{locationService.lng}}</h3>
        </div>
        <div class="map-container">
          <div id="map" style="width: 100%; height: 100%">
          </div>
        </div>
        <ion-fab right bottom>
          <button ion-fab color="primary" class="find-location" (click)="findLocation()" ><ion-icon name="locate"></ion-icon></button>
        </ion-fab>
      </ion-content>
      `
})

export class MapContentModal {
  private map: any;
  private _latLng: any;
  private marker: any;
  private _layer:any;
  private icon: any;
  private _latLngs: any;
  private polyline: any;

  constructor(
    public navCtrl: NavController,
    public params: NavParams,
    public locationService: LocationService,
    public viewCtrl: ViewController,
    public platform: Platform,
  ) {
    this._latLng = L.latLng(44.13, 2.18);
    let key = this.getIGNKey();
    this._layer = this.layerUrl(
        key , "GEOGRAPHICALGRIDSYSTEMS.MAPS"
    );
    this._latLngs = [
        [44.12, 2.1],
        [44.23, 2.14],
        [44.34, 2.23],
        [44.12, 2.31],
        [44.25, 2.42],
        [44.47, 2.51]
    ];
  }

  set latLng(value) {
    this._latLng = value;
    this.marker.setLatLng(value);
  }

  get latLng() {
    return this._latLng;
  }

  ionViewDidLoad() {
    console.log(this.params.get('id'));
    console.log(navigator.userAgent);
    // workaround map is not correctly displayed
    // maybe this should be done in some other event
    setTimeout(this.loadMap.bind(this), 100);
  }

  loadMap() {
      this.map = L
        .map("map")
        .setView(this.latLng, 14)
        .on("click", this.onMapClicked.bind(this))

      L.tileLayer(this._layer, {
        minZoom: 14,
        maxZoom: 18
      }).addTo(this.map);

      // todo: clean
      let icon = L.icon({
        iconUrl: './assets/images_leaflet/marker-icon.png'
      })

      L.marker(this.latLng, { icon: icon})
        .bindPopup('Popup')
        .openPopup()
        .addTo(this.map);

      this.polyline = L.polyline(this._latLngs, {color: 'red'}).addTo(this.map);
      this.map.fitBounds(this.polyline.getBounds());

  }

  layerUrl(key, layer){
    return "http://wxs.ign.fr/" + key
           + "/geoportail/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&"
           + "LAYER=" + layer + "&STYLE=normal&TILEMATRIXSET=PM&"
           + "TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg";
  }

  onMapClicked(e) {
     this.latLng = e.latlng;
  }

  getIGNKey(){
    let IGNKey;
    //get device type
    let device = Device.device.platform;
    console.log(device);
    switch(device){
      case 'iOS':
        IGNKey = "6mekcc9zftuvbmwhs3zd6y5j";
        // this.getConf(IGNKey);
        break;
      case 'Android':
        //KEY PRO
        IGNKey = "l545bivkgkykuqvrkzaijx5z";
        // IGNKey = "nxz5xok1i0l9gtsu0wcqi1en";
        break;
      default:
      IGNKey = "2cxnsa750kc1q7tj0xfsnvwm";
    }
    return IGNKey;
  }

  findLocation() {
    this.locationService.userLocation$.subscribe(location => {
        console.log('observable location', location);
      },err => {
        console.log('observable location error', err);
    });
    
    console.log('find location lat long', this.locationService.lat, this.locationService.lng );
    if (this.locationService.lat != 0 && this.locationService.lng  != 0){
      let position = L.latLng(this.locationService.lat, this.locationService.lng);
      this.icon = L.icon({
                      iconUrl: './assets/images_leaflet/location_gps-1x.png'
                    })
      this.marker = L.marker(position, {icon: this.icon})
        .bindPopup('Votre position est : '+ position+'.')
        .openPopup()
        .addTo(this.map);

      this.map.setView(position, 18);
    } else {
      alert("loc lat/long: 0/0 ");
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
