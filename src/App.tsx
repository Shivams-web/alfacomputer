import React, { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection, getDocs, setDoc, addDoc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { UserProfile, Role } from "./types";
import { localStorageHelper } from "./utils";
import Splash from "./components/Splash";
import Auth from "./components/Auth";
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import { 
  Wifi, 
  Battery, 
  Signal, 
  Smartphone, 
  Grid, 
  HelpCircle, 
  Home, 
  Lock, 
  ChevronLeft,
  Settings,
  X,
  Sparkles,
  HelpCircle as QuestionIcon
} from "lucide-react";

export default function App() {
  // Application state variables
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    return localStorageHelper.get<UserProfile | null>("cached_user", null);
  });
  const [loadingAuth, setLoadingAuth] = useState(() => {
    const cached = localStorageHelper.get<UserProfile | null>("cached_user", null);
    return cached ? false : true;
  });
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [digitalTime, setDigitalTime] = useState("");

  // Sync virtual clock ticks
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hrs = now.getHours();
      const mins = now.getMinutes();
      const ampm = hrs >= 12 ? "PM" : "AM";
      hrs = hrs % 12 || 12; // adjust hours
      setDigitalTime(`${hrs}:${mins < 10 ? "0" : ""}${mins} ${ampm}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 30000);
    return () => clearInterval(interval);
  }, []);

  // Firebase auth sessions listener and automatic database seeding
  useEffect(() => {
    // Audit Firestore collection and seed standard records if they are entirely missing
    async function seedInitialDatabaseData() {
      // Execute in parallel background tasks without blocking
      setTimeout(async () => {
        try {
          const [testsSnap, notifSnap, liveSnap] = await Promise.all([
            getDocs(collection(db, "tests")),
            getDocs(collection(db, "notifications")),
            getDocs(collection(db, "live_classes"))
          ]);

          const seedTasks: Promise<any>[] = [];

          if (testsSnap.empty) {
            console.log("Seeding initial computer institute mock tests...");
            const demoTests = [
              {
                id: "ccc_practice_01",
                title: "CCC Practice Test 01",
                description: "Includes essential computer fundamentals, LibreOffice Writer shortcuts, and digital banking schemes like UPI and AEPS.",
                timeLimit: 10,
                questionsCount: 100
              },
              {
                id: "ccc_practice_02",
                title: "CCC Practice Test 02",
                description: "Covers advanced operating systems, networking models, email protocol details (SMTP/IMAP) and security criteria.",
                timeLimit: 10,
                questionsCount: 100
              },
              {
                id: "ccc_practice_03",
                title: "CCC Practice Test 03",
                description: "Covers cloud architecture standards, LibreOffice Calc equations, and Pradhan Mantri social security schemes.",
                timeLimit: 10,
                questionsCount: 100
              }
            ];
            for (const t of demoTests) {
              seedTasks.push(
                setDoc(doc(db, "tests", t.id), {
                  ...t,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                })
              );
            }
          }

          if (notifSnap.empty) {
            seedTasks.push(
              setDoc(doc(db, "notifications", "notif_seed_01"), {
                id: `notif_seed_01`,
                title: "Welcome to The Curious Alafa Computer Institute!",
                message: "This online educational portal mimics top modern EdTech frameworks. Complete study sets on CCC practice sheets, check live streaming schedules, and earn dynamic certificates.",
                createdAt: new Date().toISOString()
              })
            );
          }

          if (liveSnap.empty) {
            seedTasks.push(
              setDoc(doc(db, "live_classes", "live_seed_01"), {
                id: `live_seed_01`,
                title: "CCC Course Intro Lecture - LibreOffice Suites",
                videoUrl: "https://www.youtube.com/embed/sample-ccc-lecture",
                isActive: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })
            );
          }

          if (seedTasks.length > 0) {
            await Promise.all(seedTasks);
            console.log("Database seeded successfully non-blocking.");
          }
        } catch (err) {
          console.warn("Seeding database records suspended (expected in secure setups):", err);
        }
      }, 50);
    }

    const unsubAuth = onAuthStateChanged(auth, async (fireUser) => {
      // If we don't have a cached profile, show spinner immediately; otherwise check quietly
      if (!localStorageHelper.get("cached_user", null)) {
        setLoadingAuth(true);
      }
      if (fireUser) {
        try {
          // Fetch corresponding document inside Firestore with a resilient 7.5s timeout fallback
          const userDocRef = doc(db, "users", fireUser.uid);
          const userSnap = await Promise.race([
            getDoc(userDocRef),
            new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 7500))
          ]) as any;
          
          let profile: UserProfile;
          if (userSnap && userSnap.exists()) {
            profile = userSnap.data() as UserProfile;
            // Always enforce role for millionairetrack1224@gmail.com and administrative / anonymous admin users
            const isAdmin = fireUser.email === "millionairetrack1224@gmail.com" || 
                            fireUser.email?.toLowerCase().includes("admin") || 
                            (fireUser.isAnonymous && localStorageHelper.get<UserProfile | null>("cached_user", null)?.role === Role.ADMIN);
            if (isAdmin) {
              profile.role = Role.ADMIN;
            }
          } else {
            // Auto-fallback structure
            const isAdmin = fireUser.email === "millionairetrack1224@gmail.com" || 
                            fireUser.email?.toLowerCase().includes("admin") || 
                            (fireUser.isAnonymous && localStorageHelper.get<UserProfile | null>("cached_user", null)?.role === Role.ADMIN);
            profile = {
              uid: fireUser.uid,
              email: fireUser.email || (isAdmin ? "millionairetrack1224@gmail.com" : ""),
              name: fireUser.displayName || (isAdmin ? "Director Sir (Curious Alfa Admin)" : "Student Candidate"),
              role: isAdmin ? Role.ADMIN : Role.STUDENT,
              photoURL: fireUser.photoURL || undefined,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
          }
          setCurrentUser(profile);
          localStorageHelper.set("cached_user", profile);
          if (profile.role === Role.ADMIN) {
            seedInitialDatabaseData();
          }
        } catch (e) {
          console.warn("User profile retrieval timed out or encountered network warning. Loading instant fallback profile...", e);
          const isAdmin = fireUser.email === "millionairetrack1224@gmail.com" || 
                          fireUser.email?.toLowerCase().includes("admin") || 
                          (fireUser.isAnonymous && localStorageHelper.get<UserProfile | null>("cached_user", null)?.role === Role.ADMIN);
          const fbProfile: UserProfile = {
            uid: fireUser.uid,
            email: fireUser.email || (isAdmin ? "millionairetrack1224@gmail.com" : "student@alfa.edu"),
            name: fireUser.displayName || (isAdmin ? "Director Sir (Curious Alfa Admin)" : "Alpha Student"),
            role: isAdmin ? Role.ADMIN : Role.STUDENT,
            photoURL: fireUser.photoURL || undefined,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          setCurrentUser(fbProfile);
          localStorageHelper.set("cached_user", fbProfile);
          if (fbProfile.role === Role.ADMIN) {
            seedInitialDatabaseData();
          }
        }
      } else {
        const cachedUser = localStorageHelper.get<UserProfile | null>("cached_user", null);
        if (cachedUser && (cachedUser.uid.startsWith("sandbox-") || cachedUser.uid.startsWith("mock-"))) {
          setCurrentUser(cachedUser);
        } else {
          setCurrentUser(null);
          localStorageHelper.set("cached_user", null);
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      localStorageHelper.set("cached_user", null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white select-none overflow-x-hidden relative font-sans">
      
      {/* Decorative background light elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#8BC34A]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#689F38]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Core Screen Area where React sub-routes load dynamically */}
      <div className="flex-grow bg-white relative flex flex-col h-full w-full">
        
        {showSplash ? (
          <Splash onComplete={() => setShowSplash(false)} />
        ) : loadingAuth ? (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center">
            <div className="relative w-12 h-12 mb-4">
              <div className="absolute inset-0 border-4 border-[#8BC34A]/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-t-[#689F38] rounded-full animate-spin" />
            </div>
            <p className="text-xs text-gray-500 font-medium font-mono">Authenticating Portal Profiles...</p>
          </div>
        ) : currentUser ? (
          
          /* If authenticated, load StudentDashboard or AdminDashboard */
          currentUser.role === Role.ADMIN ? (
            <div className="flex flex-col min-h-screen justify-between bg-white">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between z-10 select-none flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-xs font-black text-gray-500 font-mono tracking-wider">ADMIN SYSTEM CONSOLE</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-650 border border-red-200 px-3.5 py-1.5 rounded-xl hover:bg-red-50 cursor-pointer transition-all active:scale-95"
                >
                  Exit Console / लॉगआउट
                </button>
              </div>

              <div className="flex-grow">
                <AdminDashboard />
              </div>
            </div>
          ) : (
            <StudentDashboard 
              user={currentUser} 
              onLogout={handleLogout} 
              onProfileUpdate={(updatedProfile) => {
                setCurrentUser(updatedProfile);
                localStorageHelper.set("cached_user", updatedProfile);
              }}
            />
          )

        ) : (
          /* Authentication login portal screen loader */
          <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-4 md:p-8">
            <div className="w-full max-w-[420px] bg-white rounded-3xl border border-gray-150 shadow-2xl overflow-hidden relative">
              <Auth onAuthSuccess={(profile) => {
                setCurrentUser(profile);
                localStorageHelper.set("cached_user", profile);
              }} />
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
