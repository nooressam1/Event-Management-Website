import { Search, X } from "lucide-react";
import { useState } from "react";

const SearchBar = ({
  placeholder = "Search...",
  onSearch = () => {}, // You can still trigger this on change
  width = "max-w-4xl",
}) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value); // Optional: sends value back to parent component
  };

  return (
    <div className={`w-full ${width} font-inter relative`}>
      <div
        className={`
          flex items-center gap-3 px-4 py-[14px] rounded-xl border-2 transition-all duration-200
          border-LineBox bg-NavigationBackground 
          focus-within:border-MainBlue 
          focus-within:shadow-[0_0_12px_rgba(25,120,229,0.25)]
        `}
      >
        {/* Simple Static Search Icon */}
        <Search
          size={20}
          className="text-SecondOffWhiteText group-focus-within:text-MainBlue"
        />

        <input
          type="text"
          value={query}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none w-full text-white font-jakarta placeholder:text-SecondOffWhiteText"
          onChange={handleChange}
        />

        {/* Clear Button - Only shows when there is text */}
        {query.length > 0 && (
          <button
            onClick={() => setQuery("")}
            className="text-SecondOffWhiteText hover:text-MainRed transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
