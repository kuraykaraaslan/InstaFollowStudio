import React, { useState, useEffect } from 'react';

import { User, Snapshot, ThirdPerson } from '../utils/types';

import { getUserSnapshots, createSnapshot, unfollowUser } from '../utils/actions';


const Table = (user: any) => {
    // States
    const [activeTab, setActiveTab] = useState('followers'); // 'followers', 'following', 'notFollowing', 'mutual', 'fans

    const [page, setPage] = useState(1); // [1, 2, 3, 4, 5
    const [isLastPage, setIsLastPage] = useState(false); // [1, 2, 3, 4, 5
    const [snapshot, setSnapshot] = useState<Snapshot>();

    const [error, setError] = useState<string>("");

    const [renderData, setRenderData] = useState<any>(
        {
            followers: [] as ThirdPerson[],
            following: [] as ThirdPerson[],
            notFollowing: [] as ThirdPerson[],
            mutual: [] as ThirdPerson[],
            fans: [] as ThirdPerson[],
        }
    );

    // Effects
    useEffect(() => {
        getUserSnapshots(user).then((snapshots) => {
            console.log(snapshots);
            if (snapshots.length === 0) {
                setError("No snapshots found. Please update the snapshot.");
                return;
            }
            const last = snapshots[snapshots.length - 1];
            setSnapshot(last);
        });
    }, [user]);

    useEffect(() => {
        if (snapshot) {
            setRenderData({
                followers: snapshot.followers,
                following: snapshot.following,
                fans: snapshot.followers.filter((f) => !snapshot.following.some((f2) => f.id === f2.id)),
                mutual: snapshot.followers.filter((f) => snapshot.following.some((f2) => f.id === f2.id)),
                notFollowing: snapshot.following.filter((f) => !snapshot.followers.some((f2) => f.id === f2.id)),
            });
        }
    }, [snapshot]);


    // Functions
    const handleTabClick = (index: string) => {
        if (index === activeTab) return;
        setActiveTab(index);
        setPage(1);
        calculateIsLastPage();
    };

    const handleUnfollow = async (id: string) => {
        try {
            // Make an API call or update state to unfollow the user
            await unfollowUser(id);
            // Update the renderData state to reflect the change
            setRenderData({
                ...renderData,
                following: renderData.following.filter((f: ThirdPerson) => f.id !== id),
                notFollowing: [...renderData.notFollowing, renderData.following.find((f: ThirdPerson) => f.id === id)],
            });
            setError("");

        } catch (error) {
            // Handle the error appropriately
            setError("Something went wrong. Please try again later.");
        }
    };


    const handleSnapshot = async () => {
        try {
            const snapshot = await createSnapshot(user);
            setSnapshot(snapshot);
            setError("");
        } catch (error) {
            // Handle the error appropriately
            setError("Something went wrong. Please try again later.");
        }
    };


    const pageUp = () => {
        setPage(page + 1);
        //calculate isLastPage
        calculateIsLastPage();
    }

    const pageDown = () => {
        if (page === 1) return;
        setPage(page - 1);
        //calculate isLastPage
        calculateIsLastPage();
    }

    const calculateIsLastPage = () => {
        if (renderData[activeTab].length >= page * 5) {
            setIsLastPage(true);
        } else {
            setIsLastPage(false);
        }
    }



    return (
        <div className="grow">
            {error !== "" && (
                <div className="alert alert-error mb-4">
                    <div className="flex-1">
                        <label>{error}</label>
                    </div>
                </div>
            )}

            <div role="tablist" className="tabs tabs-boxed mb-4 gap-4">
                <a role="tab" className={`tab ${activeTab === 'followers' ? 'tab-active' : ''}`} onClick={() => handleTabClick('followers')}>Followers</a>
                <a role="tab" className={`tab ${activeTab === 'following' ? 'tab-active' : ''}`} onClick={() => handleTabClick('following')}>Following</a>
                <a role="tab" className={`tab ${activeTab === 'notFollowing' ? 'tab-active' : ''}`} onClick={() => handleTabClick('notFollowing')}>Not Following</a>
                <a role="tab" className={`tab ${activeTab === 'mutual' ? 'tab-active' : ''}`} onClick={() => handleTabClick('mutual')}>Mutual</a>
                <a role="tab" className={`tab ${activeTab === 'fans' ? 'tab-active' : ''}`} onClick={() => handleTabClick('fans')}>Fans</a>
                <a role="tab" className={`tab bg-red-500 text-white`} onClick={() => handleSnapshot()}>Update</a>
            </div>
            <div className="w-full bg-base-100">

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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className="grow">
                        {/* body */}
                        {!snapshot ? (
                           null
                        ) : (
                            renderData[activeTab]?.splice((page - 1) * 5, 5).map((f: ThirdPerson) => (
                                <tr key={f.id}>
                                    <td>
                                        <label>
                                            <input type="checkbox" className="checkbox" />
                                        </label>
                                    </td>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <div className="avatar">
                                                <div className="w-12 h-12 mask mask-squircle">
                                                    <img src={f.profilePicUrl} />
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{f.username}</div>
                                                <div className="text-sm opacity-50">
                                                    <span>{f.fullName}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="flex items-center space-x-3">
                                            <button className="btn btn-sm btn-ghost btn-outline btn-accent" onClick={() => handleUnfollow(f.id)}>Unfollow</button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        


                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={5}>
                                <div className="flex justify-end">
                                    <button className="btn btn-outline btn-accent" disabled={page === 1} onClick={pageDown}>Previous</button>
                                    <button className="btn btn-outline btn-accent" disabled={isLastPage} onClick={pageUp}>Next</button>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default Table;

