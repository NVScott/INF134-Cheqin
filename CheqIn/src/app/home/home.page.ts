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
  newData = undefined;
  colorLibrary = {
    "red": "rgb(215,70,70)",
    "orange":  "rgb(237,145,0)",
    "yellow": "rgb(235,216,13)",
    "green": "rgb(128,212,34)",
    "blue": "rgb(85,164,255)",
    "purple": "rgb(121,38,165)",
    "pink": "rgb(255,98,151)",
    "grey": "rgb(135,135,135)",
    "black": "rgb(9,9,9)",
    "white": "rgb(239,239,239)"
  };

  constructor(
    public firebaseService: FirebaseService,
    public modalController: ModalController,
    public navCtrl: NavService,
  ){}

  ngOnInit() {
    this.firebaseService.getUserData().subscribe(data => {
     
      console.log(data);
      this.data = data.reverse();
      
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

<<<<<<< HEAD
  checkArray(data) {
    // console.log("data in checkArraay is " + data.chatLog.length)

    if(data.chatLog.length > 0){
      // console.log("array data is " + data.chatLog[2].content);
      this.newData = data.chatLog;
      return true;
    }
    return false;
  }

  checkUser(user) {
    return(user.fromUser ? true : false);
  }

  checkGoogle(user){
    return(user.fromUser ? false : true);
  }
=======
  setColor(color) {
    //console.log("found this color " + color);
    // var temp;
    // let styles = {
    //   'background-color': this.colorLibrary.
    // };
    // return styles;
>>>>>>> cfebbbe18af6bfd49f722e2d1a6e26b0ddc8662e

  setColor(color) {
   
    switch(color) {
      case "red":
      let redStyle = {
        'background-color': this.colorLibrary.red
      };
      return redStyle;
      
      case "orange":
      let orangeStyle = {
        'background-color': this.colorLibrary.orange
      };
      return orangeStyle;
      
      case "yellow":
      let yellowStyle = {
        'background-color': this.colorLibrary.yellow
      };
      return yellowStyle;
      
      case "green":
      let greenStyle = {
        'background-color': this.colorLibrary.green
      };
      return greenStyle;
      
      case "blue":
      let blueStyle = {
        'background-color': this.colorLibrary.blue
      };
      return blueStyle;

      case "purple":
      let purpleStyle = {
        'background-color': this.colorLibrary.purple
      };
      return purpleStyle;

      case "pink":
      let pinkStyle = {
        'background-color': this.colorLibrary.pink
      };
      return pinkStyle;
      
      case "grey":
      let grayStyle = {
        'background-color': this.colorLibrary.grey
      };
      return grayStyle;

      case "black":
      let blackStyle = {
        'background-color': this.colorLibrary.black
      };
      return blackStyle;

      case "white":
      let whiteStyle = {
        'background-color': this.colorLibrary.white
      };
      return whiteStyle;
    }

  }
}
