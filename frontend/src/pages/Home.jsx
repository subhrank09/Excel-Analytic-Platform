import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import analyticsAnimation from "../assets/home-analytics.json";
import animation1 from "../assets/animation1.json";
import animation2 from "../assets/animation2.json";
import animation3 from "../assets/animation3.json";
import animation4 from "../assets/animation4.json";
import { FaChartBar, FaCloudUploadAlt, FaRobot, FaUserShield, FaGlobe, FaCogs, FaUserTie, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ExcelAnalyticsLogo from "../assets/ExcelAnalyticsLogo.svg";
import { useState } from "react";

const features = [
  {
    icon: <FaCloudUploadAlt className="text-blue-600 text-3xl" />,
    title: "Easy File Upload",
    desc: "Drag & drop Excel files (.xls, .xlsx) with instant processing and validation.",
  },
  {
    icon: <FaChartBar className="text-indigo-600 text-3xl" />,
    title: "Dynamic Charts",
    desc: "Generate 2D/3D charts automatically with customizable styling and interactions.",
  },
  {
    icon: <FaRobot className="text-purple-600 text-3xl" />,
    title: "AI Insights",
    desc: "Get instant, AI-powered insights and summaries from your data using OpenAI.",
  },
  {
    icon: <FaUserShield className="text-green-600 text-3xl" />,
    title: "Secure & Private",
    desc: "Your data is encrypted and privacy is our top priority.",
  },
  {
    icon: <FaGlobe className="text-pink-600 text-3xl" />,
    title: "Multilingual Support",
    desc: "Switch between languages for a global user experience.",
  },
  {
    icon: <FaCogs className="text-yellow-600 text-3xl" />,
    title: "Customizable Settings",
    desc: "Personalize your dashboard, notifications, and more.",
  },
  {
    icon: <FaUserShield className="text-gray-700 text-3xl" />,
    title: "Admin & User Management",
    desc: "Advanced admin panel for user, upload, and analytics management.",
  },
  {
    icon: <FaUserTie className="text-gray-700 text-3xl" />,
    title: "Professional Support",
    desc: "Get help from our expert team anytime you need it.",
  },
];

const demoSteps = [
  {
    title: "Upload Your Excel File",
    desc: "Easily drag & drop or select your Excel file (.xls, .xlsx) to get started. Our platform instantly processes your data.",
    animation: animation1,
  },
  {
    title: "Visualize with Dynamic Charts",
    desc: "Choose from 2D/3D charts and see your data come alive with interactive, customizable visualizations.",
    animation: animation2,
  },
  {
    title: "Get AI-Powered Insights",
    desc: "Let our AI analyze your data and provide instant, actionable insights and summaries.",
    animation: animation3,
  },
  {
    title: "Secure & Private",
    desc: "Your data is encrypted and privacy is our top priority. Only you can access your files and results.",
    animation: animation4,
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-blue-50 to-indigo-100 text-gray-900 relative overflow-hidden">
      {/* Demo Modal */}
      {showDemo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative animate-fadein-up">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl"
              onClick={() => setShowDemo(false)}
              aria-label="Close"
            >
              <FaTimes />
            </button>
            <div className="flex flex-col items-center text-center">
              <Lottie animationData={demoSteps[demoStep].animation} loop={true} className="w-32 h-32 mx-auto mb-2" />
              <h2 className="text-xl font-bold mb-1 text-indigo-700">{demoSteps[demoStep].title}</h2>
              <p className="text-gray-600 mb-4 text-sm">{demoSteps[demoStep].desc}</p>
              <div className="flex items-center justify-center gap-2 mb-4">
                {demoSteps.map((_, idx) => (
                  <span key={idx} className={`w-2 h-2 rounded-full ${idx === demoStep ? 'bg-indigo-600' : 'bg-gray-300'} transition-all`}></span>
                ))}
              </div>
              <div className="flex justify-between w-full mt-2">
                <button
                  className="px-3 py-1 rounded bg-gray-100 text-gray-700 font-semibold flex items-center gap-1 disabled:opacity-50"
                  onClick={() => setDemoStep((s) => Math.max(0, s - 1))}
                  disabled={demoStep === 0}
                >
                  <FaChevronLeft /> Back
                </button>
                <button
                  className="px-3 py-1 rounded bg-indigo-600 text-white font-semibold flex items-center gap-1 disabled:opacity-50"
                  onClick={() => demoStep === demoSteps.length - 1 ? setShowDemo(false) : setDemoStep((s) => Math.min(demoSteps.length - 1, s + 1))}
                >
                  {demoStep === demoSteps.length - 1 ? 'Finish' : <>Next <FaChevronRight /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Navbar */}
      <header className="flex justify-between items-center px-6 py-4 shadow bg-white sticky top-0 z-10">
        <div className="flex items-center space-x-3">
          <img src={ExcelAnalyticsLogo} alt="Excel Analytics Logo" className="h-9 w-9" />
          <h1 className="text-2xl font-bold text-black">ExcelAnalytics</h1>
        </div>
        <nav className="flex items-center gap-6 text-base font-medium">
          <button onClick={() => navigate("/")} className="hover:text-blue-700 transition">Home</button>
          <button onClick={() => window.scrollTo({top: 600, behavior: 'smooth'})} className="hover:text-blue-700 transition">Features</button>
          <button onClick={() => navigate("/about") } className="hover:text-blue-700 transition">About</button>
          <button onClick={() => navigate("/contact") } className="hover:text-blue-700 transition">Contact</button>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/login")} className="px-4 py-2 border border-gray-300 rounded-md font-semibold hover:bg-gray-100 transition">Sign In</button>
          <button onClick={() => navigate("/register")} className="px-4 py-2 bg-gray-900 text-white rounded-md font-semibold hover:bg-gray-800 transition">Get Started</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-16 gap-10 bg-gradient-to-br from-white via-blue-50 to-indigo-100 w-full">
        <div className="max-w-xl space-y-6">
          <h2 className="text-5xl font-extrabold leading-tight mb-2 text-black">
            Transform Excel Data into <span className="text-indigo-600">Smart Visuals</span> & <span className="text-purple-600">AI Insights</span>
          </h2>
          <p className="text-lg text-gray-700">
            Upload. Analyze. Visualize. Let our system turn your spreadsheets into powerful dashboards and intelligent insights.
          </p>
          <div className="flex gap-4 mt-8">
            <button onClick={() => navigate("/dashboard")}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg font-bold text-lg shadow hover:bg-gray-800 transition">
              Start Analyzing
            </button>
            <button
              className="px-6 py-3 bg-white border border-gray-300 text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition"
              onClick={() => { setShowDemo(true); setDemoStep(0); }}
            >
              Watch Demo
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center">
          <Lottie animationData={analyticsAnimation} loop={true} className="max-w-md w-full" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <h3 className="text-3xl md:text-4xl font-bold text-center text-black mb-4">Powerful Features for Excel Analytics</h3>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Everything you need to transform your Excel data into actionable insights. Professional tools designed for businesses of all sizes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md p-8 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 border border-gray-100"
            >
              {feature.icon}
              <h4 className="mt-4 text-xl font-bold text-gray-900">{feature.title}</h4>
              <p className="mt-2 text-gray-600 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;