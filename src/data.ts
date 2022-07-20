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

export interface NoticeComment {
    content: string,
    create_time: string,
    id: string,
    post_id: string,
    read: boolean,
    sender: UserData,
    origin: string,
    origin_id: string,
    origin_create_time: string,
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
        next: false,
    }
}