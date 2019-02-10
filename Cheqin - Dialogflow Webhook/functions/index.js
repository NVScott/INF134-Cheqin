// Written by Thomas Huang
// Webhook functions that handle Cheqin's features and provide customized responses

'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  Permission,
  Suggestions,
  BasicCard,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const functions = require('firebase-functions');

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);


// See if the user has stored a name for Cheqin to use.
// If such name is stored, use it as part of the greeting.
// If not, ask the user to grant permission using the actions_intent_PERMISSION intent
app.intent("Default Welcome Intent", (conv) => {
  const name = conv.user.storage.userName;
  if (!name) {
    conv.ask(new Permission({
      context: "Hi there, to get to know you better",
      permissions: 'NAME',
    }));
  } else {
    conv.ask(`Hi again, ${name}. How are you feeling right now?`);
    conv.ask(new Suggestions('Happy', 'Excited', 'Calm'));
  }
});

// Prompts the user to allow access to the user's name stored in the Google Account
// If permission is granted, use that name as part of the greeting.
// If not, continue anyways and use a neutral greeting.
app.intent("actions_intent_PERMISSION", (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    conv.ask("Ok, no worries. How are you feeling right now?");
    conv.ask(new Suggestions('Happy', 'Excited', 'Calm'));
  } else {
    conv.user.storage.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.user.storage.userName}. How are you feeling right now?`);
    conv.ask(new Suggestions('Happy', 'Excited', 'Calm'));
  }
});

// This intent matches all of the positive emotions with high energy.
// After the user provides an emotion, prompt the user to share his/her day.
app.intent("Current Emotion Positive High", (conv, {emotion}) => {
  const userEmotion = emotion;
  const userName = conv.user.storage.userName;
  if (userName) {
    conv.ask(`How exciting, ${userName}! I would love to hear all about it. Care to share your day with me?`);
    conv.ask(new Suggestions('Yes', 'No'));
  } else {
    conv.ask("How exciting! I would love to hear all about it. Care to share your day with me?");
    conv.ask(new Suggestions('Yes', 'No'));
  }
});

// If the user agrees to share his/her day, start recording the content for a potential journal entry.
app.intent("Current Emotion Positive High - yes", (conv) => {
  conv.ask("Great! I will listen for as long as you need, and I promise I'm not checking my phone!");
});

// If the user chooses not to share his/her day, say goodbye and end the conversation.
app.intent("Current Emotion Positive High - no", (conv) => {
  conv.close("No worries. Just know that I'm rooting for you out there. I can't wait to talk to you again soon. Bye!");
});