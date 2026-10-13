import { useState } from "react"
import restaurant from "./data/menuData"
import { getSelectedItems, getSubtotal } from "./utils/order"


const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
})


function App() {
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(restaurant.menuItems.map((item) => [item.id, 0]))
  )

  function increaseQuantity(itemId) {
    setQuantities((current) => ({
      ...current,
      [itemId]: current[itemId] + 1,
    }))
  }

  function decreaseQuantity(itemId) {
    setQuantities((current) => ({
      ...current,
      [itemId]: Math.max(0, current[itemId] - 1),
    }))
  }

  const selectedItems = getSelectedItems(restaurant.menuItems, quantities)
  const subtotal = getSubtotal(selectedItems)

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="rounded-lg bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">{restaurant.name}</h1>

          <p className="mt-2 text-gray-600">
            {restaurant.description}
          </p>

          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Menu</h2>

            <div className="mt-4 space-y-4">
              {restaurant.menuItems.map((item) =>(
                <div key={item.id} className="rounded-lg border border-gray-200 p-4">
                  <h3 className="text-lg font-semibold">{item.name}</h3>

                  <p className="mt-1 text-gray-600">
                    {item.description}
                  </p>

                  <p className="mt-2 font-medium">
                    {currencyFormatter.format(item.price)}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Decrease ${item.name}`}
                      onClick={() => decreaseQuantity(item.id)}
                      disabled={quantities[item.id] === 0}
                      className="h-8 w-8 rounded-lg border border-gray-300 font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      −
                    </button>

                    <span
                      aria-label={`${item.name} quantity`}
                      className="w-6 text-center font-medium"
                    >
                      {quantities[item.id]}
                    </span>

                    <button
                      type="button"
                      aria-label={`Increase ${item.name}`}
                      onClick={() => increaseQuantity(item.id)}
                      className="h-8 w-8 rounded-lg border border-gray-300 font-semibold hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside
          aria-labelledby="cart-heading"
          className="self-start rounded-lg bg-white p-6 shadow lg:sticky lg:top-6"
        >
          <h2 id="cart-heading" className="text-2xl font-semibold">Your order</h2>

          {selectedItems.length === 0 ? (
            <p className="mt-4 text-gray-600">No items selected yet.</p>
          ) : (
            <>
              <ul className="mt-4 space-y-3">
                {selectedItems.map((item) => (
                  <li key={item.id} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">× {item.quantity}</p>
                    </div>

                    <p className="font-medium">
                      {currencyFormatter.format(item.lineTotal)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 font-semibold">
                <span>Subtotal</span>
                <span aria-label="Subtotal amount">
                  {currencyFormatter.format(subtotal)}
                </span>
              </div>
            </>
          )}
        </aside>
      </div>
    </main>
  )
}

export default App