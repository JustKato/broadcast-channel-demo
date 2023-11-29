export type AlertType = "info" | "warning" | "error";

export interface Alert {
    title: string;
    message: string;
    type: AlertType;
    timeout: number;
}