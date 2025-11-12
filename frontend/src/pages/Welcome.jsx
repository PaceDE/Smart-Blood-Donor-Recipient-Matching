import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner, faDroplet, faSuitcaseMedical } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import {
  Heart,
  Users,
  MapPin,
  Clock,
  ArrowRight,
  Play,
  CheckCircle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import Footer from "../component/Footer";
import { useAppTracking } from "../component/AppTrackingContext";


const features = [
  {
    icon: Users,
    title: "Smart Matching",
    description:
      "AI-powered algorithm matches donors with recipients based on blood type, location, and history.",
  },
  {
    icon: MapPin,
    title: "Location-Based",
    description:
      "Find donors near your area.",
  },
  {
    icon: Clock,
    title: "24/7 Emergency",
    description:
      "Round-the-clock emergency blood request system for critical situations.",
  },
];

const steps = [
  {
    step: "01",
    title: "Register & Verify",
    description:
      "Create your profile with medical information and location details",
    icon: Users,
  },
  {
    step: "02",
    title: "Get Matched",
    description:
      "Our algorithm finds compatible donors for the blood requests",
    icon: Heart,
  },
  {
    step: "03",
    title: "Save Lives",
    description:
      "Connect, coordinate, and complete the life-saving donation process",
    icon: CheckCircle,
  },
]



export default function Welcome() {
  const location = useLocation();
  const { stats, loading } = useAppTracking();
  const statistics = [
    {
      icon: faUser, value: stats?.totalUsers || 0, label: "Total registered users"
    },
    {
      icon: faDroplet, value: stats?.totalRequests || 0, label: "Total Requests"
    },
    {
      icon: faSuitcaseMedical, value: stats?.totalDonations || 0, label: "Total Donations made"
    }
  ]

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.slice(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        if (location.hash === "#watch-demo" || location.hash === "#become-a-member")
          element.focus();
      }
    }
  }, [location])

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 via-white to-gray-50 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left max-w-4xl mx-auto">
              <div className="space-y-4">
                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold hover:bg-red-100">
                  Saving Lives Through Technology
                </span>
                <h1 className="mt-10 text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Connect{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                    Donors
                  </span>{" "}
                  with{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600">
                    Recipients
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Revolutionary blood donation matching system that uses Smart
                  Matching to connect compatible donors with recipients in
                  real-time, saving lives when every second counts.
                </p>
              </div>
              <div id="stats" className="flex flex-col sm:flex-row gap-4 lg:justify-start">
                <Link to="/register">
                  <button className="text-lg px-8 py-6 h-auto flex items-center justify-center bg-red-500 text-white rounded-md font-semibold">
                    <Heart className="mr-2 h-5 w-5" />
                    Start Donating
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </button>
                </Link>
                <a href="https://youtu.be/AlnHNi0hdO0?si=-X_fJu90NwO9qxd2" target="_blank">
                  <button tabIndex={-1} id="watch-demo" className="scroll-mt-64 flex items-center justify-center text-lg px-8 py-6 h-auto border-2 border-gray-300 rounded-md font-semibold focus:border-red-500">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                    <ArrowRight className="ml-5 h-5 w-5" />
                  </button>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-20 pt-8 justify-center">
                {statistics.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <FontAwesomeIcon icon={stat.icon} className="text-4xl text-red-500" />
                    </div>
                    <div className={`text-2xl font-bold`}>
                      {!loading ? (
                        `${stat.value}`
                      ) : (
                        <FontAwesomeIcon spin icon={faSpinner} className="text-gray-600" />

                      )}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>

                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full  bg-red-100 pt-4 md:pt-0 px-4 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#660033] mb-4">
              TO GIVE IS <br className="hidden sm:display" /> HUMAN
            </h1>
            <p className="text-lg md:text-xl text-[#660033] mb-6 max-w-lg">
              Give Blood ,Save Lives <br />
              Donate Blood be a hero
            </p>

          </div>

          <div className="flex relative bg">
            <img
              src="/images/Photo4.png"
              alt="Blood donation"
              className="max-w-md md:max-w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced technology meets compassionate care to create the most
              efficient blood donation network
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card bg-white rounded-lg border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="card-header text-center px-6 py-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="card-title text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <div className="px-6 pb-4 text-center">
                  <p className="card-description text-sm text-gray-600">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple steps to save lives</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white border-4 border-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-red-500">
                        {step.step}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full">
                    <ArrowRight className="h-6 w-6 text-red-300 mx-auto" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-500 to-red-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Save Lives?
            </h2>
            <p className="text-xl text-red-100 mb-8 leading-relaxed">
              Join thousands of donors and recipients who are making a
              difference in their communities every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <button tabIndex={-1} id="become-a-member" className="scroll-mt-64 bg-white/20 flex items-center justify-center text-white border-2 border-transparent focus:border-white hover:bg-red-500 text-lg px-8 py-6 h-auto font-semibold">
                  Become a member
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
