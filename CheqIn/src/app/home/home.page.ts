import { Component, OnInit } from '@angular/core';
// import { NavController } from '@ionic/angular';
// import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { UserData } from '../data/user-data';

import { CheckInComponent } from "../check-in/check-in.component";
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  userEmail = undefined;
  userPassword = undefined;
  data = [{"entry":"My first journal post", "red":true, "blue":false}, 
          {"entry":"My second journal post", "red":false, "blue":true},
          {"entry":"My third journal post", "red":true, "blue":false}];

  dates = [{"date":"01/01/19"}, {"date": "01/02/19"}, {"date":"01/03/19"}];


  constructor(
    public firebaseService: FirebaseService,
    public modalController: ModalController,
  ){}

  ngOnInit() {
  }

  async presentModal() {
    const modal = await this.modalController.create({component: CheckInComponent});
    return await modal.present();
  }

  onSubmit() {
    //
    // console.log(`Email: ${this.userEmail}`);
    // console.log(`Password: ${this.userPassword}`);
    this.firebaseService.addUserData(
      new UserData(
        this.userEmail,
        this.userPassword,
      ));
    console.log(`Email: ${this.userEmail}`);
    console.log(`Password: ${this.userPassword}`);
    this.userEmail = "";
    this.userPassword = "";
  }


}
