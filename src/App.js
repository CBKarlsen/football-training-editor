import React from 'react';
import { BrowserRouter, Routes, Route, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import PlanPage from './pages/PlanPage';
import ExerciseEditor from './pages/ExerciseEditor';

export default function App() {
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
            >
              Training Plan
            </Typography>
            <Button
              color="inherit"
              component={RouterLink}
              to="/exercise/new"
            >
              New Exercise
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<PlanPage />} />
          <Route path="/exercise/new" element={<ExerciseEditor />} />
          <Route path="/exercise/:id" element={<ExerciseEditor />} />
        </Routes>
      </Container>
    </BrowserRouter>
  );
}