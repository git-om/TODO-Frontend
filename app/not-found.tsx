"use client";

export default function NotFound() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-600 mb-4">404 - Page Not Found</h1>
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-red-600 border-opacity-75"></div>
        </div>
    );
}
