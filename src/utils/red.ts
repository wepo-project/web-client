import client from "../axios/client";
import { UnreadMsg } from "../data";
import { NotificationTree } from "./notificationTree";

const root = NotificationTree.root(['notification', 'me']);
const notification = root.expand('notification', ['comments','friend_add','friend_remove','hates','likes']);
const me = root.expand('me', ['followers']);

export const red = {
    root,
    notification,
    me,
    /** 获取未读消息 */
    getUnreadMsg: async function () {
        const resp = await client.get('msg', 'unread')
        if (resp.status == 200 && resp.data && Object.keys(resp.data).length) {
            const data = resp.data as UnreadMsg;
            notification.$.comments.setValue(data.comments);
            notification.$.friend_add.setValue(data.friend_add);
            notification.$.friend_remove.setValue(data.friend_remove);
            notification.$.hates.setValue(data.hates);
            notification.$.likes.setValue(data.likes);
        }
    }
}

; (window as any).red = red;