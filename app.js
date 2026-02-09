import appData from './data.js';

class WellbeingApp {
    constructor() {
        this.currentStep = 0;
        this.answers = {};
        this.filteredQuestions = [...appData.questions];
        this.currentRoutine = [];
        this.routineStep = 0;
        this.timer = null;
        this.timeLeft = 0;
        this.isPaused = false;

        this.nodes = {
            onboarding: document.getElementById('onboarding-screen'),
            loading: document.getElementById('loading-screen'),
            dashboard: document.getElementById('dashboard-screen'),
            player: document.getElementById('player-screen'),
            stats: document.getElementById('stats-screen'),
            calendar: document.getElementById('calendar-screen'),
            nav: document.getElementById('main-nav'),

            questionText: document.getElementById('question-text'),
            optionsList: document.getElementById('options-list'),
            stepIndicator: document.getElementById('step-indicator'),
            progressBar: document.getElementById('progress-bar'),
            nextBtn: document.getElementById('next-btn'),
            prevBtn: document.getElementById('prev-btn'),

            userNameDisplay: document.getElementById('user-name-display'),
            dailyRoutine: document.getElementById('daily-routine'),
            startRoutineBtn: document.getElementById('start-routine-btn'),

            playerStep: document.getElementById('player-step'),
            playerName: document.getElementById('player-exercise-name'),
            playerDesc: document.getElementById('player-desc'),
            timerText: document.getElementById('timer-text'),
            timerProgress: document.getElementById('timer-progress'),
            pauseBtn: document.getElementById('pause-timer-btn'),
            skipBtn: document.getElementById('skip-timer-btn'),
            closePlayerBtn: document.getElementById('close-player-btn'),

            syncBtn: document.getElementById('sync-google-btn'),
            navBtns: document.querySelectorAll('.nav-btn')
        };

        this.init();
    }

    init() {
        this.renderQuestion();
        this.nodes.nextBtn.addEventListener('click', () => this.handleNext());
        this.nodes.prevBtn.addEventListener('click', () => this.handlePrev());
        this.nodes.startRoutineBtn.addEventListener('click', () => this.startExecution());
        this.nodes.pauseBtn.addEventListener('click', () => this.togglePause());
        this.nodes.skipBtn.addEventListener('click', () => this.nextExercise());
        this.nodes.closePlayerBtn.addEventListener('click', () => this.stopExecution());
        this.nodes.syncBtn.addEventListener('click', () => this.syncCalendar());

        this.nodes.navBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const screen = btn.getAttribute('data-screen');
                this.switchScreen(screen);
            });
        });
    }

    // --- Onboarding Logic ---
    renderQuestion() {
        const question = this.filteredQuestions[this.currentStep];
        if (!question) return;

        this.nodes.questionText.innerText = question.text;
        this.nodes.stepIndicator.innerText = `Pregunta ${this.currentStep + 1} de ${this.filteredQuestions.length}`;
        this.nodes.progressBar.style.width = `${((this.currentStep + 1) / this.filteredQuestions.length) * 100}%`;

        this.nodes.optionsList.innerHTML = '';

        if (question.type === 'select' || question.type === 'multiselect') {
            question.options.forEach(opt => {
                const card = document.createElement('div');
                card.className = `option-card glass p-4 rounded-2xl ${this.isItemSelected(question.id, opt) ? 'selected' : ''}`;
                card.innerText = opt;
                card.onclick = () => this.handleOptionSelect(question, opt, card);
                this.nodes.optionsList.appendChild(card);
            });
        } else if (question.type === 'number') {
            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'w-full glass p-4 rounded-2xl text-center text-2xl bg-transparent outline-none';
            input.value = this.answers[question.id] || '';
            input.oninput = (e) => this.answers[question.id] = e.target.value;
            this.nodes.optionsList.appendChild(input);
        }

        this.nodes.prevBtn.classList.toggle('hidden', this.currentStep === 0);
        this.nodes.nextBtn.innerText = this.currentStep === this.filteredQuestions.length - 1 ? 'Finalizar' : 'Siguiente';
    }

    handleOptionSelect(question, option, card) {
        if (question.type === 'select') {
            this.answers[question.id] = option;
            document.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        } else {
            if (!this.answers[question.id]) this.answers[question.id] = [];
            const index = this.answers[question.id].indexOf(option);
            if (index > -1) {
                this.answers[question.id].splice(index, 1);
                card.classList.remove('selected');
            } else {
                this.answers[question.id].push(option);
                card.classList.add('selected');
            }
        }
    }

    isItemSelected(id, opt) {
        if (!this.answers[id]) return false;
        if (Array.isArray(this.answers[id])) return this.answers[id].includes(opt);
        return this.answers[id] === opt;
    }

    handleNext() {
        if (!this.answers[this.filteredQuestions[this.currentStep].id]) {
            alert('Por favor, responde antes de continuar.');
            return;
        }

        if (this.currentStep < this.filteredQuestions.length - 1) {
            this.currentStep++;
            this.updateFilters();
            this.renderQuestion();
        } else {
            this.finishOnboarding();
        }
    }

    handlePrev() {
        if (this.currentStep > 0) {
            this.currentStep--;
            this.renderQuestion();
        }
    }

    updateFilters() {
        this.filteredQuestions = appData.questions.filter(q => {
            if (!q.condition) return true;
            const conditionKey = Object.keys(q.condition)[0];
            const conditionValue = q.condition[conditionKey];
            return this.answers[conditionKey] === conditionValue;
        });
    }

    finishOnboarding() {
        this.nodes.onboarding.classList.add('hidden');
        this.nodes.loading.classList.remove('hidden');

        setTimeout(() => {
            this.generatePlan();
            this.nodes.loading.classList.add('hidden');
            this.switchScreen('dashboard');
            this.nodes.nav.classList.remove('hidden');
            this.initStats();
        }, 1500);
    }

    // --- Dashboard & Navigation ---
    switchScreen(screenId) {
        [this.nodes.dashboard, this.nodes.player, this.nodes.stats, this.nodes.calendar].forEach(s => s.classList.add('hidden'));
        this.nodes[screenId].classList.remove('hidden');

        // Update nav icons
        this.nodes.navBtns.forEach(btn => {
            if (btn.getAttribute('data-screen') === screenId) {
                btn.classList.replace('text-slate-400', 'text-indigo-400');
            } else {
                btn.classList.replace('text-indigo-400', 'text-slate-400');
            }
        });

        if (screenId === 'player') this.nodes.nav.classList.add('hidden');
        else this.nodes.nav.classList.remove('hidden');
    }

    generatePlan() {
        this.currentRoutine = appData.routines.no_impact;
        this.nodes.userNameDisplay.innerText = "Usuario"; // Hardcoded for now, can be asked in onboarding

        this.nodes.dailyRoutine.innerHTML = this.currentRoutine.map(item => `
            <div class="flex items-center gap-4 p-4 rounded-2xl bg-indigo-500/5 border border-white/5">
                <div class="bg-indigo-500/20 p-3 rounded-xl text-indigo-400">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div class="flex-1">
                    <h4 class="font-bold text-sm text-slate-200">${item.name}</h4>
                    <p class="text-xs text-slate-500">${item.duration} • ${item.benefits}</p>
                </div>
            </div>
        `).join('');
    }

    // --- Exercise Execution Logic ---
    startExecution() {
        this.routineStep = 0;
        this.switchScreen('player');
        this.loadExercise();
    }

    loadExercise() {
        const exercise = this.currentRoutine[this.routineStep];
        if (!exercise) {
            this.finishRoutine();
            return;
        }

        this.nodes.playerStep.innerText = `Paso ${this.routineStep + 1} de ${this.currentRoutine.length}`;
        this.nodes.playerName.innerText = exercise.name;
        this.nodes.playerDesc.innerText = exercise.description;

        // Duration to seconds (assuming "X min")
        this.timeLeft = parseInt(exercise.duration) * 60;
        this.maxTime = this.timeLeft;
        this.updateTimerDisplay();
        this.startTimer();
    }

    startTimer() {
        if (this.timer) clearInterval(this.timer);
        this.isPaused = false;
        this.nodes.pauseBtn.innerHTML = `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;

        this.timer = setInterval(() => {
            if (!this.isPaused) {
                this.timeLeft--;
                this.updateTimerDisplay();
                if (this.timeLeft <= 0) {
                    this.nextExercise();
                }
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        this.nodes.timerText.innerText = `${mins}:${secs.toString().padStart(2, '0')}`;

        // Progress circle
        const dash = 754; // 2 * PI * 120
        const offset = dash - (this.timeLeft / this.maxTime) * dash;
        this.nodes.timerProgress.style.strokeDashoffset = offset;
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        this.nodes.pauseBtn.innerHTML = this.isPaused ?
            `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path></svg>` :
            `<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    }

    nextExercise() {
        this.routineStep++;
        if (this.routineStep < this.currentRoutine.length) {
            this.loadExercise();
        } else {
            this.finishRoutine();
        }
    }

    stopExecution() {
        clearInterval(this.timer);
        this.switchScreen('dashboard');
    }

    finishRoutine() {
        clearInterval(this.timer);
        alert('¡Excelente trabajo! Rutina completada 🎉');
        this.switchScreen('dashboard');
    }

    // --- Extras ---
    initStats() {
        const ctx = document.getElementById('stats-chart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
                datasets: [{
                    label: 'Minutos de Bienestar',
                    data: [15, 0, 15, 10, 20, 0, 15],
                    borderColor: '#818cf8',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(129, 140, 248, 0.1)'
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { display: false },
                    x: { grid: { display: false }, ticks: { color: '#64748b' } }
                }
            }
        });
    }

    syncCalendar() {
        this.nodes.syncBtn.innerText = "Conectando...";
        setTimeout(() => {
            this.nodes.syncBtn.innerText = "¡Sincronizado!";
            alert('Se han creado eventos para Lunes, Miércoles y Viernes a las 09:00 AM.');
        }, 2000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WellbeingApp();
});
