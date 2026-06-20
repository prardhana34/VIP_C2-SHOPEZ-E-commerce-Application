const categories = [
  "📱 Electronics & Gadgets",
  "🛒 Groceries & Essentials",
  "📝 Stationery & Office Supplies",
  "🏠 Home & Kitchen",
  "👕 Fashion & Clothing",
  "🪑 Furniture & Decor",
];

const CategoryBar = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="w-full bg-white shadow-md px-4 py-3 overflow-x-auto">

      {/* 📌 category row */}
      <div className="flex gap-3 min-w-max items-center">

        {/* 🌍 All button */}
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-2 rounded-full border transition whitespace-nowrap font-medium ${
            selectedCategory === ""
              ? "bg-blue-600 text-white shadow-md"
              : "hover:bg-blue-100"
          }`}
        >
          🌍 All
        </button>

        {/* 📂 dynamic categories */}
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border transition whitespace-nowrap font-medium ${
              selectedCategory === cat
                ? "bg-blue-600 text-white shadow-md scale-105"
                : "hover:bg-blue-100"
            }`}
          >
            {cat}
          </button>
        ))}

      </div>
    </div>
  );
};

export default CategoryBar;