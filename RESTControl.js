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
    else if ("TurnOnIntent" === intentName) {
        TurnOn(intent, session, callback);
    }
    else if ("SetDownTempFRACIntent" === intentName) {
        SetDownTempFRAC(intent, session, callback);
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
    
    var shouldEndSession = true;
    
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


function GET(cmd,response) {
    var https = require('https');
    
    var url = 'https://api.particle.io/v1/devices/1234fffe/\
'+cmd+'\
?access_token=dada1234';
    
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
    var http = require("https");

    var options = {
      "method": "POST",
      "hostname": "api.spark.io",
      "port": null,
      "path": "/v1/devices/1234fffe/SetVal?access_token=dada1234",
      "headers": {
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
        "cache-control": "no-cache",
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
    
    req.write("------WebKitFormBoundary7MA4YWxkTrZu0gW\r\nContent-Disposition: form-data;\
 name=\"params\"\r\n\r\n"+cmd+"\r\n------WebKitFormBoundary7MA4YWxkTrZu0gW--");
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
