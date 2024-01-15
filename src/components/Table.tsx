import React, { useState, useEffect } from 'react';

import { createSnapshot, _getLastSnapshot } from '../utils/profiles';
import { User, Snapshot, ThirdPerson } from '../utils/types';



const SinglThirdPerson = (user: ThirdPerson) => {

    return (
        <tr>
            <th>
                <label>
                    <input type="checkbox" className="checkbox" />
                </label>
            </th>
            <td>
                <div className="flex items-center gap-3">
                    <div className="avatar">
                        <div className="mask mask-squircle w-12 h-12">
                            <img src={user?.profilePicUrl || ''} />
                        </div>
                    </div>
                    <div>
                        <div className="font-bold">{user?.fullName || 'Loading...'}</div>
                        <div className="text-sm opacity-50">{user?.username || 'Loading...'}</div>
                    </div>
                </div>
            </td>
            <td>
                {user?.biography || 'Loading...'}
            </td>
            <th>
                <button className="bg-green-500 p-4 text-white btn-xs">Unfollow</button>
            </th>
        </tr>

    );
}



const Table = (user: any) => {
    const [activeTab, setActiveTab] = useState(0);

    const [snapshot, setSnapshot] = useState<Snapshot>();

    const handleTabClick = (index: number) => {
        setActiveTab(index);
    };

    const handleUpdateClick = () => {
        if (user === undefined) {
            alert("User is not defined");
            return;
        }
        createSnapshot(user);
    };

    useEffect(() => {
        console.log("snapshot changed");
        console.log(snapshot);
    }
        , [snapshot]);



    useEffect(() => {
            if (user) {
                if (user.snapshots === undefined) {
                    alert("Need to update");
                    return;
                } else {
                    setSnapshot(user.snapshots[user.snapshots.length - 1]);
                }
            
            }
    }
        , [user]);


    const renderTable = () => {

        //window.location.href = "https://www.instagram.com/accounts/activity/?

        switch (activeTab) {
            case 0:
                return (
                    <table className="table flex flex-col h-full">
                        {/* head */}
                        <thead>
                            <tr>
                                <th>
                                    <label>
                                        <input type="checkbox" className="checkbox" />
                                    </label>
                                </th>
                                <th>Name</th>
                                <th>Biography</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="grow">
                            {/* row 1 */}
                            <SinglThirdPerson {...user} />
                            {/* row 2 */}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={5}>
                                    <div className="flex justify-end">
                                        <button className="btn btn-outline btn-accent">Previous</button>
                                        <button className="btn btn-outline btn-accent">Next</button>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                );
            case 1:
                return (
                    <table className="table">
                        {/* table content for Tab 2 */}
                    </table>
                );
            case 2:
                return (
                    <table className="table">
                        {/* table content for Tab 3 */}
                    </table>
                );
            default:
                return null;
        }
    };


    return (
        <div className="grow">
            <div role="tablist" className="tabs tabs-boxed mb-4 gap-4">
                <a role="tab" className={`tab ${activeTab === 0 ? 'tab-active' : ''}`} onClick={() => handleTabClick(0)}>Followers</a>
                <a role="tab" className={`tab ${activeTab === 1 ? 'tab-active' : ''}`} onClick={() => handleTabClick(1)}>Following</a>
                <a role="tab" className={`tab ${activeTab === 2 ? 'tab-active' : ''}`} onClick={() => handleTabClick(2)}>Not Following</a>
                <a role="tab" className={`tab ${activeTab === 3 ? 'tab-active' : ''}`} onClick={() => handleTabClick(3)}>Mutual</a>
                <a role="tab" className={`tab ${activeTab === 4 ? 'tab-active' : ''}`} onClick={() => handleTabClick(4)}>Fans</a>
                <a role="tab" className={`tab bg-red-500 text-white`} onClick={handleUpdateClick}>Update</a>
            </div>
            <div className="w-full bg-base-100">
                {renderTable()}
            </div>
        </div>
    );
    
};

export default Table;

