import { useState } from 'react'
import { motion } from 'framer-motion'
import { IoMailOutline, IoCallOutline, IoLocationOutline, IoLogoTwitter, IoLogoInstagram, IoLogoFacebook } from 'react-icons/io5'

const contactInfo = [
  {
    icon: IoMailOutline,
    title: 'Email Us',
    detail: 'support@monora.com',
    subDetail: 'We reply within 24 hours',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  },
  {
    icon: IoCallOutline,
    title: 'Call Us',
    detail: '+1 (555) 123-4567',
    subDetail: 'Mon-Fri, 9 AM - 6 PM EST',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
  },
  {
    icon: IoLocationOutline,
    title: 'Visit Us',
    detail: '123 Event Street, Suite 100',
    subDetail: 'New York, NY 10001',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
  },
]

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Message sent! We\'ll get back to you soon.')
    setFormData({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="bg-[#0B0D1A] min-h-screen pt-24">
      {/* Hero Banner */}
      <section className="relative py-16 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }}
          />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f97316, transparent)' }}
          />
        </div>

        <div className="max-w-3xl mx-auto relative z-10 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-4 block"
          >
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
            style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/50 text-lg max-w-xl mx-auto leading-relaxed"
          >
            Have a question, feedback, or need support? We'd love to hear from you. Our team is here to help.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="px-6 md:px-10 pb-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {contactInfo.map((info, i) => {
            const Icon = info.icon
            return (
              <motion.div
                key={info.title}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="p-6 rounded-2xl text-center"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: info.gradient }}
                >
                  <Icon className="text-white text-2xl" />
                </div>
                <h3 className="text-white font-bold text-base mb-1">{info.title}</h3>
                <p className="text-white/70 text-sm mb-0.5">{info.detail}</p>
                <p className="text-white/30 text-xs">{info.subDetail}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Contact Form + Map */}
      <section className="py-12 px-6 md:px-10 pb-20">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
          {/* Form */}
          <motion.div
            initial={{ x: -30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Send Us a Message</h2>
            <p className="text-white/40 text-sm mb-6">Fill out the form below and we'll get back to you as soon as possible.</p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/30 outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                    className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/30 outline-none"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  required
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/30 outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
              </div>

              <div>
                <label className="text-white/50 text-xs font-medium mb-1.5 block">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your question..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/30 outline-none resize-none"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-white font-semibold text-sm px-8 py-3.5 rounded-full cursor-pointer border-none w-full sm:w-auto"
                style={{
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  boxShadow: '0 6px 20px rgba(249,115,22,0.35)',
                }}
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>

          {/* Right side info */}
          <motion.div
            initial={{ x: 30, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Map placeholder */}
            <div
              className="rounded-2xl overflow-hidden h-[280px] relative"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <iframe
                title="Monora Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304903!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1690000000000"
                className="w-full h-full border-none"
                style={{ filter: 'invert(90%) hue-rotate(180deg) brightness(0.8) contrast(1.2)' }}
                loading="lazy"
              />
            </div>

            {/* Social Links */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h3 className="text-white font-bold text-base mb-3">Follow Us on Social Media</h3>
              <p className="text-white/40 text-sm mb-4">Stay up to date with the latest events and announcements.</p>
              <div className="flex gap-3">
                {[
                  { icon: IoLogoTwitter, label: 'Twitter', color: '#1DA1F2' },
                  { icon: IoLogoInstagram, label: 'Instagram', color: '#E4405F' },
                  { icon: IoLogoFacebook, label: 'Facebook', color: '#1877F2' },
                ].map((social) => {
                  const Icon = social.icon
                  return (
                    <motion.a
                      key={social.label}
                      href="#"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-11 h-11 rounded-xl flex items-center justify-center text-white no-underline"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <Icon className="text-xl" />
                    </motion.a>
                  )
                })}
              </div>
            </div>

            {/* Operating Hours */}
            <div
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <h3 className="text-white font-bold text-base mb-3">Operating Hours</h3>
              <div className="flex flex-col gap-2">
                {[
                  { day: 'Monday - Friday', hours: '9:00 AM - 6:00 PM EST' },
                  { day: 'Saturday', hours: '10:00 AM - 4:00 PM EST' },
                  { day: 'Sunday', hours: 'Closed' },
                ].map((row) => (
                  <div key={row.day} className="flex items-center justify-between">
                    <span className="text-white/50 text-sm">{row.day}</span>
                    <span className="text-white/70 text-sm font-medium">{row.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
