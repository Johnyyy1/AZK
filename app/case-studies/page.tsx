"use client";

import TopNav from "../components/TopNav";
import Footer from "../components/Footer";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const caseStudies = [
  {
    tag: "Agriculture",
    title: "Sacramento Valley Vineyards",
    metric: "58%",
    metricLabel: "Water Reduction",
    desc: "A 1,200-acre vineyard operation reduced water consumption by 58% in the first season while improving grape quality scores by 12 points.",
    quote: "AquaSmart didn't just save water—it fundamentally changed how we think about our vines' relationship with moisture.",
    author: "Marco Chen, Head Viticulturist",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBWpGx_sUUY7SFHxuQvbASNozFBHGZUlRmEQTBr25sHPVFtYEe4i8fQMBRZSt7QMNh3w7HqpbPKcqdxP1sYax1dTJ0-P0V9JdboRxAkiClW4Os-8iMZHUlpNCmPZZfqxYEucC0w_B15vOu3FMLFnwaH8njBG1JiFlpRE5mhhqEmShZNs4BBntIi6N2BaIbfA9HRvILe-sAo5WdS3Jc_Zpe8oCiVO1vaQhSJ1ffDu0n4izwDf5x0y_m-us5LglMw7ro9Nj-OgqnFcLY",
    stats: [
      { label: "ROI Period", value: "4 months" },
      { label: "Sensor Nodes", value: "340" },
      { label: "Zones", value: "28" },
    ],
  },
  {
    tag: "Municipal",
    title: "City of Portland Public Parks",
    metric: "42%",
    metricLabel: "Cost Savings",
    desc: "Portland Parks & Recreation deployed AquaSmart across 86 municipal parks, cutting annual water budgets by $2.1M while maintaining premium turf quality.",
    quote: "The predictive rain-skip feature alone saved us hundreds of unnecessary watering cycles during Oregon's unpredictable shoulder seasons.",
    author: "Dr. Lisa Nakamura, Parks Director",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCITHsBXAsYUk3kW5TjTtjNxqK8BHhlFrwrzaTR8pAXAiMtVQtkkOknnItJSh400mg4xAcGn4bWXuNOxmoVsfIbJq_KzR7rSfrqXxPawAM9wHrRX4QSJSl35PEWqbeeBUdV_2xqS_3rwnj-pFFC1RpmOIhodpXIYGCYk6ZfKwMXRo5KEGn8jid233mCAvu3xKuJmYOJ2QNI9-1NfVJvG6eeOO-zzYRNb-S8f4zqkYJSUlTIebFBGWXLX9Lrd86y7Q7_0ATPKQMUSzk",
    stats: [
      { label: "Annual Savings", value: "$2.1M" },
      { label: "Parks Deployed", value: "86" },
      { label: "Zones", value: "512" },
    ],
  },
  {
    tag: "Commercial",
    title: "GreenRoof Solutions NYC",
    metric: "91%",
    metricLabel: "Survival Rate",
    desc: "A pioneering green rooftop installation achieved 91% plant survival rate in extreme urban conditions—up from 62% with manual watering.",
    quote: "On a rooftop in Manhattan, every degree and every drop matters. AquaSmart's microclimate awareness is unmatched.",
    author: "James Park, Founder & CEO",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAou88SoxQzsg3Lt2dc-NFxMlPuL8hAvrW4UbLvK4t1e38SIHSrleKpdCFgoKIdrZa3jW54330vKiJVHD_Be3A7RwN14rmN2n8XKSKU06hDjy7Lh5tR9eA83vEQbkrhFXVkayRIdNi7n3i8Qt_4lyab0vaf0L9ghx9jRKzzVNgC-uQXcZ4TwiUsJb6jmUH0aerYSda5L56ewl50Ym7PJmI1jYiPZQOPfUpWXK2J83ZJluK1ezDN5XL630Yzu5tMu3JTe-vbiemnCqQ",
    stats: [
      { label: "Prev. Survival", value: "62%" },
      { label: "Sensor Nodes", value: "48" },
      { label: "Roof Area", value: "22,000 sqft" },
    ],
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="bg-background font-body text-on-background">
      <TopNav />
      <main className="pt-24 overflow-x-hidden">
        {/* Hero */}
        <section className="relative px-8 py-20 lg:py-28 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest mb-6 font-headline">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                auto_stories
              </span>
              Real Results
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-primary font-headline tracking-tighter leading-[1.1] mb-8">
              Proven impact across <span className="text-secondary">industries</span>.
            </h1>
            <p className="text-on-surface-variant text-lg lg:text-xl max-w-2xl leading-relaxed">
              From thousand-acre vineyards to urban rooftops, see how organizations are transforming
              their water management with AquaSmart.
            </p>
          </motion.div>
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-secondary-fixed-dim/20 rounded-full blur-[100px] -z-10" />
        </section>

        {/* Case Studies */}
        <section className="pb-24 px-8">
          <div className="max-w-7xl mx-auto space-y-16">
            {caseStudies.map((study, i) => (
              <motion.div
                key={study.title}
                {...fadeUp}
                transition={{ duration: 0.7, delay: i * 0.1 }}
                className="bg-surface-container-lowest rounded-[2.5rem] overflow-hidden"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Image */}
                  <div className="relative h-64 lg:h-auto min-h-[300px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-widest text-primary">
                        {study.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl">
                      <div className="text-4xl font-black font-headline text-secondary">{study.metric}</div>
                      <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{study.metricLabel}</div>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <h3 className="text-3xl font-bold font-headline text-primary mb-4">{study.title}</h3>
                    <p className="text-on-surface-variant leading-relaxed mb-8">{study.desc}</p>
                    {/* Quote */}
                    <blockquote className="border-l-4 border-secondary-fixed-dim pl-6 mb-8">
                      <p className="text-sm italic text-on-surface-variant leading-relaxed mb-2">&ldquo;{study.quote}&rdquo;</p>
                      <cite className="text-[10px] font-bold uppercase tracking-widest text-primary not-italic">{study.author}</cite>
                    </blockquote>
                    {/* Stats */}
                    <div className="flex gap-6">
                      {study.stats.map((stat) => (
                        <div key={stat.label} className="bg-surface-container-low p-4 rounded-xl">
                          <div className="text-xl font-bold font-headline text-primary">{stat.value}</div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-8">
          <motion.div
            {...fadeUp}
            className="max-w-5xl mx-auto technical-gradient rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-fixed-dim/20 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black font-headline text-on-primary mb-8">Become the next success story.</h2>
              <p className="text-on-primary-container text-lg max-w-2xl mx-auto mb-10 opacity-80">
                Let our team design a custom AquaSmart solution tailored to your operation.
              </p>
              <button className="bg-secondary text-on-secondary px-10 py-5 rounded-2xl font-black text-xl organic-glow hover:scale-105 active:scale-95 transition-all">
                Start Your Journey
              </button>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
