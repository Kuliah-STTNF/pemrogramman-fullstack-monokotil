import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoTrashOutline, IoAdd, IoRemove, IoCartOutline, IoArrowForward, IoTicketOutline, IoShirtOutline } from 'react-icons/io5'
import { useCart } from '../context/CartContext'

function CartPage() {
  const { items, total, itemCount, updateQuantity, removeItem, clearCart } = useCart()

  const tickets = items.filter(item => item.itemType === 'ticket')
  const merch = items.filter(item => item.itemType === 'merch')

  if (itemCount === 0) {
    return (
      <div className="bg-[#0B0D1A] min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <IoCartOutline className="text-6xl text-white/20 mb-4 mx-auto" />
          <h1 className="text-3xl font-bold text-white mb-3">Your Cart is Empty</h1>
          <p className="text-white/50 mb-8 max-w-md">
            Looks like you haven't added any tickets or merchandise yet. Browse our events to find something you love!
          </p>
          <Link
            to="/events"
            className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full text-sm font-semibold no-underline"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            Browse Events
            <IoArrowForward />
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-[#0B0D1A] min-h-screen pt-24">
      {/* Header */}
      <section className="relative py-10 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-125 h-125 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f97316, transparent)' }}
          />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Shopping Cart
          </motion.h1>
          <p className="text-white/50">{itemCount} item{itemCount !== 1 ? 's' : ''} in your cart</p>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tickets Section */}
              {tickets.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <IoTicketOutline className="text-orange-400 text-xl" />
                    <h2 className="text-white font-bold text-lg m-0">Tickets ({tickets.length})</h2>
                  </div>
                  <div className="space-y-3">
                    {tickets.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-xl p-4 flex flex-col sm:flex-row gap-4"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        {/* Event Image */}
                        <Link to={`/event/${item.eventId}`} className="shrink-0">
                          <img
                            src={item.eventImage}
                            alt={item.eventTitle}
                            className="w-full sm:w-24 h-20 object-cover rounded-lg"
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <Link to={`/event/${item.eventId}`} className="no-underline">
                            <h4 className="text-white font-bold text-sm m-0 mb-1 hover:text-orange-400 transition-colors">
                              {item.eventTitle}
                            </h4>
                          </Link>
                          <p className="text-white/50 text-xs mb-1">{item.name}</p>
                          <p className="text-white/40 text-xs m-0">{item.eventDate}</p>
                        </div>

                        {/* Price + Quantity */}
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className="flex items-center gap-0 rounded-lg overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            <button
                              onClick={() => updateQuantity(item.id, 'ticket', item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white cursor-pointer bg-transparent border-none"
                            >
                              <IoRemove className="text-sm" />
                            </button>
                            <span className="w-8 text-center text-white font-semibold text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 'ticket', item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white cursor-pointer bg-transparent border-none"
                            >
                              <IoAdd className="text-sm" />
                            </button>
                          </div>

                          <p className="text-white font-bold text-sm m-0 w-20 text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>

                          <button
                            onClick={() => removeItem(item.id, 'ticket')}
                            className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none transition-colors"
                          >
                            <IoTrashOutline />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Merchandise Section */}
              {merch.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <IoShirtOutline className="text-orange-400 text-xl" />
                    <h2 className="text-white font-bold text-lg m-0">Merchandise ({merch.length})</h2>
                  </div>
                  <div className="space-y-3">
                    {merch.map((item) => (
                      <motion.div
                        key={item.cartKey}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-xl p-4 flex flex-col sm:flex-row gap-4"
                        style={{
                          background: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        {/* Merch Image */}
                        <div className="shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full sm:w-24 h-20 object-cover rounded-lg"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-bold text-sm m-0 mb-1">{item.name}</h4>
                          <p className="text-white/50 text-xs mb-1">{item.eventTitle}</p>
                          <div className="flex gap-2">
                            {item.size && (
                              <span className="text-xs text-white/40 px-2 py-0.5 rounded"
                                style={{ background: 'rgba(255,255,255,0.06)' }}
                              >
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && (
                              <span className="text-xs text-white/40 px-2 py-0.5 rounded"
                                style={{ background: 'rgba(255,255,255,0.06)' }}
                              >
                                {item.color}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Price + Quantity */}
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className="flex items-center gap-0 rounded-lg overflow-hidden"
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                          >
                            <button
                              onClick={() => updateQuantity(item.id, 'merch', item.quantity - 1, item.cartKey)}
                              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white cursor-pointer bg-transparent border-none"
                            >
                              <IoRemove className="text-sm" />
                            </button>
                            <span className="w-8 text-center text-white font-semibold text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 'merch', item.quantity + 1, item.cartKey)}
                              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white cursor-pointer bg-transparent border-none"
                            >
                              <IoAdd className="text-sm" />
                            </button>
                          </div>

                          <p className="text-white font-bold text-sm m-0 w-20 text-right">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>

                          <button
                            onClick={() => removeItem(item.id, 'merch', item.cartKey)}
                            className="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none transition-colors"
                          >
                            <IoTrashOutline />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Clear Cart */}
              <div className="flex justify-end">
                <button
                  onClick={clearCart}
                  className="text-red-400 hover:text-red-300 text-sm font-medium cursor-pointer bg-transparent border-none transition-colors"
                >
                  Clear entire cart
                </button>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="rounded-2xl p-6"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>

                  <div className="space-y-3 mb-6">
                    {tickets.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Tickets ({tickets.reduce((s, i) => s + i.quantity, 0)})</span>
                        <span className="text-white">${tickets.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</span>
                      </div>
                    )}
                    {merch.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-white/50">Merchandise ({merch.reduce((s, i) => s + i.quantity, 0)})</span>
                        <span className="text-white">${merch.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Service Fee</span>
                      <span className="text-white">${(total * 0.05).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-white font-bold">Total</span>
                      <span className="text-white font-bold text-xl">${(total * 1.05).toFixed(2)}</span>
                    </div>
                    <p className="text-white/30 text-xs mt-1">Including 5% service fee</p>
                  </div>

                  <Link
                    to="/checkout"
                    className="flex items-center justify-center gap-2 w-full text-white py-3.5 rounded-xl text-sm font-semibold no-underline transition-all hover:opacity-90"
                    style={{
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
                    }}
                  >
                    Proceed to Checkout
                    <IoArrowForward />
                  </Link>

                  <Link
                    to="/events"
                    className="block text-center text-white/50 hover:text-white text-sm mt-4 no-underline transition-colors"
                  >
                    Continue Shopping
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CartPage
