// import { useCallback, useEffect, useRef } from "react";
// import { useFetchSearchData } from "../../hooks/useFetchSearchData";
// import { highlightText } from "../../utils/utils";
// import "./SearchInput.css";

// export const SearchInput = ({ treeRef }: { treeRef: HTMLElement | null }) => {
//   const {
//     query,
//     suggestions,
//     showDropdown,
//     setShowDropdown,
//     handleInputChange,
//   } = useFetchSearchData();

//   const searchRef = useRef<HTMLDivElement | null>(null);

//   const handleClickOutside = useCallback(
//     (event: MouseEvent) => {
//       if (
//         !searchRef.current?.contains(event.target as Node) &&
//         !treeRef?.contains(event.target as Node)
//       ) {
//         setShowDropdown(false);
//       }
//     },
//     [setShowDropdown, treeRef]
//   );

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [handleClickOutside]);

//   return (
//     <div className="search-container" ref={searchRef}>
//       <input
//         type="text"
//         value={query}
//         onChange={handleInputChange}
//         placeholder="Search..."
//         className="search-input"
//         onFocus={() => {
//           if (suggestions.length > 0) {
//             setShowDropdown(true);
//           }
//         }}
//       />
//       {showDropdown && suggestions.length === 0 && (
//         <ul className="search-dropdown">
//           <li className="search-suggestion">No results found</li>
//         </ul>
//       )}
//       {showDropdown && suggestions.length > 0 && (
//         <ul className="search-dropdown">
//           {suggestions.map((suggestion, i) => (
//             <li key={`${suggestion.name + i}`} className="search-suggestion">
//               {highlightText(suggestion.name, query)}
//             </li>
//           ))}
//         </ul>
//       )}
//       {showDropdown && <div className="search-backdrop" />}
//     </div>
//   );
// };
// SearchInput.tsx
import { useRef } from "react";
import { useFetchSearchData } from "../../hooks/useFetchSearchData";
import { highlightText } from "../../utils/utils";
import "./SearchInput.css";

export const SearchInput = () => {
  const {
    query,
    suggestions,
    showDropdown,
    setShowDropdown,
    handleInputChange,
  } = useFetchSearchData();

  const searchRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div className="search-container" ref={searchRef}>
        {showDropdown && (
          <button
            className="search-hide-button"
            onClick={() => setShowDropdown(false)}
          >
            Hide Results
          </button>
        )}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Search..."
          className="search-input"
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowDropdown(true);
            }
          }}
        />
        {showDropdown && suggestions.length === 0 && (
          <ul className="search-dropdown">
            <li className="search-suggestion">No results found</li>
          </ul>
        )}
        {showDropdown && suggestions.length > 0 && (
          <ul className="search-dropdown">
            {suggestions.map((suggestion, i) => (
              <li
                key={`${suggestion.name}-${i}`}
                className="search-suggestion"
                onClick={() => setShowDropdown(false)}
              >
                {highlightText(suggestion.name, query)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};
