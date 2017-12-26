import { ReactiveVar } from 'meteor/reactive-var'
import { Meteor }      from 'meteor/meteor'

export class Calendar {
	constructor() {
		this.data = new ReactiveVar([])
	}

	loadMonth({month, year}) {
		Meteor.call("month", {month, year}, (error, data) => {
			if (error == undefined) {
				this.month = month
				this.data.set(data)
			} else {
				this.data.set([])
			}
		})
	}
}