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

  
// ngOnInit() {
//   //populate activity data in home page
//   this.firebaseService.getData().subscribe(data => {
//     this.dataLog = data
//     // console.log("homepage data = " + this.dataLog[1].content);

//     // if(data){
//     //   data.map( test => {
//     //     var temp = test.payload.doc.data();
        
//     //     //filter database by mobile app entries (ie chatLog is empty)
//     //     if(temp.chatLog.length == 0) {
//     //       var ts = new Date(temp.timestamp);
//     //       console.log("color is " + temp.color);
//     //       console.log("time is " + ts.toLocaleTimeString());
//     //       console.log("date is "+ ts.toLocaleDateString());
//     //       console.log("content is " + temp.content);
//     //     }
//     //     // filter by google home entries (chatLog contains journal entries)
//     //     else {
//     //       var cLogLength = temp.chatLog.length;
//     //       for(var i = 0; i < cLogLength - 1; ++i){
//     //         var ts = new Date(temp.chatLog[i].timestamp);
//     //       console.log("Google Home color is " + temp.chatLog[i].color);
//     //       console.log("Google Home time is " + ts.toLocaleTimeString());
//     //       console.log("Google Home date is "+ ts.toLocaleDateString());
//     //       console.log("Google content is " + temp.chatLog[i].content);
//     //       }
//     //     }
//     //   });
      
//     // }
//   });
