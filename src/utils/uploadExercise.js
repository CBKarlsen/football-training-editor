const uploadExercise = (e, updateExercise) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        updateExercise(json);
      } catch (err) {
        alert("Failed to load exercise JSON.");
      }
    };
    reader.readAsText(file);
  };
  
  export default uploadExercise;