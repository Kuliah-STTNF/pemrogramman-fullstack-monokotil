import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { IoCardOutline, IoLockClosedOutline, IoShieldCheckmarkOutline, IoTicketOutline, IoShirtOutline, IoArrowBack } from 'react-icons/io5'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCart()
  const { user, isAuthenticated, addOrder } = useAuth()
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: Info, 2: Payment, 3: Processing
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    // Payment
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardName: '',
    // Merch delivery
    deliveryMethod: 'pickup', // pickup or delivery
    address: '',
    city: '',
    zipCode: '',
  })
  const [errors, setErrors] = useState({})

  const tickets = items.filter(item => item.itemType === 'ticket')
  const merch = items.filter(item => item.itemType === 'merch')
  const serviceFee = total * 0.05
  const grandTotal = total + serviceFee

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email.trim()) newErrors.email = 'Email is required'
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
    if (merch.length > 0 && formData.deliveryMethod === 'delivery') {
      if (!formData.address.trim()) newErrors.address = 'Address is required'
      if (!formData.city.trim()) newErrors.city = 'City is required'
      if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Card number is required'
    if (formData.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Invalid card number'
    if (!formData.cardExpiry.trim()) newErrors.cardExpiry = 'Expiry is required'
    if (!formData.cardCVC.trim()) newErrors.cardCVC = 'CVC is required'
    if (!formData.cardName.trim()) newErrors.cardName = 'Cardholder name is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2)
    } else if (step === 2 && validateStep2()) {
      processPayment()
    }
  }

  const processPayment = () => {
    setStep(3)
    // Simulate payment processing
    setTimeout(() => {
      const order = addOrder({
        items: items.map(item => ({ ...item })),
        subtotal: total,
        serviceFee,
        grandTotal,
        customerInfo: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        },
        deliveryMethod: merch.length > 0 ? formData.deliveryMethod : null,
        deliveryAddress: formData.deliveryMethod === 'delivery' ? {
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
        } : null,
      })
      clearCart()
      navigate(`/order-confirmation/${order.id}`)
    }, 2500)
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 16)
    const parts = []
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.slice(i, i + 4))
    }
    return parts.join(' ')
  }

  const formatExpiry = (value) => {
    const v = value.replace(/\D/g, '').slice(0, 4)
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2)
    return v
  }

  if (itemCount === 0 && step !== 3) {
    return (
      <div className="bg-[#0B0D1A] min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-3xl font-bold text-white mb-3">Nothing to Checkout</h1>
        <p className="text-white/50 mb-8">Add items to your cart before checking out.</p>
        <Link to="/events" className="text-white px-6 py-3 rounded-full text-sm font-semibold no-underline"
          style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
        >
          Browse Events
        </Link>
      </div>
    )
  }

  // Processing state
  if (step === 3) {
    return (
      <div className="bg-[#0B0D1A] min-h-screen pt-24 flex flex-col items-center justify-center text-center px-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-20 h-20 rounded-full border-t-2 border-orange-400 border-b-2 border-r-transparent border-l-transparent"
            />
            <IoLockClosedOutline className="absolute inset-0 m-auto text-orange-400 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Processing Payment...</h2>
          <p className="text-white/50">Please wait while we secure your tickets.</p>
        </motion.div>
      </div>
    )
  }

  const inputClass = "w-full bg-transparent text-white text-sm py-3 px-4 rounded-xl outline-none placeholder-white/30 transition-all"

  return (
    <div className="bg-[#0B0D1A] min-h-screen pt-24">
      {/* Header */}
      <section className="py-8 px-6 md:px-10">
        <div className="max-w-5xl mx-auto">
          <Link to="/cart" className="flex items-center gap-2 text-white/60 hover:text-white text-sm no-underline mb-4 transition-colors">
            <IoArrowBack />
            Back to Cart
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Checkout
          </h1>

          {/* Step Indicators */}
          <div className="flex items-center gap-4 mt-6">
            {[
              { num: 1, label: 'Your Info' },
              { num: 2, label: 'Payment' },
            ].map((s) => (
              <div key={s.num} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s.num ? 'text-white' : 'text-white/30'
                }`}
                  style={{
                    background: step >= s.num ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'rgba(255,255,255,0.06)',
                  }}
                >
                  {s.num}
                </div>
                <span className={`text-sm font-medium ${step >= s.num ? 'text-white' : 'text-white/30'}`}>{s.label}</span>
                {s.num < 2 && <div className="w-12 h-px bg-white/10 mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 md:px-10 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {step === 1 && (
                <div className="space-y-6">
                  {/* Personal Info */}
                  <div className="rounded-2xl p-6"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <h3 className="text-white font-bold text-lg mb-4">Personal Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-white/50 text-xs mb-1.5 block">Full Name</label>
                        <input
                          type="text" name="name" value={formData.name} onChange={handleChange}
                          placeholder="John Doe" className={inputClass}
                          style={{ background: 'rgba(255,255,255,0.06)', border: errors.name ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                        />
                        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/50 text-xs mb-1.5 block">Email</label>
                          <input
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            placeholder="john@example.com" className={inputClass}
                            style={{ background: 'rgba(255,255,255,0.06)', border: errors.email ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                          />
                          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                          <label className="text-white/50 text-xs mb-1.5 block">Phone</label>
                          <input
                            type="tel" name="phone" value={formData.phone} onChange={handleChange}
                            placeholder="+1 (555) 000-0000" className={inputClass}
                            style={{ background: 'rgba(255,255,255,0.06)', border: errors.phone ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                          />
                          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Method (only if merch exists) */}
                  {merch.length > 0 && (
                    <div className="rounded-2xl p-6"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <h3 className="text-white font-bold text-lg mb-4">Merchandise Delivery</h3>
                      <div className="flex gap-3 mb-4">
                        {[
                          { value: 'pickup', label: 'Pickup at Event', desc: 'Free' },
                          { value: 'delivery', label: 'Ship to Address', desc: '+$10.00' },
                        ].map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: opt.value }))}
                            className={`flex-1 p-4 rounded-xl cursor-pointer transition-all border-none text-left ${
                              formData.deliveryMethod === opt.value ? 'text-white' : 'text-white/50'
                            }`}
                            style={{
                              background: formData.deliveryMethod === opt.value
                                ? 'rgba(249,115,22,0.15)'
                                : 'rgba(255,255,255,0.04)',
                              border: formData.deliveryMethod === opt.value
                                ? '1px solid rgba(249,115,22,0.4)'
                                : '1px solid rgba(255,255,255,0.08)',
                            }}
                          >
                            <p className="font-semibold text-sm m-0">{opt.label}</p>
                            <p className="text-xs mt-1 m-0 opacity-60">{opt.desc}</p>
                          </button>
                        ))}
                      </div>

                      {formData.deliveryMethod === 'delivery' && (
                        <div className="space-y-4 mt-4">
                          <div>
                            <label className="text-white/50 text-xs mb-1.5 block">Address</label>
                            <input
                              type="text" name="address" value={formData.address} onChange={handleChange}
                              placeholder="123 Main St" className={inputClass}
                              style={{ background: 'rgba(255,255,255,0.06)', border: errors.address ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                            />
                            {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-white/50 text-xs mb-1.5 block">City</label>
                              <input
                                type="text" name="city" value={formData.city} onChange={handleChange}
                                placeholder="New York" className={inputClass}
                                style={{ background: 'rgba(255,255,255,0.06)', border: errors.city ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                              />
                              {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                            </div>
                            <div>
                              <label className="text-white/50 text-xs mb-1.5 block">Zip Code</label>
                              <input
                                type="text" name="zipCode" value={formData.zipCode} onChange={handleChange}
                                placeholder="10001" className={inputClass}
                                style={{ background: 'rgba(255,255,255,0.06)', border: errors.zipCode ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                              />
                              {errors.zipCode && <p className="text-red-400 text-xs mt-1">{errors.zipCode}</p>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="rounded-2xl p-6"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center gap-2 mb-6">
                    <IoCardOutline className="text-orange-400 text-xl" />
                    <h3 className="text-white font-bold text-lg m-0">Payment Details</h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-white/50 text-xs mb-1.5 block">Card Number</label>
                      <input
                        type="text" name="cardNumber"
                        value={formData.cardNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, cardNumber: formatCardNumber(e.target.value) }))}
                        placeholder="4242 4242 4242 4242" className={inputClass}
                        style={{ background: 'rgba(255,255,255,0.06)', border: errors.cardNumber ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                      />
                      {errors.cardNumber && <p className="text-red-400 text-xs mt-1">{errors.cardNumber}</p>}
                    </div>
                    <div>
                      <label className="text-white/50 text-xs mb-1.5 block">Cardholder Name</label>
                      <input
                        type="text" name="cardName" value={formData.cardName} onChange={handleChange}
                        placeholder="JOHN DOE" className={inputClass}
                        style={{ background: 'rgba(255,255,255,0.06)', border: errors.cardName ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                      />
                      {errors.cardName && <p className="text-red-400 text-xs mt-1">{errors.cardName}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/50 text-xs mb-1.5 block">Expiry Date</label>
                        <input
                          type="text" name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={(e) => setFormData(prev => ({ ...prev, cardExpiry: formatExpiry(e.target.value) }))}
                          placeholder="MM/YY" className={inputClass}
                          style={{ background: 'rgba(255,255,255,0.06)', border: errors.cardExpiry ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                        />
                        {errors.cardExpiry && <p className="text-red-400 text-xs mt-1">{errors.cardExpiry}</p>}
                      </div>
                      <div>
                        <label className="text-white/50 text-xs mb-1.5 block">CVC</label>
                        <input
                          type="text" name="cardCVC"
                          value={formData.cardCVC}
                          onChange={(e) => setFormData(prev => ({ ...prev, cardCVC: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                          placeholder="123" className={inputClass}
                          style={{ background: 'rgba(255,255,255,0.06)', border: errors.cardCVC ? '1px solid #ef4444' : '1px solid rgba(255,255,255,0.1)' }}
                        />
                        {errors.cardCVC && <p className="text-red-400 text-xs mt-1">{errors.cardCVC}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-6 text-emerald-400 text-xs">
                    <IoShieldCheckmarkOutline className="text-lg" />
                    <span>Your payment information is encrypted and secure</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between mt-6">
              {step > 1 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-white/60 hover:text-white text-sm font-medium cursor-pointer bg-transparent border-none transition-colors"
                >
                  Back
                </button>
              ) : <div />}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleNext}
                className="text-white px-8 py-3.5 rounded-xl text-sm font-semibold cursor-pointer border-none"
                style={{
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
                }}
              >
                {step === 2 ? `Pay $${grandTotal.toFixed(2)}` : 'Continue to Payment'}
              </motion.button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <div className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <h3 className="text-lg font-bold text-white mb-4">Order Summary</h3>

                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}
                >
                  {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <div className="shrink-0">
                        {item.itemType === 'ticket' ? (
                          <IoTicketOutline className="text-orange-400" />
                        ) : (
                          <IoShirtOutline className="text-indigo-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-xs font-medium m-0 truncate">
                          {item.itemType === 'ticket' ? `${item.name} - ${item.eventTitle}` : item.name}
                        </p>
                        <p className="text-white/30 text-xs m-0">x{item.quantity}</p>
                      </div>
                      <span className="text-white text-xs font-semibold shrink-0">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-white/10 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Subtotal</span>
                    <span className="text-white">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Service Fee (5%)</span>
                    <span className="text-white">${serviceFee.toFixed(2)}</span>
                  </div>
                  {merch.length > 0 && formData.deliveryMethod === 'delivery' && (
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Shipping</span>
                      <span className="text-white">$10.00</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-white font-bold">Total</span>
                    <span className="text-white font-bold text-xl">
                      ${(grandTotal + (merch.length > 0 && formData.deliveryMethod === 'delivery' ? 10 : 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CheckoutPage
