document.addEventListener('DOMContentLoaded', function() {

    // ========== ОБРАБОТЧИК ФОРМЫ РЕГИСТРАЦИИ ==========
    const form = document.getElementById('registration-form');
    const steps = document.querySelectorAll('.form-step');
    const nextBtns = document.querySelectorAll('.next-btn');
    const prevBtns = document.querySelectorAll('.prev-btn');
    const successMessage = document.getElementById('success-message');
    let currentStep = 0;
    let selectedTicket = null;

    // Инициализация: показываем первый шаг
    showStep(currentStep);

    // Кнопки "Далее"
    nextBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Простая валидация на 2 шаге
            if (currentStep === 1) {
                const nameInput = document.getElementById('name');
                const emailInput = document.getElementById('email');
                let isValid = true;

                if (!nameInput.value.trim()) {
                    alert('Пожалуйста, введите ваше имя.');
                    isValid = false;
                }
                if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
                    alert('Пожалуйста, введите корректный email.');
                    isValid = false;
                }

                if (!isValid) return;
            }

            currentStep++;
            showStep(currentStep);

            // Если перешли на шаг 3, обновляем сводку
            if (currentStep === 2) {
                updateOrderSummary();
            }
        });
    });

    // Кнопки "Назад"
    prevBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            currentStep--;
            showStep(currentStep);
        });
    });

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
    }

    // Выбор типа билета
    const ticketCards = document.querySelectorAll('.ticket-card');
    const nextToStep2Btn = document.getElementById('next-to-step-2');

    ticketCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Если кликнули конкретно по кнопке, обрабатываем это как выбор
            if (e.target.classList.contains('select-btn')) {
                // Снимаем выделение со всех карточек
                ticketCards.forEach(c => c.classList.remove('selected'));
                // Выделяем текущую
                card.classList.add('selected');
                // Сохраняем выбранные данные
                selectedTicket = {
                    type: card.dataset.type,
                    price: card.dataset.price
                };
                // Активируем кнопку "Далее"
                nextToStep2Btn.disabled = false;

                // Плавно прокручиваем к кнопке "Далее" для мобильных устройств
                nextToStep2Btn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // Обновление сводки заказа на 3м шаге
    function updateOrderSummary() {
        const summaryDiv = document.getElementById('order-summary');
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        let ticketTypeText;
        switch(selectedTicket.type) {
            case 'guest': ticketTypeText = 'Гость'; break;
            case 'pro': ticketTypeText = 'Профессионал'; break;
            case 'business': ticketTypeText = 'Владелец бизнеса'; break;
        }

        summaryDiv.innerHTML = `
            <h4>Проверьте ваши данные:</h4>
            <p><strong>Пакет:</strong> ${ticketTypeText}</p>
            <p><strong>Стоимость:</strong> ${selectedTicket.price == 0 ? 'Бесплатно' : selectedTicket.price + ' ₽'}</p>
            <p><strong>Участник:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
        `;
    }

    // Отправка формы (моковая)
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Предотвращаем реальную отправку

        // Имитация процесса оплаты/отправки
        const submitBtn = document.getElementById('submit-btn');
        submitBtn.textContent = "Обработка...";
        submitBtn.disabled = true;

        setTimeout(() => {
            // Скрываем форму, показываем сообщение об успехе
            form.style.display = 'none';
            successMessage.style.display = 'block';

            // Можно здесь отправить данные на сервер, например:
            // const formData = new FormData(form);
            // ... fetch(...) ...
        }, 2000); // Имитируем задержку сети в 2 секунды
    });


    // ========== СЧЕТЧИК ОБРАТНОГО ОТСЧЕТА ==========
    function updateCountdown() {
        const eventDate = new Date('December 15, 2025 10:00:00').getTime();
        const now = new Date().getTime();
        const distance = eventDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.getElementById("countdown").innerHTML = "Событие началось!";
        }
    }

    // Запускаем счетчик сразу и обновляем каждую секунду
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

});