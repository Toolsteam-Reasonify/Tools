import { useState } from "react";
import RevolutionLearning from "./components/Revolution";
import "./App.css";

function App() {
  const [mode, setMode] = useState<"learn" | "practice" | "applications">("learn");

  return (
    <div className="App">
      <RevolutionLearning mode={mode} setMode={setMode} />
    </div>
  );
}

export default App;
