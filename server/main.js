import { Meteor } from 'meteor/meteor';
import romcal from 'romcal'

Meteor.methods({
	month({year, month}) {
		var days = []
		const events = romcal.calendarFor({
			year,
			country: 'unitedStates',
			locale: 'en',
			christmastideEnds: 'o', //ordinary
			epiphanyOnJan6: false,
			corpusChristiOnThursday: true,
			ascensionOnSunday: false,
			query: {
				month
			}
		}, true)
		for (let event of events) {
			days[event.moment.date()] = {
				title: event.name,
				type: event.type,
				liturgicalColor: event.data.meta.liturgicalColor
			}
		}
		return days
	}
})