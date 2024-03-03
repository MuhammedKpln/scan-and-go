import handle_new_message_request_data from "./handle_new_message_request_data.ts";

type RequestData = typeof handle_new_message_request_data._type;

export interface IInsertNewMessageData extends RequestData {
  roomId: string;
}
