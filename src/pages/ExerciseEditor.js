import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TrainingEditor from "../TrainingEditor";

export default function ExerciseEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) navigate("/", { replace: true });
  }, [id, navigate]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Exercise Editor</h1>
      <TrainingEditor exerciseId={id} />
    </div>
  );
}