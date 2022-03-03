import { ChannelCard } from "./ChannelCard";

import "./CardList.css";


export function CardList(props) {
    // Recieves "channelsData" from App component and send each object as a prop to the "ChannelCard" component.
    return (
        <section className="list">
            {props.data.map(channel => (
                <ChannelCard 
                    key={channel.name} 
                    name={channel.name}
                    profilePic={channel.profilePicture}
                    followedSince={channel.followedSince}
                />
            ))}
        </section>
    );
}