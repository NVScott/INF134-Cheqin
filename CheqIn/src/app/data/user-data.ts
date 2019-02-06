import * as shortid from 'shortid';

export class UserData {
	id:string;
  userEmail:string;
  userPassword:string;
  
	constructor(userEmail:string, userPassword:string) {
		//Assign a random (unique) ID. This may be useful for comparison (e.g., are two logged entries the same).
		this.id = shortid();
		this.userEmail = userEmail;
    this.userPassword = userPassword;
	}

	// summaryString():string {
	// 	return 'Unknown sleep data';
	// }

	// dateString():string {
	// 	return this.loggedAt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
	// }

  summaryString():string {
    return `ID: ${this.id}  | Email: ${this.userEmail}  | Password: ${this.userPassword}`;
  }


	toObject():{} {
		return {
			'id': this.id,
			'userEmail': this.userEmail,
			'userPassword': this.userPassword,
		};
	}

	fromObject(object:{}) {
		this.id = object['id'];
    this.userEmail = object['userEmail']
		this.userPassword = object['userPassword'];
	}
}
