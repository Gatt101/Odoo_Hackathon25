import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Users, TrendingUp, Search, Zap, Shield, Heart, Sparkles, Code2, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Header } from '@/components/shared';

const Index = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Ask & Answer',
      description: 'Get help from a community of experienced developers worldwide.',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Expert Community',
      description: 'Connect with developers, engineers, and coding enthusiasts.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: BookOpen,
      title: 'Learn & Grow',
      description: 'Improve your skills by helping others and learning from experts.',
      color: 'from-pink-500 to-rose-600'
    },
    {
      icon: Search,
      title: 'Find Solutions',
      description: 'Search through thousands of questions and verified answers.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Zap,
      title: 'Fast Responses',
      description: 'Get quick answers to your coding problems and technical questions.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Shield,
      title: 'Quality Content',
      description: 'Community-moderated content ensures high-quality discussions.',
      color: 'from-indigo-500 to-blue-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <motion.div 
            className="absolute top-20 left-10 w-32 h-32 bg-gradient-primary rounded-full opacity-10 blur-3xl"
            animate={{ 
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-accent rounded-full opacity-10 blur-3xl"
            animate={{ 
              y: [0, 20, 0],
              x: [0, -15, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span 
                className="gradient-text inline-flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="h-8 w-8 sm:h-12 sm:w-12" />
                Stack
              </motion.span>
              <span className="text-foreground">It</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Where developers come to learn, share knowledge, and build their careers
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="text-base bg-gradient-primary hover:shadow-glow">
                  <Link to="/questions">
                    <Code2 className="mr-2 h-5 w-5" />
                    Explore Questions
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" variant="outline" className="text-base premium-card border-2">
                  <Link to="/ask">
                    Ask Question
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Why Choose <span className="gradient-text">StackIt</span>?
            </motion.h2>
            <motion.p 
              className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join a thriving community of developers helping each other solve problems and grow together
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="premium-card h-full group relative overflow-hidden">
                  <CardContent className="p-8 text-center relative z-10">
                    <motion.div 
                      className={`h-16 w-16 rounded-2xl bg-gradient-to-r ${feature.color} mx-auto mb-6 flex items-center justify-center shadow-lg`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  </CardContent>
                  
                  {/* Animated background gradient */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)`
                    }}
                  />
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute inset-0 bg-gradient-elegant opacity-10"
            animate={{
              background: [
                "linear-gradient(135deg, hsl(262 80% 50% / 0.1) 0%, hsl(350 75% 60% / 0.1) 50%, hsl(262 85% 60% / 0.1) 100%)",
                "linear-gradient(135deg, hsl(350 75% 60% / 0.1) 0%, hsl(262 85% 60% / 0.1) 50%, hsl(262 80% 50% / 0.1) 100%)",
                "linear-gradient(135deg, hsl(262 80% 50% / 0.1) 0%, hsl(350 75% 60% / 0.1) 50%, hsl(262 85% 60% / 0.1) 100%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Floating elements */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 bg-gradient-primary rounded-full opacity-20 blur-xl"
            animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-accent rounded-full opacity-20 blur-xl"
            animate={{ y: [0, 30, 0], rotate: [0, -180, -360] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 gradient-text"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Ready to Start Your Journey?
            </motion.h2>
            <motion.p 
              className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join thousands of developers who are already part of our community. 
              Ask questions, share knowledge, and grow your skills.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" className="text-base bg-gradient-primary hover:shadow-elegant px-8 py-6">
                  <Link to="/register">
                    <Heart className="mr-2 h-5 w-5" />
                    Join Community
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button asChild size="lg" variant="outline" className="text-base premium-card border-2 px-8 py-6">
                  <Link to="/login">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/50 bg-gradient-subtle">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="flex items-center space-x-3 mb-4 md:mb-0"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="h-10 w-10 rounded-xl bg-gradient-elegant flex items-center justify-center shadow-lg"
                whileHover={{ rotate: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Sparkles className="text-white h-5 w-5" />
              </motion.div>
              <span className="gradient-text text-2xl font-bold">StackIt</span>
            </motion.div>
            
            <motion.div 
              className="flex space-x-8 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {['About', 'Help', 'Privacy', 'Terms'].map((item, index) => (
                <motion.div
                  key={item}
                  whileHover={{ scale: 1.1, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link 
                    to={`/${item.toLowerCase()}`} 
                    className="hover:text-primary transition-colors duration-300 font-medium"
                  >
                    {item}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
