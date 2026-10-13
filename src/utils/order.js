function roundToCents(amount) {
  return Math.round(amount * 100) / 100
}

export function getSelectedItems(menuItems, quantities) {
  return menuItems
    .filter((item) => (quantities[item.id] ?? 0) > 0)
    .map((item) => {
      const quantity = quantities[item.id]

      return {
        id: item.id,
        name: item.name,
        price: item.price,
        quantity,
        lineTotal: roundToCents(item.price * quantity),
      }
    })
}

export function getSubtotal(selectedItems) {
  return roundToCents(
    selectedItems.reduce((total, item) => total + item.lineTotal, 0)
  )
}
