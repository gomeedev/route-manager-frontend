import React, { useState, useEffect } from 'react';
import { Truck, Package, MapPin, BarChart3, Clock, CheckCircle, TrendingUp, Users, Shield, ArrowRight } from 'lucide-react';

import ThemeTogglerTwo from '../../components/common/ThemeTogglerTwo';




export const LandingPage = () => {


    const [dynamicWord, setDynamicWord] = useState('');
    const [wordIndex, setWordIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [charIndex, setCharIndex] = useState(0);

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
        'Servientrega', 'Interrapidísimo', 'Coordinadora', 'Envía',
        'TCC', 'Deprisa', 'Fedex', 'DHL', 'UPS', '99 Minutos',
        'Mensajeros Urbanos', 'Logística Colombia'
    ];

    const handleNavigate = (path) => {
        window.location.href = path;
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                                <Truck className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-gray-800 dark:text-white">
                                Route<span className="text-blue-600">Manager</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => handleNavigate('/signin')}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
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
                            <button className="w-full sm:w-auto px-8 py-4 text-base font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                                Ver demo
                            </button>
                        </div>
                    </div>

                    {/* Hero Image */}
                    <div className="mt-16 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-8 sm:p-12">
                            <img
                                src="/demo.png"
                                alt="Dashboard principal mostrando mapa con rutas optimizadas, lista de paquetes y métricas en tiempo real"
                                className="w-full rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Companies Carousel */}
            <section className="py-12 bg-gray-50 dark:bg-gray-900/50 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8">
                    <p className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        Solución ideal para empresas de logística y distribución
                    </p>
                </div>
                <div className="relative">
                    <div className="flex animate-scroll">
                        {[...companies, ...companies].map((company, index) => (
                            <div
                                key={index}
                                className="flex-shrink-0 mx-8 px-8 py-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700"
                            >
                                <span className="text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
                                    {company}
                                </span>
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

            {/* How it works */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                            ¿Cómo funciona?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Comienza a optimizar tus entregas en minutos
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '01', title: 'Registra paquetes', description: 'Carga la información de los paquetes a entregar con sus direcciones' },
                            { step: '02', title: 'Crea la ruta', description: 'Asigna conductor, vehículo y deja que el sistema optimice el recorrido' },
                            { step: '03', title: 'Inicia entregas', description: 'El conductor sigue la ruta optimizada y registra cada entrega' },
                            { step: '04', title: 'Monitorea todo', description: 'Observa el progreso en tiempo real desde el panel administrativo' },
                        ].map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-bold mx-auto mb-4">
                                    {step.step}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto max-w-6xl">
                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {[
                            { value: '40%', label: 'Reducción de costos operativos', icon: TrendingUp },
                            { value: '95%', label: 'Entregas exitosas', icon: CheckCircle },
                            { value: '30min', label: 'Tiempo promedio ahorrado por ruta', icon: Clock }
                        ].map((stat, index) => (
                            <div key={index} className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700">
                                <stat.icon className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                                <div className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
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

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200 dark:border-gray-800">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                                <Truck className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-gray-800 dark:text-white">
                                Route<span className="text-blue-600">Manager</span>
                            </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            © 2024 RouteManager. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </footer>

            <style>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    animation: scroll 30s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>

            <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
                <ThemeTogglerTwo />
            </div>
        </div>

    );
}