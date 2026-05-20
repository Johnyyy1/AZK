import { NextResponse, type NextRequest } from "next/server";

const sessionCookieNames = new Set([
	"better-auth.session_token",
	"__Secure-better-auth.session_token",
]);

export function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const hasSessionCookie = request.cookies.getAll().some((cookie) => sessionCookieNames.has(cookie.name));

	if (pathname.startsWith("/dashboard") && !hasSessionCookie) {
		const url = request.nextUrl.clone();
		url.pathname = "/auth";
		url.searchParams.set("next", pathname);
		return NextResponse.redirect(url);
	}

	if (pathname === "/auth" && hasSessionCookie) {
		return NextResponse.redirect(new URL("/dashboard", request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/dashboard/:path*", "/auth"],
};
