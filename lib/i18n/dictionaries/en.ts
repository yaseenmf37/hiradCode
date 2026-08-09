/** English dictionary — mirrors the shape of fa.ts. */

import type { Dictionary } from "./fa";

export const en: Dictionary = {
  meta: {
    defaultTitle: "Hirad Code | Web Design & Development",
    titleTemplate: "%s | Hirad Code",
    description:
      "A web design and development studio. We build websites that are fast, beautiful and dependable — from visual identity to the last line of code.",
    ogTitle: "Hirad Code | Web Design & Development",
    ogDescription:
      "A web design and development studio. Websites that are fast, beautiful and dependable.",
    keywords: [
      "web design",
      "website design",
      "web development",
      "UI UX design",
      "Next.js studio",
      "Hirad Code",
    ],
    pages: {
      works: {
        title: "Work",
        description:
          "A selection of the websites, stores and platforms we've designed and built.",
      },
      services: {
        title: "Services",
        description:
          "UI/UX design, web development, brand identity, performance, technical SEO and support.",
      },
      about: {
        title: "About",
        description:
          "We're a small, focused studio. We take on a limited number of projects so we can deliver each one properly.",
      },
      contact: {
        title: "Contact",
        description:
          "Have a project in mind? Send a message — the first call is free, with no strings attached.",
      },
      faq: {
        title: "FAQ",
        description:
          "Answers to the most common questions about timelines, pricing, support and how Hirad Code works — web design and development.",
      },
      blog: {
        title: "Blog",
        description:
          "Hirad Code writing on web design, development, SEO and site speed — real lessons from our projects.",
      },
    },
  },

  site: {
    tagline: "Web design & development studio",
    address:
      "Giti Building, opposite Janbo store, between Villa 12 & 14, Villa-Shahr, Gorgan, Golestan, Iran",
    hours: "7 days a week, 9 AM to 10 PM",
  },

  nav: {
    home: "Home",
    works: "Work",
    services: "Services",
    about: "About",
    faq: "FAQ",
    blog: "Blog",
    contact: "Contact",
    cta: "Start a project",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    homeAria: "Hirad Code — Home",
    switchLabel: "فارسی",
  },

  hero: {
    eyebrow: "Ready for New Projects",
    titleTop: "Web design and development,",
    titleBottom: "done the way it should be.",
    description:
      "From the idea and visual identity to the last line of code, one team builds it all — a site that's fast, polished and ready to be found on Google.",
    ctaWorks: "View our work",
    ctaContact: "Start a project",
  },

  heroVisual: {
    lighthouse: "Lighthouse score",
    lighthouseValue: "99",
    delivery: "Delivery",
    deliveryValue: "4 weeks",
  },

  featured: {
    eyebrow: "Work",
    titleTop: "A selection of",
    titleBottom: "our work.",
    all: "All projects",
    empty: "No projects yet. Add your first from the admin panel.",
  },

  homeServices: {
    eyebrow: "Services",
    lead: "Everything you need for a",
    highlight: "serious online",
    tail: " presence.",
    description: "One team, start to finish. No being passed between people.",
    readMore: "Read more →",
  },

  process: {
    eyebrow: "Process",
    titleTop: "From idea to launch,",
    titleBottom: "step by step.",
    description:
      "From day one you know where we are, what you'll get, and when.",
  },

  testimonials: {
    eyebrow: "Client stories",
    titleTop: "Never mind our word,",
    titleBottom: "hear theirs.",
  },

  works: {
    eyebrow: "Work",
    titleTop: "Our work,",
    titleBottom: "up close.",
    description:
      "A collection of sites, stores and platforms we've designed and coded. Click any to see the details and the outcome.",
  },

  gallery: {
    all: "All",
    viewProject: "View project",
    featured: "Featured",
    emptyTitle: "No projects yet",
    emptyBody: "Add your first project from the admin panel.",
    emptyCategory: "No projects in this category.",
  },

  servicesPage: {
    eyebrow: "Services",
    lead: "One team for ",
    highlight: "the whole journey.",
    description:
      "No need to find one person for design, another for code and a third for SEO. It's all here, and it all fits together.",
    processEyebrow: "Process",
    processLead: "How the work ",
    processHighlight: "moves forward.",
  },

  about: {
    eyebrow: "About",
    titleTop: "A small studio",
    titleBottom: "with a big obsession.",
    description:
      "We're not an agency. We're a small, focused team that would rather deliver five projects brilliantly than fifty at average.",
    story: [
      "HiradCode started with a simple question: why should a website have to choose between beauty, speed, and performance? We decided to remove that choice.",
      "We built a team that sees design and development as one process — designers who understand how their decisions are brought to life in code, and developers who care about the smallest details of the user experience. The result is websites that look great, perform fast, and are built to work.",
      "From corporate and e-commerce websites to landing pages and custom systems, every project has been a new problem to solve. We start by understanding the challenge, then build a solution designed to create real results for your business.",
    ],
    valuesEyebrow: "Our principles",
    valuesLead: "Four things we ",
    valuesHighlight: "won't compromise on.",
    values: [
      {
        title: "Good value, not a race to the bottom",
        body: "We're not the cheapest option and we don't aim to be; but for the quality you get, our price is fair. You spend your money where you can see the result.",
      },
      {
        title: "If an idea is bad, we'll say so",
        body: "Our job isn't just to execute. If something you've asked for would hurt your users or your business, we'll tell you why and suggest an alternative. The final call is yours.",
      },
      {
        title: "Speed is a feature, not a luxury",
        body: "A site that takes three seconds to load has already lost half its visitors. We factor in performance from day one, not as something we bolt on at the end.",
      },
      {
        title: "Transparent from day one",
        body: "Clear price, clear timeline, no hidden costs. You know exactly what you're getting and when — not a rial more, not a day later.",
      },
    ],
    teamEyebrow: "Team",
    teamLead: "The people who ",
    teamHighlight: "do the work.",
    team: [
      { name: "Hirad", role: "Founder & lead developer", initial: "H" },
      { name: "Mina", role: "UI/UX designer", initial: "M" },
      { name: "Sina", role: "Front-end developer", initial: "S" },
      { name: "Raha", role: "Project manager", initial: "R" },
    ],
  },

  contact: {
    eyebrow: "Contact",
    titleTop: "Let's talk about",
    titleBottom: "your project.",
    description:
      "Fill in the form or email us directly. The first call is free and there's no obligation afterwards — even if you decide not to work with us.",
    emailLabel: "Email",
    emailHint: "The best way to start",
    phoneLabel: "Phone",
    locationLabel: "Location",
    locationHint: "In-person meetings by appointment",
    socialsHeading: "Social",
    faqPrompt: "Have a question first? ",
    faqLink: "See the FAQ",
  },

  contactForm: {
    name: "Full name",
    namePh: "e.g. Sara Moradi",
    email: "Email",
    emailPh: "you@example.com",
    phone: "Phone number",
    phoneHint: "Optional",
    phonePh: "+98 912 345 6789",
    subject: "Subject",
    subjectOther: "Write your own subject",
    subjectOtherHint: "Optional — if left blank, \"Other\" is saved",
    subjectOtherPh: "e.g. technical consulting or an internal panel redesign",
    budget: "Approximate budget",
    budgetNone: "I'd rather not say",
    body: "Tell us about the project",
    bodyPh: "What do you want to build? What problem should it solve? Any detail you think helps.",
    submit: "Send message",
    submitting: "Sending…",
    replyNote: "We usually reply in under 24 hours.",
    successTitle: "Message sent",
    subjects: [
      "A new website",
      "Redesign an existing site",
      "Online store",
      "Brand identity & branding",
      "Other",
    ],
    budgets: [
      "Under 20M Toman",
      "20 to 50M Toman",
      "50 to 100M Toman",
      "Above 100M Toman",
      "Not sure yet",
    ],
    errors: {
      name: "Please enter your name.",
      email: "Please enter a valid email.",
      body: "Please add a little more detail (at least 10 characters).",
      fix: "Please fix the errors below.",
      sendFail: "Couldn't send the message. Please try again or email us directly.",
    },
    successMessage: "Your message reached us. We'll reply in under 24 hours.",
    noSubject: "No subject",
  },

  faqComponent: {
    eyebrow: "Frequently asked",
    lead: "The things people ",
    highlight: "usually ask.",
  },

  faqPage: {
    eyebrow: "FAQ",
    lead: "The things people ",
    highlight: "usually ask.",
    description: "If your question isn't answered here, send us a message — we reply fast.",
  },

  blog: {
    eyebrow: "Blog",
    titleTop: "Articles and",
    titleBottom: "notes.",
    description:
      "We write about web design, development, SEO and site speed — everything we learn on real projects.",
    empty: "No articles published yet. Check back soon.",
    readMore: "Read more →",
    all: "All articles",
    back: "Back to blog",
    relatedLead: "More ",
    relatedHighlight: "articles",
    author: "Hirad Code",
  },

  cta: {
    titleTop: "Have a project in mind?",
    titleBottom: "Let's build it.",
    description:
      "Send us your idea. In under 24 hours we'll come back with a clear plan — where to start and how to move it forward.",
    start: "Start the conversation",
    works: "See our work",
  },

  footer: {
    blurb:
      "Web design and development studio. From idea to launch, we build websites that work and get seen.",
    pagesTitle: "Pages",
    servicesTitle: "Services",
    contactTitle: "Contact",
    rights: "All rights reserved.",
    madeWith: "Built with Next.js and a bit of obsession.",
    servicesLinks: [
      "UI/UX design",
      "Web development",
      "Brand identity",
      "Performance",
    ],
  },

  projectPage: {
    back: "Back to work",
    about: "About this project",
    servicesProvided: "Services provided",
    tech: "Tech",
    result: "Outcome",
    live: "Visit live site",
    nextLead: "Next ",
    nextHighlight: "projects",
    imageWord: "image",
    notFoundTitle: "Project not found",
    metaClient: "Client",
    metaYear: "Year",
    metaDuration: "Duration",
    metaRole: "Our role",
  },

  notFound: {
    title: "This page wasn't found.",
    body: "You may have mistyped the address, or the page you were looking for has moved.",
    home: "Back to home",
    works: "See our work",
  },

  content: {
    services: [
      {
        title: "UI & UX design",
        summary: "An interface a user knows how to use without thinking.",
        description:
          "Before a single pixel, we figure out what your user is after and where they get stuck. Then we build an interface that shortens the path — not one that's just pretty.",
        bullets: [
          "User research & information architecture",
          "Wireframes & interactive prototypes",
          "Final design in Figma",
          "Design system & component library",
        ],
      },
      {
        title: "Web development",
        summary: "Code that loads fast and is still maintainable next year.",
        description:
          "We build with Next.js and TypeScript. That means your site is fast for users, readable for Google, and when you want to add something six months later, nothing falls apart.",
        bullets: [
          "Next.js & React with TypeScript",
          "Server-side rendering for SEO",
          "API & database integration",
          "Custom admin panel",
        ],
      },
      {
        title: "Brand identity",
        summary: "A brand that's recognised at a glance.",
        description:
          "A logo is only a small part of the story. We arrange colour, typography, tone and visual rhythm so everything stays consistent and recognisable everywhere.",
        bullets: [
          "Logo & mark design",
          "Colour palette & typography",
          "Brand guidelines",
          "Social media templates",
        ],
      },
      {
        title: "Performance",
        summary: "Every second of delay is a user who left.",
        description:
          "A slow site is a dead site. We take apart images, fonts, JavaScript and the render path so the page loads in under a second — on mobile and an average connection, not just on our own laptop.",
        bullets: [
          "Core Web Vitals audit",
          "Image & font optimisation",
          "JavaScript size reduction",
          "Caching & CDN",
        ],
      },
      {
        title: "Technical SEO",
        summary: "Getting found on Google, right from the foundation.",
        description:
          "We bake SEO into the site's structure from day one: structured data, metadata, sitemap and speed. Not as something we stick on at the end.",
        bullets: [
          "Structured data & schema",
          "Metadata & Open Graph",
          "Sitemap & robots",
          "Ranking reports & monitoring",
        ],
      },
      {
        title: "Support & maintenance",
        summary: "We're still here after launch.",
        description:
          "Handover isn't the end of the job. Updates, backups, bug fixes and new features — whenever you need them, come to us.",
        bullets: [
          "Updates & security patches",
          "Automatic backups",
          "Priority bug fixes",
          "New feature additions",
        ],
      },
    ],
    process: [
      {
        title: "Discovery & analysis",
        description:
          "We sit down and listen. Your business, audience, competitors and what you actually want from the site. The output of this stage is a clear document, not a guess.",
        duration: "3 to 5 days",
      },
      {
        title: "Design",
        description:
          "From wireframe to final design. You see every page and give feedback — before a single line of code is written.",
        duration: "1 to 2 weeks",
      },
      {
        title: "Development",
        description:
          "The design turns into code. You get a viewable build every week, so you're never in the dark.",
        duration: "2 to 4 weeks",
      },
      {
        title: "Launch & growth",
        description:
          "It goes live, gets tested, you get trained. Then we read the data and keep making the site better.",
        duration: "Ongoing",
      },
    ],
    testimonials: [
      {
        quote:
          "Our old site wasn't bad, but nobody bought from it. The Hirad team reworked the entire buying journey. Two months later our sales had almost doubled.",
        name: "Sara Moradi",
        role: "Marketing lead, Astra",
        initial: "S",
      },
      {
        quote:
          "What really made the difference was that they asked questions. Plenty of people just say yes. These said this part doesn't work — and explained why.",
        name: "Amir Rostami",
        role: "Founder, Vertex",
        initial: "A",
      },
      {
        quote:
          "The admin panel they built is so simple that our content team uses it with no training at all. We're no longer dependent on anyone for every small change.",
        name: "Negar Ahmadi",
        role: "Product manager, Luma",
        initial: "N",
      },
    ],
    faq: [
      {
        question: "How long does a project usually take?",
        answer:
          "A landing page takes about one to two weeks, a corporate site three to four weeks, and a store or platform five to eight weeks. After the first call we give you a precise timeline.",
      },
      {
        question: "How is the cost calculated?",
        answer:
          "Two ways: a fixed contract price for the whole project, or hourly for smaller work and one-off changes. After the discovery call we suggest whichever fits your needs and you get a transparent price — no hidden costs.",
      },
      {
        question: "Can I change the site content myself?",
        answer:
          "Yes. Every project ships with an admin panel you can use to manage content, images and portfolio items with no technical knowledge. Training is part of the handover.",
      },
      {
        question: "Do you provide support after launch?",
        answer:
          "Thirty days of free support on every project. After that, if you want, we offer a monthly maintenance contract covering updates, backups and bug fixes.",
      },
    ],
  },
};
