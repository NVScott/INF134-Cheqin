import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Chart } from 'chart.js';
import { NavService } from '../services/nav.services';
import { FirebaseService } from '../services/firebase.service';

var colorDescription = {
  "pink": "Happy, Excited, Overjoyed, or Silly",
  "red":"Angry, Annoyed, Frustrated, or Irritated",
  "orange": "Anxious, Nervous, or Insecure",
  "yellow": "Energetic, Hyper, or Manic",
  "green": "Calm, Refreshed, Relaxed, or Zen",
  "blue": "Depressed, Sad, Emotional, Gloomy, or Weepy",
  "purple": "Active, Focused, Motivated, or Productive",
  "black": "Stressed",
  "grey": "Exhausted, Fatigued, Tired, Lethargic, Sleepy, or Lazy",
  "white": "Normal, Neutral, or Uneventful"
};

@Component({
  selector: 'app-daily',
  templateUrl: './daily.page.html',
  styleUrls: ['./daily.page.scss'],
})
export class DailyPage implements OnInit {

  allData = undefined;
  date = undefined;
  data = undefined;
  colorTracker = new Object();
  myChart = undefined;
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
  colorDesc = {
    "pink": "Happy, Excited, Overjoyed, or Silly",
    "red":"Angry, Annoyed, Frustrated, or Irritated",
    "orange": "Anxious, Nervous, or Insecure",
    "yellow": "Energetic, Hyper, or Manic",
    "green": "Calm, Refreshed, Relaxed, or Zen",
    "blue": "Depressed, Sad, Emotional, Gloomy, or Weepy",
    "purple": "Active, Focused, Motivated, or Productive",
    "black": "Stressed",
    "grey": "Exhausted, Fatigued, Tired, Lethargic, Sleepy, or Lazy",
    "white": "Normal, Neutral, or Uneventful"
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
    this.allData = this.navSer.data["data"];
    this.data = [];
    this.allData.forEach(value => {
      let currDate = new Date(value.timestamp);
      console.log(currDate);
      if(this.date.getDate() == currDate.getDate()
      && this.date.getMonth() == currDate.getMonth()
      && this.date.getFullYear() == currDate.getFullYear()){
        value.magicTime = currDate;
        this.data.push(value);
      }
    })
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
    var ctx = document.getElementById("myChart");
    this.myChart = new Chart(ctx, {
      type: 'doughnut',
    data: {
        labels: this.colors,
        datasets: [{
            label: '# of Votes',
            data: this.colorsData,
            backgroundColor: this.colorsBackground,
            borderColor: this.colorsBorderColor,
            borderWidth: 1
        }],
      },
      options: {
        legend: {
          display: false
        },
        tooltips: {
          enabled: true,
          bodyFontSize: 8,
          callbacks: {
            label: function(tooltipItems, data) {
              return colorDescription[data.labels[tooltipItems.index]];
            },

        },
        tooltipEvents: ["click"],

        }

      }

  });
  // console.log(myChart);
    // this.firebaseService.getUserData.subscribe(data => {
    //
    // })
  }

  prevDay(){
    this.date.setDate(this.date.getDate() - 1);
    this.data = [];
    this.allData.forEach(value => {
      let currDate = new Date(value.timestamp);
      console.log(currDate);
      if(this.date.getDate() == currDate.getDate()
      && this.date.getMonth() == currDate.getMonth()
      && this.date.getFullYear() == currDate.getFullYear()){
        value.magicTime = currDate;
        this.data.push(value);
      }
    })
    // console.log(`date ${this.date}`);
    this.colorTracker = new Object();
    this.colors = [];
    this.colorsData = [];
    this.colorsBackground = [];
    this.colorsBorderColor = [];
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

    this.myChart.data.labels = this.colors;
    this.myChart.data.datasets = [{
                label: '# of Votes',
                data: this.colorsData,
                backgroundColor: this.colorsBackground,
                borderColor: this.colorsBorderColor,
                borderWidth: 1
            }];
    this.myChart.update();
  }

  nextDay(){
    this.date.setDate(this.date.getDate() + 1);
    this.data = [];
    this.allData.forEach(value => {
      let currDate = new Date(value.timestamp);
      console.log(currDate);
      if(this.date.getDate() == currDate.getDate()
      && this.date.getMonth() == currDate.getMonth()
      && this.date.getFullYear() == currDate.getFullYear()){
        value.magicTime = currDate;
        this.data.push(value);
      }
    })
    // console.log(`date ${this.date}`);
    this.colorTracker = new Object();
    this.colors = [];
    this.colorsData = [];
    this.colorsBackground = [];
    this.colorsBorderColor = [];
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
    this.myChart.data.labels = this.colors;
    this.myChart.data.datasets = [{
                label: '# of Votes',
                data: this.colorsData,
                backgroundColor: this.colorsBackground,
                borderColor: this.colorsBorderColor,
                borderWidth: 1
            }];
    this.myChart.update();
  }

  back() {
    this.navCtrl.back();
  }

  setColor(color) {

    switch(color) {
      case "red":
        let redStyle = {
          'border-color': this.colorLibrary.red
        };
        return redStyle;

      case "orange":
        let orangeStyle = {
          'border-color': this.colorLibrary.orange
        };
        return orangeStyle;

      case "yellow":
        let yellowStyle = {
          'border-color': this.colorLibrary.yellow
        };
        return yellowStyle;

      case "green":
        let greenStyle = {
          'border-color': this.colorLibrary.green
        };
        return greenStyle;

      case "blue":
        let blueStyle = {
          'border-color': this.colorLibrary.blue
        };
        return blueStyle;

      case "purple":
        let purpleStyle = {
          'border-color': this.colorLibrary.purple
        };
        return purpleStyle;

      case "pink":
        let pinkStyle = {
          'border-color': this.colorLibrary.pink
        };
        return pinkStyle;

      case "grey":
        let grayStyle = {
          'border-color': this.colorLibrary.grey
        };
        return grayStyle;

      case "black":
        let blackStyle = {
          'border-color': this.colorLibrary.black
        };
        return blackStyle;

      case "white":
        let whiteStyle = {
          'border-color': this.colorLibrary.white
        };
        return whiteStyle;
    }

  }


}
