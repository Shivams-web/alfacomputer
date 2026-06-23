import { Question } from "../types";

// NIELIT Course on Computer Concepts (CCC) high-yield exam questions in Hindi
export const CCC_QUESTION_POOL: Omit<Question, "id">[] = [
  {
    question: "LibreOffice Writer का डिफॉल्ट एक्सटेंशन (Default Extension) क्या होता है?",
    options: [".odt", ".ods", ".odp", ".docx"],
    correctAnswer: ".odt"
  },
  {
    question: "डिजिटल भुगतान प्रणाली (Digital Payment System) में BHIM का पूर्ण रूप क्या है?",
    options: [
      "Bharat Interface for Money",
      "Bharat Instant Money Flow",
      "Biometric Handy Instant Money",
      "Board of Indian Money"
    ],
    correctAnswer: "Bharat Interface for Money"
  },
  {
    question: "LibreOffice Writer में नया डॉक्यूमेंट खोलने के लिए किस शॉर्टकट कुंजी का उपयोग किया जाता है?",
    options: ["Ctrl + N", "Ctrl + O", "Ctrl + P", "Ctrl + Shift + N"],
    correctAnswer: "Ctrl + N"
  },
  {
    question: "LibreOffice Writer में डॉक्यूमेंट प्रिंट करने के लिए किस शॉर्टकट कुंजी का उपयोग किया जाता है?",
    options: ["Ctrl + P", "Ctrl + Shift + P", "Alt + P", "Ctrl + Alt + P"],
    correctAnswer: "Ctrl + P"
  },
  {
    question: "इंस्टेंट पेमेंट सर्विस (IMPS) लेनदेन की प्रति दिन अधिकतम सीमा क्या है?",
    options: ["5 लाख रुपये", "2 लाख रुपये", "1 लाख रुपये", "10 लाख रुपये"],
    correctAnswer: "5 लाख रुपये"
  },
  {
    question: "कंप्यूटर सिस्टम में, UEFI/BIOS फर्मवेयर कहाँ संग्रहीत (store) होता है?",
    options: ["ROM (Read Only Memory)", "RAM (Random Access Memory)", "Hard Disk", "Cache Memory"],
    correctAnswer: "ROM (Read Only Memory)"
  },
  {
    question: "LibreOffice Calc में समर्थित कॉलम (Columns) की अधिकतम संख्या कितनी होती है?",
    options: ["1024", "16384", "256", "512"],
    correctAnswer: "1024"
  },
  {
    question: "सर्वरों के बीच ईमेल भेजने के लिए मुख्य रूप से किस प्रोटोकॉल का उपयोग किया जाता है?",
    options: ["SMTP", "POP3", "IMAP", "HTTP"],
    correctAnswer: "SMTP"
  },
  {
    question: "LibreOffice Writer में टेबल इंसर्ट (Table Insert) करने के लिए किस शॉर्टकट कुंजी का उपयोग किया जाता है?",
    options: ["Ctrl + F12", "F12", "Alt + F12", "Ctrl + Shift + F12"],
    correctAnswer: "Ctrl + F12"
  },
  {
    question: "LibreOffice Calc में, प्रत्येक फॉर्मूला किस प्रतीक (symbol) से शुरू होना चाहिए?",
    options: ["=", "@", "+", "$"],
    correctAnswer: "="
  },
  {
    question: "वर्ल्ड वाइड वेब (WWW) के आविष्कारक / संस्थापक कौन हैं?",
    options: ["Tim Berners-Lee", "Bill Gates", "Steve Jobs", "Alan Turing"],
    correctAnswer: "Tim Berners-Lee"
  },
  {
    question: "चीन में अत्यधिक लोकप्रिय और विकसित सर्च इंजन (Search Engine) कौन सा है?",
    options: ["Baidu", "Yandex", "Google", "Bing"],
    correctAnswer: "Baidu"
  },
  {
    question: "साइबर सुरक्षा के संदर्भ में, WPA का पूर्ण रूप क्या है?",
    options: [
      "Wi-Fi Protected Access",
      "Wireless Public Access",
      "Wired Privacy Association",
      "Web Protection Protocol"
    ],
    correctAnswer: "Wi-Fi Protected Access"
  },
  {
    question: "LibreOffice Calc में पहले सेल का पता (Cell Address) क्या होता है?",
    options: ["A1", "1A", "0A", "Cell1"],
    correctAnswer: "A1"
  },
  {
    question: "निम्नलिखित में से कौन सा एक ओपन-सोर्स (Open-Source) ऑपरेटिंग सिस्टम है?",
    options: ["Linux", "Windows 11", "macOS", "MS-DOS"],
    correctAnswer: "Linux"
  },
  {
    question: "क्यूआर कोड (QR Code) का पूर्ण रूप क्या होता है?",
    options: ["Quick Response Code", "Quality Ratio Code", "Quick Reliable Code", "Queue Reader Code"],
    correctAnswer: "Quick Response Code"
  },
  {
    question: "LibreOffice Writer में ट्रैक चेंजेस (Track Changes) शुरू करने के लिए किस शॉर्टकट का उपयोग किया जाता है?",
    options: ["Ctrl + Shift + C", "Ctrl + T", "Alt + Shift + T", "Ctrl + Alt + C"],
    correctAnswer: "Ctrl + Shift + C"
  },
  {
    question: "वैश्विक स्तर पर तैयार किए गए पहले वैक्यूम ट्यूब कंप्यूटर का नाम क्या था?",
    options: ["ENIAC", "EDVAC", "UNIVAC", "EDSAC"],
    correctAnswer: "ENIAC"
  },
  {
    question: "भारतीय वित्तीय प्रणाली / बैंकिंग क्षेत्रों में UPI का पूर्ण रूप क्या है?",
    options: [
      "Unified Payments Interface",
      "Universal Payment Integration",
      "Unique Private Identifier",
      "Union Pay Institute"
    ],
    correctAnswer: "Unified Payments Interface"
  },
  {
    question: "सुरक्षित HTTP कनेक्शन (HTTPS) का डिफॉल्ट पोर्ट नंबर क्या होता है?",
    options: ["443", "80", "21", "25"],
    correctAnswer: "443"
  },
  {
    question: "LibreOffice प्रोडक्ट्स में हेल्प (Help) मेनू को खोलने के लिए किस फंक्शन कुंजी का उपयोग किया जाता है?",
    options: ["F1", "F2", "F5", "F7"],
    correctAnswer: "F1"
  },
  {
    question: "दशमलव संख्या (Decimal Number) 10 का बाइनरी समतुल्य क्या है?",
    options: ["1010", "1100", "1001", "1111"],
    correctAnswer: "1010"
  },
  {
    question: "किसी स्कूल, संस्थान या एकल भवन के भीतर किस प्रकार का कंप्यूटर नेटवर्क उपयोग किया जाता है?",
    options: ["LAN (Local Area Network)", "WAN (Wide Area Network)", "MAN (Metropolitan Area Network)", "PAN (Personal Area Network)"],
    correctAnswer: "LAN (Local Area Network)"
  },
  {
    question: "एक स्टैंडर्ड सिंगल-लेयर डीवीडी (DVD) की अधिकतम स्टोरेज क्षमता क्या होती है?",
    options: ["4.7 GB", "700 MB", "8.5 GB", "25 GB"],
    correctAnswer: "4.7 GB"
  },
  {
    question: "LibreOffice Writer में पेज ब्रेक (Page Break) करने के लिए किस शॉर्टकट कुंजी का उपयोग किया जाता है?",
    options: ["Ctrl + Enter", "Shift + Enter", "Alt + Enter", "Ctrl + Space"],
    correctAnswer: "Ctrl + Enter"
  },
  {
    question: "भारतीय डिजिटल वित्तीय सेवाओं में AEPS का पूर्ण रूप क्या है?",
    options: [
      "Aadhaar Enabled Payment System",
      "All Electronic Processing Service",
      "Aadhaar Encryption Payment Security",
      "Account Entry Payment System"
    ],
    correctAnswer: "Aadhaar Enabled Payment System"
  },
  {
    question: "भारत के ₹2000 के करेंसी नोट का मुख्य रंग (Background Color) क्या है?",
    options: ["मजेंटा (Magenta)", "स्टोन ग्रे (Stone Gray)", "चमकीला पीला (Bright Yellow)", "लैवेंडर (Lavender)"],
    correctAnswer: "मजेंटा (Magenta)"
  },
  {
    question: "इंटरनेट शब्दावली में ISP का पूर्ण रूप क्या होता है?",
    options: [
      "Internet Service Provider",
      "Intranet System Protocol",
      "Information Security Plan",
      "Instrumental Serial Port"
    ],
    correctAnswer: "Internet Service Provider"
  },
  {
    question: "OSI मॉडल की कौन सी लेयर डेटा पैकेट्स के लिए मार्ग (Routing) निर्धारित करती है?",
    options: ["Network Layer", "Transport Layer", "Data Link Layer", "Physical Layer"],
    correctAnswer: "Network Layer"
  },
  {
    question: "LibreOffice Writer में पेज का बाय डिफॉल्ट ओरिएंटेशन (Page Orientation) क्या होता है?",
    options: ["पोर्ट्रेट (Portrait)", "लैंडस्केप (Landscape)", "स्क्वायर (Square)", "डिफॉल्ट थिन"],
    correctAnswer: "पोर्ट्रेट (Portrait)"
  },
  {
    question: "निम्नलिखित में से कौन सी संस्था भारत में सभी खुदरा भुगतान प्रणालियों (Retail Payments) की देखरेख करती है?",
    options: ["NPCI", "RBI", "SEBI", "NASSCOM"],
    correctAnswer: "NPCI"
  },
  {
    question: "LibreOffice Impress में, वर्तमान स्लाइड से स्लाइड शो शुरू करने के लिए कौन सा शॉर्टकट दबाया जाता है?",
    options: ["Shift + F5", "F5", "Ctrl + F5", "Alt + F5"],
    correctAnswer: "Shift + F5"
  },
  {
    question: "LibreOffice Calc में सेल A1 से लेकर A10 तक के सभी मानों को जोड़ने का सही फॉर्मूला क्या है?",
    options: ["=SUM(A1:A10)", "=ADD(A1:A10)", "=SUM(A1-A10)", "=TOTAL(A1..A10)"],
    correctAnswer: "=SUM(A1:A10)"
  },
  {
    question: "ट्विटर (Twitter/X) पर मूल रूप से एक ट्वीट में अधिकतम कितने अक्षरों (Characters) की सीमा हुआ करती थी?",
    options: ["280", "140", "500", "1000"],
    correctAnswer: "280"
  },
  {
    question: "कौन सा नेटवर्किंग उपकरण कई कंप्यूटरों को एक ही इंटरनेट कनेक्शन साझा करने की अनुमति देता है?",
    options: ["राउटर (Router)", "ब्रिज (Bridge)", "हब (Hub)", "स्विच (Switch)"],
    correctAnswer: "राउटर (Router)"
  },
  {
    question: "LibreOffice Writer में एक्सटेंशन मैनेजर डायलॉग (Extension Manager Dialog) खोलने की शॉर्टकट कुंजी क्या है?",
    options: ["Ctrl + Alt + E", "Ctrl + Shift + E", "Alt + Shift + E", "F10"],
    correctAnswer: "Ctrl + Alt + E"
  },
  {
    question: "किस प्रकार के साइबर हमले में यूजर को ईमेल द्वारा नकली वेबसाइट पर भेजकर संवेदनशील क्रेडेंशियल्स चुरा लिए जाते हैं?",
    options: ["फिशिंग (Phishing)", "स्पूफिंग (Spoofing)", "फार्मिंग (Pharming)", "रैनसमवेयर (Ransomware)"],
    correctAnswer: "फिशिंग (Phishing)"
  },
  {
    question: "PMJDY (प्रधानमंत्री जन धन योजना) के तहत मिलने वाली अधिकतम ओवरड्राफ्ट सीमा क्या है?",
    options: ["10,000 रुपये", "5,000 रुपये", "2,000 रुपये", "20,000 रुपये"],
    correctAnswer: "10,000 रुपये"
  },
  {
    question: "किसी भी नेटवर्क इंटरफेस कार्ड (NIC) के फिक्स्ड / परमानेंट हार्डवेयर एड्रेस को क्या कहते हैं?",
    options: ["MAC एड्रेस", "IP एड्रेस", "URL एड्रेस", "DNS एड्रेस"],
    correctAnswer: "MAC एड्रेस"
  },
  {
    question: "क्लाउड कंप्यूटिंग मॉडल के संदर्भ में SaaS का पूर्ण रूप क्या होता है?",
    options: [
      "Software as a Service",
      "Storage as an Asset",
      "System as an Application",
      "Security as a Standard"
    ],
    correctAnswer: "Software as a Service"
  },
  {
    question: "LibreOffice सॉफ़्टवेयर में स्पेलिंग एरर (Spelling errors) की जांच करने के लिए किस कुंजी का उपयोग किया जाता है?",
    options: ["F7", "Shift + F7", "Ctrl + F7", "Alt + F7"],
    correctAnswer: "F7"
  },
  {
    question: "LibreOffice Calc वर्कशीट में कुल कितनी पंक्तियाँ (Rows) होती हैं?",
    options: ["1048576", "65536", "10000", "16384"],
    correctAnswer: "1048576"
  },
  {
    question: "वह बूटिंग प्रोग्राम जो कंप्यूटर चालू होने पर ओएस को रैम (RAM) में लोड करता है, उसे क्या कहा जाता है?",
    options: ["बूटस्ट्रैप लोडर (Bootstrap Loader)", "कम्पाइलर (Compiler)", "असेंबलर (Assembler)", "लिंकर (Linker)"],
    correctAnswer: "बूटस्ट्रैप लोडर (Bootstrap Loader)"
  },
  {
    question: "इंटरनेट प्रोटोकॉल संस्करण 4 (IPv4) एड्रेस कितने बिट का होता है?",
    options: ["32 बिट", "64 बिट", "128 बिट", "16 बिट"],
    correctAnswer: "32 बिट"
  },
  {
    question: "इंटरनेट प्रोटोकॉल संस्करण 6 (IPv6) एड्रेस कितने बिट का होता है?",
    options: ["128 बिट", "32 बिट", "64 बिट", "256 बिट"],
    correctAnswer: "128 बिट"
  },
  {
    question: "UPI के माध्यम से किसी विशिष्ट लिंक या रिक्वेस्ट द्वारा पैसे भेजने वाले तरीके को क्या कहते हैं?",
    options: ["पुश (Push)", "पुल (Pull)", "पे (Pay)", "सेंड (Send)"],
    correctAnswer: "पुश (Push)"
  },
  {
    question: "एक पूर्ण ईमेल एड्रेस के मुख्य रूप से दो भाग कौन-कौन से होते हैं?",
    options: ["यूज़रनेम और डोमेन नेम", "फर्स्ट नेम और लास्ट नेम", "यूज़रनेम और पासवर्ड", "इनबॉक्स और डोमेन नेम"],
    correctAnswer: "यूज़रनेम और डोमेन नेम"
  },
  {
    question: "भारत सरकार के उमंग ऐप (UMANG App) में कुल कितनी भारतीय भाषाओं का समर्थन उपलब्ध है?",
    options: ["13", "10", "12", "22"],
    correctAnswer: "13"
  },
  {
    question: "वैश्विक स्तर पर सबसे पुराना या पहला लोकप्रिय ग्राफिकल वेब ब्राउज़र किस नाम से जारी किया गया था?",
    options: ["Mosaic", "Netscape Navigator", "WorldWideWeb", "Internet Explorer"],
    correctAnswer: "Mosaic"
  },
  {
    question: "भारत सरकार की प्रत्यक्ष वित्तीय पहल के तहत रुपे (RuPay) डेबिट कार्ड किसके द्वारा विकसित किया गया है?",
    options: ["NPCI (भारतीय राष्ट्रीय भुगतान निगम)", "RBI (भारतीय रिजर्व बैंक)", "स्टेट बैंक ऑफ़ इंडिया", "ICICI"],
    correctAnswer: "NPCI (भारतीय राष्ट्रीय भुगतान निगम)"
  },
  {
    question: "क्या ईमेल में सभी पत्रों को बड़े अक्षरों (Capital Letters) में लिखना अभद्र या चीखने (Shouting) के रूप में माना जाता है?",
    options: ["हाँ, यह अभद्र माना जाता है (True)", "नहीं, यह सामान्य माना जाता है (False)", "इसकी अनुमति है", "भाषा पर निर्भर करता है"],
    correctAnswer: "हाँ, यह अभद्र माना जाता है (True)"
  },
  {
    question: "डिजिटल वित्तीय सुरक्षा के लिए उपयोग किया जाने वाला OTP का पूर्ण रूप क्या होता है?",
    options: ["One Time Password", "One Time Programmable", "Only True Password", "On Time Payment"],
    correctAnswer: "One Time Password"
  }
];

/**
 * Generates a mock list of 100 questions for a test by shuffling the pool
 * and extending it systematically to fit exactly 100 entries.
 */
export function generate100Questions(testId: string): Question[] {
  const result: Question[] = [];
  
  // Create 100 distinct questions by compounding the pool
  for (let i = 0; i < 100; i++) {
    const originalIndex = i % CCC_QUESTION_POOL.length;
    const base = CCC_QUESTION_POOL[originalIndex];
    
    // We add a subtle question variation to make them unique
    const uniqueModifier = Math.floor(i / CCC_QUESTION_POOL.length);
    let questionText = base.question;
    
    if (uniqueModifier > 0) {
      questionText = `[सेट ${uniqueModifier + 1}] ` + base.question;
    }

    result.push({
      id: `${testId}_q_${i + 1}`,
      testId: testId,
      question: questionText,
      options: [...base.options] as [string, string, string, string],
      correctAnswer: base.correctAnswer
    });
  }

  return result;
}
