import React , {useState, useEffect} from 'react';

import getElementByXpath from '../helpers';

import { User } from '../utils/types';

function setDisabled(): Promise<void> {
    return new Promise<void>((resolve) => {
        chrome.storage.sync.set({ enabled: false }, () => {
            resolve();
        });
        //refresh
        window.location.reload();
    });
}

/**
 * Renders the navigation bar component.
 * 
 * @param {any} user - The user object.
 * @returns {JSX.Element} The rendered navigation bar.
 */
const NavBar = (user: any) => {

    return (
        <div className="navbar bg-base-100 h-16 mb-4 rounded shadow-lg">
            <div className="flex-1">
                <a className="btn btn-ghost text-xl">Insta Follow Studio</a>
            </div>
            <div className="flex-1">
                <button className="btn" onClick={setDisabled}>Return to Instagram</button>
            </div>
            <div className="flex-none gap-2">
                <span className="text-lg font-bold">{user?.fullName || 'Loading...'}</span>

                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full">
                            <img alt="Tailwind CSS Navbar component"  src={user?.profilePicUrl || ''} />
                        </div>
                    </div>
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                        <li><a onClick={setDisabled} className="bg-red-500 hover:bg-base-200">Return to normal</a></li>
                    </ul>
                </div>
            </div>
        </div>

    )
}

export default NavBar;