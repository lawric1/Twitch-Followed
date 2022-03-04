import { Header } from "./components/Header/Header";
import { SearchField } from "./components/SearchField/SearchField";
import { CardList } from "./components/Card/CardList";

import "./App.css";

import React, {useState} from 'react';


export function Loading(props) {
    return (
        <div className="loading"><h1>Loading...</h1></div>
    );
}


export function Main(props) {
    if (props.status === "") {
        return <></>
    }

    if (props.status === "Completed") {
        return <CardList data={props.data}/>

    } else if (props.status === "Loading") {
        return <Loading />
    }
}


function App() {
    const [status, setStatus] = useState("");
    const [channelsData, setChannelsData] = useState([]);

    const token = 'Bearer ' + process.env.REACT_APP_API_TOKEN;
    const clientID = process.env.REACT_APP_API_CLIENTID;
    const headers = new Headers({
        'Authorization': token, 
        'Client-ID': clientID
    });


    async function requestChannelsData(user) {
        // reset states "channelsData" and "Status"
        setStatus("Loading");
        setChannelsData([]);

        // Each object in this list contains the id of the channel. This id will be used to request information like the profile picture and name.
        let channelList;

        try { 
            channelList = await getFollowedChannels(user); 
        } catch (e) { 
            console.log("User not found."); 
        }

        // This list is nescessary since the "followed date" is not provided by the same url that provides the wanted data.
        const followedSinceList = [];

        // Since there'll be a request for each channel id, all the requests will be added to this list 
        // so they can be fetched at the same time with "Promise.all()"
        let promises = [];


        for (var object in channelList) {
            const channelId = channelList[object].to_id;

            followedSinceList.push(channelList[object].followed_at);

            const url = 'https://api.twitch.tv/helix/users?id=' + channelId;
            const response = fetch(url, {method: 'GET', headers: headers})
                            .then((response) => response.json())

            promises.push(response);
        }

        // Load all promises at the same time. each object in dataList contains the wanted information about the channel.
        const dataList = await Promise.all(promises);

        for (let i = 0; i < dataList.length; i++) {
            const channel = dataList[i].data[0];

            try {
                const parsedData = {
                    name: channel.display_name,
                    profilePicture: channel.profile_image_url,
                    followedSince: followedSinceList[i].substring(0, 10),
                };

                setChannelsData(channelsData =>
                ([
                    ...channelsData, 
                    parsedData
                ]));

            } catch (e) {
                console.log("Requested data not available.");
            }
        }

        // After the "channelsData" is updated change status to switch the Loading component with all the cards.
        setStatus("Completed");
    }


    async function getFollowedChannels(user) {
        const userID = await getUserID(user);
        let channels = [];
        // cursor will be used for pagination since twitch api don't allow to return more than 100 channels.
        let cursor = '';

        // Fetch all the channels followed by the specified userID and save it to an array to be used later.
        const url = `https://api.twitch.tv/helix/users/follows?first=100&from_id=${userID}`;
        const response = await fetch(url, {method: 'GET', headers: headers})
                        .then((response) => response.json())

        channels.push(...response.data);
        cursor = response.pagination.cursor;
        
        // If api returns less than 100 channels the cursor will not be provided, so this line returns the current channels in the list
        if (cursor === undefined) { return channels }

        // Since cursor was provided this loop will guarantee all the followed channels will be requested by accessing all the pages. 
        // In the last page cursor will no be provided, so the loop stops.

        while (cursor) {
            const pagination = `&after=${cursor}`;

            const url = `https://api.twitch.tv/helix/users/follows?first=100&from_id=${userID}` + pagination
            const response = await fetch(url, {method: 'GET', headers: headers})
                            .then((response) => response.json())
            
            channels.push(...response.data);

            cursor = response.pagination.cursor;
        }

        // console.log(channels);
        return channels;
    }


    async function getUserID(user) {
        // Send request to Twitch API to get the id of a user. That id will be used to get which channels the user follows.
        const url = 'https://api.twitch.tv/helix/users?login=' + user;
        const response = await fetch(url, {method: 'GET', headers: headers})
                        .then((response) => response.json())

        return response.data[0].id
    }

    
    return (
        <>
            <Header />
            <SearchField callback={requestChannelsData} />
            <Main status={status} data={channelsData} />
        </>
    );
}

export default App;