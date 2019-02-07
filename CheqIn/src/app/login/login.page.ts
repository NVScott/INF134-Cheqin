import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { SignupPage } from '../signup/signup.page';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
	loginError: string;
  userEmail: string;
  passWord: string;


  constructor(
    private navCtrl: NavController,
    private auth: AuthService,
  ) {
    this.userEmail = "";
    this.passWord = "";
  }

  ngOnInit() {
  }


  login() {

  		if (this.userEmail.length == 0 || this.passWord.length < 6) {
  			return;
  		}

  		let credentials = {
  			email: this.userEmail,
  			password: this.passWord
  		};
  		this.auth.signInWithEmail(credentials)
  			.then(
  				() => this.navCtrl.navigateRoot('/home'),
  				error => this.loginError = error.message
  			);
  	}

    signup(){
      this.navCtrl.navigateForward('/signup');;
    }

}
