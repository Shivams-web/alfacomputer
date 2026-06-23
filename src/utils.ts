import { TestResult } from "./types";

/**
 * Recommends performance assessment tags and positive messages based on test percentages.
 */
export function getPerformanceAssessment(percentage: number): { status: string; message: string; color: string } {
  if (percentage >= 90) {
    return {
      status: "Outstanding Performance",
      message: "You are exam ready. Outstanding command of computer concept fundamentals!",
      color: "text-green-600 bg-green-50 border-green-200"
    };
  } else if (percentage >= 80) {
    return {
      status: "Excellent Work",
      message: "Keep practicing. Exceptional performance - you're almost in the top tier!",
      color: "text-lime-600 bg-lime-50 border-lime-200"
    };
  } else if (percentage >= 70) {
    return {
      status: "Very Good",
      message: "A little more practice will make you stronger. Solid understanding of details!",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200"
    };
  } else if (percentage >= 60) {
    return {
      status: "Good Attempt",
      message: "Continue regular practice. Steady progress - stay focused on LibreOffice & Banking systems.",
      color: "text-indigo-600 bg-indigo-50 border-indigo-200"
    };
  } else {
    return {
      status: "More Practice Required",
      message: "Focus on weak topics and try again. Don't worry, consistency is key to master computer concepts!",
      color: "text-orange-600 bg-orange-50 border-orange-200"
    };
  }
}

/**
 * Automates submission of result parameters to Google Forms / Google Sheets.
 * Admins can configure their prefilled Form ID and Entry parameters.
 */
export async function submitToGoogleForm(
  result: TestResult,
  customFormConfig?: { formUrl: string; entries: Record<string, string> }
) {
  try {
    // If no custom URL is configured by the Admin, we'll log it in console
    // and attempt to post to a default placeholder that demonstrates the real integration.
    const formUrl = customFormConfig?.formUrl || "https://docs.google.com/forms/d/e/1FAIpQLSe-Xb8fG7H6xPrBsc-3r49v7p_Z2F_FaymY3S7f6_sample/formResponse";
    
    const entries = customFormConfig?.entries || {
      name: "entry.1000001",
      email: "entry.1000002",
      testName: "entry.1000003",
      correct: "entry.1000004",
      wrong: "entry.1000005",
      skipped: "entry.1000006",
      percentage: "entry.1000007",
      date: "entry.1000008",
      time: "entry.1000009"
    };

    const formData = new FormData();
    formData.append(entries.name, result.studentName);
    formData.append(entries.email, result.studentEmail);
    formData.append(entries.testName, result.testName);
    formData.append(entries.correct, result.correctCount.toString());
    formData.append(entries.wrong, result.wrongCount.toString());
    formData.append(entries.skipped, result.skippedCount.toString());
    formData.append(entries.percentage, `${result.percentage.toFixed(1)}%`);
    formData.append(entries.date, new Date(result.createdAt).toLocaleDateString());
    formData.append(entries.time, `${result.timeTaken}s`);

    // We do a non-blocking background submit to trigger Google Forms.
    // Since Google Forms expects standard form submission, an 'opaque' mode fetch triggers successfully without CORS blockers.
    await fetch(formUrl, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });
    
    console.log("Automatically synchronized assessment analytics with Google Form sheets successfully.");
    return true;
  } catch (error) {
    console.error("Failed to automatically synchronize with Google Sheets:", error);
    return false;
  }
}

/**
 * Safe Local Storage managers
 */
export const localStorageHelper = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const val = localStorage.getItem(`curious_alfa_${key}`);
      return val ? JSON.parse(val) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(`curious_alfa_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error("Local storage sync error: ", e);
    }
  }
};
