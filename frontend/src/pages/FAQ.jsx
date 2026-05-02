import React, { useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, HelpCircle, Send, CheckCircle } from 'lucide-react';

const faqs = [
  { q: 'How do I watch movies on MovieHub?', a: 'Subscribe to any plan, sign in, and click Play Now on any movie or series. Streaming starts instantly in your browser.' },
  { q: 'Can I download movies to watch offline?', a: 'No. To protect copyright and licensing agreements, downloading is not permitted on MovieHub. All content must be streamed online.' },
  { q: 'How do I cancel my subscription?', a: 'You can cancel anytime by going to your profile page and selecting the cancel option. You will retain access until the end of your billing period.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit and debit cards (Visa, MasterCard, American Express) through our secure Stripe payment portal.' },
  { q: 'Can I watch on multiple devices?', a: 'Yes! Standard plan supports 2 simultaneous screens, and Premium supports up to 4. Basic plan is limited to 1 screen.' },
  { q: 'How do I report a technical issue?', a: 'Use the contact form below or email us at support@moviehub.com. Our team responds within 24 hours.' },
  { q: 'Are there seasonal discounts?', a: 'Yes! We offer periodic seasonal discounts based on popular movie releases. Standard saves 20% and Premium saves 30% during active promotional periods.' },
  { q: 'How is the IBM rating calculated?', a: 'The IBM rating reflects a movie\'s popularity, critical reception, and user engagement score on a scale of 0 to 10.' },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/enquiries', form);
      setSubmitted(true);
    } catch {
      alert('Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      {/* FAQ */}
      <div className="max-w-3xl mx-auto mb-20">
        <div className="text-center mb-12">
          <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold tracking-tighter mb-3">Frequently Asked Questions</h1>
          <p className="text-gray-400">Everything you need to know about MovieHub.</p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-secondary rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
              >
                <span className="font-semibold">{faq.q}</span>
                {openIndex === i ? <ChevronUp className="w-5 h-5 text-primary shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-secondary bg-secondary/20">
                  <p className="pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact/Enquiry Form */}
      <div className="max-w-2xl mx-auto" id="contact">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Still Have Questions?</h2>
          <p className="text-gray-400">Send us a message and we'll get back to you within 24 hours.</p>
        </div>

        <div className="bg-secondary/50 border border-secondary rounded-2xl p-8 backdrop-blur-sm">
          {submitted ? (
            <div className="text-center py-10">
              <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Message Sent!</h3>
              <p className="text-gray-400">We'll get back to you at <strong>{form.email}</strong> within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Your Name</label>
                  <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="John Doe" className="w-full bg-dark text-white p-4 rounded-lg border border-secondary focus:outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Email Address</label>
                  <input required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="john@example.com" className="w-full bg-dark text-white p-4 rounded-lg border border-secondary focus:outline-none focus:border-primary transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">Your Message</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} placeholder="Describe your question or issue..." className="w-full bg-dark text-white p-4 rounded-lg border border-secondary focus:outline-none focus:border-primary transition-colors resize-none" />
              </div>
              <button type="submit" disabled={loading} className="flex items-center gap-2 bg-primary hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-all">
                <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQ;
