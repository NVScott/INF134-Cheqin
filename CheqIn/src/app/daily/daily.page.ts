import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Chart } from 'chart.js';
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
  colorTracker = new Object();
  colors = [];
  colorsData = [];
  colorsBackground = [];
  colorsBorderColor = [];
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
  colorDescription = {
    "pink": "Happy, Excited, Overjoyed, or Silly.",
    "red":"Angry, Annoyed, Frustrated, or Irritated.",
    "orange": "Anxious, Nervous, or Insecure.",
    "yellow": "Energetic, Hyper, or Manic.",
    "green": "Calm, Refreshed, Relaxed, or Zen.",
    "blue": "Depressed, Sad, Emotional, Gloomy, or Weepy.",
    "purple": "Active, Focused, Motivated, or Productive",
    "black": "Stressed.",
    "grey": "Exhausted, Fatigued, Tired, Lethargic, Sleepy, or Lazy.",
    "white": "Normal, Neutral, or Uneventful."
  };
  month = ["January", "February", "March", "April", "May", "June", "July", "August", "October", "November", "December"];

  constructor(
    public navCtrl: NavController,
    public navSer: NavService,
    public firebaseService: FirebaseService
  ) { }

  ngOnInit() {
    //
    this.date = new Date(this.navSer.data["timeStamp"]);
    this.data = this.navSer.data["data"];
    // console.log(`date ${this.date}`);
    this.data.forEach(value => {
      if(this.colorTracker[value.color] == undefined){
        this.colorTracker[value.color] = 1;
        this.colors.push(value.color);
      }
      else{
        this.colorTracker[value.color] += 1;
      }
    });
    this.colors.forEach(value => {
      this.colorsData.push(this.colorTracker[value]);
      this.colorsBackground.push(this.colorLibrary[value]);
      this.colorsBorderColor.push("rgb(21, 62, 127)");
    });
    console.log(this.colors);
    console.log(this.colorsData);
    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'doughnut',
    data: {
        labels: this.colors,
        datasets: [{
            label: '# of Votes',
            data: this.colorsData,
            backgroundColor: this.colorsBackground,
            borderColor: this.colorsBorderColor,
            borderWidth: 1
        }]
    }
  });
    console.log(this.colorTracker);
    // this.firebaseService.getUserData.subscribe(data => {
    //
    // })
  }

  back() {
    this.navCtrl.back();
  }

  // ionViewWillEnter() {
  //   console.log("Hello");
  // }

}
