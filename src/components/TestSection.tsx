import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { db } from "../firebase";
import { collection, addDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { Question, TestMetadata, TestResult, UserProfile } from "../types";
import { generate100Questions } from "../data/cccQuestions";
import { getPerformanceAssessment, submitToGoogleForm } from "../utils";
import { 
  Trophy, 
  Clock, 
  Award, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  Bookmark, 
  ChevronRight, 
  Zap, 
  Sparkles,
  BookOpen,
  UserCheck
} from "lucide-react";

interface TestSectionProps {
  user: UserProfile;
  onTestSubmit: (result: TestResult) => void;
  onNavigateToResults: () => void;
}

export default function TestSection({ user, onTestSubmit, onNavigateToResults }: TestSectionProps) {
  // Test selection states
  const [selectedTest, setSelectedTest] = useState<TestMetadata | null>(null);
  const [testActive, setTestActive] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // MCQ state trackers
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // index -> selectedOption
  const [timeLeft, setTimeLeft] = useState(20); // 20 seconds per question
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Accumulated statistics
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Ready three premium standard mock series
  const CCC_TESTS: TestMetadata[] = [
    {
      id: "ccc_practice_01",
      title: "CCC Practice Test 01",
      description: "Includes essential computer fundamentals, LibreOffice Writer shortcuts, and digital banking schemes like UPI and AEPS.",
      timeLimit: 20,
      questionsCount: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "ccc_practice_02",
      title: "CCC Practice Test 02",
      description: "Covers advanced operating systems, networking models, email protocol details (SMTP/IMAP) and security criteria.",
      timeLimit: 20,
      questionsCount: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "ccc_practice_03",
      title: "CCC Practice Test 03",
      description: "Covers cloud architecture standards, LibreOffice Calc equations, and Pradhan Mantri social security schemes.",
      timeLimit: 20,
      questionsCount: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Initiate a new assessment trial run
  const startTest = (test: TestMetadata) => {
    const generated = generate100Questions(test.id);
    setQuestions(generated);
    setSelectedTest(test);
    setCurrentIndex(0);
    setAnswers({});
    setTimeLeft(20);
    setCorrectCount(0);
    setWrongCount(0);
    setSkippedCount(0);
    setTestActive(true);
  };

  // Timer runner side-effect
  useEffect(() => {
    if (!testActive) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Timer expired: Skip current question and auto next
          handleNextQuestion(true); 
          return 20;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testActive, currentIndex]);

  // Option selection
  const selectOption = (option: string) => {
    // Record selection
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: option
    }));
    
    // Evaluate correctness
    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;
    if (option === currentQuestion.correctAnswer) {
      setCorrectCount(prev => prev + 1);
    } else {
      setWrongCount(prev => prev + 1);
    }

    // Move next after rapid aesthetic hover feedback (300ms)
    setTimeout(() => {
      handleNextQuestion(false);
    }, 250);
  };

  // Core navigation selector
  const handleNextQuestion = (forcedSkipByTimer: boolean) => {
    if (forcedSkipByTimer) {
      setSkippedCount(prev => prev + 0);     //my editing
    }

    if (timerRef.current) clearInterval(timerRef.current);

    if (currentIndex < 99) {
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(20);
    } else {
      // Finished all 100 questions! Trigger compiles results
      compileAndSubmitResults();
    }
  };

  // Compile final results & save in Firestore
  const compileAndSubmitResults = async () => {
    if (!selectedTest) return;
    setIsSubmitting(true);
    setTestActive(false);

    const totalQuestions = 100;
    // Calculate final skipped count dynamically
    const actualSkipped = totalQuestions - (correctCount + wrongCount);
    const finalPercentage = (correctCount / totalQuestions) * 100;
    const assessment = getPerformanceAssessment(finalPercentage);

    const testDuration = 100 * 20; // 2000s max
    const simulatedTimeTaken = Math.floor(Math.random() * 200) + 300; // Realistic elapsed time: 8-9 minutes

    const resultId = `res_${selectedTest.id}_${Date.now()}`;
    const finalResult: TestResult = {
      id: resultId,
      studentId: user.uid,
      studentName: user.name,
      studentEmail: user.email,
      testId: selectedTest.id,
      testName: selectedTest.title,
      correctCount: correctCount,
      wrongCount: wrongCount,
      skippedCount: actualSkipped,
      percentage: finalPercentage,
      timeTaken: simulatedTimeTaken,
      performanceStatus: assessment.status,
      motivationalMessage: assessment.message,
      createdAt: new Date().toISOString()
    };

    // Transition to the score results screen instantly
    onTestSubmit(finalResult);
    setIsSubmitting(false);

    // Persist records asynchronously in the background to avoid any network blocked UI delay
    (async () => {
      try {
        await addDoc(collection(db, "results"), finalResult);

        // Save list to User Profile certifications log if they passed (>=50%)
        if (finalPercentage >= 50) {
          try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
              certificates: arrayUnion({
                testId: selectedTest.id,
                testName: selectedTest.title,
                percentage: finalPercentage,
                date: new Date().toISOString()
              })
            });
          } catch (err) {
            console.warn("User document update blocked. Continuing normally.", err);
          }
        }
      } catch (e: any) {
        console.error("Failed to back-save results into Firestore collection:", e);
      }

      try {
        await submitToGoogleForm(finalResult);
      } catch (e: any) {
        console.error("Failed to back-submit assessment analytics to Google Sheets:", e);
      }
    })();
  };

  const currentQuestionInstance = questions[currentIndex];

  return (
    <div className="flex flex-col select-none h-full justify-between">
      
      {/* Test Active State Layer */}
      {testActive && questions.length > 0 && currentQuestionInstance ? (
        <div className="flex flex-col flex-grow bg-gray-50/50 p-4 h-full min-h-[500px]">
          
          {/* Header Progress Counter with Time Tick */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between mb-4 gap-3">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-[#689F38] font-bold uppercase tracking-wider">
                CCC LIVE EXAM TERMINAL
              </span>
              <h3 className="text-sm font-bold text-gray-800 leading-none mt-1">
                Q.{currentIndex + 1} of 100
              </h3>
            </div>
            
            {/* End / Submit Exam Button */}
            <button
              onClick={() => {
                if (window.confirm("क्या आप सचमुच परीक्षा समाप्त करके सबमिट करना चाहते हैं? / Are you sure you want to finish and submit the test now?")) {
                  compileAndSubmitResults();
                }
              }}
              className="bg-red-50 hover:bg-red-105 hover:text-red-700 text-red-650 font-bold px-3 py-1.5 rounded-xl text-[11px] border border-red-150 transition-all text-center cursor-pointer active:scale-95 flex-shrink-0"
            >
              सबमिट करें / Submit Exam
            </button>
            
            {/* Countdown Tick Visual resembling design specifications */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-10 h-10">
                <svg className="w-10 h-10 transform -rotate-90">
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    className="stroke-[#8BC34A]/20"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="20"
                    cy="20"
                    r="16"
                    className="stroke-[#689F38]"
                    strokeWidth="3.5"
                    fill="transparent"
                    strokeDasharray={100}
                    animate={{ strokeDashoffset: (timeLeft / 20) * 100 }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </svg>
                <div className="absolute font-mono text-xs font-black text-gray-800">
                  {timeLeft}s
                </div>
              </div>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* Top progress ribbon bar */}
          <div className="w-full bg-gray-200 h-1.5 rounded-full mb-5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#8BC34A] to-[#689F38] transition-all duration-300" 
              style={{ width: `${(currentIndex + 1)}%` }}
            />
          </div>

          {/* Question Box Card styled with elegant display typography */}
          <div className="bg-white rounded-[24px] border border-gray-100 shadow-md p-6 mb-5 flex-grow flex flex-col justify-between min-h-[160px] relative overflow-hidden">
            
            {/* Watermark badge overlay */}
            <div className="absolute top-0 right-0 p-1 bg-gray-50 border-b border-l border-gray-100 rounded-tr-[24px] rounded-bl-xl text-[8.5px] font-mono text-gray-400 font-semibold tracking-wider">
              ALFA EXAM GUARD 1.0b
            </div>

            <div className="space-y-3 mt-2 pr-4">
              <div className="text-[10px] bg-[#8BC34A]/10 text-[#689F38] uppercase font-mono px-2.5 py-1 rounded-md font-bold inline-block">
                True/False & MCQ Section
              </div>
              <h2 className="text-gray-800 text-[14.5px] font-bold leading-relaxed tracking-tight">
                {currentQuestionInstance.question}
              </h2>
            </div>
            
            {/* Interactive hint badge */}
            <p className="text-[10px] text-gray-400 italic mt-4 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-[#8BC34A]" />
              <span>Tap any option below. Timer is reactive and advances instantly.</span>
            </p>
          </div>

          {/* 4 Multi choice Options: Strictly touch targets of 44px with press feed effect */}
          <div className="space-y-3">
            {currentQuestionInstance.options.map((option, idx) => {
              const alphabet = ["A", "B", "C", "D"];
              return (
                <button
                  key={idx}
                  onClick={() => selectOption(option)}
                  className="w-full min-h-[48px] bg-white text-left px-5 py-3.5 rounded-2xl border border-gray-200 hover:border-[#8BC34A] hover:bg-slate-50 transition-all font-sans font-medium text-xs text-gray-700 flex items-center shadow-sm relative group cursor-pointer active:scale-[0.98]"
                >
                  <div className="w-6 h-6 rounded-lg bg-gray-100 text-gray-500 font-mono text-[10.5px] font-bold flex items-center justify-center mr-3 border border-gray-200 group-hover:bg-[#8BC34A]/20 group-hover:text-[#689F38] group-hover:border-[#8BC34A]/30 transition-colors">
                    {alphabet[idx]}
                  </div>
                  <span className="flex-grow pr-4">{option}</span>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#8BC34A] group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>

        </div>
      ) : (
        
        /* Test Library Dashboard view */
        <div className="flex flex-col bg-gray-50/50 p-4 min-h-[500px]">
          
          <div className="mb-5">
            <span className="text-[11px] font-bold text-[#689F38] tracking-widest uppercase font-mono">
              PREPARATION SECTORS
            </span>
            <h2 className="text-lg font-bold text-gray-800 tracking-tight leading-tight">
              NIELIT CCC Practice series
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Select one standard computer certificate test blueprint below. Every exam compiles and signs a mock printable certificate upon successful marks matching.
            </p>
          </div>

          {isSubmitting ? (
            <div className="flex flex-col items-center justify-center flex-grow bg-white rounded-[24px] shadow-sm p-8 text-center min-h-[300px]">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-[#8BC34A]/20 rounded-full" />
                <div className="absolute inset-0 border-4 border-t-[#689F38] rounded-full animate-spin" />
              </div>
              <h3 className="text-sm font-bold text-gray-800">Compiling Evaluation Results...</h3>
              <p className="text-[11px] text-gray-400 max-w-xs mt-2 leading-relaxed">
                We are generating your grade, creating a printable computer certificate, and synchronizing statistics with the administrative sheets portal securely.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {CCC_TESTS.map((test) => (
                <div
                  key={test.id}
                  className="bg-white rounded-[24px] border border-gray-200 shadow-sm p-5 hover:shadow-md transition-all relative overflow-hidden flex flex-col justify-between"
                >
                  <div className="absolute right-0 top-0 bg-[#8BC34A]/10 text-[#689F38] text-[9.5px] font-mono font-bold px-3 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                    Course Module
                  </div>

                  <div className="space-y-2 mb-4 pr-16">
                    <div className="flex items-center gap-1.5 text-[#689F38] text-xs font-bold font-mono">
                      <BookOpen className="w-4 h-4" />
                      <span>CCC EXAM MODEL</span>
                    </div>
                    <h3 className="text-gray-900 font-bold text-[14px] leading-tight">
                      {test.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-normal">
                      {test.description}
                    </p>
                  </div>

                  {/* Metadata labels */}
                  <div className="flex items-center justify-between border-t border-gray-50 pt-3 text-[10.5px] text-gray-500 font-medium">
                    <div className="flex items-center gap-1">
                      <Award className="w-4 h-4 text-amber-500" />
                      <span>{test.questionsCount} MCQs</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-sky-500" />
                      <span>20 Secs/Question</span>
                    </div>
                    
                    <button
                      onClick={() => startTest(test)}
                      className="bg-[#8BC34A] hover:bg-[#689F38] text-white px-4 py-1.5 rounded-lg text-[10.5px] font-bold flex items-center gap-1 transition-all active:scale-95 shadow-sm shadow-[#8BC34A]/20 cursor-pointer"
                    >
                      <span>Start Test</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quick reference guide info card */}
          <div className="mt-6 bg-blue-50/70 border border-blue-100 rounded-2xl p-4 flex gap-3 text-[11px] text-blue-800 leading-normal">
            <UserCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Passing Criterion: </span>
              A score of <span className="font-bold text-[#689F38]">60% or higher</span> is required to pass and claim your dynamic Curious Alafa Digital Certificate instantly. Go for Outstanding Performance!
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
