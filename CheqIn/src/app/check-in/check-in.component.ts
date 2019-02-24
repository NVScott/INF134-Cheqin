import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {
  tags = [];
  entry = "";
  color = "white";
  colordesc =
      {"red":"You feel angry, annoyed, frustrated, or irritated.",
      "orange": "You feel anxious, nervous, or insecure.",
      "yellow": "You feel energetic, hyper, or manic.",
      "green": "You feel calm, refreshed, relaxed, or zen."};

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  onChange(val){
    for (var i = 0; i < val.length; i++) {
      val[i] = val[i].toLowerCase();
      val[i] = val[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
    }
    console.log(this.tags);
  }

  setMood(color) {
    console.log("Setting mood!")
    this.color = color;
  }

  Fart() {
    console.log(this.color);
  }

  dismiss(){
    this.modalController.dismiss()
  }

}
