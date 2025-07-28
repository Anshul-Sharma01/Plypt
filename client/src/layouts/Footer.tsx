import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full bottom-0 bg-gray-900 text-white py-12 px-8 z-50">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="w-full md:w-1/3 mb-8 md:mb-0">
            <h3 className="text-3xl font-bold text-purple-400 mb-4">Plypt</h3>
            <p className="text-gray-300 mb-6">
              Empowering creativity with AI prompts in a dynamic marketplace where Craftors and buyers connect in real-time.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                <span className="text-xl">🐦</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                <span className="text-xl">📸</span>
              </a>
              <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                <span className="text-xl">🔗</span>
              </a>
            </div>
          </div>
          <div className="w-full md:w-2/3 grid grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-bold text-purple-400 mb-4">Explore</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Marketplace</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Auctions</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Blog</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-purple-400 mb-4">Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">FAQ</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Contact Us</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Help Center</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-purple-400 mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Terms of Service</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-bold text-purple-400 mb-4">Newsletter</h4>
              <form>
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full p-2 mb-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Plypt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
