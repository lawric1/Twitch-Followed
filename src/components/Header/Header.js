import "./Header.css";

export function Header() {
    return (
        <nav>
            <h1 className="title">Title</h1>
            <ul>
                <li>Home</li>
                <li>About</li>
                <li>Something</li>
            </ul>
        </nav>
    );
}