'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Send, User, Sparkles, ExternalLink, Loader2, CheckCircle, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  courses?: CourseResult[];
  isForm?: boolean;
  formType?: 'request_course';
}

interface CourseResult {
  id: string;
  title: string;
  slug: string;
  type: string;
  price: number;
  hours: number;
  shortDescription?: string;
}

interface RequestFormData {
  cursoSolicitado: string;
  nombre: string;
  contacto: string; // email o telefono
}

// Función para normalizar texto
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

// Función para buscar cursos en la API
async function searchCourses(query: string): Promise<CourseResult[]> {
  try {
    const response = await fetch(`/api/cursos?search=${encodeURIComponent(query)}&limit=5`);
    if (response.ok) {
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    }
  } catch (error) {
    console.error('Error searching courses:', error);
  }
  return [];
}

// Función para enviar solicitud de curso
async function sendCourseRequest(data: {
  cursoSolicitado: string;
  nombre?: string;
  email?: string;
  telefono?: string;
}): Promise<boolean> {
  try {
    const response = await fetch('/api/solicitudes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.ok;
  } catch (error) {
    console.error('Error sending request:', error);
    return false;
  }
}

// Robot SVG Component
function RobotIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="8" r="5" fill="#8B5CF6" />
      <rect x="48" y="12" width="4" height="10" fill="#8B5CF6" />
      <rect x="25" y="22" width="50" height="35" rx="8" fill="#6366F1" />
      <rect x="28" y="25" width="44" height="29" rx="6" fill="#818CF8" />
      <circle cx="38" cy="40" r="8" fill="white" />
      <circle cx="62" cy="40" r="8" fill="white" />
      <circle cx="40" cy="40" r="4" fill="#1E1B4B" />
      <circle cx="64" cy="40" r="4" fill="#1E1B4B" />
      <circle cx="41" cy="39" r="1.5" fill="white" />
      <circle cx="65" cy="39" r="1.5" fill="white" />
      <rect x="40" y="48" width="20" height="4" rx="2" fill="#1E1B4B" />
      <rect x="30" y="60" width="40" height="30" rx="6" fill="#6366F1" />
      <rect x="35" y="65" width="30" height="20" rx="4" fill="#818CF8" />
      <rect x="40" y="68" width="20" height="10" rx="2" fill="#C7D2FE" />
      <rect x="42" y="70" width="16" height="2" rx="1" fill="#6366F1" />
      <rect x="42" y="74" width="10" height="2" rx="1" fill="#6366F1" />
      <rect x="15" y="65" width="12" height="6" rx="3" fill="#8B5CF6" />
      <rect x="73" y="65" width="12" height="6" rx="3" fill="#8B5CF6" />
      <circle cx="12" cy="68" r="5" fill="#A78BFA" />
      <circle cx="88" cy="68" r="5" fill="#A78BFA" />
      <rect x="35" y="90" width="10" height="8" rx="2" fill="#8B5CF6" />
      <rect x="55" y="90" width="10" height="8" rx="2" fill="#8B5CF6" />
    </svg>
  );
}

// Componente para mostrar cursos encontrados
function CourseCard({ course }: { course: CourseResult }) {
  const tipoLabels: Record<string, string> = {
    diplomado: 'Diplomado',
    certificado: 'Certificado',
    constancia: 'Constancia',
  };

  return (
    <Link
      href={`/cursos/${course.slug}`}
      className="block p-3 bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 hover:border-violet-300 transition-all hover:shadow-md group"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 text-sm group-hover:text-violet-700 transition-colors line-clamp-2">
            {course.title}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span className="px-1.5 py-0.5 bg-violet-100 text-violet-700 rounded">
              {tipoLabels[course.type] || course.type}
            </span>
            <span>{course.hours} hrs</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-bold text-violet-600">S/ {course.price}</p>
          <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-violet-500 mt-1 ml-auto" />
        </div>
      </div>
    </Link>
  );
}

// Formulario de solicitud de curso
function CourseRequestForm({
  courseName,
  onSubmit,
  onCancel,
}: {
  courseName: string;
  onSubmit: (data: RequestFormData) => void;
  onCancel: () => void;
}) {
  const [nombre, setNombre] = useState('');
  const [contacto, setContacto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contacto.trim()) return;

    setIsSubmitting(true);
    await onSubmit({
      cursoSolicitado: courseName,
      nombre: nombre.trim(),
      contacto: contacto.trim(),
    });
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="ml-10 p-4 bg-white rounded-xl border border-violet-200 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-violet-700 font-medium text-sm">
        <Sparkles className="h-4 w-4" />
        Solicitar curso: "{courseName}"
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">Tu nombre (opcional)</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Juan Pérez"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
        />
      </div>

      <div>
        <label className="text-xs text-gray-500 mb-1 block">
          WhatsApp o Email <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={contacto}
          onChange={(e) => setContacto(e.target.value)}
          placeholder="Ej: 999888777 o tu@email.com"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          required
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={!contacto.trim() || isSubmitting}
          className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Solicitar Curso
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="text-sm"
        >
          Cancelar
        </Button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Te contactaremos para crear este curso
      </p>
    </form>
  );
}

// Detectar intención del usuario
function detectIntent(text: string): 'search' | 'price' | 'contact' | 'greeting' | 'thanks' | 'yes' | 'no' {
  const normalized = normalizeText(text);

  if (/^(si|sí|ok|dale|claro|por supuesto|quiero|yes)$/.test(normalized)) {
    return 'yes';
  }
  if (/^(no|cancelar|no gracias|otra vez)$/.test(normalized)) {
    return 'no';
  }
  if (/^(hola|hi|buenos dias|buenas tardes|buenas noches|hey)/.test(normalized)) {
    return 'greeting';
  }
  if (/(gracias|thanks|genial|perfecto|excelente)/.test(normalized)) {
    return 'thanks';
  }
  if (/(precio|costo|cuanto|cuánto|vale|pago)/.test(normalized)) {
    return 'price';
  }
  if (/(whatsapp|contacto|telefono|llamar|numero|correo|email)/.test(normalized)) {
    return 'contact';
  }
  return 'search';
}

export function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: '¡Hola! Soy tu asistente de CertificadosPerú.\n\nEscribe el curso que necesitas y te lo busco. Si no lo tenemos, ¡lo creamos para ti!',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [pendingRequest, setPendingRequest] = useState<string | null>(null);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, showRequestForm]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const addBotMessage = (text: string, courses?: CourseResult[]) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      isBot: true,
      timestamp: new Date(),
      courses,
    }]);
  };

  const handleRequestSubmit = async (data: RequestFormData) => {
    // Determinar si es email o telefono
    const isEmail = data.contacto.includes('@');

    const success = await sendCourseRequest({
      cursoSolicitado: data.cursoSolicitado,
      nombre: data.nombre || undefined,
      email: isEmail ? data.contacto : undefined,
      telefono: !isEmail ? data.contacto : undefined,
    });

    setShowRequestForm(false);
    setPendingRequest(null);

    if (success) {
      addBotMessage(
        `¡Solicitud enviada! Recibimos tu pedido para el curso "${data.cursoSolicitado}".\n\nNuestro equipo lo revisará y te contactaremos pronto al ${isEmail ? 'correo' : 'WhatsApp'} que nos dejaste.\n\n¿Hay otro curso que te interese?`
      );
    } else {
      addBotMessage(
        'Hubo un error al enviar tu solicitud. Por favor intenta de nuevo o contáctanos directamente al WhatsApp +51 999 999 999.'
      );
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userText = inputValue.trim();

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: userText,
      isBot: false,
      timestamp: new Date(),
    }]);

    setInputValue('');
    setIsTyping(true);

    // Detectar intención
    const intent = detectIntent(userText);

    // Pequeña pausa para naturalidad
    await new Promise(resolve => setTimeout(resolve, 600));

    // Si hay una solicitud pendiente y el usuario dice "sí"
    if (pendingRequest && intent === 'yes') {
      setIsTyping(false);
      setShowRequestForm(true);
      addBotMessage('¡Perfecto! Completa el formulario para solicitar el curso:');
      return;
    }

    // Si hay solicitud pendiente y dice "no"
    if (pendingRequest && intent === 'no') {
      setIsTyping(false);
      setPendingRequest(null);
      addBotMessage('No hay problema. ¿Quieres buscar otro curso? Solo escríbelo.');
      return;
    }

    // Cerrar formulario si estaba abierto
    setShowRequestForm(false);
    setPendingRequest(null);

    if (intent === 'greeting') {
      setIsTyping(false);
      addBotMessage('¡Hola! ¿Qué curso estás buscando? Escríbeme el tema y lo busco para ti.');
      return;
    }

    if (intent === 'thanks') {
      setIsTyping(false);
      addBotMessage('¡De nada! Si necesitas otro curso, solo escríbelo. Estoy aquí para ayudarte.');
      return;
    }

    if (intent === 'price') {
      setIsTyping(false);
      addBotMessage('Nuestros cursos van desde S/. 20 hasta S/. 40 soles. ¡Los más accesibles del mercado!\n\n¿Qué curso te interesa? Escribe el nombre.');
      return;
    }

    if (intent === 'contact') {
      setIsTyping(false);
      addBotMessage('Puedes contactarnos:\n\n📱 WhatsApp: +51 999 999 999\n📧 Email: info@certificadosperu.com\n\n¿O prefieres que busque un curso para ti?');
      return;
    }

    // Búsqueda de cursos
    const courses = await searchCourses(userText);
    setIsTyping(false);

    if (courses.length > 0) {
      addBotMessage(
        `Encontré ${courses.length} curso${courses.length > 1 ? 's' : ''} para "${userText}":`,
        courses
      );
    } else {
      // No se encontró el curso - ofrecer crear solicitud
      setPendingRequest(userText);
      addBotMessage(
        `No encontré cursos de "${userText}" disponibles.\n\n¿Te gustaría que creemos este curso para ti? Responde "sí" y te contactamos cuando esté listo.`
      );
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickOptions = [
    { label: 'Java', value: 'java programacion' },
    { label: 'Excel', value: 'excel' },
    { label: 'Enfermería', value: 'enfermeria' },
    { label: 'SIAF', value: 'siaf' },
  ];

  return (
    <>
      {/* Floating Button with Robot */}
      <div
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 cursor-pointer transition-all duration-300',
          isOpen && 'scale-0 opacity-0 pointer-events-none'
        )}
      >
        {/* Speech Bubble */}
        <div className="absolute bottom-full right-0 mb-3">
          <div className="bg-white rounded-2xl shadow-xl px-4 py-3 border border-violet-100 relative max-w-[220px]">
            <p className="text-sm font-medium text-gray-800">
              ¿No encuentras tu curso?
            </p>
            <p className="text-xs text-violet-600 font-semibold mt-1">
              ¡Lo creamos para ti!
            </p>
            <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-violet-100 transform rotate-45"></div>
          </div>
        </div>

        {/* Robot Container */}
        <div className="relative group">
          <div className="absolute inset-0 bg-violet-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
          <div className="relative bg-gradient-to-br from-violet-500 to-indigo-600 rounded-full p-3 shadow-2xl hover:scale-110 transition-transform duration-300">
            <RobotIcon className="w-14 h-14" />
            <span className="absolute top-0 right-0 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
            </span>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <div
        className={cn(
          'fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-48px)] rounded-2xl bg-white shadow-2xl transition-all duration-300 overflow-hidden',
          isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        )}
        style={{ height: 'min(650px, calc(100vh - 100px))' }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 p-1">
                <RobotIcon className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-semibold">Asistente de Cursos</h3>
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <span className="h-2 w-2 rounded-full bg-green-400"></span>
                  ¡Creamos el curso que necesites!
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
          style={{ height: 'calc(100% - 180px)' }}
        >
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div
                className={cn(
                  'flex gap-2',
                  message.isBot ? 'justify-start' : 'justify-end'
                )}
              >
                {message.isBot && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 p-1">
                    <RobotIcon className="w-6 h-6" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line',
                    message.isBot
                      ? 'bg-white text-gray-800 shadow-sm border border-gray-100'
                      : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white'
                  )}
                >
                  {message.text}
                </div>
                {!message.isBot && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                )}
              </div>

              {/* Course Results */}
              {message.courses && message.courses.length > 0 && (
                <div className="ml-10 space-y-2">
                  {message.courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Request Form */}
          {showRequestForm && pendingRequest && (
            <CourseRequestForm
              courseName={pendingRequest}
              onSubmit={handleRequestSubmit}
              onCancel={() => {
                setShowRequestForm(false);
                setPendingRequest(null);
                addBotMessage('Cancelado. ¿Quieres buscar otro curso?');
              }}
            />
          )}

          {isTyping && (
            <div className="flex gap-2 justify-start">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 p-1">
                <RobotIcon className="w-6 h-6" />
              </div>
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-violet-500" />
                <span className="text-sm text-gray-500">Buscando...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Options */}
        {messages.length <= 2 && !showRequestForm && (
          <div className="px-4 py-2 bg-gray-50 border-t">
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-violet-500" />
              Cursos populares
            </p>
            <div className="flex flex-wrap gap-2">
              {quickOptions.map((option) => (
                <button
                  key={option.label}
                  onClick={() => {
                    setInputValue(option.value);
                    setTimeout(handleSend, 100);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300 transition-colors shadow-sm"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t bg-white p-4">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={pendingRequest ? 'Escribe "sí" para solicitar...' : "Escribe el curso que buscas..."}
              className="flex-1 rounded-full border border-gray-200 px-4 py-2.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              disabled={isTyping || showRequestForm}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping || showRequestForm}
              size="icon"
              className="h-10 w-10 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 shadow-lg"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-400">
            Si no existe el curso, ¡lo creamos!
          </p>
        </div>
      </div>
    </>
  );
}
