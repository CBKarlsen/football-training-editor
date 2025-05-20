import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PlanPage from './pages/PlanPage';
import ExerciseEditor from './pages/ExerciseEditor';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: 12, borderBottom: '1px solid #ccc' }}>
        <Link to="/" style={{ marginRight: 8 }}>Training Plan</Link>
        <Link to="/exercise/new">New Exercise</Link>
      </nav>
      <Routes>
        <Route path="/" element={<PlanPage />} />
        <Route path="/exercise/:id" element={<ExerciseEditor />} />
        <Route path="/exercise/new" element={<ExerciseEditor />} />
      </Routes>
    </BrowserRouter>
  );
}