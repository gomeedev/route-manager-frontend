import React, { useState, useEffect } from 'react';
import { Truck, Package, MapPin, BarChart3, Clock, CheckCircle, TrendingUp, Users, Shield, ArrowRight, Play, X, Sparkles, Brain, Zap } from 'lucide-react';
import { logoUrl, iconUrl } from '../../global/supabase/storageService';

import ThemeTogglerTwo from '../../components/common/ThemeTogglerTwo';




export const LandingPage = () => {


    const [dynamicWord, setDynamicWord] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [charIndex, setCharIndex] = useState(0);
    const [showModal, setShowModal] = useState(false);


    const words = ['rutas', 'entregas', 'paquetes', 'tiempos', 'costos'];

    useEffect(() => {
        const currentWord = words[wordIndex];
        const typingSpeed = isDeleting ? 50 : 100;
        const pauseTime = isDeleting ? 500 : 2000;

        if (!isDeleting && charIndex === currentWord.length) {
            setTimeout(() => setIsDeleting(true), pauseTime);
            return;
        }

        if (isDeleting && charIndex === 0) {
            setIsDeleting(false);
            setWordIndex((prev) => (prev + 1) % words.length);
            return;
        }

        const timeout = setTimeout(() => {
            setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
            setDynamicWord(currentWord.substring(0, charIndex + (isDeleting ? -1 : 1)));
        }, typingSpeed);

        return () => clearTimeout(timeout);
    }, [charIndex, isDeleting, wordIndex]);

    // Carrusel infinito de empresas
    const companies = [
        { name: 'Servientrega', logo: '/companies/servientrega_logo.png' },
        { name: 'Interrapidísimo', logo: '/companies/interrapidisimo_logo.png' },
        { name: 'Coordinadora', logo: '/companies/coordinadora_logo.png' },
        { name: 'Envía', logo: '/companies/envia_logo.png' },
        { name: 'TCC', logo: '/companies/tcc_logo.png' },
        { name: 'Deprisa', logo: '/companies/deprisa_logo.svg' },
        { name: 'Fedex', logo: '/companies/Fedex-logo.png' },
        { name: 'DHL', logo: '/companies/DHL-logo.png' },
        { name: 'UPS', logo: '/companies/UPS_logo.png' },
        { name: '99 Minutos', logo: '/companies/99_logo.gif' },
        { name: 'Mensajeros Urbanos', logo: '/companies/mensajeros_logo.png' },
    ];

    const handleNavigate = (path) => {
        window.location.href = path;
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 relative overflow-hidden">
            {/* Background futurista */}
            <div className="fixed inset-0 pointer-events-none">
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>

                {/* Gradient orbs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-24 h-10 rounded-lg">
                                <img src={logoUrl} alt="" />
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleNavigate('/signin')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                            >
                                Iniciar sesión
                            </button>
                            <button
                                onClick={() => handleNavigate('/signup')}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-sm"
                            >
                                Registrarse
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-6">
                            Transforma y optimiza tus{' '}
                            <span className="text-blue-600 inline-block min-w-[200px] text-left">
                                {dynamicWord}
                                <span className="animate-pulse">|</span>
                            </span>
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
                            Sistema completo de gestión logística que reduce costos, mejora tiempos de entrega
                            y aumenta la satisfacción de tus clientes
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => handleNavigate('/signup')}
                                className="w-full sm:w-auto px-8 py-4 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                Comenzar gratis
                                <ArrowRight className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowModal(true)}
                                className="group w-full sm:w-auto px-8 py-4 text-base font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition flex items-center justify-center gap-2"
                            >
                                <Play className="w-5 h-5" />
                                Ver demo
                            </button>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-8 sm:p-12">
                            <img
                                src="/demos/demo.png"
                                alt="Dashboard principal mostrando mapa con rutas optimizadas, lista de paquetes y métricas en tiempo real"
                                className="w-full rounded-lg shadow-xl dark:hidden"
                            />
                            <img
                                src="/demos//demo_dark.png"
                                alt="Dashboard principal mostrando mapa con rutas optimizadas, lista de paquetes y métricas en tiempo real"
                                className="w-full rounded-lg shadow-xl hidden dark:block"
                            />
                        </div>
                    </div>
                </div>
            </section>


            {/* Companies Carousel */}
            <section className="relative py-16 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
                    <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Solución ideal para empresas de logística y distribución
                    </p>
                </div>

                <div className="relative">
                    <div className="flex animate-scroll-smooth gap-12 items-center">
                        {[...companies, ...companies, ...companies].map((company, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 flex items-center justify-center opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-300"
                            >
                                <div className="relative w-32 h-16 flex items-center justify-center">
                                    <div className="absolute inset-0 rounded-lg"></div>
                                    <img
                                        src={company.logo}
                                        alt={`${company.name} logo`}
                                        className="relative max-h-12 max-w-28 w-auto h-auto object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                            Todo lo que necesitas en un solo lugar
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Herramientas potentes y fáciles de usar para gestionar tu operación logística
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: MapPin,
                                title: 'Rutas optimizadas',
                                description: 'Algoritmos inteligentes calculan la mejor ruta para cada entrega, ahorrando tiempo y combustible'
                            },
                            {
                                icon: Package,
                                title: 'Gestión de paquetes',
                                description: 'Control completo del ciclo de vida de cada paquete desde su creación hasta la entrega final'
                            },
                            {
                                icon: Clock,
                                title: 'Seguimiento en tiempo real',
                                description: 'Monitorea la ubicación de tus conductores y el estado de las entregas en cada momento'
                            },
                            {
                                icon: BarChart3,
                                title: 'Reportes detallados',
                                description: 'Analiza el desempeño de tu operación con métricas y estadísticas actualizadas'
                            },
                            {
                                icon: Users,
                                title: 'Gestión de equipo',
                                description: 'Administra conductores, vehículos y asignaciones desde un panel centralizado'
                            },
                            {
                                icon: Shield,
                                title: 'Seguridad garantizada',
                                description: 'Autenticación robusta y almacenamiento seguro de toda tu información operativa'
                            }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 transition-all hover:shadow-lg group"
                            >
                                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* How it works - Con flechas */}
            <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                            ¿Cómo funciona?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Comienza a optimizar tus entregas en minutos
                        </p>
                    </div>

                    <div className="relative grid md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Registra paquetes', description: 'Carga la información de los paquetes a entregar con sus direcciones' },
                            { step: '02', title: 'Crea la ruta', description: 'Asigna conductor, vehículo y deja que el sistema optimice el recorrido' },
                            { step: '03', title: 'Inicia entregas', description: 'El conductor sigue la ruta optimizada y registra cada entrega' },
                            { step: '04', title: 'Monitorea todo', description: 'Observa el progreso en tiempo real desde el panel administrativo' }
                        ].map((step, index) => (
                            <div key={index} className="relative">
                                <div className="text-center relative z-10">
                                    <div className="flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl font-bold mx-auto mb-4 shadow-lg shadow-blue-500/30">
                                        {step.step}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                                        {step.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Flecha conectora - solo en desktop */}
                                {index < 3 && (
                                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] z-0">
                                        <svg className="w-full h-8 text-blue-600 dark:text-blue-500 opacity-30" viewBox="0 0 100 20">
                                            <defs>
                                                <marker id={`arrowhead-${index}`} markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                                                    <polygon points="0 0, 10 3, 0 6" fill="currentColor" />
                                                </marker>
                                            </defs>
                                            <line
                                                x1="0" y1="10" x2="90" y2="10"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeDasharray="5,5"
                                                markerEnd={`url(#arrowhead-${index})`}
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900">
                {/* Background effects */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto max-w-6xl relative z-10 mb-16">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6 backdrop-blur-sm">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-sm font-semibold">Potenciado por Inteligencia Artificial</span>
                        </div>

                        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Toma decisiones más rápidas con Alex
                        </h2>

                        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                            Pregunta en lenguaje natural y obtén análisis instantáneos de clientes, conductores,
                            rutas y métricas financieras. Sin consultas SQL, sin reportes manuales, sin esperas.
                        </p>
                    </div>
                    {/* Video Container - Estilo iPad */}
                    <div className="relative max-w-5xl mx-auto">
                        {/* Device mockup */}
                        <div className="relative rounded-[2rem] overflow-hidden shadow-2xl bg-gray-900 dark:bg-gray-950 border-8 border-gray-900 dark:border-gray-950">
                            {/* Top bar con 3 puntos (estilo iPad/browser) */}
                            <div className="absolute top-0 left-0 right-0 h-12 bg-gray-800/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-700 dark:border-gray-800 z-10 flex items-center px-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                            </div>

                            {/* Video propio */}
                            <div className="relative pt-12 aspect-video bg-gray-950">
                                <video
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    disablePictureInPicture
                                    controlsList="nodownload nofullscreen noremoteplayback"
                                >
                                    <source src="/demos/Alex_demo.mp4" type="video/mp4" />
                                    <source src="/demos/alex-demo.webm" type="video/webm" />
                                    {/* Fallback para navegadores que no soporten video */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-indigo-900/20 backdrop-blur-sm">
                                        <div className="text-center">
                                            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 border border-white/20">
                                                <Play className="w-10 h-10 text-white" />
                                            </div>
                                            <p className="text-white text-lg font-medium mb-2">Demo de Alex AI</p>
                                            <p className="text-white/70 text-sm">Tu navegador no soporta video HTML5</p>
                                        </div>
                                    </div>
                                </video>
                            </div>
                        </div>

                        {/* Floating elements decorativos */}
                        <div className="absolute -top-8 -left-8 w-24 h-24 bg-blue-500/20 rounded-2xl blur-2xl animate-pulse"></div>
                        <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-500/20 rounded-2xl blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                </div>
            </section>


            {/* CTA Final */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-600">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        ¿Listo para transformar tu logística?
                    </h2>
                    <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                        Únete a las empresas que ya están optimizando sus operaciones con Route Manager
                    </p>
                    <button
                        onClick={() => handleNavigate('/signup')}
                        className="inline-flex items-center gap-2 px-8 py-4 text-base font-medium text-blue-600 bg-white rounded-lg hover:bg-gray-50 transition shadow-lg hover:shadow-xl"
                    >
                        Comenzar ahora
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </section>

            <footer className="relative py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-32 h-8 rounded-lg">
                                <img src={logoUrl} alt="" />
                            </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © 2024 RouteManager. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>

            <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                <ThemeTogglerTwo />
            </div>
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-4xl bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-scaleIn">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors backdrop-blur-sm"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                        <div className="aspect-video">
                            <iframe
                                className="w-full h-full"
                                src="https://www.youtube.com/embed/r9sJcTkQwPg"
                                title="Demo de RouteManager"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
    @keyframes scroll-smooth {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
    }
    
    .animate-scroll-smooth {
        animation: scroll-smooth 20s linear infinite;
        will-change: transform;
    }
    
    .animate-scroll-smooth:hover {
        animation-play-state: paused;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes scaleIn {
        from {
            transform: scale(0.9);
            opacity: 0;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }

    .animate-fadeIn {
        animation: fadeIn 0.2s ease-out;
    }

    .animate-scaleIn {
        animation: scaleIn 0.3s ease-out;
    }

    .bg-grid-pattern {
        background-image: 
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px);
        background-size: 40px 40px;
    }

    .bg-grid-white {
        background-image: 
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
        background-size: 50px 50px;
    }
`}
            </style >
        </div>
    )
}