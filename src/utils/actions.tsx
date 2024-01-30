import { User, Snapshot, ThirdPerson } from './types';
import counter from './counter';

/*
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

  interface ThirdPerson {
    username: string; //username
    id: string; //pk
    profilePicUrl: string;  //profile_pic_url
    fullName: string; //full_name
  }

  interface Snapshot {
    timestamp: Date;
    userid: string;
    followers: ThirdPerson[];
    following: ThirdPerson[];
  }

*/

function unfollowUser(id: string) {
  // Placeholder code, replace with actual implementation
  const url = `https://www.instagram.com/api/v1/friendships/destroy/${id}/`;
  try {
    fetch(url, {
      method: 'POST',
      headers: {
        'x-csrftoken': 'csrftoken',
        'x-instagram-ajax': 'ajax',
        'x-ig-app-id': 'app_id',
        'x-ig-www-claim': '0',
        'x-requested-with': 'XMLHttpRequest',
      },
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log(error));

  } catch (error) {
    console.log(error);
  }

}


function ResetStorage() {
  chrome.storage.sync.clear();
  chrome.storage.local.clear();
}

function InitStorage() {
  chrome.storage.sync.set({ enabled: false });
  chrome.storage.sync.set({ users: Array<User>() });
  chrome.storage.sync.set({ snapshots: Array<Snapshot>() });
}

function getUsersFromStorage(): Promise<User[]> {
  return new Promise<User[]>((resolve, reject) => {
    chrome.storage.sync.get('users', (data) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      const users = data.users || [];
      resolve(users);
    });
  });
}

function addUserToStorage(user: User): Promise<User[]> {

  return new Promise<User[]>((resolve, reject) => {
    getUsersFromStorage()
      .then((users) => {

        // Check if user already exists
        const userExists = users.find((u) => u.username === user.username);

        if (userExists) {
          // Update user
          const index = users.indexOf(userExists);
          users[index] = user;
        }
        else {
          // Add user
          users.push(user);
        }

        chrome.storage.sync.set({ users }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }
          resolve(users);
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function fetchUserFromAPI(username: string): Promise<User> {
  const fetchUrl = `https://www.instagram.com/${username}/?__a=1&__d=dis`;
  

  try {
    const response = await fetch(fetchUrl);
    const json = await response.json();

    const graphql = json?.graphql;
    const useritem = json?.graphql?.user;

    const user = useritem?.user;
    console.log(json);

    if (graphql === undefined || user === undefined) {
      throw new Error('graphql is undefined');
    }

    if (!user) {
      throw new Error('user is undefined');
    }

    const newUser: User = {
      username: user.username,
      id: user.id,
      profilePicUrl: user.profile_pic_url,
      isPrivate: user.is_private,
      isVerified: user.is_verified,
      fullName: user.full_name,
      biography: user.biography,
      externalUrl: user.external_url,
      followedByCount: user.edge_followed_by.count,
      followCount: user.edge_follow.count,
    };

    console.log(newUser);

    return newUser;
  } catch (error) {
    throw error;
  }
}

async function fetchUserFromSearchAPI(username: string): Promise<User> {
  const fetchUrl = `https://www.instagram.com/web/search/topsearch/?context=blended&query=${username}&rank_token=0.3953592318270893&include_reel=true`;
    try {
      const response = await fetch(fetchUrl);
      const json = await response.json();

      const users = json?.users;
      const user = json?.users[0]?.user;

      console.log(json);

      if (users === undefined || user === undefined) {
        throw new Error('graphql is undefined');
      }

      if (!user) {
        throw new Error('user is undefined');
      }

      const newUser: User = {
        username: user?.username,
        id: user?.id,
        profilePicUrl: user?.profile_pic_url,
        isPrivate: user?.is_private,
        isVerified: user?.is_verified,
        fullName: user?.full_name,
        biography: user?.biography,
        externalUrl: "https://www.instagram.com/" + user?.username,
        followedByCount: 0,
        followCount: 0,
      };

      console.log(newUser);
      
      return newUser;

    } catch (error) {
      throw error;
    }
  
}


function getSnapshotsFromStorage(): Promise<Snapshot[]> {
  return new Promise<Snapshot[]>((resolve, reject) => {
    chrome.storage.local.get('snapshots', (data) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
        return;
      }

      const snapshots = data.snapshots || [];
      resolve(snapshots);
    });
  });
}

function addSnapshotToStorage(snapshot: Snapshot): Promise<Snapshot[]> {

  return new Promise<Snapshot[]>((resolve, reject) => {
    getSnapshotsFromStorage()
      .then((snapshots) => {

        // Check if snapshot already exists with same userid and timestamp
        const snapshotExists = snapshots.find((s: Snapshot) => s.userid === snapshot.userid && s.timestamp === snapshot.timestamp);

        if (snapshotExists) {
          // Update snapshot
          const index = snapshots.indexOf(snapshotExists);
          snapshots[index] = snapshot;
        }
        else {
          // Add snapshot
          snapshots.push(snapshot);
        }

        chrome.storage.local.set({ snapshots }, () => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
            return;
          }
          resolve(snapshots);
        });

      }
      )
      .catch((error) => {
        reject(error);
      });
  }
  );
}

async function createSnapshot(user: User): Promise<Snapshot> {

  var userId = Number(user.id);
  console.log(userId);

  var snapshot: Snapshot = {
    timestamp: new Date(),
    userid: user.id,
    followers: [] as ThirdPerson[],
    following: [] as ThirdPerson[],
  };

  await counter(userId).then((data) => {
    // CREATE SNAPSHOT

    data?.followers?.forEach((f: any) => {
      snapshot.followers.push({
        username: f?.username,
        id: f?.pk,
        profilePicUrl: f?.profile_pic_url,
        fullName: f?.full_name,
      });
    });

    data?.following?.forEach((f: any) => {
      snapshot.following.push({
        username: f?.username,
        id: f?.pk,
        profilePicUrl: f?.profile_pic_url,
        fullName: f?.full_name,
      });
    });


  }).then(() => {
    addSnapshotToStorage(snapshot);
  });

  return snapshot;
}

async function createSnapshotFromUsername(username: string, userid: string): Promise<Snapshot> {

  var userId = Number(userid);
  console.log(userId);

  var snapshot: Snapshot = {
    timestamp: new Date(),
    userid: userid,
    followers: [] as ThirdPerson[],
    following: [] as ThirdPerson[],
  };

  await counter(userId).then((data) => {
    // CREATE SNAPSHOT

    data?.followers?.forEach((f: any) => {
      snapshot.followers.push({
        username: f?.username,
        id: f?.pk,
        profilePicUrl: f?.profile_pic_url,
        fullName: f?.full_name,
      });
    });

    data?.following?.forEach((f: any) => {
      snapshot.following.push({
        username: f?.username,
        id: f?.pk,
        profilePicUrl: f?.profile_pic_url,
        fullName: f?.full_name,
      });
    });


  }).then(() => {
    addSnapshotToStorage(snapshot);
  });

  return snapshot;
}


function getUserSnapshots(user: User): Promise<Snapshot[]> {
  return new Promise<Snapshot[]>((resolve, reject) => {
    getSnapshotsFromStorage()
      .then((snapshots) => {
        const userSnapshots = snapshots.filter((s) => s.userid === user.id);
        resolve(userSnapshots);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export {
  ResetStorage,
  InitStorage,
  getUsersFromStorage,
  addUserToStorage,
  fetchUserFromAPI,
  getSnapshotsFromStorage,
  addSnapshotToStorage,
  createSnapshot,
  getUserSnapshots,
  unfollowUser,
  fetchUserFromSearchAPI,
  createSnapshotFromUsername,
};
