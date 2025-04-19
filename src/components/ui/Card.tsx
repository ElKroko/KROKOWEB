"use client";

import { ReactNode } from "react";
import Link from "next/link";

type CardProps = {
  title: string;
  description?: string;
  link?: string;
  children?: ReactNode;
  className?: string;
};

export default function Card({
  title,
  description,
  link,
  children,
  className = "",
}: CardProps) {
  const cardContent = (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {description && <p className="mb-4 text-gray-300">{description}</p>}
      {children}
    </div>
  );

  // If we have children AND a link, don't wrap in Link
  // This avoids the nested <a> tags problem
  if (link && !children) {
    return (
      <div className={`bg-dark-card rounded-lg shadow-md overflow-hidden ${className}`}>
        <Link href={link} className="block">
          {cardContent}
        </Link>
      </div>
    );
  }

  // Otherwise just render the card
  return (
    <div className={`bg-dark-card rounded-lg shadow-md overflow-hidden ${className}`}>
      {cardContent}
    </div>
  );
}