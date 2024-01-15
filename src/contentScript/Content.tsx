import React , {useState, useEffect} from 'react';

import NavBar from '../components/Navbar';
import Table from '../components/Table';
import Footer from '../components/Footer';

import getElementByXpath from '../helpers';

import './index.css';
import { User } from '../utils/types';

import { updateOrCreateUser } from '../utils/profiles';


chrome.storage.sync.get('users', (data) => {
    console.log(data.users);
});



export function Content() {

    // Catches the active profile link and extracts the username
    const activeProfileLink = getElementByXpath('/html/body/div[3]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/div/div/div/div/div[2]/div[8]/div/span/div/a') as HTMLAnchorElement;
    const activeUserName = activeProfileLink?.href.split('/')[3];
    const [user, setUser] = useState<User>();




    useEffect(() => {
        if (activeUserName) {
            updateOrCreateUser(activeUserName).then((user) => {
                console.log(user);
                setUser(user as User);
            });
        }
    }, [activeUserName]);


    return (
        <div className="flex flex-col h-screen p-4 overflow-hidden">
        <NavBar {...user} />
        <Table {...user} />
        <Footer />
        </div>
    )

}

export default Content;