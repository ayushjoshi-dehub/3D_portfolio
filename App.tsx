import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, MotionValue } from 'framer-motion';

// ==========================================
// TYPES & INLINE COMPONENT DEFINITIONS
// ==========================================

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  className?: string;
}

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

// ==========================================
// REUSABLE HOOKS & UTILITIES
// ==========================================

const easeOutQuint = [0.25, 0.1, 0.25, 1];

// ==========================================
// CORE REUSABLE COMPONENTS
// ==========================================

export const ContactButton: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="rounded-full font-medium uppercase tracking-widest text-white transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]
                 px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base"
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
        outline: '2px solid white',
        outlineOffset: '-3px'
      }}
    >
      Contact Me
    </button>
  );
};

export const LiveProjectButton: React.FC<{ url?: string }> = ({ url }) => {
  return (
    <a
      href={url || '#'}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-full border-2 border-[#D7E2EA] font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10
                 px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base block text-center"
    >
      Live Project
    </a>
  );
};

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  as = 'div',
  className = ''
}) => {
  const Component = motion.create(as as any);
  return (
    <Component
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: easeOutQuint }}
    >
      {children}
    </Component>
  );
};

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 150,
  strength = 3,
  activeTransition = "transform 0.3s ease-out",
  inactiveTransition = "transform 0.6s ease-in-out",
  className = ""
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("translate3d(0px, 0px, 0px)");
  const [transition, setTransition] = useState(inactiveTransition);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const elementCenterX = rect.left + rect.width / 2;
      const elementCenterY = rect.top + rect.height / 2;

      const distanceX = e.clientX - elementCenterX;
      const distanceY = e.clientY - elementCenterY;
      const distance = Math.hypot(distanceX, distanceY);

      const maxDistance = Math.max(rect.width, rect.height) / 2 + padding;

      if (distance < maxDistance) {
        setTransition(activeTransition);
        const transX = distanceX / strength;
        const transY = distanceY / strength;
        setTransform(`translate3d(${transX}px, ${transY}px, 0px)`);
      } else {
        setTransition(inactiveTransition);
        setTransform("translate3d(0px, 0px, 0px)");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [padding, strength, activeTransition, inactiveTransition]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ transform, transition, willChange: 'transform' }}
    >
      {children}
    </div>
  );
};

export const AnimatedText: React.FC<AnimatedTextProps> = ({ text, className = "", style }) => {
  const targetRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const characters = text.split("");

  return (
    <p ref={targetRef} style={style} className={`${className} flex flex-wrap justify-center`}>
      {characters.map((char, index) => {
        const start = index / characters.length;
        const end = start + 1 / characters.length;
        return (
          <Character key={index} progress={scrollYProgress} range={[start, end]}>
            {char}
          </Character>
        );
      })}
    </p>
  );
};

interface CharacterProps {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}

const Character: React.FC<CharacterProps> = ({ children, progress, range }) => {
  const opacity = useTransform(progress, range, [0.2, 1]);
  return (
    <span className="relative inline-block">
      <span className="opacity-0">{children === " " ? "\u00A0" : children}</span>
      <motion.span style={{ opacity }} className="absolute top-0 left-0">
        {children === " " ? "\u00A0" : children}
      </motion.span>
    </span>
  );
};

// ==========================================
// SECTION 1: HERO SECTION
// ==========================================

const HeroSection: React.FC = () => {
  return (
    <section className="relative flex h-screen w-full flex-col justify-between overflow-x-clip bg-[#0C0C0C] px-6 md:px-10 pb-7 sm:pb-8 md:pb-10">
      {/* Navbar */}
      <FadeIn delay={0} y={-20} className="w-full">
        <nav className="flex w-full justify-between pt-6 md:pt-8">
          {["About", "Price", "Projects", "Contact"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]"
            >
              {link}
            </a>
          ))}
        </nav>
      </FadeIn>

      {/* Hero Portrait (Absolute Centered) */}
      <FadeIn delay={0.6} y={30} className="absolute left-1/2 z-10 -translate-x-1/2 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0">
        <Magnet
          padding={150}
          strength={3}
          activeTransition="transform 0.3s ease-out"
          inactiveTransition="transform 0.6s ease-in-out"
        >
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
            alt="Jack Portrait"
            className="h-auto w-full object-contain pointer-events-none selection:bg-transparent"
          />
        </Magnet>
      </FadeIn>

      {/* Hero Heading Container */}
      <div className="overflow-hidden mt-6 sm:mt-4 md:-mt-5">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading w-full whitespace-nowrap text-left text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] font-black uppercase leading-none tracking-tight">
            Hi, i&apos;m jack
          </h1>
        </FadeIn>
      </div>

      {/* Bottom Row info */}
      <div className="flex w-full items-end justify-between z-20">
        <FadeIn delay={0.35} y={20}>
          <p
            className="text-left font-light uppercase tracking-wide leading-snug text-[#D7E2EA] max-w-[160px] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: "clamp(0.75rem, 1.4vw, 1.5rem)" }}
          >
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>
    </section>
  );
};

// ==========================================
// SECTION 2: MARQUEE SECTION
// ==========================================

const marqueeImages = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif"
];

const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollOffset, setScrollOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      setScrollOffset(offset - 200);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const row1 = [...marqueeImages.slice(0, 11), ...marqueeImages.slice(0, 11), ...marqueeImages.slice(0, 11)];
  const row2 = [...marqueeImages.slice(11), ...marqueeImages.slice(11), ...marqueeImages.slice(11)];

  return (
    <section ref={sectionRef} className="w-full bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden">
      {/* Row 1 -> Moves Right */}
      <div 
        className="flex gap-3 mb-3 whitespace-nowrap transition-transform duration-75"
        style={{ transform: `translateX(${scrollOffset}px)`, willChange: 'transform' }}
      >
        {row1.map((src, i) => (
          <img
            key={`r1-${i}`}
            src={src}
            alt="Showcase Gif 1"
            loading="lazy"
            className="w-[420px] h-[270px] rounded-2xl object-cover flex-shrink-0"
          />
        ))}
      </div>

      {/* Row 2 -> Moves Left */}
      <div 
        className="flex gap-3 whitespace-nowrap transition-transform duration-75"
        style={{ transform: `translateX(${-scrollOffset}px)`, willChange: 'transform' }}
      >
        {row2.map((src, i) => (
          <img
            key={`r2-${i}`}
            src={src}
            alt="Showcase Gif 2"
            loading="lazy"
            className="w-[420px] h-[270px] rounded-2xl object-cover flex-shrink-0"
          />
        ))}
      </div>
    </section>
  );
};

// ==========================================
// SECTION 3: ABOUT SECTION
// ==========================================

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="relative min-h-screen w-full bg-[#0C0C0C] px-5 sm:px-8 md:px-10 py-20 flex flex-col justify-center items-center overflow-hidden">
      {/* Decorative Assets */}
      <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute z-0 top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" alt="Moon 3D" className="w-full h-auto" />
      </FadeIn>

      <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute z-0 bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" alt="Abstract Geometric 3D" className="w-full h-auto" />
      </FadeIn>

      <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute z-0 top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" alt="Lego 3D" className="w-full h-auto" />
      </FadeIn>

      <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute z-0 bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px]">
        <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" alt="Composition Cluster 3D" className="w-full h-auto" />
      </FadeIn>

      {/* Content Layout Stack */}
      <div className="flex flex-col items-center text-center z-10 w-full max-w-4xl gap-10 sm:gap-14 md:gap-16">
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
            About me
          </h2>
        </FadeIn>

        <div className="flex flex-col items-center gap-16 sm:gap-20 md:gap-24 w-full">
          <AnimatedText 
            text="With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!"
            className="text-[#D7E2EA] font-medium leading-relaxed max-w-[560px]"
            style={{ fontSize: "clamp(1rem, 2vw, 1.35rem)" } as React.CSSProperties}
          />

          <FadeIn delay={0.1} y={20}>
            <ContactButton />
          </FadeIn>
        </div>
      </div>
    </section>
  );
};

// ==========================================
// SECTION 4: SERVICES SECTION
// ==========================================

const servicesData = [
  { num: "01", name: "3D Modeling", desc: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations." },
  { num: "02", name: "Rendering", desc: "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life." },
  { num: "03", name: "Motion Design", desc: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences." },
  { num: "04", name: "Branding", desc: "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence." },
  { num: "05", name: "Web Design", desc: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience." }
];

const ServicesSection: React.FC = () => {
  return (
    <section className="w-full bg-[#FFFFFF] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-20">
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-[#0C0C0C] font-black uppercase text-center mb-16 sm:mb-20 md:mb-28 leading-none tracking-tight" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
          Services
        </h2>

        <div className="flex flex-col border-t border-[rgba(12,12,12,0.15)]">
          {servicesData.map((item, i) => (
            <FadeIn 
              key={item.num} 
              delay={i * 0.1} 
              y={30} 
              className="flex items-center gap-6 sm:gap-10 md:gap-14 py-8 sm:py-10 md:py-12 border-b border-[rgba(12,12,12,0.15)] w-full"
            >
              {/* Left Column Number */}
              <div 
                className="font-black text-[#0C0C0C] leading-none select-none min-w-[70px] sm:min-w-[120px] md:min-w-[160px]" 
                style={{ fontSize: "clamp(3rem, 10vw, 140px)" }}
              >
                {item.num}
              </div>

              {/* Right Column Stack */}
              <div className="flex flex-col gap-2">
                <h3 
                  className="font-medium uppercase text-[#0C0C0C]" 
                  style={{ fontSize: "clamp(1rem, 2.2vw, 2.1rem)" }}
                >
                  {item.name}
                </h3>
                <p 
                  className="font-light leading-relaxed text-[#0C0C0C] opacity-60 max-w-2xl" 
                  style={{ fontSize: "clamp(0.85rem, 1.6vw, 1.25rem)" }}
                >
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// SECTION 5: PROJECTS SECTION
// ==========================================

const projectsData = [
  {
    num: "01",
    category: "Client",
    name: "Nextlevel Studio",
    img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85",
    img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85",
    img3: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85"
  },
  {
    num: "02",
    category: "Personal",
    name: "Aura Brand Identity",
    img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85",
    img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85",
    img3: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85"
  },
  {
    num: "03",
    category: "Client",
    name: "Solaris Digital",
    img1: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85",
    img2: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85",
    img3: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85"
  }
];

interface ProjectCardProps {
  project: typeof projectsData[0];
  index: number;
  total: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, total }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div ref={containerRef} className="h-[85vh] w-full flex items-start justify-center sticky" style={{ top: `${96 + index * 28}px` }}>
      <motion.div
        style={{ scale }}
        className="w-full h-full border-2 border-[#D7E2EA] bg-[#0C0C0C] flex flex-col justify-between overflow-hidden p-4 sm:p-6 md:p-8
                   rounded-[40px] sm:rounded-[50px] md:rounded-[60px]"
      >
        {/* Top Meta Details Row */}
        <div className="flex flex-wrap items-center justify-between w-full gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="hero-heading font-black leading-none" style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}>
              {project.num}
            </span>
            <div className="flex flex-col">
              <span className="text-xs tracking-widest text-[#D7E2EA] opacity-50 uppercase font-light">
                {project.category}
              </span>
              <h3 className="text-[#D7E2EA] font-semibold text-base sm:text-xl md:text-2xl uppercase tracking-wide">
                {project.name}
              </h3>
            </div>
          </div>

          <LiveProjectButton />
        </div>

        {/* Bottom Two-Column Balanced Image Grid Layout */}
        <div className="w-full h-[72%] grid grid-cols-10 gap-3 sm:gap-4 items-stretch mt-4">
          {/* Left Column (40% Weight) - Two Stacked Images */}
          <div className="col-span-4 flex flex-col gap-3 sm:gap-4 h-full justify-between">
            <img
              src={project.img1}
              alt={`${project.name} View A`}
              className="w-full object-cover rounded-[24px] sm:rounded-[36px] md:rounded-[48px]"
              style={{ height: "clamp(130px, 16vw, 230px)" }}
            />
            <img
              src={project.img2}
              alt={`${project.name} View B`}
              className="w-full object-cover flex-grow rounded-[24px] sm:rounded-[36px] md:rounded-[48px]"
              style={{ height: "clamp(160px, 22vw, 340px)" }}
            />
          </div>

          {/* Right Column (60% Weight) - Tall Hero Asset Image */}
          <div className="col-span-6 h-full">
            <img
              src={project.img3}
              alt={`${project.name} Hero View`}
              className="w-full h-full object-cover rounded-[24px] sm:rounded-[36px] md:rounded-[48px]"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ProjectsSection: React.FC = () => {
  return (
    <section 
      id="projects" 
      className="w-full bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] relative z-30 pb-32 px-5 sm:px-8 md:px-10
                 -mt-10 sm:-mt-12 md:-mt-14"
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col">
        {/* Section Heading heading design matching requirements */}
        <div className="w-full text-center py-20 sm:py-24 md:py-28">
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight inline-block" style={{ fontSize: "clamp(3rem, 12vw, 160px)" }}>
            Project
          </h2>
        </div>

        {/* Stack Canvas Layout Container */}
        <div className="flex flex-col gap-24 relative w-full">
          {projectsData.map((project, idx) => (
            <ProjectCard 
              key={project.num}
              project={project} 
              index={idx} 
              total={projectsData.length} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

// ==========================================
// ROOT APP MODULE ENTRY
// ==========================================

export default function App() {
  return (
    <div className="w-full bg-[#0C0C0C] overflow-x-clip select-none antialiased">
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
    </div>
  );
}