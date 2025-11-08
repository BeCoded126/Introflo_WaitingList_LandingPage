"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  // Check if user is on authenticated routes
  const isAuthenticated = pathname?.startsWith("/app/");

  const publicLinks = [{ href: "/auth/signin", label: "Sign In" }];

  return (
    <nav className="main-nav">
      <div className="nav-content">
        <div className="nav-brand-center">
          <Link href="/" className="brand-link" aria-label="IntroFlo Home">
            <svg
              className="brand-logo-nav"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect width="64" height="64" rx="14" fill="#ff655c" />
              <path
                d="M32 18L20 28V46H28V38H36V46H44V28L32 18Z"
                fill="white"
                stroke="white"
                strokeWidth="1"
              />
              <path
                d="M32 34C30.5 32.5 28 31 28 29C28 27.5 29 27 30 27C31 27 31.5 27.5 32 28C32.5 27.5 33 27 34 27C35 27 36 27.5 36 29C36 31 33.5 32.5 32 34Z"
                fill="#44bc0c"
              />
            </svg>
            <h1 className="brand-wordmark-nav">introflo.io</h1>
          </Link>
        </div>
        <div className="nav-links-right">
          {isAuthenticated ? (
            <Link href="/auth/signout" className="nav-link">
              Log Out
            </Link>
          ) : (
            publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  pathname === link.href ? "nav-link active" : "nav-link"
                }
              >
                {link.label}
              </Link>
            ))
          )}
        </div>
      </div>
    </nav>
  );
}
