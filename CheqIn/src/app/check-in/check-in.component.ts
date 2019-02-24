import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {
  tags = ['butts'];
  entry = "";

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

  dismiss(){
    this.modalController.dismiss()
  }

}
