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
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
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
