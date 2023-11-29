import { Alert } from "./Alert"

/**
 * This is a "global" wrapper for any messages sent over through this system, so we have at least
 * a level of type safety, establishing a system where all messages sent through broadcast channels 
 * based on the "messageType" we will decode the type of message this is.
 */
export interface BroadcastedMessage {
    data: any,
    messageType: 'ALERT' | 'SOMETHING_ELSE'
}

/**
 * This interface extends the BroadcastMessage but it has one single messageType and a single data type, now this
 * can be done like this or you can simply pass the data to the proper function, I simply wanted to demonstrate
 * you can also do it this way.
 */
export interface BroadcastedAlert extends BroadcastedMessage {
    data: Alert,
    messageType: 'ALERT'
}