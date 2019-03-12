import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavService } from '../services/nav.services';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.page.html',
  styleUrls: ['./daily.page.scss'],
})
export class DailyPage implements OnInit {

  date = undefined;
  data = undefined;

  constructor(
    public navCtrl: NavController,
    public navSer: NavService,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    //
    this.date = new Date(this.navSer.data["timeStamp"]);
    this.data = this.navSer.data["data"];
    console.log(`date ${this.date}`);
    this.data.forEach(value => {
      console.log(`data: ${value.color}`);
    })
    // this.firebaseService.getUserData.subscribe(data => {
    //
    // })
  }

  back() {
    this.navCtrl.back();
  }

  ionViewWillEnter() {
    console.log("Hello");
  }

}
