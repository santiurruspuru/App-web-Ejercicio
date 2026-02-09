import appData from './data.js';

class WellbeingApp {
    constructor() {
        this.currentStep = 0;
        this.answers = {};
        this.filteredQuestions = [...appData.questions];

        this.nodes = {
            onboarding: document.getElementById('onboarding-screen'),
            loading: document.getElementById('loading-screen'),
            dashboard: document.getElementById('dashboard-screen'),
            questionText: document.getElementById('question-text'),
            optionsList: document.getElementById('options-list'),
            stepIndicator: document.getElementById('step-indicator'),
            progressBar: document.getElementById('progress-bar'),
            nextBtn: document.getElementById('next-btn'),
            prevBtn: document.getElementById('prev-btn'),
            dailyRoutine: document.getElementById('daily-routine'),
            calendarBtn: document.getElementById('calendar-btn')
        };

        this.init();
    }

    init() {
        this.renderQuestion();
        this.nodes.nextBtn.addEventListener('click', () => this.handleNext());
        this.nodes.prevBtn.addEventListener('click', () => this.handlePrev());
        this.nodes.calendarBtn.addEventListener('click', () => this.syncCalendar());
    }

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
            input.className = 'w-full glass p-4 rounded-2xl text-center text-2xl';
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
        // Simple conditional logic check
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
            this.nodes.dashboard.classList.remove('hidden');
        }, 2000);
    }

    generatePlan() {
        const userGoal = this.answers.q1;
        const hasInjury = this.answers.q2 === 'Sí';

        // Populate Dashboard
        document.getElementById('water-stat').innerText = `${this.answers.q9 || 0} L / 2 L`;

        // Select routines (filtered by injuries)
        const routineItems = appData.routines.no_impact;
        this.nodes.dailyRoutine.innerHTML = routineItems.map(item => `
            <div class="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/10">
                <div class="bg-indigo-500/20 p-2 rounded-lg">
                    <svg class="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                </div>
                <div class="flex-1">
                    <h4 class="font-semibold text-sm">${item.name}</h4>
                    <p class="text-xs text-slate-400">${item.duration} • ${item.benefits}</p>
                </div>
                <button class="text-slate-500 hover:text-white"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg></button>
            </div>
        `).join('');
    }

    syncCalendar() {
        alert('Sincronizando con Google Calendar...\n(En producción aquí se abriría el flujo de OAuth de Google)');
        // Note: Real integration requires Google API Client Library and a Client ID.
        // For This MVP, we simulate the intent.
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WellbeingApp();
});
