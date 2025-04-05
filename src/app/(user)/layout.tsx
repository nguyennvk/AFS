"use client";
import AuthenticatedHeaderComponent from "@components/header/authenticatedHeaderComponent";

export default function BlogLayout({children}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative pt-16">
      <AuthenticatedHeaderComponent />
      {children}
    </div>
  )
}
