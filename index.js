let player = {
                name: "Player",
                chips: 200
            }

            let cards = []
            let sum = 0
            let hasBlackJack = false
            let isAlive = false
            let message = ""
            let messageEl = document.getElementById("message-el")
            let sumEl = document.getElementById("sum-el")
            let cardsContainer = document.getElementById("cards-container")
            let playerEl = document.getElementById("player-el")
            let resultOverlay = document.getElementById("result-overlay")

            playerEl.textContent = player.name + ": $" + player.chips

            // Define card suits and values
            const suits = ['hearts', 'diamonds', 'clubs', 'spades']
            const suitSymbols = {
                'hearts': '♥',
                'diamonds': '♦',
                'clubs': '♣',
                'spades': '♠'
            }
            const cardValues = {
                1: 'A',
                2: '2',
                3: '3',
                4: '4',
                5: '5',
                6: '6',
                7: '7',
                8: '8',
                9: '9',
                10: '10',
                11: 'J',
                12: 'Q',
                13: 'K'
            }

            function getRandomCard() {
                // Get random value (1-13)
                let randomValue = Math.floor(Math.random() * 13) + 1
                // Get random suit (0-3)
                let randomSuitIndex = Math.floor(Math.random() * 4)
                let randomSuit = suits[randomSuitIndex]
                
                // Calculate numerical value for blackjack
                let blackjackValue
                if (randomValue > 10) {
                    blackjackValue = 10
                } else if (randomValue === 1) {
                    blackjackValue = 11
                } else {
                    blackjackValue = randomValue
                }
                
                // Return an object with all card details
                return {
                    value: randomValue,
                    suit: randomSuit,
                    symbol: suitSymbols[randomSuit],
                    displayValue: cardValues[randomValue],
                    blackjackValue: blackjackValue
                }
            }

            function startGame() {
                isAlive = true
                hasBlackJack = false
                let firstCard = getRandomCard()
                let secondCard = getRandomCard()
                cards = [firstCard, secondCard]
                sum = firstCard.blackjackValue + secondCard.blackjackValue
                renderGame()
            }

            function renderGame() {
                // Clear existing cards
                cardsContainer.innerHTML = ""
                
                // Render visual cards
                for (let i = 0; i < cards.length; i++) {
                    let card = cards[i]
                    let cardElement = document.createElement("div")
                    cardElement.className = `card ${card.suit}`
                    
                    // Create card structure
                    cardElement.innerHTML = `
                        <div class="card-value">${card.displayValue}</div>
                        <div class="card-suit">${card.symbol}</div>
                        <div class="card-value-bottom">${card.displayValue}</div>
                    `
                    
                    // Set delay for animation effect
                    cardElement.style.animationDelay = `${i * 0.1}s`
                    
                    cardsContainer.appendChild(cardElement)
                }
                
                sumEl.textContent = "Sum: " + sum
                
                if (sum <= 20) {
                    message = "Do you want to draw a new card?"
                    clearGameResult()
                } else if (sum === 21) {
                    message = "You've got Blackjack!"
                    hasBlackJack = true
                    showWinEffect()
                } else {
                    message = "You're out of the game!"
                    isAlive = false
                    showLoseEffect()
                }
                messageEl.textContent = message
            }

            function showWinEffect() {
                // Add win effect to cards
                const cardElements = document.querySelectorAll('.card')
                cardElements.forEach(card => {
                    card.classList.add('win-effect')
                })
                
                // Show win overlay
                resultOverlay.textContent = "BLACKJACK!"
                resultOverlay.className = "result-overlay result-win"
                resultOverlay.style.opacity = "1"
                
                // Add some confetti effect by creating particles
                createConfetti()
            }
            
            function showLoseEffect() {
                // Add lose effect to cards
                const cardElements = document.querySelectorAll('.card')
                cardElements.forEach(card => {
                    card.classList.add('lose-effect')
                })
                
                // Show lose overlay
                resultOverlay.textContent = "BUST!"
                resultOverlay.className = "result-overlay result-lose"
                resultOverlay.style.opacity = "1"
            }
            
            function clearGameResult() {
                // Remove all effect classes
                const cardElements = document.querySelectorAll('.card')
                cardElements.forEach(card => {
                    card.classList.remove('win-effect', 'lose-effect')
                })
                
                // Hide result overlay
                resultOverlay.style.opacity = "0"
            }
            
            function createConfetti() {
                for (let i = 0; i < 50; i++) {
                    const confetti = document.createElement('div')
                    confetti.style.position = 'absolute'
                    confetti.style.width = '10px'
                    confetti.style.height = '10px'
                    confetti.style.backgroundColor = ['#ff0', '#f00', '#0ff', '#0f0', '#00f'][Math.floor(Math.random() * 5)]
                    confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0'
                    confetti.style.top = Math.random() * 100 + '%'
                    confetti.style.left = Math.random() * 100 + '%'
                    confetti.style.zIndex = '5'
                    confetti.style.transform = `rotate(${Math.random() * 360}deg)`
                    confetti.style.opacity = Math.random()
                    confetti.style.animation = `fall ${1 + Math.random() * 2}s linear forwards`
                    
                    document.querySelector('.game-container').appendChild(confetti)
                    
                    // Remove confetti after animation
                    setTimeout(() => {
                        confetti.remove()
                    }, 3000)
                }
            }
            
            // Add confetti fall animation
            const style = document.createElement('style')
            style.textContent = `
                @keyframes fall {
                    0% {
                        transform: translateY(-10px) rotate(0deg);
                    }
                    100% {
                        transform: translateY(calc(100vh - 100%)) rotate(360deg);
                        opacity: 0;
                    }
                }
            `
            document.head.appendChild(style)

            function newCard() {
                if (isAlive === true && hasBlackJack === false) {
                    let card = getRandomCard()
                    sum += card.blackjackValue
                    cards.push(card)
                    renderGame()        
                }
            }

            function resetGame() {
                cards = []
                sum = 0
                hasBlackJack = false
                isAlive = false
                message = "Want to play a round?"
                messageEl.textContent = message
                sumEl.textContent = "Sum: 0"
                cardsContainer.innerHTML = ""
                clearGameResult()
                
                // Remove any leftover confetti
                const confettiElements = document.querySelectorAll('.game-container > div:not(.cards-container):not(.result-overlay)')
                confettiElements.forEach(el => el.remove())
            }