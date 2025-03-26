import { useEffect, useState } from "react";

const categoryMap = {
  Moves: import.meta.glob("../data/moves/*.json", { eager: true }),
  Pokémon: import.meta.glob("../data/pokemon/*.json", { eager: true }),
  Statuses: import.meta.glob("../data/statuses/*.json", { eager: true }),
  Weather: import.meta.glob("../data/weather/*.json", { eager: true }),
};

export default function Resources() {
  const categories = Object.keys(categoryMap);
  const [activeTab, setActiveTab] = useState("Moves");
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
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes((searches[activeTab] || "").toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-4xl font-bold text-blue-400 text-center mb-6">
        📚 System Resources
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

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-2">
        {filteredItems.length === 0 ? (
          <p className="text-center text-gray-400 italic">
            No {activeTab} found.
          </p>
        ) : (
          filteredItems.map((item, i) => {
            const key = `${activeTab}-${i}`;
            const isExpanded = expandedItems[key];

            return (
              <div
                key={key}
                className="bg-gray-900 rounded shadow-md overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleExpand(i)}
                  className="w-full text-left px-4 py-3 font-semibold hover:bg-blue-600 transition"
                >
                  {item.name}
                </button>
                {isExpanded && (
                  <div className="px-4 py-3 border-t border-gray-700 text-gray-200 space-y-1 text-sm">
                    <div className="space-y-2 text-sm text-gray-300">
                      {/* Description */}
                      {item.description && (
                        <div className="italic text-gray-400">
                          {item.description}
                        </div>
                      )}

                      {/* Type */}
                      {item.type && (
                        <div>
                          <strong className="text-white">Type:</strong>{" "}
                          <span>
                            {/* Replace emoji placeholders with actual images/icons later */}
                            <span className="inline-block mr-1 align-middle">
                              🔥{" "}
                              {/* You can use an <img src="..." /> here instead */}
                            </span>
                            {item.type}
                          </span>
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
                          <strong className="text-white">Accuracy Dice:</strong>{" "}
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
