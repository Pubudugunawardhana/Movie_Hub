import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Mail, MessageSquare, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark pt-16 pb-8 px-6 border-t border-secondary mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 text-primary font-bold text-2xl tracking-tighter mb-4">
            <Film className="w-8 h-8 fill-current" />
            <span>MOVIEHUB</span>
          </div>
          <p className="text-gray-400 max-w-md">
            Experience the ultimate cinema journey from the comfort of your home. Discover thousands of movies, exclusive content, and a community of movie lovers.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link to="/subscription" className="hover:text-white transition-colors">Subscription Plans</Link></li>
            <li><Link to="/faq" className="hover:text-white transition-colors">FAQ & Support</Link></li>
            <li><Link to="/faq#contact" className="hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4">Social</h4>
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary transition-all"><Mail className="w-5 h-5" /></a>
            <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary transition-all"><MessageSquare className="w-5 h-5" /></a>
            <a href="#" className="p-2 bg-secondary rounded-full hover:bg-primary transition-all"><Globe className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-xs mt-16">
        © 2026 MOVIEHUB. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
