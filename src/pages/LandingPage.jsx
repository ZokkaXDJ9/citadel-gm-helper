import { Link } from "react-router-dom";

export default function LandingPage() {
  const tools = [
    { name: "GM Guide", path: "/gm-guide" },
    { name: "Encounter Builder", path: "/encounter-builder" },
    { name: "Initiative Tracker", path: "/initiative-tracker" },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">Citadel GM Toolset</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            to={tool.path}
            className="bg-gray-800 p-6 rounded-xl shadow hover:bg-gray-700 transition"
          >
            <h2 className="text-xl font-semibold">{tool.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
