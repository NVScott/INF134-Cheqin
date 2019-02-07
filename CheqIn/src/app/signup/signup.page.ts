import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { HomePage } from '../home/home.page';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  signupError: string;
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

  signup() {

    if (this.userEmail.length == 0 || this.passWord.length < 6) {
      console.log(`${this.userEmail}  ${this.passWord}`);
      return;
    }

		let credentials = {
			email: this.userEmail,
			password: this.passWord
		};
    console.log("Before signup");
		this.auth.signUp(credentials).then(
			() => {
        this.navCtrl.navigateRoot('/home');
        console.log("inside then");
      },
			error => this.signupError = error.message
		);
  }

}
