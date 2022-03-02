import { Header } from "./components/Header/Header"
import { SearchField } from "./components/SearchField/SearchField"
import { ChannelCard } from "./components/ChannelCard/ChannelCard"

import "./App.css"

import React, {useState} from 'react'


function App() {
  //ClientID  - mbmmn9gzx8qhy5qd1c7pnltqidmpdv
  //Access token - Bearer 8hwo5e7fogfxxbqmehf8hqjb9qm2u3

  const [channelsData, setChannelsData] = useState([]);

  const token = 'Bearer 8hwo5e7fogfxxbqmehf8hqjb9qm2u3'
  const clientID = 'mbmmn9gzx8qhy5qd1c7pnltqidmpdv'
  const headers = new Headers({
    'Authorization': token, 
    'Client-ID': clientID
  })


  async function updateChannels(user) {
    const channels = await getFollowedChannels(user);

    const followedSinceList = [];

    let promises = []


    for (var channel in channels) {
      const channelId = channels[channel].to_id;
      followedSinceList.push(channels[channel].followed_at);

      const url = 'https://api.twitch.tv/helix/users?id=' + channelId;
      const response = fetch(url, {method: 'GET', headers: headers})
                      .then((response) => response.json())

      promises.push(response);
    }

    const dataList = await Promise.all(promises);


    for (let i = 0; i < dataList.length; i++) {
      const channel = dataList[i].data[0];

      const name = channel.display_name;
      const profilePicture = channel.profile_image_url;
      const followedSince = followedSinceList[i].substring(0, 10);

      const newData = {
        name: name,
        profilePicture: profilePicture,
        followedSince: followedSince
      };

      setChannelsData(channelsData =>
      ([
          ...channelsData, 
          newData
      ]));
    }
  }


  async function getFollowedChannels(user) {
    setChannelsData([])

    let channels = [];

    const userID = await getUserID(user);
    let cursor = '';

    const url = `https://api.twitch.tv/helix/users/follows?first=100&from_id=${userID}`;
    const response = await fetch(url, {method: 'GET', headers: headers})
                          .then((response) => response.json())

    channels.push(...response.data);
    cursor = response.pagination.cursor;
    
    if (cursor === undefined) { return channels }

    while (cursor) {
      const pagination = `&after=${cursor}`;

      const url = `https://api.twitch.tv/helix/users/follows?first=100&from_id=${userID}`+pagination
      const response = await fetch(url, {method: 'GET', headers: headers})
                            .then((response) => response.json())
      
      channels.push(...response.data);

      cursor = response.pagination.cursor;
    }

    console.log(channels);

    return channels;
  }


  async function getUserID(user) {
    const url = 'https://api.twitch.tv/helix/users?login=' + user;
    const response = await fetch(url, {method: 'GET', headers: headers})
                          .then((response) => response.json())

    return response.data[0].id
  }


  return (
    <>  
      <Header />
      <SearchField callback={updateChannels} />
      <main className="channelList">
        {channelsData.map(channel => (
          <ChannelCard 
          key={channel.name} 
          name={channel.name}
          profilePic={channel.profilePicture}
          followedSince={channel.followedSince}
          />
        ))}
      </main>
    </>
  );
}

export default App;