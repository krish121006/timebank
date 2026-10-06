import React, { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Check, Zap, ShieldCheck, CreditCard, Lock, X, Smartphone, Landmark, Wallet, Loader2, ArrowRight, Sparkles } from 'lucide-react';

export const PaymentPage: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [showSimModal, setShowSimModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<'CARD' | 'UPI' | 'NETBANKING' | 'WALLET'>('UPI');
  const [paymentStep, setPaymentStep] = useState<'SELECT_METHOD' | 'PROCESSING' | 'OTP' | 'SUCCESS'>('SELECT_METHOD');
  const [otpInput, setOtpInput] = useState('123456');
  const [upiId, setUpiId] = useState('user@okaxis');
  const [currentOrder, setCurrentOrder] = useState<{ orderId: string; amount: number; plan: 'PREMIUM_MONTHLY' | 'PREMIUM_YEARLY' } | null>(null);

  const handleSubscribe = async (plan: 'PREMIUM_MONTHLY' | 'PREMIUM_YEARLY') => {
    setLoading(true);
    setSuccessMsg('');

    try {
      const orderRes = await api.post('/payments/order', { plan });
      const { orderId, amount } = orderRes.data;

      setCurrentOrder({ orderId, amount, plan });
      setPaymentStep('SELECT_METHOD');
      setShowSimModal(true);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Stripe Order initiation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartPaymentFlow = async () => {
    if (!currentOrder) return;
    setPaymentStep('PROCESSING');
    setTimeout(() => {
      setPaymentStep('OTP');
    }, 1200);
  };

  const executeFinalVerification = async () => {
    if (!currentOrder) return;
    setPaymentStep('PROCESSING');

    try {
      const verifyRes = await api.post('/payments/verify', {
        orderId: currentOrder.orderId,
        paymentId: `pay_stripe_${Date.now()}`
      });

      setPaymentStep('SUCCESS');
      setTimeout(async () => {
        setSuccessMsg(verifyRes.data.message || 'Stripe Payment Successful — Premium active!');
        await refreshUser();
        setShowSimModal(false);
        setPaymentStep('SELECT_METHOD');
      }, 1200);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Payment verification failed.');
      setShowSimModal(false);
      setPaymentStep('SELECT_METHOD');
    }
  };

  // Helper check for active plan
  const userPlan = (user as any)?.premiumPlan || (user?.isPremium ? 'PREMIUM_MONTHLY' : 'NONE');

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-8 text-center relative">
      <div>
        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Monetization & Membership
        </span>
        <h1 className="text-3xl font-extrabold text-[#0F172A] mt-3">TimeBank Premium Membership</h1>
        <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
          Skill exchanges remain time-credit based for everyone. Upgrade for advanced AI matching, featured profiles, and priority listing.
        </p>
      </div>

      {successMsg && (
        <div className="max-w-md mx-auto bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 animate-in fade-in duration-300">
          <Check className="w-5 h-5 text-emerald-600" />
          {successMsg}
        </div>
      )}

      {/* Current Active Plan Badge if user is already Premium */}
      {user?.isPremium && (
        <div className="max-w-xl mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-5 rounded-2xl shadow-lg flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="text-xs font-medium text-blue-200 uppercase tracking-wider">Active Plan</div>
              <div className="text-lg font-bold">
                {userPlan === 'PREMIUM_YEARLY' ? 'Premium Yearly (₹2,499/yr)' : 'Premium Monthly (₹299/mo)'}
              </div>
            </div>
          </div>
          {userPlan === 'PREMIUM_MONTHLY' && (
            <button
              onClick={() => handleSubscribe('PREMIUM_YEARLY')}
              className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Upgrade to Yearly Save 30% 🚀
            </button>
          )}
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto text-left">
        {/* Monthly Plan */}
        <div className={`card p-8 border-2 transition-all flex flex-col justify-between ${userPlan === 'PREMIUM_MONTHLY' ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-200 hover:border-blue-500'}`}>
          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#0F172A]">Premium Monthly</h3>
              {userPlan === 'PREMIUM_MONTHLY' && (
                <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">Current Plan</span>
              )}
            </div>
            <div className="text-3xl font-extrabold text-[#0F172A] mt-4">
              ₹299 <span className="text-sm font-normal text-slate-500">/ month</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Priority Smart Match Ranking</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Unlimited Active Skill Requests</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Verified Profile Badge</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Advanced Skill Equivalent Filters</li>
            </ul>
          </div>
          <button
            onClick={() => handleSubscribe('PREMIUM_MONTHLY')}
            disabled={loading || userPlan === 'PREMIUM_MONTHLY' || userPlan === 'PREMIUM_YEARLY'}
            className="mt-8 btn-primary w-full py-3 font-semibold disabled:opacity-50"
          >
            {userPlan === 'PREMIUM_MONTHLY' ? 'Active Monthly Plan' : userPlan === 'PREMIUM_YEARLY' ? 'Included in Yearly' : loading ? 'Processing...' : 'Subscribe ₹299/mo'}
          </button>
        </div>

        {/* Yearly Plan */}
        <div className={`card p-8 border-2 transition-all flex flex-col justify-between relative overflow-hidden ${userPlan === 'PREMIUM_YEARLY' ? 'border-emerald-500 bg-emerald-50/10' : 'border-[#2563EB] bg-blue-50/20'}`}>
          {userPlan !== 'PREMIUM_YEARLY' && (
            <span className="absolute top-4 right-4 bg-[#2563EB] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Best Value
            </span>
          )}
          {userPlan === 'PREMIUM_YEARLY' && (
            <span className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
              Current Active Plan
            </span>
          )}
          <div>
            <h3 className="text-xl font-bold text-[#0F172A]">Premium Yearly</h3>
            <div className="text-3xl font-extrabold text-[#0F172A] mt-4">
              ₹2,499 <span className="text-sm font-normal text-slate-500">/ year</span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> All Monthly Features Included</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Save over 30% annually</li>
              <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-600" /> Featured Community Listing</li>
            </ul>
          </div>
          <button
            onClick={() => handleSubscribe('PREMIUM_YEARLY')}
            disabled={loading || userPlan === 'PREMIUM_YEARLY'}
            className="mt-8 btn-primary bg-emerald-600 hover:bg-emerald-500 w-full py-3 font-semibold disabled:opacity-50"
          >
            {userPlan === 'PREMIUM_YEARLY' ? 'Active Yearly Plan' : userPlan === 'PREMIUM_MONTHLY' ? 'Upgrade to Yearly (₹2,499)' : loading ? 'Processing...' : 'Subscribe ₹2,499/yr'}
          </button>
        </div>
      </div>

      {/* Buy Extra Time Credits Top-up Section */}
      <div className="pt-8 border-t border-slate-200 text-left max-w-4xl mx-auto space-y-6">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Top-up Credit Wallet
          </span>
          <h2 className="text-2xl font-bold text-[#0F172A] mt-2">Need Extra Time Credits?</h2>
          <p className="text-slate-500 text-sm mt-1">
            Purchase additional Time Credits directly to book skill learning sessions instantly without waiting to earn credits.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pack 1 */}
          <div className="card p-6 border-2 border-slate-200 hover:border-blue-500 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase">Starter Pack</div>
              <div className="text-2xl font-black text-slate-900 mt-2">+5 Time Credits</div>
              <div className="text-lg font-bold text-blue-600 mt-1">₹99</div>
              <p className="text-xs text-slate-500 mt-3">Ideal for 5 hours of learning or 1-on-1 mentoring.</p>
            </div>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await api.post('/payments/buy-credits', { pack: 'PACK_5' });
                  setCurrentOrder({ orderId: res.data.orderId, amount: res.data.amount, plan: 'PREMIUM_MONTHLY' });
                  setPaymentStep('SELECT_METHOD');
                  setShowSimModal(true);
                } catch (err: any) {
                  alert(err.response?.data?.message || 'Top-up failed.');
                } finally {
                  setLoading(false);
                }
              }}
              className="mt-6 btn-secondary w-full py-2.5 text-xs font-bold"
            >
              Buy +5 Credits (₹99)
            </button>
          </div>

          {/* Pack 2 */}
          <div className="card p-6 border-2 border-blue-600 bg-blue-50/20 relative flex flex-col justify-between">
            <span className="absolute top-3 right-3 bg-blue-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">POPULAR</span>
            <div>
              <div className="text-xs font-bold text-blue-700 uppercase">Pro Learner Pack</div>
              <div className="text-2xl font-black text-slate-900 mt-2">+15 Time Credits</div>
              <div className="text-lg font-bold text-blue-600 mt-1">₹249</div>
              <p className="text-xs text-slate-500 mt-3">Best for multi-session skill courses and intensive practice.</p>
            </div>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await api.post('/payments/buy-credits', { pack: 'PACK_15' });
                  setCurrentOrder({ orderId: res.data.orderId, amount: res.data.amount, plan: 'PREMIUM_MONTHLY' });
                  setPaymentStep('SELECT_METHOD');
                  setShowSimModal(true);
                } catch (err: any) {
                  alert(err.response?.data?.message || 'Top-up failed.');
                } finally {
                  setLoading(false);
                }
              }}
              className="mt-6 btn-primary w-full py-2.5 text-xs font-bold"
            >
              Buy +15 Credits (₹249)
            </button>
          </div>

          {/* Pack 3 */}
          <div className="card p-6 border-2 border-emerald-500 bg-emerald-50/10 relative flex flex-col justify-between">
            <span className="absolute top-3 right-3 bg-emerald-600 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full">MAX VALUE</span>
            <div>
              <div className="text-xs font-bold text-emerald-700 uppercase">Mastery Bundle</div>
              <div className="text-2xl font-black text-slate-900 mt-2">+30 Time Credits</div>
              <div className="text-lg font-bold text-emerald-600 mt-1">₹449</div>
              <p className="text-xs text-slate-500 mt-3">30 hours of mentoring. Save maximum per credit cost!</p>
            </div>
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await api.post('/payments/buy-credits', { pack: 'PACK_30' });
                  setCurrentOrder({ orderId: res.data.orderId, amount: res.data.amount, plan: 'PREMIUM_MONTHLY' });
                  setPaymentStep('SELECT_METHOD');
                  setShowSimModal(true);
                } catch (err: any) {
                  alert(err.response?.data?.message || 'Top-up failed.');
                } finally {
                  setLoading(false);
                }
              }}
              className="mt-6 btn-primary bg-emerald-600 hover:bg-emerald-500 w-full py-2.5 text-xs font-bold"
            >
              Buy +30 Credits (₹449)
            </button>
          </div>
        </div>
      </div>

      {/* Official Stripe Hosted / Checkout Modal Screen */}
      {showSimModal && currentOrder && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden text-left border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Stripe Header */}
            <div className="bg-[#635BFF] p-6 text-white flex justify-between items-center relative">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center font-bold text-2xl">
                  S
                </div>
                <div>
                  <h3 className="font-extrabold text-xl tracking-tight flex items-center gap-2">
                    stripe <span className="bg-white/20 text-xs px-2 py-0.5 rounded font-normal">TEST MODE</span>
                  </h3>
                  <p className="text-xs text-indigo-100 flex items-center gap-1 mt-0.5">
                    <Lock className="w-3 h-3" /> Powered by Stripe Checkout
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSimModal(false)}
                className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            {paymentStep === 'SELECT_METHOD' && (
              <div className="p-6 space-y-6">
                {/* Order Total Banner */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pay TimeBank</span>
                    <span className="text-sm font-bold text-slate-900">
                      {currentOrder.plan === 'PREMIUM_MONTHLY' ? 'Monthly Premium Membership' : currentOrder.plan === 'PREMIUM_YEARLY' ? 'Yearly Premium Membership' : 'Time Credits Top-Up Pack'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-[#635BFF]">₹{currentOrder.amount / 100}</span>
                  </div>
                </div>

                {/* Stripe Elements Card Input Form */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      Card Information
                    </label>
                    <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded border border-indigo-200">
                      Auto-filled Test Card: 4242...
                    </span>
                  </div>

                  <div className="border border-slate-300 rounded-xl overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#635BFF]">
                    {/* Card Number */}
                    <div className="relative border-b border-slate-200 p-3 bg-white flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        readOnly
                        value="4242 •••• •••• 4242"
                        className="w-full text-sm font-mono text-slate-800 bg-transparent outline-none font-bold"
                      />
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">VISA</span>
                    </div>
                    {/* Expiry & CVC */}
                    <div className="grid grid-cols-2 bg-white">
                      <div className="p-3 border-r border-slate-200">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">MM / YY</span>
                        <input
                          type="text"
                          readOnly
                          value="12 / 34"
                          className="w-full text-sm font-mono text-slate-800 bg-transparent outline-none"
                        />
                      </div>
                      <div className="p-3">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">CVC</span>
                        <input
                          type="text"
                          readOnly
                          value="123"
                          className="w-full text-sm font-mono text-slate-800 bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cardholder Details */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Name on card</label>
                    <input
                      type="text"
                      readOnly
                      value={user?.name || 'Test User'}
                      className="w-full text-sm p-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-700 outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Submit Pay Button */}
                <button
                  onClick={handleStartPaymentFlow}
                  className="w-full py-3.5 bg-[#635BFF] hover:bg-[#5249e0] text-white font-extrabold text-base rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Pay ₹{currentOrder.amount / 100} with Stripe
                </button>

                <p className="text-[11px] text-slate-400 text-center">
                  By clicking Pay, you authorize TimeBank to charge your test card in Stripe Sandbox environment.
                </p>
              </div>
            )}

            {/* STEP 2: STRIPE PROCESSING */}
            {paymentStep === 'PROCESSING' && (
              <div className="p-12 text-center space-y-4 animate-in fade-in">
                <Loader2 className="w-12 h-12 text-[#635BFF] animate-spin mx-auto" />
                <h4 className="text-lg font-bold text-slate-900">Processing with Stripe...</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Authorizing test transaction. Please wait a moment.
                </p>
              </div>
            )}

            {/* STEP 3: STRIPE 3D SECURE OTP SIMULATION */}
            {paymentStep === 'OTP' && (
              <div className="p-6 space-y-5 animate-in fade-in">
                <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#635BFF] text-white font-bold flex items-center justify-center text-xs">3DS</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">Stripe 3D Secure Authentication</h4>
                    <p className="text-xs text-slate-600">Simulating Bank Authentication Check</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 block">Enter Test OTP Code</label>
                  <input
                    type="text"
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    className="w-full text-center text-2xl font-mono tracking-widest p-3 border-2 border-[#635BFF] rounded-xl outline-none"
                    maxLength={6}
                  />
                  <p className="text-[11px] text-emerald-600 font-semibold text-center">
                    ✓ Use default test OTP code: 123456
                  </p>
                </div>

                <button
                  onClick={executeFinalVerification}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all"
                >
                  Complete 3DS Authentication
                </button>
              </div>
            )}

            {/* STEP 4: SUCCESS */}
            {paymentStep === 'SUCCESS' && (
              <div className="p-12 text-center space-y-4 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                  <Check className="w-10 h-10 stroke-[3]" />
                </div>
                <h4 className="text-2xl font-black text-slate-900">Stripe Payment Verified!</h4>
                <p className="text-xs text-slate-500">
                  Your purchase has been recorded. Premium features and Time Credits are now available!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};


