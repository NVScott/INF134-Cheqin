import { Component, OnInit } from '@angular/core';
import { NavService } from '../services/nav.services';
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
  data = undefined;

  constructor(
    public firebaseService: FirebaseService,
    public modalController: ModalController,
    public navCtrl: NavService,
  ){}

  ngOnInit() {
    this.firebaseService.getUserData().subscribe(data => {
      this.data = data;
      console.log(data);
    })
  }

  async presentModal() {
    const modal = await this.modalController.create({component: CheckInComponent});
    return await modal.present();
  }

  onSelect(timeStamp) {
    console.log(`HomePage: ${timeStamp}`);
    let date = new Date(timeStamp);
    let tempArray = [];
    this.data.forEach(value => {
      let currDate = new Date(value.timestamp);
      console.log(currDate);
      if(date.getDate() == currDate.getDate()
      && date.getMonth() == currDate.getMonth()
      && date.getFullYear() == currDate.getFullYear()){
        tempArray.push(value);
      }
    })
    this.navCtrl.push('daily', {timeStamp: date, data: tempArray});
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
