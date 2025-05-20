import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function PlanPage() {
  const [exercises, setExercises] = useState(() => {
    return JSON.parse(localStorage.getItem('plan')) || [];
  });

  const save = (list) => {
    setExercises(list);
    localStorage.setItem('plan', JSON.stringify(list));
  };

  const addExercise = () => {
    const name = prompt('Enter new exercise name:', 'Untitled Exercise');
    if (!name) return;
    const id = uuidv4();
    save([...exercises, { id, name }]);
  };

  const renameExercise = (id) => {
    const current = exercises.find((ex) => ex.id === id);
    const newName = prompt('Rename exercise:', current.name);
    if (!newName) return;
    save(exercises.map((ex) => (ex.id === id ? { ...ex, name: newName } : ex)));
  };

  const removeExercise = (id) => {
    save(exercises.filter((ex) => ex.id !== id));
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Training Plan
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addExercise}
        >
          New Exercise
        </Button>
      </Box>
      <Divider />
      <List>
        {exercises.map((ex) => (
          <ListItem
            key={ex.id}
            component={RouterLink}
            to={`/exercise/${ex.id}`}
            button
            secondaryAction={
              <>
                <IconButton edge="end" onClick={() => renameExercise(ex.id)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  edge="end"
                  onClick={() => removeExercise(ex.id)}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            }
          >
            <ListItemText primary={ex.name} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}