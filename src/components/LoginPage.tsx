import { useState } from "react";
import { toast } from "sonner@2.0.3";
import { useAuth } from "../contexts/AuthContext";

function Logo() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Circle */}
      <circle cx="100" cy="100" r="90" fill="#0c1e33" opacity="0.05"/>
      <circle cx="100" cy="100" r="80" fill="#0c1e33" opacity="0.08"/>
      
      {/* Main Brain/Head Icon */}
      <circle cx="100" cy="85" r="35" fill="#0c1e33"/>
      
      {/* Heart in the center - symbolizing mental wellness */}
      <path 
        d="M100 95 L105 90 Q110 85 110 80 Q110 75 105 75 Q100 75 100 80 Q100 75 95 75 Q90 75 90 80 Q90 85 95 90 Z" 
        fill="#4c85e9"
      />
      
      {/* Body/Support Base */}
      <rect x="88" y="115" width="24" height="35" rx="3" fill="#0c1e33"/>
      
      {/* Arms - representing support and care */}
      <path 
        d="M88 120 L70 135 Q65 138 68 143 L75 140 Q78 138 82 133 L88 125" 
        fill="#27ae60"
      />
      <path 
        d="M112 120 L130 135 Q135 138 132 143 L125 140 Q122 138 118 133 L112 125" 
        fill="#27ae60"
      />
      
      {/* Decorative Elements - representing positive energy */}
      <circle cx="60" cy="60" r="4" fill="#f2994a" opacity="0.6"/>
      <circle cx="140" cy="60" r="4" fill="#f2994a" opacity="0.6"/>
      <circle cx="50" cy="100" r="3" fill="#4c85e9" opacity="0.6"/>
      <circle cx="150" cy="100" r="3" fill="#4c85e9" opacity="0.6"/>
      <circle cx="70" cy="140" r="3" fill="#27ae60" opacity="0.6"/>
      <circle cx="130" cy="140" r="3" fill="#27ae60" opacity="0.6"/>
    </svg>
  );
}

export function LoginPage() {
  const { login, isLoading } = useAuth();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account || !password) {
      toast.error("Please enter both account and password");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({
        email: account,
        password: password
      });
      // Login success is handled by AuthContext
    } catch (error: any) {
      // Error is already handled by AuthContext
      console.error("Login error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    toast.info("Please contact administrator for password reset");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-md px-8">
        {/* Logo/Image */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-[200px] h-[200px] mb-4">
            <Logo />
          </div>
          <div className="text-center">
            <h2 className="font-['Poppins:SemiBold',sans-serif] text-[24px] text-[#0c1e33] mb-1">
              Student Wellness
            </h2>
            <p className="font-['Poppins:Regular',sans-serif] text-[14px] text-[#495d72]">
              Mental Health Monitoring System
            </p>
          </div>
        </div>

        {/* User Login Title */}
        <div className="mb-10 text-center">
          <h1 className="font-['Poppins:Regular',sans-serif] text-[28px] text-[#0c1e33] capitalize">
            User Login
          </h1>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Account Input */}
          <div className="relative">
            <label 
              htmlFor="account"
              className="font-['Poppins:Regular',sans-serif] text-[19.727px] text-[#bdbcbc] capitalize mb-2 block"
            >
              Account
            </label>
            <input
              id="account"
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full bg-[#f4f6f7] border-0 h-[30px] px-3 font-['Poppins:Regular',sans-serif] text-[#0c1e33] focus:outline-none focus:ring-2 focus:ring-[#0c1e33]/20"
              placeholder=""
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label 
              htmlFor="password"
              className="font-['Poppins:Regular',sans-serif] text-[19.727px] text-[#bdbcbc] capitalize mb-2 block"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#f4f6f7] border-0 h-[30px] px-3 font-['Poppins:Regular',sans-serif] text-[#0c1e33] focus:outline-none focus:ring-2 focus:ring-[#0c1e33]/20"
              placeholder=""
            />
          </div>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="font-['Poppins:Regular',sans-serif] text-[19.727px] text-[#0c1e33] capitalize hover:underline"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="bg-[#0c1e33] px-[13.151px] py-[9.863px] rounded-[3.288px] font-['Poppins:Medium',sans-serif] text-[13.151px] text-white hover:bg-[#0c1e33]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
