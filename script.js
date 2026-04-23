document.addEventListener('DOMContentLoaded', () => {
    const backToTopButton = document.getElementById('backToTopBtn');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'block';
            backToTopButton.style.opacity = '1';
        } else {
            backToTopButton.style.opacity = '0';
            setTimeout(() => {
                if (window.pageYOffset <= 300) {
                    backToTopButton.style.display = 'none';
                }
            }, 300);
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Кнопка "что-то интересное"
    const interestingButton = document.getElementById('interestingBtn');
    if (interestingButton) {
        interestingButton.addEventListener('click', () => {
            alert('🎉 Отличная работа! Продолжайте изучать английский язык!');
        });
    }

    // ========== АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ ==========
    const sections = document.querySelectorAll('section');
    
    // Функция проверки видимости секций
    function checkVisibility() {
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            
            // Если секция видна в окне просмотра
            if (rect.top < windowHeight - 100 && rect.bottom > 100) {
                section.classList.add('is-visible');
            }
        });
    }
    
    // Проверяем видимость при загрузке
    checkVisibility();
    
    // Проверяем при скролле
    window.addEventListener('scroll', checkVisibility);
    
    // Также проверяем при изменении размера окна
    window.addEventListener('resize', checkVisibility);
    
    console.log('Сайт загружен, найдено секций:', sections.length);
});

// Подсветка активной страницы в меню
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav ul li a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
        link.classList.add('active');
    }
});

// Прогресс-бар при скролле
window.addEventListener('scroll', () => {
    const winScroll = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (winScroll / height) * 100;
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.style.width = scrolled + '%';
    }
});













// ========== СЛОВАРЬ - ТОЛЬКО РЕЖИМ ИЗУЧЕНИЯ ==========
if (document.querySelector('.vocab-container')) {
    initVocabulary();
}

function initVocabulary() {
    // 50 СЛОВ ДЛЯ ИЗУЧЕНИЯ
    const vocabulary = getFullVocabulary();
    
    // Переменные состояния
    let currentWordIndex = 0;
    let studiedWords = JSON.parse(localStorage.getItem('studiedWords')) || [];
    
    // DOM элементы
    const englishWordEl = document.getElementById('englishWord');
    const transcriptionEl = document.getElementById('transcription');
    const russianTranslationEl = document.getElementById('russianTranslation');
    const exampleSentenceEl = document.getElementById('exampleSentence');
    const showTranslationBtn = document.getElementById('showTranslationBtn');
    const nextWordBtn = document.getElementById('nextWordBtn');
    const wordsStudiedEl = document.getElementById('wordsStudied');
    const totalWordsEl = document.getElementById('totalWords');
    const progressFill = document.getElementById('progressFill');
    const wordCounter = document.getElementById('wordCounter');
    const wordCard = document.getElementById('wordCard');
    
    // Проверяем наличие элементов
    if (!englishWordEl) {
        console.error('Элементы словаря не найдены');
        return;
    }
    
    // Инициализация
    totalWordsEl.textContent = vocabulary.length;
    updateStats();
    loadRandomWord();
    updateCounter();
    
    function loadRandomWord() {
        wordCard.classList.add('slide-out');
        
        setTimeout(() => {
            // Выбираем случайное слово
            const newIndex = Math.floor(Math.random() * vocabulary.length);
            currentWordIndex = newIndex;
            const currentWord = vocabulary[currentWordIndex];
            
            englishWordEl.textContent = currentWord.english;
            transcriptionEl.textContent = currentWord.transcription;
            russianTranslationEl.textContent = currentWord.russian;
            exampleSentenceEl.textContent = `📖 ${currentWord.example}`;
            
            // Скрываем перевод
            russianTranslationEl.classList.remove('show');
            
            wordCard.classList.remove('slide-out');
            wordCard.classList.add('slide-in');
            
            setTimeout(() => {
                wordCard.classList.remove('slide-in');
            }, 300);
            
            updateCounter();
        }, 300);
    }
    
    function showTranslation() {
        russianTranslationEl.classList.add('show');
        
        // Если слово еще не изучено, добавляем в изученные
        if (!studiedWords.includes(currentWordIndex)) {
            studiedWords.push(currentWordIndex);
            localStorage.setItem('studiedWords', JSON.stringify(studiedWords));
            updateStats();
            showConfetti();
        }
    }
    
    function nextWord() {
        loadRandomWord();
    }
    
    function updateStats() {
        wordsStudiedEl.textContent = studiedWords.length;
        const progress = (studiedWords.length / vocabulary.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
    
    function updateCounter() {
        wordCounter.textContent = `Выучено: ${studiedWords.length} (${Math.round((studiedWords.length / vocabulary.length) * 100)}%)`;
    }
    
    function showConfetti() {
        const colors = ['#6366f1', '#8b5cf6', '#f59e0b', '#10b981'];
        for (let i = 0; i < 30; i++) {
            const confetti = document.createElement('div');
            confetti.style.position = 'fixed';
            confetti.style.width = '10px';
            confetti.style.height = '10px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * window.innerWidth + 'px';
            confetti.style.top = '-10px';
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '9999';
            confetti.style.animation = `fall ${Math.random() * 2 + 1}s linear forwards`;
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 2000);
        }
    }
    
    // Обработчики событий
    showTranslationBtn.addEventListener('click', showTranslation);
    nextWordBtn.addEventListener('click', nextWord);
}

// 50 СЛОВ ДЛЯ 7 КЛАССА
function getFullVocabulary() {
    return [
        { english: "Adventure", transcription: "/ədˈventʃər/", russian: "Приключение", example: "Life is an adventure!" },
        { english: "Brilliant", transcription: "/ˈbrɪliənt/", russian: "Блестящий, великолепный", example: "You had a brilliant idea!" },
        { english: "Challenge", transcription: "/ˈtʃælɪndʒ/", russian: "Вызов, сложная задача", example: "I like a good challenge." },
        { english: "Discover", transcription: "/dɪˈskʌvər/", russian: "Открывать, обнаруживать", example: "Let's discover new places!" },
        { english: "Excellent", transcription: "/ˈeksələnt/", russian: "Превосходный, отличный", example: "You did an excellent job!" },
        { english: "Fantastic", transcription: "/fænˈtæstɪk/", russian: "Фантастический", example: "That's fantastic news!" },
        { english: "Generate", transcription: "/ˈdʒenəreɪt/", russian: "Генерировать, производить", example: "This will generate new ideas." },
        { english: "Honest", transcription: "/ˈɒnɪst/", russian: "Честный", example: "Be honest with yourself." },
        { english: "Imagine", transcription: "/ɪˈmædʒɪn/", russian: "Представлять, воображать", example: "Imagine a better future." },
        { english: "Journey", transcription: "/ˈdʒɜːni/", russian: "Путешествие", example: "Learning is a journey." },
        { english: "Knowledge", transcription: "/ˈnɒlɪdʒ/", russian: "Знание", example: "Knowledge is power." },
        { english: "Learn", transcription: "/lɜːn/", russian: "Учить, узнавать", example: "I want to learn English." },
        { english: "Motivate", transcription: "/ˈməʊtɪveɪt/", russian: "Мотивировать", example: "This will motivate you to study." },
        { english: "Native", transcription: "/ˈneɪtɪv/", russian: "Родной", example: "She is a native speaker." },
        { english: "Opportunity", transcription: "/ˌɒpəˈtjuːnəti/", russian: "Возможность", example: "Take every opportunity to learn." },
        { english: "Practice", transcription: "/ˈpræktɪs/", russian: "Практика", example: "Practice makes perfect." },
        { english: "Question", transcription: "/ˈkwestʃən/", russian: "Вопрос", example: "Do you have any questions?" },
        { english: "Remember", transcription: "/rɪˈmembər/", russian: "Помнить", example: "Remember to study every day." },
        { english: "Success", transcription: "/səkˈses/", russian: "Успех", example: "Success comes with hard work." },
        { english: "Teacher", transcription: "/ˈtiːtʃər/", russian: "Учитель", example: "The teacher explains the rules." },
        { english: "Understand", transcription: "/ˌʌndəˈstænd/", russian: "Понимать", example: "I understand the lesson." },
        { english: "Vocabulary", transcription: "/vəˈkæbjələri/", russian: "Словарный запас", example: "Expand your vocabulary." },
        { english: "Wonderful", transcription: "/ˈwʌndəfl/", russian: "Замечательный", example: "That's wonderful news!" },
        { english: "Achieve", transcription: "/əˈtʃiːv/", russian: "Достигать", example: "You can achieve your goals!" },
        { english: "Benefit", transcription: "/ˈbenɪfɪt/", russian: "Выгода, польза", example: "Exercise has many benefits." },
        { english: "Create", transcription: "/kriˈeɪt/", russian: "Создавать", example: "Create something amazing!" },
        { english: "Develop", transcription: "/dɪˈveləp/", russian: "Развивать", example: "Develop your skills every day." },
        { english: "Encourage", transcription: "/ɪnˈkʌrɪdʒ/", russian: "Поощрять, ободрять", example: "Teachers encourage students." },
        { english: "Friendly", transcription: "/ˈfrendli/", russian: "Дружелюбный", example: "She is very friendly." },
        { english: "Goal", transcription: "/ɡəʊl/", russian: "Цель", example: "Set a goal and achieve it." },
        { english: "Helpful", transcription: "/ˈhelpfl/", russian: "Полезный", example: "This advice is very helpful." },
        { english: "Improve", transcription: "/ɪmˈpruːv/", russian: "Улучшать", example: "Practice helps improve your English." },
        { english: "Join", transcription: "/dʒɔɪn/", russian: "Присоединяться", example: "Join our English club!" },
        { english: "Keep", transcription: "/kiːp/", russian: "Продолжать, хранить", example: "Keep learning every day!" },
        { english: "Listen", transcription: "/ˈlɪsn/", russian: "Слушать", example: "Listen to English songs." },
        { english: "Meaning", transcription: "/ˈmiːnɪŋ/", russian: "Значение", example: "What is the meaning of this word?" },
        { english: "Notice", transcription: "/ˈnəʊtɪs/", russian: "Замечать", example: "Did you notice the difference?" },
        { english: "Organize", transcription: "/ˈɔːɡənaɪz/", russian: "Организовывать", example: "Organize your study time." },
        { english: "Prepare", transcription: "/prɪˈpeər/", russian: "Готовиться", example: "Prepare for your exam." },
        { english: "Quality", transcription: "/ˈkwɒləti/", russian: "Качество", example: "Quality education is important." },
        { english: "Recommend", transcription: "/ˌrekəˈmend/", russian: "Рекомендовать", example: "I recommend this book." },
        { english: "Share", transcription: "/ʃeər/", russian: "Делиться", example: "Share your ideas with others." },
        { english: "Travel", transcription: "/ˈtrævl/", russian: "Путешествовать", example: "Travel opens your mind." },
        { english: "Useful", transcription: "/ˈjuːsfl/", russian: "Полезный", example: "This app is very useful." },
        { english: "Value", transcription: "/ˈvæljuː/", russian: "Ценить, значение", example: "Value your time." },
        { english: "Watch", transcription: "/wɒtʃ/", russian: "Смотреть", example: "Watch movies in English." },
        { english: "eXtra", transcription: "/ˈekstrə/", russian: "Дополнительный", example: "Do extra practice exercises." },
        { english: "Yearn", transcription: "/jɜːn/", russian: "Сильно желать", example: "Yearn for knowledge." },
        { english: "Zealous", transcription: "/ˈzeləs/", russian: "Усердный, рьяный", example: "Be zealous in your studies." }
    ];
}

// Добавляем стиль для конфетти
const confettiStyle = document.createElement('style');
confettiStyle.textContent = `
    @keyframes fall {
        to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(confettiStyle);




// ========== ИГРА НАЙДИ ПАРУ ==========
if (document.querySelector('.game-container')) {
    initMemoryGame();
}

function initMemoryGame() {
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let attempts = 0;
    let timer = 0;
    let timerInterval = null;
    let isGameActive = true;
    let currentDifficulty = 'medium';
    let isWaiting = false; // Блокировка для мобильных
    
    // База слов для игры
    const wordsDatabase = {
        easy: [
            { english: "Cat", russian: "Кошка" },
            { english: "Dog", russian: "Собака" },
            { english: "Sun", russian: "Солнце" },
            { english: "Moon", russian: "Луна" },
            { english: "Star", russian: "Звезда" },
            { english: "Tree", russian: "Дерево" }
        ],
        medium: [
            { english: "Adventure", russian: "Приключение" },
            { english: "Brilliant", russian: "Блестящий" },
            { english: "Challenge", russian: "Вызов" },
            { english: "Discover", russian: "Открывать" },
            { english: "Excellent", russian: "Превосходный" },
            { english: "Fantastic", russian: "Фантастический" },
            { english: "Generate", russian: "Генерировать" },
            { english: "Honest", russian: "Честный" }
        ],
        hard: [
            { english: "Adventure", russian: "Приключение" },
            { english: "Brilliant", russian: "Блестящий" },
            { english: "Challenge", russian: "Вызов" },
            { english: "Discover", russian: "Открывать" },
            { english: "Excellent", russian: "Превосходный" },
            { english: "Fantastic", russian: "Фантастический" },
            { english: "Generate", russian: "Генерировать" },
            { english: "Honest", russian: "Честный" },
            { english: "Imagine", russian: "Представлять" },
            { english: "Journey", russian: "Путешествие" }
        ]
    };
    
    // DOM элементы
    const gameBoard = document.getElementById('gameBoard');
    const matchesCountEl = document.getElementById('matchesCount');
    const attemptsCountEl = document.getElementById('attemptsCount');
    const timeCountEl = document.getElementById('timeCount');
    const resetBtn = document.getElementById('resetGameBtn');
    const easyModeBtn = document.getElementById('easyModeBtn');
    const mediumModeBtn = document.getElementById('mediumModeBtn');
    const hardModeBtn = document.getElementById('hardModeBtn');
    const gameMessage = document.getElementById('gameMessage');
    
    function startTimer() {
        if (timerInterval) clearInterval(timerInterval);
        timer = 0;
        timeCountEl.textContent = timer;
        timerInterval = setInterval(() => {
            if (isGameActive && matchedPairs < cards.length / 2) {
                timer++;
                timeCountEl.textContent = timer;
            }
        }, 1000);
    }
    
    function stopTimer() {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }
    }
    
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    function createCards(difficulty) {
        const words = wordsDatabase[difficulty];
        const newCards = [];
        
        words.forEach((word, index) => {
            newCards.push({
                id: index * 2,
                pairId: index,
                text: word.english,
                type: 'english',
                isFlipped: false,
                isMatched: false
            });
            newCards.push({
                id: index * 2 + 1,
                pairId: index,
                text: word.russian,
                type: 'russian',
                isFlipped: false,
                isMatched: false
            });
        });
        
        return shuffleArray(newCards);
    }
    
    function renderBoard() {
        gameBoard.innerHTML = '';
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            if (card.isMatched) {
                cardElement.classList.add('matched');
                cardElement.textContent = '✓';
            } else if (card.isFlipped) {
                cardElement.classList.add('flipped');
                cardElement.textContent = card.text;
            } else {
                cardElement.textContent = '?';
            }
            cardElement.addEventListener('click', (e) => {
                e.preventDefault();
                onCardClick(index);
            });
            // Для touch-устройств
            cardElement.addEventListener('touchstart', (e) => {
                e.preventDefault();
                onCardClick(index);
            }, { passive: false });
            gameBoard.appendChild(cardElement);
        });
    }
    
    function onCardClick(index) {
        if (!isGameActive || isWaiting) return;
        
        const clickedCard = cards[index];
        
        if (clickedCard.isMatched || clickedCard.isFlipped) return;
        if (flippedCards.length >= 2) return;
        
        clickedCard.isFlipped = true;
        flippedCards.push({ index, card: clickedCard });
        renderBoard();
        
        if (flippedCards.length === 2) {
            isWaiting = true;
            attempts++;
            attemptsCountEl.textContent = attempts;
            checkMatch();
        }
    }
    
    function checkMatch() {
        const [first, second] = flippedCards;
        const isMatch = first.card.pairId === second.card.pairId;
        
        if (isMatch) {
            setTimeout(() => {
                first.card.isMatched = true;
                second.card.isMatched = true;
                matchedPairs++;
                matchesCountEl.textContent = matchedPairs;
                
                flippedCards = [];
                renderBoard();
                isWaiting = false;
                
                if (matchedPairs === cards.length / 2) {
                    winGame();
                }
            }, 300);
        } else {
            setTimeout(() => {
                first.card.isFlipped = false;
                second.card.isFlipped = false;
                flippedCards = [];
                renderBoard();
                isWaiting = false;
            }, 800);
        }
    }
    
    function winGame() {
        isGameActive = false;
        stopTimer();
        gameMessage.innerHTML = `
            🎉 ПОБЕДА! 🎉<br>
            Вы нашли все ${matchedPairs} пар за ${attempts} попыток и ${timer} секунд!
        `;
        gameMessage.classList.add('win');
        saveRecord(currentDifficulty, attempts, timer);
    }
    
    function saveRecord(difficulty, attempts, time) {
        const records = JSON.parse(localStorage.getItem('gameRecords')) || {};
        const key = `${difficulty}_best`;
        
        if (!records[key] || records[key].attempts > attempts) {
            records[key] = { attempts, time, date: new Date().toLocaleDateString() };
            localStorage.setItem('gameRecords', JSON.stringify(records));
            gameMessage.innerHTML += `<br>🏆 НОВЫЙ РЕКОРД! 🏆`;
        }
    }
    
    function resetGame() {
        flippedCards = [];
        matchedPairs = 0;
        attempts = 0;
        isGameActive = true;
        isWaiting = false;
        gameMessage.innerHTML = '';
        gameMessage.classList.remove('win', 'lose');
        
        matchesCountEl.textContent = matchedPairs;
        attemptsCountEl.textContent = attempts;
        
        cards = createCards(currentDifficulty);
        renderBoard();
        
        stopTimer();
        startTimer();
    }
    
    function changeDifficulty(difficulty) {
        currentDifficulty = difficulty;
        resetGame();
        
        [easyModeBtn, mediumModeBtn, hardModeBtn].forEach(btn => {
            btn.style.opacity = '0.6';
        });
        
        if (difficulty === 'easy') easyModeBtn.style.opacity = '1';
        if (difficulty === 'medium') mediumModeBtn.style.opacity = '1';
        if (difficulty === 'hard') hardModeBtn.style.opacity = '1';
    }
    
    resetBtn.addEventListener('click', resetGame);
    easyModeBtn.addEventListener('click', () => changeDifficulty('easy'));
    mediumModeBtn.addEventListener('click', () => changeDifficulty('medium'));
    hardModeBtn.addEventListener('click', () => changeDifficulty('hard'));
    
    cards = createCards('medium');
    renderBoard();
    startTimer();
    
    const records = JSON.parse(localStorage.getItem('gameRecords')) || {};
    if (Object.keys(records).length > 0) {
        let recordText = '🏆 Рекорды: ';
        if (records.easy_best) recordText += `Лёгкий: ${records.easy_best.attempts} попыток `;
        if (records.medium_best) recordText += `Средний: ${records.medium_best.attempts} попыток `;
        if (records.hard_best) recordText += `Сложный: ${records.hard_best.attempts} попыток`;
        gameMessage.innerHTML = recordText;
        gameMessage.style.fontSize = '0.9rem';
        gameMessage.style.background = '#f1f5f9';
    }
}
