import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Tasks = new Mongo.Collection('tasks');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    return Tasks.find({
    });
  });
}

Meteor.methods({
  'tasks.insert'(text) {
    check(text, String);

    // Make sure the user is logged in before inserting a task
    if (! Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Tasks.insert({
      text,
      votes: 0,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username || Meteor.user().profile.name,
    });
  },
  'tasks.remove'(taskId) {
    check(taskId, String);

    const task = Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete is
      throw new Meteor.Error('not-authorized');
    }

    Tasks.remove(taskId);
  },
  'tasks.upvote'(taskId) {
    check(taskId, String);
    Tasks.update(taskId, { $inc: { votes: 1 } });    
  },
  'tasks.downvote'(taskId) {
    check(taskId, String);
    Tasks.update(taskId, { $inc: { votes: -1 } });
  },
});
