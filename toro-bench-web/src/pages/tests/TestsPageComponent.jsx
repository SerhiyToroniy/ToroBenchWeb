import { useNavigate } from "react-router-dom";

export const TestPageComponent = () => {

    const navigate = useNavigate();

    return (
        <section className="background">
            <h1 className="best-devices gradient-text">Other Tests</h1>
            <div className="test-container">
                <div className="test--container-image">
                    <div style={{ background: 'url("./internet.png")' }} alt="Internet Speed" className="test-internet"></div>
                </div>
                <div className="test--container-info">
                    <h3>Internet Speed</h3>
                    <p>This test quickly measures your internet's download and upload speeds in Mbps by transferring data to and from our servers.</p>
                    <button onClick={() => navigate('/internet')}>Open</button>
                </div>
            </div>
            <div className="test-container">
                <div className="test--container-image">
                    <div style={{ background: 'url("./battery.png")' }} alt="Battery test" className="test-internet"></div>
                </div>
                <div className="test--container-info">
                    <h3>Battery Life</h3>
                    <p>This test evaluates the battery life of your device by running a series of workloads and measuring how long the battery lasts on a single charge.</p>
                    <button onClick={() => navigate('/battery')}>Open</button>
                </div>
            </div>
        </section>
    );
}