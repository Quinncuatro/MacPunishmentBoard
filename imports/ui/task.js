import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './task.html';

Template.task.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});

Template.task.events({
  'click .delete'() {
    Meteor.call('tasks.remove', this._id);
  },
  'click .upvote'() {
    Meteor.call('tasks.upvote', this._id);
  },
  'click .downvote'() {
    Meteor.call('tasks.downvote', this._id);
  },
});
