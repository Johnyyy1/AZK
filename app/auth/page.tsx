"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { FormEvent, useState } from "react";
import Icon from "../components/Icon";
import { authClient } from "../lib/auth-client";

type AuthState = "login" | "register" | "reset-sent";

const panelCopy: Record<AuthState, { title: string; body: string; button: string }> = {
  login: {
    title: "Enter the plant console",
    body: "Sign in to moisture history, pump overrides, and your Siemens LOGO bridge.",
    button: "Enter dashboard",
  },
  register: {
    title: "Create an operator account",
    body: "Create your workspace, then add the local bridge that talks to your LOGO 8.4 in the same network.",
    button: "Create account",
  },
  "reset-sent": {
    title: "Recovery not wired yet",
    body: "Password reset email is reserved for the next mail-provider pass. For now, use sign in or create a new local test account.",
    button: "Back to login",
  },
};

function AuthHeader({ state }: { state: AuthState }) {
  return (
    <header>
      <p className="eyebrow text-[10px] text-clay">Operator access</p>
      <h1 className="display-title mt-5 text-5xl text-forest md:text-6xl">{panelCopy[state].title}</h1>
      <p className="mt-5 max-w-lg text-base leading-8 text-ink-soft">{panelCopy[state].body}</p>
    </header>
  );
}

export default function AuthPage() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>("login");
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const name = String(formData.get("name") ?? "");

    try {
      if (state === "register") {
        const result = await authClient.signUp.email({
          email,
          password,
          name: name || email,
        });

        if (result.error) {
          throw new Error(result.error.message ?? "Account creation failed.");
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        });

        if (result.error) {
          throw new Error(result.error.message ?? "Sign in failed.");
        }
      }

      router.push("/dashboard/settings");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setPending(false);
    }
  };

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
                <Icon name="water_lock" className="text-[20px]" />
              </div>
              <div className="leading-none">
                <p className="eyebrow text-[9px] text-paper-soft/70">LOGO 8.4 Bridge</p>
                <p className="font-display text-[1.4rem] tracking-[-0.08em]">AquaSmart</p>
              </div>
            </Link>

            <div className="max-w-2xl">
              <p className="eyebrow text-[10px] text-paper-soft/52">Operator brief</p>
              <h2 className="display-title mt-6 text-6xl xl:text-[6rem]">
                Cloud account. Local hardware agent. No exposed PLC.
              </h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-paper-soft/74">
                AquaSmart stores accounts and command history in the cloud while the Bun bridge stays beside the PLC and
                pulls work safely from your workspace.
              </p>
            </div>

            <div className="dark-frame max-w-xl rounded-[2rem] p-6">
              <p className="eyebrow text-[8px] text-paper-soft/48">Access model</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {[
                  ["Auth", "Email"],
                  ["PLC link", "Agent"],
                  ["Access", "Approved"],
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
              <Icon name="west" className="text-[20px] text-forest" />
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
                <form className="mt-10 space-y-5" onSubmit={submit}>
                  {state === "register" ? (
                    <label className="block">
                      <span className="eyebrow text-[8px] text-ink-soft/56">Plant operator</span>
                      <input
                        name="name"
                        type="text"
                        placeholder="Avery Stone"
                        className="mt-2 w-full rounded-[1.35rem] border border-ink/10 bg-paper px-4 py-4 outline-none transition focus:border-clay"
                      />
                    </label>
                  ) : null}

                  <label className="block">
                    <span className="eyebrow text-[8px] text-ink-soft/56">Email</span>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="operator@aquasmart.one"
                      className="mt-2 w-full rounded-[1.35rem] border border-ink/10 bg-paper px-4 py-4 outline-none transition focus:border-clay"
                    />
                  </label>

                  <label className="block">
                    <div className="flex items-center justify-between gap-4">
                      <span className="eyebrow text-[8px] text-ink-soft/56">Password</span>
                      {state === "login" ? (
                        <button
                          type="button"
                          onClick={() => setState("reset-sent")}
                          className="text-xs text-clay transition hover:text-forest"
                        >
                          Forgot access?
                        </button>
                      ) : null}
                    </div>
                    <input
                      name="password"
                      type="password"
                      minLength={8}
                      required
                      placeholder="Password"
                      className="mt-2 w-full rounded-[1.35rem] border border-ink/10 bg-paper px-4 py-4 outline-none transition focus:border-clay"
                    />
                  </label>

                  <button
                    type="submit"
                    disabled={pending}
                    className="atlas-button mt-3 flex w-full rounded-full px-6 py-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pending ? "Working..." : panelCopy[state].button}
                  </button>
                </form>
              ) : (
                <div className="mt-10 rounded-[1.7rem] bg-forest-deep px-5 py-6 text-paper-soft">
                  <p className="eyebrow text-[8px] text-paper-soft/48">Recovery status</p>
                  <p className="mt-4 text-sm leading-7 text-paper-soft/76">{panelCopy[state].body}</p>
                  <button
                    type="button"
                    onClick={() => setState("login")}
                    className="atlas-button mt-6 rounded-full px-5 py-3 text-sm font-medium"
                  >
                    {panelCopy[state].button}
                  </button>
                </div>
              )}

              {message ? <p className="mt-5 text-sm text-clay">{message}</p> : null}

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
