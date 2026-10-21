/**
 * 국립농산물품질관리원 웹앱 인터랙티브 스크립트
 * 프레임워크나 외부 종속성 없이 순수 Vanilla JS로 구동
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. 맞춤 도움 진단 솔루션 (체크리스트 & 설문)
  initHelpFinder();

  // 2. 주요업무 탭 전환 기능
  initDutyTabs();

  // 3. 최신 뉴스 카테고리 필터링 기능
  initNewsFilters();

  // 4. 참여형 대국민 농식품 상식 퀴즈
  initQuiz();
});

/* ----------------------------------------------------
 * 0. "나는 어떤 도움을 받을 수 있을까?" 맞춤 진단 솔루션
 * ---------------------------------------------------- */
const roleData = {
  consumer: {
    title: "일반 소비자·학부모님을 위한 안심 혜택",
    desc: "가족의 건강한 밥상을 지키고, 의심스러운 식재료로부터 권리를 보호받으실 수 있습니다.",
    checkItems: [
      { id: "c1", label: "식당이나 배달앱에서 고기·김치의 원산지가 진짜 국산인지 의심스러워요.", tag: "원산지" },
      { id: "c2", label: "아이 이유식이나 급식 식재료에 잔류농약이 없는지 안전성을 확인하고 싶어요.", tag: "안전성" },
      { id: "c3", label: "마트에서 파는 유기농·친환경·GAP 마크가 진짜 정부 공인인지 궁금해요.", tag: "인증조회" },
      { id: "c4", label: "불량 식재료나 원산지 속임 판매를 발견했을 때 신고하고 포상금을 받고 싶어요.", tag: "신고포상" }
    ],
    benefits: [
      {
        badge: "원산지 부정유통 감시",
        badgeType: "urgent",
        title: "원산지 위반 신고 및 포상금 (최대 1,000만 원)",
        desc: "수입산을 국내산으로 속여 팔거나 원산지를 헷갈리게 표시한 곳을 신고하시면 농관원 특사경이 즉각 출동 단속하며, 신고자에게 최고 1,000만 원 포상금을 지급합니다.",
        actionText: "신고전화 1588-8112 바로 연결 📞",
        actionUrl: "tel:15888112"
      },
      {
        badge: "식품안전 검증",
        badgeType: "normal",
        title: "출하 전 463종 잔류농약 사전 차단제도 혜택",
        desc: "우리가 마트에서 사는 채소·과일은 이미 농관원이 산지에서 잔류농약·중금속 검사를 거쳐 부적합품을 폐기·출하 연기한 안전한 농산물입니다. 안심하고 섭취하셔도 좋습니다.",
        actionText: "농산물 안전성 기준 보기 ↗",
        actionUrl: "#duties"
      },
      {
        badge: "실시간 이력/인증 조회",
        badgeType: "normal",
        title: "우수농산물·친환경 국가인증 즉시 조회",
        desc: "포장지에 인쇄된 인증번호를 조회하면 어느 농가에서 어떻게 재배했는지 생산자 실명과 이력을 스마트폰으로 투명하게 확인하실 수 있습니다.",
        actionText: "국가인증 정보시스템 바로가기 ↗",
        actionUrl: "https://www.naqs.go.kr"
      }
    ]
  },
  farmer: {
    title: "현직 농업인·영농법인을 위한 경영 지원 혜택",
    desc: "농업인의 소득 안정과 공정한 출하, 정당한 정부 보조 혜택을 든든하게 뒷받침합니다.",
    checkItems: [
      { id: "f1", label: "정부 기본형 공익직불금을 신청하고 감액 없이 100% 수령하고 싶어요.", tag: "직불금" },
      { id: "f2", label: "농업경영체 등록정보(농지, 재배품목 등)를 신규 등록하거나 변경해야 해요.", tag: "경영체" },
      { id: "f3", label: "가을에 수확한 벼(공공비축미/가루쌀)를 제값 받고 공정하게 등급 판정받고 싶어요.", tag: "벼매입" },
      { id: "f4", label: "농약허용물질목록관리제도(PLS) 기준에 맞춰 부적합 처분을 예방하고 싶어요.", tag: "PLS지도" },
      { id: "f5", label: "친환경이나 GAP(우수관리) 국가인증을 받아 판매 경쟁력을 높이고 싶어요.", tag: "국가인증" }
    ],
    benefits: [
      {
        badge: "핵심 소득 지원",
        badgeType: "money",
        title: "공익직불금 실경작 검증 및 준수사항 사전 안내",
        desc: "농지형상 유지, 농약 안전사용 등 17개 실천과제를 사전에 점검 안내해 드려 소중한 공익직불금이 부당하게 감액되는 일을 방지해 드립니다.",
        actionText: "공익직불제 이행 점검 안내 ↗",
        actionUrl: "#duties"
      },
      {
        badge: "원스톱 행정",
        badgeType: "normal",
        title: "농업경영체 비대면 등록 및 증명서 무료 발급",
        desc: "각종 면세유 배정, 농자재 지원, 건강보험료 감면의 필수 요건인 농업경영체 등록확인서를 온라인(Agrix)과 모바일로 간편하게 발급받으실 수 있습니다.",
        actionText: "Agrix 경영체 등록시스템 ↗",
        actionUrl: "https://www.agrix.go.kr"
      },
      {
        badge: "출하 보장",
        badgeType: "normal",
        title: "공공비축벼 국가 수매 품위 검사 및 현장 기술지도",
        desc: "전국 3,000여 개 검사장에서 수분·도정 품위를 공정하게 판정하여 높은 등급(특등/1등)을 받으실 수 있도록 수확 전 기술지도를 지원합니다.",
        actionText: "벼 매입검사 요령 보기 ↗",
        actionUrl: "#duties"
      }
    ]
  },
  seller: {
    title: "식당 사장님·유통·가공업자를 위한 안심 가이드",
    desc: "복잡한 법적 규제를 사전에 준수하여 단속 과태료 걱정 없이 안심하고 영업하실 수 있습니다.",
    checkItems: [
      { id: "s1", label: "우리 식당 메뉴판, 배달의민족·쿠팡이츠 앱에 원산지를 적법하게 적는 법을 알고 싶어요.", tag: "표시요령" },
      { id: "s2", label: "원산지 단속에 억울하게 적발되거나 수천만 원 과태료 처분을 받는 일을 피하고 싶어요.", tag: "단속예방" },
      { id: "s3", label: "가공식품 원료를 납품받을 때 진짜 국산인지 과학적으로 판별할 수 있는지 궁금해요.", tag: "진위판별" },
      { id: "s4", label: "전통식품 인증이나 술 품질인증을 받아 백화점·대형마트에 입점하고 싶어요.", tag: "가공품인증" }
    ],
    benefits: [
      {
        badge: "무료 상담 컨설팅",
        badgeType: "urgent",
        title: "음식점·배달앱 원산지 표시방법 1:1 맞춤 지도",
        desc: "소고기, 돼지고기, 닭고기, 쌀, 배추김치 등 29개 주요 품목의 올바른 표기법과 영수증 보관 의무를 상세히 지도해 불필요한 과태료(최대 1,000만 원)를 예방합니다.",
        actionText: "원산지 표시 규정 상세 ↗",
        actionUrl: "#duties"
      },
      {
        badge: "첨단 과학 서비스",
        badgeType: "normal",
        title: "과학적 원산지 검정 기술 지원 (DNA·NIRS)",
        desc: "돼지고기, 쌀, 콩 등 원산지 구분이 어려운 식자재의 DNA 및 이화학 분석 기술을 통해 둔갑 식재료 유입을 차단하도록 돕습니다.",
        actionText: "농관원 시험연구소 소식 ↗",
        actionUrl: "https://www.naqs.go.kr"
      },
      {
        badge: "가치 제고",
        badgeType: "normal",
        title: "전통식품·술 품질인증 사후 관리 및 홍보",
        desc: "국산 원료를 사용하는 우수 전통가공식품에 대한 국가인증을 부여하고 정부의 명절 판로 개척과 연계 지원합니다.",
        actionText: "국가인증 지원안내 ↗",
        actionUrl: "#duties"
      }
    ]
  },
  starter: {
    title: "귀농·청년농·귀촌 준비자를 위한 첫걸음 지원",
    desc: "영농 시작 시 꼭 필요한 법적 자격 취득과 정부 정착 지원금의 문을 열어드립니다.",
    checkItems: [
      { id: "st1", label: "농업인으로 정식 인정받아 정책자금(청년창업농, 정착지원금)을 신청하고 싶어요.", tag: "농업인자격" },
      { id: "st2", label: "농지 임대차나 소유 후 가장 먼저 농관원에 무엇을 신고해야 하는지 몰라요.", tag: "신규등록" },
      { id: "st3", label: "스마트팜이나 친환경 농사를 지어 GAP/친환경 인증을 첫 출하부터 받고 싶어요.", tag: "인증준비" },
      { id: "st4", label: "초보 농사꾼이라 농약 살포 기준(PLS) 위반으로 출하 정지될까 봐 걱정돼요.", tag: "농약안전" }
    ],
    benefits: [
      {
        badge: "필수 첫 단추",
        badgeType: "urgent",
        title: "농업경영체 신규 등록 현장 심사 및 자격 부여",
        desc: "1,000㎡(약 300평) 이상 농지 경작, 연간 농산물 판매액 120만 원 이상 등 법적 기준 충족 시 경영체 등록을 완료하여 정부 정책자금 및 세제 감면 자격을 취득합니다.",
        actionText: "농업경영체 등록 조건 보기 ↗",
        actionUrl: "https://www.agrix.go.kr"
      },
      {
        badge: "초보 농부 안심 케어",
        badgeType: "normal",
        title: "신규 취농자 PLS(농약안전사용) 무료 현장 컨설팅",
        desc: "작물별 사용 가능한 농약 품목과 희석 배수, 수확 전 살포 금지 기간을 현장 방문 조사관이 친절히 지도해 출하 불합격 피해를 사전에 막아줍니다.",
        actionText: "안전성 조사 체계 보기 ↗",
        actionUrl: "#duties"
      },
      {
        badge: "고부가가치화",
        badgeType: "money",
        title: "친환경·GAP 인증 획득 종합 멘토링",
        desc: "우수농산물관리(GAP) 기본 교육 및 토양·용수 검사 요건을 안내받아 첫 수확 농산물의 브랜드 가치와 납품 단가를 극대화할 수 있습니다.",
        actionText: "국가인증제도 안내 ↗",
        actionUrl: "#duties"
      }
    ]
  }
};

function initHelpFinder() {
  const roleButtons = document.querySelectorAll('.role-btn');
  const checklistContainer = document.getElementById('finder-checklist');
  const resultTitle = document.getElementById('result-title');
  const resultDesc = document.getElementById('result-desc');
  const benefitContainer = document.getElementById('benefit-cards-container');

  if (!roleButtons.length || !checklistContainer) return;

  let currentRole = "consumer";

  function renderFinder() {
    const data = roleData[currentRole];
    resultTitle.textContent = data.title;
    resultDesc.textContent = data.desc;

    // 체크리스트 렌더링
    checklistContainer.innerHTML = '';
    data.checkItems.forEach(item => {
      const labelEl = document.createElement('label');
      labelEl.className = 'check-item checked'; // 기본 체크

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = true;
      checkbox.value = item.id;

      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          labelEl.classList.add('checked');
        } else {
          labelEl.classList.remove('checked');
        }
      });

      const spanText = document.createElement('span');
      spanText.className = 'check-label';
      spanText.textContent = item.label;

      labelEl.appendChild(checkbox);
      labelEl.appendChild(spanText);
      checklistContainer.appendChild(labelEl);
    });

    // 맞춤 혜택 카드 렌더링
    benefitContainer.innerHTML = '';
    data.benefits.forEach(b => {
      const card = document.createElement('div');
      card.className = 'benefit-card';

      const badge = document.createElement('span');
      badge.className = `benefit-badge ${b.badgeType}`;
      badge.textContent = b.badge;

      const title = document.createElement('h5');
      title.className = 'benefit-title';
      title.textContent = b.title;

      const desc = document.createElement('p');
      desc.className = 'benefit-desc';
      desc.textContent = b.desc;

      const action = document.createElement('a');
      action.className = 'benefit-action';
      action.href = b.actionUrl;
      action.textContent = b.actionText;
      if (b.actionUrl.startsWith('http') || b.actionUrl.startsWith('tel:')) {
        action.target = b.actionUrl.startsWith('http') ? '_blank' : '_self';
        action.rel = 'noopener noreferrer';
      }

      card.appendChild(badge);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(action);
      benefitContainer.appendChild(card);
    });
  }

  // 역할 버튼 클릭 이벤트
  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentRole = btn.getAttribute('data-role');
      renderFinder();
    });
  });

  // 초기 렌더링
  renderFinder();
}
function initDutyTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (!tabButtons.length) return;

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // 모든 버튼 활성화 해제
      tabButtons.forEach(b => b.classList.remove('active'));
      // 클릭한 버튼 활성화
      btn.classList.add('active');

      const targetId = btn.getAttribute('data-tab');
      // 모든 컨텐츠 숨김
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === targetId) {
          content.classList.add('active');
        }
      });
    });
  });
}

/* ----------------------------------------------------
 * 2. 최신 정책 뉴스 필터링 로직
 * ---------------------------------------------------- */
function initNewsFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const newsCards = document.querySelectorAll('.news-card');

  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      newsCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ----------------------------------------------------
 * 3. 국민 참여형 농산물 품질 상식 퀴즈 로직
 * ---------------------------------------------------- */
const quizData = [
  {
    question: "Q1. 마트나 식당에서 농산물 원산지 부정유통(수입산을 국산으로 속여 파는 행위)을 발견했을 때 신고하는 전용 전화번호는?",
    options: [
      "119",
      "1588-8112 (농관원 부정유통 신고센터)",
      "1339",
      "120 다산콜센터"
    ],
    answer: 1,
    explanation: "정답입니다! 농산물 원산지 거짓 표시나 미표시 등 부정유통 신고는 국립농산물품질관리원 전용 신고 콜센터인 1588-8112로 전화하시면 되며, 최고 1,000만 원의 포상금이 지급됩니다."
  },
  {
    question: "Q2. 농산물에 등록되지 않은 농약의 잔류 기준을 일률 기준(0.01mg/kg 이하)으로 엄격하게 관리하는 제도의 공식 명칭은?",
    options: [
      "PLS (농약허용물질목록관리제도)",
      "HACCP (식품안전관리인증기준)",
      "GPS (위치확인시스템)",
      "K-Food 품질인증제"
    ],
    answer: 0,
    explanation: "정답입니다! PLS(Positive List System, 농약허용물질목록관리제도)는 작물별로 잔류허용기준이 설정되지 않은 농약의 경우 일률기준(0.01mg/kg)을 적용해 안전성을 대폭 강화한 제도입니다."
  },
  {
    question: "Q3. 국립농산물품질관리원이 매년 가을 전국 3,000여 개 검사장에서 수매 검사를 전담하여 등급을 매기는 품목은?",
    options: [
      "공공비축벼(쌀) 및 가루쌀",
      "수입 바나나",
      "가공 라면",
      "커피 원두"
    ],
    answer: 0,
    explanation: "정답입니다! 농관원은 매년 정부가 비축하는 공공비축벼와 가루쌀(약 40만 톤)에 대해 수분, 품위, DNA 품종 검정 등을 실시하여 특등·1등·2등·3등으로 공정하게 판정합니다."
  }
];

function initQuiz() {
  let currentIdx = 0;
  let score = 0;

  const quizBox = document.getElementById('quiz-box');
  const quizResult = document.getElementById('quiz-result');
  const questionEl = document.getElementById('quiz-question');
  const optionsEl = document.getElementById('quiz-options');
  const counterEl = document.getElementById('quiz-counter');
  const scoreEl = document.getElementById('quiz-score');
  const progressEl = document.getElementById('quiz-progress');
  const feedbackEl = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('btn-next-quiz');
  const restartBtn = document.getElementById('btn-restart-quiz');
  const finalScoreEl = document.getElementById('quiz-final-score');

  if (!quizBox) return;

  function loadQuestion() {
    const q = quizData[currentIdx];
    counterEl.textContent = `문제 ${currentIdx + 1} / ${quizData.length}`;
    scoreEl.textContent = `점수: ${score}점`;
    questionEl.textContent = q.question;
    
    // 진행도 바
    const progressPercent = ((currentIdx + 1) / quizData.length) * 100;
    progressEl.style.width = `${progressPercent}%`;

    // 피드백 및 다음 버튼 초기화
    feedbackEl.classList.add('hidden');
    feedbackEl.className = 'quiz-feedback hidden';
    nextBtn.classList.add('hidden');

    // 옵션 렌더링
    optionsEl.innerHTML = '';
    q.options.forEach((optText, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.textContent = optText;
      btn.addEventListener('click', () => selectOption(i, btn));
      optionsEl.appendChild(btn);
    });
  }

  function selectOption(selectedIdx, btnEl) {
    const q = quizData[currentIdx];
    const optionButtons = optionsEl.querySelectorAll('.quiz-option-btn');

    // 모든 버튼 비활성화
    optionButtons.forEach(b => b.disabled = true);

    if (selectedIdx === q.answer) {
      score++;
      scoreEl.textContent = `점수: ${score}점`;
      btnEl.classList.add('correct');
      feedbackEl.className = 'quiz-feedback correct';
      feedbackEl.innerHTML = `<strong>정답입니다! 👏</strong><br>${q.explanation}`;
    } else {
      btnEl.classList.add('wrong');
      // 정답 표시
      optionButtons[q.answer].classList.add('correct');
      feedbackEl.className = 'quiz-feedback wrong';
      feedbackEl.innerHTML = `<strong>아쉽네요! 오답입니다.</strong><br>${q.explanation}`;
    }

    feedbackEl.classList.remove('hidden');

    // 다음 버튼 활성화
    if (currentIdx < quizData.length - 1) {
      nextBtn.textContent = '다음 문제 ➔';
    } else {
      nextBtn.textContent = '결과 보기 🏆';
    }
    nextBtn.classList.remove('hidden');
  }

  nextBtn.addEventListener('click', () => {
    currentIdx++;
    if (currentIdx < quizData.length) {
      loadQuestion();
    } else {
      // 퀴즈 종료
      quizBox.classList.add('hidden');
      quizResult.classList.remove('hidden');
      finalScoreEl.textContent = `당신의 점수는 ${quizData.length}문제 중 ${score}점입니다!`;
    }
  });

  restartBtn.addEventListener('click', () => {
    currentIdx = 0;
    score = 0;
    quizResult.classList.add('hidden');
    quizBox.classList.remove('hidden');
    loadQuestion();
  });

  // 최초 문제 로드
  loadQuestion();
}
