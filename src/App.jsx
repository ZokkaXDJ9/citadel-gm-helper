import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import GMGuide from "./pages/GMGuide";
import EncounterBuilder from "./pages/EncounterBuilder";
import InitiativeTracker from "./pages/InitiativeTracker";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {/* Header */}
        <header className="w-full bg-gray-900 border-b border-gray-700 p-4 shadow flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-400">Citadel GM Toolset</h1>
          <Link
            to="/"
            className="text-sm bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
          >
            🏠 Home
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/gm-guide" element={<GMGuide />} />
            <Route path="/encounter-builder" element={<EncounterBuilder />} />
            <Route path="/initiative-tracker" element={<InitiativeTracker />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
