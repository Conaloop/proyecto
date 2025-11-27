// ===== CONFIGURACIÓN DEL CHATBOT =====

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=';

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
        // Construir URL de la API
        const fullUrl = GEMINI_API_URL + GEMINI_API_KEY;
        
        // Enviar a Gemini API
        const response = await fetch(fullUrl, {
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
            let errorMessage = `HTTP ${response.status}`;
            
            try {
                const errorData = await response.json();
                if (errorData.error) {
                    errorMessage = errorData.error.message || errorData.error;
                }
            } catch (e) {
                // Si no es JSON válido, usar el mensaje por defecto
            }
            
            throw new Error(errorMessage);
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
            throw new Error('No se recibió respuesta válida de la API');
        }
    } catch (error) {
        removeLoadingIndicator();
        console.error('Error completo:', error);
        
        const errorMsg = error.message || 'Error desconocido';
        
        if (errorMsg.includes('404')) {
            addBotMessage('❌ Error 404: API no encontrada. Verifica tu API key en https://aistudio.google.com/app/apikey');
        } else if (errorMsg.includes('401') || errorMsg.includes('PERMISSION_DENIED')) {
            addBotMessage('❌ Error 401: API key inválida o no autorizada. Obtén una nueva en https://aistudio.google.com/app/apikey');
        } else if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED')) {
            addBotMessage('⏱️ Error: Has excedido el límite de solicitudes. Espera un momento e intenta de nuevo.');
        } else if (errorMsg.includes('Failed to fetch')) {
            addBotMessage('❌ Error de conexión: No se pudo conectar a la API. Verifica tu conexión a internet.');
        } else {
            addBotMessage(`❌ Error: ${errorMsg}`);
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
