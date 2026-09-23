import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  Check,
  Copy,
  Hammer,
  KeyRound,
  Leaf,
  Link2,
  Pickaxe,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Volume2,
  VolumeX,
} from "lucide-react";
import fieldGuide from "../assets/blockchain-field-guide.jpg";
import specimens from "../assets/specimen-plate.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Gentle Chain — A Playful Blockchain Field Guide" },
      { name: "description", content: "Learn blocks, hashes, mining, wallets, and consensus through calm interactive experiments." },
      { property: "og:title", content: "The Gentle Chain — Blockchain Field Guide" },
      { property: "og:description", content: "A whimsical, hands-on guide to how blockchains work." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type ChainBlock = { id: number; data: string; nonce: number };
const ORIGINAL_ENTRIES = ["The meadow ledger begins", "Mara → Sol · 4 acorns", "Sol → Pip · 2 acorns"] as const;

function hashText(input: string) {
  let a = 0x811c9dc5;
  let b = 0x9e3779b9;
  for (let i = 0; i < input.length; i += 1) {
    a = Math.imul(a ^ input.charCodeAt(i), 16777619);
    b = Math.imul(b ^ (input.charCodeAt(i) + i), 2246822519);
  }
  const part = (n: number) => (n >>> 0).toString(16).padStart(8, "0");
  return `${part(a)}${part(b)}${part(a ^ b)}${part(Math.imul(a, b))}`;
}

function Button({ children, onClick, variant = "primary", disabled = false, ariaLabel }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "outline" | "quiet"; disabled?: boolean; ariaLabel?: string }) {
  return <button type="button" aria-label={ariaLabel} disabled={disabled} onClick={onClick} className={`guide-button guide-button-${variant}`}>{children}</button>;
}

function SectionTitle({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: React.ReactNode }) {
  return <header className="chapter-heading"><span className="chapter-number">{number}</span><div><p className="kicker">{kicker}</p><h2>{title}</h2><p>{children}</p></div></header>;
}

function Index() {
  const [sound, setSound] = useState(false);
  const [blockData, setBlockData] = useState("Mara sends Sol 4 acorns");
  const [nonce, setNonce] = useState(42);
  const [copied, setCopied] = useState(false);
  const [chain, setChain] = useState<ChainBlock[]>([
    { id: 1, data: "The meadow ledger begins", nonce: 14 },
    { id: 2, data: "Mara → Sol · 4 acorns", nonce: 82 },
    { id: 3, data: "Sol → Pip · 2 acorns", nonce: 31 },
  ]);
  const [signed, setSigned] = useState(false);
  const [mempool, setMempool] = useState(["Pip → Bea · 3 seeds", "Bea → Mara · 1 leaf"]);
  const [nodes, setNodes] = useState([true, false, true]);
  const [breathing, setBreathing] = useState(false);

  const blockHash = hashText(`${blockData}:${nonce}`);
  const hashes = useMemo(() => chain.map((block, index) => {
    const previous = index > 0 ? chain[index - 1] : undefined;
    const previousHash = previous ? hashText(`${previous.data}:${previous.nonce}`) : "GENESIS";
    return hashText(`${previousHash}:${block.data}:${block.nonce}`);
  }), [chain]);
  const valid = chain.every((block, index) => block.data === (ORIGINAL_ENTRIES[index] ?? block.data));

  const chirp = () => {
    if (!sound || typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(392, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(523, ctx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    oscillator.connect(gain).connect(ctx.destination);
    oscillator.start(); oscillator.stop(ctx.currentTime + 0.3);
  };

  const mineBlock = () => { let next = nonce + 1; while (!hashText(`${blockData}:${next}`).startsWith("0")) next += 1; setNonce(next); chirp(); };
  const updateChain = (index: number, data: string) => setChain((current) => current.map((block, i) => i === index ? { ...block, data } : block));
  const repairChain = () => { setChain((current) => current.map((block, i) => ({ ...block, data: ORIGINAL_ENTRIES[i] ?? block.data, nonce: block.nonce + 7 }))); chirp(); };

  return (
    <main>
      <nav className="topbar" aria-label="Main navigation">
        <a className="brand" href="#top"><span>✿</span> The Gentle Chain</a>
        <div className="nav-links"><a href="#block">Blocks</a><a href="#chain">Chain</a><a href="#wallet">Wallet</a><a href="#mine">Mining</a></div>
        <Button variant="quiet" ariaLabel={sound ? "Turn sounds off" : "Turn sounds on"} onClick={() => setSound((v) => !v)}>{sound ? <Volume2 size={17} /> : <VolumeX size={17} />}<span>Sound {sound ? "on" : "off"}</span></Button>
      </nav>

      <section id="top" className="hero">
        <img src={fieldGuide} width={1536} height={896} alt="A snail examining a chain of carved wooden blocks in a meadow" />
        <div className="hero-copy"><p className="eyebrow">A field guide to digital trust</p><h1>Follow the<br/><em>gentle chain.</em></h1><p>Blockchain doesn’t have to feel like a machine room. Poke the blocks, break the links, and learn by mending them.</p><a className="hero-cta" href="#block">Open the field notes <ArrowDown size={18} /></a></div>
        <div className="edition-stamp">Pocket edition<br/><strong>№ 001</strong></div>
      </section>

      <div className="marquee" aria-hidden="true"><span>HASHES ARE FINGERPRINTS</span><i>✦</i><span>BLOCKS REMEMBER</span><i>✦</i><span>TRUST TRAVELS IN CHAINS</span><i>✦</i></div>

      <section id="block" className="chapter">
        <SectionTitle number="01" kicker="Specimen one" title="Meet a block">Every block carries a message and a fingerprint. Change one letter and the fingerprint changes completely.</SectionTitle>
        <div className="lab-grid">
          <aside className="margin-note"><span>FIELD NOTE</span><p>A hash is a one-way summary. Tiny input changes make wildly different marks.</p><Leaf size={44} /></aside>
          <div className="experiment block-lab">
            <div className="experiment-top"><span>BLOCK № 001</span><span className="status"><i /> LIVE SPECIMEN</span></div>
            <label>Message inside the block<textarea value={blockData} onChange={(event) => setBlockData(event.target.value)} /></label>
            <div className="nonce-row"><label>Nonce<input type="number" value={nonce} onChange={(event) => setNonce(Number(event.target.value))} /></label><Button onClick={mineBlock}><Pickaxe size={17} /> Mine a neat hash</Button></div>
            <div className="hash-slip"><span>Block fingerprint</span><code>{blockHash}</code><Button variant="quiet" ariaLabel="Copy block hash" onClick={() => { navigator.clipboard?.writeText(blockHash); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>{copied ? <Check size={17}/> : <Copy size={17}/>}</Button></div>
          </div>
        </div>
      </section>

      <section id="chain" className="chapter chapter-forest">
        <SectionTitle number="02" kicker="The repair game" title="Mend the meadow chain">Someone altered a record. Find the odd block, restore its message, then repair the chain.</SectionTitle>
        <div className="game-status"><div><Sparkles size={20}/><strong>{valid ? "The chain is humming" : "A link has gone wonky"}</strong><span>{valid ? "Every record agrees." : "Spot the red block and mend it."}</span></div><Button onClick={repairChain} disabled={valid}><Hammer size={17}/> Repair all links</Button></div>
        <div className="chain-track">
          {chain.map((block, index) => {
            const damaged = block.data !== (ORIGINAL_ENTRIES[index] ?? block.data);
            const blockHashPreview = hashes[index]?.slice(0, 14) ?? "calculating";
            return <div className="chain-piece" key={block.id}>
              <article className={`chain-card ${damaged ? "damaged" : ""}`}><div className="block-mark">0{block.id}</div><label>Ledger entry<textarea value={block.data} onChange={(event) => updateChain(index, event.target.value)} /></label><code>{blockHashPreview}…</code><span className="seal">{damaged ? "!" : "✓"}</span></article>
              {index < chain.length - 1 && <Link2 className="chain-link" aria-hidden="true" />}
            </div>;
          })}
        </div>
        <p className="game-tip">Try changing “4 acorns” in block 02. The chain notices.</p>
      </section>

      <section id="wallet" className="chapter split-chapter">
        <div><SectionTitle number="03" kicker="Keys & signatures" title="Sign with a secret">A wallet proves “this came from me” without revealing the key tucked safely inside.</SectionTitle>
          <div className="wallet-demo"><div className="key-card private"><KeyRound size={28}/><span>Private key</span><code>fern-7A••••••91</code><small>Keep under your hat</small></div><div className="sign-arrow">→</div><div className={`key-card ${signed ? "signed" : ""}`}><ShieldCheck size={28}/><span>Field message</span><strong>Send 3 seeds to Bea</strong><small>{signed ? "Wax seal verified" : "Waiting for your seal"}</small></div></div>
          <Button onClick={() => { setSigned(true); chirp(); }} disabled={signed}><span>◉</span>{signed ? "Signed & verified" : "Press your wax seal"}</Button>
        </div>
        <figure className="specimen-image"><img src={specimens} loading="lazy" width={1024} height={1024} alt="Field guide specimens including a fern, key, chain block, wax seal, and snail"/><figcaption>Plate III · tools of the trade</figcaption></figure>
      </section>

      <section id="mine" className="chapter chapter-gold">
        <SectionTitle number="04" kicker="The waiting basket" title="From mempool to meadow">New transactions wait together until a miner gathers them into the next block.</SectionTitle>
        <div className="mining-layout"><div className="mempool"><h3>Waiting basket <span>{mempool.length}</span></h3>{mempool.length ? mempool.map((item) => <div className="transaction" key={item}><span>↳</span>{item}</div>) : <p className="empty-note">All gathered. The basket is light.</p>}</div><div className="mining-action"><Pickaxe size={48}/><p>Proof of work is a guessing game: miners try nonces until a hash fits the rule.</p><Button onClick={() => { setMempool([]); chirp(); }} disabled={!mempool.length}><Pickaxe size={17}/> Mine next block</Button></div></div>
      </section>

      <section className="chapter consensus">
        <SectionTitle number="05" kicker="A woodland vote" title="Let the network agree">No single keeper decides the record. Independent nodes compare notes and follow the valid majority.</SectionTitle>
        <div className="node-row">{nodes.map((agrees, index) => <button key={index} type="button" className={`node ${agrees ? "agrees" : "wanders"}`} onClick={() => setNodes((current) => current.map((v, i) => i === index ? !v : v))}><span>{["OAK", "POND", "HILL"][index]}</span><strong>{agrees ? "VALID" : "FORKED"}</strong><small>tap to change vote</small></button>)}</div>
        <div className="verdict"><ShieldCheck size={24}/><span>Consensus</span><strong>{nodes.filter(Boolean).length}/3 nodes accept this chain</strong></div>
      </section>

      <section className={`breathing ${breathing ? "is-breathing" : ""}`}><div className="breath-orbit"><Leaf size={38}/></div><div><p className="kicker">A calm byte</p><h2>{breathing ? "Breathe out…" : "Rest your eyes."}</h2><p>Even distributed systems pause between blocks.</p></div><Button variant="outline" onClick={() => { setBreathing(true); setTimeout(() => setBreathing(false), 5000); }}><RefreshCcw size={17}/> Take five seconds</Button></section>

      <footer><div className="brand"><span>✿</span> The Gentle Chain</div><p>Built for curious minds, not crypto bros.</p><a href="#top">Back to the first page ↑</a></footer>
    </main>
  );
}