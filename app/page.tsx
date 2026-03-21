"use client";

import TopNav from "./components/TopNav";
import Footer from "./components/Footer";
import Link from "next/link";
import { motion } from "motion/react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

export default function LandingPage() {
  return (
    <div className="bg-background font-body text-on-background">
      <TopNav />
      <main className="pt-24 overflow-x-hidden">
        {/* Hero Section */}
        <section className="relative px-8 py-20 lg:py-32 max-w-7xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl text-center flex flex-col items-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold uppercase tracking-widest mb-6 font-headline"
            >
              <span
                className="material-symbols-outlined text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                eco
              </span>
              The Future of Agriculture
            </motion.div>
            <h1 className="text-5xl lg:text-8xl font-black text-primary font-headline tracking-tighter leading-[1.1] mb-4">
              Precision watering for a{" "}
              <span className="text-secondary">greener</span> world.
            </h1>
            <p className="font-accent italic text-lg lg:text-2xl text-on-surface-variant/70 mb-4">
              Where technology meets nature
            </p>
            <p className="text-on-surface-variant text-lg lg:text-xl max-w-2xl mb-12 leading-relaxed">
              Optimize your agricultural yields with AI-driven hydration.
              AquaSmart senses soil needs in real-time, delivering the exact
              drop required.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth"
                  className="inline-block technical-gradient text-on-primary px-10 py-5 rounded-2xl font-bold text-xl btn-magnetic"
                >
                  Get Started
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/auth"
                  className="inline-block bg-surface-container-highest text-primary px-10 py-5 rounded-2xl font-bold text-xl hover:bg-surface-container-high transition-colors"
                >
                  Login
                </Link>
              </motion.div>
            </div>
          </motion.div>
          {/* Background blurs */}
          <div className="absolute -top-10 -left-10 w-96 h-96 bg-secondary-fixed-dim/20 rounded-full blur-[100px] -z-10 animate-float" />
          <div className="absolute -bottom-20 -right-10 w-96 h-96 bg-tertiary-fixed-dim/20 rounded-full blur-[100px] -z-10" />
        </section>

        {/* Features Bento Grid */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div {...fadeUp} className="mb-16">
              <h2 className="text-xs uppercase tracking-[0.3em] font-headline font-bold text-secondary mb-4">
                Capabilities
              </h2>
              <h3 className="text-4xl font-black font-headline text-primary">
                Intelligence in every drop.
              </h3>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Feature 1 */}
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.1 }}
                whileHover={{ y: -6 }}
                className="md:col-span-8 bg-surface-container-lowest p-8 rounded-[2rem] flex flex-col justify-between min-h-[320px] shimmer-border hover:shadow-xl transition-shadow duration-500 group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <span className="material-symbols-outlined text-primary">
                      water_drop
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold font-headline mb-4">
                    Automated watering
                  </h4>
                  <p className="text-on-surface-variant max-w-md">
                    Schedule and automate entire irrigation networks based on
                    plant-specific moisture profiles and environmental data.
                  </p>
                </div>
                <div className="flex gap-4 mt-8">
                  <span className="px-3 py-1 rounded-lg bg-surface-container text-[10px] font-bold text-primary uppercase group-hover:bg-primary-fixed transition-colors">
                    Precision Flow
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-surface-container text-[10px] font-bold text-primary uppercase group-hover:bg-primary-fixed transition-colors">
                    Zone Control
                  </span>
                </div>
              </motion.div>
              {/* Feature 2 */}
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.2 }}
                whileHover={{ y: -6, rotateZ: 1 }}
                className="md:col-span-4 bg-primary text-on-primary p-8 rounded-[2rem] flex flex-col justify-center items-center text-center hover:shadow-2xl transition-shadow duration-500 group"
              >
                <div className="w-16 h-16 rounded-full bg-secondary-fixed-dim/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <span
                    className="material-symbols-outlined text-secondary-fixed text-4xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    sensors
                  </span>
                </div>
                <h4 className="text-2xl font-bold font-headline mb-4">
                  Sensor-based decisions
                </h4>
                <p className="text-on-primary-container text-sm">
                  Real-time data from hyper-local nodes ensures you never
                  overwater again.
                </p>
              </motion.div>
              {/* Feature 3 */}
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.3 }}
                whileHover={{ y: -6 }}
                className="md:col-span-4 bg-tertiary-fixed-dim p-8 rounded-[2rem] flex flex-col justify-between hover:shadow-xl transition-shadow duration-500 group"
              >
                <h4 className="text-2xl font-bold font-headline text-primary">
                  Remote control
                </h4>
                <div className="my-6 aspect-video bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <motion.span
                    className="material-symbols-outlined text-primary text-5xl"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    smartphone
                  </motion.span>
                </div>
                <p className="text-primary/70 text-sm font-medium">
                  Manage your farm from anywhere in the world with our encrypted
                  cloud interface.
                </p>
              </motion.div>
              {/* Feature 4 */}
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.4 }}
                whileHover={{ y: -6 }}
                className="md:col-span-8 technical-gradient text-on-primary p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 overflow-hidden hover:shadow-2xl transition-shadow duration-500"
              >
                <div className="flex-1">
                  <h4 className="text-4xl font-black font-headline mb-4">
                    Water-saving
                  </h4>
                  <p className="text-on-primary/80 mb-6">
                    Reduce overall consumption by up to 60% compared to
                    traditional timer-based systems.
                  </p>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "60%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-secondary-fixed-dim rounded-full"
                    />
                  </div>
                </div>
                <div className="w-48 h-48 flex-shrink-0 relative">
                  <motion.div
                    className="absolute inset-0 border-4 border-dashed border-secondary-fixed-dim/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  />
                  <div className="absolute inset-4 bg-secondary-fixed-dim/20 rounded-full flex items-center justify-center">
                    <span className="text-4xl font-black font-headline text-secondary-fixed-dim">
                      60%
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Dashboard Preview */}
        <section className="py-24 px-8 overflow-hidden bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div {...fadeUp} className="text-center mb-20">
              <h2 className="text-4xl lg:text-5xl font-black font-headline text-primary mb-4">
                A Living Laboratory
              </h2>
              <p className="font-accent italic text-lg text-on-surface-variant/60 mb-2">
                Data visualized with precision engineering
              </p>
              <p className="text-on-surface-variant max-w-2xl mx-auto">
                Our dashboard isn&apos;t just data. It&apos;s the pulse of your
                ecosystem.
              </p>
            </motion.div>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative bg-surface-container-low rounded-[3rem] p-4 md:p-12 shadow-2xl overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Sidebar Mock */}
                <div className="hidden md:block col-span-2 space-y-6">
                  <div className="w-10 h-10 bg-primary rounded-xl mb-12" />
                  <div className="space-y-4">
                    {[1, 0.5, 0.5, 0.5].map((opacity, i) => (
                      <div
                        key={i}
                        className="w-full h-8 bg-surface-container rounded-lg"
                        style={{ opacity }}
                      />
                    ))}
                  </div>
                </div>
                {/* Main Panel Mock */}
                <div className="col-span-12 md:col-span-10">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                      { label: "Moisture", value: "68%" },
                      { label: "pH Level", value: "6.4" },
                      { label: "Flow Rate", value: "12L/m" },
                      { label: "Zones", value: "12" },
                    ].map((stat) => (
                      <motion.div
                        key={stat.label}
                        whileHover={{ y: -4, scale: 1.02 }}
                        className="bg-white p-6 rounded-2xl organic-glow hover:shadow-lg transition-shadow cursor-default"
                      >
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-2">
                          {stat.label}
                        </span>
                        <div className="text-3xl font-bold font-headline text-primary">
                          {stat.value}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {/* Graph Mock */}
                  <div className="bg-white p-8 rounded-[2rem] organic-glow relative min-h-[300px] flex flex-col justify-end">
                    <div className="absolute top-8 left-8">
                      <h5 className="font-bold font-headline text-primary">
                        Saturation Trends
                      </h5>
                      <p className="text-xs text-slate-400">Last 24 Hours</p>
                    </div>
                    <div className="flex items-end gap-1 h-32">
                      {[40, 55, 85, 70, 95, 80, 50, 45, 75, 90, 85, 60].map(
                        (h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.05 }}
                            whileHover={{ scaleY: 1.1 }}
                            className={`flex-1 rounded-t-md cursor-default origin-bottom transition-colors ${
                              h > 80
                                ? "bg-secondary-fixed-dim hover:bg-secondary"
                                : h > 60
                                  ? "bg-tertiary-fixed-dim hover:bg-tertiary-fixed"
                                  : "bg-surface-container-high hover:bg-surface-container"
                            }`}
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <motion.div {...fadeUp} className="text-center mb-16">
              <h2 className="text-xs uppercase tracking-[0.3em] font-headline font-bold text-secondary mb-4">
                Implementation
              </h2>
              <h3 className="text-4xl font-black font-headline text-primary">
                Simple setup, profound results.
              </h3>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  icon: "construction",
                  title: "1. Install",
                  desc: "Place our low-power nodes in key zones. They automatically sync with the AquaSmart central hub using mesh networking.",
                },
                {
                  icon: "settings_input_component",
                  title: "2. Configure",
                  desc: "Tell the app what you're growing. Our database contains hydration profiles for over 500 species of flora.",
                },
                {
                  icon: "check_circle",
                  title: "3. Enable",
                  desc: 'Turn on "Smart Mode" and watch your resources go further. Adjust settings remotely or let the AI optimize for you.',
                },
              ].map((step, i) => (
                <motion.div
                  key={step.title}
                  {...fadeUp}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  whileHover={{ y: -8 }}
                  className="relative group cursor-default"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-8 organic-glow group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <span className="material-symbols-outlined text-secondary text-3xl">
                      {step.icon}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold font-headline mb-4 text-primary">
                    {step.title}
                  </h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    {step.desc}
                  </p>
                  {/* Connecting line */}
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 -right-6 w-12 h-[2px] bg-outline-variant/30" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-24 px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div
                {...fadeUp}
                className="lg:w-1/2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <motion.img
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.6 }}
                  className="rounded-[2.5rem] organic-glow w-full aspect-[4/3] object-cover"
                  alt="Vibrant green fields under a clear sky"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWpGx_sUUY7SFHxuQvbASNozFBHGZUlRmEQTBr25sHPVFtYEe4i8fQMBRZSt7QMNh3w7HqpbPKcqdxP1sYax1dTJ0-P0V9JdboRxAkiClW4Os-8iMZHUlpNCmPZZfqxYEucC0w_B15vOu3FMLFnwaH8njBG1JiFlpRE5mhhqEmShZNs4BBntIi6N2BaIbfA9HRvILe-sAo5WdS3Jc_Zpe8oCiVO1vaQhSJ1ffDu0n4izwDf5x0y_m-us5LglMw7ro9Nj-OgqnFcLY"
                />
              </motion.div>
              <motion.div
                {...fadeUp}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:w-1/2"
              >
                <h2 className="text-4xl lg:text-5xl font-black font-headline text-primary mb-3 leading-tight">
                  Grow more with less.
                </h2>
                <p className="font-accent italic text-on-surface-variant/60 mb-8">
                  Sustainable agriculture for the next generation
                </p>
                <div className="space-y-8">
                  {[
                    {
                      icon: "savings",
                      title: "Save water",
                      desc: "Eliminate waste by watering only when and where it is needed based on precise soil metrics.",
                    },
                    {
                      icon: "schedule",
                      title: "Save time",
                      desc: "Automate repetitive monitoring and irrigation tasks, freeing up your team for high-value work.",
                    },
                    {
                      icon: "energy_savings_leaf",
                      title: "Healthier plants",
                      desc: "Avoid root rot and underwatering stress by maintaining the perfect saturation equilibrium.",
                    },
                  ].map((benefit) => (
                    <motion.div
                      key={benefit.title}
                      className="flex gap-6 group cursor-default"
                      whileHover={{ x: 8 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <span
                          className="material-symbols-outlined text-on-secondary-container"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          {benefit.icon}
                        </span>
                      </div>
                      <div>
                        <h5 className="text-xl font-bold font-headline mb-1">
                          {benefit.title}
                        </h5>
                        <p className="text-on-surface-variant text-sm">
                          {benefit.desc}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-8">
          <motion.div
            {...fadeUp}
            className="max-w-5xl mx-auto technical-gradient rounded-[3rem] p-12 lg:p-20 text-center relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary-fixed-dim/20 rounded-full blur-[100px]" />
            <motion.div
              className="absolute -bottom-32 -left-32 w-80 h-80 bg-tertiary-fixed-dim/10 rounded-full blur-[120px]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <div className="relative z-10">
              <h2 className="text-4xl lg:text-6xl font-black font-headline text-on-primary mb-4">
                Ready to modernize your grow?
              </h2>
              <p className="font-accent italic text-on-primary/60 text-lg mb-4">
                The future of agriculture starts here
              </p>
              <p className="text-on-primary-container text-lg lg:text-xl max-w-2xl mx-auto mb-10 opacity-80">
                Join 500+ commercial growers who have transformed their
                operations with AquaSmart.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/auth"
                    className="inline-block bg-secondary text-on-secondary px-10 py-5 rounded-2xl font-black text-xl btn-magnetic"
                  >
                    Get Started Now
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button className="bg-white/10 text-on-primary backdrop-blur-md px-10 py-5 rounded-2xl font-black text-xl hover:bg-white/20 transition-all">
                    Request Demo
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
