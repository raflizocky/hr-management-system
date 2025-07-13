'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Building2, Shield, Users, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const { tenant } = useTenant();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { 
      email: 'admin@company.com', 
      password: 'password', 
      role: 'Administrator',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      description: 'Full system access'
    },
    { 
      email: 'hr@company.com', 
      password: 'password', 
      role: 'HR Manager',
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      description: 'Employee & HR management'
    },
    { 
      email: 'employee@company.com', 
      password: 'password', 
      role: 'Employee',
      icon: BarChart3,
      color: 'from-green-500 to-green-600',
      description: 'Personal dashboard access'
    }
  ];

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-40 left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Language Selector */}
      <motion.div 
        className="absolute top-6 right-6 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex space-x-2">
          {['en', 'es', 'fr'].map((lang) => (
            <Button
              key={lang}
              variant={i18n.language === lang ? "default" : "ghost"}
              size="sm"
              onClick={() => changeLanguage(lang)}
              className="text-xs font-medium"
            >
              {lang.toUpperCase()}
            </Button>
          ))}
        </div>
      </motion.div>

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        <motion.div 
          className="w-full max-w-lg space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Company Header */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex justify-center">
              <motion.div 
                className="w-20 h-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Building2 className="h-10 w-10 text-white" />
              </motion.div>
            </div>
            <div>
              <motion.h1 
                className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent"
                style={{
                  backgroundImage: tenant ? `linear-gradient(135deg, ${tenant.primaryColor}, ${tenant.secondaryColor})` : undefined
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {tenant?.name || t('companyName')}
              </motion.h1>
              <motion.p 
                className="text-gray-600 mt-3 text-xl font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {t('companyTagline')}
              </motion.p>
              <motion.p 
                className="text-sm text-gray-500 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {t('companyDescription')}
              </motion.p>
            </div>
          </motion.div>

          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-center text-3xl font-semibold text-gray-800">
                  {t('welcomeBack')}
                </CardTitle>
                <p className="text-center text-gray-600 text-lg">{t('signInToAccess')}</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <Label htmlFor="email" className="text-base font-medium">{t('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 text-base"
                      placeholder={t('enterEmail')}
                      required
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    <Label htmlFor="password" className="text-base font-medium">{t('password')}</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 text-base"
                      placeholder={t('enterPassword')}
                      required
                    />
                  </motion.div>
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <Alert variant="destructive">
                          <AlertDescription>{error}</AlertDescription>
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium text-base" 
                      disabled={isLoading}
                    >
                      {isLoading ? t('signingIn') : t('signIn')}
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Demo Accounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 text-center">
                  {t('tryDemoAccounts')}
                </CardTitle>
                <p className="text-center text-sm text-gray-600">
                  {t('experienceRoles')}
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {demoAccounts.map((account, index) => (
                    <motion.div 
                      key={index} 
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div 
                          className={`w-12 h-12 bg-gradient-to-br ${account.color} rounded-xl flex items-center justify-center shadow-lg`}
                          whileHover={{ rotate: 5 }}
                        >
                          <account.icon className="h-6 w-6 text-white" />
                        </motion.div>
                        <div>
                          <span className="font-semibold text-gray-800">{account.role}</span>
                          <p className="text-xs text-gray-600">{account.description}</p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover:bg-blue-50 hover:border-blue-300"
                        onClick={() => {
                          setEmail(account.email);
                          setPassword(account.password);
                        }}
                      >
                        Select
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                  All demo accounts use password: <code className="bg-gray-200 px-1 rounded">password</code>
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-500">
            <p>© 2024 HRMS Pro. Secure enterprise-grade HR management.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}