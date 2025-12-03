import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Sparkles, ChevronDown } from 'lucide-react';

import { API_URL } from '../../../global/config/api';

import ComponentCard from '../../common/ComponentCard';


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
                    contenido: data.respuesta
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6">
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
                <ComponentCard 
                    className="mb-6"
                    title="Conversación"
                    desc="Historial de mensajes con nuestro Analista"
                >
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
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 transition-all duration-200 hover:scale-[1.02] ${
                                        mensaje.tipo === 'usuario'
                                            ? 'bg-blue-600 text-white shadow-md'
                                            : mensaje.tipo === 'error'
                                                ? 'bg-red-50 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white shadow-sm'
                                    }`}
                                >
                                    {mensaje.tipo === 'asistente' && (
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200 dark:border-gray-700">
                                            <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                                Asistente
                                            </span>
                                        </div>
                                    )}
                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                        {mensaje.contenido}
                                    </p>
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
                </ComponentCard>

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
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-105 disabled:hover:scale-100"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span className="hidden sm:inline">Enviando...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span className="hidden sm:inline">Enviar</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
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