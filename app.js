/**
 * ვიზუალური პროგრამირება - ინტერაქტიული სასწავლო აპლიკაცია (IV–VI კლასი)
 * ავტორი: Google DeepMind Antigravity Pair Programmer
 */

document.addEventListener('DOMContentLoaded', () => {
  initRecipeGame();
  initLabSimulator();
  initEyeRestWidget();
  initQuiz();
});

/* ==========================================================================
   1. ექსპერიმენტი: „რობოტი შეფის სენდვიჩი“
   ========================================================================== */

function initRecipeGame() {
  const pool = document.getElementById('recipePool');
  const chosenSteps = document.getElementById('chosenSteps');
  const testBtn = document.getElementById('testRecipeBtn');
  const resetBtn = document.getElementById('resetRecipeBtn');
  const feedback = document.getElementById('recipeFeedback');

  let currentSequence = [];
  const correctSequence = [1, 2, 3, 4];

  // ნაბიჯის დამატება
  pool.querySelectorAll('.recipe-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const stepId = parseInt(btn.getAttribute('data-step'), 10);
      const stepText = btn.textContent;

      currentSequence.push(stepId);
      btn.disabled = true;

      renderChosenSteps();
    });
  });

  function renderChosenSteps() {
    chosenSteps.innerHTML = '';
    if (currentSequence.length === 0) {
      chosenSteps.innerHTML = '<span class="placeholder-text">დააწკაპუნე ბარათებს ზემოთ...</span>';
      return;
    }

    currentSequence.forEach((stepId, index) => {
      const item = document.createElement('div');
      item.className = 'chosen-item';
      
      const stepNames = {
        1: '🍞 1. აიღე პური',
        2: '🧈 2. წაუსვი კარაქი',
        3: '🧀 3. დაადე ყველი',
        4: '🥪 4. დააფარე პური'
      };

      item.innerHTML = `<span><strong>ნაბიჯი ${index + 1}:</strong> ${stepNames[stepId]}</span>`;
      chosenSteps.appendChild(item);
    });
  }

  // შემოწმება
  testBtn.addEventListener('click', () => {
    if (currentSequence.length < 4) {
      showFeedback('error', '⚠️ გთხოვ, გამოიყენო ოთხივე ნაბიჯი, რომ სენდვიჩი სრულყოფილი გამოვიდეს!');
      return;
    }

    const isCorrect = currentSequence.every((val, idx) => val === correctSequence[idx]);

    if (isCorrect) {
      showFeedback('success', '🎉 ბრავო! სენდვიჩი უგემრიელესი გამოვიდა! რობიმ ზუსტად შეასრულა თანმიმდევრობა.');
      triggerConfetti();
    } else {
      let bugExplanation = '🤔 უი, რობიმ რაღაც აურია! ';
      if (currentSequence[0] !== 1) {
        bugExplanation += 'ჯერ პური არ იყო აღებული და კარაქი ან ყველი მაგიდაზე დაედო! 😄 ';
      } else if (currentSequence[1] !== 2) {
        bugExplanation += 'ყველი კარაქის წასმამდე დაადო და კარაქი ვეღარ წაუსვა! ';
      } else {
        bugExplanation += 'თანმიმდევრობა შეგვეშალა. ';
      }
      bugExplanation += 'სცადე თავიდან „↺ თავიდან“ ღილაკით — შეცდომა სწავლის საუკეთესო ნაწილია!';
      showFeedback('error', bugExplanation);
    }
  });

  // თავიდან დაწყება
  resetBtn.addEventListener('click', () => {
    currentSequence = [];
    pool.querySelectorAll('.recipe-step-btn').forEach(btn => btn.disabled = false);
    renderChosenSteps();
    feedback.className = 'recipe-feedback hidden';
    feedback.innerHTML = '';
  });

  function showFeedback(type, message) {
    feedback.className = `recipe-feedback ${type}`;
    feedback.innerHTML = message;
    feedback.classList.remove('hidden');
  }
}

/* ==========================================================================
   2. ინტერაქტიული ლაბორატორია (MAZE & BLOCK PROGRAMMING SIMULATOR)
   ========================================================================== */

function initLabSimulator() {
  const gridArena = document.getElementById('gridArena');
  const programDropzone = document.getElementById('programDropzone');
  const emptyHint = document.getElementById('emptyHint');
  const clearProgramBtn = document.getElementById('clearProgramBtn');
  const runCodeBtn = document.getElementById('runCodeBtn');
  const stepCodeBtn = document.getElementById('stepCodeBtn');
  const resetSimBtn = document.getElementById('resetSimBtn');
  const simStatusBadge = document.getElementById('simStatusBadge');
  const simFeedbackCard = document.getElementById('simFeedbackCard');
  const simFeedbackContent = document.getElementById('simFeedbackContent');
  const missionText = document.getElementById('missionText');
  const levelTabs = document.querySelectorAll('.level-tab');

  // დონეების კონფიგურაცია
  const LEVELS = {
    1: {
      name: 'დონე 1: პირველი ნაბიჯები (საბაზისო)',
      mission: '<strong>მისია 1:</strong> რობი უყურებს მარჯვნივ. დაუმატე <strong>„ნაბიჯი წინ“</strong> ბლოკები (სულ 3-ჯერ) და მიიყვანე ვარსკვლავამდე!',
      start: { row: 2, col: 0, dir: 0 }, // 0: Right, 90: Down, 180: Left, 270: Up
      goal: { row: 2, col: 3 },
      walls: [
        { row: 1, col: 1 },
        { row: 3, col: 1 },
        { row: 1, col: 2 },
        { row: 3, col: 2 }
      ]
    },
    2: {
      name: 'დონე 2: ლაბირინთში მოსახვევები (საშუალო)',
      mission: '<strong>მისია 2:</strong> პირდაპირ კედელია! გამოიყენე <strong>„მობრუნდი მარცხნივ/მარჯვნივ“</strong> და შემოუარე დაბრკოლებას!',
      start: { row: 4, col: 0, dir: 270 }, // Up
      goal: { row: 0, col: 3 },
      walls: [
        { row: 3, col: 0 },
        { row: 3, col: 1 },
        { row: 1, col: 2 },
        { row: 2, col: 2 },
        { row: 3, col: 2 },
        { row: 1, col: 3 }
      ]
    },
    3: {
      name: '⭐ დონე 3: დიდი გამოწვევა ციკლით! (ვარსკვლავიანი)',
      mission: '⭐ <strong>ვარსკვლავიანი გამოწვევა:</strong> გრძელი გზა გველის! გამოიყენე <strong>„გაიმეორე 3-ჯერ (წინ)“</strong> ბლოკი, რომ კოდი იყოს კომპაქტური და ჭკვიანური!',
      start: { row: 4, col: 0, dir: 270 }, // Up
      goal: { row: 1, col: 4 },
      walls: [
        { row: 2, col: 1 },
        { row: 2, col: 2 },
        { row: 2, col: 3 },
        { row: 3, col: 3 },
        { row: 4, col: 3 },
        { row: 0, col: 4 }
      ]
    }
  };

  let currentLevelId = 1;
  let userProgram = []; // მასივი ბლოკების ლოგიკისთვის: ['forward', 'turnLeft', ...]
  let robotState = { row: 0, col: 0, dir: 0 };
  let isRunning = false;
  let stepIndex = 0; // ნაბიჯ-ნაბიჯ დეტექტივისთვის

  // ინიციალიზაცია
  loadLevel(1);

  // დონეების გადართვის ღილაკები
  levelTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      levelTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const lvl = parseInt(tab.getAttribute('data-level'), 10);
      loadLevel(lvl);
    });
  });

  function loadLevel(lvlId) {
    currentLevelId = lvlId;
    const lvl = LEVELS[lvlId];
    missionText.innerHTML = lvl.mission;
    resetSimulationState();
    renderGrid();
  }

  function resetSimulationState() {
    isRunning = false;
    stepIndex = 0;
    const lvl = LEVELS[currentLevelId];
    robotState = { ...lvl.start };
    updateStatus('მზადაა', '');
    hideFeedback();
    renderRobot();
    unhighlightAllBlocks();
  }

  // ბადის რენდერი (5x5)
  function renderGrid() {
    gridArena.innerHTML = '';
    const lvl = LEVELS[currentLevelId];

    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        cell.dataset.row = r;
        cell.dataset.col = c;

        // არის კედელი?
        const isWall = lvl.walls.some(w => w.row === r && w.col === c);
        if (isWall) {
          cell.classList.add('wall');
        }

        // არის მიზანი (ვარსკვლავი)?
        if (lvl.goal.row === r && lvl.goal.col === c) {
          cell.classList.add('goal');
        }

        gridArena.appendChild(cell);
      }
    }

    renderRobot();
  }

  // რობოტის პერსონაჟის რენდერი
  function renderRobot() {
    // წავშალოთ ძველი სპრაიტი
    const oldSprite = document.querySelector('.robi-sprite');
    if (oldSprite) oldSprite.remove();

    // მოვძებნოთ მიმდინარე უჯრა
    const targetCell = document.querySelector(`.grid-cell[data-row="${robotState.row}"][data-col="${robotState.col}"]`);
    if (!targetCell) return;

    const robi = document.createElement('div');
    robi.className = 'robi-sprite';
    robi.id = 'robiSprite';

    // მიმართულების ისარი
    let arrowChar = '➡️';
    if (robotState.dir === 0) arrowChar = '➡️';
    else if (robotState.dir === 90) arrowChar = '⬇️';
    else if (robotState.dir === 180) arrowChar = '⬅️';
    else if (robotState.dir === 270) arrowChar = '⬆️';

    robi.innerHTML = `
      <span class="robi-arrow">${arrowChar}</span>
      <span class="robi-face">🤖</span>
    `;

    targetCell.appendChild(robi);
  }

  // ბლოკის დამატება პალიტრიდან
  document.querySelectorAll('.code-block').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      addBlockToProgram(action);
    });
  });

  function addBlockToProgram(action) {
    userProgram.push(action);
    renderProgramWorkspace();
  }

  function renderProgramWorkspace() {
    programDropzone.innerHTML = '';
    if (userProgram.length === 0) {
      programDropzone.appendChild(emptyHint);
      return;
    }

    const blockLabels = {
      forward: { text: '⬆️ ნაბიჯი წინ', cls: 'block-forward' },
      turnLeft: { text: '↰ მობრუნდი მარცხნივ', cls: 'block-turn-left' },
      turnRight: { text: '↱ მობრუნდი მარჯვნივ', cls: 'block-turn-right' },
      loop3: { text: '🔁 გაიმეორე 3-ჯერ (წინ)', cls: 'block-loop-btn' }
    };

    userProgram.forEach((action, index) => {
      const info = blockLabels[action];
      const item = document.createElement('div');
      item.className = `program-item ${info.cls}`;
      item.dataset.index = index;

      item.innerHTML = `
        <span>${index + 1}. ${info.text}</span>
        <button class="item-delete-btn" title="წაშლა">✕</button>
      `;

      item.querySelector('.item-delete-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        userProgram.splice(index, 1);
        renderProgramWorkspace();
      });

      programDropzone.appendChild(item);
    });
  }

  // გასუფთავება
  clearProgramBtn.addEventListener('click', () => {
    userProgram = [];
    renderProgramWorkspace();
    resetSimulationState();
  });

  // კოდის გაფართოება (ციკლების გადაქცევა ელემენტარულ ნაბიჯებად აღსრულებისთვის)
  function expandProgram(prog) {
    let steps = [];
    prog.forEach((action, originalIndex) => {
      if (action === 'loop3') {
        // ციკლი იმეორებს forward-ს 3-ჯერ
        steps.push({ action: 'forward', originalIndex, loopStep: 1 });
        steps.push({ action: 'forward', originalIndex, loopStep: 2 });
        steps.push({ action: 'forward', originalIndex, loopStep: 3 });
      } else {
        steps.push({ action, originalIndex });
      }
    });
    return steps;
  }

  // გაშვება (Run)
  runCodeBtn.addEventListener('click', async () => {
    if (isRunning) return;
    if (userProgram.length === 0) {
      showFeedback('bug', '⚠️ შენი პროგრამა ცარიელია! ჯერ დაამატე ბლოკები მარცხენა ყუთიდან.');
      return;
    }

    resetSimulationState();
    isRunning = true;
    updateStatus('მუშაობს...', 'running');

    const steps = expandProgram(userProgram);

    for (let i = 0; i < steps.length; i++) {
      if (!isRunning) break;
      highlightBlock(steps[i].originalIndex);
      const result = executeStep(steps[i].action);
      renderRobot();

      await sleep(550);

      if (!result.success) {
        isRunning = false;
        updateStatus('ბაგი!', 'error');
        showFeedback('bug', result.message);
        return;
      }
    }

    unhighlightAllBlocks();
    isRunning = false;

    // შევამოწმოთ, მიაღწია თუ არა ვარსკვლავს
    const lvl = LEVELS[currentLevelId];
    if (robotState.row === lvl.goal.row && robotState.col === lvl.goal.col) {
      updateStatus('გამარჯვება! ⭐', 'success');
      showFeedback('success', '🎉 ურა! რობიმ მიაღწია ვარსკვლავს! შენი კოდი შესანიშნავად მუშაობს!');
      triggerConfetti();
    } else {
      updateStatus('არასრულია', 'running');
      showFeedback('bug', '🤔 რობიმ ყველა ბრძანება შეასრულა, მაგრამ ვარსკვლავამდე ჯერ ვერ მივიდა. ხომ არ აკლია კიდევ ერთი ბლოკი? შეამოწმე!');
    }
  });

  // ნაბიჯ-ნაბიჯ აღსრულება (Step / Debugger)
  stepCodeBtn.addEventListener('click', () => {
    if (userProgram.length === 0) {
      showFeedback('bug', '⚠️ ჯერ დაამატე ბლოკები შენს პროგრამაში!');
      return;
    }

    const steps = expandProgram(userProgram);

    if (stepIndex >= steps.length) {
      // დასრულდა ნაბიჯები
      const lvl = LEVELS[currentLevelId];
      if (robotState.row === lvl.goal.row && robotState.col === lvl.goal.col) {
        updateStatus('გამარჯვება! ⭐', 'success');
        showFeedback('success', '🎉 ურა! ნაბიჯ-ნაბიჯ შემოწმებით რობი ვარსკვლავთან მივიდა!');
        triggerConfetti();
      } else {
        showFeedback('bug', '🏁 ბრძანებები ამოიწურა. ვარსკვლავამდე მისასვლელად კიდევ გჭირდება ბლოკები!');
      }
      return;
    }

    highlightBlock(steps[stepIndex].originalIndex);
    const result = executeStep(steps[stepIndex].action);
    renderRobot();
    stepIndex++;

    if (!result.success) {
      updateStatus('ბაგი!', 'error');
      showFeedback('bug', result.message);
      stepIndex = steps.length; // გაჩერება
    } else {
      updateStatus(`ნაბიჯი ${stepIndex}/${steps.length}`, 'running');
    }
  });

  // თავიდან (Reset)
  resetSimBtn.addEventListener('click', () => {
    resetSimulationState();
  });

  // ერთი ნაბიჯის ლოგიკა
  function executeStep(action) {
    const lvl = LEVELS[currentLevelId];

    if (action === 'turnLeft') {
      robotState.dir = (robotState.dir - 90 + 360) % 360;
      return { success: true };
    }

    if (action === 'turnRight') {
      robotState.dir = (robotState.dir + 90) % 360;
      return { success: true };
    }

    if (action === 'forward') {
      let nextRow = robotState.row;
      let nextCol = robotState.col;

      if (robotState.dir === 0) nextCol += 1; // მარჯვნივ
      else if (robotState.dir === 90) nextRow += 1; // ქვევით
      else if (robotState.dir === 180) nextCol -= 1; // მარცხნივ
      else if (robotState.dir === 270) nextRow -= 1; // ზევით

      // საზღვრებიდან გასვლა
      if (nextRow < 0 || nextRow >= 5 || nextCol < 0 || nextCol >= 5) {
        return {
          success: false,
          message: '🐞 ბაგი აღმოვაჩინეთ! რობი სამყაროს საზღვრებს გასცდა! შეცდომა გვეხმარება ვისწავლოთ — შეასწორე ბლოკები!'
        };
      }

      // კედელთან შეჯახება
      const hitWall = lvl.walls.some(w => w.row === nextRow && w.col === nextCol);
      if (hitWall) {
        return {
          success: false,
          message: '🧱 ბაგი: რობი კედელს შეეჯახა! დააკვირდი ლაბირინთს, შემოუარე კედელს მობრუნების ბლოკებით!'
        };
      }

      // წინსვლა
      robotState.row = nextRow;
      robotState.col = nextCol;
      return { success: true };
    }

    return { success: true };
  }

  function highlightBlock(originalIdx) {
    unhighlightAllBlocks();
    const item = programDropzone.querySelector(`.program-item[data-index="${originalIdx}"]`);
    if (item) {
      item.classList.add('highlight-executing');
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function unhighlightAllBlocks() {
    programDropzone.querySelectorAll('.program-item').forEach(el => {
      el.classList.remove('highlight-executing');
    });
  }

  function updateStatus(text, typeCls) {
    simStatusBadge.textContent = text;
    simStatusBadge.className = 'sim-status-badge';
    if (typeCls) simStatusBadge.classList.add(typeCls);
  }

  function showFeedback(type, msg) {
    simFeedbackCard.className = `sim-feedback-card ${type}`;
    simFeedbackContent.innerHTML = msg;
    simFeedbackCard.classList.remove('hidden');
  }

  function hideFeedback() {
    simFeedbackCard.className = 'sim-feedback-card hidden';
    simFeedbackContent.innerHTML = '';
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/* ==========================================================================
   3. თვალების დასვენება & 20-20-20 წესი
   ========================================================================== */

function initEyeRestWidget() {
  const startBtn = document.getElementById('startEyeRestBtn');
  const timerDisplay = document.getElementById('eyeTimerDisplay');
  const timerSec = document.getElementById('eyeTimerSec');
  const guideText = document.getElementById('eyeGuideText');

  let interval = null;

  startBtn.addEventListener('click', () => {
    let timeLeft = 20;
    timerDisplay.classList.remove('hidden');
    startBtn.disabled = true;
    timerSec.textContent = timeLeft;
    guideText.textContent = 'გაიხედე ეკრანიდან შორს (ფანჯარაში), დაახამხამე თვალები...';

    clearInterval(interval);
    interval = setInterval(() => {
      timeLeft--;
      timerSec.textContent = timeLeft;

      if (timeLeft === 10) {
        guideText.textContent = 'ღრმად ჩაისუნთქე, გაიზმორე და მხრები აამოძრავე... 🧘‍♂️';
      }

      if (timeLeft <= 0) {
        clearInterval(interval);
        guideText.textContent = '✨ ყოჩაღ! შენმა თვალებმა დაისვენა. მზად ხარ ახალი გამოწვევებისთვის!';
        startBtn.disabled = false;
        triggerConfetti();
      }
    }, 1000);
  });
}

/* ==========================================================================
   4. თვითშეფასების ინტერაქტიული ქვიზი
   ========================================================================== */

function initQuiz() {
  const container = document.getElementById('quizContainer');
  const resultsCard = document.getElementById('quizResults');
  const resultTitle = document.getElementById('quizResultTitle');
  const resultText = document.getElementById('quizResultText');
  const restartBtn = document.getElementById('restartQuizBtn');

  const QUESTIONS = [
    {
      q: '1. რით ჰგავს ვიზუალური პროგრამირება ლეგოს (LEGO) კუბიკებს?',
      options: [
        { text: 'A) ბლოკები ერთმანეთს ერგება და სინტაქსური შეცდომა გამორიცხულია', correct: true },
        { text: 'B) ლეგოც და პროგრამაც მხოლოდ პლასტმასისგან მზადდება', correct: false },
        { text: 'C) აქ მხოლოდ სახლების აშენებაა შესაძლებელი', correct: false },
        { text: 'D) მასში საერთოდ არ გვჭირდება ლოგიკა', correct: false }
      ],
      explanation: 'ზუსტად! ვიზუალურ პროგრამირებაში ბლოკები ლეგოსავით ერთმანეთს ეწებება, რაც გვიცავს ასოების ან მძიმეების არევისგან.'
    },
    {
      q: '2. რას აკეთებს „გამეორების“ (ციკლის - Loop) ბლოკი?',
      options: [
        { text: 'A) შლის მთელ პროგრამას თავიდან ბოლომდე', correct: false },
        { text: 'B) ერთსა და იმავე ბრძანებებს იმეორებს მითითებულ რაოდენობაზე', correct: true },
        { text: 'C) კომპიუტერს თიშავს და ასვენებს', correct: false },
        { text: 'D) პერსონაჟის ფერს ცვლის წითლად', correct: false }
      ],
      explanation: 'სწორია! ციკლი საშუალებას გვაძლევს, 10-ჯერ ერთი და იგივე ბლოკის წერის ნაცვლად, დავწეროთ „გაიმეორე 10-ჯერ“.'
    },
    {
      q: '3. რა უნდა ვქნათ, როდესაც ჩვენს პროგრამაში „ბაგი“ (შეცდომა) აღმოჩნდება?',
      options: [
        { text: 'A) გავბრაზდეთ და კომპიუტერი გამოვრთოთ', correct: false },
        { text: 'B) გავხდეთ დეტექტივი, ვიპოვოთ მიზეზი და შევასწოროთ', correct: true },
        { text: 'C) დავმალოთ შეცდომა, რომ არავინ დაინახოს', correct: false },
        { text: 'D) აღარასოდეს დავწეროთ კოდი', correct: false }
      ],
      explanation: 'ყოჩაღ! პროგრამირებაში შეცდომა ჩვეულებრივი და საუკეთესო მასწავლებელია. დეტექტივივით ბაგის პოვნა ნამდვილი ოსტატობაა!'
    },
    {
      q: '4. რომელი ინფორმაციის გაზიარება არ შეიძლება Scratch-ზე პროექტის ატვირთვისას?',
      options: [
        { text: 'A) შენი თამაშის წესებისა და ინსტრუქციის', correct: false },
        { text: 'B) შენი სრული სახელის, მისამართისა და ტელეფონის ნომრის', correct: true },
        { text: 'C) მადლობის, თუ სხვისი პროექტით ისარგებლე (Remix)', correct: false },
        { text: 'D) შენი შექმნილი პერსონაჟის ნახატის', correct: false }
      ],
      explanation: 'აბსოლუტურად მართალია! პირადი მონაცემების უსაფრთხოება უმთავრესია — არასდროს გააზიარო საკონტაქტო მონაცემები ონლაინ!'
    }
  ];

  let score = 0;
  let answeredCount = 0;

  renderQuestions();

  function renderQuestions() {
    container.innerHTML = '';
    score = 0;
    answeredCount = 0;
    resultsCard.classList.add('hidden');

    QUESTIONS.forEach((qData, qIndex) => {
      const card = document.createElement('div');
      card.className = 'quiz-card';

      let optionsHtml = '';
      qData.options.forEach((opt, optIndex) => {
        optionsHtml += `
          <button class="quiz-opt-btn" data-q="${qIndex}" data-opt="${optIndex}">
            ${opt.text}
          </button>
        `;
      });

      card.innerHTML = `
        <div class="quiz-question">${qData.q}</div>
        <div class="quiz-options">${optionsHtml}</div>
        <div class="quiz-explanation hidden" id="exp-${qIndex}"></div>
      `;

      container.appendChild(card);
    });

    // მოვლენების მიბმა
    container.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const qIdx = parseInt(btn.getAttribute('data-q'), 10);
        const optIdx = parseInt(btn.getAttribute('data-opt'), 10);
        handleAnswer(qIdx, optIdx, btn);
      });
    });
  }

  function handleAnswer(qIdx, optIdx, clickedBtn) {
    const card = clickedBtn.closest('.quiz-card');
    const allBtns = card.querySelectorAll('.quiz-opt-btn');
    const expBox = document.getElementById(`exp-${qIdx}`);
    const qData = QUESTIONS[qIdx];
    const isCorrect = qData.options[optIdx].correct;

    // ღილაკების გათიშვა
    allBtns.forEach((b, i) => {
      b.disabled = true;
      if (qData.options[i].correct) {
        b.classList.add('correct');
      }
    });

    if (!isCorrect) {
      clickedBtn.classList.add('wrong');
    } else {
      score++;
    }

    expBox.innerHTML = `💡 ${qData.explanation}`;
    expBox.classList.remove('hidden');

    answeredCount++;
    if (answeredCount === QUESTIONS.length) {
      showResults();
    }
  }

  function showResults() {
    resultsCard.classList.remove('hidden');
    resultText.innerHTML = `შენ სწორად უპასუხე <strong>${score} / ${QUESTIONS.length}</strong> კითხვას!`;

    if (score === 4) {
      resultTitle.textContent = '🌟 საოცარი შედეგია! შენ ნამდვილი ოსტატი კოდერი ხარ!';
      triggerConfetti();
    } else if (score >= 2) {
      resultTitle.textContent = '👏 ძალიან კარგია! შენ შესანიშნავად გაიგე მთავარი არსი!';
    } else {
      resultTitle.textContent = '💪 კარგი მცდელობაა! გადახედე მასალას და სცადე თავიდან!';
    }

    resultsCard.scrollIntoView({ behavior: 'smooth' });
  }

  restartBtn.addEventListener('click', () => {
    renderQuestions();
  });
}

/* ==========================================================================
   5. კონფეტის გენერატორი (VANILLA CANVAS CONFETTI)
   ========================================================================== */

function triggerConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiCount = 100;
  const confetti = [];
  const colors = ['#4f46e5', '#f59e0b', '#10b981', '#ec4899', '#3b82f6', '#8b5cf6'];

  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      d: Math.random() * confettiCount,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.05,
      tiltAngle: 0
    });
  }

  let animationFrame;
  let duration = 3000;
  const start = Date.now();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confetti.forEach(p => {
      ctx.beginPath();
      ctx.lineWidth = p.r / 2;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt + p.r, p.y);
      ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
      ctx.stroke();

      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
      p.tilt = Math.sin(p.tiltAngle - (p.d / 3)) * 15;

      if (p.y > canvas.height) {
        p.x = Math.random() * canvas.width;
        p.y = -20;
      }
    });

    if (Date.now() - start < duration) {
      animationFrame = requestAnimationFrame(draw);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cancelAnimationFrame(animationFrame);
    }
  }

  draw();
}
