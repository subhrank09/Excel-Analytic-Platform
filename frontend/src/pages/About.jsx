import React from "react";
import { FaChartBar, FaRobot, FaUserShield, FaUsers } from "react-icons/fa";

const About = () => (
  <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-100 px-4 py-8 flex flex-col items-center">
    {/* Hero Section */}
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center mb-8 animate-fadein">
      <div className="bg-indigo-100 rounded-full p-4 mb-4 shadow-lg">
        <FaChartBar className="text-indigo-600 text-4xl" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-gray-900">About ExcelAnalytics</h1>
      <p className="text-gray-700 text-lg mb-4 max-w-xl">
        ExcelAnalytics empowers you to transform your Excel data into actionable insights with beautiful charts, AI-powered analytics, and secure cloud storage. Our mission is to make advanced analytics accessible, secure, and simple for everyone.
      </p>
    </div>
    {/* Why ExcelAnalytics */}
    <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-10 mb-8 animate-fadein-up">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">Why ExcelAnalytics?</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-sm">AI Insights</span>
        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold text-sm">Secure & Private</span>
        <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-semibold text-sm">Dynamic Charts</span>
        <span className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full font-semibold text-sm">User Friendly</span>
        <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-semibold text-sm">Customizable</span>
      </div>
    </div>
    {/* Team/Values Section */}
    <div className="w-full max-w-3xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl shadow p-6 md:p-10 text-center animate-fadein-up">
      <div className="flex flex-col items-center mb-4">
        <FaUsers className="text-3xl text-indigo-500 mb-2" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Our Values</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <FaRobot className="mx-auto text-2xl text-purple-500 mb-2" />
          <div className="font-semibold text-gray-700">Innovation</div>
          <div className="text-xs text-gray-500">We leverage AI and the latest tech to deliver smart analytics.</div>
        </div>
        <div>
          <FaUserShield className="mx-auto text-2xl text-green-600 mb-2" />
          <div className="font-semibold text-gray-700">Security</div>
          <div className="text-xs text-gray-500">Your data privacy and security are our top priorities.</div>
        </div>
        <div>
          <FaChartBar className="mx-auto text-2xl text-indigo-600 mb-2" />
          <div className="font-semibold text-gray-700">Simplicity</div>
          <div className="text-xs text-gray-500">We believe analytics should be easy and accessible for all.</div>
        </div>
      </div>
    </div>
  </div>
);

export default About; 