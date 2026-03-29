export const dynamic = "force-dynamic";

const backendBaseUrl = process.env.LOGO_BACKEND_URL ?? "http://127.0.0.1:4000";

async function proxyToBackend(request: Request, init?: RequestInit) {
	try {
		const response = await fetch(new URL("/api/pump", backendBaseUrl), {
			...init,
			cache: "no-store",
			headers: {
				"Content-Type": "application/json",
				...(init?.headers ?? {}),
			},
			body: init?.body,
			method: init?.method ?? request.method,
		});

		return new Response(await response.text(), {
			status: response.status,
			headers: {
				"Content-Type": response.headers.get("content-type") ?? "application/json",
			},
		});
	} catch (error) {
		return Response.json(
			{
				ok: false,
				message:
					error instanceof Error
						? `Pump backend is unavailable: ${error.message}`
						: "Pump backend is unavailable.",
			},
			{ status: 502 }
		);
	}
}

export async function GET(request: Request) {
	return proxyToBackend(request);
}

export async function POST(request: Request) {
	const body = await request.text();

	return proxyToBackend(request, {
		method: "POST",
		body,
	});
}
