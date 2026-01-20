import { useState } from "react";
import EclipsesLearning from "./components/Eclipses";
import "./App.css";

function App() {
  const [mode, setMode] = useState<"learn" | "practice" | "applications">("learn");

  return (
    <div className="App">
      <EclipsesLearning mode={mode} setMode={setMode} />
    </div>
  );
}

export default App;
