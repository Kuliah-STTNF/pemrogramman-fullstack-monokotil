import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoTicketOutline, IoShirtOutline, IoCalendarOutline, IoTimeOutline, IoReceiptOutline, IoArrowUndoOutline } from 'react-icons/io5'
import { useAuth } from '../context/AuthContext'

function MyOrdersPage() {
  const { getUserOrders, isAuthenticated, requestRefund, getRefundByOrderId } = useAuth()
  const [refundModal, setRefundModal] = useState(null)
  const [refundReason, setRefundReason] = useState('')
  const [refundMessage, setRefundMessage] = useState(null)

  const handleRequestRefund = (orderId) => {
    if (!refundReason.trim()) return
    const result = requestRefund(orderId, refundReason)
    setRefundMessage(result)
    if (result.success) {
      setTimeout(() => {
        setRefundModal(null)
        setRefundReason('')
        setRefundMessage(null)
      }, 1500)
    }
  }

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
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        order.status === 'confirmed' ? 'text-emerald-300' :
                        order.status === 'refunded' ? 'text-blue-300' :
                        order.status === 'cancelled' ? 'text-red-300' : 'text-yellow-300'
                      }`}
                        style={{
                          background: order.status === 'confirmed' ? 'rgba(16,185,129,0.15)' :
                            order.status === 'refunded' ? 'rgba(59,130,246,0.15)' :
                            order.status === 'cancelled' ? 'rgba(239,68,68,0.15)' : 'rgba(234,179,8,0.15)'
                        }}
                      >
                        {order.status === 'confirmed' ? 'Confirmed' :
                         order.status === 'refunded' ? 'Refunded' :
                         order.status === 'cancelled' ? 'Cancelled' : order.status}
                      </span>
                      {(() => {
                        const refund = getRefundByOrderId(order.id)
                        if (refund && refund.status === 'pending') {
                          return (
                            <span className="text-xs font-semibold px-3 py-1 rounded-full text-yellow-300"
                              style={{ background: 'rgba(234,179,8,0.15)' }}
                            >
                              Refund Pending
                            </span>
                          )
                        }
                        return null
                      })()}
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

                  {/* Actions */}
                  <div className="px-5 pb-4 flex items-center justify-between">
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="text-orange-400 hover:text-orange-300 text-sm font-medium no-underline transition-colors"
                    >
                      View Order Details →
                    </Link>
                    {order.status === 'confirmed' && !getRefundByOrderId(order.id) && (
                      <button
                        onClick={() => setRefundModal(order.id)}
                        className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-sm font-medium cursor-pointer bg-transparent border-none transition-colors"
                      >
                        <IoArrowUndoOutline />
                        Request Refund
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Refund Modal */}
      {refundModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && setRefundModal(null)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              background: 'rgba(15,15,35,0.95)',
              border: '1px solid rgba(255,255,255,0.1)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}
          >
            <h3 className="text-white font-bold text-lg mb-1">Request Refund</h3>
            <p className="text-white/40 text-sm mb-4">Order: <span className="text-orange-400 font-mono">{refundModal}</span></p>

            <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
              <p className="text-yellow-300 text-xs m-0">
                Refunds are processed within 3-5 business days. Please note that service fees are non-refundable.
              </p>
            </div>

            <label className="text-white/50 text-xs mb-1.5 block">Reason for refund</label>
            <textarea
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              placeholder="Please explain why you'd like a refund..."
              rows={3}
              className="w-full bg-transparent text-white text-sm py-3 px-4 rounded-xl outline-none placeholder-white/30 resize-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />

            {refundMessage && (
              <p className={`text-xs mt-2 ${refundMessage.success ? 'text-emerald-400' : 'text-red-400'}`}>
                {refundMessage.success ? 'Refund request submitted successfully!' : refundMessage.message}
              </p>
            )}

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => { setRefundModal(null); setRefundReason(''); setRefundMessage(null) }}
                className="flex-1 py-3 rounded-xl text-sm font-medium text-white/60 cursor-pointer bg-transparent transition-colors hover:text-white"
                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleRequestRefund(refundModal)}
                disabled={!refundReason.trim()}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white cursor-pointer border-none transition-all"
                style={{
                  background: refundReason.trim() ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(255,255,255,0.06)',
                  opacity: refundReason.trim() ? 1 : 0.5,
                }}
              >
                Submit Refund Request
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default MyOrdersPage
