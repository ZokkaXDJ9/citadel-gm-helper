import { useEffect, useState } from "react";

const categoryMap = {
  Abilities: import.meta.glob("../data/abilities/*.json", { eager: true }),
  Boxes: import.meta.glob("../data/boxes/*.json", { eager: true }),
  Items: import.meta.glob("../data/items/*.json", { eager: true }),
  Moves: import.meta.glob("../data/moves/*.json", { eager: true }),
  Pokémon: import.meta.glob("../data/pokemon/*.json", { eager: true }),
  Potions: import.meta.glob("../data/potions/*.json", { eager: true }),
  Statuses: import.meta.glob("../data/statuses/*.json", { eager: true }),
  Weather: import.meta.glob("../data/weather/*.json", { eager: true }),
  "Z-Moves": import.meta.glob("../data/z-moves/*.json", { eager: true }),
};

export default function Resources() {
  const categories = Object.keys(categoryMap);
  const [activeTab, setActiveTab] = useState("Abilities");
  const [searches, setSearches] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [items, setItems] = useState([]);

  useEffect(() => {
    const rawData = categoryMap[activeTab];
    const data = Object.values(rawData).map((entry) =>
      entry.default ? entry.default : entry
    );
    setItems(data);
  }, [activeTab]);

  const handleSearch = (category, value) => {
    setSearches((prev) => ({ ...prev, [category]: value }));
  };

  const toggleExpand = (index) => {
    const key = `${activeTab}-${index}`;
    setExpandedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredItems = items
    .filter((item) => {
      const name = item.name || Object.keys(item)[0] || "";
      return name
        .toLowerCase()
        .includes((searches[activeTab] || "").toLowerCase());
    })
    .sort((a, b) => {
      if (typeof a.number === "number" && typeof b.number === "number") {
        return a.number - b.number;
      }
      return (a.name || Object.keys(a)[0] || "").localeCompare(
        b.name || Object.keys(b)[0] || ""
      );
    });

  const learnsetTiers = ["bronze", "silver", "gold", "platinum", "diamond"];
  const moveExtras = ["tm", "tutor", "egg"];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold text-blue-400 text-center mb-6">
        System Resources
      </h1>

      {/* Tabs */}
      <div className="flex justify-center gap-2 flex-wrap mb-6">
        {categories.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder={`Search ${activeTab}...`}
          value={searches[activeTab] || ""}
          onChange={(e) => handleSearch(activeTab, e.target.value)}
          className="w-full px-4 py-2 text-lg rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Results */}
      <div className="max-w-3xl mx-auto space-y-2">
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-400 italic">
            No {activeTab} found.
          </p>
        ) : (
          filteredItems.map((item, i) => {
            const key = `${activeTab}-${i}`;
            const isExpanded = expandedItems[key];
            const name = item.name || Object.keys(item)[0];

            return (
              <div
                key={key}
                className="bg-gray-900 rounded shadow-md overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleExpand(i)}
                  className="w-full text-left px-4 py-3 font-semibold hover:bg-blue-600 transition"
                >
                  {name}
                </button>

                {isExpanded && (
                  <div className="px-4 py-3 border-t border-gray-700 text-gray-200 text-sm space-y-4">
                    {activeTab === "Boxes" ? (
                      <>
                        {Object.entries(item).map(([boxName, boxContent]) => {
                          const isCategorized =
                            typeof boxContent === "object" &&
                            !Array.isArray(boxContent);

                          return (
                            <div key={boxName} className="space-y-4">
                              <h2 className="text-2xl font-bold text-blue-300">
                                {boxName} Box
                              </h2>

                              {isCategorized ? (
                                (() => {
                                  const totalCategoryWeight = Object.values(
                                    boxContent
                                  ).reduce(
                                    (sum, cat) => sum + cat.probability,
                                    0
                                  );

                                  return Object.entries(boxContent).map(
                                    ([categoryName, category]) => {
                                      const totalItemWeight =
                                        category.items.reduce(
                                          (sum, i) => sum + i.probability,
                                          0
                                        );

                                      return (
                                        <div
                                          key={categoryName}
                                          className="bg-gray-800 p-4 rounded shadow"
                                        >
                                          <h3 className="text-xl font-semibold text-blue-400 mb-2">
                                            {categoryName} —{" "}
                                            {(
                                              (category.probability /
                                                totalCategoryWeight) *
                                              100
                                            ).toFixed(2)}
                                            % category chance
                                          </h3>
                                          <ul className="list-disc pl-6 space-y-1">
                                            {category.items.map(
                                              (entry, index) => {
                                                const chance =
                                                  (category.probability /
                                                    totalCategoryWeight) *
                                                  (entry.probability /
                                                    totalItemWeight);
                                                return (
                                                  <li key={index}>
                                                    {entry.item} —{" "}
                                                    <span className="text-blue-300 font-mono">
                                                      {(chance * 100).toFixed(
                                                        2
                                                      )}
                                                      %
                                                    </span>
                                                  </li>
                                                );
                                              }
                                            )}
                                          </ul>
                                        </div>
                                      );
                                    }
                                  );
                                })()
                              ) : (
                                <div className="bg-gray-800 p-4 rounded shadow">
                                  <ul className="list-disc pl-6 space-y-1">
                                    {(() => {
                                      const totalWeight = boxContent.reduce(
                                        (sum, e) => sum + e.probability,
                                        0
                                      );
                                      return boxContent.map((entry, idx) => (
                                        <li key={idx}>
                                          {entry.item} —{" "}
                                          <span className="text-blue-300 font-mono">
                                            {(
                                              (entry.probability /
                                                totalWeight) *
                                              100
                                            ).toFixed(2)}
                                            %
                                          </span>
                                        </li>
                                      ));
                                    })()}
                                  </ul>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </>
                    ) : activeTab === "Pokémon" ? (
                      <>
                        <div className="text-xl font-bold text-blue-300 mb-1">
                          #{item.number} - {item.name}
                        </div>
                        <div>
                          <strong className="text-white">Type:</strong>{" "}
                          {item.types ? (
                            item.types.map((type, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1 mr-2"
                              >
                                <img
                                  src={`/assets/types/${type.toLowerCase()}.png`}
                                  className="w-5 h-5"
                                />
                                {type}
                              </span>
                            ))
                          ) : (
                            <span className="italic text-gray-400 ml-2">
                              No type found
                            </span>
                          )}
                        </div>
                        <div>
                          <strong className="text-white">Base HP:</strong>{" "}
                          {item.base_hp ?? "?"}
                        </div>
                        <div className="space-y-1 mt-2">
                          {[
                            "strength",
                            "dexterity",
                            "vitality",
                            "special",
                            "insight",
                          ].map((stat) => {
                            const value = item[stat] || "0/0";
                            const [filled, total] = value
                              .split("/")
                              .map(Number);
                            return (
                              <div key={stat}>
                                <strong className="text-white">
                                  {stat.charAt(0).toUpperCase() + stat.slice(1)}
                                  :
                                </strong>{" "}
                                <span className="font-mono">
                                  {"⬤".repeat(filled)}
                                  {"⭘".repeat(total - filled)} `{value}`
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div>
                          <strong className="text-white">Ability:</strong>{" "}
                          {item.ability ?? (
                            <span className="italic text-gray-400">
                              No ability found
                            </span>
                          )}
                        </div>
                        {item.moves ? (
                          <>
                            {learnsetTiers.map((tier) => {
                              const moves = item.moves[tier];
                              if (!moves || moves.length === 0) return null;
                              return (
                                <div key={tier} className="mt-4">
                                  <div className="font-semibold text-blue-400 flex items-center gap-2 mb-1">
                                    <img
                                      src={`/assets/ranks/${tier}.png`}
                                      className="w-5 h-5"
                                    />
                                    <span className="uppercase">{tier}</span>
                                  </div>
                                  <div className="text-gray-200">
                                    {moves.join("  |  ")}
                                  </div>
                                </div>
                              );
                            })}
                            <details className="bg-gray-800 rounded p-3 mt-4">
                              <summary className="cursor-pointer font-semibold text-blue-400 mb-2">
                                Additional Move Lists
                              </summary>
                              {moveExtras.map((extraKey) => (
                                <div key={extraKey} className="mt-2">
                                  <strong className="capitalize text-white">
                                    {extraKey}:
                                  </strong>{" "}
                                  {item.moves[extraKey] &&
                                  item.moves[extraKey].length > 0 ? (
                                    <span className="text-gray-200">
                                      {item.moves[extraKey].join("  |  ")}
                                    </span>
                                  ) : (
                                    <span className="italic text-gray-400">
                                      No data found :(
                                    </span>
                                  )}
                                </div>
                              ))}
                            </details>
                          </>
                        ) : (
                          <div className="italic text-gray-500 mt-2">
                            No movelist found :(
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-2 text-sm text-gray-300">
                        {/* Description */}
                        {item.description && (
                          <div className="italic text-gray-400">
                            {item.description}
                          </div>
                        )}

                        {/* Type + Category Icons */}
                        {(item.type || item.category) && (
                          <div className="flex items-center gap-4 flex-wrap">
                            {item.type && (
                              <div className="flex items-center gap-1">
                                <img
                                  src={`/assets/types/${item.type.toLowerCase()}.png`}
                                  alt={item.type}
                                  className="w-5 h-5"
                                />
                                <span>{item.type}</span>
                              </div>
                            )}
                            {item.category && (
                              <div className="flex items-center gap-1">
                                <img
                                  src={`/assets/categories/${item.category.toLowerCase()}.png`}
                                  alt={item.category}
                                  className="w-5 h-5"
                                />
                                <span>{item.category}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Target */}
                        {item.target && (
                          <div>
                            <strong className="text-white">Target:</strong>{" "}
                            {item.target}
                          </div>
                        )}

                        {/* Damage Dice */}
                        {item.damage && item.power && (
                          <div>
                            <strong className="text-white">Damage Dice:</strong>{" "}
                            {item.damage} + {item.power}
                          </div>
                        )}

                        {/* Accuracy Dice */}
                        {item.accuracy && (
                          <div>
                            <strong className="text-white">
                              Accuracy Dice:
                            </strong>{" "}
                            {item.accuracy} + Rank
                          </div>
                        )}

                        {/* Effect */}
                        {item.effect && (
                          <div>
                            <strong className="text-white">Effect:</strong>{" "}
                            {item.effect}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
