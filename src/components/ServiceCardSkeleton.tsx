"use client";

const ServiceCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-pulse h-full flex flex-col">
    <div className="relative overflow-hidden h-36 sm:h-40 md:h-48 bg-gray-200">
      <div className="absolute top-2 left-2 w-16 h-5 rounded-full bg-gray-300/70" />
      <div className="absolute top-2 right-2 w-12 h-5 rounded-full bg-gray-300/70" />
    </div>
    <div className="p-3 sm:p-4 flex flex-col flex-grow">
      <div className="mb-2 h-5 w-2/3 rounded bg-gray-300" />
      <div className="mb-3 h-3 w-full rounded bg-gray-200" />
      <div className="mb-4 h-3 w-1/2 rounded bg-gray-200" />
      <div className="flex gap-2 mt-auto">
        <div className="flex-1 h-9 rounded-lg bg-gray-300" />
        <div className="h-9 w-9 rounded-lg bg-gray-300" />
      </div>
    </div>
  </div>
);

export default ServiceCardSkeleton;
