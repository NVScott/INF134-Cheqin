import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentData } from '@angular/fire/firestore';
import { UserData } from '../data/user-data';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
	collection:AngularFirestoreCollection;

  constructor(public db:AngularFirestore) {
  	this.collection = db.collection('cheqin-1f59e');
  }

  addUserData(userData:UserData) {
  	//TODO: implement this function to add sleep logs
    this.collection.add(userData.toObject()).then((reference) => {
      console.log(reference);
    })
  }

  getUserData():Observable<DocumentData[]>{
  	//TODO: implement this function to retrieve sleep logs
    return this.collection.valueChanges();
  }
}
