"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
  const [user, setUser] = useState<{
    account_email: string;
    account_first_name: string;
    account_last_name: string;
    account_phone_number: string;
  } | null>(null);

  const router = useRouter();

  const fetchProfile = async () => {
    try {
      const user_data = await fetch("/api/user/getInfo", { credentials: "include" });

      if (!user_data.ok) {
        router.push("/home");
        return;
      }

      const user = await user_data.json();
      setUser(user);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  // Handle Save Button Click (You can integrate an API call to save changes)
  const handleSave = async () => {
    setIsEditing(false);

    // Example API call to save user data (uncomment & adjust accordingly)
    await fetch("/api/user/updateProfile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
      credentials: "include",
    });

    console.log("Updated User Data:", user);
  };

  if (loading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Error loading profile.</p>;
  if (!user) return <p className="text-center mt-10">No user data found.</p>;

  return (
    <div className="flex justify-center mt-12">
      <div className="p-6 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">User Profile</h1>
        
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">First Name</label>
            <input
              type="text"
              name="account_first_name"
              value={user.account_first_name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border rounded-lg ${isEditing ? "border-blue-500 bg-white text-black" : "border-gray-300 bg-gray-100 text-gray-700"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Last Name</label>
            <input
              type="text"
              name="account_last_name"
              value={user.account_last_name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border rounded-lg ${isEditing ? "border-blue-500 bg-white text-black" : "border-gray-300 bg-gray-100 text-gray-700"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              name="account_email"
              value={user.account_email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border rounded-lg ${isEditing ? "border-blue-500 bg-white text-black" : "border-gray-300 bg-gray-100 text-gray-700"}`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Phone Number</label>
            <input
              type="tel"
              name="account_phone_number"
              value={user.account_phone_number}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 border rounded-lg ${isEditing ? "border-blue-500 bg-white text-black" : "border-gray-300 bg-gray-100 text-gray-700"}`}
            />
          </div>

          {/* Button toggles between Edit & Save */}
          <button
            type="button"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className={`w-full mt-4 font-semibold py-3 rounded-lg transition cursor-pointer ${isEditing ? "bg-green-600 hover:bg-green-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
          >
            {isEditing ? "Save" : "Edit Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
