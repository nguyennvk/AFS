"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@components/header/Header";

export default function Register(){
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, phone, email, password, confirmPassword } = formData;

    if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
      return "All fields are required.";
    }

    if (!/^\d{10}$/.test(phone)) {
      return "Phone number must be 10 digits.";
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return "Invalid email format.";
    }

    if (password !== confirmPassword) {
        return "Passwords do not match.";
      }

    if (!validatePassword(password)) {
      return "Password must be at least 8 characters long, contain uppercase and lowercase letters, numbers, and special characters.";
    }


    return "";
  };

  function validatePassword(password: string) {

    return /[A-Z]/       .test(password) &&
           /[a-z]/       .test(password) &&
           /[0-9]/       .test(password) &&
           /[^A-Za-z0-9]/.test(password) &&
           password.length > 8;

}
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone_number: formData.phone,
            email: formData.email,
            password: formData.confirmPassword,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        console.log(result);
        setError(result.error);
        router.push("/register");
        return;
      }

      alert("Registration Successful!");
      router.push("/")
      setFormData({ firstName: "", lastName: "", phone: "", email: "", password: "", confirmPassword: "" });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Header />
      <div className="w-full max-w-md p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-md "
            />
          </div>

          <div>
            <label className="block font-medium">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>

          <div>
            <label className="block font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-md "
            />
          </div>

          <div>
            <label className="block font-medium">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full mt-1 p-2 border rounded-md "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white py-2 rounded-md transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

