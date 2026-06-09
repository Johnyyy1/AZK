"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  createPlcAction,
  deletePlcAction,
  regenerateAgentTokenAction,
  revokeAgentTokensAction,
  updatePlcAction,
  type PlcActionState,
} from "@/app/actions/plcs";
import { authClient } from "@/app/lib/auth-client";

export type SettingsPlcRow = {
  id: string;
  name: string;
  model: string;
  logoIp: string;
  logoPort: number;
  unitId: number;
  readIntervalMs: number;
  registerOffset: number;
  registerCount: number;
  pumpWriteMode: "coil" | "register";
  pumpCoilAddress: number | null;
  pumpRegisterAddress: number | null;
  pumpRegisterOnValue: number;
  pumpRegisterOffValue: number;
  lastHeartbeatAt: string | null;
  lastReadingAt: string | null;
  lastErrorMessage: string | null;
  tokenPrefix: string | null;
  tokenLastUsedAt: string | null;
  latestReadingValue: number | null;
};

const reveal = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

const initialActionState: PlcActionState = {};
const inputClass = "mt-2 w-full rounded-[1.15rem] border border-ink/10 bg-white/70 px-4 py-3 outline-none transition focus:border-clay";
const smallButtonClass = "rounded-full px-5 py-3 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60";

const formatDate = (value: string | null) => {
  if (!value) return "Never";

  return new Intl.DateTimeFormat("cs-CZ", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
};

function ActionMessage({ state }: { state: PlcActionState }) {
  if (!state.message && !state.error && !state.agentToken) return null;

  return (
    <div className={`mt-5 rounded-[1.3rem] p-4 text-sm ${state.error ? "bg-clay/10 text-clay" : "bg-white/70 text-forest"}`}>
      {state.error ? <p>{state.error}</p> : null}
      {state.message ? <p>{state.message}</p> : null}
      {state.agentToken ? (
        <p className="mt-3 break-all rounded-[1rem] bg-forest-deep px-4 py-3 font-mono text-xs text-paper-soft">
          AQUASMART_AGENT_TOKEN={state.agentToken}
        </p>
      ) : null}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required = false,
  className = "block",
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="eyebrow text-[7px] text-ink-soft/58">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    </label>
  );
}

const pumpAddressLabel = (plc: SettingsPlcRow) =>
  plc.pumpWriteMode === "coil"
    ? `coil ${plc.pumpCoilAddress ?? "missing"}`
    : `register ${plc.pumpRegisterAddress ?? "missing"}`;

export default function SettingsClient({
  user,
  site,
  plcs,
}: {
  user: { name: string; email: string };
  site: { name: string; role: "owner" | "operator" };
  plcs: SettingsPlcRow[];
}) {
  const router = useRouter();
  const [createState, createAction, createPending] = useActionState(createPlcAction, initialActionState);
  const [updateState, updateAction, updatePending] = useActionState(updatePlcAction, initialActionState);
  const [deleteState, deleteAction, deletePending] = useActionState(deletePlcAction, initialActionState);
  const [tokenState, tokenAction, tokenPending] = useActionState(regenerateAgentTokenAction, initialActionState);
  const [revokeState, revokeAction, revokePending] = useActionState(revokeAgentTokensAction, initialActionState);

  const signOut = async () => {
    await authClient.signOut();
    router.push("/auth");
    router.refresh();
  };

  return (
    <main className="px-5 py-6 md:px-8 md:py-8">
      <motion.header
        {...reveal}
        transition={{ duration: 0.5 }}
        className="mb-8 grid gap-6 xl:grid-cols-[0.95fr_1.05fr] xl:items-end"
      >
        <div>
          <p className="eyebrow text-[9px] text-clay">Settings</p>
          <h1 className="display-title mt-4 text-5xl text-forest md:text-6xl">
            Accounts, PLC bridges, and tokens stay in one operational panel.
          </h1>
        </div>
        <div className="section-frame rounded-[1.8rem] p-5 text-sm leading-7 text-ink-soft">
          <p>
            {site.name} is running in {site.role} mode for {user.name}. The cloud stores configuration and queue state;
            the local bridge pulls work beside the PLC.
          </p>
          <button type="button" onClick={signOut} className="mt-4 text-sm text-clay transition hover:text-forest">
            Sign out
          </button>
        </div>
      </motion.header>

      <div className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <motion.section
          {...reveal}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="section-frame rounded-[2rem] p-6 md:p-7"
        >
          <p className="eyebrow text-[8px] text-clay">Add Siemens LOGO 8.4</p>
          <form action={createAction} className="mt-6 grid gap-4">
            <Field name="name" label="PLC name" placeholder="Greenhouse LOGO" />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field name="logoIp" label="LOGO IP for local bridge" placeholder="192.168.0.3" required className="block sm:col-span-2" />
              <Field name="logoPort" label="Port" type="number" defaultValue={502} />
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <Field name="unitId" label="Unit ID" type="number" defaultValue={1} />
              <Field name="registerOffset" label="Register offset" type="number" defaultValue={0} />
              <Field name="registerCount" label="Register count" type="number" defaultValue={1} />
              <Field name="readIntervalMs" label="Read ms" type="number" defaultValue={2000} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="block">
                <span className="eyebrow text-[7px] text-ink-soft/58">Pump mode</span>
                <select name="pumpWriteMode" defaultValue="coil" className={inputClass}>
                  <option value="coil">Coil</option>
                  <option value="register">Register</option>
                </select>
              </label>
              <Field name="pumpCoilAddress" label="Coil address" type="number" defaultValue={8256} />
              <Field name="pumpRegisterAddress" label="Register address" type="number" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field name="pumpRegisterOnValue" label="Register ON value" type="number" defaultValue={1} />
              <Field name="pumpRegisterOffValue" label="Register OFF value" type="number" defaultValue={0} />
            </div>
            <button disabled={createPending} className="atlas-button mt-2 rounded-full px-6 py-4 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-60">
              {createPending ? "Adding..." : "Add PLC and generate bridge token"}
            </button>
          </form>
          <ActionMessage state={createState} />
        </motion.section>

        <div className="space-y-8">
          <motion.section
            {...reveal}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="dark-frame rounded-[2rem] p-6 text-paper-soft md:p-7"
          >
            <p className="eyebrow text-[8px] text-paper-soft/44">Profile</p>
            <h2 className="mt-4 font-display text-4xl">{user.name}</h2>
            <p className="mt-3 text-sm text-paper-soft/68">{user.email}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.2rem] border border-paper/10 bg-paper-soft/8 px-4 py-3">
                {site.name}
              </div>
              <div className="rounded-[1.2rem] border border-paper/10 bg-paper-soft/8 px-4 py-3">
                {plcs.length} PLC bridge{plcs.length === 1 ? "" : "s"}
              </div>
            </div>
          </motion.section>

          <ActionMessage state={tokenState} />
          <ActionMessage state={revokeState} />
          <ActionMessage state={updateState} />
          <ActionMessage state={deleteState} />

          {plcs.length === 0 ? (
            <motion.section
              {...reveal}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="atlas-card rounded-[2rem] p-6 md:p-7"
            >
              <p className="eyebrow text-[8px] text-clay">PLC bridges</p>
              <h2 className="mt-3 font-display text-4xl text-forest">No PLC has been added yet.</h2>
              <p className="mt-4 text-sm leading-7 text-ink-soft">
                Add the first Siemens LOGO 8.4 configuration, then start the local Bun bridge with the generated token.
              </p>
            </motion.section>
          ) : (
            plcs.map((plc, index) => (
              <motion.section
                key={plc.id}
                {...reveal}
                transition={{ duration: 0.45, delay: 0.2 + index * 0.05 }}
                className="atlas-card rounded-[2rem] p-6 md:p-7"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="eyebrow text-[8px] text-clay">{plc.model}</p>
                    <h2 className="mt-3 font-display text-4xl text-forest">{plc.name}</h2>
                    <p className="mt-2 text-sm text-ink-soft">
                      {plc.logoIp}:{plc.logoPort} · unit {plc.unitId}
                    </p>
                  </div>
                  <div className="rounded-full bg-forest-deep px-4 py-2 text-xs text-paper-soft">
                    {plc.lastHeartbeatAt ? "Agent seen" : "Waiting for agent"}
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {[
                    ["Heartbeat", formatDate(plc.lastHeartbeatAt)],
                    ["Latest reading", plc.latestReadingValue === null ? "No data" : `${plc.latestReadingValue}`],
                    ["Pump mapping", pumpAddressLabel(plc)],
                    ["Token", plc.tokenPrefix ? `${plc.tokenPrefix}...` : "No active token"],
                    ["Token used", formatDate(plc.tokenLastUsedAt)],
                    ["Read map", `${plc.registerOffset} / ${plc.registerCount}`],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[1.2rem] bg-white/70 p-4">
                      <p className="eyebrow text-[7px] text-ink-soft/58">{label}</p>
                      <p className="mt-2 break-words text-sm text-forest">{value}</p>
                    </div>
                  ))}
                </div>

                {plc.lastErrorMessage ? <p className="mt-5 text-sm text-clay">{plc.lastErrorMessage}</p> : null}

                <form action={updateAction} className="mt-6 grid gap-4 border-t border-forest/10 pt-6">
                  <input type="hidden" name="plcId" value={plc.id} />
                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field name="name" label="PLC name" defaultValue={plc.name} className="block sm:col-span-3" />
                    <Field name="logoIp" label="LOGO IP" defaultValue={plc.logoIp} required className="block sm:col-span-2" />
                    <Field name="logoPort" label="Port" type="number" defaultValue={plc.logoPort} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-4">
                    <Field name="unitId" label="Unit ID" type="number" defaultValue={plc.unitId} />
                    <Field name="registerOffset" label="Register offset" type="number" defaultValue={plc.registerOffset} />
                    <Field name="registerCount" label="Register count" type="number" defaultValue={plc.registerCount} />
                    <Field name="readIntervalMs" label="Read ms" type="number" defaultValue={plc.readIntervalMs} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="block">
                      <span className="eyebrow text-[7px] text-ink-soft/58">Pump mode</span>
                      <select name="pumpWriteMode" defaultValue={plc.pumpWriteMode} className={inputClass}>
                        <option value="coil">Coil</option>
                        <option value="register">Register</option>
                      </select>
                    </label>
                    <Field name="pumpCoilAddress" label="Coil address" type="number" defaultValue={plc.pumpCoilAddress ?? undefined} />
                    <Field name="pumpRegisterAddress" label="Register address" type="number" defaultValue={plc.pumpRegisterAddress ?? undefined} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field name="pumpRegisterOnValue" label="Register ON value" type="number" defaultValue={plc.pumpRegisterOnValue} />
                    <Field name="pumpRegisterOffValue" label="Register OFF value" type="number" defaultValue={plc.pumpRegisterOffValue} />
                  </div>
                  <button disabled={updatePending} className={`atlas-button justify-self-start ${smallButtonClass}`}>
                    {updatePending ? "Saving..." : "Save PLC settings"}
                  </button>
                </form>

                <div className="mt-6 flex flex-wrap gap-3">
                  <form action={tokenAction}>
                    <input type="hidden" name="plcId" value={plc.id} />
                    <button disabled={tokenPending} className={`atlas-button ${smallButtonClass}`}>
                      Regenerate token
                    </button>
                  </form>
                  <form action={revokeAction}>
                    <input type="hidden" name="plcId" value={plc.id} />
                    <button disabled={revokePending} className={`border border-clay/30 bg-white/80 text-clay ${smallButtonClass}`}>
                      Revoke tokens
                    </button>
                  </form>
                  <form
                    action={deleteAction}
                    onSubmit={(event) => {
                      if (!confirm(`Delete ${plc.name}?`)) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <input type="hidden" name="plcId" value={plc.id} />
                    <button disabled={deletePending} className={`border border-clay/40 bg-clay/10 text-clay ${smallButtonClass}`}>
                      Delete PLC
                    </button>
                  </form>
                </div>
              </motion.section>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
