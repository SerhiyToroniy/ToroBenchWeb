import { useEffect, useState } from "react";

export const BatteryLifeComponent = () => {
    const [batteryLevel, setBatteryLevel] = useState(0);
    const [batteryStartLevel, setBatteryStartLevel] = useState(0);
    const [batteryDrop, setBatteryDrop] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    useEffect(() => {
        let wakeLock = null;
        const requestWakeLock = async () => {
            try {
                wakeLock = await navigator.wakeLock.request('screen');
            } catch (err) {
                console.error(`${err.name}, ${err.message}`);
            }
        };

        requestWakeLock();

        return () => {
            wakeLock && wakeLock.release();
        };
    }, []);

    const videoUrl = "https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&loop=1&playlist=LXb3EKWsInQ";

    useEffect(() => {
        const getBattery = async () => {
            const battery = await navigator.getBattery();
            setBatteryLevel(battery.level * 100);
            setBatteryStartLevel((battery.level * 100).toFixed(0));
            const startLevel = (battery.level * 100).toFixed(0);

            battery.addEventListener('levelchange', () => {
                setBatteryLevel((battery.level * 100).toFixed(0));
                setBatteryDrop(((startLevel - battery.level * 100)).toFixed(0));
            });
        };

        getBattery();
    }, []);

    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const startTime = Date.now();
        setIntervalId(setInterval(() => {
            const currentTime = Date.now();
            setElapsedTime(currentTime - startTime);
        }, 1000));

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        <section className="background">
            <div className="internet-container" style={{ fontSize: "24px" }}>
                <h4>Initial Level: {batteryStartLevel}%</h4>
                <h4>Current Level: {batteryLevel}%</h4>
                <h4>Drop: {batteryDrop}%</h4>
                <h4>Elapsed Time: {formatTime(elapsedTime)}</h4>
                <div className="youtube-videos">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <iframe
                            key={index}
                            src={videoUrl}
                        ></iframe>
                    ))}
                </div>
            </div>
        </section>
    );
};
