import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { NavService } from '../services/nav.services';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.page.html',
  styleUrls: ['./daily.page.scss'],
})
export class DailyPage implements OnInit {

  data = undefined;

  constructor(
    public navCtrl: NavController,
    public navSer: NavService) { }

  ngOnInit() {
    this.data = new Date(this.navSer.data["timeStamp"]);
    console.log(this.data);
  }

  back() {
    this.navCtrl.back();
  }

  ionViewWillEnter() {
    console.log("Hello");
  }

}
