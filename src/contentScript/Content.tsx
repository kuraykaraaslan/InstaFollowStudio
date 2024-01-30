import React , {useState, useEffect} from 'react';

// Components
import NavBar from '../components/Navbar';
import Table from '../components/Table';
import Footer from '../components/Footer';

// Helpers
import getElementByXpath from '../helpers';

// Styles
import './index.css';

// Types
import { User } from '../utils/types';

// Utils
import { addUserToStorage, fetchUserFromAPI, fetchUserFromSearchAPI } from '../utils/actions';


export function Content() {

    // States
    const [user, setUser] = useState<User>(); // State to hold user data
    const [userName, setUserName] = useState<string>(""); // State to hold the username

    // Catches the active profile link and extracts the username
    useEffect(() => {
        if (userName !== "") {
            return; // If the username is already set, return without performing any further action
        }

        // Get the active profile link element using XPath
        const activeProfileLink = getElementByXpath('/html/body/div[3]/div/div/div[2]/div/div/div[1]/div[1]/div[1]/div/div/div/div/div[2]/div[8]/div/span/div/a') as HTMLAnchorElement;
        
        if (activeProfileLink) {
            const url = activeProfileLink.href;
            setUserName(activeProfileLink?.href.split('/')[3] || ""); // Extract the username from the link and set it as the username state
        }
    });

    // Fetch user data from API when the username changes
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await fetchUserFromSearchAPI(userName); // Fetch user data from API based on the username
                setUser(user); // Update the user state with the fetched user data
            } catch (error) {
                console.log(error); 
                            
            }
        }
        fetchUser();
    }, [userName]);

    // Add user to storage when user data changes
    useEffect(() => {
        if (user?.username === undefined) {
            return; // If the username is not defined, return without performing any further action
        }

        const addUser = async () => {
            addUserToStorage(user); // Add the user data to storage
        }
        addUser();
    }, [user]);

    return (
        <div className="flex flex-col h-screen p-4 overflow-hidden">
            <NavBar {...user} /> {/* Render the NavBar component with the user data */}
            <Table {...user} /> {/* Render the Table component with the user data */}
            <Footer /> {/* Render the Footer component */}
        </div>
    )
}


export default Content;