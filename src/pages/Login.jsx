import React, { useState } from 'react';
import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import loginBg from '../assets/login-bg.jpg';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      if (email === 'user@example.com' && password === 'password') {
        localStorage.setItem('token', 'dummy-token');
        if (rememberMe) localStorage.setItem('rememberMe', 'true');
        navigate('/home');
      }
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative overflow-hidden"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      
      {/* Floating particles - only on desktop */}
      <div className="hidden md:block">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              y: Math.random() * 100 - 50,
              x: Math.random() * 100 - 50,
              opacity: 0
            }}
            animate={{ 
              y: [null, Math.random() * 200 - 100],
              x: [null, Math.random() * 200 - 100],
              opacity: [0, 0.6, 0],
              rotate: Math.random() * 360
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "linear"
            }}
            className={`absolute rounded-full ${i % 3 === 0 ? 'bg-purple-400' : i % 2 === 0 ? 'bg-indigo-400' : 'bg-pink-400'}`}
            style={{
              width: Math.random() * 6 + 3,
              height: Math.random() * 6 + 3,
            }}
          />
        ))}
      </div>

      {/* Login Card - Centered with max-width */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-md mx-auto bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl overflow-hidden"
      >
        {/* Gradient accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600"></div>
        
        <div className="px-6 py-8 sm:px-8 sm:py-10">
          
          
          {/* Title - Centered */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-white/80">
              Sign in to access your account
            </p>
          </div>

          {/* Social Buttons - Centered */}
          <div className="flex justify-center gap-4 mb-6 sm:mb-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
              aria-label="Login with Google"
            >
              <FaGoogle className="text-red-400 text-lg sm:text-xl" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
              aria-label="Login with Facebook"
            >
              <FaFacebookF className="text-blue-400 text-lg sm:text-xl" />
            </motion.button>
          </div>

          {/* Divider - Centered */}
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-transparent text-white/60 text-xs sm:text-sm">
                or continue with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm sm:text-base font-medium text-white/80 mb-1 sm:mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="you@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm sm:text-base font-medium text-white/80 mb-1 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition pr-10 sm:pr-12"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-sm sm:text-base" />
                  ) : (
                    <FaEye className="text-sm sm:text-base" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-white/20 rounded bg-white/10"
                />
                <span className="text-xs sm:text-sm text-white/80">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Forgot password')}
                className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-2.5 sm:py-3.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-sm sm:text-base shadow-lg hover:shadow-purple-500/20 transition-all flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>

          {/* Sign Up Link - Centered */}
          <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-white/70">
            Don't have an account?{' '}
            <button 
              onClick={() => alert('Sign up')}
              className="text-purple-400 hover:text-purple-300 font-medium hover:underline"
            >
              Sign up
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;