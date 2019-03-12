// Written by Thomas Huang
// Webhook functions that handle Cheqin's features and provide customized responses

// To get surface capabilities: conv.surface["capabilities"]["list"]

'use strict';

// Import the Dialogflow module from the Actions on Google client library.
const {
  dialogflow,
  Permission,
  Suggestions,
  BasicCard,
} = require('actions-on-google');

// Import the firebase-functions package for deployment.
const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Initializing the connection between this webhook and our firebase DB
admin.initializeApp()

// Instantiate the Dialogflow client.
const app = dialogflow({debug: true});

// Set the DialogflowApp object to handle the HTTPS POST request.
exports.dialogflowFirebaseFulfillment = functions.https.onRequest(app);


// All supported emotions and their corresponding color
const emotionColors = {
  "energetic": "yellow", "hyper": "yellow", "manic": "yellow",

  "active": "purple", "focused": "purple", "motivated": "purple", 
  "productive": "purple",

  "happy": "pink", "excited": "pink", "overjoy": "pink", "silly": "pink",

  "calm": "green", "refreshed": "green", "relaxed": "green", "zen": "green",

  "normal": "white", "neutral": "white", "uneventful": "white",

  "depressed": "blue", "sad": "blue", "emotional": "blue", 
  "gloomy": "blue", "weepy": "blue",

  "exhausted": "gray", "tired": "gray", "fatigued": "gray",
  "lethargic":"gray", "lazy":"gray", "sleepy":"gray",

  "stressed": "black",

  "anxious":"orange", "nervous":"orange", "insecure": "orange",

  "angry": "red", "annoyed": "red", "frustrated": "red", "irritable": "red"
}

// Used when the user is curious about what the color means
const colorExplanations = {
  "yellow": "energetic, hyper or manic.",
  "purple": "active, focused, motivated or productive.",
  "pink": "happy, excited, overjoyed or even slightly silly.",
  "green": "calm, refreshed, relaxed or zen.",
  "white": "normal, average, neutral or uneventful.",
  "blue": "depressed, sad, emotional, gloomy or weepy.",
  "gray": "exhausted, tired, fatigued, lethargic, lazy or sleepy.",
  "black": "stressed.",
  "orange": "anxious, nervous or insecure.",
  "red": "angry, annoyed, frustrated or irritable."
}


// ----- BEGIN INTENT LOGIC ----- //



// See if the user has stored a name for Cheqin to use.
// If such name is stored, use it as part of the greeting.
// If not, ask for permission using the "actions_intent_PERMISSION" intent
app.intent("Default Welcome Intent", (conv) => {
  const name = conv.user.storage.userName;
  conv.data.initiatedTime = String(Date.now());
  conv.data.repromptCount = 0;
  conv.data.journalContent = [];

  if (!name) {
    conv.data.journalContent.push(createConvEntry("Hi there, to get to know you better, I'll just need to get your name from Google. Is that ok?", false))
    conv.ask(new Permission({
      context: "Hi there, to get to know you better",
      permissions: 'NAME',
    }));
  } else {
    automatedAsk(conv,`Hi again, ${name}. How are you feeling right now?`, false, false);
    conv.ask(new Suggestions('Happy', 'Excited', 'Calm', 'Anxious', 'Sad', 'Angry', 'Stressed', 'Tired'));
  }
});


// This intent is triggered when the user provides something that's unrelated to any
// currently supported emotions. The intent will be matched to at most three times
// before terminating the conversation altogether.
app.intent("Default Welcome Intent - fallback", conv => {
  conv.data.repromptCount += 1;
  if (conv.data.repromptCount === 1) {
    automatedAsk(conv,"Sorry, but I didn't get that. How are you feeling right now?");
    conv.ask(new Suggestions('Happy', 'Excited', 'Calm', 'Anxious', 'Sad', 'Angry', 'Stressed', 'Tired'));
  } else if (conv.data.repromptCount === 2) {
    automatedAsk(conv, "I'm really sorry, but do you mind telling me " +
    "how are you feeling right now one more time?");
    conv.ask(new Suggestions('Happy', 'Excited', 'Calm', 'Anxious', 'Sad', 'Angry', 'Stressed', 'Tired'));
  } else if (conv.data.repromptCount === 3) {
    conv.followup("failed_fallback");
  }
})


// Prompts the user to allow access to the user's name stored in the Google Account
// If permission is granted, use that name as part of the greeting.
// If not, continue anyways and use a neutral greeting.
app.intent("actions_intent_PERMISSION", (conv, params, permissionGranted) => {
  if (!permissionGranted) {
    automatedAsk(conv,"Ok, no worries. How are you feeling right now?");
  } else {
    conv.user.storage.userName = conv.user.name.display;
    automatedAsk(conv,`Thanks, ${conv.user.storage.userName}. How are you feeling right now?`);
  }
  conv.ask(new Suggestions('Happy', 'Excited', 'Calm'));

});


app.intent("actions_intent_CLEAR_DATA", conv => {
  conv.user.storage = {};
  automatedAsk(conv,"Okay, I cleared your data. You can store any new information in the next chat session.");
})


// This intent is matched when the user gives a response like "I need to talk to
// you later" at anytime of the conversation. When matched, this intent makes the
// agent gracefully say goodbye to the user while storing the existing unfinished
// conversation to our database for future use.
app.intent("actions_intent_HALFWAY_CANCEL", (conv) => {
  // TODO: Determine the type of data to store to our database.
  // The following is just some half-baked code that doesn't do much...  
  admin.firestore().collection("users")
    .doc(conv.user._id)
    .collection("logs")
    .doc(conv.data.initiatedTime)
    .set({
      "state": "unfinished",
      "conversation": "I don't know how to do this yet..."
  })
  conv.followup("initiated_halfway_cancel");
})



// ----- FROM THIS POINT ON, THE INITIAL GREETING IS FINISHED ----- // 



// This intent matches all of the positive emotions with high energy.
// After the user provides an emotion, prompt the user to share his/her day.
app.intent("Current Emotion Positive High", (conv, {emotion}) => {
  conv.data.userEmotion = String(emotion).toLowerCase();
  conv.data.repromptCount = 0;
  conv.contexts.delete("defaultwelcomeintent-followup");

  const userName = conv.user.storage.userName;
  if (userName) {
    automatedAsk(conv,`How exciting, ${userName}! I would love to hear all about it. ` +
             `Care to share your day with me?`);
  } else {
    automatedAsk(conv,"How exciting! I would love to hear all about it. " +
             "Care to share your day with me?");
  }
  conv.ask(new Suggestions('Yes', 'No'));
});


// This intent matches all of the positive emotions with low energy.
// After the user provides an emotion, prompt the user to share his/her day
// based on the particular emotion
app.intent("Current Emotion Positive Low", (conv, {emotion}) => {
  conv.data.userEmotion = String(emotion).toLowerCase();
  conv.data.repromptCount = 0;
  conv.contexts.delete("defaultwelcomeintent-followup");

  if (emotionColors[conv.data.userEmotion] === "white") {
    automatedAsk(conv,"Oh, that's interesting. Would you like to talk about it?");
  } else {
    automatedAsk(conv,"Oh, how interesting. I would love to hear more about it. " +
             "Care to share your day with me?");
  }
  conv.ask(new Suggestions('Yes', 'No'));
});


// If the user agrees to share his/her day, start recording the content 
// for a potential journal entry.
app.intent("Current Emotion Positive High - yes", (conv) => {
  conv.data.emotionType = "positiveHigh";
  automatedAsk(conv,"Great! I will listen for as long as you need, " +
           "and I promise I'm not checking my phone!");
});

app.intent("Current Emotion Positive Low - yes", (conv) => {
  conv.data.emotionType = "positiveLow";
  automatedAsk(conv,"Okay! Feel free to talk as long as you want, " +
           "because I'm here for you.");
});


// These fallback intents are matched when the users gives something other than
// yes or no. 
app.intent(["Current Emotion Positive High - fallback", 
            "Current Emotion Positive Low - fallback"], conv => {
  conv.data.repromptCount += 1;
  if (conv.data.repromptCount === 1) {
    automatedAsk(conv,"Sorry, but I didn't get that. " +
    "Would you like to share your day with me?");
    conv.ask(new Suggestions('Yes', 'No'))
  } else if (conv.data.repromptCount === 2) {
    automatedAsk(conv,"I must have misheard something. " +
    "Do you want to share your day with me?");
    conv.ask(new Suggestions('Yes', 'No'))
  } else if (conv.data.repromptCount === 3) {
    conv.followup("failed_fallback");
  }
});


// If the user chooses not to share his/her day, say goodbye and end the conversation.
app.intent(["Current Emotion Positive High - no", "Current Emotion Positive Low - no"],
  conv => {
  automatedAsk(conv,"No worries. Just know that I'm rooting for you out there. " +
             "I can't wait to talk to you again soon. Bye!", true);
  updateDatabase(conv)
});


// This intent matches all of the negative emotions with high energy.
// After the user provides an emotion, prompt the user to choose an option.
app.intent("Current Emotion Negative High", (conv, {emotion}) => {
  conv.data.userEmotion = String(emotion).toLowerCase();
  conv.data.repromptCount = 0;
  conv.contexts.delete("defaultwelcomeintent-followup");
  conv.data.emotionType = "negativeHigh";

  automatedAsk(conv,"If you want to vent, I would be happy to listen. I also have some " +
           "tips and tricks to help you calm down. What sounds best to you?");
  conv.ask(new Suggestions('Listen', 'Tips'));
});


// These fallback intents are matched when the users gives something other than
// something about venting or tips. 
app.intent("Current Emotion Negative High - fallback", conv => {
  conv.data.repromptCount += 1;
  if (conv.data.repromptCount === 1) {
    automatedAsk(conv,"Sorry, but I didn't get that. " +
    "I would be happy to listen, and I also have some tips to help. " +
    "Which one do you prefer?");
    conv.ask(new Suggestions('Listen', 'Tips'));
  } else if (conv.data.repromptCount === 2) {
    automatedAsk(conv,"I must have misheard something. " +
    "I can either listen to you or provide some tips. " +
    "Which one do you like better?");
    conv.ask(new Suggestions('Listen', 'Tips'));
  } else if (conv.data.repromptCount === 3) {
    conv.followup("failed_fallback");
  }
});


// This intent matches all of the negative emotions with low energy.
// After the user provides an emotion, prompt the user to choose an option.
app.intent("Current Emotion Negative Low", (conv, {emotion}) => {
  conv.data.userEmotion = String(emotion).toLowerCase();
  conv.data.repromptCount = 0;
  conv.contexts.delete("defaultwelcomeintent-followup");
  conv.data.emotionType = "negativeLow";

  automatedAsk(conv,"I am here for you. I would be happy to listen, or I have some " +
           "techniques to help you lift your spirits. What sounds best to you?");
  conv.ask(new Suggestions('Vent', 'Listen', 'Tips'));
});


// These fallback intents are matched when the users gives something other than
// something about venting or tips. 
app.intent("Current Emotion Negative Low - fallback", conv => {
  conv.data.repromptCount += 1;
  if (conv.data.repromptCount === 1) {
    automatedAsk(conv,"Sorry, but I didn't get that. " +
    "I would be happy to listen, and I also have some techniques to help you " +
    "lift your spirit. Which one do you prefer?");
    conv.ask(new Suggestions('Listen', 'Techniques'));
  } else if (conv.data.repromptCount === 2) {
    automatedAsk(conv,"I must have misheard something. " +
    "I can either listen to you or provide some techniques. " +
    "Which one do you like better?");
    conv.ask(new Suggestions('Listen', 'Techniques'));
  } else if (conv.data.repromptCount === 3) {
    conv.followup("failed_fallback");
  }
});


// If the user agrees to share his/her day, start recording the content 
// for a potential journal entry.
app.intent("Current Emotion Negative High - listen", (conv) => {
  conv.data.repromptCount = 0;
  conv.contexts.delete("currentemotionnegativehigh-followup"); 
  if (conv.query === "reroute_to_entry_negative_high") {
    automatedAsk(conv, "Great! I will listen for as long as you need, " +
      "and I promise I'm not checking my phone!", false, false);
  } else {
    automatedAsk(conv, "Great! I will listen for as long as you need, " +
      "and I promise I'm not checking my phone!");
  }
  
});

app.intent("Current Emotion Negative Low - listen", (conv) => {
  conv.data.repromptCount = 0;
  conv.contexts.delete("currentemotionnegativewow-followup");
  if (conv.query === "reroute_to_entry_negative_low") {
    automatedAsk(conv, "Great! I will listen for as long as you need, " +
      "and I promise I'm not checking my phone!", false, false);
  } else {
    automatedAsk(conv, "Great! I will listen for as long as you need, " +
      "and I promise I'm not checking my phone!");
  }
});


// This intent is triggered when the user wants some tips for negative emotions
app.intent(["Current Emotion Negative High - help",
            "Current Emotion Negative Low - help"], conv => {
  conv.data.repromptCount = 0;
  conv.data.journalContent.push(createConvEntry(conv.query));
  if (conv.data.emotionType === "negativeHigh") {
    conv.contexts.delete("currentemotionnegativehigh-followup");
  } else {
    conv.contexts.delete("currentemotionnegativelow-followup");
  }
  conv.followup("initiated_tips");
});


// We are using contextualized fallback intents to fetch the complete 
// journal entry, because there are no set entities for Dialogflow to extract. 
// After listening to the user entry, save the complete content as part of the 
// conversation-specific data, and activate the "user_initiated_entry_logging" event.
app.intent(["Current Emotion Positive High - yes - fallback", 
            "Current Emotion Positive Low - yes - fallback",
            "Current Emotion Negative High - listen - fallback",
            "Current Emotion Negative Low - listen - fallback"], (conv) => {
  conv.data.repromptCount = 0;
  conv.data.journalEntry = conv.query;
  conv.data.journalContent.push(createConvEntry(conv.query));
  conv.followup("user_initiated_entry_logging");
});




// ----- FROM THIS POINT ON, THE CONVERSATION IS AWARE OF THE USER EMOTION ----- //


// This intent is triggered when the user is feeling negative emotions and asks
// Cheqin for tips. It can only be triggered when previous intents activate the 
// "initiated_tips" event.
app.intent("Initiate Tips Session", (conv) => {
  // This is only for the demo. Actual logic will be emotion dependent in the future.
  automatedAsk(conv, "Okay. You’ve told me before you like to listen to music and go " +
  "for jogs when you want to calm down. Would you like to try one of those?", false, false);
  conv.ask(new Suggestions('Yes', 'No'));
})


// This intent is triggered when the user wants to hear some tips after the prompt.
app.intent("Initiate Tips Session - yes", (conv) => {
  // Ain't gonna work for demo purposes because we can't actually connect to things yet.
  conv.data.repromptCount = 0;
  conv.contexts.delete("initiatetipssession-followup");
  automatedAsk(conv, "Whoops, this ain't supported right now. Byeeee---", true);
})

// This intent is triggered when the user does not want to hear tips after the prompt.
app.intent("Initiate Tips Session - no", (conv) => {
  conv.data.repromptCount = 0;
  conv.contexts.delete("initiatetipssession-followup");
  conv.data.journalContent.push(createConvEntry(conv.query));
  conv.followup("tips_finished");
})

// This fallback intent is matched when the users gives something not related
// to wanting tips.
app.intent("Initiate Tips Session - fallback", (conv) => {
  conv.data.repromptCount += 1;
  if (conv.data.repromptCount === 1) {
    automatedAsk(conv,"Sorry, but I didn't get that. " +
    "Would you like to try listening to music and going for jogs?");
    conv.ask(new Suggestions('Yes', 'No'));
  } else if (conv.data.repromptCount === 2) {
    automatedAsk(conv,"I must have misheard something. " +
    "Do you maybe want to listen to some music and go for a jog?");
    conv.ask(new Suggestions('Yes', 'No'));
  } else if (conv.data.repromptCount === 3) {
    conv.followup("failed_fallback");
  }
})




// This intent is matched when the user finishes the tips session. Cheqin
// will ask if the user wants to create a journal entry after receiving the tips
app.intent("Prompt for Journal Entry after Tips", (conv) => {
  conv.data.repromptCount = 0;
  conv.contexts.delete("initiatetipssession-followup");
  automatedAsk(conv, "Talking about an issue is another great way of dealing " + 
  "with emotions. Would you like to talk to me about what's going on?", false, false);
  conv.ask(new Suggestions('Yes', 'No'));
})


// This intent is matched when the user chooses to create a journal entry after
// receiving the tips
app.intent("Prompt for Journal Entry after Tips - yes", (conv) => {
  conv.data.repromptCount = 0;
  conv.contexts.delete("promptforjournalentryaftertips-followup");
  conv.data.journalContent.push(createConvEntry(conv.query));

  if (conv.data.emotionType === "negativeHigh") {
    conv.contexts.set("CurrentEmotionNegativeHigh-followup", 2);
    conv.followup("reroute_to_entry_negative_high");
  } else {
    conv.contexts.set("CurrentEmotionNegativeLow-followup", 2);
    conv.followup("reroute_to_entry_negative_low");
  }
})

// This intent is matched when the user chooses to not create a journal entry after
// receiving the tips
app.intent("Prompt for Journal Entry after Tips - no", (conv) => {
  conv.data.repromptCount = 0;
  conv.contexts.delete("promptforjournalentryaftertips-followup");
  automatedAsk(conv, "No worries, and please know I'm here to listen any time you " + 
  "want! I can't wait to talk to you again soon. Bye!", true);
  
  // This log should probably not be uploaded to the database? There's no color and no entry
  //updateDatabase(conv);
})


// This fallback intent is matched when the users gives something not related
// to creating a journal entry after receiving tips.
app.intent("Prompt for Journal Entry after Tips - fallback", (conv) => {
  conv.data.repromptCount += 1;
  if (conv.data.repromptCount === 1) {
    automatedAsk(conv,"Sorry, but I didn't get that. " +
    "Would you like to talk to me about what's going on?");
    conv.ask(new Suggestions('Yes', 'No'));
  } else if (conv.data.repromptCount === 2) {
    automatedAsk(conv,"I must have misheard something. " +
    "Do you want to create a journal entry with me?");
    conv.ask(new Suggestions('Yes', 'No'));
  } else if (conv.data.repromptCount === 3) {
    conv.followup("failed_fallback");
  }
})



// This intent is triggered when Dialogflow senses an active event 
// named "user_iniitated_entry_logging"
// It stores the entry, gives a greeting to the user according to the emotion,
// and asks the user whether a journal entry should be saved.
app.intent("Initiate Potential Journal Entry", (conv) => {
  conv.data.repromptCount = 0;
  const userEmotionType = conv.data.emotionType;
  if (userEmotionType === "positiveHigh") {
    automatedAsk(conv, "Awesome job! I'm glad that you're having such a good day. ", false, false);
  } else if (userEmotionType === "positiveLow") {
    automatedAsk(conv, "Awesome! It sounds like you day has a lot of potential. ", false, false);
  } else if (userEmotionType === "negativeHigh") {
    automatedAsk(conv, "Thanks for letting me listen to you. A lot of times, venting can be one of the best ways to " +
    "relieve anger and frustration. ", false, false);
  } else if (userEmotionType === "negativeLow") {
    automatedAsk(conv, "Thanks for sharing with me. I hope that this helped, even a little. Please dedicate some " +
        "time to self-care today -- you deserve it.");
  }
  automatedAsk(conv, " Before you go, do you want me to save this chat as a journal entry?", false, false);
  conv.ask(new Suggestions('Yes', 'No'));
})


// This intent is triggered when the user provides something that's unrelated to saving
// the journal entry. The intent will be matched to at most three times
// before terminating the conversation altogether.
app.intent("Initiate Potential Journal Entry - fallback", conv => {
  conv.data.repromptCount += 1;
  if (conv.data.repromptCount === 1) {
    automatedAsk(conv, "I didn't get that. Want me to save this chat as a journal entry?");
    conv.ask(new Suggestions('Yes', 'No'));
  } else if (conv.data.repromptCount === 2) {
    automatedAsk(conv, "I'm really sorry, but do you want to save this chat as a journal entry?")
    conv.ask(new Suggestions('Yes', 'No'));
  } else if (conv.data.repromptCount === 3) {
    conv.followup("failed_fallback");
  }
})


// When the user finishes logging the journal entry but chooses to not log it,
// end the conversation.
app.intent("Initiate Potential Journal Entry - no", (conv) => {
  conv.data.journalContent.push(createConvEntry(conv.query));
  conv.followup("user_finished_conversation");
})


// When the user finishes logging the journal entry but chooses to log it,
// ask about the color for this log.
app.intent("Initiate Potential Journal Entry - yes", (conv) => {
  conv.data.journalContent.push(createConvEntry(conv.query));
  conv.followup("prompt_for_color");
})



// ----- FROM THIS POINT ON, THE CONVERSATION STARTS HANDLING COLOR ----- //



// When the user finishes logging the journal entry and chooses to log it,
// ask about the color for this log.
app.intent("Prompt For Color", conv => {
  conv.data.repromptCount = 0;
  conv.contexts.delete("initiatepotentialjournalentry-followup");
  const possibleColor = emotionColors[conv.data.userEmotion];
  automatedAsk(conv, `Great! Based on what you told me, I think that you might be feeling ` +
           `${possibleColor}. Is that correct?`, false, false);
  conv.ask(new Suggestions('Yes', 'No', `What's ${possibleColor}`));
})


// This intent is triggered when the user provides something that's unrelated to saving
// the journal entry's color. The intent will be matched to at most three times
// before terminating the conversation altogether.
app.intent("Prompt For Color - fallback", conv => {
  conv.data.repromptCount += 1;
  const possibleColor = emotionColors[conv.data.userEmotion];
  if (conv.data.repromptCount === 1) {
    automatedAsk(conv,`I didn't get that. Do you think you are feeling ${possibleColor}?`);
    conv.ask(new Suggestions('Yes', 'No', `What's ${possibleColor}`));
  } else if (conv.data.repromptCount === 2) {
    automatedAsk(conv,`I'm really sorry. I think you are feeling ${possibleColor}` +
    "Is that correct?");
    conv.ask(new Suggestions('Yes', 'No', `What's ${possibleColor}`));
  } else if (conv.data.repromptCount === 3) {
    conv.followup("failed_fallback");
  }
})


// When the user confirms that the interpreted color is correct, store the color
// and jump to the intent that prompts the user for tags using the 
// "color_is_saved" event.
app.intent("Prompt For Color - yes", conv => {
  conv.data.repromptCount = 0;
  conv.data.storedColor = emotionColors[conv.data.userEmotion];
  conv.contexts.delete("promptforvolor-followup");
  conv.data.journalContent.push(createConvEntry(conv.query));
  conv.followup("color_is_saved");
})


// This intent is matched when the user is uncertain of what a particular color means.
app.intent("Prompt For Color - color clarification", conv => {
  conv.data.repromptCount = 0;
  const possibleColor = emotionColors[conv.data.userEmotion];
  automatedAsk(conv, `${possibleColor} means that you might be feeling ` +
  `${colorExplanations[possibleColor]} Is this color correct?`);
  conv.ask(new Suggestions('Yes', 'No'));
})


// When the user says the interpreted color is incorrect, apologize and give
// the user suggestions based on the broad emotion type.
app.intent("Prompt For Color - no", (conv) => {
  conv.data.repromptCount = 0;
  conv.contexts.delete("promptforcolor-followup");
  automatedAsk(conv,"Oh, whoops! Sorry, sometimes I still struggle with these human emotions. " +
           "What color would you assign this entry?");
  if (conv.data.emotionType = "positiveHigh") {
    conv.ask(new Suggestions("Yellow", "Purple", "Pink"));
  } else if (conv.data.emotionType = "positiveLow") {
    conv.ask(new Suggestions("White", "Green"));
  } else if (conv.data.emotion = "negativeHigh") {
    conv.ask(new Suggestions("Orange", "Black", "White"));
  } else if (conv.data.emotion = "negativeLow") {
    conv.ask(new Suggestions("Gray", "Blue"));
  }
})


// This intent is matched when the user says the intepreted color is incorrect
// and proceeds to give the correct color
app.intent("Prompt For Color - no - custom", (conv, {color}) => {
  conv.data.storedColor = String(color).toLowerCase();
  conv.data.journalContent.push(createConvEntry(conv.query));
  conv.followup("color_is_saved");
})


// This intent is triggered when the user provides something that's unrelated to saving
// the journal entry's corrected color. The intent will be matched to at most three times
// before terminating the conversation altogether.
app.intent("Prompt For Color - no - fallback", conv => {
  conv.data.repromptCount += 1;
  if (conv.data.repromptCount === 3) {
    conv.followup("failed_fallback");
    return;
  } else {
    if (conv.data.repromptCount === 1) {
      automatedAsk(conv,"I didn't get that. ");
    } else if (conv.data.repromptCount === 2) {
      automatedAsk(conv,"I'm really sorry, but I missed that. ");
    }
    automatedAsk(conv, "What color would you assign this entry?");
    if (conv.data.emotionType = "positiveHigh") {
      conv.ask(new Suggestions("Yellow", "Purple", "Pink"));
    } else if (conv.data.emotionType = "positiveLow") {
      conv.ask(new Suggestions("White", "Green"));
    } else if (conv.data.emotion = "negativeHigh") {
      conv.ask(new Suggestions("Orange", "Black", "White"));
    } else if (conv.data.emotion = "negativeLow") {
      conv.ask(new Suggestions("Gray", "Blue"));
    }
  }
})



// ----- FROM THIS POINT ON, THE CONVERSATION STARTS HANDLING TAGS ----- //



// Prompts the user to optionally add tags to a journal entry.
app.intent("Prompt for Tags", (conv) => {
  conv.data.repromptCount = 0;
  automatedAsk(conv, `Okay, the color ${conv.data.storedColor} has been saved! One last thing: ` +
           `do you have any tags to add to this entry?`, false, false);
  conv.ask(new Suggestions('Yes', 'No'));
})


// This intent is triggered when the user provides something that's unrelated to saving
// the journal entry's tags. The intent will be matched to at most three times
// before terminating the conversation altogether.
app.intent("Prompt For Tags - fallback", conv => {
  conv.data.repromptCount += 1;
  if (conv.data.repromptCount === 1) {
    automatedAsk(conv,"I didn't get that. Do you have any tags to add this entry?");
    conv.ask(new Suggestions('Yes', 'No'));
  } else if (conv.data.repromptCount === 2) {
    automatedAsk(conv,"Sorry, I missed it. Would you like to add ant tags to this entry?");
    conv.ask(new Suggestions('Yes', 'No'));
  } else if (conv.data.repromptCount === 3) {
    conv.followup("failed_fallback");
  }
})


// If the user chooses not to add tags, end the conversation.
app.intent("Prompt for Tags - no", (conv) => {
  conv.data.journalContent.push(createConvEntry(conv.query));
  conv.followup("user_finished_conversation");
})


// If the user chooses to add tags, prompt the user to list all the desired tags.
app.intent("Prompt for Tags - yes", (conv) => {
  automatedAsk(conv,"Okay! Please list any tags you want.");
})


// Triggered when the user wants to add tags, 
// TODO: parse the user input and save it to the conversation data
// and end the conversation.
app.intent("Prompt for Tags - yes - fallback", (conv) => {
  const tags = conv.query;
  conv.data.journalContent.push(createConvEntry(conv.query));
  conv.followup("user_finished_conversation");
})




// This intent is matched when the user wants to log something and finishes inputting
// all the desired parameters.
app.intent("End Conversation Normally", conv => {
  const userEmotionType = conv.data.emotionType;
  if (userEmotionType === "positiveHigh" || userEmotionType === "positiveLow") {
    automatedAsk(conv, "Okay! Well I'm glad that I was able to listen to you. Bye!", true, false);
  } else {
    automatedAsk(conv, "Okay! Well I'm glad that I was able to listen to you, " +
    "and I hope it helped, even just a little. Please log with me again soon. Bye!", true, false);
  }
  updateDatabase(conv);
})



// ----- END CONVERSATION LOGIC ----- //
// ----- START HELPER FUNCTIONS ----- //

// This function will automatically save the response from the user, and then say a response. It will also automatically
// close the conversation if the "close" flag is set to true
function automatedAsk(conv, content, close = false, needUserResp = true) {
  if (needUserResp) {
    conv.data.journalContent.push(createConvEntry(conv.query));
  }
  conv.data.journalContent.push(createConvEntry(content, false));

  if (!close) {
    conv.ask(content);
  } else {
    conv.close(content);
  }
}

function createConvEntry(content, fromUser = true) {
  return {
    "content": content,
    "fromUser": fromUser,
    "timestamp": new Date()
  };
}

function updateDatabase(conv) {
  let method = "speaker";
  let surfaceCapabilities = conv.surface["capabilities"]["list"];
  for (let i = 0; i < surfaceCapabilities.length; i++) {
    if (surfaceCapabilities[i]["name"] === "actions.capability.SCREEN_OUTPUT") {
      method = "assistant-app";
      break;
    }
  }

  admin.firestore().collection("users")
    .doc(conv.user._id)
    .collection("logs")
    .doc(conv.data.initiatedTime)
    .set({
      "chatLog": conv.data.journalContent,
      "color": conv.data.storedColor,
      "journalEntry": conv.data.journalEntry,
      "method": method,
      "tags": []
    });
}