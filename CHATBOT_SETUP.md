# 🤖 Guía de Configuración del Chatbot con Gemini Flash

## 📋 Requisitos

Tu sitio web ahora incluye un **asistente de IA chatbot** conectado a **Google Gemini Flash**, ubicado en la esquina inferior derecha de la página.

## 🔑 Paso 1: Obtener tu API Key de Google

1. Dirígete a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Inicia sesión con tu cuenta de Google (crea una si no tienes)
3. Haz clic en **"Create API key"**
4. Copia tu API key

## 🛠️ Paso 2: Configurar la API Key en tu Proyecto

1. Abre el archivo `chatbot.js` en tu editor
2. Busca la línea:
   ```javascript
   const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';
   ```
3. Reemplaza `'YOUR_API_KEY_HERE'` con tu API key. Ejemplo:
   ```javascript
   const GEMINI_API_KEY = 'AIzaSyD... (tu clave aquí)';
   ```
4. Guarda el archivo

## ✨ Características del Chatbot

- ✅ **Interfaz moderna y responsiva** - Se adapta a cualquier dispositivo
- ✅ **Animaciones suaves** - Efectos visuales profesionales
- ✅ **Mensajes en tiempo real** - Comunicación instantánea con Gemini
- ✅ **Indicador de escritura** - Muestra cuando la IA está generando respuesta
- ✅ **Historial de conversación** - Mantiene el contexto de la charla
- ✅ **Manejo de errores** - Mensajes claros si algo falla
- ✅ **JavaScript puro** - Sin dependencias externas, solo Fetch API

## 🎨 Estilo y Ubicación

- **Posición**: Esquina inferior derecha (fija)
- **Colores**: Utiliza el gradiente principal del sitio
- **Tamaño**: 380px de ancho, responsive en móviles
- **Botón flotante**: 60px de diámetro con sombra

## 🚀 Uso

1. Haz clic en el botón flotante del chat en la esquina inferior derecha
2. Escribe tu pregunta o mensaje
3. Presiona Enter o haz clic en el botón de envío
4. Espera la respuesta del asistente IA

## ⚙️ Configuración Avanzada

En `chatbot.js` puedes ajustar estos parámetros:

```javascript
generationConfig: {
    temperature: 0.7,        // 0-1: Creatividad (0=determinista, 1=creativo)
    topK: 40,               // Número de tokens considerados
    topP: 0.95,             // Diversidad de respuesta
    maxOutputTokens: 1024,  // Longitud máxima de respuesta
}
```

## 🐛 Solución de Problemas

### Error: "API key not configured"
- Verifica que hayas reemplazado `'YOUR_API_KEY_HERE'` con tu clave actual
- No incluyas comillas extras alrededor de la clave

### Error 401 (Autenticación)
- Tu API key es inválida o ha expirado
- Genera una nueva en [Google AI Studio](https://aistudio.google.com/app/apikey)

### Error 429 (Rate Limit)
- Has hecho demasiadas solicitudes
- Espera unos minutos y vuelve a intentar

### El chatbot no aparece
- Asegúrate de que `chatbot.js` esté incluido antes de `script.js` en el HTML
- Verifica la consola del navegador (F12) para ver errores

## 📱 Responsive

El chatbot se adapta perfectamente a:
- 💻 Computadoras de escritorio
- 📱 Tablets
- 📲 Teléfonos móviles

## 🔐 Seguridad

**⚠️ IMPORTANTE**: La API key está expuesta en el cliente. Para producción:
1. Usa un servidor backend
2. Guarda la API key en variables de entorno
3. Realiza llamadas a través del servidor

## 📚 Recursos Útiles

- [Documentación de Gemini API](https://ai.google.dev/docs)
- [Google AI Studio](https://aistudio.google.com)
- [Fetch API Documentation](https://developer.mozilla.org/es/docs/Web/API/Fetch_API)

## 🎯 Próximas Mejoras Sugeridas

- [ ] Agregar soporte para envío de imágenes
- [ ] Guardar historial localmente
- [ ] Exportar conversaciones
- [ ] Temas oscuro/claro
- [ ] Soporte para múltiples idiomas
- [ ] Integración con backend para seguridad

---

**¡Tu chatbot está listo! Disfruta de tu asistente de IA integrado.**
