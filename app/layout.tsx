import "./globals.css";
import "../styles/components.css";
import React from "react";
import Navigation from "../components/Navigation";

export const metadata = {
  title: "introflo.io",
  description: "Smart intros for care teams.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <Navigation />
          <main className="main-content">{children}</main>
        </div>
      </body>
    </html>
  );
}
