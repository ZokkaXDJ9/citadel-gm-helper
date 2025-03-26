import { useState } from "react";

export default function InitiativeTracker() {
  const [globalEffects, setGlobalEffects] = useState([]);
  const [showGlobalPanel, setShowGlobalPanel] = useState(false);
  const [newEffectName, setNewEffectName] = useState("");
  const [newEffectRounds, setNewEffectRounds] = useState("");
  const [entries, setEntries] = useState([]);
  const [name, setName] = useState("");
  const [dex, setDex] = useState("");
  const [tiebreaker, setTiebreaker] = useState("");
  const [turnIndex, setTurnIndex] = useState(0);
  const [roundCount, setRoundCount] = useState(1);
  const [notifications, setNotifications] = useState([]);

  const statusOptions = [
    "Stunned",
    "Burned",
    "Poisoned",
    "Frozen",
    "Asleep",
    "Confused",
    "Paralyzed",
    "Badly Poisoned",
  ];

  const statusMeta = {
    Stunned: "onTurn",
    Burned: "roundEnd",
    Poisoned: "roundEnd",
    Frozen: "onTurn",
    Asleep: "onTurn",
    Confused: "onTurn",
    Paralyzed: "onTurn",
    "Badly Poisoned": "roundEnd",
  };

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
      conditions: [],
    };

    const sorted = sortEntries([...entries, newEntry]);
    setEntries(sorted);
    setName("");
    setDex("");
    setTiebreaker("");
  }

  function updateField(index, field, value) {
    const updated = [...entries];
    updated[index][field] = parseInt(value) || 0;
    setEntries(updated);
  }

  function updateName(index, value) {
    const updated = [...entries];
    updated[index].name = value;
    setEntries(updated);
  }

  function sortOnBlur() {
    setEntries((prev) => sortEntries(prev));
  }

  function removeEntry(index) {
    const updated = [...entries];
    updated.splice(index, 1);
    setEntries(updated);

    if (turnIndex >= updated.length) {
      setTurnIndex(0);
      setRoundCount((prev) => (updated.length > 0 ? prev + 1 : prev));
    }
  }

  function addGlobalEffect() {
    if (!newEffectName || !newEffectRounds) return;

    const newEffect = {
      name: newEffectName,
      roundsLeft: parseInt(newEffectRounds),
    };

    setGlobalEffects((prev) => [...prev, newEffect]);
    setNewEffectName("");
    setNewEffectRounds("");
  }

  function addCondition(index, conditionName) {
    const updated = [...entries];
    const char = updated[index];

    const alreadyExists = char.conditions.some((c) => c.name === conditionName);

    if (!alreadyExists) {
      const condition =
        conditionName === "Badly Poisoned"
          ? { name: conditionName, rounds: 0 }
          : { name: conditionName };

      char.conditions.push(condition);
      setEntries(updated);
    }
  }

  function removeCondition(index, conditionName) {
    const updated = [...entries];
    updated[index].conditions = updated[index].conditions.filter(
      (c) => c.name !== conditionName
    );
    setEntries(updated);
  }

  function nextTurn() {
    if (entries.length === 0) return;

    const nextIndex = (turnIndex + 1) % entries.length;
    const isNewRound = nextIndex === 0;

    // 🔔 Check ON TURN conditions for the next character
    const nextChar = entries[nextIndex];
    const onTurnConditions = nextChar.conditions.filter(
      (c) => statusMeta[c.name] === "onTurn"
    );

    if (onTurnConditions.length > 0) {
      setNotifications((prev) => [
        ...prev,
        `${nextChar.name} - ${onTurnConditions.map((c) => c.name).join(", ")}`,
      ]);
    }

    if (isNewRound) {
      // 🔁 Round End Triggers
      const updated = [...entries];

      // 🔄 Reduce global effect timers
      const updatedGlobals = globalEffects.map((e) => ({
        ...e,
        roundsLeft: e.roundsLeft - 1,
      }));

      // 🔔 Notify for expired effects
      const expired = updatedGlobals.filter((e) => e.roundsLeft <= 0);
      if (expired.length > 0) {
        setNotifications((prev) => [
          ...prev,
          ...expired.map((e) => `Global effect expired: ${e.name}`),
        ]);
      }

      // 🧹 Remove expired
      setGlobalEffects(updatedGlobals.filter((e) => e.roundsLeft > 0));

      updated.forEach((char) => {
        char.conditions.forEach((cond) => {
          if (cond.name === "Badly Poisoned") {
            cond.rounds = (cond.rounds || 0) + 1;
          }
        });
      });

      const endRoundTriggers = updated
        .filter((e) =>
          e.conditions.some((c) => statusMeta[c.name] === "roundEnd")
        )
        .map(
          (e) =>
            `${e.name} - ${e.conditions
              .filter((c) => statusMeta[c.name] === "roundEnd")
              .map((c) =>
                c.rounds !== undefined ? `${c.name} (${c.rounds})` : c.name
              )
              .join(", ")}`
        );

      setEntries(updated);

      if (endRoundTriggers.length > 0) {
        setNotifications((prev) => [...prev, ...endRoundTriggers]);
      }

      setRoundCount((prev) => prev + 1);
    }

    setTurnIndex(nextIndex);
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-blue-300 mb-4">
        Initiative Tracker
      </h2>
      {/* Add Character */}
      <div className="flex flex-wrap gap-4 mb-6 items-end">
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
      {/* Turn Info */}
      {entries.length > 0 && (
        <div className="flex justify-between items-center bg-gray-900 p-4 rounded-lg mb-6 border border-gray-700">
          <div className="text-lg">
            <strong>Round:</strong> {roundCount} &nbsp;&nbsp; | &nbsp;&nbsp;
            <strong>Current Turn:</strong>{" "}
            <span className="text-blue-400 font-semibold">
              {entries[turnIndex]?.name}
            </span>
          </div>
          <button
            onClick={nextTurn}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 transition"
          >
            ⏭ Next Turn
          </button>
        </div>
      )}
      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="mb-4 space-y-2">
          {notifications.map((msg, i) => (
            <div
              key={i}
              className="bg-yellow-700 text-white px-4 py-2 rounded shadow flex justify-between items-center"
            >
              ⚠️ <span className="ml-2">{msg}</span>
              <button
                onClick={() =>
                  setNotifications((prev) => prev.filter((_, j) => j !== i))
                }
                className="text-sm text-white hover:text-gray-200"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowGlobalPanel((prev) => !prev)}
          className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-500 transition"
        >
          Global Effects
        </button>
      </div>
      {/* Characters */}
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div
            key={i}
            className={`bg-gray-800 p-4 rounded-xl flex flex-col gap-2 ${
              i === turnIndex ? "border-2 border-blue-500" : ""
            }`}
          >
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <input
                type="text"
                value={entry.name}
                onChange={(e) => updateName(i, e.target.value)}
                className="bg-gray-900 text-white px-3 py-1 rounded w-32"
              />
              <div className="flex gap-1 items-center">
                <label className="text-sm text-gray-300">Dex:</label>
                <input
                  type="number"
                  value={entry.dex}
                  onChange={(e) => updateField(i, "dex", e.target.value)}
                  onBlur={sortOnBlur}
                  className="w-16 bg-gray-900 text-white px-2 py-1 rounded"
                />
              </div>
              <div className="flex gap-1 items-center">
                <label className="text-sm text-gray-300">1d100:</label>
                <input
                  type="number"
                  value={entry.tiebreaker}
                  onChange={(e) => updateField(i, "tiebreaker", e.target.value)}
                  onBlur={sortOnBlur}
                  className="w-20 bg-gray-900 text-white px-2 py-1 rounded"
                />
              </div>
              <button
                onClick={() => removeEntry(i)}
                className="text-red-400 hover:text-red-300 text-sm"
              >
                ✖ Remove
              </button>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <select
                onChange={(e) => addCondition(i, e.target.value)}
                defaultValue=""
                className="bg-gray-900 text-white px-2 py-1 rounded"
              >
                <option value="" disabled>
                  ➕ Add Condition
                </option>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              {entry.conditions.map((cond, j) => (
                <span
                  key={j}
                  className="bg-blue-700 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1"
                >
                  {cond.name}
                  {cond.rounds !== undefined && ` (${cond.rounds})`}
                  <button
                    onClick={() => removeCondition(i, cond.name)}
                    className="text-xs text-red-300 hover:text-red-100"
                  >
                    ✖
                  </button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* GLOBAL EFFECT PANEL */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-700 shadow-lg transform transition-transform duration-300 z-50 ${
          showGlobalPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-blue-300">Global Effects</h3>
            <button
              onClick={() => setShowGlobalPanel(false)}
              className="text-red-400 hover:text-red-300 text-sm"
            >
              ✖
            </button>
          </div>

          {/* Add Effect */}
          <div className="flex flex-col gap-2 mb-4">
            <input
              type="text"
              placeholder="Effect Name"
              value={newEffectName}
              onChange={(e) => setNewEffectName(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded"
            />
            <input
              type="number"
              placeholder="Duration (rounds)"
              value={newEffectRounds}
              onChange={(e) => setNewEffectRounds(e.target.value)}
              className="bg-gray-800 text-white px-3 py-2 rounded"
            />
            <button
              onClick={addGlobalEffect}
              className="bg-green-600 hover:bg-green-500 px-3 py-2 rounded text-white"
            >
              ➕ Add Global Effect
            </button>
          </div>

          {/* List Effects */}
          <div className="space-y-2">
            {globalEffects.length === 0 ? (
              <p className="text-sm text-gray-400">No active global effects.</p>
            ) : (
              globalEffects.map((effect, i) => (
                <div
                  key={i}
                  className="bg-gray-800 text-white px-3 py-2 rounded flex justify-between items-center"
                >
                  <span>
                    {effect.name} ({effect.roundsLeft})
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
