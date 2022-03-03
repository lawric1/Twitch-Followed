import "./Header.css";


export function Header() {
    function scrollTop(event) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        event.preventDefault();
    }


    return (
        <nav>
            <h1 className="title">Twitch Followed</h1>
            <ul>
                <a href="/#" onClick={scrollTop}><li>Home</li></a>
            </ul>
        </nav>
    );
}