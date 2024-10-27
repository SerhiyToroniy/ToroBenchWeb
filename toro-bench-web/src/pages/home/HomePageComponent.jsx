import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';

export const TestNames = {
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
  const navigate = useNavigate();

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

  const onSeeMore = () => {
    navigate('/scores');
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

  const columns = [
    { field: 'rank', headerName: '№', width: 60, editable: false },
    { field: 'logical_processors', headerName: 'Logical Processors', width: 150, editable: false },
    { field: 'GPU', headerName: 'GPU', width: 150, editable: false },
    { field: 'OS', headerName: 'Operating System', width: 150, editable: false },
    { field: 'browser', headerName: 'Browser', width: 150, editable: false },
    { field: 'total', headerName: 'Total', width: 150, editable: false },
    { field: 'detailed_info', headerName: 'Detailed Info', width: 150, editable: false }
  ];

  const sortData = (data, field, ascending = true) => {
    return data.slice().sort((a, b) => {
      let comparison = 0;
      if (a[field] > b[field]) {
        comparison = 1;
      } else if (a[field] < b[field]) {
        comparison = -1;
      }
      return ascending ? comparison : comparison * -1;
    });
  };


  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('./scores.json');
        const jsonData = await response.json();
        setData(sortData(jsonData, 'rank'));
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <section className="background">
        <img src={'./img/home_header.jpg'} />
        <div className="info">
          <div className="info-container">
            <h1>Інформація про пристрій</h1>
            <p><strong>Кількість логічних процесорів:</strong> {navigator.hardwareConcurrency}</p>
            <p><strong>Відеокарта:</strong> {getGPUDetails()}</p>
            <p><strong>Операційна система:</strong> {getOSName()}</p>
            <p><strong>Браузер:</strong> {getBrowserName()}</p>
          </div>
          <div className="info-container">
            <h1>Останні результати</h1>
            {Object.keys(testResults).length !== 0 ?
              <>
                {Object.entries(testResults).map(([test, result]) => (
                  <p key={test}><strong>{test}:</strong> {result}</p>
                ))}
              </>
              :
              <p>Ще немає результатів</p>}
          </div>
        </div>
      </section>
      <section className="background">
        <h1 className="best-devices gradient-text">Найкращі результати</h1>
        <DataGrid
          rows={data}
          columns={columns}
          className="datagrid"
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 3,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
          hideFooter
          hideFooterPagination
          sx={{ 'border': 'none' }}
        />
        <div className="see-more">
          <button onClick={onSeeMore}>Детальніше</button>
        </div>
      </section>
    </>
  );
};