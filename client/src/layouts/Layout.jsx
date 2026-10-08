import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import "./Layout.css";

function Layout() {
    return (
        <div className="dashboard">
            <aside className="sidebar">
                <div className="brand">
                    <h1>Sentinel</h1>
                    <span>Linux Threat Detection</span>
                </div>

                <nav>
                    <Link to="/">Dashboard</Link>
                    <Link to="/events">Events</Link>
                    <Link to="/alerts">Alerts</Link>
                    <a>Analytics</a>
                    <a>Detection Rules</a>
                    <a>Security Knowledge</a>
                </nav>

                <div className="sidebar-bottom">
                    <a>System Status</a>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;