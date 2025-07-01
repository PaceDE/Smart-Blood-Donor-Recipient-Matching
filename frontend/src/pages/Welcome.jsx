"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  Users,
  MapPin,
  Shield,
  Clock,
  Award,
  ArrowRight,
  Play,
  CheckCircle,
  Star,
  Phone,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../component/Footer";

// Dummy features
const features = [
  {
    icon: Users,
    title: "Smart Matching",
    description:
      "AI-powered algorithm matches donors with recipients based on blood type, location, and urgency.",
  },
  {
    icon: MapPin,
    title: "Location-Based",
    description:
      "Find donors and recipients in your area with real-time location tracking and mapping.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your medical information is encrypted and protected with industry-standard security measures.",
  },
  {
    icon: Clock,
    title: "24/7 Emergency",
    description:
      "Round-the-clock emergency blood request system for critical situations.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Blood Donor",
    content:
      "This app made it so easy to donate blood and help people in my community. The matching system is incredible!",
    rating: 5,
    avatar: "SJ",
  },
  {
    name: "Dr. Michael Chen",
    role: "Hospital Administrator",
    content:
      "We've seen a 40% increase in successful blood matches since using this platform. It's revolutionizing healthcare.",
    rating: 5,
    avatar: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "Recipient Family",
    content:
      "When my daughter needed blood urgently, this app connected us with donors within hours. Forever grateful!",
    rating: 5,
    avatar: "ER",
  },
];

// Components
const Badge = ({ children, className = "" }) => (
  <span
    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${className}`}
  >
    {children}
  </span>
);

const Button = ({
  children,
  className = "",
  variant = "solid",
  size = "md",
  onClick,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses =
    variant === "outline"
      ? "border border-current bg-transparent hover:bg-gray-100"
      : variant === "ghost"
      ? "bg-transparent hover:bg-gray-100"
      : "bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700";

  const sizeClasses =
    size === "lg"
      ? "px-8 py-4 text-lg"
      : size === "sm"
      ? "px-3 py-1 text-sm"
      : "px-4 py-2";

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);
const CardHeader = ({ children, className = "" }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);
const CardContent = ({ children, className = "" }) => (
  <div className={`px-6 pb-4 ${className}`}>{children}</div>
);
const CardTitle = ({ children, className = "" }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);
const CardDescription = ({ children, className = "" }) => (
  <p className={`text-sm text-gray-600 ${className}`}>{children}</p>
);

export default function Welcome() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState([
    { label: "Lives Saved", value: "Loading...", icon: Heart },
    { label: "Active Donors", value: "Loading...", icon: Users },
   
    { label: "Success Rate", value: "Loading...", icon: Award },
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats([
        { label: "Lives Saved", value: "15,420", icon: Heart },
        { label: "Active Donors", value: "8,350", icon: Users },
        
        { label: "Success Rate", value: "98%", icon: Award },
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-red-50 via-white to-gray-50 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left max-w-4xl mx-auto">
              <div className="space-y-4">
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                  🩸 Saving Lives Through Technology
                </Badge>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 h-auto"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Start Donating
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 h-auto border-gray-300"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8 justify-center">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex justify-center mb-2">
                      <stat.icon className="h-8 w-8 text-red-500" />
                    </div>
                    <div
                      className={`text-2xl font-bold ${
                        stat.value === "Loading..."
                          ? "text-gray-400 animate-pulse"
                          : "text-gray-900"
                      }`}
                    >
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
 <section className="w-full  bg-gradient-to-r from-red-50 to-pink-50 py-12 px-4 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#660033] mb-4 leading-tight">
              TO GIVE IS <br className="hidden sm:block" /> HUMAN
            </h1>
            <p className="text-lg md:text-xl text-[#660033] mb-6 max-w-lg">
             Give Blood ,Save Lives <br/>
                  Donate Blood be a hero
            </p>
            
          </div>

          <div className="flex-1 relative">
            <img
              src="/images/hero-image-1.png"
              alt="Happy child blood donation"
              className="w-full max-w-md md:max-w-full mx-auto object-cover rounded-xl "
            />
          </div>
        </div>
      </section>

      {/* Emergency Alert Banner */}
      <section className="bg-red-600 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-6 w-6 animate-pulse" />
              <span className="font-semibold">
                Emergency Blood Needed: O- Type in Downtown Hospital
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-red-600"
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-red-600"
              >
                Respond
              </Button>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-gray-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">Simple steps to save lives</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
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
                  "Our AI algorithm finds compatible donors or recipients near you",
                icon: Heart,
              },
              {
                step: "03",
                title: "Save Lives",
                description:
                  "Connect, coordinate, and complete the life-saving donation process",
                icon: CheckCircle,
              },
            ].map((step, index) => (
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

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our Community Says
            </h2>
            <p className="text-xl text-gray-600">
              Real stories from donors and recipients
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="h-6 w-6 text-yellow-400 fill-current"
                      />
                    )
                  )}
                </div>
                <blockquote className="text-2xl text-gray-900 mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].content}"
                </blockquote>
                <div className="flex items-center justify-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">
                      {testimonials[currentTestimonial].avatar}
                    </span>
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-gray-600">
                      {testimonials[currentTestimonial].role}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-red-500" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
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
              <Button
                size="lg"
                className="bg-white text-red-600 hover:bg-gray-100 text-lg px-8 py-6 h-auto font-semibold"
              >
                <Heart className="mr-2 h-5 w-5" />
                Become a Donor
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-red-600 text-lg px-8 py-6 h-auto font-semibold"
              >
                Request Blood
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
