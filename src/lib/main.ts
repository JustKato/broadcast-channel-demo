import { broadcastAlert, getBroadcastChannel } from "./pkg/BroadcastHandler";
import { Alert, AlertType } from "./types/Alert";

// Make sure we have a channel, this will automatically initialize it and listen for events on it.
getBroadcastChannel();


// #region DEBUG_VARIABLES
    (window as any).activeChannel = getBroadcastChannel();
    console.log(`Intiialized Channel:`, (window as any).activeChannel);
    (window as any).broadcastAlert = broadcastAlert;
// #endregion

document.addEventListener(`DOMContentLoaded`, () => {

    // The id will always reference a form element.
    const formRef: null | HTMLFormElement = document.getElementById(`alert-creation-form`) as (null | HTMLFormElement);
    // If no form was found, cancel out.
    if ( !formRef ) return;

    // Whenever someone submits the form...
    formRef.addEventListener(`submit`, (formSubmitEvent: SubmitEvent) => {
        // Do not go to the URL ( In our case a GET to the current page )
        formSubmitEvent.preventDefault();

        // Get the formData from our form
        const formData: FormData = new FormData(formRef);

        // Parse the data into our usable format
        const alertData: Alert = {
            title:   (formData.get(`title`) ?? 'Invalid Title') as string,
            message: (formData.get('message') ?? 'Invalid Message') as string,
            type:    (formData.get('type') ?? 'info') as AlertType,
            timeout: Number(formData.get('timeout')) || 5,
        }

        // Broadcast the alert to the other windows.
        broadcastAlert(alertData);
    })
});