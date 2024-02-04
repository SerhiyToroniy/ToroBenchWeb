import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePageComponent, ScoresPageComponent, Layout, NotFound, BenchmarkPageComponent } from './pages';

function App() {
  return (
    <div className="wrapper">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePageComponent />} />
            <Route path="scores" element={<ScoresPageComponent />} />
            <Route path="benchmark" element={<BenchmarkPageComponent />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
