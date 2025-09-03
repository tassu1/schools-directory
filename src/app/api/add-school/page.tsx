"use client";

import { useForm } from "react-hook-form";
import { useState, useRef } from "react";
import Link from "next/link";

type SchoolForm = {
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email: string;
  image: string;
};

export default function AddSchoolPage() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SchoolForm>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data: SchoolForm) => {
    setIsSubmitting(true);
    try {
      // Create FormData to handle file upload
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("state", data.state);
      formData.append("contact", data.contact);
      formData.append("email", data.email);
      
      // Get the file from the file input
      const fileInput = fileInputRef.current;
      if (fileInput && fileInput.files && fileInput.files[0]) {
        formData.append("imageFile", fileInput.files[0]);
      }
      
      // Send the image path as text
      formData.append("image", data.image);

      const res = await fetch("/api/addschool", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      console.log(result);

      if (result.success) {
        alert("School added successfully!");
        reset();
        setImagePreview(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      } else {
        alert(`Error: ${result.message || result.error}`);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header with Schools Directory Button on LEFT */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <Link 
            href="/"
            className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors order-2 sm:order-1"
          >
            ← Schools Directory
          </Link>
          
          <div className="order-1 sm:order-2 text-center sm:text-right">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Add New School
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Register a new educational institution</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {/* Form Header */}
          <div className="bg-gray-800 p-6 text-white">
            <h2 className="text-xl font-semibold">School Information</h2>
            <p className="mt-1 text-gray-300">Fill in all the required details</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    School Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter school name"
                    {...register("name", { required: "School name is required" })}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter full address"
                    {...register("address", { required: "Address is required" })}
                  />
                  {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter city"
                    {...register("city", { required: "City is required" })}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter state"
                    {...register("state", { required: "State is required" })}
                  />
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>}
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Contact Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 ${
                      errors.contact ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter contact number"
                    {...register("contact", { required: "Contact number is required" })}
                  />
                  {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500 ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter email address"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email address"
                      }
                    })}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Image URL (Optional)
                  </label>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 placeholder-gray-500"
                    placeholder="Paste image URL"
                    {...register("image")}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2">
                    Or Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
                
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-800 mb-2">Image Preview</p>
                    <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col-reverse sm:flex-row justify-end pt-6 gap-4">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setImagePreview(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-800  text-white font-medium rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Processing...
                  </>
                ) : (
                  "Add School"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}