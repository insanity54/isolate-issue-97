
export = futurenet;
export as namespace futurenet;

declare namespace futurenet {

    type RecordingState = 'pending' | 'recording' | 'aborted' | 'ended' 


    interface IMuxAsset {
        id: number;
        attributes: {
            playbackId: string;
            assetId: string;
        }
    }

    interface IPagination {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    }

    interface IMuxAssetResponse {
        data: IMuxAsset;
        meta: IMeta;
    }

    interface IMeta {
        pagination: IPagination;
    }



    interface IPlatformNotification {
        id: number;
        attributes: {
            source: string;
            platform: string;
            date: string;
            date2: string;
            vtuber: number;
        }
    }

    interface IPlatformNotificationResponse {
        data: IPlatformNotification;
        meta: IMeta;
        error?: any;
    }

    interface IStream {
        id: number;
        attributes: {
            date: string;
            date2: string;
            archiveStatus: 'good' | 'issue' | 'missing';
            vods: IVodsResponse;
            cuid: string;
            vtuber: IVtuberResponse;
            tweet: ITweetResponse;
            isChaturbateStream: boolean;
            isFanslyStream: boolean;
            platformNotifications: IPlatformNotification[];
        }
    }

    interface IStreamResponse {
        data: IStream;
        meta: IMeta;
        error?: any;
    }

    interface IStreamsResponse {
        data: IStream[];
        meta: IMeta;
    }


    interface IVtuber {
        id: number;
        attributes: {
            slug: string;
            displayName: string;
            chaturbate?: string;
            twitter?: string;
            patreon?: string;
            twitch?: string;
            tiktok?: string;
            onlyfans?: string;
            youtube?: string;
            linktree?: string;
            carrd?: string;
            fansly?: string;
            pornhub?: string;
            discord?: string;
            reddit?: string;
            throne?: string;
            instagram?: string;
            facebook?: string;
            merch?: string;
            vods: IVod[];
            description1: string;
            description2?: string;
            image: string;
            imageBlur?: string;
            themeColor: string;
            fanslyId?: string;
            chaturbateId?: string;
            twitterId?: string;
        }
    }

    interface IVtuberResponse {
        data: IVtuber;
        meta: IMeta;
    }

    interface IVtubersResponse {
        data: IVtuber[];
        meta: IMeta;
    }

    type NotificationData = {
        isMatch: boolean;
        url?: string;
        platform?: string;
        channel?: string;
        displayName?: string;
        date?: string;
        userId?: string | null;
        avatar?: string;
    };
}