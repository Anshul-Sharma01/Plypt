import React, { useState } from 'react';
import { Mail, Phone, MessageCircle, ChevronDown, ChevronUp, Search, Book, Users, Shield, CreditCard } from 'lucide-react';
import NavigationLayout from '../layouts/NavigationLayout';

const HelpSupport: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I create and sell prompts on Plypt?",
      answer: "To create and sell prompts, you need to first activate your Craftor account. Once activated, you can create prompts by clicking 'Create Prompt' in your dashboard. Add a title, description, content, set your price, and upload sample images. Your prompt will be reviewed before going live."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and various digital payment methods. All transactions are processed securely through our payment partners."
    },
    {
      question: "How do I purchase prompts?",
      answer: "Browse our marketplace, find a prompt you like, and click 'Purchase'. You'll be guided through a secure checkout process. Once purchased, you'll have immediate access to the full prompt content."
    },
    {
      question: "What is the refund policy?",
      answer: "We offer a 7-day refund policy for purchased prompts. If you're not satisfied with your purchase, contact our support team within 7 days for a full refund."
    },
    {
      question: "How do I become a Craftor?",
      answer: "To become a Craftor, go to your profile settings and click 'Activate Craftor Account'. You'll need to provide some additional information and agree to our Craftor terms. Once approved, you can start creating and selling prompts."
    },
    {
      question: "How are earnings calculated for Craftors?",
      answer: "Craftors earn 70% of each sale, with Plypt taking a 30% platform fee. Earnings are calculated automatically and can be withdrawn once you reach the minimum threshold of $50."
    },
    {
      question: "Can I edit my prompts after publishing?",
      answer: "Yes, you can edit your prompts at any time from your dashboard. However, major changes may require re-review. You can also change visibility settings and pricing."
    },
    {
      question: "How do I delete my account?",
      answer: "To delete your account, contact our support team. Please note that this action is irreversible and all your data will be permanently removed."
    }
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <NavigationLayout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Help & Support
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get the help you need to make the most of Plypt. Find answers to common questions or reach out to our support team.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <Book className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Getting Started
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Learn the basics of using Plypt
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Craftor Guide
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                How to create and sell prompts
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Billing & Payments
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Manage your payments and earnings
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Safety & Security
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Keep your account secure
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Frequently Asked Questions
                </h2>

                {/* Search */}
                <div className="relative mb-8">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search FAQs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                  {filteredFaqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full px-6 py-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200 flex items-center justify-between"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {faq.question}
                        </span>
                        {openFaq === index ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {openFaq === index && (
                        <div className="px-6 py-4 bg-white dark:bg-gray-800">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {filteredFaqs.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No FAQs found matching your search.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Contact Support
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Email Support
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        Get help via email within 24 hours
                      </p>
                      <a
                        href="mailto:support@plypt.com"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                      >
                        support@plypt.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Live Chat
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        Chat with our team in real-time
                      </p>
                      <button className="text-green-600 dark:text-green-400 hover:underline text-sm font-medium">
                        Start Chat
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        Phone Support
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                        Call us for urgent issues
                      </p>
                      <a
                        href="tel:+1-555-PLYPT-01"
                        className="text-purple-600 dark:text-purple-400 hover:underline text-sm font-medium"
                      >
                        +1 (555) PLYPT-01
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  System Status
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    All systems operational
                  </span>
                </div>
              </div>

              {/* Resources */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Helpful Resources
                </h3>
                <div className="space-y-3">
                  <a
                    href="#"
                    className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Community Guidelines
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Terms of Service
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Privacy Policy
                  </a>
                  <a
                    href="#"
                    className="block text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    API Documentation
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NavigationLayout>
  );
};

export default HelpSupport;