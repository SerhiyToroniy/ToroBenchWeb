import React from "react";
import { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import { TestNames } from "../home";
import { fireBaseDB } from "../../firebase/config";
import { collection, getDocs, addDoc, setDoc, doc } from 'firebase/firestore';

export const BaseData = {
  detailed_info: "detailed_info",
  id: "id",
  rank: "rank",
  logical_processors: "logical_processors",
  GPU: "GPU",
  OS: "OS",
  browser: "browser",
  total: "total",
  created: "created",
};

export const ScoresPageComponent = () => {

  const [data, setData] = useState([]);

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


  const fetchScores = async () => {
    const scoresDB = collection(fireBaseDB, 'scores');
    const scoresSnapshot = await getDocs(scoresDB);
    const scoresList = scoresSnapshot.docs.map((score) => ({ ...score.data(), id: score.id }));
    return scoresList;
  };

  const postScore = async (scoreResult) => {
    const scoresDB = collection(fireBaseDB, 'scores');
    await addDoc(scoresDB, scoreResult);
  };

  const putScore = async (scoreResult, id) => {
    const scoresDB = collection(fireBaseDB, 'scores');
    const scoresDocRef = doc(scoresDB, id);
    await setDoc(scoresDocRef, scoreResult);
  };

  useEffect(() => {

    fetchScores().then((scoresList) => {
      const storedResult = {};
      var testHasRunned = false;
      var total = 0;
      const formattedTime = Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(Date.now());

      Object.keys(TestNames).forEach(testName => {
        const result = localStorage.getItem(testName);
        if (result) {
          const valueResult = parseInt(result);
          total += valueResult;
          storedResult[testName] = parseInt(valueResult);
          testHasRunned = true;
        }
      });

      storedResult[BaseData.detailed_info] = navigator.userAgent;
      storedResult[BaseData.logical_processors] = navigator.hardwareConcurrency;
      storedResult[BaseData.GPU] = getGPUDetails();
      storedResult[BaseData.OS] = getOSName();
      storedResult[BaseData.browser] = getBrowserName();
      storedResult[BaseData.total] = total;
      storedResult[BaseData.created] = formattedTime;

      const scoreToUpdate = scoresList.find(x => x.detailed_info === storedResult.detailed_info &&
        x.GPU === storedResult.GPU &&
        x.logical_processors === storedResult.logical_processors
      );

      if (testHasRunned) {
        scoreToUpdate ? putScore(storedResult, scoreToUpdate.id).then(() => {
          fetchScores().then((scoresList) => {
            setData(sortData(scoresList, "total", false));
          })
        }) : postScore(storedResult).then(() => {
          fetchScores().then((scoresList) => {
            setData(sortData(scoresList, "total", false));
          })
        });
      }
      else{
        setData(sortData(scoresList, "total", false));
      }
    });
  }, []);

  const columns = [
    { field: 'rank', headerName: '№', width: 60, editable: false },
    { field: 'total', headerName: 'Total', width: 150, editable: false },
    { field: 'detailed_info', headerName: 'Detailed Info', width: 150, editable: false },
    { field: 'logical_processors', headerName: 'Logical Processors', width: 150, editable: false },
    { field: 'GPU', headerName: 'GPU', width: 150, editable: false },
    { field: 'OS', headerName: 'Operating System', width: 150, editable: false },
    { field: 'browser', headerName: 'Browser', width: 150, editable: false },
    { field: 'JavaScript', headerName: 'JavaScript', width: 150, editable: false },
    { field: 'Layout', headerName: 'Layout', width: 150, editable: false },
    { field: 'SVG', headerName: 'SVG', width: 150, editable: false },
    { field: 'Periodic', headerName: 'Periodic', width: 150, editable: false },
    { field: 'Tree', headerName: 'Tree', width: 150, editable: false },
    { field: 'Birds', headerName: 'Birds', width: 150, editable: false },
    { field: 'Collision', headerName: 'Collision', width: 150, editable: false },
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
        pageSizeOptions={[5, 10, 15]}
        disableRowSelectionOnClick
        sx={{ 'border': 'none' }}
      />
    </section>
  );

};