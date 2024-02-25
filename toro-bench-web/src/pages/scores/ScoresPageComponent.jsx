import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { TestNames } from "../home";
import { useId } from "react";

export const BaseData = {
  detailed_info: "detailed_info",
  id: "id",
  rank: "rank",
  logical_processors: "logical_processors",
  GPU: "GPU",
  OS: "OS",
  browser: "browser",
  total: "total",
};

export const ScoresPageComponent = () => {

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

  const [testResults, setTestResults] = useState({});
  const [data, setData] = useState([]);
  const newRecordId = useId();

  useEffect(() => {

    const fetchData = async () => {
      try {
        const response = await fetch('./scores.json');
        const jsonData = await response.json();

        var currentResultNew = jsonData.some(x => x.detailed_info !== storedResults.detailed_info);
        if (currentResultNew) {
          storedResults[BaseData.id] = newRecordId;
          jsonData.push(storedResults);
        }
        setData(sortData(jsonData, BaseData.total, false));
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    const storedResults = {};
    var total = 0;

    Object.keys(TestNames).forEach(testName => {
      const storedResult = localStorage.getItem(testName);
      if (storedResult) {
        total += parseInt(storedResult);
        storedResults[testName] = parseInt(storedResult);
      }
    });

    storedResults[BaseData.detailed_info] = navigator.userAgent;
    storedResults[BaseData.logical_processors] = navigator.hardwareConcurrency;
    storedResults[BaseData.GPU] = getGPUDetails();
    storedResults[BaseData.OS] = getOSName();
    storedResults[BaseData.browser] = getBrowserName();
    storedResults[BaseData.total] = total;

    setTestResults(storedResults);
    fetchData();
  }, []);


  const columns = [
    { field: 'rank', headerName: '№', width: 60, editable: false },
    { field: 'detailed_info', headerName: 'Detailed Info', width: 150, editable: false },
    { field: 'logical_processors', headerName: 'Logical Processors', width: 150, editable: false },
    { field: 'GPU', headerName: 'GPU', width: 150, editable: false },
    { field: 'OS', headerName: 'Operating System', width: 150, editable: false },
    { field: 'browser', headerName: 'Browser', width: 150, editable: false },
    { field: 'total', headerName: 'Total', width: 150, editable: false },
    { field: 'JavaScript', headerName: 'JavaScript', width: 150, editable: false },
    { field: 'layout', headerName: 'Layout', width: 150, editable: false },
    { field: 'SVG', headerName: 'SVG', width: 150, editable: false },
    { field: 'periodic', headerName: 'Periodic', width: 150, editable: false },
    { field: 'tree', headerName: 'Tree', width: 150, editable: false },
    { field: 'birds', headerName: 'Birds', width: 150, editable: false },
    { field: 'invaders', headerName: 'Invaders', width: 150, editable: false },
    { field: 'collision', headerName: 'Collision', width: 150, editable: false },
  ];

  const sortData = (data, field, ascending = true) => {
    const indexedData = data.map((item, index) => ({ ...item, originalIndex: index }));

    const sortedData = indexedData.slice().sort((a, b) => {
      let comparison = 0;
      if (a[field] > b[field]) {
        comparison = 1;
      } else if (a[field] < b[field]) {
        comparison = -1;
      }
      return ascending ? comparison : comparison * -1;
    });

    sortedData.forEach((item, index) => {
      item.rank = index + 1;
    });

    const finalData = sortedData.map(item => {
      delete item.originalIndex;
      return item;
    });

    return finalData;
  };


  return (
    <section className="background">
      <h1 className="best-devices gradient-text">Scores</h1>
      <DataGrid
        rows={data}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
        sx={{ 'border': 'none' }}
      />
    </section>
  );

};