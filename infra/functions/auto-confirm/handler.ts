import {
  PostConfirmationConfirmSignUpTriggerEvent,
  PostConfirmationTriggerEvent,
  PostConfirmationTriggerHandler,
  PreSignUpTriggerHandler
} from "aws-lambda";

const handler: PreSignUpTriggerHandler = async event => {
  event.response.autoVerifyEmail = true;
  event.response.autoConfirmUser = true;

  return event;
};

export { handler };
