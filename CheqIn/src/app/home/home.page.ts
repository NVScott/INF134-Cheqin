import { Component, OnInit } from '@angular/core';
// import { NavController } from '@ionic/angular';
// import { AlertController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';
import { UserData } from '../data/user-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  userEmail = undefined;
  userPassword = undefined;

  constructor(
    public firebaseService: FirebaseService,
  ){}

  ngOnInit() {
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
