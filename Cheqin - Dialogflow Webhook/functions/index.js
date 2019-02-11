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

const emotionColors = {
  "energetic": "yellow",
  "hyper": "yellow",
  "manic": "yellow",

  "active": "purple",
  "focused": "purple",
  "motivated": "purple",
  "productive": "purple",

  "happy": "pink",
  "excited": "pink",
  "overjoy": "pink",
  "silly": "pink",

  "calm": "green",
  "refreshed": "green",
  "relaxed": "green",
  "zen": "green"
}


// See if the user has stored a name for Cheqin to use.
// If such name is stored, use it as part of the greeting.
// If not, ask the user to grant permission using the "actions_intent_PERMISSION" intent
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
  conv.data.userEmotion = String(emotion).toLowerCase();
  const userName = conv.user.storage.userName;
  if (userName) {
    conv.ask(`How exciting, ${userName}! I would love to hear all about it. Care to share your day with me?`);
  } else {
    conv.ask("How exciting! I would love to hear all about it. Care to share your day with me?");
  }
  conv.ask(new Suggestions('Yes', 'No'));
});


// If the user agrees to share his/her day, start recording the content for a potential journal entry.
app.intent("Current Emotion Positive High - yes", (conv) => {
  conv.data.emotionType = "positiveHigh";
  conv.ask("Great! I will listen for as long as you need, and I promise I'm not checking my phone!");
});


// If the user chooses not to share his/her day, say goodbye and end the conversation.
app.intent("Current Emotion Positive High - no", (conv) => {
  conv.close("No worries. Just know that I'm rooting for you out there. I can't wait to talk to you again soon. Bye!");
});


// Normally, the "Default Fallback Intent" is only triggered when Dialogflow
// fails to extract any particular entity from the user's query.
// However, I have designed this intent to also be triggered when the
// user inputs the actual content for the journal entry or when adding tags, 
// because the journal entry itself and the tags typically contains no useful information 
// for Dialogflowo to extract.
// This is made possible using the output context "UserInitiatesEntryLogging" 
// and "UserChoosesToAddTags" from previous intents. 
// When the user query contains this input context, add the followup event accordingly
// so that Dialogflow can redirect the user's query to the correct intent. 
// For any other case, redirect to the actual fallback intent.
app.intent("Default Fallback Intent", (conv) => {
  if (conv.contexts.get("userinitiatesentrylogging")) {
    conv.followup("user_initiated_entry_logging");
  } else if (conv.contexts.get("userchoosestoaddtags")){
    conv.followup("user_choosed_to_add_tags");
  } else {
    conv.followup("final_fallback");
  }
})


// This intent is triggered when Dialogflow senses an active event 
// named "user_iniitated_entry_logging"
// It stores the entry, gives a greeting to the user according to the emotion,
// and asks the user whether a journal entry should be saved.
app.intent("Initiate Potential Journal Entry", (conv) => {
  conv.data.journalEntry = conv.query;
  const userEmotionType = conv.data.emotionType;
  if (userEmotionType === "positiveHigh") {
    conv.ask("Awesome job! I'm glad that you're having such a good day.");
  }
  conv.ask("Before you go, do you want me to save this chat as a journal entry?");
  conv.ask(new Suggestions('Yes', 'No'));
})


// When the user finishes logging the journal entry but chooses to not log it,
// end the conversation.
app.intent("Initiate Potential Journal Entry - no", (conv) => {
  conv.followup("user_finished_conversation");
})


// When the user finishes logging the journal entry but chooses to log it,
// ask about the color for this log.
app.intent("Initiate Potential Journal Entry - yes and prompt color", (conv) => {
  const possibleColor = emotionColors[conv.data.userEmotion];
  conv.ask(`Great! Based on what you told me, I think that you might be feeling ` + 
           `${possibleColor}. Is that correct?`);
  conv.ask(new Suggestions('Yes', 'No'));
})

// When the user confirms that the interpreted color is correct, store the color
// and jump to the intent that prompts the user for tags using the 
// "color_is_saved" event.
app.intent("Correct Color", (conv) => {
  conv.data.storedColor = emotionColors[conv.data.userEmotion];
  conv.followup("color_is_saved");
})

// When the user says the interpreted color is incorrect, apologize and give
// the user suggestions based on the broad emotion type.
app.intent("Incorrect Color", (conv) => {
  conv.ask("Oh, whoops! Sorry, sometimes I still struggle with these human emotions. " +
           "What color would you assign this entry?");
  if (conv.data.emotionType = "positiveHigh") {
    conv.ask(new Suggestions("Yellow", "Purple", "Pink"));
  }
})

// Prompts the user to optionally add tags to a journal entry.
app.intent("Prompt for Tags", (conv) => {
  conv.data.storedColor = emotionColors[conv.data.userEmotion];
  conv.ask(`Okay, the color ${conv.data.storedColor} has been saved! One last thing, ` + 
           `Do you have any tags to add to this entry?`);
  conv.ask(new Suggestions('Yes', 'No'));
})

// If the user chooses not to add tags, end the conversation.
app.intent("Prompt for Tags - no", (conv) => {
  conv.followup("user_finished_conversation");
})

// If the user chooses to add tags, prompt the user to list all the desired tags.
app.intent("Prompt for Tags - yes", (conv) => {
  conv.ask("Okay! Please list any tags you want.");
})

// Triggered when the user wants to add tags, 
// TODO: parse the user input and save it to the conversation data
// and end the conversation.
app.intent("Add Tags", (conv) => {
  const tags = conv.query;
  conv.followup("user_finished_conversation");
})