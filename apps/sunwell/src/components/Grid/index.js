import React from "react"
// import GridLayout from "react-grid-layout"
// import styles from "./index.scss"

// will keep grid information as a column in modules table

export default function Grid({ isEditable, items, renderItem }) {
  return items.map((item, i) => (
    <div key={i} style={{ display: "inline-flex" }}>
      {renderItem(item)}
    </div>
  ))
}

// export default function Grid({ isEditable, items, renderItem }) {
//   return (
//     <GridLayout
//       className={styles.root}
//       isDraggable={isEditable}
//       isResizable={isEditable}
//       containerPadding={[0, 0]}
//       cols={12}
//       rowHeight={30}
//       width={1152}
//     >
//       {items.map(item => (
//         <div key={item.id} data-grid={{ i: 0, x: 0, y: 0, w: 2, h: 2 }}>
//           {renderItem(item)}
//         </div>
//       ))}
//     </GridLayout>
//   )
// }
