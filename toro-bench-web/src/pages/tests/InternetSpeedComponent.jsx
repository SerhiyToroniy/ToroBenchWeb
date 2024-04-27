import { useEffect, useState } from "react";
import { LinearProgressWithLabel } from ".";

export const InternetSpeedComponent = () => {

    const imageAddr = "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg";
    const downloadSize = 7300000;
    const testCounter = 5;
    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    const measureConnectionSpeed = async () => {
        const download = new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = imageAddr + "?nnn=" + Date.now();
        });
        const startTime = Date.now();
        const loadedImage = await download;
        const endTime = Date.now();
        const duration = (endTime - startTime) / 1000;
        const bitsLoaded = downloadSize * 8;
        const speedBps = (bitsLoaded / duration).toFixed(2);
        const speedKbps = (speedBps / 1024).toFixed(2);
        const speedMbps = (speedKbps / 1024).toFixed(2);
        setDownloadSpeed(speedMbps);
        return speedMbps;
    };

    useEffect(() => {
        const runMeasurements = async () => {
            for (let i = 0; i < testCounter; i++) {
                const result = await measureConnectionSpeed();
                setProgress((100 / testCounter) * (i + 2));
                setResults(prevResults => [...prevResults, result]);
            }
        };
        runMeasurements();
    }, []);

    useEffect(() => {
        if (results.length === testCounter) {
            const sum = results.reduce((acc, numStr) => acc + parseFloat(numStr), 0);
            const average = sum / results.length;
            setDownloadSpeed(average.toFixed(2));
            setLoading(false);
        }
    }, [results]);

    return (
        <section className="background">
            <h3>Download speed: {downloadSpeed}Mbps</h3>
            {
                loading && <LinearProgressWithLabel value={progress} />
            }
        </section>
    );
}

