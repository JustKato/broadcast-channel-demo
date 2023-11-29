import { Alert } from "../types/Alert";
import { BroadcastedAlert } from "../types/BroadcastTypes";

export function handleIncomingAlert(alertMessage: BroadcastedAlert) {
    console.log(`Caught Alert BroadcastMessage Event:`, alertMessage);
    showNotification(alertMessage.data);
}

export function showNotification(alert: Alert) {
    const container = document.getElementById("toast-container");
    const toast = document.createElement("div");
    toast.classList.add("toast", alert.type);

    const header = document.createElement("div");
    header.classList.add("toast-header");
    header.textContent = alert.title;

    const body = document.createElement("div");
    body.classList.add("toast-body");
    body.textContent = alert.message;

    toast.appendChild(header);
    toast.appendChild(body);
    container?.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("hide");
        toast.addEventListener('transitionend', () => toast.remove());
    }, Math.min(alert.timeout * 1000, 30000)); // Up to 30 seconds to show an alert.
}