import { useState, useEffect } from "react";
import React from "react";

const TestNames = {
  JavaScript: 'JavaScript',
  Layout: 'Layout',
  SVG: 'SVG',
  Periodic: 'Periodic',
  Tree: 'Tree',
  Birds: 'Birds',
  Invaders: 'Invaders',
  Collision: 'Collision'
};

export const HomePageComponent = () => {

  const [testResults, setTestResults] = useState({});

  const getGPUDetails = () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const rendererInfo = gl && gl.getExtension('WEBGL_debug_renderer_info');

    if (rendererInfo) {
      const renderer = gl.getParameter(rendererInfo.UNMASKED_RENDERER_WEBGL);
      return `${extractGPUName(renderer)}`;
    } else {
      return 'GPU information not available';
    }
  }

  const extractGPUName = (rendererString) => {
    const regex = /ANGLE \(\w+, (.*?)\s+\(/;
    const match = regex.exec(rendererString);
    if (match && match.length > 1) {
      return match[1].trim();
    }
    return rendererString;
  }

  const getOSName = () => {
    const userAgent = navigator.userAgent;
    let osName = 'Unknown';
    if (userAgent.indexOf('Win') !== -1) osName = 'Windows';
    if (userAgent.indexOf('Mac') !== -1) osName = 'MacOS';
    if (userAgent.indexOf('Linux') !== -1) osName = 'Linux';
    if (userAgent.indexOf('Android') !== -1) osName = 'Android';
    if (userAgent.indexOf('iPhone') !== -1) osName = 'iOS';
    return osName;
  };

  const getBrowserName = () => {
    const userAgent = navigator.userAgent;
    let name = '';

    if (userAgent.indexOf("Chrome") > -1) {
      name = "Google Chrome";
    } else if (userAgent.indexOf("Firefox") > -1) {
      name = "Mozilla Firefox";
    } else if (userAgent.indexOf("Safari") > -1) {
      name = "Apple Safari";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
      name = "Opera";
    } else if (userAgent.indexOf("Edge") > -1) {
      name = "Microsoft Edge";
    } else if (userAgent.indexOf("Trident") > -1) {
      name = "Microsoft Internet Explorer";
    } else {
      name = "Unknown";
    }

    return name;
  }

  useEffect(() => {
    const storedResults = {};

    Object.keys(TestNames).forEach(testName => {
      const storedResult = localStorage.getItem(testName);
      if (storedResult) {
        storedResults[testName] = storedResult;
      }
    });

    setTestResults(storedResults);
  }, []);


  const [wakeLockEnabled, setWakeLockEnabled] = useState(false);
  const [wakeLockObj, setWakeLockObj] = useState(null);

  useEffect(() => {
    let wakeLock = null;

    async function requestWakeLock() {
      try {
        wakeLock = await navigator.wakeLock.request('screen');

        setWakeLockEnabled(true);
        setWakeLockObj(wakeLock);
        console.log('Wake lock activated');
      } catch (err) {
        console.error('Failed to activate wake lock:', err);
      }
    }

    const wakeLockInterval = setInterval(() => {
        requestWakeLock();
    }, 1000 * 70);

    return () => {
      clearInterval(wakeLockInterval);
      if (wakeLockObj) {
        wakeLockObj.release();
        console.log('Wake lock released');
      }
    };
  }, []);

  return (
    <>
      <section className="background">
        <img src={'./img/home_header.gif'} />
        <div className="info">
          <div className="info-container">
            <h1>Device Info</h1>
            <p><strong>Number of logical processors:</strong> {navigator.hardwareConcurrency}</p>
            <p><strong>GPU:</strong> {getGPUDetails()}</p>
            <p><strong>OS:</strong> {getOSName()}</p>
            <p><strong>Browser:</strong> {getBrowserName()}</p>
          </div>
          <div className="info-container">
            <h1>Last Results</h1>
            {Object.entries(testResults).map(([test, result]) => (
              <p key={test}><strong>{test}:</strong> {result}</p>
            ))}
          </div>
        </div>
      </section>
      <section className="background" style={{height: '500px'}}>
        
      </section>
    </>
  );
  
};