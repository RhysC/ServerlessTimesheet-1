# ServerlessTimesheet
Timsheets on the Serverless stack

You will need NPM installed
Serverless should be installed globally via NPM (currently 1.0.0. rc) 
(all cli commands are assumed to be executed from project root)
To install the dependencies run:
```
>> npm install
```

AWS expects a credentials file under your user profile eg (C:\Users\rhysc\.aws\credentials) with
```
aws_access_key_id={your access key}
aws_secret_access_key={your secret}
```
You will need a AWS account. You may need to provide a credit card. NB Given my (rhysc) usage is so low, I am yet to pay for anything.
In the .vscode/launch.json  i have set an env var to allow using a non default credential store in the credentials file : "AWS_PROFILE":"serverless-rhystest_dev"

To deploy (using the credentials above):
```
>> serverless deploy
```

On completion of deployment you will see a post endpoint that you can hit with a sample payload, eg:
```
>>curl -X POST https://randomprefix.execute-api.ap-southeast-2.amazonaws.com/dev/timesheet --header "Content-Type: application/json" -d @samplepayloads/createTimesheetPayload.json
```
be sure to replace the url with what was provided. You should receive a response with a success message and a timesheet id


### Hints and notes
Mocha is used as the test framework, seems to be most popular, so lets roll with that.
https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/

Favouring using NPM as the build tool unitll we really need more. see: https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/

### Build server
Using LambCI for build automation : https://github.com/lambci/lambci
Github tken is under RHYSC account "LambCi-Matcha-ServerlessTimesheets"
Slack channel broadcasts the build notiifcations 
    Org : matcha-io
    channel : lambci-build
I blindly created this in the Nth Virgina region (us-east-1), shouldnt be a big drama, unless you are browsing the console for 
Stack       LambCi-Matcha-ServerlessTimesheets
Stack ID:   arn:aws:cloudformation:us-east-1:032574790532:stack/LambCi-Matcha-ServerlessTimesheets/71e3e1d0-7d7e-11e6-9df7-5044763dbb7b*