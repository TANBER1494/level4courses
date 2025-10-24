document.addEventListener("DOMContentLoaded", function () {
  // --- DATA ---
  const subjects = [
    {
      id: "acn",
      title: "Advanced Computer Networks",
      description:
        "A question bank and quizzes for advanced computer networks.",
    },
    {
      id: "ct",
      title: "Communication Technology",
      description: "A question bank and quizzes for communication technology.",
    },
    {
      id: "cg",
      title: "Computer Graphics",
      description: "A question bank and quizzes for computer graphics.",
    },
    {
      id: "es",
      title: "Embedded Systems",
      description: "A question bank and quizzes for embedded systems .",
    },
    {
      id: "se",
      title: "Selected Labs in Software Engineering",
      description:
        "A question bank and quizzes for selected software engineering labs.",
    },
  ];

  let lectureData = {}; // سيتم ملء هذا المتغير من ملف JSON

  // --- عناصر الواجهة الرسومية ---
  const pageElements = {
    home: document.getElementById("homePage"),
    subject: document.getElementById("subjectPage"),
    lectureSelection: document.getElementById("lectureSelectionPage"),
    lectureDetail: document.getElementById("lectureDetailPage"),
    quiz: document.getElementById("quizPage"),
  };
  const UIElements = {
    subjectsGrid: document.getElementById("subjectsGrid"),
    subjectTitle: document.getElementById("subjectTitle"),
    lectureSelectionTitle: document.getElementById("lectureSelectionTitle"),
    lectureGrid: document.getElementById("lectureGrid"),
    lectureDetailTitle: document.getElementById("lectureDetailTitle"),
    lectureDetailContent: document.getElementById("lectureDetailContent"),
    quizTitle: document.getElementById("quizTitle"),
    quizForm: document.getElementById("quizForm"),
    quizResults: document.getElementById("quizResults"),
    backToHomeBtn: document.getElementById("backToHomeButton"),
    backToSubjectBtn: document.getElementById("backToSubjectButton"),
    backToLecturesBtn: document.getElementById("backToLecturesButton"),
    backToLectureSelectionFromQuizBtn: document.getElementById(
      "backToLectureSelectionFromQuizButton"
    ),
    questionBankBtn: document.getElementById("questionBankButton"),
    quizBtn: document.getElementById("quizButton"),
    submitQuizBtn: document.getElementById("submitQuizButton"),
    newQuizBtn: document.getElementById("newQuizButton"),
  };
  const mainHeader = document.getElementById("mainHeader");
  const footerCredit = document.getElementById("footerCredit");
  // --- متغيرات الحالة ---
  let currentSubject = {};
  let quizQuestions = [];
  let lectureSelectionMode = "view";
  let currentLectureNum = null;
  // --- تحميل بيانات الأسئلة من ملف JSON ---
  fetch("questions.json")
    .then((response) => response.json())
    .then((data) => {
      lectureData = data;
      initializeApp(); // تشغيل التطبيق بعد تحميل البيانات بنجاح
    })
    .catch((error) => console.error("Error loading lecture data:", error));

  // --- دالة تشغيل التطبيق الرئيسية ---
  function initializeApp() {
    subjects.forEach((subject) => {
      const card = document.createElement("div");
      card.className = "subject-card";
      card.innerHTML = `<div class="card-content"><h3>${subject.title}</h3><p>${subject.description}</p></div>`;
      card.addEventListener("click", () => showSubjectPage(subject));
      UIElements.subjectsGrid.appendChild(card);
      UIElements.newQuizBtn.addEventListener("click", () =>
        startQuiz(currentLectureNum)
      );
    });

    // ربط الأحداث بالأزرار
    UIElements.backToHomeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showHomePage();
    });
    UIElements.backToSubjectBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showSubjectPage(currentSubject);
    });
    UIElements.backToLecturesBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showLectureSelectionPage("view");
    });
    UIElements.backToLectureSelectionFromQuizBtn.addEventListener(
      "click",
      (e) => {
        e.preventDefault();
        showLectureSelectionPage("quiz");
      }
    );
    UIElements.questionBankBtn.addEventListener("click", () =>
      showLectureSelectionPage("view")
    );
    UIElements.quizBtn.addEventListener("click", () =>
      showLectureSelectionPage("quiz")
    );
    UIElements.quizForm.addEventListener("submit", checkQuizAnswers);
    UIElements.submitQuizBtn.addEventListener("click", () =>
      UIElements.quizForm.requestSubmit()
    );
  }

  // --- دوال التنقل وإدارة الواجهة ---

  function transitionTo(activePage) {
    window.scrollTo(0, 0);
    document.body.style.overflowY = "hidden";

    if (activePage === pageElements.home) {
      mainHeader.style.display = "block";
      footerCredit.style.display = "block";
    } else {
      mainHeader.style.display = "none";
      footerCredit.style.display = "none";
    }

    Object.values(pageElements).forEach((page) => {
      const isActive = page.classList.contains("active");
      if (page === activePage) {
        page.classList.remove("hidden-left", "hidden-right");
        page.classList.add("active");
      } else {
        if (isActive) page.classList.add("hidden-left");
        page.classList.remove("active");
      }
    });

    setTimeout(() => {
      const pageContentHeight =
        document.querySelector(".page.active").scrollHeight;
      const windowHeight = window.innerHeight;

      if (pageContentHeight > windowHeight) {
        document.body.style.overflowY = "auto";
      } else {
        document.body.style.overflowY = "hidden";
      }
    }, 500);
  }

  function showHomePage() {
    transitionTo(pageElements.home);
  }

  function showSubjectPage(subject) {
    currentSubject = subject;
    UIElements.subjectTitle.textContent = subject.title;
    transitionTo(pageElements.subject);
  }

  function showLectureSelectionPage(mode) {
    lectureSelectionMode = mode;
    UIElements.lectureSelectionTitle.textContent = `${
      currentSubject.title
    } - Select a Lecture for ${mode === "view" ? "Review" : "Quiz"}`;
    populateLectures();
    transitionTo(pageElements.lectureSelection);
  }

  function showLectureDetailPage(lectureNum) {
    UIElements.lectureDetailTitle.textContent = `${currentSubject.title} - Lecture ${lectureNum}`;
    populateLectureDetails(lectureNum);
    transitionTo(pageElements.lectureDetail);
  }

  function populateLectures() {
    UIElements.lectureGrid.innerHTML = "";
    const subjectLectures = lectureData[currentSubject.id] || {};
    const lectureKeys = Object.keys(subjectLectures);

    for (let i = 1; i <= 20; i++) {
      const btn = document.createElement("div");
      btn.className = "lecture-button";
      btn.textContent = `Lecture ${i}`;

      if (!lectureKeys.includes(i.toString())) {
        btn.classList.add("disabled");
      }

      if (lectureSelectionMode === "view") {
        btn.onclick = () => showLectureDetailPage(i);
      } else {
        btn.onclick = () => startQuiz(i);
      }
      UIElements.lectureGrid.appendChild(btn);
    }
  }

  function populateLectureDetails(lectureNum) {
    UIElements.lectureDetailContent.innerHTML = "";
    const data = lectureData[currentSubject.id]?.[lectureNum];
    if (!data) {
      UIElements.lectureDetailContent.innerHTML =
        "<h3>No questions available for this lecture yet.</h3>";
      return;
    }

    const mcqHtml = `<div class="question-section"><h3>MCQ Questions</h3>${data.mcq
      .map(
        (q, index) =>
          `<div class="question"><p>${index + 1}. ${q.q}</p><ul>${q.opts
            .map(
              (opt) =>
                `<li class="${
                  opt === q.answer ? "correct-answer" : ""
                }">${opt}</li>`
            )
            .join("")}</ul></div>`
      )
      .join("")}</div>`;

    const tfHtml = `<div class="question-section"><h3>True / False Questions</h3>${data.tf
      .map(
        (q, index) =>
          `<div class="question"><p>${data.mcq.length + index + 1}. ${
            q.q
          }</p><div class="answer"><b>Answer: ${q.answer}.</b> ${
            q.correction || ""
          }</div></div>`
      )
      .join("")}</div>`;
    UIElements.lectureDetailContent.innerHTML = mcqHtml + tfHtml;
  }

  function startQuiz(lectureNum) {
    const data = lectureData[currentSubject.id]?.[lectureNum];
    if (!data || (data.mcq.length === 0 && data.tf.length === 0)) {
      alert(`A quiz for Lecture ${lectureNum} is not available yet.`);
      return;
    }
    currentLectureNum = lectureNum;
    UIElements.quizTitle.textContent = `${currentSubject.title} - Quiz (Lecture ${lectureNum})`;
    UIElements.quizResults.style.display = "none";
    UIElements.submitQuizBtn.disabled = false;
    UIElements.submitQuizBtn.style.display = "block";
    UIElements.newQuizBtn.style.display = "none";

    const allQuestions = [
      ...data.mcq.map((q) => ({ ...q, type: "mcq" })),
      ...data.tf.map((q) => ({ ...q, type: "tf" })),
    ];
    quizQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);

    UIElements.quizForm.innerHTML = quizQuestions
      .map((q, index) => {
        const options =
          q.type === "mcq"
            ? q.opts
                .map(
                  (opt) =>
                    `<label><input type="radio" name="q${index}" value="${opt}">${opt}</label>`
                )
                .join("")
            : `<label><input type="radio" name="q${index}" value="True">True</label><label><input type="radio" name="q${index}" value="False">False</label>`;
        return `<div class="quiz-question" id="quiz-q${index}"><p>${
          index + 1
        }. ${q.q}</p><div class="quiz-options">${options}</div></div>`;
      })
      .join("");

    transitionTo(pageElements.quiz);
  }

  function checkQuizAnswers(event) {
    event.preventDefault();
    let score = 0;
    quizQuestions.forEach((q, index) => {
      const selected = UIElements.quizForm.querySelector(
        `input[name="q${index}"]:checked`
      );
      const questionDiv = document.getElementById(`quiz-q${index}`);
      const labels = questionDiv.querySelectorAll("label");

      const inputs = questionDiv.querySelectorAll('input[type="radio"]');
      inputs.forEach((input) => (input.disabled = true));

      if (selected) {
        const isCorrect = selected.value === q.answer;
        if (isCorrect) score++;

        labels.forEach((label) => {
          const radioInput = label.querySelector("input");
          if (radioInput.value === q.answer) {
            label.classList.add("correct");
          } else if (radioInput.checked && !isCorrect) {
            label.classList.add("incorrect");
          }
        });
      }
    });
    UIElements.quizResults.innerHTML = `You scored <strong>${score}</strong> out of ${quizQuestions.length}!`;
    UIElements.quizResults.style.display = "block";
    UIElements.submitQuizBtn.disabled = true;
    UIElements.submitQuizBtn.style.display = "none";
    UIElements.newQuizBtn.style.display = "block";
  }
});
