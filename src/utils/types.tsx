interface ThirdPerson {
    username: string; //username
    id: string; //pk
    profilePicUrl: string;  //profile_pic_url
    fullName: string; //full_name
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
    followedByCount: number; //graphql.user.edge_followed_by.count
    followCount: number; //graphql.user.edge_follow.count
}


interface Snapshot {
    timestamp: Date;
    userid: string;
    followers: ThirdPerson[];
    following: ThirdPerson[];
}


export type { User, Snapshot, ThirdPerson };