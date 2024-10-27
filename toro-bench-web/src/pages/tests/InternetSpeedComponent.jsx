import { useEffect, useState } from "react";
import { LinearProgressWithLabel } from ".";

export const InternetSpeedComponent = () => {

    const imageAddr = "https://upload.wikimedia.org/wikipedia/commons/3/3a/Bloemen_van_adderwortel_%28Persicaria_bistorta%2C_synoniem%2C_Polygonum_bistorta%29_06-06-2021._%28d.j.b%29.jpg";
    const downloadSize = 7300000;
    const testCounter = 5;
    const [downloadSpeed, setDownloadSpeed] = useState(0);
    const [resultsDownload, setResultsDownload] = useState([]);
    const [resultsUpload, setResultsUpload] = useState([]);
    const [loading, setLoading] = useState(true);
    const [progress, setProgress] = useState(0);
    const [uploadSpeed, setUploadSpeed] = useState(0);
    const [pingTimes, setPingTimes] = useState([]);
    const [jitter, setJitter] = useState(0);

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

    const measureUploadSpeed = async () => {
        const testData = new Array(1000000).fill('x').join('');
        const formData = new FormData();
        const blob = new Blob([testData]);
        formData.append('file', blob);

        try {
            const startTime = Date.now();
            const response = await fetch('https://file.io', {
                method: 'POST',
                body: formData
            });
            const endTime = Date.now();

            if (response.ok) {
                const duration = (endTime - startTime) / 1000;
                const speedBps = (blob.size * 8) / duration;
                const speedMbps = (speedBps / 1024 / 1024).toFixed(2);
                setUploadSpeed(speedMbps * 8);
                return speedMbps * 8;
            } else {
                console.error('Failed to upload file:', response.statusText);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        } finally {
        }
    };

    useEffect(() => {
        const runMeasurements = async () => {
            for (let i = 0; i < testCounter; i++) {
                const download = await measureConnectionSpeed();
                const upload = await measureUploadSpeed();
                setProgress((100 / testCounter) * (i + 1));
                setResultsDownload(prevResults => [...prevResults, download]);
                setResultsUpload(prevResults => [...prevResults, upload]);

            }
            const pings = await measurePing();
            setJitter(calculateJitter(pings));
        };
        runMeasurements();
    }, []);

    useEffect(() => {
        if (resultsDownload.length === testCounter) {
            const sumDownload = resultsDownload.reduce((acc, numStr) => acc + parseFloat(numStr), 0);
            const averageDownload = sumDownload / resultsDownload.length;
            setDownloadSpeed(averageDownload.toFixed(2));

            const sumUpload = resultsUpload.reduce((acc, numStr) => acc + parseFloat(numStr), 0);
            const averageUpload = sumUpload / resultsUpload.length;
            setUploadSpeed(averageUpload.toFixed(2));
            setLoading(false);
        }
    }, [resultsDownload]);

    const measurePing = async () => {
        let times = [];
        for (let i = 0; i < 10; i++) {
            const start = Date.now();
            await fetch(imageAddr + "?ping=" + start);
            const end = Date.now();
            times.push((end - start) / 4);
        }
        setPingTimes(times);
        return times;
    };

    const calculateJitter = (pingTimes) => {
        if (pingTimes.length < 2) return 0;
        let diffs = [];
        for (let i = 1; i < pingTimes.length; i++) {
            diffs.push(Math.abs(pingTimes[i] - pingTimes[i - 1]));
        }
        return (diffs.reduce((a, b) => a + b, 0) / diffs.length).toFixed(2);
    };

    return (
        <section className="background">
            {loading && <LinearProgressWithLabel value={progress} />}
            <div className="internet-container">
                <h3>Швидкість завантаження: {downloadSpeed} Мбіт/с


</h3>
                <h3>Швидкість відвантаження: {uploadSpeed} Мбіт/с


</h3>
            </div>
            <div className="internet-container">
                <h3>Пінг: {pingTimes.reduce((a, b) => a + b, 0) / pingTimes.length || 0} мс</h3>
                <h3>Джитер: {jitter} мс</h3>
            </div>
        </section>
    );
}

