"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface School {
  id: string;
  auto: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email: string;
  image: string;
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch("/api/getschools");
        const result = await response.json();
        
        if (result.success) {
          setSchools(result.data);
        } else {
          setError(result.message || "Failed to fetch schools");
        }
      } catch (err) {
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchools();
  }, []);

  // Handle image loading errors
  const handleImageError = (imageUrl: string) => {
    setFailedImages(prev => new Set(prev).add(imageUrl));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 bg-gray-800  mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading schools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 p-4 rounded-full inline-flex items-center justify-center mb-4">
            <span className="text-2xl text-red-600">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Schools</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Schools Directory</h1>
            <p className="text-gray-600 mt-2">Discover all registered educational institutions</p>
          </div>
          <Link 
            href="/api/add-school"
            className="px-6 py-3 bg-gray-800  text-white font-medium rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            + Add New School
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <span className="text-blue-600 text-lg font-bold">🏫</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Schools</p>
                <p className="text-2xl font-bold text-gray-800">{schools.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-极 shadow-md">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <span className="text-green-600 text-lg font-bold">🏙️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cities</p>
                <p className="text-2xl font-bold text-gray-800">
                  {new Set(schools.map(school => school.city)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-md">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <span className="text-purple-600 text-lg font-bold">🗺️</span>
              </div>
              <div>
                <p className="text-sm text-gray-600">States</p>
                <p className="text-2xl font-bold text-gray-800">
                  {new Set(schools.map(school => school.state)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Schools Grid */}
        {schools.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-blue-600 text-2xl">🏫</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Schools Yet</h3>
            <p className="text-gray-600 mb-6">Get started by adding the first school to the directory</p>
            <Link 
              href="/api/add-school"
              className="px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center"
            >
              + Add Your First School
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools.map((school) => (
              <div key={school.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
                <div className="h-48 relative overflow-hidden">
                  {school.image && !failedImages.has(school.image) ? (
                    <img
                      src={school.image}
                      alt={school.name}
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(school.image)}
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {school.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{school.name}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <span className="text-gray-500 mr-2">📍</span>
                    <span className="text-sm">{school.city}, {school.state}</span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{school.address}</p>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <span className="text-gray-500 mr-2">📞</span>
                    <span className="text-sm">{school.contact}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <span className="text-gray-500 mr-2">📧</span>
                    <span className="text-sm truncate">{school.email}</span>
                  </div>
                  
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}