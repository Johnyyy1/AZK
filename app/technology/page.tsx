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

export default function TechnologyPage() {
  return (
    <div className="bg-background font-body text-on-background">
      <TopNav />
      <main className="pt-24 overflow-x-hidden">
        {/* Hero */}
        <section className="relative px-8 py-20 lg:py-32 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[10px] font-bold uppercase tracking-widest mb-6 font-headline">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                science
              </span>
              Under The Hood
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-primary font-headline tracking-tighter leading-[1.1] mb-4">
              The science behind <span className="text-secondary">precision</span> irrigation.
            </h1>
            <p className="font-accent italic text-lg text-on-surface-variant/60 mb-4">
              Multi-layered intelligence at scale
            </p>
            <p className="text-on-surface-variant text-lg lg:text-xl max-w-2xl leading-relaxed">
              Our multi-layered approach combines edge-computing soil sensors, satellite weather data,
              and machine learning models to create the most intelligent irrigation platform on the market.
            </p>
          </motion.div>
          <div className="absolute -top-10 -right-10 w-96 h-96 bg-tertiary-fixed-dim/20 rounded-full blur-[100px] -z-10 animate-float" />
        </section>

        {/* Architecture Stack */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div {...fadeUp} className="mb-16">
              <h2 className="text-xs uppercase tracking-[0.3em] font-headline font-bold text-secondary mb-4">Architecture</h2>
              <h3 className="text-4xl font-black font-headline text-primary">Three-layer intelligence.</h3>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: "memory",
                  title: "Edge Layer",
                  subtitle: "Sensor Nodes",
                  desc: "Low-power mesh-networked devices measure moisture, temperature, light, and soil pH every 30 seconds. Local processing eliminates cloud dependency for time-critical decisions.",
                  tags: ["LoRaWAN", "Solar Powered", "IP67 Rated"],
                  color: "bg-primary text-on-primary",
                },
                {
                  icon: "cloud_sync",
                  title: "Cloud Layer",
                  subtitle: "Data Pipeline",
                  desc: "AWS-hosted microservices ingest millions of data points, run anomaly detection, and feed our proprietary ML models in real-time. 99.99% uptime guaranteed.",
                  tags: ["Real-time", "End-to-end Encrypted", "Multi-region"],
                  color: "bg-tertiary-fixed-dim text-primary",
                },
                {
                  icon: "psychology",
                  title: "Intelligence Layer",
                  subtitle: "Decision Engine",
                  desc: "Our patent-pending HydroSense™ algorithm processes satellite imagery, hyperlocal weather, and historical crop data to predict irrigation needs 72 hours in advance.",
                  tags: ["Predictive", "Self-Learning", "Species-Aware"],
                  color: "bg-secondary-container text-on-secondary-container",
                },
              ].map((layer, i) => (
                <motion.div
                  key={layer.title}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  whileHover={{ y: -8, rotateZ: i === 1 ? 0 : (i === 0 ? -1 : 1) }}
                  className={`${layer.color} p-8 rounded-[2rem] flex flex-col justify-between min-h-[400px] hover:shadow-2xl transition-shadow duration-500 group`}
                >
                  <div>
                    <motion.span
                      className="material-symbols-outlined text-4xl mb-6 block"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      whileHover={{ rotate: 10, scale: 1.2 }}
                    >
                      {layer.icon}
                    </motion.span>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 font-headline">{layer.subtitle}</p>
                    <h4 className="text-2xl font-bold font-headline mb-4">{layer.title}</h4>
                    <p className="text-sm opacity-80 leading-relaxed">{layer.desc}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-6">
                    {layer.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-lg bg-white/15 text-[10px] font-bold uppercase group-hover:bg-white/25 transition-colors">{tag}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Specs */}
        <section className="py-24 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-black font-headline text-primary mb-4">Performance metrics</h2>
              <p className="font-accent italic text-on-surface-variant/60 mb-2">Numbers that speak for themselves</p>
              <p className="text-on-surface-variant max-w-2xl mx-auto">Battle-tested across 500+ commercial installations worldwide.</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "< 200ms", label: "Sensor Response Time" },
                { value: "99.99%", label: "System Uptime" },
                { value: "60%", label: "Water Savings" },
                { value: "500+", label: "Plant Species DB" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="bg-surface-container-low p-8 rounded-[2rem] text-center hover:shadow-xl transition-shadow duration-500 cursor-default shimmer-border"
                >
                  <div className="text-4xl lg:text-5xl font-black font-headline text-primary mb-4">{stat.value}</div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant font-label">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration */}
        <section className="py-24 px-8 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-16">
              <h2 className="text-xs uppercase tracking-[0.3em] font-headline font-bold text-secondary mb-4">Ecosystem</h2>
              <h3 className="text-4xl font-black font-headline text-primary">Seamlessly integrated.</h3>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { icon: "api", title: "REST & GraphQL API", desc: "Full programmatic access to all sensor data, zone controls, and analytics via our well-documented API." },
                { icon: "webhook", title: "Webhooks & Events", desc: "Subscribe to real-time events — moisture thresholds, cycle completions, hardware alerts — pushed to your infrastructure." },
                { icon: "hub", title: "Smart Home Integration", desc: "Works with Home Assistant, Google Home, and Apple HomeKit for consumer-grade installations." },
                { icon: "satellite_alt", title: "Weather Services", desc: "Integrates with NWS, OpenWeatherMap, and proprietary satellite imagery for hyper-local forecasting." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="bg-surface-container-lowest p-8 rounded-[2rem] flex gap-6 items-start group hover:shadow-xl transition-shadow duration-500 shimmer-border"
                >
                  <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <span className="material-symbols-outlined text-primary text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold font-headline mb-2 text-primary">{item.title}</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-8">
          <motion.div
            {...fadeUp}
            className="max-w-5xl mx-auto technical-gradient rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-tertiary-fixed-dim/20 rounded-full blur-[100px]" />
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-5xl font-black font-headline text-on-primary mb-4">See the technology in action.</h2>
              <p className="font-accent italic text-on-primary/50 mb-4">Experience precision irrigation firsthand</p>
              <p className="text-on-primary-container text-lg max-w-2xl mx-auto mb-10 opacity-80">
                Book a personalized demo with our solutions engineering team.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-secondary text-on-secondary px-10 py-5 rounded-2xl font-black text-xl btn-magnetic"
              >
                Schedule Demo
              </motion.button>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
