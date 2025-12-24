document.addEventListener("DOMContentLoaded", function () {
  const subjects = [
    {
      id: "acn",
      title: "Advanced Computer Networks",
      description:
        "A question bank and quizzes for advanced computer networks.",
      driveLink:
        "https://drive.google.com/drive/folders/1OKxFA0FkT1_kgfCB2ft8VkuA8UKABC1B?usp=drive_link",
    },
    {
      id: "ct",
      title: "Communication Technology",
      description: "A question bank and quizzes for communication technology.",
      driveLink:
        "https://drive.google.com/drive/folders/1J5Y6DOYHa2gbi_mMKylFaG5ms4d7Boba?usp=drive_link",
    },
    {
      id: "cg",
      title: "Computer Graphics",
      description: "A question bank and quizzes for computer graphics.",
      driveLink:
        "https://drive.google.com/drive/folders/1s_8SKV7LXP8Q5TXWo4R6ta3gONC4LfBK?usp=drive_link",
    },
    {
      id: "es",
      title: "Embedded Systems",
      description: "A question bank and quizzes for embedded systems .",
      driveLink:
        "https://drive.google.com/drive/folders/1XOYeK6lDH-y0hvFrqt9oFC3g9D96wghP?usp=drive_link",
    },
    {
      id: "se",
      title: "Selected Labs in Software Engineering",
      description:
        "A question bank and quizzes for selected software engineering labs.",
      driveLink:
        "https://drive.google.com/drive/folders/1mGZzQCC43RILbC2TFp1CklVHJaDWASHG?usp=drive_link",
    },
  ];

  const pageElements = {
    home: document.getElementById("homePage"),
    subject: document.getElementById("subjectPage"),
    lectureSelection: document.getElementById("lectureSelectionPage"),
    lectureDetail: document.getElementById("lectureDetailPage"),
    quiz: document.getElementById("quizPage"),
  };
  const UIElements = {
    subjectsGrid: document.getElementById("subjectsGrid"),
    recordsButton: document.getElementById("recordsButton"),
    subjectTitle: document.getElementById("subjectTitle"),
    lectureSelectionTitle: document.getElementById("lectureSelectionTitle"),
    lectureGrid: document.getElementById("lectureGrid"),
    lectureDetailTitle: document.getElementById("lectureDetailTitle"),
    lectureDetailContent: document.getElementById("lectureDetailContent"),
    quizTitle: document.getElementById("quizTitle"),
    quizForm: document.getElementById("quizForm"),
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
    quizActionsContainer: document.getElementById("quizActionsContainer"),
    chooseAnotherLecBtn: document.getElementById("chooseAnotherLecButton"),
  };
  const mainHeader = document.getElementById("mainHeader");
  const footerCredit = document.getElementById("footerCredit");
  const resultModalOverlay = document.getElementById("resultModalOverlay");
  const modalScoreText = document.getElementById("modalScoreText");
  const modalResultImage = document.getElementById("modalResultImage");
  const closeModalButton = document.getElementById("closeModalButton");

  fetch("summary.json")
    .then((response) => response.json())
    .then((summaryData) => {
      buildHomePageUI(summaryData);
    })
    .catch((error) => {
      console.error("Could not load summary file:", error);
      buildHomePageUI({});
    });

  function buildHomePageUI(summaryData) {
    UIElements.subjectsGrid.innerHTML = "";
    subjects.forEach((subject) => {
      const card = document.createElement("div");
      card.className = "subject-card";
      const lectureCount = summaryData[subject.id] || 0;
      let badgeHTML = "";
      if (lectureCount > "0") {
        const lectureText = lectureCount === 1 ? "Lecture" : "Lectures";
        badgeHTML = `<span class="lecture-count-badge available">📖 ${lectureCount} ${lectureText} Available</span>`;
      } else {
        badgeHTML = `<span class="lecture-count-badge unavailable">Coming Soon</span>`;
      }
      card.innerHTML = `<div class="card-content"><h3>${subject.title}</h3>${badgeHTML}</div>`;
      card.addEventListener("click", () => showSubjectPage(subject));
      UIElements.subjectsGrid.appendChild(card);
    });
  }

  let currentSubjectData = {};
  let fireworksInterval = null;
  closeModalButton.addEventListener("click", () => {
    resultModalOverlay.style.display = "none";
    if (fireworksInterval) {
      clearInterval(fireworksInterval);
    }
  });

  let currentSubject = {};
  let quizQuestions = [];
  let lectureSelectionMode = "view";
  let currentLectureNum = null;

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
  UIElements.newQuizBtn.addEventListener("click", () => {
    if (currentLectureNum === "midterm") {
      startMidtermQuiz();
    } else {
      startQuiz(currentLectureNum);
    }
  });
  UIElements.chooseAnotherLecBtn.addEventListener("click", () =>
    showLectureSelectionPage("quiz")
  );
  UIElements.submitQuizBtn.addEventListener("click", () =>
    UIElements.quizForm.requestSubmit()
  );

  function startFireworks() {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    fireworksInterval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(fireworksInterval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  }

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
    UIElements.recordsButton.onclick = () => {
      window.open(subject.driveLink, "_blank");
    };
    transitionTo(pageElements.subject);
  }

  async function showLectureSelectionPage(mode) {
    lectureSelectionMode = mode;
    UIElements.lectureSelectionTitle.textContent = `${
      currentSubject.title
    } - Select a Lecture for ${mode === "view" ? "Review" : "Quiz"}`;
    UIElements.lectureGrid.innerHTML = "<h2>Loading...</h2>";
    transitionTo(pageElements.lectureSelection);
    try {
      const response = await fetch(`${currentSubject.id}.json`);
      if (!response.ok)
        throw new Error(
          `File not found or error loading: ${response.statusText}`
        );
      currentSubjectData = await response.json();
    } catch (error) {
      console.error("Failed to fetch subject data:", error);
      UIElements.lectureGrid.innerHTML = `<p style="text-align:center; color: red;">Could not load questions for this subject.</p>`;
      currentSubjectData = {};
    }
    populateLectures();
  }

  function showLectureDetailPage(lectureNum) {
    UIElements.lectureDetailTitle.textContent = `${currentSubject.title} - Lecture ${lectureNum}`;
    populateLectureDetails(lectureNum);
    transitionTo(pageElements.lectureDetail);
  }

  function populateLectures() {
    UIElements.lectureGrid.innerHTML = "";
    const lectureKeys = Object.keys(currentSubjectData);

    if (lectureKeys.includes("midterm")) {
      const btn = document.createElement("div");
      btn.className = "midterm-button";

      if (lectureSelectionMode === "view") {
        btn.textContent = "MIDTERM BANK";
        btn.onclick = () => showMidtermBankPage();
      } else {
        btn.textContent = "MIDTERM REVIEW";
        btn.onclick = () => startMidtermQuiz();
      }
      UIElements.lectureGrid.appendChild(btn);
    }

    const normalLectureKeys = lectureKeys
      .filter((key) => key !== "midterm")
      .sort((a, b) => Number(a) - Number(b));

    if (normalLectureKeys.length === 0 && !lectureKeys.includes("midterm")) {
      UIElements.lectureGrid.innerHTML = `<p style="text-align:center;">No lectures available for this subject yet.</p>`;
      return;
    }

    for (const lectureNum of normalLectureKeys) {
      const btn = document.createElement("div");
      btn.className = "lecture-button";
      btn.textContent = `Lecture ${lectureNum}`;
      if (lectureSelectionMode === "view") {
        btn.onclick = () => showLectureDetailPage(lectureNum);
      } else {
        btn.onclick = () => startQuiz(lectureNum);
      }
      UIElements.lectureGrid.appendChild(btn);
    }
  }
  function showMidtermBankPage() {
    UIElements.lectureDetailTitle.textContent = `${currentSubject.title} - Midterm Bank`;

    UIElements.lectureDetailContent.innerHTML = "";
    const data = currentSubjectData?.midterm;
    if (!data) {
      UIElements.lectureDetailContent.innerHTML =
        "<h3>No midterm questions available yet.</h3>";
      transitionTo(pageElements.lectureDetail);
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
    transitionTo(pageElements.lectureDetail);
  }

  function startMidtermQuiz() {
    const data = currentSubjectData?.midterm;
    if (!data || (data.mcq.length === 0 && data.tf.length === 0)) {
      alert(
        `A Midterm Review for ${currentSubject.title} is not available yet.`
      );
      return;
    }

    UIElements.quizTitle.textContent = `${currentSubject.title} - Midterm Review`;
    UIElements.submitQuizBtn.disabled = false;
    UIElements.submitQuizBtn.style.display = "block";
    UIElements.quizActionsContainer.style.display = "none";

    const allQuestions = [
      ...data.mcq.map((q) => ({ ...q, type: "mcq" })),
      ...data.tf.map((q) => ({ ...q, type: "tf" })),
    ];

    quizQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 30);

    if (quizQuestions.length < 30) {
      alert(
        `Warning: The midterm question bank only has ${quizQuestions.length} questions. The quiz will proceed with this amount.`
      );
    }

    currentLectureNum = "midterm";

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
  function populateLectureDetails(lectureNum) {
    UIElements.lectureDetailContent.innerHTML = "";
    const data = currentSubjectData?.[lectureNum];
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
    currentLectureNum = lectureNum;
    const data = currentSubjectData?.[lectureNum];
    if (!data || (data.mcq.length === 0 && data.tf.length === 0)) {
      alert(`A quiz for Lecture ${lectureNum} is not available yet.`);
      return;
    }
    UIElements.quizTitle.textContent = `${currentSubject.title} - Quiz (Lecture ${lectureNum})`;
    UIElements.submitQuizBtn.disabled = false;
    UIElements.submitQuizBtn.style.display = "block";
    UIElements.quizActionsContainer.style.display = "none";
    const allQuestions = [
      ...data.mcq.map((q) => ({ ...q, type: "mcq" })),
      ...data.tf.map((q) => ({ ...q, type: "tf" })),
    ];
    quizQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 15);
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
      const inputs = questionDiv.querySelectorAll('input[type="radio"]');
      inputs.forEach((input) => (input.disabled = true));
      if (selected) {
        const isCorrect = selected.value === q.answer;
        if (isCorrect) score++;
        const labels = questionDiv.querySelectorAll("label");
        labels.forEach((label) => {
          const radioInput = label.querySelector("input");
          if (radioInput.value === q.answer) label.classList.add("correct");
          else if (radioInput.checked && !isCorrect)
            label.classList.add("incorrect");
        });
      }
    });
    UIElements.submitQuizBtn.disabled = true;
    UIElements.submitQuizBtn.style.display = "none";
    UIElements.quizActionsContainer.style.display = "flex";
    modalScoreText.innerHTML = `You scored <strong>${score}</strong> out of ${quizQuestions.length}!`;
    if (score >= 8) {
      modalResultImage.src = "10.gif";
      startFireworks();
    } else if (score <= 7 && score > 4) {
      modalResultImage.src = "4.gif";
    } else {
      modalResultImage.src = "7.gif";
    }
    resultModalOverlay.style.display = "flex";
  }
});
