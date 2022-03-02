import "./ChannelCard.css";

export function ChannelCard(props) {
    function openChannel() {
        window.open("https://www.twitch.tv/" + props.name, "_blank");
    }

    return (
        <div className="card" onClick={openChannel}>
            <img alt={props.name} src={props.profilePic} height="32" width="32"></img>
            <p className="channelName">{props.name}</p>
            <p className="followed">followed:{props.followedSince}</p>
        </div>
    );
}