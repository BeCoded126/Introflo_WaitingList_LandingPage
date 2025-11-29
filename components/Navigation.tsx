"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  // Check if user is on authenticated routes
  const isAuthenticated = pathname?.startsWith("/app/");

  const publicLinks = [
    { href: "/auth_disabled/signin", label: "Sign In" },
    { href: "/auth_disabled/signup", label: "Sign Up" },
  ];

  return (
    <nav className="main-nav">
      <div className="nav-content">
        <div className="nav-brand-center">
          <Link href="/" className="brand-link">
            <svg
              className="brand-logo-nav"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Gradient background */}
              <rect
                width="64"
                height="64"
                rx="12"
                fill="url(#logo-bg-gradient)"
              />

              {/* House outline */}
              <path
                d="M32 18L20 28V46H28V38H36V46H44V28L32 18Z"
                fill="white"
                stroke="white"
                strokeWidth="1"
              />

              {/* Heart inside house */}
              <path
                d="M32 34C30.5 32.5 28 31 28 29C28 27.5 29 27 30 27C31 27 31.5 27.5 32 28C32.5 27.5 33 27 34 27C35 27 36 27.5 36 29C36 31 33.5 32.5 32 34Z"
                fill="#FF655C"
              />

              <defs>
                <linearGradient
                  id="logo-bg-gradient"
                  x1="0"
                  y1="0"
                  x2="64"
                  y2="64"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#FF8A65" />
                  <stop offset="0.5" stopColor="#FFB74D" />
                  <stop offset="1" stopColor="#4DB6AC" />
                </linearGradient>
              </defs>
            </svg>
            <h1 className="brand-wordmark-nav">introflo.io</h1>
          </Link>
        </div>
        <div className="nav-links-right">
          {isAuthenticated ? (
            <Link href="/auth_disabled/signout" className="nav-link">
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
