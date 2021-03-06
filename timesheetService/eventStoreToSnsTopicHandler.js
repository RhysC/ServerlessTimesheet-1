"use strict";
let AWS = require("aws-sdk");
let sns = new AWS.SNS({ apiVersion: "2010-03-31" });
var parse = AWS.DynamoDB.Converter.output;
let topicArn = null;

module.exports.handler = (event, context, callback) => {
  setTopicArn(context);
  let mapped_records = event.Records.map(parseToPublishableEvent);
  for (let mapped_record of mapped_records) {
    console.log({ "Message": "Publishing event", "params": mapped_record });
    sns.publish(mapped_record, function (err, data) {
      if (err) {
        console.error("sns.publish failed:");
        console.error(err, err.stack);
        callback(err);
        return;
      }
      else {
        console.log("sns.publish success:");
        console.log(data);
      }
    });
  }
  callback(null, `Successfully processed ${event.Records.length} records.`);
};

function setTopicArn(context) {
  if (topicArn === null) {
    let accountId = context.invokedFunctionArn.split(":")[4];
    topicArn = `arn:aws:sns:${process.env.REGION}:${accountId}:${process.env.SERVICE}-sns-topic`;
  }
}
function parseToPublishableEvent(dynamoDbStreamRecord) {
  let record = parse({ "M": dynamoDbStreamRecord.dynamodb.NewImage });//Convert the DynamoDb NewImage stream record to a useable JSON object that represents what we actually wanterd to persist
  if (record.hasOwnProperty("eventsMetadata") && record.eventsMetadata.hasOwnProperty("sourceLambdaEvent")) {
    delete record.eventsMetadata.sourceLambdaEvent;//We really dont (or at least should not) care about this in downstream handlers and its just message bloat
  }
  let businessEventAsObject = JSON.parse(record.event);
  record.event = businessEventAsObject;
  return {
    Message: JSON.stringify(record),
    TopicArn: topicArn
  };
}