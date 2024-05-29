import { useEffect, useState } from 'react';

const useWakeLock = () => {
    const [wakeLock, setWakeLock] = useState(null);

    useEffect(() => {
        const requestWakeLock = async () => {
            if ('wakeLock' in navigator) {
                try {
                    const wakeLock = await navigator.wakeLock.request('screen');
                    setWakeLock(wakeLock);
                } catch (err) {
                    console.error(`${err.name}, ${err.message}`);
                }
            } else {
                console.warn('Wake Lock API not supported in this browser.');
            }
        };

        requestWakeLock();

        return () => {
            if (wakeLock) {
                wakeLock.release().then(() => {
                    setWakeLock(null);
                });
            }
        };
    }, [wakeLock]);

    return wakeLock;
};

export default useWakeLock;
