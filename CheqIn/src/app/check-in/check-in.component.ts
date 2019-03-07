import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";
import * as wheelnav from "../../../node_modules/wheelnav";
import * as raphael from "raphael";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {
  tags = [];
  entry = "";
  color = "brown";
  colordesc =
      {"pink": "You feel happy, excited, overjoyed, or silly.",
        "red":"You feel angry, annoyed, frustrated, or irritated.",
        "orange": "You feel anxious, nervous, or insecure.",
        "yellow": "You feel energetic, hyper, or manic.",
        "green": "You feel calm, refreshed, relaxed, or zen.",
        "blue": "You feel depressed, sad, emotional, gloomy, or weepy.",
        "purple": "You feel active, focused, motivated, or productive",
        "black": "You feel stressed.",
        "grey": "You feel exhausted, fatigued, tired, lethargic, sleepy, or lazy.",
        "white": "You feel normal, neutral, or uneventful." };
    myDate: String = new Date().toISOString();
    myTime: String = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, -1);

    constructor(public modalController: ModalController) { }

  ngOnInit() {
    var myWheelnav = wheelnav("divWheelnav");
    myWheelnav.slicePathFunction = wheelnav.slicePath().WheelSlice;
    myWheelnav.colors = wheelnav.colorpalette.parrot;
  }

  onChange(val){
    for (var i = 0; i < val.length; i++) {
      val[i] = val[i].toLowerCase();
      val[i] = val[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"")
    }
    console.log(this.tags);
  }

  setMood(color) {
      this.color = color;
    console.log("Setting mood! your color is " + this.color);
  }

  Fart() {
    console.log(this.color);
  }

  dismiss(){
    this.modalController.dismiss()
  }


}
