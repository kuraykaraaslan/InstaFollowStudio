
import getUserFriendshipStats from "./snapshot";
import { User, ThirdPerson, Snapshot } from './types';




const _getUsers = async () => {
    return new Promise<User[]>((resolve) => {
        chrome.storage.sync.get('users', (data) => {
            resolve(data.users || []);
        });
    });
};

function _pushNewUser(user: User) {
    return new Promise<User[]>((resolve) => {
        chrome.storage.sync.get('users', (data) => {
            const users = data.users || [];
            users.push(user);
            chrome.storage.sync.set({ users: users }, () => {
                resolve(users);
            });
        });
    }
    );
}


function _removeUser(user: User) {
    return new Promise<User[]>((resolve) => {
        chrome.storage.sync.get('users', (data) => {
            const users = data.users || [];
            const index = users.findIndex((u: User) => u.id === user.id);
            users.splice(index, 1);
            chrome.storage.sync.set({ users: users }, () => {
                resolve(users);
            });
        });
    });
}

function _updateUserVariables(user: User, variables: Partial<User>) {
    return new Promise<User[]>((resolve) => {
        chrome.storage.sync.get('users', (data) => {
            const users = data.users || [];
            const index = users.findIndex((u: User) => u.id === user.id);
            users[index] = { ...users[index], ...variables };
            chrome.storage.sync.set({ users: users }, () => {
                resolve(users);
            });
        });
    }
    );

}

function updateOrCreateUser(username: string): Promise<User> {

    const fetchUrl = `https://www.instagram.com/${username}/?__a=1&__d=dis`;

    let JsonInput: { graphql: any; } | null = null;

    return fetch(fetchUrl).then(
        (response) => {
            return response.text().then((body) => {
                JsonInput = JSON.parse(body);

                const graphql = JsonInput?.graphql;

                if (!graphql) {
                    throw new Error('Invalid input');
                }

                const users = _getUsers();

                return users.then((users: User[]) => {
                    const index = users.findIndex((u: User) => u.id === graphql.user.id);

                    if (index === -1) {
                        const user = _createUser(JsonInput);
                        _pushNewUser(user);
                        return user;
                    }

                    // Update user variables
                    const user = users[index];

                    _updateUserVariables(user, {
                        username: graphql.user.username,
                        profilePicUrl: graphql.user.profile_pic_url,
                        isPrivate: graphql.user.is_private,
                        isVerified: graphql.user.is_verified,
                        fullName: graphql.user.full_name,
                        biography: graphql.user.biography,
                        externalUrl: graphql.user.external_url,
                        unfollow: graphql.user.edge_followed_by.count,
                        follow: graphql.user.edge_follow.count,
                    });
                    
                    return user;

                }
                );
            }
            );
        }
    );
}




function _addSnapshot(user: User, snapshot: Snapshot) {
    return new Promise<User[]>((resolve) => {
        chrome.storage.sync.get('users', (data) => {
            const users = data.users || [];
            const index = users.findIndex((u: User) => u.id === user.id);
            users[index].snapshots.push(snapshot);
            chrome.storage.sync.set({ users: users }, () => {
                resolve(users);
            });
        });
    });
}



function _isUserExist(id: string) {
    return new Promise<boolean>((resolve) => {
        chrome.storage.sync.get('users', (data) => {
            const users = data.users || [];
            const index = users.findIndex((u: User) => u.id === id);
            resolve(index !== -1);
        });
    }
    );
}


function _getUser(id: string) {
    return new Promise<User>((resolve) => {
        chrome.storage.sync.get('users', (data) => {
            const users = data.users || [];
            const index = users.findIndex((u: User) => u.id === id);
            resolve(users[index]);
        });
    }
    );
}

function _createUser(JsonInput: any): User {

    const graphql = JsonInput?.graphql;
    const user = JsonInput?.graphql?.user;

    if (!graphql) {
        throw new Error('Invalid input');
    }

    return {
        username: user.username,
        id: user.id,
        profilePicUrl: user.profile_pic_url,
        isPrivate: user.is_private,
        isVerified: user.is_verified,
        fullName: user.full_name,
        biography: user.biography,
        externalUrl: user.external_url,
        snapshots: [
            {
                timestamp: Date.now(),
                followers: [],
                following: [],
            },
        ],
        unfollow: user.edge_followed_by.count,
        follow: user.edge_follow.count,
    };
}

function checkInUserList(user: User) {
    return new Promise<boolean>((resolve) => {
        chrome.storage.sync.get('users', (data) => {
            const users = data.users || [];
            const index = users.findIndex((u: User) => u.id === user.id);
            resolve(index !== -1);
        });
    }
    );
}


function _getUserByUsername(username: string) {
    return new Promise<User>((resolve) => {
        chrome.storage.sync.get('users', (data) => {
            const users = data.users || [];
            const index = users.findIndex((u: User) => u.username === username);
            resolve(users[index]);
        });
    }
    );
}


function _getLastSnapshot(user: User) {
    if (user.snapshots.length === 0) {
        return null;
    }

    return user.snapshots[user.snapshots.length - 1];
}

function createSnapshot(user: User) {

    var userId = Number(user.id);

    getUserFriendshipStats(userId).then((data) => {
        // CREATE SNAPSHOT

        var snapshot: Snapshot = {
            timestamp: Date.now(),
            followers: data.followers,
            following: data.following,
        };

        _addSnapshot(user, snapshot);
    }
    );
}




export {
    _addSnapshot,
    _isUserExist,
    _getUser,
    _createUser,
    _getUserByUsername,
    _getLastSnapshot,
    createSnapshot,
    _getUsers,
    _pushNewUser,
    _removeUser,
    _updateUserVariables,
    updateOrCreateUser,
};

