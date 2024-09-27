// export const buildTreeFromData = (data) => {
//   const nodeMap = {};
//   let root = null;

//   data.forEach((item) => {
//     const parts = item.name.split(" > ");
//     const nodeName = parts[parts.length - 1];

//     const node = {
//       name: nodeName,
//       size: item.size,
//       children: [],
//     };

//     nodeMap[item.name] = node;

//     if (parts.length === 1) {
//       // Root node
//       root = node;
//     } else {
//       const parentName = parts.slice(0, -1).join(" > ");
//       const parentNode = nodeMap[parentName];
//       if (parentNode) {
//         parentNode.children.push(node);
//       }
//     }
//   });

//   return root;
// };

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
