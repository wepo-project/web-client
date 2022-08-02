import { NotificationTree } from "./notificationTree";

const root = NotificationTree.root(['notification', 'me']);

export const red = {
    root,
    notification: root.expand('notification', ['comment', 'like']),
    me: root.expand('me', ['followers']),
}

; (window as any).red = red;