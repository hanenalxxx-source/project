/* =========================================================
   CYBERSAFE - MAIN JAVASCRIPT
   ========================================================= */


/* ================= SPLASH SCREEN ================= */

function enterSite() {

    const splash = document.getElementById("splashScreen");

    if (splash) {
        splash.classList.add("hide");
    }

    setTimeout(() => {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }, 300);
}


/* ================= NAVBAR ================= */

window.addEventListener("scroll", function () {

    const navbar = document.getElementById("navbar");

    if (!navbar) return;

    if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }

});


/* ================= LANGUAGE MENU ================= */

/*
   toggleLanguageMenu() و changeLanguage() موجودتان في languages.js
   لذلك لا نكررهما هنا.
*/

/* Close language menu when clicking elsewhere */

document.addEventListener("click", function (event) {

    const wrapper = document.querySelector(".language-wrapper");
    const menu = document.getElementById("languageMenu");

    if (!wrapper || !menu) return;

    if (!wrapper.contains(event.target)) {
        menu.classList.remove("show");
    }

});


/* ================= URL CHECKER ================= */

function checkURL() {

    const input = document.getElementById("urlInput");
    const result = document.getElementById("scannerResult");

    if (!input || !result) return;

    let url = input.value.trim();

    const language =
        localStorage.getItem("cyberLanguage") || "en";


    /* Empty URL */

    if (url === "") {

        result.innerHTML = `
            <div class="scan-result scan-medium">

                <h3>
                    ${language === "ar"
                        ? "⚠️ أدخل رابطًا"
                        : "⚠️ Enter a link"}
                </h3>

                <p>
                    ${language === "ar"
                        ? "يرجى إدخال عنوان موقع إلكتروني قبل فحصه."
                        : "Please enter a website address before checking it."}
                </p>

            </div>
        `;

        return;
    }


    let score = 0;
    let reasons = [];


    /* Add HTTPS if missing */

    let testURL = url;

    if (!/^https?:\/\//i.test(testURL)) {

        testURL = "https://" + testURL;

        score += 1;

        reasons.push(
            language === "ar"
                ? "الرابط لا يعرض HTTPS بشكل واضح."
                : "The link does not clearly show HTTPS."
        );
    }


    /* HTTPS check */

    if (!/^https:\/\//i.test(testURL)) {

        score += 2;

        reasons.push(
            language === "ar"
                ? "الاتصال لا يستخدم HTTPS."
                : "The connection is not using HTTPS."
        );
    }


    /* Suspicious words */

    const suspiciousWords = [

        "login",
        "verify",
        "verification",
        "free",
        "winner",
        "gift",
        "urgent",
        "account",
        "password",
        "security"

    ];


    const lowerURL = testURL.toLowerCase();

    const foundWords =
        suspiciousWords.filter(word =>
            lowerURL.includes(word)
        );


    if (foundWords.length > 0) {

        score += Math.min(foundWords.length, 2);

        reasons.push(
            language === "ar"
                ? "يحتوي الرابط على كلمات تُستخدم بشكل شائع في الرسائل المشبوهة."
                : "The URL contains words commonly used in suspicious messages."
        );
    }


    /* @ symbol */

    if (testURL.includes("@")) {

        score += 3;

        reasons.push(
            language === "ar"
                ? "يحتوي الرابط على الرمز @، والذي يمكن استخدامه لإخفاء الوجهة الحقيقية."
                : "The URL contains an @ symbol, which can hide the actual destination."
        );
    }


    /* Very long URL */

    if (testURL.length > 100) {

        score += 1;

        reasons.push(
            language === "ar"
                ? "الرابط طويل بشكل غير معتاد."
                : "The URL is unusually long."
        );
    }


    /* IP address */

    const ipPattern =
        /^https?:\/\/(?:\d{1,3}\.){3}\d{1,3}/i;


    if (ipPattern.test(testURL)) {

        score += 2;

        reasons.push(
            language === "ar"
                ? "يستخدم الموقع عنوان IP بدلًا من اسم نطاق عادي."
                : "The website uses an IP address instead of a normal domain name."
        );
    }


    /* Risk level */

    let level;
    let className;
    let title;


    if (score <= 1) {

        level =
            language === "ar"
                ? "خطورة منخفضة"
                : "Low Risk";

        className = "scan-low";

        title =
            language === "ar"
                ? "🟢 لا توجد مؤشرات خطيرة واضحة"
                : "🟢 This link looks relatively safe";

    }

    else if (score <= 4) {

        level =
            language === "ar"
                ? "خطورة متوسطة"
                : "Medium Risk";

        className = "scan-medium";

        title =
            language === "ar"
                ? "🟡 كن حذرًا مع هذا الرابط"
                : "🟡 Be careful with this link";

    }

    else {

        level =
            language === "ar"
                ? "خطورة مرتفعة"
                : "High Risk";

        className = "scan-high";

        title =
            language === "ar"
                ? "🔴 يحتوي هذا الرابط على مؤشرات تحذيرية"
                : "🔴 This link has warning signs";
    }


    /* Reasons */

    let reasonHTML = "";


    if (reasons.length > 0) {

        reasonHTML = `
            <p style="margin-top:12px;">

                <strong>
                    ${language === "ar"
                        ? "مؤشرات التحذير:"
                        : "Warning signs:"}
                </strong>

                ${reasons.join(" ")}

            </p>
        `;

    }

    else {

        reasonHTML = `
            <p style="margin-top:12px;">

                ${
                    language === "ar"
                        ? "لم يتم اكتشاف مؤشرات تحذيرية واضحة من خلال هذا الفحص الأساسي."
                        : "No obvious warning signs were detected by this basic check."
                }

            </p>
        `;
    }


    /* Final result */

    result.innerHTML = `
        <div class="scan-result ${className}">

            <h3>${title}</h3>

            <p>

                ${
                    language === "ar"
                        ? "مستوى الخطورة:"
                        : "Risk level:"
                }

                <strong>${level}</strong>

            </p>

            ${reasonHTML}

            <p style="margin-top:12px;">

                ${
                    language === "ar"
                        ? "تحقق دائمًا من المرسل وعنوان الموقع قبل إدخال أي معلومات حساسة."
                        : "Always verify the sender and website address before entering sensitive information."
                }

            </p>

        </div>
    `;
}


/* ================= QUIZ ================= */

const quizQuestions = [

    {
        question: {
            en: "Which password is stronger?",
            ar: "أي كلمة مرور أقوى؟"
        },

        answers: [
            { en: "12345678", ar: "12345678" },
            { en: "Password2026", ar: "Password2026" },
            { en: "T!m9#Qv7@Lp2", ar: "T!m9#Qv7@Lp2" }
        ],

        correct: 2,

        explanation: {
            en: "T!m9#Qv7@Lp2 is stronger because it is longer and combines uppercase and lowercase letters, numbers and special characters.",
            ar: "كلمة المرور T!m9#Qv7@Lp2 أقوى لأنها أطول وتجمع بين الأحرف الكبيرة والصغيرة والأرقام والرموز."
        }
    },


    {
        question: {
            en: "You receive an urgent message asking you to click a link immediately. What should you do?",
            ar: "وصلتك رسالة عاجلة تطلب منك الضغط على رابط فورًا. ماذا تفعل؟"
        },

        answers: [
            { en: "Click it immediately.", ar: "أضغط عليه فورًا." },
            { en: "Verify the sender and the link first.", ar: "أتحقق من المرسل والرابط أولًا." },
            { en: "Forward it to everyone.", ar: "أرسلها للجميع." }
        ],

        correct: 1,

        explanation: {
            en: "Urgency is often used in phishing. Verify the sender and website before clicking.",
            ar: "الإلحاح يُستخدم كثيرًا في التصيد الاحتيالي. تحقق من المرسل والموقع قبل الضغط."
        }
    },


    {
        question: {
            en: "Someone asks you for the verification code sent to your phone. What should you do?",
            ar: "شخص طلب منك رمز التحقق الذي وصلك على هاتفك. ماذا تفعل؟"
        },

        answers: [
            { en: "Give them the code.", ar: "أعطيه الرمز." },
            { en: "Post the code online.", ar: "أنشر الرمز على الإنترنت." },
            { en: "Keep the code private.", ar: "أحافظ على سرية الرمز." }
        ],

        correct: 2,

        explanation: {
            en: "Verification codes are private. Never share one-time codes with other people.",
            ar: "رموز التحقق معلومات خاصة. لا تشارك رموز الاستخدام لمرة واحدة مع الآخرين."
        }
    },


    {
        question: {
            en: "What is a good way to protect your privacy online?",
            ar: "ما الطريقة الجيدة لحماية خصوصيتك على الإنترنت؟"
        },

        answers: [
            { en: "Share everything publicly.", ar: "أنشر كل شيء للعامة." },
            { en: "Review privacy settings and limit personal information.", ar: "أراجع إعدادات الخصوصية وأقلل مشاركة معلوماتي الشخصية." },
            { en: "Use the same password everywhere.", ar: "أستخدم نفس كلمة المرور في كل مكان." }
        ],

        correct: 1,

        explanation: {
            en: "Reviewing privacy settings and limiting personal information helps reduce unnecessary exposure.",
            ar: "مراجعة إعدادات الخصوصية وتقليل مشاركة المعلومات الشخصية يساعدان على تقليل التعرض غير الضروري."
        }
    },


    {
        question: {
            en: "What should you do to improve device security?",
            ar: "ماذا يجب أن تفعل لتحسين أمان جهازك؟"
        },

        answers: [
            { en: "Ignore software updates.", ar: "أتجاهل تحديثات البرامج." },
            { en: "Download apps from suspicious websites.", ar: "أحمّل التطبيقات من مواقع مشبوهة." },
            { en: "Keep your device and apps updated.", ar: "أحافظ على تحديث الجهاز والتطبيقات." }
        ],

        correct: 2,

        explanation: {
            en: "Updates can fix security vulnerabilities and improve device protection.",
            ar: "التحديثات يمكن أن تعالج ثغرات أمنية وتحسن حماية الجهاز."
        }
    }

];


let currentQuestion = 0;
let score = 0;

/* الإجابة التي اختارها المستخدم للسؤال الحالي (null = لم يجب بعد) */
let answeredIndex = null;


/* ================= CURRENT LANGUAGE ================= */

function getQuizLanguage() {

    return localStorage.getItem("cyberLanguage") || "en";

}


/* ================= UPDATE QUIZ LANGUAGE ================= */

/*
   يستدعيها languages.js عند تغيير اللغة
   حتى يتحدث الكويز مباشرة باللغة الجديدة.
*/

function updateQuizLanguage() {

    const quizContent =
        document.getElementById("quizContent");

    const quizResult =
        document.getElementById("quizResult");


    /* إذا كانت نتيجة الكويز ظاهرة */

    if (
        quizResult &&
        quizResult.style.display === "block"
    ) {

        showQuizResult();

        return;
    }


    /* إذا كان الكويز موجودًا */

    if (quizContent) {
        loadQuestion();
    }

}


/* ================= LOAD QUIZ ================= */

function loadQuestion() {

    if (
        currentQuestion < 0 ||
        currentQuestion >= quizQuestions.length
    ) {
        return;
    }


    const language = getQuizLanguage();

    const question =
        quizQuestions[currentQuestion];


    const questionNumber =
        document.getElementById("questionNumber");

    const quizScore =
        document.getElementById("quizScore");

    const questionText =
        document.getElementById("questionText");

    const progressFill =
        document.getElementById("progressFill");

    const answersContainer =
        document.getElementById("answersContainer");

    const quizFeedback =
        document.getElementById("quizFeedback");

    const nextButton =
        document.getElementById("nextButton");


    if (
        !questionNumber ||
        !quizScore ||
        !questionText ||
        !progressFill ||
        !answersContainer ||
        !quizFeedback ||
        !nextButton
    ) {
        return;
    }


    /* Question number */

    questionNumber.textContent =

        language === "ar"

            ? `السؤال ${currentQuestion + 1} من ${quizQuestions.length}`

            : `Question ${currentQuestion + 1} of ${quizQuestions.length}`;


    /* Score */

    quizScore.textContent =

        language === "ar"

            ? `النتيجة: ${score}`

            : `Score: ${score}`;


    /* Question */

    questionText.textContent =
        question.question[language];


    /* Progress */

    const progress =
        ((currentQuestion + 1) / quizQuestions.length) * 100;


    progressFill.style.width =
        progress + "%";


    /* Answers */

    answersContainer.innerHTML = "";


    question.answers.forEach((answer, index) => {

        const button =
            document.createElement("button");

        button.className =
            "answer-btn";

        button.textContent =
            answer[language];

        button.type =
            "button";

        button.onclick =
            function () {
                selectAnswer(index);
            };

        answersContainer.appendChild(button);

    });


    /* Reset feedback */

    quizFeedback.innerHTML = "";

    nextButton.style.display = "none";


    /* Next button text */

    nextButton.textContent =

        currentQuestion === quizQuestions.length - 1

            ? (
                language === "ar"
                    ? "عرض النتيجة"
                    : "Show Result"
            )

            : (
                language === "ar"
                    ? "السؤال التالي"
                    : "Next Question"
            );


    /* إذا كان المستخدم أجاب مسبقًا (مثلاً غيّر اللغة بعد الإجابة) */

    if (answeredIndex !== null) {
        showAnswerState();
    }

}


/* ================= SELECT ANSWER ================= */

function selectAnswer(selectedIndex) {

    /* منع الإجابة مرتين على نفس السؤال */

    if (answeredIndex !== null) return;

    answeredIndex = selectedIndex;

    if (selectedIndex === quizQuestions[currentQuestion].correct) {
        score++;
    }

    showAnswerState();

}


/* ================= SHOW ANSWER STATE ================= */

function showAnswerState() {

    const question = quizQuestions[currentQuestion];

    const language = getQuizLanguage();

    const buttons = document.querySelectorAll(".answer-btn");

    const isCorrect = answeredIndex === question.correct;


    buttons.forEach(button => {
        button.disabled = true;
    });


    if (isCorrect) {

        buttons[answeredIndex].classList.add("correct");

    } else {

        buttons[answeredIndex].classList.add("wrong");

        buttons[question.correct].classList.add("correct");

    }


    /* Update score */

    const quizScore = document.getElementById("quizScore");

    if (quizScore) {

        quizScore.textContent =

            language === "ar"

                ? `النتيجة: ${score}`

                : `Score: ${score}`;

    }


    /* Feedback */

    const quizFeedback = document.getElementById("quizFeedback");

    if (quizFeedback) {

        quizFeedback.innerHTML = `

            <strong>

                ${
                    isCorrect

                        ? (
                            language === "ar"
                                ? "✓ إجابة صحيحة!"
                                : "✓ Correct!"
                        )

                        : (
                            language === "ar"
                                ? "✗ إجابة غير صحيحة."
                                : "✗ Not quite."
                        )
                }

            </strong>

            <br>

            ${question.explanation[language]}

        `;

    }


    /* Show next button */

    const nextButton = document.getElementById("nextButton");

    if (nextButton) {
        nextButton.style.display = "inline-flex";
    }

}


/* ================= NEXT QUESTION ================= */

function nextQuestion() {

    currentQuestion++;

    answeredIndex = null;


    if (
        currentQuestion >=
        quizQuestions.length
    ) {

        showQuizResult();

        return;
    }


    loadQuestion();

}


/* ================= SHOW RESULT ================= */

function showQuizResult() {

    const quizContent =
        document.getElementById("quizContent");

    const quizResult =
        document.getElementById("quizResult");

    const finalScore =
        document.getElementById("finalScore");

    const resultMessage =
        document.getElementById("resultMessage");


    if (!quizContent || !quizResult) {
        return;
    }


    quizContent.style.display =
        "none";

    quizResult.style.display =
        "block";


    /* Final score */

    if (finalScore) {

        finalScore.textContent =
            `${score} / ${quizQuestions.length}`;

    }


    const language =
        getQuizLanguage();


    let message = "";


    /* Result message */

    if (score === quizQuestions.length) {

        message =

            language === "ar"

                ? "ممتاز! لديك معرفة قوية بعادات الأمان السيبراني."

                : "Excellent! You have strong cybersecurity awareness.";

    }

    else if (score >= 3) {

        message =

            language === "ar"

                ? "أداء جيد! لديك أساس جيد، واستمر في تطوير عاداتك الرقمية الآمنة."

                : "Good job! You have a solid foundation. Keep improving your digital safety habits.";

    }

    else {

        message =

            language === "ar"

                ? "بداية جيدة! راجع نصائح الأمان وحاول مرة أخرى."

                : "Good start! Review the safety tips and try again.";

    }


    if (resultMessage) {

        resultMessage.textContent =
            message;

    }

}


/* ================= RESTART QUIZ ================= */

function restartQuiz() {

    currentQuestion = 0;

    score = 0;

    answeredIndex = null;


    const quizContent =
        document.getElementById("quizContent");

    const quizResult =
        document.getElementById("quizResult");


    if (quizContent) {

        quizContent.style.display =
            "block";

    }


    if (quizResult) {

        quizResult.style.display =
            "none";

    }


    loadQuestion();

}


/* ================= SCROLL REVEAL ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const revealElements =
            document.querySelectorAll(".reveal");


        if ("IntersectionObserver" in window) {

            const revealObserver =
                new IntersectionObserver(

                    entries => {

                        entries.forEach(entry => {

                            if (entry.isIntersecting) {

                                entry.target.classList.add(
                                    "visible"
                                );

                            }

                        });

                    },

                    {
                        threshold: 0.12
                    }

                );


            revealElements.forEach(element => {

                revealObserver.observe(element);

            });

        }

    }
);


/* ================= KEYBOARD ================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            const menu =
                document.getElementById("languageMenu");


            if (menu) {

                menu.classList.remove("show");

            }

        }

    }
);


/* ================= INITIALIZE ================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadQuestion();

    }
);
function toggleLanguageMenu() {
  document.getElementById("languageMenu").classList.toggle("show");
}

function changeLanguage(lang) {
  const t = translations[lang];
  if (!t) return;

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-key]").forEach(el => {
    if (t[el.dataset.key] !== undefined) el.textContent = t[el.dataset.key];
  });

  document.querySelectorAll("[data-key-placeholder]").forEach(el => {
    const v = t[el.dataset.keyPlaceholder];
    if (v !== undefined) el.placeholder = v;
  });

  document.getElementById("currentLanguage").textContent = lang.toUpperCase();
  document.getElementById("languageMenu").classList.remove("show");
  try { localStorage.setItem("lang", lang); } catch (e) {}
}

window.addEventListener("DOMContentLoaded", () => {
  let saved = "en";
  try { saved = localStorage.getItem("lang") || "en"; } catch (e) {}
  changeLanguage(saved);
});