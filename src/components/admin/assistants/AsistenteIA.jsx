import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, ChevronDown } from 'lucide-react';

import { API_URL } from '../../../global/config/api';

// ============================================
// PASO 1: Agrega este componente al inicio
// ============================================
const MarkdownRenderer = ({ content }) => {
    const processMarkdown = (text) => {
        let processed = text;

        // ===== NUEVO: Procesar TABLAS primero =====
        processed = processed.replace(/\n(\|.+\|)\n(\|[\s:|-]+\|)\n((?:\|.+\|\n?)+)/g, (match, header, separator, rows) => {
            // Procesar encabezados
            const headers = header.split('|').slice(1, -1).map(h => h.trim());

            // Procesar alineación
            const alignments = separator.split('|').slice(1, -1).map(s => {
                s = s.trim();
                if (s.startsWith(':') && s.endsWith(':')) return 'center';
                if (s.endsWith(':')) return 'right';
                return 'left';
            });

            // Procesar filas
            const rowsArray = rows.trim().split('\n').map(row => {
                return row.split('|').slice(1, -1).map(cell => cell.trim());
            });

            // Generar HTML de la tabla
            let tableHTML = '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300 dark:border-gray-600">';

            // Encabezados
            tableHTML += '<thead class="bg-gray-100 dark:bg-gray-800"><tr>';
            headers.forEach((header, i) => {
                const align = alignments[i] || 'left';
                tableHTML += `<th class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-${align} font-semibold text-gray-900 dark:text-white">${escapeHtml(header)}</th>`;
            });
            tableHTML += '</tr></thead>';

            // Cuerpo
            tableHTML += '<tbody>';
            rowsArray.forEach(row => {
                tableHTML += '<tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">';
                row.forEach((cell, i) => {
                    const align = alignments[i] || 'left';
                    tableHTML += `<td class="border border-gray-300 dark:border-gray-600 px-4 py-2 text-${align} text-gray-700 dark:text-gray-300">${escapeHtml(cell)}</td>`;
                });
                tableHTML += '</tr>';
            });
            tableHTML += '</tbody></table></div>';

            return tableHTML;
        });

        // Bloques de código con ```
        processed = processed.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-3"><code class="text-sm">${escapeHtml(code.trim())}</code></pre>`;
        });

        // Código inline con `
        processed = processed.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');

        // Negrita **texto**
        processed = processed.replace(/\*\*([^\*]+)\*\*/g, '<strong class="font-bold">$1</strong>');

        // Cursiva *texto*
        processed = processed.replace(/\*([^\*]+)\*/g, '<em class="italic">$1</em>');

        // Títulos
        processed = processed.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
        processed = processed.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>');
        processed = processed.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>');

        // Listas numeradas
        processed = processed.replace(/^\d+\.\s+(.*)$/gim, '<li class="ml-4 mb-1">$1</li>');
        processed = processed.replace(/(<li class="ml-4 mb-1">.*<\/li>\n?)+/g, '<ol class="list-decimal ml-4 my-2">$&</ol>');

        // Listas con viñetas
        processed = processed.replace(/^[-*]\s+(.*)$/gim, '<li class="ml-4 mb-1">$1</li>');
        processed = processed.replace(/(<li class="ml-4 mb-1">.*<\/li>\n?)+/g, (match) => {
            if (!match.includes('list-decimal')) {
                return `<ul class="list-disc ml-4 my-2">${match}</ul>`;
            }
            return match;
        });

        // Enlaces [texto](url)
        processed = processed.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a href="$2" class="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

        // Saltos de línea
        processed = processed.replace(/\n\n/g, '<br/><br/>');
        processed = processed.replace(/\n/g, '<br/>');

        return processed;
    };

    const escapeHtml = (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    };

    return (
        <div
            className="markdown-content text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: processMarkdown(content) }}
        />
    );
};

// ============================================
// Tu componente original (con un pequeño cambio)
// ============================================
const AsistenteIA = () => {
    const [mensajes, setMensajes] = useState([
        {
            tipo: 'asistente',
            contenido: '¡Hola! Soy tu asistente de IA. Puedo ayudarte con información sobre clientes, paquetes, rutas y vehículos pero proximamente con muchisimo más. ¿Qué te gustaría saber?'
        }
    ]);
    const [pregunta, setPregunta] = useState('');
    const [loading, setLoading] = useState(false);
    const mensajesEndRef = useRef(null);

    useEffect(() => {
        mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [mensajes]);

    const enviarPregunta = async (e) => {
        e?.preventDefault();

        if (!pregunta.trim()) return;

        const nuevaPregunta = {
            tipo: 'usuario',
            contenido: pregunta
        };

        setMensajes(prev => [...prev, nuevaPregunta]);
        const preguntaActual = pregunta;
        setPregunta('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(
                `${API_URL}/api/v1/asistente/consultar/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ pregunta: preguntaActual })
                }
            );

            const data = await response.json();

            if (response.ok) {
                setMensajes(prev => [...prev, {
                    tipo: 'asistente',
                    contenido: data.respuesta  // <-- Tu backend envía esto normalmente
                }]);
            } else {
                setMensajes(prev => [...prev, {
                    tipo: 'error',
                    contenido: data.error || 'Lo siento, hubo un error al procesar tu pregunta. Intenta de nuevo.'
                }]);
            }

        } catch (error) {
            console.error('Error:', error);
            setMensajes(prev => [...prev, {
                tipo: 'error',
                contenido: 'Lo siento, hubo un error al procesar tu pregunta. Intenta de nuevo.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const preguntasSugeridas = [
        "¿Quién es el cliente que más paquetes ha pedido?",
        "¿Cuántos paquetes hay pendientes de entrega?",
        "¿Cuántas rutas se han completado?",
        "¿Qué tipo de vehículos tenemos disponibles?",
        "¿Cuál es el valor total de paquetes entregados?"
    ];

    const usarPreguntaSugerida = (preguntaSugerida) => {
        setPregunta(preguntaSugerida);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            enviarPregunta();
        }
    };

    return (
        <div className="min-h-screen p-4 sm:p-6">
            <div className="max-w-5xl mx-auto">
                {/* Header Card */}
                <div className="mb-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 px-6 py-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div>
                                <h1 className="text-2xl font-bold text-white">
                                    ¡Hola! Soy Alex, tu asistente de AI
                                </h1>
                                <p className="text-sm text-blue-100 mt-0.5">
                                    Consulta información compleja sobre Route Manager de forma sencilla con mi ayuda
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Card */}
                <div className="mb-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-6">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Conversación</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Historial de mensajes con nuestro Analista</p>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        {mensajes.map((mensaje, index) => (
                            <div
                                key={index}
                                className={`flex ${mensaje.tipo === 'usuario' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                                style={{
                                    animation: 'fadeIn 0.3s ease-in',
                                    animationDelay: `${index * 0.05}s`,
                                    animationFillMode: 'backwards'
                                }}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 transition-all duration-200 hover:scale-[1.02] ${mensaje.tipo === 'usuario'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : mensaje.tipo === 'error'
                                                ? 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white shadow-sm'
                                        }`}
                                >
                                    {mensaje.tipo === 'asistente' && (
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700 mb-8">
                                            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                                Asistente
                                            </span>
                                        </div>
                                    )}

                                    {/* ============================================ */}
                                    {/* PASO 2: Cambia esta parte solamente          */}
                                    {/* ============================================ */}
                                    {mensaje.tipo === 'usuario' || mensaje.tipo === 'error' ? (
                                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {mensaje.contenido}
                                        </p>
                                    ) : (
                                        <MarkdownRenderer content={mensaje.contenido} />
                                    )}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex justify-start animate-fadeIn">
                                <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={mensajesEndRef} />
                    </div>
                </div>

                {/* Suggested Questions */}
                {mensajes.length <= 3 && (
                    <div className="mb-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 sm:p-6 animate-fadeIn">
                        <div className="flex items-center gap-2 mb-3">
                            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Preguntas sugeridas
                            </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {preguntasSugeridas.map((sugerencia, index) => (
                                <button
                                    key={index}
                                    onClick={() => usarPreguntaSugerida(sugerencia)}
                                    className="text-xs bg-gray-50 hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:scale-105 hover:shadow-md"
                                >
                                    {sugerencia}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input Card */}
                <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 sm:p-6 shadow-lg">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={pregunta}
                            onChange={(e) => setPregunta(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Escribe tu pregunta aquí..."
                            className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            disabled={loading}
                        />
                        <button
                            onClick={enviarPregunta}
                            disabled={loading || !pregunta.trim()}
                            className="px-3 sm:px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 disabled:hover:scale-100 flex-shrink-0"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="hidden sm:inline">Enviando...</span>
                                </>
                            ) : (
                                <>
                                    <Send className='w-4' />
                                    <span className="hidden sm:inline">Enviar</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-in;
                }
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: transparent;
                }
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #cbd5e0;
                    border-radius: 3px;
                }
                .dark .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #4a5568;
                }
            `}} />
        </div>
    );
};

export default AsistenteIA;