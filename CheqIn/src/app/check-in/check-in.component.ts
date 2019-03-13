import {Component, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {FirebaseService} from "../services/firebase.service";


@Component({
    selector: 'app-check-in',
    templateUrl: './check-in.component.html',
    styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {
    tagEntry = "";
    tags = ["test"];
    entry = "";
    color = "brown";
    colordesc =
        {
            "pink": "You feel happy, excited, overjoyed, or silly.",
            "red": "You feel angry, annoyed, frustrated, or irritated.",
            "orange": "You feel anxious, nervous, or insecure.",
            "yellow": "You feel energetic, hyper, or manic.",
            "green": "You feel calm, refreshed, relaxed, or zen.",
            "blue": "You feel depressed, sad, emotional, gloomy, or weepy.",
            "purple": "You feel active, focused, motivated, or productive",
            "black": "You feel stressed.",
            "grey": "You feel exhausted, fatigued, tired, lethargic, sleepy, or lazy.",
            "white": "You feel normal, neutral, or uneventful."
        };
    //myDate: String = new Date().toISOString();
    currentDate = new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000);
    myDate: String = this.currentDate.getUTCFullYear() + "-" + this.currentDate.getUTCMonth() + "-" + this.currentDate.getUTCDate();
    myTime: String = this.currentDate.getHours() + ":" + this.currentDate.getMinutes();
    //myTime: String = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().slice(0, -1);


    constructor(public modalController: ModalController, public firebaseService: FirebaseService) {
    }

    ngOnInit() {

    }

    onChange(val) {
        for (var i = 0; i < val.length; i++) {
            val[i] = val[i].toLowerCase();
            val[i] = val[i].replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        }
        console.log(this.tags);
    }

    setMood(color) {
        this.color = color;
        console.log("Setting mood! your color is " + this.color);
    }

    submitCheckin(myTime, myDate, entry, color, tags) {
        console.log('time: '+ myTime);
        console.log('date: '+ myDate);
        let day = myDate.split("-");
        let time = myTime.split(":");
        console.log(day, time);
        let newDate = new Date(Number(day[0]), Number(day[1]), day[2], time[0], time[1]).toISOString().slice(0, -1);;
        console.log('newDate: '+newDate);
        this.dismiss();
        this.firebaseService.addEntry(newDate, entry, color, tags);
        console.log("Submitting Check-in.");
    }

    dismiss() {
        this.modalController.dismiss()
    }

    removeTag(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);

    }

    addTags() {
        this.tagEntry = this.tagEntry.toLowerCase();
        if (this.tags.includes(this.tagEntry)) {
        } else {
            this.tags.push(this.tagEntry);
        }
        this.tagEntry = "";
    }


}
