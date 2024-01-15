'use client';
import { useState, useEffect } from 'react'
import getElementByXpath from '../helpers';

import { _getUsers, User } from '../utils/profiles';



interface PopupProps {
  users: User[];
}


const isActivated = async () => {
  return new Promise((resolve) => {
    chrome.storage.sync.get('enabled', (data) => {
      resolve(data.enabled || false);
    });
  });
}

const isInstagram = async () => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url || '';
      resolve(url.includes('instagram.com'));
    });
  }
  );
}

function setEnabled(): Promise<void> {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.set({ enabled: true }, () => {
      resolve();
    });
    //refresh
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url || '';
      chrome.tabs.update(tabs[0].id, { url: url });
    });
    window.close();
  });
}

function setDisabled(): Promise<void> {
  return new Promise<void>((resolve) => {
    chrome.storage.sync.set({ enabled: false }, () => {
      resolve();
    });
    //refresh
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0].url || '';
      chrome.tabs.update(tabs[0].id, { url: url });
    });
    window.close();
  });
}


const changeToInstagram = async () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url || '';
    if (url.includes('instagram.com')) {
      // This tab is already on Instagram, you can perform additional actions if needed.
      chrome.tabs.executeScript({
        code: 'alert("Already on Instagram!")',
      });
    } else {
      // Navigate to Instagram
      chrome.tabs.update(tabs[0].id, { url: 'https://www.instagram.com/' });
      // Close the popup
      window.close();
    }
  });
};

export const Popup = () => {

  const [selectedUser, setSelectedUser] = useState<User>();
  const [activated, setActivated] = useState(false);
  const [instagram, setInstagram] = useState(false);


  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const checkActivated = async () => {
      const activated = await isActivated();
      setActivated(activated as boolean);
    };
    checkActivated();
  }, []);

  useEffect(() => {
    const checkInstagram = async () => {
      const instagram = await isInstagram();
      setInstagram(instagram as boolean);
    };
    checkInstagram();
  }, []);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const selectedUserId = event.target.value;
    const selectedUser = users.find((user) => user.id === selectedUserId);
    setSelectedUser(selectedUser);
  }

  useEffect(() => {
    const getUsers = async () => {
      const users = await _getUsers();
      setUsers(users);
      setSelectedUser(users[0]);
    };
    getUsers();
  }
    , []);


  return (

    <div className="grid grid-rows-1 p-2">
      <div className="pb-2">
        {/* Title */}
        <p className="text-lg font-bold mb-1">
          Instagram Follow Studio
        </p>
        {/* Subtext */}
        <p className="text-white">Control your people</p>
      </div>
      <div className="pb-2">

        {/* Full-width Select */}

        <div className="mb-4">
          <div className="flex rounded-lg shadow-sm">
            <span className="px-4 inline-flex items-center min-w-fit rounded-l-md bg-gray-50 text-sm text-black">Username:</span>
            <select className="w-full bg-white border border-white rounded-r-md p-2 text-black" disabled={users.length === 0} onChange={handleChange}>
              {/* Options go here */}
              {users.length === 0 && <option value="0">No users found</option>}
              {users && users.map((user) => {
                return <option value={user.id}>{user.username}</option>;
              }
              )}
            </select>
          </div>
        </div>

        {/* Input */}

        {/* Table */}
        <table className="w-full border border-gray-300 table-fixed rounded mb-4">
          <thead>
            <tr className="rounded rounded-t-lg bg-white text-black">
              {/* Table header cells go here */}
              <th className="p-2">Followers</th>
              <th className="p-2">Following</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* Table data cells go here */}
              <td className="p-2 border border-gray-300">{selectedUser?.unfollow || "N/A"}</td>
              <td className="p-2 border border-gray-300">{selectedUser?.follow || "N/A"}</td>
            </tr>
            {/* Add more rows as needed */}
          </tbody>
        </table>

        {/* Button */}

        <div className="flex justify-between items-end">
          {activated && instagram && <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={setDisabled}>
            Deactivate
          </button>}

          {!activated && instagram && <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={setEnabled}>
            Activate
          </button>}

          {!instagram && <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded" onClick={changeToInstagram}>
            Open Instagram
          </button>}

          <div className="justify-self-end">
            <p className="text-end font-bold">Created by <a href='https://kuray.dev' target='_blank'>kuray.dev</a> with ❤️</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Popup