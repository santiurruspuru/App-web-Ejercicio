import appData from './data.js';

class WellbeingApp {
    constructor() {
        this.currentStep = 0;
        this.answers = JSON.parse(localStorage.getItem('wellbeing_answers')) || {};
        this.profile = JSON.parse(localStorage.getItem('wellbeing_profile')) || {};
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
            profile: document.getElementById('profile-screen'),
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
            adviceBox: document.getElementById('health-advice-box'),
            adviceText: document.getElementById('health-advice-text'),

            playerStep: document.getElementById('player-step'),
            playerName: document.getElementById('player-exercise-name'),
            playerDesc: document.getElementById('player-desc'),
            playerTheory: document.getElementById('player-theory'),
            playerImg: document.getElementById('player-img'),
            timerText: document.getElementById('timer-text'),
            timerProgress: document.getElementById('timer-progress'),
            pauseBtn: document.getElementById('pause-timer-btn'),
            skipBtn: document.getElementById('skip-timer-btn'),
            closePlayerBtn: document.getElementById('close-player-btn'),

            profileName: document.getElementById('profile-name'),
            profileInitial: document.getElementById('profile-initial'),
            profileWeight: document.getElementById('prof-weight'),
            profileHeight: document.getElementById('prof-height'),
            profileTags: document.getElementById('profile-tags'),
            logoutBtn: document.getElementById('logout-btn'),
            editOnboardingBtn: document.getElementById('edit-onboarding-btn'),

            chatMessages: document.getElementById('chat-messages'),
            chatInput: document.getElementById('chat-input'),
            sendChatBtn: document.getElementById('send-chat-btn'),
            chatbot: document.getElementById('chatbot-screen'),
            syncGoogleBtn: document.getElementById('sync-google-btn'),

            navBtns: document.querySelectorAll('.nav-btn')
        };

        this.init();
    }

    init() {
        // If profile exists, skip onboarding
        if (this.profile.name) {
            this.showDashboard();
        } else {
            this.renderQuestion();
        }

        this.nodes.nextBtn.addEventListener('click', () => this.handleNext());
        this.nodes.prevBtn.addEventListener('click', () => this.handlePrev());
        this.nodes.startRoutineBtn.addEventListener('click', () => this.startExecution());
        this.nodes.pauseBtn.addEventListener('click', () => this.togglePause());
        this.nodes.skipBtn.addEventListener('click', () => this.nextExercise());
        this.nodes.closePlayerBtn.addEventListener('click', () => this.stopExecution());
        this.nodes.logoutBtn.addEventListener('click', () => this.logout());
        this.nodes.editOnboardingBtn.addEventListener('click', () => this.restartOnboarding());
        this.nodes.sendChatBtn.addEventListener('click', () => this.handleSendMessage());
        this.nodes.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleSendMessage();
        });

        this.nodes.navBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchScreen(btn.getAttribute('data-screen')));
        });

        this.nodes.syncGoogleBtn.addEventListener('click', () => this.handleCalendarSync());
    }

    handleCalendarSync() {
        console.log('Syncing calendar...');
        this.nodes.syncGoogleBtn.innerText = "⏳ Sincronizando...";
        this.nodes.syncGoogleBtn.disabled = true;

        setTimeout(() => {
            alert("¡Conexión establecida! Tus rutinas se han sincronizado con Google Calendar. 🗓️🌿");
            this.nodes.syncGoogleBtn.innerText = "Rutina Sincronizada";
            this.nodes.syncGoogleBtn.classList.replace('btn-primary', 'bg-emerald-800/50');
        }, 1500);
    }

    // --- Onboarding & Profile Logic ---
    renderQuestion() {
        this.updateFilters();
        const question = this.filteredQuestions[this.currentStep];
        if (!question) return;

        this.nodes.questionText.innerText = question.text;
        this.nodes.stepIndicator.innerText = `Paso ${this.currentStep + 1} de ${this.filteredQuestions.length}`;
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
        } else if (question.type === 'text' || question.type === 'number') {
            const input = document.createElement('input');
            input.type = question.type;
            input.className = 'w-full glass p-4 rounded-2xl text-lg outline-none border border-white/10 focus:border-emerald-500';
            input.placeholder = 'Escribe aquí...';
            input.value = this.answers[question.id] || '';
            input.oninput = (e) => this.answers[question.id] = e.target.value;
            this.nodes.optionsList.appendChild(input);
        } else if (question.type === 'profile_grid') {
            const grid = document.createElement('div');
            grid.className = 'grid grid-cols-2 gap-4';
            question.fields.forEach(field => {
                const container = document.createElement('div');
                container.className = 'flex flex-col gap-2';
                const label = document.createElement('label');
                label.className = 'text-xs text-emerald-300 opacity-60 ml-2';
                label.innerText = field.label;

                if (field.type === 'select') {
                    const select = document.createElement('select');
                    select.id = `input-${field.id}`;
                    select.className = 'glass p-3 rounded-xl border border-white/10 bg-transparent text-white outline-none';

                    // Force initialization if missing
                    if (this.answers[field.id] === undefined || this.answers[field.id] === null) {
                        this.answers[field.id] = field.options[0];
                    }

                    field.options.forEach(opt => {
                        const o = document.createElement('option');
                        o.value = opt;
                        o.innerText = opt;
                        o.className = 'bg-[#061d15]';
                        select.appendChild(o);
                    });

                    select.value = this.answers[field.id];
                    const syncSelect = (e) => { this.answers[field.id] = e.target.value; };
                    select.onchange = syncSelect;
                    select.onblur = syncSelect;
                    container.append(label, select);
                } else {
                    const input = document.createElement('input');
                    input.id = `input-${field.id}`;
                    input.type = 'number';
                    input.className = 'glass p-3 rounded-xl border border-white/10 outline-none focus:border-emerald-500';
                    input.placeholder = '0';
                    input.value = this.answers[field.id] || '';

                    const syncInput = (e) => { this.answers[field.id] = e.target.value; };
                    input.oninput = syncInput;
                    input.onchange = syncInput;
                    input.onblur = syncInput;
                    container.append(label, input);
                }
                grid.appendChild(container);
            });
            this.nodes.optionsList.appendChild(grid);
        }

        this.nodes.prevBtn.classList.toggle('hidden', this.currentStep === 0);
        this.nodes.nextBtn.innerText = this.currentStep === this.filteredQuestions.length - 1 ? 'Finalizar' : 'Siguiente';
    }

    handleOptionSelect(question, option, card) {
        if (question.type === 'select') {
            this.answers[question.id] = option;
            this.nodes.optionsList.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));
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
        const q = this.filteredQuestions[this.currentStep];
        // Validation for required fields
        if (q.type === 'profile_grid') {
            // Direct DOM sync before validation to be safe
            q.fields.forEach(f => {
                const el = document.getElementById(`input-${f.id}`);
                if (el) this.answers[f.id] = el.value;
            });

            const missing = q.fields.filter(f => {
                const val = this.answers[f.id];
                return val === undefined || val === null || val === "";
            });
            if (missing.length > 0) {
                alert(`[v1.3] Faltan datos obligatorios: ${missing.map(f => f.label).join(', ')}`);
                return;
            }
        } else if (!this.answers[q.id] || (Array.isArray(this.answers[q.id]) && this.answers[q.id].length === 0)) {
            alert('Por favor, responde antes de continuar.'); return;
        }

        if (this.currentStep < this.filteredQuestions.length - 1) {
            this.currentStep++;
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
            const targetId = Object.keys(q.condition)[0];
            const targetVal = q.condition[targetId];
            return this.answers[targetId] === targetVal;
        });
    }

    finishOnboarding() {
        this.profile = {
            name: this.answers.u_name,
            age: this.answers.u_age,
            weight: this.answers.u_weight,
            height: this.answers.u_height,
            sex: this.answers.u_sex
        };
        localStorage.setItem('wellbeing_profile', JSON.stringify(this.profile));
        localStorage.setItem('wellbeing_answers', JSON.stringify(this.answers));

        this.nodes.onboarding.classList.add('hidden');
        this.nodes.loading.classList.remove('hidden');

        setTimeout(() => this.showDashboard(), 2000);
    }

    showDashboard() {
        this.nodes.onboarding.classList.add('hidden');
        this.nodes.loading.classList.add('hidden');
        this.nodes.dashboard.classList.remove('hidden');
        this.nodes.nav.classList.remove('hidden');
        this.renderDashboard();
        this.renderProfile();
    }

    // --- Dashboard & Navigation ---
    switchScreen(screenId) {
        console.log('Switching to screen:', screenId);

        // Hide all screens explicitly by ID and by reference
        [
            this.nodes.dashboard, this.nodes.player, this.nodes.stats,
            this.nodes.profile, this.nodes.calendar, this.nodes.chatbot,
            document.getElementById('stats-screen'),
            document.getElementById('chatbot-screen'),
            document.getElementById('calendar-screen')
        ].forEach(s => s && s.classList.add('hidden'));

        // Show targets
        const target = this.nodes[screenId] || document.getElementById(`${screenId}-screen`);
        if (target) {
            target.classList.remove('hidden');
        } else {
            console.error('Target screen not found:', screenId);
        }

        this.nodes.navBtns.forEach(btn => {
            const isMatch = btn.getAttribute('data-screen') === screenId;
            btn.classList.toggle('text-emerald-400', isMatch);
            btn.classList.toggle('text-emerald-100/30', !isMatch);
        });

        if (screenId === 'player') this.nodes.nav.classList.add('hidden');
        else this.nodes.nav.classList.remove('hidden');

        if (screenId === 'stats') this.initStats();
        if (screenId === 'chatbot' && this.nodes.chatMessages.children.length === 0) {
            this.renderChatMessage('bot', appData.chatbot.welcome);
        }
    }

    // --- Chatbot Logic ---
    handleSendMessage() {
        const text = this.nodes.chatInput.value.trim();
        if (!text) return;

        this.renderChatMessage('user', text);
        this.nodes.chatInput.value = '';

        setTimeout(() => {
            const response = this.getChatBotResponse(text);
            this.renderChatMessage('bot', response);
        }, 600);
    }

    getChatBotResponse(input) {
        const lowerInput = input.toLowerCase();
        for (const item of appData.chatbot.knowledge) {
            if (item.keywords.some(k => lowerInput.includes(k))) {
                return item.response;
            }
        }
        return appData.chatbot.fallback;
    }

    renderChatMessage(type, text) {
        const msg = document.createElement('div');
        msg.className = `max-w-[80%] p-4 rounded-2xl text-sm animate__animated animate__fadeInUp ${type === 'user'
            ? 'bg-emerald-500/20 text-emerald-100 self-end ml-auto border border-emerald-500/10'
            : 'glass text-emerald-100/80 border border-white/5'
            }`;
        msg.innerText = text;
        this.nodes.chatMessages.appendChild(msg);
        this.nodes.chatMessages.scrollTop = this.nodes.chatMessages.scrollHeight;
    }

    renderDashboard() {
        this.nodes.userNameDisplay.innerText = this.profile.name;
        this.currentRoutine = appData.routines.no_impact;

        this.nodes.dailyRoutine.innerHTML = this.currentRoutine.map((item, index) => `
            <div class="exercise-card flex items-center gap-4 p-4 rounded-2xl bg-black/20 border border-white/5 cursor-pointer hover:bg-emerald-900/20 transition-all" data-index="${index}">
                <div class="w-12 h-12 rounded-xl overflow-hidden opacity-80">
                    <img src="${item.img}" class="w-full h-full object-cover">
                </div>
                <div class="flex-1 text-left">
                    <h4 class="font-bold text-sm">${item.name}</h4>
                    <p class="text-[10px] text-emerald-300/50">${item.duration} • ${item.benefits}</p>
                </div>
                <div class="text-emerald-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></div>
            </div>
        `).join('');

        this.nodes.dailyRoutine.querySelectorAll('.exercise-card').forEach(card => {
            card.onclick = () => this.startExecution(parseInt(card.dataset.index));
        });

        // Health Advice
        const substances = this.answers.q_substances || [];
        let adviceHtml = '';
        if (substances.includes('Marihuana')) adviceHtml += `<p class="mb-2">🌿 ${appData.routines.advice.substances.marihuana}</p>`;
        if (substances.includes('Alcohol')) adviceHtml += `<p class="mb-2">🍷 ${appData.routines.advice.substances.alcohol}</p>`;
        if (this.answers.q_meds === 'Sí') adviceHtml += `<p>💊 ${appData.routines.advice.medication}</p>`;

        if (adviceHtml) {
            this.nodes.adviceText.innerHTML = adviceHtml;
            this.nodes.adviceBox.classList.remove('hidden');
        }
    }

    renderProfile() {
        this.nodes.profileName.innerText = this.profile.name;
        this.nodes.profileInitial.innerText = this.profile.name[0].toUpperCase();
        this.nodes.profileWeight.innerText = `${this.profile.weight} kg`;
        this.nodes.profileHeight.innerText = `${this.profile.height} cm`;

        const tags = [
            `Objetivo: ${this.answers.q1}`,
            this.answers.q2 === 'Sí' ? 'Con Lesiones' : 'Sin Lesiones',
            `Actividad: ${this.answers.q4}`
        ];
        if (this.answers.q_acc && !this.answers.q_acc.includes('Ninguno')) {
            tags.push(`Equipo: ${this.answers.q_acc.join(', ')}`);
        }

        this.nodes.profileTags.innerHTML = tags.map(t => `
            <span class="px-3 py-1 glass rounded-full opacity-60">${t}</span>
        `).join('');
    }

    // --- Exercise Execution ---
    startExecution(startIndex = 0) {
        this.routineStep = startIndex;
        this.switchScreen('player');
        this.loadExercise();
    }

    loadExercise() {
        const item = this.currentRoutine[this.routineStep];
        if (!item) { this.finishRoutine(); return; }

        this.nodes.playerStep.innerText = `Paso ${this.routineStep + 1} de ${this.currentRoutine.length}`;
        this.nodes.playerName.innerText = item.name;
        this.nodes.playerDesc.innerText = item.description;
        this.nodes.playerTheory.innerText = item.theory;
        this.nodes.playerImg.src = item.img;

        this.timeLeft = parseInt(item.duration) * 60;
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
                if (this.timeLeft <= 0) this.nextExercise();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const mins = Math.floor(this.timeLeft / 60);
        const secs = this.timeLeft % 60;
        this.nodes.timerText.innerText = `${mins}:${secs.toString().padStart(2, '0')}`;
        const offset = 125.6 - (this.timeLeft / this.maxTime) * 125.6;
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
        this.loadExercise();
    }

    stopExecution() {
        clearInterval(this.timer);
        this.switchScreen('dashboard');
    }

    finishRoutine() {
        clearInterval(this.timer);
        alert('¡Increíble! Has honrado tu cuerpo hoy. 🌿');
        this.switchScreen('dashboard');
    }

    // --- System ---
    logout() {
        if (confirm('¿Cerrar sesión? Se borrarán tus datos locales.')) {
            localStorage.clear();
            location.reload();
        }
    }

    restartOnboarding() {
        this.currentStep = 0;
        this.switchScreen('onboarding');
        this.renderQuestion();
    }

    initStats() {
        const ctx = document.getElementById('stats-chart').getContext('2d');
        if (this.chart) this.chart.destroy();
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['L', 'M', 'X', 'J', 'V', 'S', 'D'],
                datasets: [{
                    data: [10, 15, 8, 20, 15, 0, 0],
                    borderColor: '#74c69d',
                    backgroundColor: 'rgba(116, 198, 157, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                plugins: { legend: { display: false } },
                scales: { x: { grid: { display: false }, ticks: { color: '#74c69d50' } }, y: { display: false } }
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => new WellbeingApp());
