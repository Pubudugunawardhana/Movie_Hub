import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Zap, Crown, Star } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    icon: <Star className="w-8 h-8" />,
    price: 4.99,
    originalPrice: null,
    color: 'from-gray-700 to-gray-800',
    border: 'border-gray-600',
    features: [
      'Access to 100+ movies',
      'HD quality streaming',
      '1 screen at a time',
      'No downloads',
      'Email support',
    ],
    discount: null,
  },
  {
    id: 'standard',
    name: 'Standard',
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    price: 9.99,
    originalPrice: 12.99,
    color: 'from-primary/30 to-primary/10',
    border: 'border-primary',
    badge: 'Most Popular',
    features: [
      'Access to all movies & series',
      'Full HD + 4K quality',
      '2 screens simultaneously',
      'No downloads',
      'Priority support',
      'Seasonal 20% discount',
    ],
    discount: 20,
  },
  {
    id: 'premium',
    name: 'Premium',
    icon: <Crown className="w-8 h-8 text-yellow-400" />,
    price: 14.99,
    originalPrice: 19.99,
    color: 'from-yellow-900/40 to-yellow-800/10',
    border: 'border-yellow-500',
    badge: 'Best Value',
    features: [
      'Unlimited access to everything',
      '4K Ultra HD quality',
      '4 screens simultaneously',
      'No downloads',
      '24/7 dedicated support',
      'Seasonal 30% discount',
      'Early access to new releases',
      'Offline watch on mobile (coming soon)',
    ],
    discount: 30,
  },
];

const Subscription = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubscribe = (plan) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    navigate(`/payment?plan=${plan.id}&price=${plan.price}`);
  };

  const currentPlan = user?.plan;
  const isSubscribed = user?.subscribed;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 md:px-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
          {isSubscribed ? 'Manage Your ' : 'Choose Your '}<span className="text-primary">Plan</span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto">
          {isSubscribed 
            ? `You are currently on the ${currentPlan?.charAt(0).toUpperCase() + currentPlan?.slice(1)} plan. Upgrade or switch anytime.`
            : 'Unlock unlimited movies and series. Cancel anytime. Seasonal discounts applied automatically.'
          }
        </p>
      </div>

      {/* Seasonal Banner */}
      <div className="max-w-5xl mx-auto mb-12 bg-gradient-to-r from-primary/30 to-yellow-500/20 border border-primary/50 rounded-2xl p-6 flex items-center gap-6">
        <div className="text-4xl">🎉</div>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Seasonal Offer Active!</h3>
          <p className="text-gray-300">Up to <span className="text-yellow-400 font-bold">30% OFF</span> on Standard & Premium plans. Limited time offer!</p>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const isCurrent = isSubscribed && currentPlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`relative bg-gradient-to-b ${plan.color} border-2 ${isCurrent ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.2)]' : plan.border} rounded-2xl p-8 flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20`}
            >
              {isCurrent && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Current Plan
                </div>
              )}
              {!isCurrent && plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}

              <div className="mb-6">
                <div className="mb-3">{plan.icon}</div>
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold">${plan.price}</span>
                  <span className="text-gray-400">/month</span>
                  {plan.originalPrice && (
                    <span className="text-gray-500 line-through text-sm">${plan.originalPrice}</span>
                  )}
                </div>
                {plan.discount && (
                  <span className="inline-block mt-2 text-xs bg-green-500/20 text-green-400 font-bold px-3 py-1 rounded-full">
                    SAVE {plan.discount}% THIS SEASON
                  </span>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl font-bold bg-green-500/20 text-green-400 border border-green-500/50 cursor-default"
                >
                  ✓ Active Plan
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full py-3 rounded-xl font-bold transition-all ${
                    plan.id === 'standard' 
                      ? 'bg-primary hover:bg-red-700 text-white' 
                      : 'bg-secondary/80 hover:bg-secondary text-white border border-white/20'
                  }`}
                >
                  {isSubscribed ? `Switch to ${plan.name}` : `Get ${plan.name}`}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Subscription;
