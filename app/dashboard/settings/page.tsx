import SettingsClient, { type SettingsPlcRow } from "./SettingsClient";
import { getDashboardSettings } from "@/app/lib/plc-data";
import { requireSession } from "@/app/lib/session";

export default async function SettingsPage() {
  const session = await requireSession();
  const data = await getDashboardSettings(session.user.id);

  const plcs: SettingsPlcRow[] = data.plcs.map(({ plc, token, latestReading }) => ({
    id: plc.id,
    name: plc.name,
    model: plc.model,
    logoIp: plc.logoIp,
    logoPort: plc.logoPort,
    unitId: plc.unitId,
    readIntervalMs: plc.readIntervalMs,
    registerOffset: plc.registerOffset,
    registerCount: plc.registerCount,
    pumpWriteMode: plc.pumpWriteMode,
    pumpAddress: plc.pumpWriteMode === "coil" ? plc.pumpCoilAddress : plc.pumpRegisterAddress,
    lastHeartbeatAt: plc.lastHeartbeatAt?.toISOString() ?? null,
    lastReadingAt: plc.lastReadingAt?.toISOString() ?? null,
    lastErrorMessage: plc.lastErrorMessage,
    tokenPrefix: token?.tokenPrefix ?? null,
    tokenLastUsedAt: token?.lastUsedAt?.toISOString() ?? null,
    latestReadingValue: latestReading?.value ?? null,
  }));

  return (
    <SettingsClient
      user={{
        name: session.user.name,
        email: session.user.email,
      }}
      site={{
        name: data.site.name,
        role: data.role,
      }}
      plcs={plcs}
    />
  );
}
