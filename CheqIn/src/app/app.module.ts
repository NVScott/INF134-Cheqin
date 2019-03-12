import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from './services/auth.service';
import { NavService } from './services/nav.services';
import { firebaseConfig } from './credentials';
import { environment } from "../environments/environment";

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CheckInComponent } from './check-in/check-in.component';
import {IonTag, IonTagsInputModule} from "ionic-tags-input";


@NgModule({
  declarations: [AppComponent, CheckInComponent],
  entryComponents: [CheckInComponent],
  imports: [
      IonTagsInputModule,
    BrowserModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'cheqin'),
    AngularFirestoreModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AngularFireAuth,
    AuthService,
    NavService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
