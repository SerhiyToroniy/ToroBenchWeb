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

    return (
        <section className="background">
            <div className="internet-container">
                <h3>Download speed: {downloadSpeed}Mbps</h3>
                <h3>Upload speed: {uploadSpeed}Mbps</h3>
                {loading && <LinearProgressWithLabel value={progress} />}
            </div>
        </section>
    );
}

