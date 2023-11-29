import { Alert } from "../types/Alert";
import { BroadcastedAlert, BroadcastedMessage } from "../types/BroadcastTypes";
import { handleIncomingAlert } from "./NotificationHandler";

interface WindowChannelHolder extends Window { listeningChannel?: BroadcastChannel; }
declare let window: WindowChannelHolder;

/**
 * This function will return the current window's channel that we listen and send messages on
 * this has been done just so it has a wrapper in typescript and we can expand on 
 * it making sure we don't create new instances of a channel with the same id,
 * in the real world you would do something similar to this.
 * @returns The global instance of the window's broadcast channel.
 */
export function getBroadcastChannel(): BroadcastChannel {

    // We are checking if an instance exists
    if (!window.listeningChannel) {
        // Since there is no global instance, we will initialize one.
        window.listeningChannel = new BroadcastChannel('alerts');
        window.listeningChannel.onmessage = listenForEvents;
    }

    // Return the found/created instance
    return window.listeningChannel;
}

/**
 * The main function that will handle listening for events.
 */
function listenForEvents(msg: MessageEvent) {
    let parsedMessage: BroadcastedMessage | null = null;

    try {
        if ( typeof msg.data == 'string' )
            parsedMessage = JSON.parse(msg.data) as BroadcastedMessage;
    } catch (err) {
        // This behaviour is completely up to you, I chose to ignore them
        // on the premise that if the message has not been parsed the
        // way I was expecting them then I shouldn't address them.
        console.warn(`Failed to parse message, ignoring...`, { msg });
    }

    // If the message has failed to be parsed, ignore it.
    if (parsedMessage == null) return;

    // The switch case is part of the message container logic, this should be expanded upon
    // with different methods to register functions to run this event against, I chose to simply
    // hard-code the function that should trigger inside of here.
    switch (parsedMessage.messageType) {
        case 'ALERT':
            handleIncomingAlert(parsedMessage as BroadcastedAlert);
            return;

        // You can implement as many event types as you wish in here, you can also
        // exchange the switch case for a simple Map<MessageType, Array<(BroadcastMessage) => void>>
        // but I wanted to keep it as bare bones as possible.

        default:
            console.warn(`Orphan message type:`, parsedMessage);
            return;
    }

}

export function broadcastAlert(alertData: Alert): void {
    // Fetch the window's channel so we can broadcast to it.
    const chan = getBroadcastChannel();

    // Wrap our Broadcast Message
    const broadcastMessage: BroadcastedAlert = {
        data: alertData,
        messageType: 'ALERT',
    }

    // Send out the broadcast through the channel.
    chan.postMessage(JSON.stringify(broadcastMessage));
}