"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";

type AuthState = "login" | "register" | "reset" | "reset-sent";

const panelCopy: Record<AuthState, { title: string; body: string; button: string }> = {
  login: {
    title: "Enter the field atlas",
    body: "Sign in to schedules, alerts, zone logic, and operator notes shaped by the new AquaSmart system.",
    button: "Enter dashboard",
  },
  register: {
    title: "Create an operator account",
    body: "Open a new workspace for estates, farms, gardens, or research plots that need calmer control surfaces.",
    button: "Create account",
  },
  reset: {
    title: "Recover client access",
    body: "We will route a recovery link to the verified operator email attached to your site.",
    button: "Send recovery link",
  },
  "reset-sent": {
    title: "Recovery sent",
    body: "Check your inbox for the recovery path. The link will return you to this atlas without losing context.",
    button: "Back to login",
  },
};

function AuthHeader({ state }: { state: AuthState }) {
  return (
    <header>
      <p className="eyebrow text-[10px] text-clay">Client access</p>
      <h1 className="display-title mt-5 text-5xl text-forest md:text-6xl">{panelCopy[state].title}</h1>
      <p className="mt-5 max-w-lg text-base leading-8 text-ink-soft">{panelCopy[state].body}</p>
    </header>
  );
}

export default function AuthPage() {
  const [state, setState] = useState<AuthState>("login");

  return (
    <main className="site-shell min-h-screen bg-paper text-ink">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="contour-map grain relative hidden overflow-hidden bg-forest-deep text-paper-soft lg:flex">
          <video
            autoPlay
            muted
            loop
            playsInline
            src="https://res.cloudinary.com/dxprtqtv9/video/upload/w_1920,q_auto/12860602_3840_2160_25fps_sapk6w.webm"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="video-mask absolute inset-0" />

          <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-paper/25 bg-paper-soft/10">
                <span className="material-symbols-outlined text-[20px]">water_lock</span>
              </div>
              <div className="leading-none">
                <p className="eyebrow text-[9px] text-paper-soft/70">Field Atlas</p>
                <p className="font-display text-[1.4rem] tracking-[-0.08em]">AquaSmart</p>
              </div>
            </Link>

            <div className="max-w-2xl">
              <p className="eyebrow text-[10px] text-paper-soft/52">Operator brief</p>
              <h2 className="display-title mt-6 text-6xl xl:text-[6rem]">
                Calm enough to trust. Precise enough to act on.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-paper-soft/74">
                The same contour language from the landing experience continues here, so sign-in feels like entering the
                product world instead of leaving the brand behind.
              </p>
            </div>

            <div className="dark-frame max-w-xl rounded-[2rem] p-6">
              <p className="eyebrow text-[8px] text-paper-soft/48">Live atlas pulse</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  ["Active sites", "18"],
                  ["Alert priority", "Low"],
                  ["Water saved", "61%"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[1.35rem] border border-paper/10 bg-paper-soft/6 p-4">
                    <p className="eyebrow text-[8px] text-paper-soft/46">{label}</p>
                    <p className="mt-3 font-display text-3xl">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-24 md:px-8">
          <div className="w-full max-w-xl">
            <Link href="/" className="mb-10 inline-flex items-center gap-2 lg:hidden">
              <span className="material-symbols-outlined text-[20px] text-forest">west</span>
              <span className="text-sm text-ink-soft">Back to site</span>
            </Link>

            <motion.div
              key={state}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="section-frame rounded-[2.4rem] p-7 md:p-10"
            >
              <AuthHeader state={state} />

              {state !== "reset-sent" ? (
                <form className="mt-10 space-y-5" onSubmit={(event) => event.preventDefault()}>
                  {state === "register" ? (
                    <label className="block">
                      <span className="eyebrow text-[8px] text-ink-soft/56">Site operator</span>
                      <input
                        type="text"
                        placeholder="Avery Stone"
                        className="mt-2 w-full rounded-[1.35rem] border border-ink/10 bg-paper px-4 py-4 outline-none transition focus:border-clay"
                      />
                    </label>
                  ) : null}

                  <label className="block">
                    <span className="eyebrow text-[8px] text-ink-soft/56">Email</span>
                    <input
                      type="email"
                      placeholder="operator@aquasmart.io"
                      className="mt-2 w-full rounded-[1.35rem] border border-ink/10 bg-paper px-4 py-4 outline-none transition focus:border-clay"
                    />
                  </label>

                  {state !== "reset" ? (
                    <label className="block">
                      <div className="flex items-center justify-between gap-4">
                        <span className="eyebrow text-[8px] text-ink-soft/56">Password</span>
                        {state === "login" ? (
                          <button
                            type="button"
                            onClick={() => setState("reset")}
                            className="text-xs text-clay transition hover:text-forest"
                          >
                            Forgot access?
                          </button>
                        ) : null}
                      </div>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="mt-2 w-full rounded-[1.35rem] border border-ink/10 bg-paper px-4 py-4 outline-none transition focus:border-clay"
                      />
                    </label>
                  ) : null}

                  {state === "register" ? (
                    <label className="block">
                      <span className="eyebrow text-[8px] text-ink-soft/56">Confirm password</span>
                      <input
                        type="password"
                        placeholder="••••••••"
                        className="mt-2 w-full rounded-[1.35rem] border border-ink/10 bg-paper px-4 py-4 outline-none transition focus:border-clay"
                      />
                    </label>
                  ) : null}

                  {state === "reset" ? (
                    <button
                      type="button"
                      onClick={() => setState("reset-sent")}
                      className="atlas-button mt-3 flex w-full rounded-full px-6 py-4 text-sm font-medium"
                    >
                      {panelCopy[state].button}
                    </button>
                  ) : (
                    <Link
                      href="/dashboard"
                      className="atlas-button mt-3 flex w-full rounded-full px-6 py-4 text-sm font-medium"
                    >
                      {panelCopy[state].button}
                    </Link>
                  )}
                </form>
              ) : (
                <div className="mt-10 rounded-[1.7rem] bg-forest-deep px-5 py-6 text-paper-soft">
                  <p className="eyebrow text-[8px] text-paper-soft/48">Inbox status</p>
                  <p className="mt-4 text-sm leading-7 text-paper-soft/76">
                    Your recovery note is on the way. When you are ready, return to sign-in and continue where you left off.
                  </p>
                  <button
                    type="button"
                    onClick={() => setState("login")}
                    className="atlas-button mt-6 rounded-full px-5 py-3 text-sm font-medium"
                  >
                    Back to login
                  </button>
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-ink-soft">
                {state === "login" ? (
                  <button type="button" onClick={() => setState("register")} className="transition hover:text-forest">
                    Need an account?
                  </button>
                ) : null}
                {state === "register" ? (
                  <button type="button" onClick={() => setState("login")} className="transition hover:text-forest">
                    Already have access?
                  </button>
                ) : null}
                {state === "reset" ? (
                  <button type="button" onClick={() => setState("login")} className="transition hover:text-forest">
                    Return to login
                  </button>
                ) : null}
                <Link href="/technology" className="transition hover:text-forest">
                  Read the technology notes
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
}
