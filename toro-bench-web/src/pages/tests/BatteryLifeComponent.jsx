import { useEffect, useState } from "react";
import NoSleep from 'nosleep.js';
import useWakeLock from './useWakeLock';

export const BatteryLifeComponent = () => {
    const [batteryLevel, setBatteryLevel] = useState(0);
    const [batteryStartLevel, setBatteryStartLevel] = useState(0);
    const [batteryDrop, setBatteryDrop] = useState(0);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    useWakeLock();

    useEffect(() => {
        var noSleep = new NoSleep();
        noSleep.enable();
    }, [elapsedTime]);

    const videoUrl = "https://www.youtube.com/embed/LXb3EKWsInQ?autoplay=1&mute=1&loop=1&playlist=LXb3EKWsInQ";

    useEffect(() => {
        const getBattery = async () => {
            if (navigator.getBattery) {
                const battery = await navigator.getBattery();
                setBatteryLevel((battery.level * 100).toFixed(0));
                setBatteryStartLevel((battery.level * 100).toFixed(0));
                const startLevel = (battery.level * 100).toFixed(0);

                battery.addEventListener('levelchange', () => {
                    setBatteryLevel((battery.level * 100).toFixed(0));
                    setBatteryDrop(((startLevel - battery.level * 100)).toFixed(0));
                });
            } else {
                console.warn("Battery Status API is not supported on this device.");
                setBatteryLevel("N/A");
                setBatteryStartLevel("N/A");
                setBatteryDrop("N/A");
            }
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
        const id = setInterval(() => {
            const currentTime = Date.now();
            setElapsedTime(currentTime - startTime);
        }, 1000);
        setIntervalId(id);

        return () => {
            clearInterval(id);
        };
    }, []);

    return (
        <section className="background">
            <script src="../NoSleep.min.js"></script>
            <div className="internet-container" style={{ fontSize: "24px", marginTop: 0 }}>
                {
                    batteryLevel === "N/A" ?
                        <>
                            <p>Детальна інформація про акумулятор не підтримується вашим браузером☠️💀😥. <br /></p>
                        </>
                        :
                        <>
                            <h4>Початковий рівень заряду: {batteryStartLevel}%</h4>
                            <h4>Поточний рівень заряду: {batteryLevel}%</h4>
                            <h4>Рівень розряду: {batteryDrop}%</h4>
                        </>
                }
                <h4>Пройдений час: {formatTime(elapsedTime)}</h4>
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
