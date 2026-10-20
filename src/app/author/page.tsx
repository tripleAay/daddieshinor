import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUpRight, Github, Linkedin } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import styles from "./author.module.css";

const description = "Meet Shina Hustlé, software engineer, brand designer, and the voice behind Daddieshinor. Working across digital products, brand identity, and independent publishing.";

export const metadata: Metadata = {
  title: "Shina Hustlé — Engineer, Designer & Writer | Daddieshinor",
  description,
  alternates: { canonical: "https://daddieshinor.com/author" },
  openGraph: {
    title: "Shina Hustlé — The person behind the perspective",
    description,
    url: "https://daddieshinor.com/author",
    siteName: "Daddieshinor",
    type: "profile",
    images: [{ url: "/shine.jpeg", width: 912, height: 1120, alt: "Portrait of Shina Hustlé" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shina Hustlé — Engineer, Designer & Writer",
    description,
    images: ["/shine.jpeg"],
  },
};

const projects = [
  {
    number: "01",
    discipline: "Products & brand design",
    name: "Fynaro Tech",
    text: "Where ideas become working products. Web experiences, digital tools, and brand identities built with attention to how a business actually works.",
    href: "https://fynarotech.com",
    action: "Explore Fynaro",
    external: true,
  },
  {
    number: "02",
    discipline: "Independent publishing",
    name: "Daddieshinor",
    text: "My space for examining technology, culture, brands, and everyday life. Writing that starts with curiosity and gives an observation room to become an argument.",
    href: "/",
    action: "Read the journal",
    external: false,
  },
  {
    number: "03",
    discipline: "Commerce & physical production",
    name: "NewJersey.ng",
    text: "Bringing design into the physical world through print, branded apparel, and merchandise. A business I’m building across the storefront and the production process.",
    href: "/contact",
    action: "Talk print & branding",
    external: false,
  },
];

const capabilities = [
  { number: "01", title: "Software engineering", text: "Web applications, commerce experiences, and the systems behind them. I work across the interface and the backend, using React, Next.js, TypeScript, and Node.js." },
  { number: "02", title: "Brand identity", text: "Positioning, visual identity, and the decisions that make a business recognisable. I connect how a brand looks with what it offers and who it needs to reach." },
  { number: "03", title: "Editorial thinking", text: "Essays, observations, and analysis shaped by the work itself. I’m interested in what technology changes, how culture moves, and why people choose what they choose." },
];

export default function AuthorPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}><Header /></div>
      <main className={styles.main}>
        <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
          <Link href="/"><ArrowLeft size={14} aria-hidden="true" /> The journal</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Behind the words</span>
        </nav>

        <section className={styles.hero} aria-labelledby="author-title">
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>The person behind the perspective</p>
            <h1 id="author-title" className={styles.name}>
              <span>SHINA</span>
              <span>HUSTLÉ<span className={styles.dot}>.</span></span>
            </h1>
            <p className={styles.roles}>Software engineer. Brand designer. Writer.</p>
            <p className={styles.lead}>I turn early ideas into products people can use and brands they can recognise.</p>
            <div className={styles.heroActions}>
              <Link href="/contact" className={styles.primary}>Let’s build something <ArrowUpRight size={17} aria-hidden="true" /></Link>
              <a href="#selected-work" className={styles.textLink}>Explore my work <ArrowDown size={15} aria-hidden="true" /></a>
            </div>
          </div>
          <figure className={styles.portrait}>
            <div className={styles.imageFrame}>
              <Image src="/shine.jpeg" alt="Shina Hustlé in a dark suit" fill priority sizes="(max-width: 767px) 90vw, (max-width: 1200px) 40vw, 440px" className={styles.image} />
              <span className={styles.imageLabel} aria-hidden="true">The author / The builder</span>
            </div>
            <figcaption><span>Adedokun Adeshina</span><span>Known as Shina Hustlé</span></figcaption>
          </figure>
        </section>

        <section className={styles.introduction} aria-labelledby="intro-title">
          <p className={styles.eyebrow}>A little context</p>
          <div>
            <h2 id="intro-title" className={styles.statement}>My perspective comes<br className={styles.desktopBreak} /> from making things.</h2>
            <div className={styles.prose}>
              <p>I’m Adedokun Adeshina, known as Shina Hustlé. I work across software, design, and publishing because the questions I care about rarely stay inside one discipline.</p>
              <p>A product has to work. A brand has to make sense to someone. A piece of writing has to earn the time it asks for. Moving between those demands has shaped how I approach the work.</p>
              <p>Daddieshinor is where I think in public. Some essays begin with something I’m building. Others begin with a conversation, a cultural shift, or a question I haven’t been able to leave alone.</p>
            </div>
          </div>
        </section>

        <section id="selected-work" className={styles.work} aria-labelledby="work-title">
          <div className={styles.sectionHeading}>
            <div><p className={styles.eyebrow}>Where the thinking becomes work</p><h2 id="work-title">WHAT I’M<br />BUILDING.</h2></div>
            <p>Different kinds of work.<br />A consistent attention to detail.</p>
          </div>
          <div className={styles.projects}>
            {projects.map((project) => (
              <a key={project.name} href={project.href} target={project.external ? "_blank" : undefined} rel={project.external ? "noopener noreferrer" : undefined} className={styles.project}>
                <div className={styles.projectMeta}><span>{project.number} / {project.discipline}</span><ArrowUpRight size={21} aria-hidden="true" /></div>
                <h3>{project.name}</h3>
                <p>{project.text}</p>
                <span className={styles.projectAction}>{project.action}<span className="sr-only">{project.external ? " (opens in a new tab)" : ""}</span></span>
              </a>
            ))}
          </div>
        </section>

        <section className={styles.capabilities} aria-labelledby="capabilities-title">
          <div className={styles.capabilityIntro}><p className={styles.eyebrow}>What I bring to the table</p><h2 id="capabilities-title">The idea matters.<br />So does the execution.</h2><p>I can help define what needs to be built, shape how it presents itself, and work through the details that make it usable.</p></div>
          <div className={styles.capabilityList}>
            {capabilities.map((item) => (
              <div key={item.number} className={styles.capability}><span>{item.number}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></div>
            ))}
          </div>
        </section>

        <section className={styles.note} aria-labelledby="note-title">
          <p className={styles.eyebrow}>Why I write</p>
          <h2 id="note-title">“I write to work out what I think.<br />Then I put it here for you to question.”</h2>
          <p>That is the spirit of Daddieshinor. Look closely, follow the thought, and leave room to change your mind.</p>
          <Link href="/" className={styles.textLink}>Read Daddieshinor <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </section>

        <section className={styles.contact} aria-labelledby="contact-title">
          <p className={styles.eyebrow}>For founders, teams & collaborators</p>
          <div className={styles.contactRow}><h2 id="contact-title">HAVE SOMETHING<br />WORTH BUILDING?</h2><Link href="/contact" className={styles.contactArrow} aria-label="Contact Shina Hustlé about a project"><ArrowUpRight aria-hidden="true" /></Link></div>
          <div className={styles.contactBottom}><p>Tell me what you’re working on, where it stands,<br className={styles.desktopBreak} /> and what you need help getting right.</p><div className={styles.socials}><a href="https://github.com/tripleAay" target="_blank" rel="noopener noreferrer"><Github size={16} aria-hidden="true" /> GitHub<span className="sr-only"> (opens in a new tab)</span></a><a href="https://www.linkedin.com/in/adeshina-adedokun-a87214415/" target="_blank" rel="noopener noreferrer"><Linkedin size={16} aria-hidden="true" /> LinkedIn<span className="sr-only"> (opens in a new tab)</span></a></div></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
