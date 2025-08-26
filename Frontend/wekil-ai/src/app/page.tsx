"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaUser,
  FaBuilding,
  FaArrowRight,
  FaFileContract,
  FaLock,
  FaSync,
  FaShieldAlt,
  FaTimes,
  FaChevronDown,
  FaHandshake,
  FaUsers,
  FaChartLine,
  FaLightbulb,
} from "react-icons/fa";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoginPage from "./auth/login/page";
import SignupPage from "./auth/signup/page";

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [activeSection, setActiveSection] = useState("hero");

  const sectionRefs = {
    hero: useRef<HTMLElement>(null),
    features: useRef<HTMLElement>(null),
    howItWorks: useRef<HTMLElement>(null),
    pricing: useRef<HTMLElement>(null),
    faq: useRef<HTMLElement>(null),
    testimonials: useRef<HTMLElement>(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;

      Object.entries(sectionRefs).forEach(([section, ref]) => {
        if (ref.current) {
          const offsetTop = ref.current.offsetTop;
          const height = ref.current.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + height
          ) {
            setActiveSection(section);
          }
        }
      });
    };

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-visible");
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll(".animate-on-scroll");
    animatedElements.forEach((el) => observer.observe(el));

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  });

  const handleLoginClick = () => {
    setAuthMode("login");
    setShowAuthModal(true);
    document.body.style.overflow = "hidden";
  };

  const handleSignupClick = () => {
    setAuthMode("signup");
    setShowAuthModal(true);
    document.body.style.overflow = "hidden";
  };

  const handleAuthComplete = (email: string) => {
    setShowAuthModal(false);
    document.body.style.overflow = "unset";
    console.log(`Auth completed for ${email}`);
  };

  const handleBackToLogin = () => {
    setAuthMode("login");
  };

  const closeModal = () => {
    setShowAuthModal(false);
    document.body.style.overflow = "unset";
  };

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      <Header
        activeSection={activeSection}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onScrollToSection={scrollToSection}
      />

      <section
        id="hero"
        ref={sectionRefs.hero}
        className="min-h-screen pt-32 pb-20 px-4 flex items-center"
      >
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight animate-fade-in-up">
              Create <span className="text-blue-600">Informal Agreements</span>{" "}
              in Seconds
            </h1>
            <p className="text-xl text-gray-600 mb-8 animate-fade-in-up delay-100">
              Wekil AI helps Ethiopian freelancers and small business owners
              generate clear, simple agreements using artificial intelligence.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in-up delay-200">
              <button
                onClick={handleSignupClick}
                className="bg-blue-600 text-white px-8 cursor-pointer py-4 rounded-lg font-medium hover:bg-blue-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                Get Started Free <FaArrowRight className="ml-2" />
              </button>
              <button
                onClick={handleLoginClick}
                className="border border-blue-600 cursor-pointer text-blue-600 px-8 py-4 rounded-lg font-medium hover:bg-blue-50 transition-all transform hover:-translate-y-1 flex items-center justify-center"
              >
                Existing Account
              </button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center animate-fade-in-up delay-300">
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-200 rounded-2xl transform rotate-3 opacity-70 animate-pulse"></div>
              <div className="relative bg-white p-6 rounded-2xl shadow-xl transform -rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="bg-blue-100 p-4 rounded-lg mb-4">
                  <p className="text-gray-700">
                    &quot;I will design a website for 15,000 birr within 2
                    weeks&quot;
                  </p>
                </div>
                <div className="flex items-center justify-center py-2">
                  <div className="animate-bounce">
                    <FaSync className="text-blue-500 text-xl" />
                  </div>
                </div>
                <div className="bg-green-100 p-4 rounded-lg mt-4">
                  <h3 className="font-semibold text-gray-800">
                    Generated Agreement Includes:
                  </h3>
                  <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
                    <li>Parties involved</li>
                    <li>Service description</li>
                    <li>Payment amount (15,000 ETB)</li>
                    <li>Timeline (2 weeks)</li>
                    <li>Disclaimer clause</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <button
            onClick={() => scrollToSection("features")}
            className="text-blue-600 hover:text-blue-800"
          >
            <FaChevronDown className="text-2xl" />
          </button>
        </div>
      </section>

      <section
        id="features"
        ref={sectionRefs.features}
        className="py-20 bg-white px-4"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
              Wekil AI is designed specifically for the Ethiopian market with
              features that make agreement creation simple and secure.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaFileContract,
                title: "AI-Powered Generation",
                desc: "Our advanced AI understands Amharic and English to create clear agreements from simple descriptions.",
                color: "blue",
              },
              {
                icon: FaLock,
                title: "Secure Signing",
                desc: "Digital signatures and secure storage ensure your agreements are protected and easily accessible.",
                color: "green",
              },
              {
                icon: FaShieldAlt,
                title: "Legal Disclaimer",
                desc: "Every agreement includes appropriate disclaimers to ensure users understand the informal nature.",
                color: "purple",
              },
              {
                icon: FaSync,
                title: "Easy Editing",
                desc: "Modify generated agreements before signing to ensure they perfectly match your needs.",
                color: "orange",
              },
              {
                icon: FaUser,
                title: "Dual Account Types",
                desc: "Support for both individual freelancers and organizations with appropriate verification.",
                color: "red",
              },
              {
                icon: FaBuilding,
                title: "Export & Share",
                desc: "Download agreements as PDF or DOCX files, or share them directly via email.",
                color: "indigo",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl border border-gray-100 hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-on-scroll opacity-0 translate-y-10"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`bg-${feature.color}-100 w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110`}
                >
                  <feature.icon
                    className={`text-${feature.color}-600 text-2xl transition-transform duration-500 group-hover:scale-110`}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        ref={sectionRefs.howItWorks}
        className="py-20 bg-gray-50 px-20"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              How Wekil AI Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
              Creating an agreement has never been easier. Just follow these
              simple steps.
            </p>
          </div>

          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 items-center">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-full w-1 bg-blue-200"></div>
                </div>
                <ul className="relative space-y-12">
                  {[
                    {
                      step: "1",
                      title: "Describe Your Agreement",
                      desc: "Simply type or say what you're agreeing to in plain English or Amharic.",
                    },
                    {
                      step: "2",
                      title: "AI Generates Document",
                      desc: "Our AI processes your input and creates a structured agreement.",
                    },
                    {
                      step: "3",
                      title: "Review & Customize",
                      desc: "Check the generated agreement and make any necessary changes.",
                    },
                    {
                      step: "4",
                      title: "Sign & Share",
                      desc: "Both parties sign digitally and download or share the final agreement.",
                    },
                  ].map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start animate-on-scroll opacity-0 -translate-x-10 transition-all duration-700"
                      style={{ transitionDelay: `${index * 200}ms` }}
                    >
                      <div className="bg-blue-600 text-white rounded-full h-12 w-12 flex items-center justify-center font-bold text-xl mr-4 flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex-1 animate-on-scroll opacity-0 translate-x-10 transition-all duration-700 delay-300">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-500">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    See It In Action
                  </h3>
                  <p className="text-gray-600">
                    Watch how Wekil AI transforms simple descriptions into clear
                    agreements.
                  </p>
                </div>
                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 opacity-70"></div>
                  <div className="relative z-10 text-white text-center p-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaHandshake className="text-2xl" />
                    </div>
                    <p className="text-lg font-semibold">
                      Agreement Generation Demo
                    </p>
                    <button className="mt-4 bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                      Watch Video
                    </button>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    See real examples of agreements created with Wekil AI in our{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      demo gallery
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="testimonials"
        ref={sectionRefs.testimonials}
        className="py-20 bg-white px-4"
      >
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
              Join thousands of Ethiopian freelancers and businesses who trust
              Wekil AI.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Selam T.",
                role: "Freelance Designer",
                content:
                  "Wekil AI has saved me so much time. I used to spend hours drafting agreements, now it takes minutes!",
                delay: 0,
              },
              {
                name: "Michael K.",
                role: "Small Business Owner",
                content:
                  "The Amharic support is a game-changer. Finally, a tool that understands our local context.",
                delay: 100,
              },
              {
                name: "Amina J.",
                role: "Software Developer",
                content:
                  "The peace of mind from having clear agreements is priceless. My client relationships have improved significantly.",
                delay: 200,
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-500 animate-on-scroll opacity-0 translate-y-10"
                style={{ transitionDelay: `${testimonial.delay}ms` }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                    <FaUsers className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {testimonial.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700">
                  &quot;{testimonial.content}&quot;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              {
                number: "10,000+",
                label: "Agreements Created",
                icon: FaFileContract,
              },
              { number: "95%", label: "User Satisfaction", icon: FaChartLine },
              { number: "2,500+", label: "Active Users", icon: FaUsers },
              {
                number: "5min",
                label: "Average Time Saved",
                icon: FaLightbulb,
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-700"
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <stat.icon className="text-3xl mx-auto mb-4 text-blue-200" />
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6 animate-on-scroll opacity-0 translate-y-10 transition-all duration-700">
            Ready to Simplify Your Agreements?
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto animate-on-scroll opacity-0 translate-y-10 transition-all duration-700 delay-100">
            Join thousands of Ethiopian freelancers and small business owners
            using Wekil AI to create clear, informal agreements.
          </p>
          <button
            onClick={handleSignupClick}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg mt-6 cursor-pointer font-semibold hover:bg-blue-50 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl animate-pulse"
          >
            Create Your Free Account
          </button>
        </div>
      </section>

      <Footer />

      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 cursor-pointer bg-black/30 backdrop-blur-sm transition-opacity duration-300"
            onClick={closeModal}
          ></div>

          <div className="relative rounded-2xl max-w-sm w-full transform transition-all duration-500 scale-95 animate-scale-in">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 cursor-pointer text-gray-500 hover:text-gray-700 bg-white/80 rounded-full p-1 backdrop-blur-sm"
            >
              <FaTimes className="text-xl" />
            </button>
            {authMode === "login" ? (
              <LoginPage
                onLoginComplete={handleAuthComplete}
                onSwitchToSignup={() => setAuthMode("signup")}
              />
            ) : (
              <SignupPage onBackToLogin={handleBackToLogin} />
            )}
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fadeInRight 0.6s ease-out forwards;
        }

        .animate-fade-in-left {
          animation: fadeInLeft 0.6s ease-out forwards;
        }

        .animate-scale-in {
          animation: scaleIn 0.3s ease-out forwards;
        }

        .delay-100 {
          animation-delay: 0.1s;
        }

        .delay-200 {
          animation-delay: 0.2s;
        }

        .delay-300 {
          animation-delay: 0.3s;
        }

        .animate-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
          transform: translateX(0) !important;
        }

        .animate-on-scroll {
          opacity: 0;
          transition: all 0.7s ease-out;
        }
      `}</style>
    </div>
  );
}
