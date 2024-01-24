/**
 * Klasa reprezentująca interaktywny quiz motocyklowy.
 * @class
 */
class Quiz {
    /**
     * Konstruktor klasy Quiz.
     * @constructor
     */
    constructor() {

        // Inicjalizacja właściwości quizu
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];

        // Elementy DOM dla interfejsu użytkownika quizu
        this.quizContainer = document.getElementById('quiz-container');
        this.questionElement = document.getElementById('question');
        this.optionsContainer = document.getElementById('options-container');
        this.nextBtn = document.getElementById('next-btn');
        this.resultContainer = document.getElementById('result-container');
        this.finalMessage = document.getElementById('final-message');

        // Słuchacz zdarzeń dla przycisku "Następne pytanie"
        this.nextBtn.addEventListener('click', () => this.nextQuestion());

        // Asynchroniczne ładowanie pytań
        this.loadQuestions()
            .then(questions => {
                this.questions = questions;
                this.loadQuestion();
            })
            .catch(error => console.error('Wystąpił błąd podczas ładowania pytań:', error));
    }

    /**
     * Asynchroniczne ładowanie pytań z opóźnieniem symulującym pobieranie danych.
     * @async
     * @returns {Promise} - Obiekt Promise reprezentujący załadowane pytania.
     */
    loadQuestions() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                
                // Tablica z pytaniami, odpowiedziami i indeksem poprawnej odpowiedzi
                const allQuestions = [
                    {
                        question: "Która marka motocykli słynie z pomarańczowego koloru?",
                        options: ["KTM", "Suzuki", "Honda"],
                        correctAnswer: 0
                    },
                    {
                        question: "Jak brzmi przywitanie motocyklistów?",
                        options: ["Prawa na gaz", "Lewa w górę", "Prawa w górę"],
                        correctAnswer: 1
                    },
                    {
                        question: "Która marka motocykli słynie z zielonego, neonowego koloru?",
                        options: ["Yamaha", "Kawasaki", "Ducati"],
                        correctAnswer: 1
                    },
                    {
                        question: "Która część silnika służy wytwarzania mieszanki paliwowo-powietrznej o odpowiednim składzie?",
                        options: ["gaźnik", "sprzęgło", "tłok"],
                        correctAnswer: 0
                    },
                    {
                        question: "Który z motocykli służy do warunków terenowych (piach, ziemia, kamienie)?",
                        options: ["naked", "cruiser", "cross"],
                        correctAnswer: 2
                    },
                    {
                        question: "Stunt to nazwa?",
                        options: ["stojaka serwisowego", "akrobacji motocyklowych", "systemu kontroli trakcji"],
                        correctAnswer: 1
                    },
                    {
                        question: "Który motocykl jest uznawany za legendę wśród cruiserów?",
                        options: ["Indian Scout", "Honda Goldwing", "Harley-Davidson Sportster"],
                        correctAnswer: 2
                    },
                    {
                        question: "Jak nazywany jest motocykl o obniżonym siedzeniu i położonej do przodu kierownicy?",
                        options: ["Cruiser", "Chopper", "Sport-Tourer"],
                        correctAnswer: 0
                    },
                    {
                        question: "Która marka jest znana z produkcji motocykli off-road?",
                        options: ["Triumph", "KTM", "Moto Guzzi"],
                        correctAnswer: 1
                    },
                    {
                        question: "Jakie są trzy główne kategorie motocykli?",
                        options: ["Sport, Touring, Cruiser", "Off-Road, Street, Custom", "Naked, Adventure, Sport-Tourer"],
                        correctAnswer: 2
                    }
                ];

                // Przetasowanie pytań przed wyborem pierwszych pięciu
                for (let i = allQuestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allQuestions[i], allQuestions[j]] = [allQuestions[j], allQuestions[i]];
                }
                const selectedQuestions = allQuestions.slice(0, 5);
                resolve(selectedQuestions);
            }, 5);
        });
    }

    /**
     * Wyświetlenie bieżącego pytania na ekranie.
     */
    loadQuestion() {

        // Pobranie bieżącego pytania z tablicy pytań
        const currentQuestion = this.questions[this.currentQuestionIndex];
        this.questionElement.textContent = `Pytanie ${this.currentQuestionIndex + 1}: ${currentQuestion.question}`;

        // Wyświetlenie opcji odpowiedzi
        this.optionsContainer.innerHTML = '';
        currentQuestion.options.forEach((option, index) => {

            // Tworzenie przycisku dla każdej opcji odpowiedzi
            const optionElement = document.createElement('button');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.onclick = () => this.checkAnswer(index);
            this.optionsContainer.appendChild(optionElement);

            // Dodanie klasy 'correct' dla poprawnej odpowiedzi
            if (index === currentQuestion.correctAnswer) {
                optionElement.classList.add('correct');
            }
        });

        // Ukrycie przycisku "Następne pytanie" i wyczyszczenie kontenera wyników
        this.nextBtn.style.display = 'none';
        this.resultContainer.textContent = '';
    }

    /**
     * Sprawdzenie odpowiedzi na bieżące pytanie.
     * @param {number} selectedIndex - Indeks wybranej odpowiedzi.
     */
    checkAnswer(selectedIndex) {
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const correctIndex = currentQuestion.correctAnswer;

        const selectedOption = this.optionsContainer.children[selectedIndex];
        if (selectedIndex === correctIndex) {
            selectedOption.classList.add('correct');
            this.resultContainer.textContent = 'Poprawna odpowiedź!';
            this.score++;
        } else {
            selectedOption.classList.add('incorrect');
            this.resultContainer.textContent = 'Błędna odpowiedź. Poprawna odpowiedź to: ' + currentQuestion.options[correctIndex];
        }

        // Dodanie indeksu odpowiedzi do tablicy odpowiedzi użytkownika
        this.userAnswers.push(selectedIndex);

        // Zablokowanie możliwości wyboru odpowiedzi po udzieleniu odpowiedzi
        for (let i = 0; i < this.optionsContainer.children.length; i++) {
            this.optionsContainer.children[i].disabled = true;
            if (i === correctIndex) {
                this.optionsContainer.children[i].classList.add('correct');
            }
        }

        // Wyświetlenie przycisku "Następne pytanie"
        this.nextBtn.style.display = 'block';
    }

    /**
     * Przejście do następnego pytania lub wyświetlenie wyniku końcowego.
     */
    nextQuestion() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex < this.questions.length) {
            this.loadQuestion();
        } else {
            this.displayScore();
            this.saveUserAnswersToLocalStorage();
        }
    }

    /**
     * Wyświetlenie wyniku końcowego.
     */
    displayScore() {
        this.finalMessage.textContent = 'Twój wynik to ' + this.score + ' / ' + this.questions.length;
        document.getElementById('close-btn').style.display = 'block';
    }

    /**
     * Zapisanie odpowiedzi użytkownika do pamięci lokalnej przeglądarki.
     */
    saveUserAnswersToLocalStorage() {
        localStorage.setItem('userAnswers', JSON.stringify(this.userAnswers));
    }
}

/**
 * Inicjalizacja quizu po załadowaniu strony.
 */
document.addEventListener('DOMContentLoaded', function () {
    const quiz = new Quiz();

    /**
     * Obsługa zdarzenia przed zamknięciem okna.
     * @param {Event} event - Obiekt zdarzenia przed zamknięciem okna.
     */
    window.addEventListener('beforeunload', function (event) {
        if (quiz.questions.length > 0) {
            const confirmationMessage = 'Czy na pewno chcesz odświeżyć stronę? Postęp w quizie zostanie utracony.';
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        }
    });

    /**
     * Obsługa przycisku "Zamknij".
     */
    document.getElementById('close-btn').addEventListener('click', function () {
        window.close();
    });
});