import React, { useState, useEffect } from "react";
import { doc, getDoc, onSnapshot, collection, updateDoc } from "firebase/firestore";
import { db, auth, handleFirestoreError, OperationType } from "../firebase";
import { BottomTab, UserProfile, TestResult, Notification } from "../types";
import { localStorageHelper } from "../utils";
import LiveClassSection from "./LiveClassSection";
import TestSection from "./TestSection";
import ResultSection from "./ResultSection";
import { 
  Home as HomeIcon, 
  Video, 
  BookOpen, 
  Trophy, 
  User, 
  LogOut, 
  Bell, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  Bookmark, 
  Smartphone, 
  TrendingUp, 
  Cpu, 
  Activity, 
  Clock,
  ShieldAlert,
  MessageSquare,
  Phone,
  Mail,
  Camera
} from "lucide-react";

interface StudentDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onProfileUpdate?: (profile: UserProfile) => void;
}

export default function StudentDashboard({ user, onLogout, onProfileUpdate }: StudentDashboardProps) {
  // Current Bottom Navigation Tab
  const [activeTab, setActiveTab] = useState<BottomTab>(BottomTab.HOME);
  
  // Real-time student profile parameters (allows updates)
  const [studentProfile, setStudentProfile] = useState<UserProfile>(user);
  const [recentResult, setRecentResult] = useState<TestResult | null>(null);
  
  // Custom added Support and Photo States
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoError("");

    if (file.size > 1.5 * 1024 * 1024) {
      setPhotoError("इमेज का साइज़ 1.5MB से कम होना चाहिए। / Image size must be under 1.5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      const updatedProfile = { ...studentProfile, photoURL: base64String };
      setStudentProfile(updatedProfile);
      
      // Save locally to session cache and sandbox storage repository
      localStorageHelper.set("cached_user", updatedProfile);
      const emailLower = studentProfile.email ? studentProfile.email.trim().toLowerCase() : "";
      if (emailLower) {
        const localUsers = localStorageHelper.get<Record<string, UserProfile>>("alfa_local_users", {});
        localUsers[emailLower] = updatedProfile;
        localStorageHelper.set("alfa_local_users", localUsers);
      }

      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }

      try {
        const userRef = doc(db, "users", studentProfile.uid);
        await updateDoc(userRef, { photoURL: base64String });
      } catch (err) {
        console.error("Error writing profile picture to Firestore:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  // Notifications systems
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif_seed_01",
      title: "Welcome to The Curious Alafa Computer Institute!",
      message: "This online educational portal mimics top modern EdTech frameworks. Complete study sets on CCC practice sheets, check live streaming schedules, and earn digital passing certificates.",
      createdAt: new Date().toISOString()
    }
  ]);
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [lastReadTimestamp, setLastReadTimestamp] = useState<number>(() => {
    return localStorageHelper.get("last_read_notif", Date.now());
  });

  // Query real-time system parameters on mount
  useEffect(() => {
    // 1. Sync User documents updates (like added certificates)
    const unsubUser = onSnapshot(doc(db, "users", user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const uProfile = docSnap.data() as UserProfile;
        setStudentProfile(uProfile);
        // Save locally to keep in-session cache warm
        localStorageHelper.set("cached_user", uProfile);
        const emailLower = uProfile.email ? uProfile.email.trim().toLowerCase() : "";
        if (emailLower) {
          const localUsers = localStorageHelper.get<Record<string, UserProfile>>("alfa_local_users", {});
          localUsers[emailLower] = uProfile;
          localStorageHelper.set("alfa_local_users", localUsers);
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      
      // Fallback: fetch profile picture & certificates from local storage if sandbox mode
      const localUsers = localStorageHelper.get<Record<string, UserProfile>>("alfa_local_users", {});
      const emailLower = user.email ? user.email.trim().toLowerCase() : "";
      const savedProfile = localUsers[emailLower];
      if (savedProfile) {
        setStudentProfile(savedProfile);
      } else {
        const cached = localStorageHelper.get<UserProfile | null>("cached_user", null);
        if (cached && cached.email.trim().toLowerCase() === emailLower) {
          setStudentProfile(cached);
        } else {
          setStudentProfile(user);
        }
      }
    });

    // 2. Sync all announcements in realtime
    const unsubNotif = onSnapshot(collection(db, "notifications"), (snapshot) => {
      const records: Notification[] = [];
      snapshot.forEach((doc) => {
        records.push({ ...doc.data(), id: doc.id } as Notification);
      });
      // Sort by creation desc
      records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setNotifications(records);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "notifications");
      setNotifications([
        {
          id: "notif_seed_01",
          title: "Welcome to The Curious Alafa Computer Institute!",
          message: "This online educational portal mimics top modern EdTech frameworks. Complete study sets on CCC practice sheets, check live streaming schedules, and earn digital passing certificates.",
          createdAt: new Date().toISOString()
        }
      ]);
    });

    return () => {
      unsubUser();
      unsubNotif();
    };
  }, [user.uid]);

  // Compute unread announcements counts dynamically
  const unreadCount = notifications.filter(
    n => new Date(n.createdAt).getTime() > lastReadTimestamp
  ).length;

  const handleOpenNotificationCenter = () => {
    setShowNotificationCenter(true);
    const now = Date.now();
    setLastReadTimestamp(now);
    localStorageHelper.set("last_read_notif", now);
  };

  // Test submitted callback: cache on panel and toggle Tab visually to Results!
  const handleTestPassed = (result: TestResult) => {
    setRecentResult(result);

    // Save results to local_results_history cache immediately
    const existingLocalResults = localStorageHelper.get<TestResult[]>("local_results_history", []);
    if (!existingLocalResults.some(r => r.id === result.id)) {
      existingLocalResults.unshift(result);
      localStorageHelper.set("local_results_history", existingLocalResults);
    }

    if (result.percentage >= 50) {
      const currentCertificates = studentProfile.certificates || [];
      const newCertificate = {
        testId: result.testId,
        testName: result.testName,
        percentage: result.percentage,
        date: new Date().toISOString()
      };
      const alreadyHas = currentCertificates.some((c: any) => c.testId === result.testId);
      if (!alreadyHas) {
        const updatedProfile: UserProfile = {
          ...studentProfile,
          certificates: [...currentCertificates, newCertificate]
        };
        setStudentProfile(updatedProfile);
        
        // Save to Sandbox Users Repository & browser cache
        localStorageHelper.set("cached_user", updatedProfile);
        const emailLower = studentProfile.email ? studentProfile.email.trim().toLowerCase() : "";
        if (emailLower) {
          const localUsers = localStorageHelper.get<Record<string, UserProfile>>("alfa_local_users", {});
          localUsers[emailLower] = updatedProfile;
          localStorageHelper.set("alfa_local_users", localUsers);
        }

        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }
      }
    }
    setActiveTab(BottomTab.RESULTS);
  };

  return (
    <div className="flex flex-col min-h-[580px] h-full justify-between bg-white relative overflow-hidden select-none">
      
      {/* Scrollable Container Wrapper */}
      <div className="flex-grow overflow-y-auto pb-24">
        
        {/* TAB 1: HOME VIEW (Designed specifically like the uploaded illustration metadata) */}
        {activeTab === BottomTab.HOME && (
          <div className="flex flex-col text-[#222222]">
            
            {/* Top Primary Green Banner Overlaps With Smiley Mascot Icon as per reference artwork */}
            <div className="w-full bg-[#8BC34A] text-white pt-8 pb-10 px-6 rounded-b-[40px] shadow-md relative overflow-hidden flex flex-col justify-between">
              {/* Soft decorative visual blur vectors */}
              <div className="absolute top-2 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl" />
              <div className="absolute left-[-20px] top-[-20px] w-36 h-36 bg-[#689F38]/20 rounded-full blur-2xl font-serif" />

              {/* Upper Section holding user metadata and Notification alerts */}
              <div className="flex items-center justify-between z-10 mb-4">
                <div className="flex items-center gap-3">
                  
                  {/* Circular Profile Mascot Ring inspired by reference image */}
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center p-0.5 shadow-md relative hover:scale-105 active:scale-95 transition-all">
                    <div className="w-full h-full bg-[#8BC34A] rounded-full flex items-center justify-center relative overflow-hidden">
                      {studentProfile.photoURL ? (
                        <img 
                          src={studentProfile.photoURL} 
                          alt="Student Avatar" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <svg viewBox="0 0 100 100" className="w-9 h-9 fill-white mt-1">
                          <circle cx="33" cy="40" r="7" />
                          <circle cx="67" cy="40" r="7" />
                          <path d="M25,55 Q50,85 75,55" stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Student bio notes */}
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/70 font-mono tracking-widest uppercase font-semibold leading-none">
                      WELCOME STUDENT
                    </span>
                    <h3 className="text-base font-extrabold font-sans tracking-wide mt-1 leading-tight">
                      {studentProfile.name.split(" ")[0]} Study
                    </h3>
                  </div>
                </div>

                {/* Unified Unread Notification icon bell trigger */}
                <button
                  onClick={handleOpenNotificationCenter}
                  className="bg-white/15 hover:bg-white/20 p-2.5 rounded-full border border-white/10 transition-all relative cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-white" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white font-mono text-[8.5px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-[#8BC34A] animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Institute Branding subtitle */}
              <div className="z-10 mt-2 px-1">
                <h4 className="text-[11px] font-black uppercase font-mono tracking-wider text-white/90">
                  The Curious Alafa Tech
                </h4>
                <p className="text-[10px] text-white/70 leading-normal -mt-0.5 font-bold">
                  Approved Computer Institute Center
                </p>
              </div>
            </div>

            {/* Overlapping Action Card Elements mimicking reference artwork lists */}
            <div className="px-5 -mt-6 z-20 space-y-4">
              
              {/* Card 1: Study Button Card -> Shifts to Tests */}
              <div 
                onClick={() => setActiveTab(BottomTab.TESTS)}
                className="bg-white border border-gray-150/80 rounded-[24px] shadow-lg shadow-gray-200/50 p-4.5 flex items-center justify-between hover:border-[#8BC34A] cursor-pointer transform hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#8BC34A]/10 text-[#689F38] flex items-center justify-center border border-[#8BC34A]/20">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-800 leading-none">CCC Trial Assessments</h4>
                    <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">Practice Test Series 01, 02, and 03.</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center border border-gray-100 font-bold text-gray-400">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 2: Live Room Card -> Shifts to Live streams */}
              <div 
                onClick={() => setActiveTab(BottomTab.LIVE)}
                className="bg-white border border-gray-150/80 rounded-[24px] shadow-lg shadow-gray-200/50 p-4.5 flex items-center justify-between hover:border-[#8BC34A] cursor-pointer transform hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                    <Video className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-800 leading-none">Enter Live Lecture Room</h4>
                    <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">Stream premium IT lectures direct in real-time.</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center border border-gray-100 font-bold text-gray-400">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 3: Results History -> Shifts to Results stats */}
              <div 
                onClick={() => setActiveTab(BottomTab.RESULTS)}
                className="bg-white border border-gray-150/80 rounded-[24px] shadow-lg shadow-gray-200/50 p-4.5 flex items-center justify-between hover:border-[#8BC34A] cursor-pointer transform hover:-translate-y-0.5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-800 leading-none">Academic Scorecards</h4>
                    <p className="text-[10px] text-gray-400 mt-1.5 leading-tight">View certifications, grades & improvement curves.</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center border border-gray-100 font-bold text-gray-400">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* Card 4: Daily Announcements box inside list */}
              <div 
                onClick={handleOpenNotificationCenter}
                className="bg-gradient-to-r from-emerald-500/10 to-transparent border border-emerald-500/10 rounded-[24px] p-4.5 flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                    <Bell className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-800 leading-none">Notification Center</h4>
                    <p className="text-[10px] text-gray-500 mt-1.5 leading-tight">Explore morning schedule details and batch closures.</p>
                  </div>
                </div>
                <div className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center border border-emerald-500/20 text-[#689F38] group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

            </div>

            {/* Quick study motivational badge */}
            <div className="mx-5 mt-6 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-4.5 rounded-2xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-500 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-gray-850">Institute Daily Directive</h4>
                <p className="text-[10px] text-gray-500 leading-normal">
                  "Practice daily on LibreOffice Writer shortcut keys and transaction limits. Standard CCC certificate requires completing all three Trials."
                </p>
              </div>
            </div>

            {/* Social Follow Links */}
            <div className="mx-5 mt-6 bg-white border border-gray-150 rounded-2xl p-4 shadow-md space-y-3">
              <h4 className="text-xs font-black text-gray-800 flex items-center gap-1.5 justify-center md:justify-start">
                <span className="w-1.5 h-3.5 bg-[#8BC34A] rounded-full" />
                <span>Follow Institute & Owner / सोशल मीडिया लिंक्स:</span>
              </h4>
              <div className="grid grid-cols-4 gap-2 md:max-w-md">
                <a 
                  href="https://youtube.com/@curiousalafa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-red-50 hover:bg-red-100 border border-red-50 text-red-650 transition-all active:scale-95 text-center"
                >
                  <Video className="w-4.5 h-4.5 mb-1 text-red-600" />
                  <span className="text-[9px] font-extrabold text-red-700">YouTube</span>
                </a>
                <a 
                  href="https://instagram.com/curiousalafa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-50 text-pink-650 transition-all active:scale-95 text-center"
                >
                  <Activity className="w-4.5 h-4.5 mb-1 text-pink-500" />
                  <span className="text-[9px] font-extrabold text-pink-700">Instagram</span>
                </a>
                <a 
                  href="https://t.me/curiousalafa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-50 text-sky-650 transition-all active:scale-95 text-center"
                >
                  <TrendingUp className="w-4.5 h-4.5 mb-1 text-sky-500" />
                  <span className="text-[9px] font-extrabold text-sky-700">Telegram</span>
                </a>
                <a 
                  href="https://facebook.com/curiousalafa" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-50 text-indigo-650 transition-all active:scale-95 text-center"
                >
                  <Smartphone className="w-4.5 h-4.5 mb-1 text-indigo-600" />
                  <span className="text-[9px] font-extrabold text-indigo-700">Facebook</span>
                </a>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: LIVE CLASSES VIEW */}
        {activeTab === BottomTab.LIVE && (
          <div className="p-4 space-y-4">
            <div className="mb-2">
              <span className="text-[10px] font-mono text-[#689F38] bg-[#8BC34A]/10 px-2.5 py-1 rounded-full font-bold">VIRTUAL SECTORS</span>
              <h2 className="text-lg font-bold text-gray-800 tracking-tight leading-none mt-2.5">Live Lectures Desk</h2>
              <p className="text-xs text-gray-400 mt-1">Play active computer classes published by course administrators.</p>
            </div>
            <LiveClassSection user={studentProfile} />
          </div>
        )}

        {/* TAB 3: MCQ TESTING VIEW */}
        {activeTab === BottomTab.TESTS && (
          <TestSection 
            user={studentProfile} 
            onTestSubmit={handleTestPassed}
            onNavigateToResults={() => setActiveTab(BottomTab.RESULTS)}
          />
        )}

        {/* TAB 4: SCORECARD RESULTS HISTORY */}
        {activeTab === BottomTab.RESULTS && (
          <ResultSection 
            user={studentProfile} 
            recentResult={recentResult} 
            onClearRecent={() => setRecentResult(null)} 
            onSelectRecent={(res) => setRecentResult(res)}
          />
        )}

        {/* TAB 5: STUDENT DETAILS PROFILE */}
        {activeTab === BottomTab.PROFILE && (
          <div className="p-5 flex flex-col space-y-5 animate-fade-in">
            
            <div className="flex flex-col items-center text-center pb-4 border-b border-gray-100">
              {/* Profile Avatar Frame with interactive photo changing capability */}
              <div className="w-24 h-24 rounded-full bg-[#8BC34A]/25 border-4 border-white flex items-center justify-center p-0.5 shadow-md relative group mb-3">
                <div className="w-full h-full bg-[#8BC34A]/25 rounded-full flex items-center justify-center overflow-hidden">
                  {studentProfile.photoURL ? (
                    <img src={studentProfile.photoURL} alt="Student Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <User className="w-12 h-12 text-white" />
                  )}
                </div>
                
                {/* File Upload trigger camera overlay */}
                <label className="absolute bottom-0 right-0 bg-[#689F38] hover:bg-[#8BC34A] text-white p-2 rounded-full cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all border border-white">
                  <Camera className="w-3.5 h-3.5" />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePhotoUpload} 
                    className="hidden" 
                  />
                </label>
              </div>

              {photoError && (
                <p className="text-[10px] font-bold text-red-650 bg-red-50 px-2.5 py-1.5 rounded-xl border border-red-150 mb-2 max-w-xs">{photoError}</p>
              )}

              <h3 className="text-gray-900 font-extrabold text-sm tracking-wide">{studentProfile.name}</h3>
              <p className="text-[10.5px] font-mono text-gray-500 mt-0.5">{studentProfile.email}</p>
              <p className="text-[10px] text-gray-400 mt-1 italic font-semibold">फोटो बदलने के लिए कैमरा आइकॉन/बटन दबाएं।</p>
            </div>

            {/* Profile Statistics Parameter Summary */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="text-gray-400 font-bold">COURSE:</span>
                <span className="text-gray-700 font-extrabold text-right">Computer Concept Course (CCC)</span>
              </div>
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="text-gray-400 font-bold">REGISTRATION KEY:</span>
                <span className="text-gray-700 font-extrabold text-right">{studentProfile.uid.substring(0, 10).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center text-[10.5px]">
                <span className="text-gray-400 font-bold">CERTIFICATIONS CLAIMED:</span>
                <span className="text-[#689F38] font-bold text-right">
                  {(studentProfile as any).certificates?.length || 0}
                </span>
              </div>
            </div>

            {/* Action options list */}
            <div className="space-y-4">
              <button
                onClick={onLogout}
                className="w-full bg-[#689F38] hover:bg-red-700 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out Academic Session</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* FLOAT BOTTOM MOBILE DOCK NAVIGATION BAR (Inspired exactly by the reference design illustration) */}
      <div className="fixed bottom-4 left-6 right-6 max-w-xl mx-auto bg-[#8BC34A] rounded-[24px] shadow-lg shadow-[#8BC34A]/30 px-5 py-3 z-40 flex justify-between items-center text-white">
        
        {/* Dock item 1: Home */}
        <button
          onClick={() => setActiveTab(BottomTab.HOME)}
          className={`p-2 rounded-xl transition-all ${
            activeTab === BottomTab.HOME 
              ? "bg-white text-[#689F38] scale-105 shadow-sm" 
              : "text-white/80 hover:text-white"
          }`}
        >
          <HomeIcon className="w-5 h-5" />
        </button>

        {/* Dock item 2: Live Room */}
        <button
          onClick={() => setActiveTab(BottomTab.LIVE)}
          className={`p-2 rounded-xl transition-all ${
            activeTab === BottomTab.LIVE 
              ? "bg-white text-[#689F38] scale-105 shadow-sm" 
              : "text-white/80 hover:text-white"
          }`}
        >
          <Video className="w-5 h-5" />
        </button>

        {/* Dock item 3: Tests */}
        <button
          onClick={() => setActiveTab(BottomTab.TESTS)}
          className={`p-2 rounded-xl transition-all relative ${
            activeTab === BottomTab.TESTS 
              ? "bg-white text-[#689F38] scale-105 shadow-sm" 
              : "text-white/80 hover:text-white"
          }`}
        >
          <BookOpen className="w-5 h-5" />
        </button>

        {/* Dock item 4: Results */}
        <button
          onClick={() => setActiveTab(BottomTab.RESULTS)}
          className={`p-2 rounded-xl transition-all ${
            activeTab === BottomTab.RESULTS 
              ? "bg-white text-[#689F38] scale-105 shadow-sm" 
              : "text-white/80 hover:text-white"
          }`}
        >
          <Trophy className="w-5 h-5" />
        </button>

        {/* Dock item 5: Profile */}
        <button
          onClick={() => setActiveTab(BottomTab.PROFILE)}
          className={`p-2 rounded-xl transition-all ${
            activeTab === BottomTab.PROFILE 
              ? "bg-white text-[#689F38] scale-105 shadow-sm" 
              : "text-white/80 hover:text-white"
          }`}
        >
          <User className="w-5 h-5" />
        </button>

      </div>

      {/* FLOATING OVERLAY DIALOG FOR NOTIFICATION CENTER */}
      {showNotificationCenter && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-[380px] border border-gray-100 shadow-2xl relative overflow-hidden h-[450px] flex flex-col justify-between animate-slide-up">
            
            <div className="bg-gradient-to-r from-[#8BC34A] to-[#689F38] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-white" />
                <span className="text-xs font-black tracking-wider font-mono">Academic Notification Center</span>
              </div>
              <button
                onClick={() => setShowNotificationCenter(false)}
                className="text-white hover:text-gray-200 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            {/* Notification center lists */}
            <div className="p-4 flex-grow overflow-y-auto space-y-3.5 bg-gray-50/50">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <div key={n.id} className="bg-white rounded-2xl border border-gray-150 p-3 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#8BC34A]" />
                    <div className="pl-2 space-y-1">
                      <span className="text-[9px] font-mono text-gray-400 block">
                        {new Date(n.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric", month: "long"
                        })}
                      </span>
                      <h4 className="text-xs font-semibold text-gray-800 leading-tight">{n.title}</h4>
                      <p className="text-[10.5px] text-gray-500 leading-relaxed font-sans">{n.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 text-gray-400 text-xs italic">
                  No notifications recorded from the institute office yet.
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-3.5 border-t border-gray-100">
              <button
                onClick={() => setShowNotificationCenter(false)}
                className="w-full bg-[#8BC34A] hover:bg-[#689F38] text-white py-2 rounded-xl text-xs font-bold text-center cursor-pointer"
              >
                Dismiss Notifications
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Chats & Support Floating Action Button */}
      <button
        onClick={() => setShowSupportModal(true)}
        className="fixed bottom-24 right-5 z-40 bg-[#8BC34A] hover:bg-[#689F38] text-white p-3.5 rounded-full shadow-xl hover:scale-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white"
        title="Help & Chat Support"
        id="chats-support-float-btn"
      >
        <MessageSquare className="w-5 h-5 animate-pulse text-white" />
        <span className="text-[10px] font-black uppercase tracking-wider pr-1 hidden md:inline">Support</span>
      </button>

      {/* FLOATING CHATS & SUPPORT POPUP MODAL */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-[390px] border border-gray-100 shadow-2xl overflow-hidden animate-slide-up flex flex-col justify-between">
            
            {/* Custom Support Banner */}
            <div className="bg-gradient-to-r from-[#8BC34A] to-[#689F38] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span className="text-xs font-black tracking-wider uppercase font-mono">Chats & Support Desk</span>
              </div>
              <button
                onClick={() => setShowSupportModal(false)}
                className="text-white hover:text-gray-200 font-bold text-sm bg-black/10 hover:bg-black/20 px-2 py-0.5 rounded-full transition-all"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 bg-white">
              <div className="text-center space-y-2 pb-2 border-b border-gray-100">
                <h4 className="text-sm font-extrabold text-gray-800">Curious Alafa Help Center</h4>
                <p className="text-xs text-gray-500 leading-normal">
                  यदि आपको CCC सर्टिफिकेट, लाइव लेक्चर, असेसमेंट, या रिकॉर्ड में कोई सहायता चाहिए, तो हमारी टीम से संपर्क करें:
                </p>
              </div>

              <div className="space-y-3 pt-1">
                
                {/* 1. WhatsApp Action button */}
                <a 
                  href="https://wa.me/918874272735?text=Hello%20Curious%20Alafa%20Institute!%20I%20need%20some%20help%20with%20CCC%20portal."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 text-emerald-800 transition-all active:scale-95 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                      <MessageSquare className="w-5 h-5 fill-emerald-600/10 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <h5 className="text-xs font-bold leading-none">WhatsApp Chat</h5>
                      <span className="text-[10px] text-emerald-600 font-semibold block mt-1">तुरंत चैट शुरू करें (Chat Live)</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-emerald-500 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* 2. Direct Call Action btn */}
                <a 
                  href="tel:+918874272735"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-sky-50 hover:bg-sky-100 border border-sky-100 text-sky-850 transition-all active:scale-95 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h5 className="text-xs font-bold leading-none">Direct Call Support</h5>
                      <span className="text-[10px] text-sky-600 font-semibold block mt-1">+91 8874272735 पर कॉल करें</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-sky-500 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* 3. Email Action btn */}
                <a 
                  href="mailto:millionairetrack1224@gmail.com?subject=Curious Alafa CCC Portal Help"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-850 transition-all active:scale-95 group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-605">
                      <Mail className="w-4.5 h-4.5" />
                    </div>
                    <div className="text-left">
                      <h5 className="text-xs font-bold leading-none">Email Support</h5>
                      <span className="text-[10px] text-indigo-600 font-semibold block mt-1">लिखकर सहायता प्राप्त करें (Email Us)</span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-indigo-500 group-hover:translate-x-0.5 transition-transform" />
                </a>

              </div>
            </div>

            {/* Footer dismiss button */}
            <div className="bg-gray-50 p-4 border-t border-gray-100">
              <button
                onClick={() => setShowSupportModal(false)}
                className="w-full bg-[#8BC34A] hover:bg-[#689F38] text-white py-2.5 rounded-xl text-xs font-bold text-center cursor-pointer transition-all active:scale-95"
              >
                Close Support Panel / बंद करें
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
