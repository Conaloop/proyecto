// ===== CONFIGURACIÓN DEL CHATBOT =====
const GEMINI_API_KEY = 'AIzaSyArOuOys3Dj7-mLYgGtrqE9ya8-qx7oKVQ'; // Reemplaza con tu API key de Google
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// ===== ELEMENTOS DEL DOM =====
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotWindow = document.querySelector('.chatbot-window');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');

// ===== VARIABLES DE ESTADO =====
let conversationHistory = [];
let isLoading = false;

// ===== EVENT LISTENERS =====
chatbotToggle.addEventListener('click', toggleChatbot);
chatbotClose.addEventListener('click', closeChatbot);
chatSend.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// ===== FUNCIONES PRINCIPALES =====

/**
 * Abre o cierra la ventana del chatbot
 */
function toggleChatbot() {
    if (chatbotWindow.classList.contains('hidden')) {
        openChatbot();
    } else {
        closeChatbot();
    }
}

/**
 * Abre el chatbot
 */
function openChatbot() {
    chatbotWindow.classList.remove('hidden');
    chatInput.focus();
    
    // Mostrar mensaje inicial si es la primera vez
    if (conversationHistory.length === 0) {
        setTimeout(() => {
            addBotMessage('¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?');
        }, 300);
    }
}

/**
 * Cierra el chatbot
 */
function closeChatbot() {
    chatbotWindow.classList.add('hidden');
}

/**
 * Envía un mensaje al chatbot
 */
async function sendMessage() {
    const message = chatInput.value.trim();
    
    if (!message || isLoading) return;
    
    // Validar API key
    if (GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        addBotMessage('❌ Error: Por favor configura tu API key de Google en el archivo chatbot.js');
        return;
    }
    
    // Limpiar input
    chatInput.value = '';
    chatInput.focus();
    
    // Agregar mensaje del usuario
    addUserMessage(message);
    
    // Mostrar indicador de carga
    showLoadingIndicator();
    
    try {
        // Enviar a Gemini API
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: message
                            }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Extraer respuesta
        if (data.candidates && data.candidates.length > 0) {
            const botResponse = data.candidates[0].content.parts[0].text;
            removeLoadingIndicator();
            addBotMessage(botResponse);
            
            // Guardar en historial
            conversationHistory.push({
                role: 'user',
                content: message
            });
            conversationHistory.push({
                role: 'assistant',
                content: botResponse
            });
        } else {
            throw new Error('No se recibió respuesta válida');
        }
    } catch (error) {
        removeLoadingIndicator();
        console.error('Error:', error);
        
        if (error.message.includes('401')) {
            addBotMessage('❌ Error de autenticación: Verifica que tu API key sea válida. Visita https://aistudio.google.com/app/apikey');
        } else if (error.message.includes('429')) {
            addBotMessage('⏱️ Error: Has excedido el límite de solicitudes. Por favor, espera un momento.');
        } else {
            addBotMessage(`❌ Error: ${error.message || 'No se pudo conectar con el servicio'}`);
        }
    }
}

/**
 * Agrega un mensaje del usuario al chat
 */
function addUserMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message message-user';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll al final
    scrollToBottom();
}

/**
 * Agrega un mensaje del bot al chat
 */
function addBotMessage(text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message message-bot';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Formatear el texto (básico markdown)
    contentDiv.innerHTML = formatMessageText(text);
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll al final
    scrollToBottom();
}

/**
 * Muestra el indicador de carga
 */
function showLoadingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chatbot-message message-bot loading';
    messageDiv.id = 'loading-indicator';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        contentDiv.appendChild(dot);
    }
    
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // Scroll al final
    scrollToBottom();
}

/**
 * Remueve el indicador de carga
 */
function removeLoadingIndicator() {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

/**
 * Desplaza el chat al final
 */
function scrollToBottom() {
    setTimeout(() => {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 0);
}

/**
 * Formatea el texto del mensaje (soporte básico para markdown)
 */
function formatMessageText(text) {
    let formatted = text
        // Escapar HTML
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Line breaks
        .replace(/\n/g, '<br>');
    
    return formatted;
}

// ===== INICIALIZACIÓN =====
console.log('Chatbot cargado correctamente. Recuerda configurar tu API key de Google.');
