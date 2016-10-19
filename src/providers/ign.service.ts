import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";

/*
  Generated class for the Ign provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class IgnService {
  static get parameters() {
        return [[Http]];
    }

  constructor(public http: Http) {
    console.log('Hello Ign Provider');
  }

  getAutoConf(key): Observable<Response>{
    let url = "http://wxs.ign.fr/"+key+"/autoconf/?output=json&callback=OpenLayers.Protocol.Script.registry.regId1";
    let response = this.http.get(url).map(res => res.json());
    return response;
  }
}
