export namespace Reddit {
  export type Thing<T = any> = {
    data: T;
    kind: 't1' | 't2' | 't3' | 't4' | 't5' | 't6' | 'Listing';
  };

  // T3
  export type Link = {
    url: string;
    title: string;
    selftext: string;
    selftext_html: string;
    author: string;
    subreddit: string;
    created_utc: number;
    is_gallery?: boolean;
    is_image?: boolean;
    is_video?: boolean;
    link_flair_text?: string;
    likes: boolean | null;
    gallery_data?: {
      items: Array<{
        id: number;
        media_id: string;
      }>;
    };
    media_metadata?: Record<
      string,
      {
        m: string;
      }
    >;
    media?: {
      reddit_video: {
        dash_url: string;
        fallback_url: string;
        width: number;
        height: number;
      };
    };
    score: number;
    num_comments: number;
    id: string;
    sr_detail?: {
      icon_img: string;
      title: string;
    };
  };

  // T1
  export type Comment = {
    id: string;
    name: string;
    body: string;
    body_html: string;
    score: number;
    ups: number;
    downs: number;
    author: string;
    likes: boolean | null;
    replies: Thing<Listing<Comment>>;
    author_is_blocked: boolean;
    author_flair_text?: string;
    profile_img: string;
  };

  export type SubredditInfo = {
    title: string;
    icon_img: string;
    display_name_prefixed: string;
    banner_background_image: string;
    community_icon: string;
    public_description_html: string;
    subscribers: number;
    active_user_count: number;
    created_utc: number;
  };

  export type UserIdentity = {
    is_blocked: boolean;
    is_suspended: boolean;
    subreddit: SubredditInfo;
    icon_img: string;
    snoovatar_img: string;
  };

  export type Listing<T = any> = {
    children: Array<Thing<T>>;
    after?: string;
  };

  export enum Vote {
    Down = -1,
    None = 0,
    Up = 1,
  }

  export type AccessTokenResponse = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    scope: string;
  };

  export type ListingSort = 'top' | 'hot' | 'new' | 'random' | 'rising';
}
