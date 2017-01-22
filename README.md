# Alexa-Voice-Control-with-REST
Amazon Echo voice control of a RESTful smart home heating controller

<h1>REST</h1>

Just like your web browser fetches a web page or posts a form over HTTP, REST is a way of using standard HTTP transactions, to interface with network services. REST is required to work without prior knowledge of your system or remembering what transactions you've completed previously ;( i.e. it is client-server based, and stateless), so it's future proof and scalable. 

In the context of IoT devices the REST endpoint is typically an action to be performed by a network device; e.g. to tell a light to turn on in a hypothetical cloud based smart home control service:

https://mycloudservice/myhome/lights/kitchen/on

typically there would be some authentication:

https://mycloudservice/myhome/lights/kitchen/on?access_token=34abcdef2

The response from the server would be a JSON formatted payload over HTTP: e.g.
<pre>{
  "cmd": "LightOn",
  "result": "OK",
}</pre>

A RESTful API is how we'll interface with the IoT device.  In this case, a Smart Home Thermostat, <a href="http://www.akellyirl.com/smart-home-iot-thermostat/">take a look here</a>.

&nbsp;
<h1>Voice Control</h1>
There are basically two things you need to do to voice enable your IoT device for use with an Echo or Echo Dot:

1    Create a <span style="color: #0000ff;">Lambda Function</span>

2    Setup a <span style="color: #0000ff;">Custom Skill</span>

The <span style="color: #0000ff;">Lambda function</span> is an Amazon Web Service (AWS) that allows you to write the function to handle the requests that come from Alexa. The Lambda function can be written in Node-js, Java or Python. It's available to run 24/7 and is hosted on Amazon's servers. In our situation it will handle the RESTful interface with the IoT device.

The <span style="color: #0000ff;">Custom Skill</span> consists of configuring the Actions you want to take ("Device Directives" in AWS speak), and the words you'll say to Alexa to trigger those Actions ("Utterances" in AWS speak). It performs the task of triggering the Lambda function when you speak a phrase to your Echo Dot that matches a trigger phrase.

For more details see here: http://www.akellyirl.com/2017/01/15/alexa-skills-aws-lambda-and-rest-how-to-voice-enable-your-iot-device-with-echo-dot/

