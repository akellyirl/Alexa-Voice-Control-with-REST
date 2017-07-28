/**
 * Alexa Skill basic template
 * 
 * Additional Notes
 * https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/getting-started-guide
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        
        if (event.session.application.applicationId !== "amzn1.ask.skill.29489395-1295-406c-a96f-7e3a019278a2") {
             context.fail("Invalid Application ID");
         }
        

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                        context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                         context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
                + ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
                + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
                + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("GetDownTempIntent" === intentName) {
        GetDownTemp(intent, session, callback);
    }
    else if ("GetUpTempIntent" === intentName) {
        GetUpTemp(intent, session, callback);
    }
    else if ("GetOutTempIntent" === intentName) {
        GetOutTemp(intent, session, callback);
    }
    else if ("GetWaterTempIntent" === intentName) {
        GetWaterTemp(intent, session, callback);
    }
    else if ("GetStatusIntent" === intentName) {
        GetStatus(intent, session, callback);
    }
    else if ("GetDownSetIntent" === intentName) {
        GetDownSet(intent, session, callback);
    }
    else if ("GetUpSetIntent" === intentName) {
        GetUpSet(intent, session, callback);
    }
    else if ("TurnOnIntent" === intentName) {
        TurnOn(intent, session, callback);
    }
    else if ("TurnOffIntent" === intentName) {
        TurnOff(intent, session, callback);
    }
    else if ("HeatWaterIntent" === intentName) {
        HeatWater(intent, session, callback);
    }
    else if ("HeatWaterBathIntent" === intentName) {
        HeatWaterBath(intent, session, callback);
    }
    else if ("SetDownTempFRACIntent" === intentName) {
        SetDownTempFRAC(intent, session, callback);
    }
    else if ("SetDownTempINTIntent" === intentName) {
        SetDownTempINT(intent, session, callback);
    }
    else if ("SetUpTempFRACIntent" === intentName) {
        SetUpTempFRAC(intent, session, callback);
    }
    else if ("SetUpTempINTIntent" === intentName) {
        SetUpTempINT(intent, session, callback);
    }
    else if ("HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    }else{
        throw "Invalid intent";
    }
}


/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
                + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    
    var sessionAttributes = {};
    var cardTitle = "Welcome";
        
    var speechOutput = "Hello, welcome to the Heating Controller.\
    You can ask me things to do with the home heating controller.\
    Try: what's the temperature downstairs? or What is the water temperature?";
 
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Hello? are you there?";
    var shouldEndSession = false;

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function GetDownTemp(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "GetDownTemp";
    var repromptText=null;
    
    GET("tempDOWN",function(response) {    
    var speechOutput = "The down stairs temperature is "+response/10+" degrees";
    
    var shouldEndSession = false;
    
    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function GetUpTemp(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "GetUpTemp";
    var repromptText=null;
    
    GET("tempUP",function(response) {    
    var speechOutput = "The up stairs temperature is "+response/10+" degrees";
    
    var shouldEndSession = false;
    
    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function GetOutTemp(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "GetOUTTemp";
    var repromptText=null;
    
    GET("tempOUT",function(response) {    
    var speechOutput = "The outside temperature is "+response/10+" degrees";
    
    var shouldEndSession = false;
    
    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function GetWaterTemp(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "GetWaterTemp";
    var repromptText=null;
    
    GET("tempWATER",function(response) { 
        var waterInfo = "";
        if(response>500){
            waterInfo = "hot enough for a bath."
        } else if(response>350){
            waterInfo = "hot enough for a shower, but not hot enough for a bath."
        } else {
            waterInfo = "not hot enough for a shower or a bath."
        }
        var speechOutput = "The water temperature is "+response/10+" degrees.\
        The water is "+waterInfo;
    
        var shouldEndSession = false;
    
        callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function GetStatus(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "GetStatus";
    var repromptText=null;
    
    GET("State",function(response) {  
        var stateInfo="";
        switch(response){
        case 0: stateInfo = "Heating is Off."; break;
        case 1: stateInfo = "Heating is On." ; break;
        case 2: stateInfo = "Heating is Off."; break;
        case 3: stateInfo = "Water is Heating for a Shower."; break;
        case 4: stateInfo = "Water is Heating for a Bath."
        }
        var speechOutput = "The "+stateInfo;
        
        var shouldEndSession = false;
        
        callback(sessionAttributes,
                 buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function GetDownSet(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "GetDownSet";
    var repromptText=null;
    
    GET("Setpoint",function(response) {    
    var speechOutput = "The downstairs setpoint is "+response/10+" degrees";
    
    var shouldEndSession = false;
    
    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function GetUpSet(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "GetDownSet";
    var repromptText=null;
    
    GET("SetpointUP",function(response) {    
    var speechOutput = "The upstairs setpoint is "+response/10+" degrees";
    
    var shouldEndSession = false;
    
    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function TurnOn(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "TurnOn";
    var repromptText=null;
    
    POST("STATE:1",function(response) {    
        if (response==1) {
            var speechOutput = "I've turned the heating on.";
        } else {
            var speechOutput = "I'm sorry. The heating has returned an error. I can't turn it on.";
        }
    
    var shouldEndSession = true;
    
    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function TurnOff(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "TurnOff";
    var repromptText=null;
    
    POST("STATE:0",function(response) {   
        if (response==1) {
            var speechOutput = "I've turned the heating off.";
        } else {
            var speechOutput = "I'm sorry. The heating has returned an error. I can't turn it off.";
        }
    
    var shouldEndSession = true;
    
    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function HeatWater(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "HeatWater";
    var repromptText=null;
    
    POST("STATE:3",function(response) {   
        if (response==1) {
            var speechOutput = "I've started to heat the water.";
        } else {
            var speechOutput = "I'm sorry. The heating has returned an error. I can't heat the water.";
        }
    
    var shouldEndSession = true;
    
    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function HeatWaterBath(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "HeatWater";
    var repromptText=null;
    
    POST("STATE:4",function(response) {   
        if (response==1) {
            var speechOutput = "I've started to heat the water for a bath.";
        } else {
            var speechOutput = "I'm sorry. The heating has returned an error. I can't heat the water.";
        }
    
    var shouldEndSession = true;
    
    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function SetDownTempFRAC(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "SetDownTemp";
    var repromptText=null;
    
    POST("SETDOWN:"+intent.slots.DownSetInt.value+"."+intent.slots.DownSetFrac.value, function(response) {   
        if (response==1) {
            var speechOutput = "I've set the downstairs temperature to \
"+intent.slots.DownSetInt.value+" point "+intent.slots.DownSetFrac.value+" degrees";
        } else {
            var speechOutput = "I'm sorry. The heating has returned an error.";
        }
    
    var shouldEndSession = true;
    
    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function SetDownTempINT(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "SetDownTemp";
    var repromptText=null;
    
    POST("SETDOWN:"+intent.slots.DownSetInt.value+".0", function(response) {   
        if (response==1) {
            var speechOutput = "I've set the downstairs temperature to "+intent.slots.DownSetInt.value+" degrees.";
        } else {
            var speechOutput = "I'm sorry. The heating has returned an error.";
        }
    
    var shouldEndSession = true;
    
    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function SetUpTempFRAC(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "SetUpTemp";
    var repromptText=null;
    
    POST("SETUP:"+intent.slots.UpSetInt.value+"."+intent.slots.UpSetFrac.value, function(response) {   
        if (response==1) {
            var speechOutput = "I've set the upstairs temperature to \
"+intent.slots.UpSetInt.value+" point "+intent.slots.UpSetFrac.value+" degrees";
        } else {
            var speechOutput = "I'm sorry. The heating has returned an error.";
        }
    
    var shouldEndSession = true;
    
    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function SetUpTempINT(intent,session,callback){
    var sessionAttributes = {};
    var cardTitle = "SetDownTemp";
    var repromptText=null;
    
    POST("SETUP:"+intent.slots.UpSetInt.value+".0", function(response) {   
        if (response==1) {
            var speechOutput = "I've set the upstairs temperature to "+intent.slots.UpSetInt.value+" degrees.";
        } else {
            var speechOutput = "I'm sorry. The heating has returned an error.";
        }
    
    var shouldEndSession = true;
    
    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });
}

function GET(cmd,response) {
    var https = require('https');
    
    var url = 'https://api.particle.io/v1/devices/1b1b1b1/\
'+cmd+'\
?access_token=3e3e3e3e';
    
    https.get(url, function(res) {
      var body = '';
      res.on('data', function(chunk) {
        body += chunk;
      });
      res.on('end', function() {
    	var jsData = JSON.parse(body);
    	response(jsData.result);
      });
    }).on('error', function(e) {
      console.log("Got error: " + e.message);
    }); 
}

function POST(cmd,response) {

    var qs = require("querystring");
    var http = require("https");

    var options = {
  "method": "POST",
  "hostname": "api.spark.io",
  "port": null,
  "path": "/v1/devices/1b1b1b1/SetVal",
  "headers": {
    "content-type": "application/x-www-form-urlencoded",
    "cache-control": "no-cache",
    "postman-token": "15c6f62d-afde-291f-8dcc-5b1abd7eeec9"
  }
};

    var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
    chunks.push(chunk);
  });

    res.on("end", function () {
        var body = Buffer.concat(chunks);
        var jsData = JSON.parse(body);
        response(jsData.return_value);
      });
});

    req.write(qs.stringify({ access_token: '3e3e3e3e',
  params: cmd }));
    req.end();
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
           // title: "SessionSpeechlet - " + title,
           // content: "SessionSpeechlet - " + output
            title:  title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    }
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}

