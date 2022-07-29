export interface PostModel {
    content: string
    create_time: string
    id: string
    like_count: number
    hate_count: number
    comment_count: number
    liked: boolean
    hated: boolean
    sender: UserData
    origin_content?: string
    origin_id?: string
    origin_sender?: UserData
    origin_create_time?: string
}

export interface UserData {
    id: string,
    nick: string,
    avatar_url: string
}

export interface PagingData<T> {
    list: T[],
    page: number,
    next: boolean,
}

export const defaultPaging = <T>(): PagingData<T> => {
    return {
        list: [],
        page: 0,
        next: true,
    }
}

export interface NoticeComment {
    id: string,
    post_id: string,
    read: boolean,
    sender: UserData,
    content: string,
    create_time: string,
    origin_id: string,
    origin: string | null,
    origin_create_time: string | null,
}

export interface NoticePost {
    id: string,
    sender: UserData,
    post_id: string,
    read: boolean,
    content: string | null,
    create_time: string | null,
}

export interface NoticeFriend {
    id: string,
    sender: UserData,
    read: boolean,
    msg: string,
    create_time: string,
}