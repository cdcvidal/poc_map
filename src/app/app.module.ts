import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { ListPage } from '../pages/list/list';
import { MapPage } from '../pages/map/map';
import { MapContentModal } from '../pages/map/map.modal';

import { IgnService } from '../providers/ign.service';
import { LocationService } from '../providers/location.service';

@NgModule({
  declarations: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    MapPage,
    MapContentModal,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HelloIonicPage,
    ItemDetailsPage,
    ListPage,
    MapPage,
    MapContentModal,
  ],
  providers: [
    IgnService,
    LocationService
  ]
})
export class AppModule {}
