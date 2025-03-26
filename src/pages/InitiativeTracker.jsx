import { useState } from "react";

export default function InitiativeTracker() {
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [dex, setDex] = useState("");
  const [tiebreaker, setTiebreaker] = useState("");

  const sortEntries = (list) =>
    [...list].sort((a, b) => {
      if (b.dex !== a.dex) return b.dex - a.dex;
      return b.tiebreaker - a.tiebreaker;
    });

  function addEntry() {
    if (!name || !dex || !tiebreaker) return;

    const newEntry = {
      name,
      dex: parseInt(dex),
      tiebreaker: parseInt(tiebreaker),
    };

    setEntries((prev) => sortEntries([...prev, newEntry]));
    setName("");
    setDex("");
    setTiebreaker("");
  }

  function updateEntry(index, field, value) {
    const updated = [...entries];
    updated[index][field] = parseInt(value) || 0;
    setEntries(sortEntries(updated));
  }

  function updateName(index, value) {
    const updated = [...entries];
    updated[index].name = value;
    setEntries(updated);
  }

  function removeEntry(index) {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-300 mb-6">
        🧮 Initiative Tracker
      </h2>

      {/* Add New Entry */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 px-4 py-2 rounded bg-gray-800 text-white"
        />
        <input
          type="number"
          placeholder="Dex"
          value={dex}
          onChange={(e) => setDex(e.target.value)}
          className="w-24 px-4 py-2 rounded bg-gray-800 text-white"
        />
        <input
          type="number"
          placeholder="Tiebreaker"
          value={tiebreaker}
          onChange={(e) => setTiebreaker(e.target.value)}
          className="w-32 px-4 py-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={addEntry}
          className="px-4 py-2 bg-green-600 rounded hover:bg-green-500 transition"
        >
          ➕ Add
        </button>
      </div>

      {/* Initiative List */}
      <div className="space-y-3">
        {entries.map((entry, i) => (
          <div
            key={i}
            className="bg-gray-800 p-4 rounded flex flex-wrap gap-4 justify-between items-center"
          >
            <input
              type="text"
              value={entry.name}
              onChange={(e) => updateName(i, e.target.value)}
              className="bg-gray-900 text-white px-3 py-1 rounded"
            />
            <div className="flex gap-2 items-center">
              <label>Dex:</label>
              <input
                type="number"
                value={entry.dex}
                onChange={(e) => updateEntry(i, "dex", e.target.value)}
                className="w-20 bg-gray-900 text-white px-2 py-1 rounded"
              />
            </div>
            <div className="flex gap-2 items-center">
              <label>1d100:</label>
              <input
                type="number"
                value={entry.tiebreaker}
                onChange={(e) => updateEntry(i, "tiebreaker", e.target.value)}
                className="w-24 bg-gray-900 text-white px-2 py-1 rounded"
              />
            </div>
            <button
              onClick={() => removeEntry(i)}
              className="text-red-400 hover:text-red-300"
            >
              ✖
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
