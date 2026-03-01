import { Link } from 'react-router-dom'

const footerLinks = [
  { name: 'Home', path: '/' },
  { name: 'Events', path: '/events' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' },
]

function Footer() {
  return (
    <footer className="bg-[#070810] border-t border-white/5 py-12 px-6 md:px-10">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-around gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col items-start gap-4">
            <Link to="/" className="flex items-center gap-2.5 mb-4 no-underline">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #06b6d4, #3b82f6)' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" fill="white" />
                </svg>
              </div>
              <span className="text-white font-extrabold text-xl tracking-tight">Monora</span>
            </Link>
            <p className="text-white/40 text-xl max-w-xs leading-relaxed">
              Your one-stop destination for discovering and booking the best events, concerts, and festivals.
            </p>
          </div>

          {/* Links */}
          <div className="flex">
            <div>
              <h4 className="text-white font-semibold text-xl mb-4">Quick Links</h4>
              <ul className="list-none m-0 p-0 flex flex-col gap-2.5">
                {footerLinks.map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-white/40 text-lg no-underline hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Social */}
          {/* <div>
            <h4 className="text-white font-semibold text-sm mb-4">Follow Us</h4>
            <div className="flex items-center gap-3">
              {[IoLogoFacebook, IoLogoTwitter, IoLogoInstagram, IoLogoYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white transition-all hover:bg-white/10"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>
          </div> */}
        </div>

        {/* Decorative star */}
        <div className="flex justify-end mt-6">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="opacity-30">
            <path d="M20 0L24 16L40 20L24 24L20 40L16 24L0 20L16 16L20 0Z" fill="url(#starGrad)" />
            <defs>
              <linearGradient id="starGrad" x1="0" y1="0" x2="40" y2="40">
                <stop stopColor="#f97316" />
                <stop offset="1" stopColor="#fbbf24" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 mt-8 pt-6 text-center">
          <p className="text-white/30 text-xs">
            © 2026 Monora. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
