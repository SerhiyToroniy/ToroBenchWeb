import { Outlet, Link, useNavigate } from "react-router-dom";

export const Layout = () => {

    const navigate = useNavigate();

    const currentYear = new Date().getFullYear();

    const onAppNameClick = () => {
        navigate('/');
    }

    return (
        <>
            <header className="header">
                <div className="container">
                    <nav className="nav">
                        <a style={{ height: '50px' }} onClick={onAppNameClick}><img src={'./logo512.png'} alt="Logo" className="nav-logo" /></a>
                        <div className="app-name" onClick={onAppNameClick}>ToroBenchWeb</div>
                        <ul className="nav-list">
                            <li className="nav-item">
                                <Link to="/scores" className="nav-link">Scores</Link>
                            </li>
                            <li className="nav-item">
                                <Link to="/tests" className="nav-link">Other tests</Link>
                            </li>
                            <li className="nav-item">
                                <a href="/pages/benchmark.html" className="nav-link-run">Run</a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main className="main">
                <Outlet />
            </main>

            <footer className="footer">&copy; ToroBenchWeb &mdash; {currentYear}. All rights reserved.</footer>
        </>
    );
};
