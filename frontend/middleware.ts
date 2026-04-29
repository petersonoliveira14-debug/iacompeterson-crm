import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rotas públicas que devem funcionar em qualquer domínio sem prefixo /admin
const PUBLIC_PATHS = ["/proposta", "/cliente", "/auth", "/member", "/api"];

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  const isAdminSubdomain = hostname.startsWith("master.");
  const isMainDomain =
    hostname === "iacompeterson.com.br" ||
    hostname === "www.iacompeterson.com.br" ||
    hostname.startsWith("localhost") ||
    hostname.startsWith("127.");

  // Bloquear /admin no domínio principal → redirecionar para master.*
  if (isMainDomain && pathname.startsWith("/admin")) {
    return NextResponse.redirect(
      new URL(`https://master.iacompeterson.com.br${pathname}${request.nextUrl.search}`, request.url)
    );
  }

  if (isAdminSubdomain) {
    // Rotas públicas no subdomínio master → redirecionar para o domínio principal
    if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(
        new URL(`https://iacompeterson.com.br${pathname}${request.nextUrl.search}`, request.url)
      );
    }

    // Já está em /admin — deixa passar
    if (pathname.startsWith("/admin")) return NextResponse.next();

    // Raiz → reescreve para login admin
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/admin/login", request.url));
    }

    // Outros paths admin → prefixar com /admin
    return NextResponse.rewrite(new URL(`/admin${pathname}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logos/).*)"],
};
