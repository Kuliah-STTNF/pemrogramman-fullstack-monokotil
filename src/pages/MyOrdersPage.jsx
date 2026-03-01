import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoTicketOutline, IoShirtOutline, IoCalendarOutline, IoTimeOutline, IoReceiptOutline } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'

function MyOrdersPage() {
  const { getUserOrders, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="bg-[#0B0D1A] min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6">
        <IoReceiptOutline className="text-6xl text-white/20 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-3">Sign In Required</h1>
        <p className="text-white/50 mb-8">Please sign in to view your orders.</p>
        <Link to="/login" className="text-white px-6 py-3 rounded-full text-sm font-semibold no-underline"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          Sign In
        </Link>
      </div>
    )
  }

  const orders = getUserOrders()

  if (orders.length === 0) {
    return (
      <div className="bg-[#0B0D1A] min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6">
        <IoReceiptOutline className="text-6xl text-white/20 mb-4" />
        <h1 className="text-3xl font-bold text-white mb-3">No Orders Yet</h1>
        <p className="text-white/50 mb-8">You haven't placed any orders yet. Start exploring events!</p>
        <Link to="/events" className="text-white px-6 py-3 rounded-full text-sm font-semibold no-underline"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          Browse Events
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#0B0D1A] min-h-screen pt-24">
      <section className="py-10 px-6 md:px-10">
        <div className="max-w-4xl mx-auto">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-3xl md:text-4xl font-extrabold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            My Orders
          </motion.h1>
          <p className="text-white/50 mb-8">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>

          <div className="space-y-6">
            {orders.map((order, index) => {
              const tickets = order.items.filter(i => i.itemType === 'ticket')
              const merch = order.items.filter(i => i.itemType === 'merch')

              return (
                <motion.div
                  key={order.id}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  {/* Order Header */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-white/40 text-xs m-0">Order ID</p>
                        <p className="text-orange-400 font-mono font-bold text-sm m-0">{order.id}</p>
                      </div>
                      <div className="w-px h-8 bg-white/10" />
                      <div className="flex items-center gap-2">
                        <IoCalendarOutline className="text-white/40 text-sm" />
                        <span className="text-white/60 text-sm">
                          {new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-3 py-1 rounded-full text-emerald-300"
                        style={{ background: 'rgba(16,185,129,0.15)' }}
                      >
                        {order.status === 'confirmed' ? 'Confirmed' : order.status}
                      </span>
                      <span className="text-white font-bold">${order.grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5">
                    {tickets.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <IoTicketOutline className="text-orange-400 text-sm" />
                          <span className="text-white/50 text-xs font-semibold">TICKETS</span>
                        </div>
                        {tickets.map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5">
                            <div>
                              <p className="text-white text-sm m-0">{item.eventTitle}</p>
                              <p className="text-white/40 text-xs m-0">{item.name} x{item.quantity}</p>
                            </div>
                            <span className="text-white/70 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {merch.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <IoShirtOutline className="text-indigo-400 text-sm" />
                          <span className="text-white/50 text-xs font-semibold">MERCHANDISE</span>
                        </div>
                        {merch.map((item, i) => (
                          <div key={i} className="flex items-center justify-between py-1.5">
                            <div>
                              <p className="text-white text-sm m-0">{item.name}</p>
                              <p className="text-white/40 text-xs m-0">
                                {[item.size, item.color].filter(Boolean).join(' / ')} x{item.quantity}
                              </p>
                            </div>
                            <span className="text-white/70 text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* View Details */}
                  <div className="px-5 pb-4">
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="text-orange-400 hover:text-orange-300 text-sm font-medium no-underline transition-colors"
                    >
                      View Order Details →
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default MyOrdersPage
