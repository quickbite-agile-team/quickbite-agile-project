import restaurant from "./data/menuData"


const currencyFormatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
})


function App() {
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
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

export default App