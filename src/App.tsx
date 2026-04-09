import Chatbot from './components/Chatbot';
import { Shield, Star, Clock, MapPin, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function App() {
  const [isWidgetMode, setIsWidgetMode] = useState(false);

  useEffect(() => {
    // Check if we are in widget mode (e.g., /widget path)
    if (window.location.pathname === '/widget') {
      setIsWidgetMode(true);
    }
  }, []);

  if (isWidgetMode) {
    return (
      <div className="bg-transparent">
        <Chatbot defaultOpen={true} hideToggle={true} isEmbedded={true} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ... existing header ... */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center text-white font-serif text-2xl">S</div>
            <div>
              <h1 className="font-serif text-xl font-bold text-brand-primary tracking-tight">Studley Dental & Implant clinic</h1>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-brand-primary transition-colors">Treatments</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Our Team</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Fees</a>
            <a href="#" className="hover:text-brand-primary transition-colors">Contact</a>
            <a 
              href="https://booking.uk.hsone.app/soe/new/%20?pid=UKDME01" 
              target="_blank"
              className="bg-brand-primary text-white px-5 py-2.5 rounded-full hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/20"
            >
              Book Online
            </a>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 overflow-hidden bg-[#fdfcfb]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <h2 className="text-5xl md:text-7xl font-serif text-brand-primary leading-[1.1] mb-6">
                Exceptional care for <span className="italic text-brand-accent">every smile</span>.
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed max-w-xl">
                Our aim is to provide the highest standard of private dentistry for the whole family in a relaxed and friendly environment.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="bg-brand-primary text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-brand-primary/90 transition-all shadow-xl shadow-brand-primary/20">
                  Our Services
                </button>
                <button className="bg-white text-brand-primary border border-slate-200 px-8 py-4 rounded-full text-lg font-medium hover:bg-slate-50 transition-all">
                  Meet the Team
                </button>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-1/2 h-full hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-l from-brand-accent/10 to-transparent" />
            <img 
              src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=2070" 
              alt="Modern Dental Clinic"
              className="w-full h-full object-cover opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
        </section>

        {/* Features */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
                  <Shield size={24} />
                </div>
                <h3 className="text-2xl font-serif text-brand-primary">Trusted Expertise</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our highly experienced clinical team uses the latest technology to ensure the best outcomes for our patients.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
                  <Star size={24} />
                </div>
                <h3 className="text-2xl font-serif text-brand-primary">Patient Focused</h3>
                <p className="text-slate-600 leading-relaxed">
                  We take the time to listen to your concerns and create bespoke treatment plans tailored to your needs.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 bg-brand-accent/10 rounded-xl flex items-center justify-center text-brand-accent">
                  <Clock size={24} />
                </div>
                <h3 className="text-2xl font-serif text-brand-primary">Emergency Care</h3>
                <p className="text-slate-600 leading-relaxed">
                  We prioritize dental emergencies to ensure you get the relief you need when you need it most.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-brand-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-brand-primary font-serif text-2xl">S</div>
                <h2 className="font-serif text-2xl font-bold tracking-tight">Studley Dental & Implant clinic</h2>
              </div>
              <p className="text-white/60 max-w-sm leading-relaxed">
                Providing excellence in private dentistry for Studley and the surrounding areas. Your smile is our priority.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-serif text-xl">Contact Us</h4>
              <ul className="space-y-3 text-white/60 text-sm">
                <li className="flex items-center gap-2"><MapPin size={16} /> 123 Main St, Studley</li>
                <li className="flex items-center gap-2"><Phone size={16} /> 01234 567890</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-serif text-xl">Opening Hours</h4>
              <ul className="space-y-2 text-white/60 text-sm">
                <li>Mon - Fri: 9:00am - 5:30pm</li>
                <li>Sat: By Appointment</li>
                <li>Sun: Closed</li>
              </ul>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/10 text-center text-white/40 text-xs">
            © {new Date().getFullYear()} Studley Dental and Implant Clinic. All rights reserved.
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
