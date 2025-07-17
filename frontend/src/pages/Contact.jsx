import React, { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCheckCircle, FaTwitter, FaLinkedin, FaGithub } from "react-icons/fa";
import axios from "../api/axios";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("/contact", form);
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 px-4 py-8 flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center mb-8 animate-fadein">
        <div className="bg-blue-100 rounded-full p-4 mb-4 shadow-lg">
          <FaEnvelope className="text-blue-600 text-4xl" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-gray-900">Contact Us</h1>
        <p className="text-gray-700 text-lg mb-4 max-w-lg">
          Have a question, feedback, or need support? Fill out the form below or reach out to us directly.
        </p>
      </div>
      {/* Contact Info */}
      <div className="w-full max-w-3xl mx-auto grid md:grid-cols-2 gap-8 mb-8 animate-fadein-up">
        <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 justify-center">
          <div className="flex items-center gap-3 text-gray-700"><FaEnvelope className="text-blue-500" /> subhrankpriya@gmail.com</div>
          <div className="flex items-center gap-3 text-gray-700"><FaPhone className="text-green-500" /> +1 (555) 123-4567</div>
          <div className="flex items-center gap-3 text-gray-700"><FaMapMarkerAlt className="text-pink-500" /> India, IN 10001</div>
          <div className="flex gap-4 mt-2">
            <a href="#" className="text-blue-500 hover:text-blue-700"><FaTwitter /></a>
            <a href="#" className="text-blue-700 hover:text-blue-900"><FaLinkedin /></a>
            <a href="#" className="text-gray-700 hover:text-black"><FaGithub /></a>
          </div>
        </div>
        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 flex flex-col justify-center animate-fadein-up">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FaCheckCircle className="text-green-500 text-5xl mb-2 animate-bounce" />
              <div className="text-green-700 font-semibold text-lg">Thank you for reaching out! We'll get back to you soon.</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent rounded"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent rounded"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent rounded"
              />
              {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-bold disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact; 