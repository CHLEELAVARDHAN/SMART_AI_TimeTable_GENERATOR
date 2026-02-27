import React from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, LifeBuoy, ChevronLeft, Mail, Clock, Book, Bell } from 'lucide-react';

interface Props {
  type: 'PRIVACY' | 'TERMS' | 'SUPPORT';
  onBack: () => void;
}

export const LegalPage: React.FC<Props> = ({ type, onBack }) => {
  const content = {
    PRIVACY: {
      title: "Privacy Policy",
      icon: <Shield className="w-8 h-8 text-emerald-500" />,
      sections: [
        {
          title: "1. Introduction",
          text: "SMART AI Faculty Timetable System respects and protects institutional and personal data. This system is designed to securely manage faculty schedules, subject allocations, and academic planning information.",
          list: ["Protecting user data", "Ensuring transparency", "Preventing unauthorized access", "Maintaining institutional confidentiality"]
        },
        {
          title: "2. Information We Collect",
          subsections: [
            { subtitle: "A. Personal Information", items: ["Faculty Name", "Faculty ID", "Department", "Designation", "Email Address", "Contact Number (optional)"] },
            { subtitle: "B. Academic Data", items: ["Subjects assigned", "Class/Branch details", "Period allocations", "Lab schedules", "Workload distribution"] },
            { subtitle: "C. System Data", items: ["Login timestamps", "IP address", "Activity logs", "Device/browser type"] }
          ]
        },
        {
          title: "3. Purpose of Data Collection",
          text: "The collected data is used for AI-based timetable generation, conflict-free scheduling, faculty workload optimization, academic reporting, performance analytics, and administrative management. We do not sell, rent, or share data with third-party marketing agencies."
        },
        {
          title: "4. Data Security",
          text: "We implement encrypted database storage, role-based access control, secure authentication mechanisms, regular database backups, and audit logging. For cloud deployment, we use HTTPS, firewalls, and environment variable protection."
        },
        {
          title: "5. Data Retention",
          text: "Data is retained for the duration of the academic year, archived based on institutional policy, and deleted upon institutional request."
        },
        {
          title: "6. User Rights",
          text: "Users have the right to view their stored information, request corrections, request deletion (subject to institutional approval), and raise data security concerns."
        },
        {
          title: "7. Cookies",
          text: "The system may use cookies for session management, login persistence, and UI preferences. No tracking or advertisement cookies are used."
        }
      ]
    },
    TERMS: {
      title: "Terms and Conditions",
      icon: <FileText className="w-8 h-8 text-blue-500" />,
      sections: [
        {
          title: "1. Acceptance of Terms",
          text: "By accessing SMART AI Faculty Timetable System, users agree to comply with all system policies and institutional regulations."
        },
        {
          title: "2. Authorized Use",
          text: "This system is intended only for academic institutions, administrative staff, and faculty members. Unauthorized access, data scraping, or misuse is strictly prohibited."
        },
        {
          title: "3. User Responsibilities",
          text: "Users must provide accurate information, maintain confidentiality of login credentials, avoid manipulating timetable logic, and report system errors responsibly."
        },
        {
          title: "4. Intellectual Property",
          text: "The AI scheduling logic, system architecture, database schema, and UI design are the intellectual property of the project creators and institution. Unauthorized reproduction is prohibited."
        },
        {
          title: "5. AI-Based Decisions Disclaimer",
          text: "Timetable generation is AI-assisted. While conflict detection and optimization are implemented, final validation must be done by academic administrators. The system is a decision-support tool, not a replacement for human authority."
        },
        {
          title: "6. System Availability",
          text: "We aim for maximum uptime. However, maintenance windows may occur and updates may temporarily interrupt service. We are not liable for downtime caused by external server issues."
        },
        {
          title: "7. Termination",
          text: "Institutional administrators may suspend or terminate access in case of policy violation, misuse, or security threats."
        }
      ]
    },
    SUPPORT: {
      title: "Support Center",
      icon: <LifeBuoy className="w-8 h-8 text-orange-500" />,
      sections: [
        {
          title: "1. Technical Support",
          text: "Support is available for login issues, timetable generation errors, data import/export issues, conflict resolution problems, and system bugs."
        },
        {
          title: "2. Contact Channels",
          text: "Support can be reached via official email support, institutional IT department, or the admin dashboard ticket system.",
          contact: "support@smartaitimetable.com"
        },
        {
          title: "3. Response Time",
          list: ["Critical issues: Within 24 hours", "General queries: 1–3 working days", "Feature requests: Evaluated in future updates"]
        },
        {
          title: "4. Documentation Support",
          list: ["User manual", "Admin guide", "Deployment documentation", "API documentation"]
        },
        {
          title: "5. System Updates",
          text: "Periodic updates may include improved AI scheduling logic, better conflict detection, performance enhancements, security patches, and UI improvements."
        }
      ]
    }
  };

  const activeContent = content[type];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-4xl mx-auto space-y-8 pb-20"
    >
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="back-btn">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <div className="flex items-center gap-3">
          {activeContent.icon}
          <h1 className="text-4xl font-black uppercase tracking-tighter">{activeContent.title}</h1>
        </div>
      </div>

      <div className="glass rounded-3xl p-8 md:p-12 border border-white/40 shadow-2xl space-y-12">
        {activeContent.sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-2xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="w-8 h-8 bg-zinc-900 text-white rounded-lg flex items-center justify-center text-sm">{idx + 1}</span>
              {section.title}
            </h2>
            
            {section.text && <p className="text-zinc-600 leading-relaxed font-medium">{section.text}</p>}
            
            {section.list && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {section.list.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm font-bold text-zinc-500 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {section.subsections && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {section.subsections.map((sub, i) => (
                  <div key={i} className="space-y-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-100">
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">{sub.subtitle}</h3>
                    <ul className="space-y-2">
                      {sub.items.map((item, j) => (
                        <li key={j} className="text-xs font-bold text-zinc-600 flex items-center gap-2">
                          <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {section.contact && (
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-zinc-900 text-white rounded-2xl font-bold text-sm">
                <Mail className="w-4 h-4" /> {section.contact}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 glass rounded-2xl border border-white/40 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black uppercase text-xs">Secure Data</h4>
            <p className="text-[10px] text-zinc-500 font-bold">End-to-end encryption</p>
          </div>
        </div>
        <div className="p-6 glass rounded-2xl border border-white/40 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black uppercase text-xs">24/7 Access</h4>
            <p className="text-[10px] text-zinc-500 font-bold">High availability</p>
          </div>
        </div>
        <div className="p-6 glass rounded-2xl border border-white/40 flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
            <LifeBuoy className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black uppercase text-xs">Expert Support</h4>
            <p className="text-[10px] text-zinc-500 font-bold">Dedicated assistance</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
