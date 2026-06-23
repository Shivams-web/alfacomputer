import React, { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  setDoc 
} from "firebase/firestore";
import { UserProfile, TestMetadata, LiveClass, TestResult, Notification, Role } from "../types";
import { 
  BarChart, 
  Users, 
  BookOpen, 
  Radio, 
  Bell, 
  FileSpreadsheet, 
  Search, 
  SlidersHorizontal,
  Plus, 
  Trash2, 
  Check, 
  TrendingUp, 
  Send,
  UserCheck,
  AlertCircle,
  FileDown,
  MonitorPlay
} from "lucide-react";

export default function AdminDashboard() {
  // Collection Lists with immediate high-fidelity mock/fallback details for ultra-fast <50ms first render
  const [students, setStudents] = useState<UserProfile[]>([
    {
      uid: "mock-student-uid-1",
      email: "gaurav.sharma@gmail.com",
      name: "Gaurav Sharma (Student)",
      role: Role.STUDENT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      uid: "mock-student-uid-2",
      email: "neha.patel@gmail.com",
      name: "Neha Patel (Student)",
      role: Role.STUDENT,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [tests, setTests] = useState<TestMetadata[]>([
    {
      id: "ccc_practice_01",
      title: "CCC Practice Test 01",
      description: "Includes essential computer fundamentals, LibreOffice Writer shortcuts, and digital banking schemes like UPI and AEPS.",
      timeLimit: 10,
      questionsCount: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "ccc_practice_02",
      title: "CCC Practice Test 02",
      description: "Covers advanced operating systems, networking models, email protocol details (SMTP/IMAP) and security criteria.",
      timeLimit: 10,
      questionsCount: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [results, setResults] = useState<TestResult[]>([
    {
      id: "res_demo_789",
      studentId: "mock-student-uid-1",
      studentName: "Gaurav Sharma (Student)",
      studentEmail: "gaurav.sharma@gmail.com",
      testId: "ccc_practice_01",
      testName: "CCC Pass Practice Assessment",
      correctCount: 82,
      wrongCount: 12,
      skippedCount: 6,
      percentage: 82.0,
      timeTaken: 1140,
      performanceStatus: "EXCELLENT Grade A",
      motivationalMessage: "Exceptional computing agility! Keep practicing LibreOffice shortcut commands to secure top percentiles.",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([
    {
      id: "live_seed_01",
      title: "CCC Course Intro Lecture - LibreOffice Suites",
      videoUrl: "https://www.youtube.com/embed/sample-ccc-lecture",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "notif_seed_01",
      title: "Welcome to The Curious Alafa Computer Institute!",
      message: "This online educational portal mimics top modern EdTech frameworks. Complete study sets on CCC practice sheets, check live streaming schedules, and earn digital passing certificates.",
      createdAt: new Date().toISOString()
    }
  ]);

  // Filtering / Search terms
  const [searchStudent, setSearchStudent] = useState("");
  const [filterTest, setFilterTest] = useState("all");

  // Admin broadcast binders
  const [notifTitle, setNotifTitle] = useState("");
  const [notifMessage, setNotifMessage] = useState("");

  // Live Class modifier binders
  const [liveTitle, setLiveTitle] = useState("");
  const [liveUrl, setLiveUrl] = useState("https://www.youtube.com/embed/sample-ccc-lecture");
  
  // Status reporting
  const [statusMsg, setStatusMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Monitor Collections on mount
  useEffect(() => {
    setLoading(true);

    const unsubStudents = onSnapshot(collection(db, "users"), (sn) => {
      const u: UserProfile[] = [];
      sn.forEach(d => u.push(d.data() as UserProfile));
      setStudents(u.filter(student => student.role === Role.STUDENT));
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "users");
      setStudents([
        {
          uid: "mock-student-uid",
          email: "student@gmail.com",
          name: "Gaurav Kumar (Student)",
          role: Role.STUDENT,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    });

    const unsubTests = onSnapshot(collection(db, "tests"), (sn) => {
      const t: TestMetadata[] = [];
      sn.forEach(d => t.push(d.data() as TestMetadata));
      setTests(t);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "tests");
      setTests([
        {
          id: "ccc_practice_01",
          title: "CCC Practice Test 01",
          description: "Includes essential computer fundamentals, LibreOffice Writer shortcuts, and digital banking schemes like UPI and AEPS.",
          timeLimit: 10,
          questionsCount: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: "ccc_practice_02",
          title: "CCC Practice Test 02",
          description: "Covers advanced operating systems, networking models, email protocol details (SMTP/IMAP) and security criteria.",
          timeLimit: 10,
          questionsCount: 100,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    });

    const unsubResults = onSnapshot(collection(db, "results"), (sn) => {
      const r: TestResult[] = [];
      sn.forEach(d => r.push(d.data() as TestResult));
      setResults(r);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "results");
      setResults([
        {
          id: "res_demo_789",
          studentId: "mock-student-uid",
          studentName: "Gaurav Kumar (Student)",
          studentEmail: "student@gmail.com",
          testId: "ccc_practice_01",
          testName: "CCC Pass Practice Assessment",
          correctCount: 82,
          wrongCount: 12,
          skippedCount: 6,
          percentage: 82.0,
          timeTaken: 1140,
          performanceStatus: "EXCELLENT Grade A",
          motivationalMessage: "Exceptional computing agility! Keep practicing LibreOffice shortcut commands to secure top percentiles.",
          createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
        }
      ]);
    });

    const unsubLive = onSnapshot(collection(db, "live_classes"), (sn) => {
      const l: LiveClass[] = [];
      sn.forEach(d => l.push({ ...d.data(), id: d.id } as LiveClass));
      setLiveClasses(l);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "live_classes");
      setLiveClasses([
        {
          id: "live_seed_01",
          title: "CCC Course Intro Lecture - LibreOffice Suites",
          videoUrl: "https://www.youtube.com/embed/sample-ccc-lecture",
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    });

    const unsubNotif = onSnapshot(collection(db, "notifications"), (sn) => {
      const n: Notification[] = [];
      sn.forEach(d => n.push({ ...d.data(), id: d.id } as Notification));
      setNotifications(n);
      setLoading(false);
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
      setLoading(false);
    });

    return () => {
      unsubStudents();
      unsubTests();
      unsubResults();
      unsubLive();
      unsubNotif();
    };
  }, []);

  // Broadcast Instant Notification
  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifMessage) return;
    setStatusMsg("");
    setErrorMsg("");

    try {
      const notifId = `notif_${Date.now()}`;
      const newNotif: Notification = {
        id: notifId,
        title: notifTitle,
        message: notifMessage,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, "notifications", notifId), newNotif);
      setNotifTitle("");
      setNotifMessage("");
      setStatusMsg("Notification broadcasted to all student notification centers successfully!");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to broadcast notification.");
    }
  };

  // Delete generic announcement
  const handleDeleteNotif = async (id: string) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
      setStatusMsg("Announcements list updated successfully.");
      setTimeout(() => setStatusMsg(""), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete notification.");
    }
  };

  // Delete live class
  const handleDeleteLiveClass = async (id: string) => {
    try {
      await deleteDoc(doc(db, "live_classes", id));
      setStatusMsg("Lecture/Stream session was deleted successfully.");
      setTimeout(() => setStatusMsg(""), 2000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete live class.");
    }
  };

  // Add or Toggle Live Class Url
  const handleUpdateLiveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle || !liveUrl) return;
    setStatusMsg("");
    setErrorMsg("");

    try {
      const liveId = `live_${Date.now()}`;
      
      // Deactivate all previous live items so this new one becomes the single active stream
      const deactivatePromises = liveClasses.map(live => {
        if (live.isActive) {
          return updateDoc(doc(db, "live_classes", live.id), { isActive: false });
        }
        return Promise.resolve();
      });
      await Promise.all(deactivatePromises);

      const liveData = {
        id: liveId,
        title: liveTitle,
        videoUrl: liveUrl,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await setDoc(doc(db, "live_classes", liveId), liveData);

      setLiveTitle("");
      setLiveUrl("");
      setStatusMsg("Virtual Live Desk updated successfully! This video is now active for all students.");
      setTimeout(() => setStatusMsg(""), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to update virtual URL.");
    }
  };

  // Toggle active status computed to lock/unlock live streams
  const handleToggleLiveStream = async (liveId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "live_classes", liveId), {
        isActive: !currentStatus
      });
      setStatusMsg(`Live stream ${!currentStatus ? "activated" : "deactivated"}!`);
      setTimeout(() => setStatusMsg(""), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Export Results Data to JSON File
  const handleExportDataJson = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `curious_alfa_results_export_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.warn(err);
    }
  };

  // Filter students based on search query
  const filteredStudents = students.filter(std => 
    std.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
    std.email.toLowerCase().includes(searchStudent.toLowerCase())
  );

  // Compute time-dependent greetings
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good Morning (शुभ प्रभात)";
    if (hrs < 17) return "Good Afternoon (शुभ दोपहर)";
    if (hrs < 21) return "Good Evening (शुभ संध्या)";
    return "Good Night (शुभरात्रि)";
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-[580px] h-full overflow-y-auto select-none p-4 pb-12 space-y-5">
      
      {/* Top Banner Administration tag welcoming owner Abhishek Sharma */}
      <div className="bg-[#689F38] text-white p-5 rounded-[24px] shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <span className="text-[9px] font-mono tracking-widest bg-[#8BC34A] px-2 py-0.5 rounded-full font-bold uppercase">
            ADMIN SYSTEM MASTER
          </span>
          <h2 className="text-base font-extrabold tracking-tight mt-1">
            {getGreeting()}, Abhishek Sharma! 👋
          </h2>
          <p className="text-[10px] text-white/90 mt-0.5">Curious Alafa Control Panel — Monitor metrics and manage academic databases.</p>
        </div>
        <Users className="w-8 h-8 text-white/40" />
      </div>

      {statusMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-2xl text-xs flex items-center gap-1.5 leading-tight">
          <Check className="w-4 h-4 text-emerald-600 font-bold" />
          <span>{statusMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-2xl text-xs flex items-center gap-1.5 leading-tight">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. THREE STANDARD STATISTICAL METRIC CARDS */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <Users className="w-5 h-5 text-[#689F38] mb-2" />
          <div>
            <div className="text-lg font-black text-gray-800 leading-none">{students.length}</div>
            <div className="text-[9px] text-gray-400 font-semibold uppercase mt-1">Pupils</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <BookOpen className="w-5 h-5 text-[#8BC34A] mb-2" />
          <div>
            <div className="text-lg font-black text-gray-800 leading-none">
              {results.length > 0 ? `${Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length)}%` : "N/A"}
            </div>
            <div className="text-[9px] text-gray-400 font-semibold uppercase mt-1">Avg Score</div>
          </div>
        </div>

        <div className="bg-white p-3 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col justify-between">
          <BarChart className="w-5 h-5 text-amber-500 mb-2" />
          <div>
            <div className="text-lg font-black text-gray-800 leading-none">{results.length}</div>
            <div className="text-[9px] text-gray-400 font-semibold uppercase mt-1">Quizzes</div>
          </div>
        </div>
      </div>

      {/* 3. BROADCAST MESSAGING AREA */}
      <div className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
          <Bell className="w-4 h-4 text-[#689F38]" />
          <h3 className="text-xs font-bold text-gray-800">Dispatch Push Announcement</h3>
        </div>

        <form onSubmit={handleSendNotification} className="space-y-3">
          <input
            type="text"
            required
            value={notifTitle}
            onChange={(e) => setNotifTitle(e.target.value)}
            placeholder="Notification Title / Subject"
            className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:border-[#8BC34A] focus:outline-none focus:bg-white text-gray-800"
          />

          <textarea
            required
            value={notifMessage}
            onChange={(e) => setNotifMessage(e.target.value)}
            placeholder="Write announcement body message here..."
            rows={3}
            className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:border-[#8BC34A] focus:outline-none focus:bg-white text-gray-800"
          />

          <button
            type="submit"
            className="w-full bg-[#8BC34A] hover:bg-[#689F38] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm shadow-[#8BC34A]/25"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast Message Now</span>
          </button>
        </form>

        {/* Existing Announcements quick view */}
        {notifications.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">BROADCAST LOGS</h4>
            <div className="space-y-2 max-h-36 overflow-y-auto">
              {notifications.map(n => (
                <div key={n.id} className="bg-gray-50 p-2.5 rounded-xl border border-gray-100 flex items-center justify-between">
                  <div className="pr-4">
                    <span className="text-[11px] font-bold text-gray-800 leading-tight block">{n.title}</span>
                    <span className="text-[9.5px] text-gray-400 block truncate max-w-[200px] mt-0.5">{n.message}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteNotif(n.id)}
                    className="text-gray-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. VIRTUAL LIVE DESK ASSIGNEE LINK */}
      <div className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
          <MonitorPlay className="w-4 h-4 text-[#689F38]" />
          <h3 className="text-xs font-bold text-gray-800">Virtual Classroom Desk</h3>
        </div>

        <form onSubmit={handleUpdateLiveClass} className="space-y-3">
          <input
            type="text"
            required
            value={liveTitle}
            onChange={(e) => setLiveTitle(e.target.value)}
            placeholder="Lecture Subject (e.g. LibreOffice Intro)"
            className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:border-[#8BC34A] focus:outline-none focus:bg-white text-gray-800"
          />

          <input
            type="url"
            required
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="Live Streaming Link / Player Stream URL"
            className="w-full px-3.5 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:border-[#8BC34A] focus:outline-none focus:bg-white text-gray-800"
          />

          <button
            type="submit"
            className="w-full bg-[#8BC34A] hover:bg-[#689F38] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Launch Virtual Live Link</span>
          </button>
        </form>

        {/* Existing Class link list toggle status */}
        {liveClasses.length > 0 && (
          <div className="pt-2 space-y-2">
            {liveClasses.map(live => (
              <div key={live.id} className="bg-gray-50 p-3 rounded-2xl border border-gray-100 flex items-center justify-between gap-2">
                <div className="min-w-0 flex-grow">
                  <h4 className="text-xs font-bold text-gray-800 leading-tight truncate">{live.title}</h4>
                  <p className="text-[9.5px] text-gray-500 mt-1 truncate font-mono">{live.videoUrl}</p>
                </div>
                
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => handleToggleLiveStream(live.id, live.isActive)}
                    className={`px-2.5 py-1.5 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                      live.isActive 
                        ? "bg-red-100 text-red-700 hover:bg-red-200" 
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    }`}
                  >
                    {live.isActive ? "OFF" : "LIVE ENABLE"}
                  </button>

                  <button
                    onClick={() => handleDeleteLiveClass(live.id)}
                    className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                    title="Delete Live Stream"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. REGISTERED CANDIDATES SEARCH SECTOR */}
      <div className="bg-white border border-gray-200 rounded-[24px] p-5 shadow-sm space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-gray-50">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#689F38]" />
            <h3 className="text-xs font-bold text-gray-800">Pupil Directory</h3>
          </div>
          
          <button
            onClick={handleExportDataJson}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-2.5 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition active:scale-95"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>Export database</span>
          </button>
        </div>

        {/* Search bar input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            placeholder="Search students names or emails..."
            className="w-full pl-11 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:border-[#8BC34A] focus:outline-none focus:bg-white text-gray-800"
          />
        </div>

        {/* Directory Output list */}
        {filteredStudents.length > 0 ? (
          <div className="space-y-2.5 max-h-56 overflow-y-auto">
            {filteredStudents.map(student => (
              <div key={student.uid} className="bg-gray-50/50 p-2.5 rounded-xl border border-gray-150 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 leading-tight">{student.name}</h4>
                  <span className="text-[9.5px] text-gray-400 font-mono block mt-0.5">{student.email}</span>
                </div>
                
                <span className="text-[9px] font-mono text-[#689F38] font-bold bg-[#8BC34A]/10 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  STUDENT
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-xs text-gray-400 italic">No registered pupils fit current terms.</div>
        )}
      </div>

    </div>
  );
}
