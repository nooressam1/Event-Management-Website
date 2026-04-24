import { Search, X } from "lucide-react";
import { useState } from "react";

const SearchBar = ({
  placeholder = "Search...",
  onSearch = () => {}, 
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
      flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-[10px] rounded-xl border-2 transition-all duration-200
      border-LineBox bg-NavigationBackground 
      focus-within:border-MainBlue 
      focus-within:shadow-[0_0_12px_rgba(25,120,229,0.25)]
    `}
  >
    <Search
      size={16}
      className="text-SecondOffWhiteText shrink-0 sm:w-5 sm:h-5"
    />
    <input
      type="text"
      value={query}
      placeholder={placeholder}
      className="bg-transparent border-none outline-none w-full text-sm sm:text-base text-white font-jakarta placeholder:text-SecondOffWhiteText"
      onChange={handleChange}
    />
    {query.length > 0 && (
      <button
        onClick={() => {
          setQuery("");
          onSearch("");
        }}
        className="text-SecondOffWhiteText hover:text-MainRed transition-colors shrink-0"
      >
        <X size={16} className="sm:w-5 sm:h-5" />
      </button>
    )}
  </div>
</div>
  );
};

export default SearchBar;
