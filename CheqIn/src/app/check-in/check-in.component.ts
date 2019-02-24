import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  dismiss(){
    this.modalController.dismiss()
  }

}
