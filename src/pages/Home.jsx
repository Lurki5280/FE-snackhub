import React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {getAllSnacks} from "../api/snacks"
function Home() {
  const [snacks, setSnacks] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSnacks = async () => {
      try {
        const data = await getAllSnacks()
        setSnacks(data)
      } catch (error) {
        console.error("Failed to fetch snacks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSnacks()
  }, [])
  return (
    <section className="bg-gradient-to-b from-yellow-50 to-white min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-punch text-orange-600 max-w-2xl leading-tight">
        Snacks from Around the World, Delivered Monthly!
      </h1>
      <p className="mt-4 font-punch text-lg text-gray-700 max-w-xl">
        Join thousands who explore a new country every month — through snacks, culture, and fun.
      </p>
      <Link
        to="/subscribe"
        className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-full text-lg hover:bg-orange-600 transition"
      >
        Subscribe Now
      </Link>
      <div className="p-6">
      <h1 className="text-3xl font-bold mb-4 text-center">Our Snacks 🧃🍪</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading snacks...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {snacks.map((snack) => (
            <div key={snack._id} className="bg-white shadow rounded-xl p-4 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold">{snack.snackName}</h2>
              <p className="text-sm text-gray-600 mt-2">{snack.description}</p>
              {snack.image && (
                <img src={snack.image} alt={snack.name} className="w-full h-40 object-cover rounded-lg mt-3" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
    </section>
    
  )
}

export default Home
