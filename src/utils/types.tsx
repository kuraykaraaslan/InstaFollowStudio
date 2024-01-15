interface ThirdPerson {
    username: string; //graphql.user.username
    id: string; //graphql.id
    profilePicUrl: string; //graphql.user.profile_pic_url
    isPrivate: boolean; //graphql.user.is_private
    isVerified: boolean; //graphql.user.is_verified

    fullName: string; //graphql.user.full_name
    biography: string; //graphql.user.biography
    externalUrl: string; //graphql.user.external_url

    unfollow: number; // graphql.user.edge_followed_by.count
    follow: number; // graphql.user.edge_follow.count
}


interface User {
    username: string; //graphql.user.username
    id: string; //graphql.user.id
    profilePicUrl: string; //graphql.user.profile_pic_url
    isPrivate: boolean; //graphql.user.is_private
    isVerified: boolean;

    fullName: string; //graphql.user.full_name
    biography: string; //graphql.user.biography
    externalUrl: string; //graphql.user.external_url
    snapshots: {
        timestamp: number;
        followers: ThirdPerson[];
        following: ThirdPerson[];
    }[];

    unfollow: number; //graphql.user.edge_followed_by.count
    follow: number; //graphql.user.edge_follow.count

}


interface Snapshot {
    timestamp: number;
    followers: ThirdPerson[];
    following: ThirdPerson[];
}


export type { User, Snapshot, ThirdPerson };