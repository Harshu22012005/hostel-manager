
import { useState } from 'react';
import { AuthForms } from './AuthForms';
import { Button } from '@/components/ui/button';
import { ChevronRight, CheckCircle, School, Users, Clock } from 'lucide-react';

export const LandingPage = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <a href="#" className="text-2xl font-bold text-hostel-blue">Hostel Manager</a>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-600 hover:text-hostel-blue">Features</a>
            <a href="#portals" className="text-gray-600 hover:text-hostel-blue">Portals</a>
            <a href="#about" className="text-gray-600 hover:text-hostel-blue">About</a>
          </nav>
          
          <Button 
            onClick={() => setShowAuthForm(true)}
            className="bg-hostel-blue hover:bg-hostel-darkBlue transition-colors"
          >
            Login / Register
          </Button>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Simplify Your <span className="text-hostel-blue">Hostel Management</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            A comprehensive platform for students, mess authorities, and hostel administration to streamline operations, enhance communication, and automate notifications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={() => setShowAuthForm(true)}
              className="bg-hostel-blue hover:bg-hostel-darkBlue transition-colors"
            >
              Get Started
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
        
        <div className="md:w-1/2 flex justify-center animate-fade-in" style={{ animationDelay: '0.3s' }}>
          {showAuthForm ? (
            <AuthForms />
          ) : (
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2100&q=80" 
                alt="Hostel Management" 
                className="rounded-lg shadow-2xl max-w-full"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="flex items-center text-hostel-blue">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">Smart Automation</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform offers a range of features designed to make hostel management efficient and hassle-free.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="h-10 w-10 text-hostel-blue" />,
                title: "Outpass Management",
                description: "Streamlined process for students to request and track outpass approvals with automatic notifications."
              },
              {
                icon: <Users className="h-10 w-10 text-hostel-blue" />,
                title: "Meal Attendance",
                description: "Track student meal attendance and send automated notifications to parents."
              },
              {
                icon: <School className="h-10 w-10 text-hostel-blue" />,
                title: "Student Database",
                description: "Comprehensive database for managing student details, room allocation, and parent contact information."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 hover:scale-105 transform transition duration-300">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Portals Section */}
      <section id="portals" className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Portals</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Dedicated portals tailored to the needs of different user roles.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Student Portal",
                features: [
                  "Apply for outpass",
                  "View mess menu",
                  "Submit complaints",
                  "Check college schedule"
                ]
              },
              {
                title: "Mess Authority Portal",
                features: [
                  "Track meal attendance",
                  "Update menu",
                  "Generate reports",
                  "Send notifications"
                ]
              },
              {
                title: "Hostel Office Portal",
                features: [
                  "Approve/reject outpass",
                  "Manage student database",
                  "Resolve complaints",
                  "Send emergency alerts"
                ]
              }
            ].map((portal, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="bg-hostel-blue p-4">
                  <h3 className="text-xl font-bold text-white">{portal.title}</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {portal.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-hostel-blue mr-3" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-hostel-blue py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Get Started?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Join our platform today and experience the benefits of efficient hostel management.
          </p>
          
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => setShowAuthForm(true)}
            className="bg-white text-hostel-blue hover:bg-gray-100"
          >
            Sign Up Now
          </Button>
        </div>
      </section>
      
      {/* Footer */}
      <footer id="about" className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Hostel Manager</h3>
              <p className="text-gray-300">
                Modern hostel management solution designed to streamline operations and enhance communication.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="#features" className="text-gray-300 hover:text-white">Features</a></li>
                <li><a href="#portals" className="text-gray-300 hover:text-white">Portals</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>
              <p className="text-gray-300">
                Email: info@hostelmanager.com<br />
                Phone: +1 234 567 890<br />
                Address: 123 University Ave, Campus Town
              </p>
            </div>
          </div>
          
          <hr className="border-gray-700 my-8" />
          
          <div className="text-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Hostel Manager. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
