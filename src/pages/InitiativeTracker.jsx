import { useState } from "react";

export default function InitiativeTracker() {
  const [characters, setCharacters] = useState([]);
  const [newName, setNewName] = useState("");
  const [newInitiative, setNewInitiative] = useState("");

  function addCharacter() {
    if (!newName || !newInitiative) return;
    setCharacters((prev) =>
      [...prev, { name: newName, initiative: parseInt(newInitiative) }].sort(
        (a, b) => b.initiative - a.initiative
      )
    );
    setNewName("");
    setNewInitiative("");
  }

  function removeCharacter(index) {
    setCharacters((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-300 mb-6">
        🧮 Initiative Tracker
      </h2>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-gray-800 text-white"
        />
        <input
          type="number"
          placeholder="Initiative"
          value={newInitiative}
          onChange={(e) => setNewInitiative(e.target.value)}
          className="w-32 px-4 py-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={addCharacter}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition"
        >
          ➕ Add
        </button>
      </div>

      <ul className="space-y-2">
        {characters.map((char, i) => (
          <li
            key={i}
            className="bg-gray-800 px-4 py-2 rounded flex justify-between items-center"
          >
            <span>
              <strong>{char.name}</strong> — {char.initiative}
            </span>
            <button
              onClick={() => removeCharacter(i)}
              className="text-red-400 hover:text-red-300"
            >
              ✖
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
