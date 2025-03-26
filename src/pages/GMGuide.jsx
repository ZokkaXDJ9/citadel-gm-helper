import { useState } from "react";

export default function GMGuide() {
  const [selected, setSelected] = useState("intro");

  const sections = {
    intro: {
      title: "📖 Intro",
      content:
        "Welcome to the Citadel GM Guide. This toolset is tailored for Pokerole campaigns on Discord...",
    },
    quests: {
      title: "🧩 How to Create Interesting Quests",
      content:
        "Good quests come from player motivations. Use goals, twists, personal stakes, and branching paths to build engagement.",
    },
    encounters: {
      title: "⚔️ How to Create Encounters",
      content:
        "Encounters should challenge tactics and creativity. Add terrain, status effects, and multiple objectives.",
    },
    loot: {
      title: "💰 Loot Tables",
      content:
        "Loot can be items, knowledge, allies, or story advantages. Use rarity tiers and themed tables.",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white flex justify-center items-start p-6">
      <div className="w-full max-w-4xl">
        <h1 className="text-5xl font-extrabold text-center text-blue-400 drop-shadow mb-10">
          🧙‍♂️ Citadel GM Guide
        </h1>

        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.keys(sections).map((key) => (
            <button
              key={key}
              onClick={() => setSelected(key)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 text-base shadow-md ${
                selected === key
                  ? "bg-blue-600 text-white scale-105 shadow-blue-500/50"
                  : "bg-gray-700 hover:bg-gray-600 hover:scale-105"
              }`}
            >
              {sections[key].title}
            </button>
          ))}
        </div>

        {/* Content Display */}
        <div className="bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-700">
          <h2 className="text-3xl font-bold text-blue-300 mb-4">
            {sections[selected].title}
          </h2>
          <p className="text-gray-200 leading-relaxed whitespace-pre-line text-lg">
            {sections[selected].content}
          </p>
        </div>
      </div>
    </div>
  );
}
