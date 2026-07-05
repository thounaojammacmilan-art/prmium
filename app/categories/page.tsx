"use client";

import Link from "next/link";
import { Grid3X3 } from "lucide-react";
import { VIDEO_CATEGORIES } from "@/lib/constants";

const categoryGradients = [
  "from-red-500/20 to-orange-500/20",
  "from-blue-500/20 to-cyan-500/20",
  "from-green-500/20 to-emerald-500/20",
  "from-purple-500/20 to-pink-500/20",
  "from-yellow-500/20 to-orange-500/20",
  "from-indigo-500/20 to-blue-500/20",
  "from-pink-500/20 to-rose-500/20",
  "from-teal-500/20 to-cyan-500/20",
];

export default function CategoriesPage() {
  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
          <Grid3X3 className="h-5 w-5 text-purple-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-muted-foreground">
            Browse videos by category
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {VIDEO_CATEGORIES.map((category, i) => (
          <Link
            key={category.id}
            href={`/categories/${category.id}`}
            className={`group rounded-2xl border bg-gradient-to-br ${categoryGradients[i % categoryGradients.length]} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
          >
            <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
              {category.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Browse videos in this category
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
