import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Users, Layout, ChevronRight, Sparkles, ArrowLeft, Plus, Minus, Instagram, Facebook, Mail, Chrome, MessageCircle, Youtube } from 'lucide-react';
import { TimetableConfig, TimetableResult } from './types';
import { createEmptyConfig } from './constants';
import { TimetableForm } from './components/TimetableForm';
import { TimetableResultDisplay } from './components/TimetableResultDisplay';
import { LegalPage } from './components/LegalPage';
import { Scheduler } from './utils/scheduler';
import { cn } from './utils/cn';

type AppState = 'LANDING' | 'CONFIG_COUNT' | 'FORMS' | 'RESULTS' | 'PRIVACY' | 'TERMS' | 'SUPPORT';

export default function App() {
  const [state, setState] = useState<AppState>('LANDING');
  const [formCount, setFormCount] = useState(1);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [configs, setConfigs] = useState<TimetableConfig[]>([]);
  const [results, setResults] = useState<TimetableResult[]>([]);

  const startSingle = () => {
    setFormCount(1);
    setConfigs([createEmptyConfig(Math.random().toString())]);
    setState('FORMS');
  };

  const startMultiple = () => {
    setState('CONFIG_COUNT');
  };

  const handleCountSubmit = () => {
    const newConfigs = Array.from({ length: formCount }, () => createEmptyConfig(Math.random().toString()));
    setConfigs(newConfigs);
    setState('FORMS');
  };

  const handleFormSubmit = (data: TimetableConfig) => {
    const updatedConfigs = [...configs];
    updatedConfigs[currentFormIndex] = data;
    setConfigs(updatedConfigs);

    if (currentFormIndex < formCount - 1) {
      setCurrentFormIndex(currentFormIndex + 1);
    } else {
      // Generate all
      const scheduler = new Scheduler();
      const generatedResults = scheduler.generateMultiple(updatedConfigs);
      setResults(generatedResults);
      setState('RESULTS');
    }
  };

  const goBack = () => {
    if (state === 'CONFIG_COUNT') setState('LANDING');
    if (state === 'FORMS') {
      if (currentFormIndex > 0) {
        setCurrentFormIndex(currentFormIndex - 1);
      } else {
        setState(formCount > 1 ? 'CONFIG_COUNT' : 'LANDING');
      }
    }
    if (state === 'RESULTS') setState('FORMS');
    if (['PRIVACY', 'TERMS', 'SUPPORT'].includes(state)) setState('LANDING');
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans selection:bg-zinc-900 selection:text-white relative overflow-hidden">
      {/* Background Rainbow Glow */}
      <div className="fixed inset-0 pointer-events-none opacity-5">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-500 blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] rounded-full bg-blue-500 blur-[120px] animate-pulse delay-700" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45%] h-[45%] rounded-full bg-green-500 blur-[120px] animate-pulse delay-1000" />
      </div>

      {/* Navigation / Header */}
      <nav className="sticky top-0 z-50 glass border-b border-white/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setState('LANDING')}
          >
            <div className="bg-zinc-900 p-2 rounded-lg group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter uppercase">SmartSchedule</span>
          </div>
          
          {state !== 'LANDING' && (
            <button 
              onClick={goBack}
              className="back-btn"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {state === 'LANDING' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-12 py-20"
            >
              <div className="space-y-4 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-bold uppercase tracking-widest">
                  <Sparkles className="w-3 h-3" /> AI-Powered Scheduling
                </div>
                <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase flex flex-col items-center">
                  {["FACULTY", "TIMETABLE", "GENERATOR"].map((word, wIdx) => (
                    <div key={wIdx} className="flex justify-center">
                      {word.split("").map((char, i) => (
                        <span 
                          key={i} 
                          className="text-glow"
                          style={{ animationDelay: `${(wIdx * 5 + i) * 0.1}s` }}
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  ))}
                </h1>
                <p className="text-xl text-zinc-500 font-medium max-w-2xl mx-auto">
                  Generate conflict-free, optimized academic schedules for multiple departments and branches in seconds.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <button 
                  onClick={startSingle}
                  className="group relative p-8 glass rounded-3xl border border-white/40 shadow-xl hover:shadow-2xl transition-all text-left overflow-hidden rainbow-border btn-hover"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Layout className="w-32 h-32" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                      <Layout className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase">Single Form</h3>
                      <p className="text-zinc-500">Generate a timetable for a single class or section.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold group-hover:translate-x-2 transition-transform">
                      Get Started <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                <button 
                  onClick={startMultiple}
                  className="group relative p-8 bg-zinc-900 text-white rounded-3xl shadow-xl hover:shadow-2xl transition-all text-left overflow-hidden rainbow-border btn-hover"
                >
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users className="w-32 h-32" />
                  </div>
                  <div className="relative z-10 space-y-4">
                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:bg-white group-hover:text-zinc-900 transition-colors">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase">Multiple Forms</h3>
                      <p className="text-zinc-400">Manage multiple sections and prevent faculty clashes globally.</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-bold group-hover:translate-x-2 transition-transform">
                      Configure Multiple <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {state === 'CONFIG_COUNT' && (
            <motion.div 
              key="count"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-md mx-auto text-center space-y-8 py-20"
            >
              <div className="space-y-2">
                <h2 className="text-4xl font-black uppercase tracking-tighter">How many timetables?</h2>
                <p className="text-zinc-500">Select the number of sections or classes to generate.</p>
              </div>

              <div className="flex items-center justify-center gap-8">
                <button 
                  onClick={() => setFormCount(Math.max(1, formCount - 1))}
                  className="w-16 h-16 rounded-2xl glass border border-white/40 shadow-md flex items-center justify-center hover:bg-white/50 transition-all active:scale-90"
                >
                  <Minus className="w-8 h-8" />
                </button>
                
                <div className="relative h-24 w-24 flex items-center justify-center overflow-hidden">
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={formCount}
                      initial={{ y: 20, opacity: 0, scale: 0.5 }}
                      animate={{ y: 0, opacity: 1, scale: 1 }}
                      exit={{ y: -20, opacity: 0, scale: 0.5 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="text-7xl font-black tabular-nums absolute"
                    >
                      {formCount}
                    </motion.span>
                  </AnimatePresence>
                </div>

                <button 
                  onClick={() => setFormCount(formCount + 1)}
                  className="w-16 h-16 rounded-2xl bg-zinc-900 text-white shadow-md flex items-center justify-center hover:bg-zinc-800 transition-all active:scale-90"
                >
                  <Plus className="w-8 h-8" />
                </button>
              </div>

              <button 
                onClick={handleCountSubmit}
                className="w-full py-5 bg-zinc-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl rainbow-border btn-hover"
              >
                Continue to Forms
              </button>
            </motion.div>
          )}

          {state === 'FORMS' && (
            <motion.div 
              key={`form-${currentFormIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <TimetableForm 
                initialData={configs[currentFormIndex]}
                onSubmit={handleFormSubmit}
                onBack={goBack}
                formIndex={currentFormIndex}
                totalForms={formCount}
                isLast={currentFormIndex === formCount - 1}
              />
            </motion.div>
          )}

          {state === 'RESULTS' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h2 className="text-4xl font-black uppercase tracking-tighter">Generated Timetables</h2>
                  <p className="text-zinc-500">Optimized and conflict-free schedules ready for review.</p>
                </div>
                <button 
                  onClick={() => setState('LANDING')}
                  className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-all rainbow-border btn-hover"
                >
                  Create New
                </button>
              </div>
              <TimetableResultDisplay 
                results={results} 
                onModify={(index) => {
                  setCurrentFormIndex(index);
                  setState('FORMS');
                }} 
              />
            </motion.div>
          )}

          {['PRIVACY', 'TERMS', 'SUPPORT'].includes(state) && (
            <LegalPage 
              type={state as 'PRIVACY' | 'TERMS' | 'SUPPORT'} 
              onBack={goBack} 
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-black/5 py-12 px-6 bg-white print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-zinc-900 p-1.5 rounded-md">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-lg tracking-tighter uppercase">SmartSchedule</span>
          </div>
          <p className="text-sm text-zinc-400 font-medium">
            © 2026 Smart Faculty Timetable Generator. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm font-bold text-zinc-500">
            <button onClick={() => setState('PRIVACY')} className="hover:text-zinc-900 transition-colors" title="Privacy Policy">Privacy</button>
            <button onClick={() => setState('TERMS')} className="hover:text-zinc-900 transition-colors" title="Terms of Service">Terms</button>
            <div className="flex items-center gap-3">
              <button onClick={() => setState('SUPPORT')} className="hover:text-zinc-900 transition-colors" title="Customer Support">Support</button>
              <div className="flex items-center gap-2 ml-2 border-l border-zinc-200 pl-4">
                <a href="https://www.diet.edu.in" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-blue-500 transition-colors" title="Official Website"><Chrome className="w-4 h-4" /></a>
                <a href="https://www.instagram.com/diet_akp_vskp?igsh=OGhhbW84eW90bXFq" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#E4405F] transition-colors" title="Instagram"><Instagram className="w-4 h-4" /></a>
                <a href="https://www.youtube.com/@dadiinstituteofengineering7876" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#FF0000] transition-colors" title="YouTube"><Youtube className="w-4 h-4" /></a>
                <a href="https://whatsapp.com/channel/0029Va7pdvW05MUWuVARVE1J" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#25D366] transition-colors" title="WhatsApp Channel"><MessageCircle className="w-4 h-4" /></a>
                <a href="mailto:principal@diet.edu.in" className="text-zinc-400 hover:text-zinc-900 transition-colors" title="Email Principal"><Mail className="w-4 h-4" /></a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
