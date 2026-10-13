import { useState } from "react"
import restaurant from "./data/menuData"
import { getSelectedItems, getSubtotal } from "./utils/order"
import SchedulePickupModal from "./SchedulePickupModal";


const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
})


function App() {
  const [open, setOpen] = useState(false)
  const [selectedPickupWindow, setSelectedPickupWindow] = useState("")
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(restaurant.menuItems.map((item) => [item.id, 0]))
  )
  const [pickupName, setPickupName] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

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
  
  function handleSubmit(event) {
    event.preventDefault()
    setError("")
    setSuccess("")

    const name = pickupName.trim()

    const items = restaurant.menuItems
      .filter((item) => quantities[item.id] > 0)
      .map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: quantities[item.id],
      }))

    if (!name) {
      setError("Please enter a pickup name.")
      return
    }

    if (items.length === 0) {
      setError("Please select at least one menu item.")
      return
    }

    if (!selectedPickupWindow) {
      setError("Please select a pickup time.")
      return
    }

    const order = {
      pickupName: name,
      pickupTime: selectedPickupWindow,
      items,
      total: Number(
        items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)
      ),
      submittedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(order, null, 2)], {
      type: "application/json",
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `quickbite-order-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)

    setSuccess("Order submitted successfully!")
    setPickupName("")
    setSelectedPickupWindow("")
    setQuantities(
      Object.fromEntries(restaurant.menuItems.map((item) => [item.id, 0]))
    )
  }

  

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
        

        <div className="mt-8 border-t border-gray-200 pt-6">
          <h2 className="text-2xl font-semibold">Submit Order</h2>

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label htmlFor="pickupName" className="block font-medium">
                Pickup Name
              </label>
              <input
                id="pickupName"
                type="text"
                value={pickupName}
                onChange={(e) => setPickupName(e.target.value)}
                placeholder="Enter your name"
                className="mt-1 w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full rounded-lg border-2 border-gray-900 px-4 py-2 font-semibold"
            >
              Pick time
            </button>

            {selectedPickupWindow && (
              <p className="text-sm text-gray-600">
                Selected pickup time: {selectedPickupWindow}
              </p>
            )}

            {error && <p role="alert" className="text-red-600">{error}</p>}
            {success && <p role="status" className="text-green-600">{success}</p>}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
            >
              Submit Order
            </button>
          </form>
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
        <SchedulePickupModal
          isOpen={open}
          onClose={() => setOpen(false)}
          onSchedule={(w) => {
            setSelectedPickupWindow(w)
            setOpen(false)
          }}
        />
    </main>
  )
}

export default App