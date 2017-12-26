import { Template } from 'meteor/templating';
import { Tracker } from 'meteor/tracker';
import moment from 'moment'
import {Calendar} from "./Calendar";

import './main.html';

Template.calendar.onCreated(function() {
	this.currentDate = moment()
	this.currentDateDependency = new Tracker.Dependency
	this.remoteCalendar = new Calendar
	this.autorun(() => {
		this.currentDateDependency.depend()
		if (this.remoteCalendar.month != this.currentDate.month()) {
			this.remoteCalendar.data.set([])
			this.remoteCalendar.loadMonth({month: this.currentDate.month(), year: this.currentDate.year()})
		}
	})
})

Template.calendar.helpers({
	currentDate() {
		const template = Template.instance()
		template.currentDateDependency.depend()
		return template.currentDate
	},
	weeks() {
		const template = Template.instance()
		template.currentDateDependency.depend()
		var firstDayOfMonth = template.currentDate.startOf('month')
		const firstDayOfTheWeek = firstDayOfMonth.day() // 0 means sunday
		const offsetDayCount = (firstDayOfTheWeek+6) % 7

		const weeks = []

		const lastDayOfMonth = firstDayOfMonth.clone().endOf('month').date()
		const dayCount = lastDayOfMonth + offsetDayCount
		const weekCount = Math.ceil(dayCount / 7)
		var day = firstDayOfMonth.clone().subtract(offsetDayCount, 'days')
		for (let week=0; week<weekCount; week++) {
			for (var dayOfWeek=0, weekDays=[]; dayOfWeek<7; dayOfWeek++) {
				weekDays.push(day.clone())
				day.add(1, 'day')
			}
			weeks.push(weekDays)
		}
		return weeks
	},
	infoFor(date, month) {
		const template = Template.instance()
		const info = template.remoteCalendar.data.get()[date]
		if (month == template.currentDate.month()) return _.extend(info, {date})
		else return {date}
	}
});

Template.calendar.events({
	'click button.back'(event, template) {
		template.currentDate.subtract(1, 'month')
		template.currentDateDependency.changed()
	},
	'click button.forward'(event, template) {
		template.currentDate.add(1, 'month')
		template.currentDateDependency.changed()
	}
})