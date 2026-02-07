'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Search,
  Loader2,
  Award,
  User,
  BookOpen,
  Calendar,
  FileText,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Participante {
  id: string;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
}

interface Curso {
  id: string;
  nombre: string;
  tipo: string;
  modalidad: string;
  horasAcademicas: number;
  horasCronologicas?: number;
  creditos?: number;
  temario: string[];
  categoria: { nombre: string };
}

const tipoConfig: Record<string, { color: string; label: string }> = {
  DIPLOMADO: { color: 'bg-violet-100 text-violet-700', label: 'Diplomado' },
  CERTIFICADO: { color: 'bg-blue-100 text-blue-700', label: 'Certificado' },
  CONSTANCIA: { color: 'bg-emerald-100 text-emerald-700', label: 'Constancia' },
};

export default function EmitirCertificadoPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Búsqueda de participante
  const [searchParticipante, setSearchParticipante] = useState('');
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [selectedParticipante, setSelectedParticipante] = useState<Participante | null>(null);
  const [searchingParticipante, setSearchingParticipante] = useState(false);

  // Cursos
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [selectedCurso, setSelectedCurso] = useState<Curso | null>(null);
  const [loadingCursos, setLoadingCursos] = useState(true);

  // Datos del certificado
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFin: '',
    nota: '',
    notaLetra: 'Aprobado',
    observaciones: '',
  });

  useEffect(() => {
    fetchCursos();
  }, []);

  async function fetchCursos() {
    try {
      const response = await fetch('/api/admin/cursos');
      if (response.ok) {
        const data = await response.json();
        setCursos(data);
      }
    } catch (error) {
      console.error('Error fetching cursos:', error);
    } finally {
      setLoadingCursos(false);
    }
  }

  async function searchParticipantes() {
    if (!searchParticipante.trim()) return;

    setSearchingParticipante(true);
    try {
      const response = await fetch(
        `/api/admin/participantes?search=${encodeURIComponent(searchParticipante)}&limit=5`
      );
      if (response.ok) {
        const data = await response.json();
        setParticipantes(data.participantes);
      }
    } catch (error) {
      console.error('Error searching participantes:', error);
    } finally {
      setSearchingParticipante(false);
    }
  }

  async function handleSubmit() {
    if (!selectedParticipante || !selectedCurso) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/certificados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          participanteId: selectedParticipante.id,
          cursoId: selectedCurso.id,
          fechaInicio: formData.fechaInicio || undefined,
          fechaFin: formData.fechaFin || undefined,
          nota: formData.nota ? parseFloat(formData.nota) : undefined,
          notaLetra: formData.notaLetra,
          observaciones: formData.observaciones || undefined,
          emitidoPorId: 'admin', // TODO: Obtener del usuario autenticado
        }),
      });

      if (response.ok) {
        const certificado = await response.json();
        router.push(`/admin/certificados/${certificado.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Error al emitir certificado');
      }
    } catch (error) {
      console.error('Error emitting certificado:', error);
      alert('Error al emitir certificado');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/certificados">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Emitir Certificado</h1>
          <p className="text-gray-500">Genera un certificado válido para concursos públicos</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4">
        {[
          { num: 1, label: 'Participante', icon: User },
          { num: 2, label: 'Curso', icon: BookOpen },
          { num: 3, label: 'Detalles', icon: FileText },
          { num: 4, label: 'Confirmar', icon: CheckCircle },
        ].map((s, index) => {
          const Icon = s.icon;
          return (
            <div key={s.num} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  step === s.num
                    ? 'bg-violet-100 text-violet-700'
                    : step > s.num
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
              </div>
              {index < 3 && (
                <div
                  className={`w-8 h-0.5 mx-2 ${
                    step > s.num ? 'bg-green-300' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Seleccionar Participante */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-violet-600" />
              Seleccionar Participante
            </CardTitle>
            <CardDescription>
              Busca al participante por nombre, DNI o correo electrónico
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, DNI o email..."
                  value={searchParticipante}
                  onChange={(e) => setSearchParticipante(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchParticipantes()}
                  className="pl-10"
                />
              </div>
              <Button onClick={searchParticipantes} disabled={searchingParticipante}>
                {searchingParticipante ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  'Buscar'
                )}
              </Button>
            </div>

            {participantes.length > 0 && (
              <div className="space-y-2">
                <Label>Resultados de búsqueda</Label>
                <div className="border rounded-lg divide-y">
                  {participantes.map((p) => (
                    <div
                      key={p.id}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedParticipante?.id === p.id ? 'bg-violet-50 border-violet-200' : ''
                      }`}
                      onClick={() => setSelectedParticipante(p)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-violet-600">
                              {p.nombreCompleto
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{p.nombreCompleto}</p>
                            <p className="text-sm text-gray-500">
                              {p.tipoDocumento}: {p.numeroDocumento} • {p.email}
                            </p>
                          </div>
                        </div>
                        {selectedParticipante?.id === p.id && (
                          <CheckCircle className="h-5 w-5 text-violet-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedParticipante && (
              <div className="flex justify-end">
                <Button
                  className="bg-violet-600 hover:bg-violet-700"
                  onClick={() => setStep(2)}
                >
                  Continuar
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Seleccionar Curso */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-violet-600" />
              Seleccionar Curso
            </CardTitle>
            <CardDescription>
              Elige el curso para el cual se emitirá el certificado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loadingCursos ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
              </div>
            ) : (
              <div className="grid gap-3">
                {cursos.map((curso) => {
                  const tipoInfo = tipoConfig[curso.tipo] || tipoConfig.CERTIFICADO;
                  return (
                    <div
                      key={curso.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                        selectedCurso?.id === curso.id
                          ? 'bg-violet-50 border-violet-300'
                          : 'border-gray-200'
                      }`}
                      onClick={() => setSelectedCurso(curso)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={tipoInfo.color} variant="secondary">
                              {tipoInfo.label}
                            </Badge>
                            <Badge variant="outline">{curso.horasAcademicas} horas</Badge>
                            {curso.creditos && (
                              <Badge variant="outline">{curso.creditos} créditos</Badge>
                            )}
                          </div>
                          <p className="font-medium text-gray-900">{curso.nombre}</p>
                          <p className="text-sm text-gray-500">
                            {curso.categoria?.nombre} • {curso.modalidad.toLowerCase()}
                          </p>
                        </div>
                        {selectedCurso?.id === curso.id && (
                          <CheckCircle className="h-5 w-5 text-violet-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Atrás
              </Button>
              <Button
                className="bg-violet-600 hover:bg-violet-700"
                onClick={() => setStep(3)}
                disabled={!selectedCurso}
              >
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Detalles del Certificado */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-violet-600" />
              Detalles del Certificado
            </CardTitle>
            <CardDescription>
              Ingresa las fechas y calificación del participante
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={(e) =>
                    setFormData({ ...formData, fechaInicio: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="fechaFin">Fecha de Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={formData.fechaFin}
                  onChange={(e) =>
                    setFormData({ ...formData, fechaFin: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="nota">Nota (opcional)</Label>
                <Input
                  id="nota"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  placeholder="0 - 20"
                  value={formData.nota}
                  onChange={(e) =>
                    setFormData({ ...formData, nota: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="notaLetra">Calificación</Label>
                <Select
                  value={formData.notaLetra}
                  onValueChange={(value) =>
                    setFormData({ ...formData, notaLetra: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aprobado">Aprobado</SelectItem>
                    <SelectItem value="Aprobado con Distinción">Aprobado con Distinción</SelectItem>
                    <SelectItem value="Excelente">Excelente</SelectItem>
                    <SelectItem value="Sobresaliente">Sobresaliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="observaciones">Observaciones (opcional)</Label>
                <Textarea
                  id="observaciones"
                  placeholder="Observaciones adicionales para el certificado..."
                  value={formData.observaciones}
                  onChange={(e) =>
                    setFormData({ ...formData, observaciones: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                Atrás
              </Button>
              <Button
                className="bg-violet-600 hover:bg-violet-700"
                onClick={() => setStep(4)}
              >
                Continuar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirmación */}
      {step === 4 && selectedParticipante && selectedCurso && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-violet-600" />
              Confirmar Emisión
            </CardTitle>
            <CardDescription>
              Revisa los datos antes de emitir el certificado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Resumen del Participante */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Participante</h3>
              <p className="font-semibold text-gray-900">{selectedParticipante.nombreCompleto}</p>
              <p className="text-sm text-gray-600">
                {selectedParticipante.tipoDocumento}: {selectedParticipante.numeroDocumento}
              </p>
              <p className="text-sm text-gray-600">{selectedParticipante.email}</p>
            </div>

            {/* Resumen del Curso */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Curso</h3>
              <div className="flex items-center gap-2 mb-1">
                <Badge
                  className={tipoConfig[selectedCurso.tipo]?.color || 'bg-gray-100'}
                  variant="secondary"
                >
                  {tipoConfig[selectedCurso.tipo]?.label || selectedCurso.tipo}
                </Badge>
              </div>
              <p className="font-semibold text-gray-900">{selectedCurso.nombre}</p>
              <p className="text-sm text-gray-600">
                {selectedCurso.horasAcademicas} horas académicas
                {selectedCurso.horasCronologicas && ` • ${selectedCurso.horasCronologicas} horas cronológicas`}
                {selectedCurso.creditos && ` • ${selectedCurso.creditos} créditos`}
              </p>
              <p className="text-sm text-gray-600">Modalidad: {selectedCurso.modalidad.toLowerCase()}</p>
            </div>

            {/* Resumen de Detalles */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Detalles del Certificado</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {formData.fechaInicio && (
                  <div>
                    <span className="text-gray-500">Fecha Inicio:</span>{' '}
                    <span className="text-gray-900">{formData.fechaInicio}</span>
                  </div>
                )}
                {formData.fechaFin && (
                  <div>
                    <span className="text-gray-500">Fecha Fin:</span>{' '}
                    <span className="text-gray-900">{formData.fechaFin}</span>
                  </div>
                )}
                {formData.nota && (
                  <div>
                    <span className="text-gray-500">Nota:</span>{' '}
                    <span className="text-gray-900">{formData.nota}</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Calificación:</span>{' '}
                  <span className="text-gray-900">{formData.notaLetra}</span>
                </div>
              </div>
              {formData.observaciones && (
                <div className="mt-2">
                  <span className="text-gray-500">Observaciones:</span>{' '}
                  <span className="text-gray-900">{formData.observaciones}</span>
                </div>
              )}
            </div>

            {/* Info importante */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800">
                <strong>Importante:</strong> Una vez emitido, el certificado será válido para ser
                presentado en concursos públicos (CAS, SERVIR) y contará con un código único de
                verificación y código QR.
              </p>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(3)}>
                Atrás
              </Button>
              <Button
                className="bg-violet-600 hover:bg-violet-700"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Emitiendo...
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4 mr-2" />
                    Emitir Certificado
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
