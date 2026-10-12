import { useState } from "react"
import restaurant from "./data/menuData"


const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
})


function App() {
  const [quantities, setQuantities] = useState(() =>
    Object.fromEntries(restaurant.menuItems.map((item) => [item.id, 0]))
  )
  const [pickupName, setPickupName] = useState("")
  const [pickupTime, setPickupTime] = useState("")
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

    const pickupDate = new Date(pickupTime)
    const year = pickupDate.getFullYear()
    
    if (
      !pickupTime ||
      Number.isNaN(pickupDate.getTime()) ||
      pickupDate <= new Date() ||
      year > 9999
    ) {
      setError("Please select a valid future pickup time.")
      return
    }

    const order = {
      pickupName: name,
      pickupTime,
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
    setPickupTime("")
    setQuantities(
      Object.fromEntries(restaurant.menuItems.map((item) => [item.id, 0]))
    )
  }


  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <section className="mx-auto max-w-3xl rounded-lg bg-white p-6 shadow">
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

            <div>
              <label htmlFor="pickupTime" className="block font-medium">
                Pickup Time
              </label>
              <input
                id="pickupTime"
                type="datetime-local"
                min="2026-01-01T00:00"
                max="9999-12-31T23:59"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

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
    </main>
  )
}

export default App