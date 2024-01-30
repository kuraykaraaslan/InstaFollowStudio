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
    user_id: number,
    count = 50,
    next_max_id = "",
) => {
    let url = `https://www.instagram.com/api/v1/friendships/${user_id}/${list}/?count=${count}`;
    console.log(url);
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
const getFollowers = (user_id: number, count = 50, next_max_id = "") => {
    return concatFriendshipsApiResponse("followers", user_id, count, next_max_id);
};

const getFollowing = (user_id: number, count = 50, next_max_id = "") => {
    return concatFriendshipsApiResponse("following", user_id, count, next_max_id);
};



const counter = async (id: number) => {
    const followers = await getFollowers(id); // Fetch followers data asynchronously using the getFollowers function
    const following = await getFollowing(id); // Fetch following data asynchronously using the getFollowing function

    const followersUsernames = followers.map((follower : any) =>
        follower.username.toLowerCase(), // Extract and lowercase the usernames from the followers data
    );
    const followingUsernames = following.map((followed : any) =>
        followed.username.toLowerCase(), // Extract and lowercase the usernames from the following data
    );

    const followerSet = new Set(followersUsernames); // Create a unique set of lowercase follower usernames
    const followingSet = new Set(followingUsernames); // Create a unique set of lowercase following usernames

    console.log(Array(28).fill("-").join("")); // Print a line of dashes
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

    return {
        followers,
        following,
    };
};


export default counter;
