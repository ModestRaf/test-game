const ratingButton = document.querySelector('.menu__rating');
const body = document.body;
const leftButton = document.querySelector('.menu__friends-left');
const rightButton = document.querySelector('.menu__friends-right');
const friendsContainer = document.querySelector('.menu__friends-container');

// оверлей
const overlay = document.createElement('div');
overlay.classList.add('rating__overlay');

document.addEventListener('DOMContentLoaded', () => {
    const friendTemplate = document.getElementById('friend').content;
    const ratingTemplate = document.getElementById('rating').content;
    const gamerTemplate = document.getElementById('gamer').content;
    const uniquePeopleMap = new Map();
    [...data.rating, ...data.friends].forEach(person => {
        uniquePeopleMap.set(person.id, person); // Map автоматически избегает дубликатов по id
    });
    const uniquePeople = Array.from(uniquePeopleMap.values()); // Преобразуем Map обратно в массив

    // Функция создания карточки
    function createFriendCard(person) {
        const friendCard = friendTemplate.cloneNode(true);
        const friendImg = friendCard.querySelector('.friend__icon-img');
        const addButton = friendCard.querySelector('.friend__icon-add');

        friendImg.src = person.img;
        friendImg.alt = `${person.name} ${person.lastName}`;

        // Если человек не друг, показываем кнопку "Добавить"
        const isFriend = data.friends.some(friend => friend.id === person.id);
        if (!isFriend) {
            addButton.classList.remove('visually-hidden');
        }

        return friendCard;
    }

    uniquePeople.forEach(person => {
        const friendCard = createFriendCard(person);
        friendsContainer.appendChild(friendCard);
    });

    // Прокрутка по одной карточке
    const cardWidth = friendsContainer.querySelector('.friend__icon')?.offsetWidth + 10 || 0; // 10 - gap между карточками

    leftButton.addEventListener('click', () => {
        friendsContainer.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });

    rightButton.addEventListener('click', () => {
        friendsContainer.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });

    function openRatingPopup() {
        const popup = ratingTemplate.cloneNode(true).querySelector('.rating__content');
        const gamersContainer = popup.querySelector('.rating__gamers-container');
        const closeButton = popup.querySelector('.rating__close-button');
        const sortButtons = popup.querySelectorAll('.rating__sort-button');

        body.appendChild(overlay);
        body.appendChild(popup);

        // Сортируем рейтинг по опыту
        const sortedRating = data.rating.slice().sort((a, b) => b.points - a.points);

        sortedRating.forEach((gamer, index) => {
            const gamerClone = gamerTemplate.cloneNode(true);
            const gamerName = gamerClone.querySelector('.gamer-name');

            gamerClone.querySelector('.gamer-position').textContent = index + 1;
            gamerName.textContent = `${gamer.name} ${gamer.lastName}`;
            gamerClone.querySelector('.gamer-rating').textContent = gamer.points;

            // Проверяем, является ли игрок другом
            if (data.friends.some(friend => friend.id === gamer.id)) {
                gamerName.classList.add('friend-highlight');
            }
            gamersContainer.appendChild(gamerClone);
        });

        sortButtons.forEach(btn => btn.classList.remove('active'));
        if (sortButtons.length > 0) {
            sortButtons[0].classList.add('active');
        }

        function closeRatingPopup() {
            popup.remove();
            overlay.remove();
            document.removeEventListener('keydown', handleEscClose);
        }

        function handleEscClose(event) {
            if (event.key === 'Escape') {
                closeRatingPopup();
            }
        }

        function handleSortButtonClick(event) {
            if (event.target.classList.contains('rating__sort-button')) {
                sortButtons.forEach(btn => btn.classList.remove('active'));
                event.target.classList.add('active');
            }
        }

        closeButton.addEventListener('click', closeRatingPopup);
        document.addEventListener('keydown', handleEscClose);
        popup.addEventListener('click', handleSortButtonClick);
    }

    ratingButton.addEventListener('click', openRatingPopup);
});