import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { IgnService } from '../../providers/ign.service';
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
  selector: 'page-map',
  templateUrl: 'map.html',
  providers: [IgnService]
})
export class MapPage {
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
    public ignService: IgnService,
    public locationService: LocationService,
  ) {
    this._latLng = L.latLng(44.13, 2.18);
    let key = this.getIGNKey();
    console.log(key);
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

  getConf(key){
    this.ignService.getAutoConf(key).subscribe(
      data => {
        console.log(data);
      },
      err => {
        console.log(err);
      },
      () => console.log("AUTOCONF complete")
    )
  }

  set latLng(value) {
    this._latLng = value;
    this.marker.setLatLng(value);
  }

  get latLng() {
    return this._latLng;
  }

  ionViewDidLoad() {
    console.log('Hello Map Page');
    this.start();
    console.log(this.params.get('id'));
    // workaround map is not correctly displayed
    // maybe this should be done in some other event
    setTimeout(this.loadMap.bind(this), 100);
  }

  loadMap() {
      this.map = L
        .map("map")
        .setView(this.latLng, 12)
        .on("click", this.onMapClicked.bind(this))

      L.tileLayer(this._layer, {
        minZoom: 4,
        maxZoom: 14
      }).addTo(this.map);
      // todo: clean
      this.icon = L.icon({
        iconUrl: './assets/images_leaflet/marker-icon.png'
      })

      this.marker = L
        .marker(this.latLng, { draggable: true, icon: this.icon})
        .on("dragend", this.onMarkerPositionChanged.bind(this))
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

  onMarkerPositionChanged(e) {
     const latlng = e.target.getLatLng();

     this.latLng = latlng;
  }

  getIGNKey(){
    let IGNKey;
    //get device type
    let device = Device.device.platform;
    console.log(device);
    switch(device){
      case 'iOS':
        IGNKey = "6mekcc9zftuvbmwhs3zd6y5j";
        this.getConf(IGNKey);
        break;
      case 'Android':
        IGNKey = "2cxnsa750kc1q7tj0xfsnvwm";
        break;
      default:
      IGNKey = "2cxnsa750kc1q7tj0xfsnvwm";
    }
    return IGNKey;
  }

  start(){
    this.locationService.startTracking();
  }

  stop(){
    this.locationService.stopTracking();
  }

  findLocation() {
    console.log('find location');
    console.log(this.locationService.lat, this.locationService.lng );
    this.latLng = L.latLng(this.locationService.lat, this.locationService.lng);
    this.map.setView(L.latLng(this.locationService.lat, this.locationService.lng), 13);
  }

}
