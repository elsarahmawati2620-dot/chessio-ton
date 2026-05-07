import { Link } from "wouter";
import { TonConnectButton } from "@tonconnect/ui-react";
import { FaTwitter, FaTelegram, FaChessKnight } from "react-icons/fa";
import { motion } from "framer-motion";

const LOGO = "https://i.imgur.com/KfYwnPE.png";

const tokenomicsData = [
  { label: "Liquidity Pool", pct: 40, color: "bg-sky-400" },
  { label: "Community Rewards", pct: 25, color: "bg-blue-500" },
  { label: "Team & Development", pct: 15, color: "bg-cyan-400" },
  { label: "Marketing", pct: 12, color: "bg-indigo-400" },
  { label: "Reserve", pct: 8, color: "bg-sky-600" },
];

const roadmapItems = [
  { phase: "Phase 1", title: "Launch & Community", done: true, items: ["Token launch on Groypfi.io", "Community building", "Social media presence"] },
  { phase: "Phase 2", title: "Growth", done: false, items: ["CEX listings", "Partnership announcements", "Chess tournament with $CHESS prizes"] },
  { phase: "Phase 3", title: "Expansion", done: false, items: ["In-game NFT integration", "Staking mechanism", "Cross-chain bridge"] },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-sky-200 text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-sky-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={LOGO} alt="Chessio" className="w-9 h-9 rounded-full" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className="text-xl font-extrabold text-sky-700 tracking-tight">CHESSIO</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-sky-800">
            <a href="#about">About</a>
            <a href="#tokenomics">Tokenomics</a>
            <a href="#roadmap">Roadmap</a>
            <Link href="/play" className="text-sky-600 font-semibold">Play Chess</Link>
          </div>
          <div className="flex items-center gap-3">
            <TonConnectButton />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-sky-200 opacity-30"
              style={{ left: `${(i * 8.5) % 100}%`, top: `${(i * 13) % 80}%`, fontSize: `${24 + (i % 3) * 16}px` }}
              animate={{ y: [0, -18, 0], rotate: [0, 15, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut" }}
            >
              ♟
            </motion.div>
          ))}
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
            <img src={LOGO} alt="Chessio Logo" className="w-28 h-28 mx-auto mb-6 rounded-full shadow-xl border-4 border-white/60 object-cover" onError={e => { (e.target as HTMLImageElement).src = ''; }} />
          </motion.div>
          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="text-6xl sm:text-7xl font-black text-sky-700 mb-4 tracking-tight">
            CHESSIO
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35, duration: 0.6 }} className="text-xl text-sky-600 mb-2 font-medium">
            The Ultimate Chess Memecoin on TON Blockchain
          </motion.p>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.6 }} className="text-base text-sky-500 mb-8">
            Play chess. Earn $CHESS. Conquer the board.
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.65 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/play">
              <button className="px-8 py-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-lg rounded-2xl shadow-lg transition-all hover:scale-105 flex items-center gap-2">
                <FaChessKnight /> Play Chess
              </button>
            </Link>
            <a href="https://groypfi.io" target="_blank" rel="noopener noreferrer">
              <button className="px-8 py-4 bg-white/70 hover:bg-white text-sky-700 font-bold text-lg rounded-2xl shadow-md border border-sky-200 transition-all hover:scale-105">
                Buy on Groypfi.io
              </button>
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }} className="mt-8 flex justify-center gap-6">
            <div className="glass rounded-2xl px-6 py-3 text-center">
              <p className="text-xs text-sky-500 uppercase tracking-widest font-semibold">Contract Address</p>
              <p className="text-sky-700 font-bold text-sm mt-1">Coming Soon</p>
            </div>
            <div className="glass rounded-2xl px-6 py-3 text-center">
              <p className="text-xs text-sky-500 uppercase tracking-widest font-semibold">Network</p>
              <p className="text-sky-700 font-bold text-sm mt-1">TON Blockchain</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-4xl font-black text-sky-700 mb-3">What is Chessio?</h2>
            <p className="text-sky-600 max-w-2xl mx-auto text-base">
              Chessio is the first chess-powered memecoin on the TON blockchain. Combining the timeless strategy of chess with the power of DeFi, Chessio brings a unique play-to-earn ecosystem where your chess skills translate to real value.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "♟", title: "Chess Minigame", desc: "Play against AI (Easy/Normal/Hard) or challenge players worldwide in real-time PvP matches right in your browser." },
              { icon: "💎", title: "TON Native", desc: "Built on the lightning-fast TON blockchain with ultra-low fees. Connect your TON wallet and start trading instantly." },
              { icon: "🚀", title: "Launching on Groypfi", desc: "Fair launch on Groypfi.io — no presale, no VC allocation. 100% community driven from day one." },
            ].map((card, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass rounded-2xl p-6 text-center hover:scale-105 transition-transform">
                <div className="text-5xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-bold text-sky-700 mb-2">{card.title}</h3>
                <p className="text-sky-600 text-sm">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tokenomics */}
      <section id="tokenomics" className="py-16 px-4 bg-sky-100/60">
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-4xl font-black text-sky-700 text-center mb-10">Tokenomics</motion.h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              {tokenomicsData.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                  <div className="flex justify-between text-sm font-semibold text-sky-700 mb-1">
                    <span>{item.label}</span><span>{item.pct}%</span>
                  </div>
                  <div className="h-3 bg-sky-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${item.pct}%` }} viewport={{ once: true }} transition={{ duration: 0.8, delay: i * 0.08 }} className={`h-full rounded-full ${item.color}`} />
                  </div>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="glass rounded-2xl p-8 text-center">
              <p className="text-sky-500 text-sm uppercase tracking-widest font-semibold mb-2">Total Supply</p>
              <p className="text-5xl font-black text-sky-700">1B</p>
              <p className="text-sky-500 font-semibold">$CHESS</p>
              <div className="mt-6 space-y-2 text-left">
                <div className="flex justify-between text-sm"><span className="text-sky-600">Symbol</span><span className="font-bold text-sky-700">$CHESS</span></div>
                <div className="flex justify-between text-sm"><span className="text-sky-600">Network</span><span className="font-bold text-sky-700">TON</span></div>
                <div className="flex justify-between text-sm"><span className="text-sky-600">Contract</span><span className="font-bold text-sky-700">Soon</span></div>
                <div className="flex justify-between text-sm"><span className="text-sky-600">Launch</span><span className="font-bold text-sky-700">Groypfi.io</span></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-4xl font-black text-sky-700 text-center mb-10">Roadmap</motion.h2>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-sky-200 hidden md:block" />
            <div className="space-y-8">
              {roadmapItems.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="md:ml-16 glass rounded-2xl p-6 relative">
                  <div className="hidden md:flex absolute -left-10 top-6 w-6 h-6 rounded-full border-2 items-center justify-center" style={{ borderColor: item.done ? '#0ea5e9' : '#bae6fd', background: item.done ? '#0ea5e9' : '#f0f9ff' }}>
                    {item.done && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-600">{item.phase}</span>
                    <h3 className="text-lg font-bold text-sky-700">{item.title}</h3>
                    {item.done && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-600">Completed</span>}
                  </div>
                  <ul className="space-y-1">
                    {item.items.map((it, j) => (
                      <li key={j} className="text-sky-600 text-sm flex items-center gap-2">
                        <span className="text-sky-400">▸</span>{it}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Play CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="text-6xl mb-4">♛</div>
            <h2 className="text-4xl font-black mb-4">Ready to Play?</h2>
            <p className="text-sky-100 mb-8">Challenge the AI or play PvP online with players from around the world. Show your chess skills on the blockchain.</p>
            <Link href="/play">
              <button className="px-10 py-4 bg-white text-sky-600 font-black text-xl rounded-2xl hover:scale-105 transition-transform shadow-xl">
                Play Chess Now
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-sky-800 text-white">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src={LOGO} alt="Chessio" className="w-8 h-8 rounded-full" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="text-lg font-black">CHESSIO</span>
            </div>
            <div className="flex gap-6">
              <a href="https://x.com/chessiooxyz" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-200 hover:text-white transition-colors">
                <FaTwitter size={20} /> <span className="font-medium">@chessiooxyz</span>
              </a>
              <a href="https://t.me/Chessiocommunity" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-200 hover:text-white transition-colors">
                <FaTelegram size={20} /> <span className="font-medium">Chessiocommunity</span>
              </a>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-sky-700 text-center text-sky-400 text-sm">
            <p>Chessio is a memecoin. Not financial advice. DYOR.</p>
            <p className="mt-1">© 2025 Chessio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
