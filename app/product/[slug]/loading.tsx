import React from "react";

export default function ProductLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="h-4 w-40 bg-neutral-900 rounded-sm" />

      {/* 2-Column Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Gallery Skeleton */}
        <div className="flex flex-col-reverse lg:flex-row gap-4 items-start">
          <div className="hidden lg:flex flex-col space-y-3 w-20">
            <div className="aspect-square w-full bg-neutral-900 rounded-sm" />
            <div className="aspect-square w-full bg-neutral-900 rounded-sm" />
            <div className="aspect-square w-full bg-neutral-900 rounded-sm" />
          </div>
          <div className="aspect-square w-full bg-neutral-900 rounded-sm" />
        </div>

        {/* Configurator Skeleton */}
        <div className="space-y-8">
          <div className="space-y-3">
            <div className="h-4 w-28 bg-neutral-900 rounded-sm" />
            <div className="h-10 w-3/4 bg-neutral-900 rounded-sm" />
            <div className="h-8 w-44 bg-neutral-900 rounded-sm" />
          </div>

          <div className="h-20 w-full bg-neutral-900 rounded-sm" />

          {/* Metal Selectors Skeleton */}
          <div className="space-y-3">
            <div className="h-4 w-32 bg-neutral-900 rounded-sm" />
            <div className="grid grid-cols-4 gap-2">
              <div className="h-12 bg-neutral-900 rounded-sm" />
              <div className="h-12 bg-neutral-900 rounded-sm" />
              <div className="h-12 bg-neutral-900 rounded-sm" />
              <div className="h-12 bg-neutral-900 rounded-sm" />
            </div>
          </div>

          {/* Button Skeleton */}
          <div className="h-14 w-full bg-neutral-900 rounded-sm" />
        </div>
      </div>
    </div>
  );
}
