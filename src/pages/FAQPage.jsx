import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IoChevronDown, IoSearch } from 'react-icons/io5'

const faqCategories = [
  { id: 'general', label: 'General' },
  { id: 'tickets', label: 'Tickets & Booking' },
  { id: 'payment', label: 'Payment' },
  { id: 'account', label: 'Account' },
]

const faqs = [
  {
    id: 1,
    category: 'general',
    question: 'What is Monora?',
    answer: 'Monora is a comprehensive event ticketing platform that helps you discover, book, and manage tickets for concerts, festivals, sports events, comedy shows, and more. We connect event-goers with the best live experiences in their city and beyond.',
  },
  {
    id: 2,
    category: 'general',
    question: 'How do I find events near me?',
    answer: 'You can use our search bar on the homepage to search by location, date, or event name. You can also browse by category — Concerts, Festivals, Sports, or Comedy — to find events that match your interests.',
  },
  {
    id: 3,
    category: 'general',
    question: 'Is Monora available in my city?',
    answer: 'Monora is currently available in over 120 cities worldwide. We\'re constantly expanding our coverage. Check our Events page and enter your location to see what\'s happening near you.',
  },
  {
    id: 4,
    category: 'tickets',
    question: 'How do I purchase tickets?',
    answer: 'Simply find an event you\'re interested in, select the number of tickets, choose your seating preference (if applicable), and proceed to checkout. You can pay using credit/debit cards, PayPal, or other supported payment methods.',
  },
  {
    id: 5,
    category: 'tickets',
    question: 'Can I get a refund on my tickets?',
    answer: 'Refund policies vary by event. Most events offer full refunds up to 48 hours before the event date. Some events may have a no-refund policy. You can check the specific refund policy on the event detail page before purchasing.',
  },
  {
    id: 6,
    category: 'tickets',
    question: 'How will I receive my tickets?',
    answer: 'After purchasing, your e-tickets will be sent to your registered email and will also be available in your Monora account under "My Tickets". You can show the QR code on your phone at the venue entrance.',
  },
  {
    id: 7,
    category: 'tickets',
    question: 'Can I transfer my ticket to someone else?',
    answer: 'Yes! You can transfer tickets to another person through your account. Go to "My Tickets", select the ticket, and use the "Transfer" option. The recipient will receive the ticket via email.',
  },
  {
    id: 8,
    category: 'payment',
    question: 'What payment methods are accepted?',
    answer: 'We accept Visa, Mastercard, American Express, PayPal, Apple Pay, and Google Pay. All transactions are secured with industry-standard encryption.',
  },
  {
    id: 9,
    category: 'payment',
    question: 'Are there any additional fees?',
    answer: 'A small service fee is added to each ticket purchase to cover platform and processing costs. The total amount including fees is always shown before you confirm your purchase — no hidden charges.',
  },
  {
    id: 10,
    category: 'payment',
    question: 'Is my payment information secure?',
    answer: 'Absolutely. We use 256-bit SSL encryption and are PCI DSS compliant. We never store your full credit card information on our servers.',
  },
  {
    id: 11,
    category: 'account',
    question: 'How do I create an account?',
    answer: 'Click the "Login / Sign Up" button at the top of the page. You can create an account using your email address, or sign up quickly with Google or Apple.',
  },
  {
    id: 12,
    category: 'account',
    question: 'I forgot my password. How do I reset it?',
    answer: 'Click "Login / Sign Up", then select "Forgot Password". Enter your email address, and we\'ll send you a link to reset your password. The link expires after 24 hours.',
  },
]

function FAQItem({ faq }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer bg-transparent border-none"
      >
        <span className="text-white font-medium text-sm md:text-base pr-4">{faq.question}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="shrink-0"
        >
          <IoChevronDown className="text-white/50 text-lg" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0">
              <p className="text-white/40 text-sm leading-relaxed">{faq.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('general')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = faq.category === activeCategory
    const matchesSearch = searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="bg-[#0B0D1A] min-h-screen pt-24">
      {/* Hero Banner */}
      <section className="relative py-16 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }}
          />
          <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
          />
        </div>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-4 block"
          >
            Help Center
          </motion.span>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Frequently Asked Questions
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed mb-8"
          >
            Find answers to common questions about Monora, tickets, payments, and your account.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center gap-3 max-w-lg mx-auto rounded-full px-5 py-3"
            style={{
              background: 'rgba(255,255,255,0.07)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <IoSearch className="text-white/50 text-lg shrink-0" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-white text-sm placeholder-white/40 w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-8 px-6 md:px-10 pb-20">
        <div className="max-w-3xl mx-auto">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {faqCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 rounded-full text-sm font-medium cursor-pointer transition-all border-none ${
                  activeCategory === cat.id ? 'text-white' : 'text-white/50 hover:text-white'
                }`}
                style={{
                  background: activeCategory === cat.id
                    ? 'linear-gradient(135deg, #f97316, #ea580c)'
                    : 'rgba(255,255,255,0.06)',
                  border: activeCategory === cat.id ? 'none' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="flex flex-col gap-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => <FAQItem key={faq.id} faq={faq} />)
            ) : (
              <div className="text-center py-12">
                <p className="text-white/30 text-lg">No questions found matching your search.</p>
              </div>
            )}
          </div>

          {/* Still have questions */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 text-center p-8 rounded-2xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
          >
            <h3 className="text-xl font-bold text-white mb-3">Still have questions?</h3>
            <p className="text-white/40 text-sm mb-5">
              Can't find what you're looking for? Reach out to our support team.
            </p>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block text-white font-semibold text-sm px-7 py-3 rounded-full cursor-pointer no-underline"
              style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                boxShadow: '0 4px 15px rgba(249,115,22,0.3)',
              }}
            >
              Contact Support
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default FAQPage
