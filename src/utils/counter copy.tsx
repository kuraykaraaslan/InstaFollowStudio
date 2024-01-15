const fetchOptions = {
    credentials: "include",
    headers: {
        "X-IG-App-ID": "936619743392459",
    },
    method: "GET",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min)) + min;

// This function handles all of the pagination logic
// Calls the API recursively until there are no more pages to load
const concatFriendshipsApiResponse: any = async (
    list: any,
    user_id: any,
    count = 50,
    next_max_id = "",
) => {
    let url = `https://www.instagram.com/api/v1/friendships/${user_id}/${list}/?count=${count}`;
    if (next_max_id) {
        url += `&max_id=${next_max_id}`;
    }

    const data = await fetch(url, fetchOptions as any).then((r) => r.json());

    if (data.next_max_id) {
        const timeToSleep = random(800, 1500);
        console.log(
            `Loaded ${data.users.length} ${list}. Sleeping ${timeToSleep}ms to avoid rate limiting`,
        );

        await sleep(timeToSleep);

        return data.users.concat(
            await concatFriendshipsApiResponse(
                list,
                user_id,
                count,
                data.next_max_id,
            ),
        );
    }

    return data.users;
};

// helper methods to make the code a bit more readable
const getFollowers = (user_id: string, count = 50, next_max_id = "") => {
    return concatFriendshipsApiResponse("followers", user_id, count, next_max_id);
};

const getFollowing = (user_id: string, count = 50, next_max_id = "") => {
    return concatFriendshipsApiResponse("following", user_id, count, next_max_id);
};



const getUserFriendshipStats = async (id: string) => {
    const user_id = id;

    const followers = await getFollowers(user_id);
    const following = await getFollowing(user_id);

    const followersUsernames = followers.map((follower : any) =>
        follower.username.toLowerCase(),
    );
    const followingUsernames = following.map((followed : any) =>
        followed.username.toLowerCase(),
    );

    const followerSet = new Set(followersUsernames);
    const followingSet = new Set(followingUsernames);

    console.log(Array(28).fill("-").join(""));
    console.log(
        `Fetched`,
        followerSet.size,
        "followers and ",
        followingSet.size,
        " following.",
    );

    console.log(
        `If this doesn't seem right then some of the output might be inaccurate`,
    );

    const PeopleIDontFollowBack = Array.from(followerSet).filter(
        (follower) => !followingSet.has(follower),
    );

    const PeopleNotFollowingMeBack = Array.from(followingSet).filter(
        (following) => !followerSet.has(following),
    );

    return {
        followers,
        following,
        PeopleIDontFollowBack,
        PeopleNotFollowingMeBack,
    };
};


export default getUserFriendshipStats;