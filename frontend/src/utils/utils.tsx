export const highlightText = (text: string, highlight: string) => {
  const parts = text.split(new RegExp(`(${highlight})`, "gi"));
  return (
    <span>
      {parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className="highlight">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};
