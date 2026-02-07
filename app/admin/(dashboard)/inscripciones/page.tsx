'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Award,
  Eye,
  BookOpen,
  User,
  Phone,
  Mail,
  FileText,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Participante {
  id: string;
  nombreCompleto: string;
  email: string;
  telefono?: string;
  tipoDocumento: string;
  numeroDocumento: string;
}

interface Curso {
  id: string;
  nombre: string;
  slug: string;
  tipo: string;
  modalidad: string;
  horasAcademicas: number;
  precio: number;
}

interface Certificado {
  id: string;
  codigoVerificacion: string;
  estado: string;
}

interface Inscripcion {
  id: string;
  estado: string;
  monto: number;
  fechaInscripcion: string;
  fechaPago?: string;
  participante: Participante;
  curso: Curso;
  certificado?: Certificado;
}

interface Pagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

const estadoConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  PAGADO: { label: 'Pagado', color: 'bg-blue-100 text-blue-700', icon: CreditCard },
  CURSANDO: { label: 'Cursando', color: 'bg-violet-100 text-violet-700', icon: BookOpen },
  COMPLETADO: { label: 'Completado', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const tipoConfig: Record<string, { color: string; label: string }> = {
  DIPLOMADO: { color: 'bg-violet-100 text-violet-700', label: 'Diplomado' },
  CERTIFICADO: { color: 'bg-blue-100 text-blue-700', label: 'Certificado' },
  CONSTANCIA: { color: 'bg-emerald-100 text-emerald-700', label: 'Constancia' },
};

export default function InscripcionesAdminPage() {
  const router = useRouter();
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('TODOS');
  const [page, setPage] = useState(1);

  // Dialog states
  const [selectedInscripcion, setSelectedInscripcion] = useState<Inscripcion | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'aprobar' | 'emitir' | 'cancelar' | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchInscripciones();
  }, [estadoFilter, page]);

  async function fetchInscripciones() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (estadoFilter !== 'TODOS') {
        params.append('estado', estadoFilter);
      }

      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/inscripciones?${params}`);
      if (response.ok) {
        const data = await response.json();
        setInscripciones(data.inscripciones);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching inscripciones:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    setPage(1);
    fetchInscripciones();
  }

  function openDetails(inscripcion: Inscripcion) {
    setSelectedInscripcion(inscripcion);
    setDetailsDialogOpen(true);
  }

  function openConfirmDialog(inscripcion: Inscripcion, action: 'aprobar' | 'emitir' | 'cancelar') {
    setSelectedInscripcion(inscripcion);
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  }

  async function handleConfirmAction() {
    if (!selectedInscripcion || !confirmAction) return;

    setProcessing(true);
    try {
      if (confirmAction === 'aprobar') {
        const response = await fetch(`/api/admin/inscripciones/${selectedInscripcion.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'PAGADO' }),
        });

        if (!response.ok) {
          throw new Error('Error al aprobar pago');
        }
      } else if (confirmAction === 'emitir') {
        const response = await fetch(`/api/admin/inscripciones/${selectedInscripcion.id}/emitir`, {
          method: 'POST',
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Error al emitir certificado');
        }
      } else if (confirmAction === 'cancelar') {
        const response = await fetch(`/api/admin/inscripciones/${selectedInscripcion.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: 'CANCELADO' }),
        });

        if (!response.ok) {
          throw new Error('Error al cancelar inscripción');
        }
      }

      // Refresh list
      fetchInscripciones();
      setConfirmDialogOpen(false);
      setDetailsDialogOpen(false);
    } catch (error: any) {
      alert(error.message || 'Error al procesar la acción');
    } finally {
      setProcessing(false);
    }
  }

  // Stats
  const stats = {
    pendientes: inscripciones.filter((i) => i.estado === 'PENDIENTE').length,
    pagados: inscripciones.filter((i) => i.estado === 'PAGADO').length,
    completados: inscripciones.filter((i) => i.estado === 'COMPLETADO').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Inscripciones</h1>
        <p className="text-gray-500">Administra las inscripciones, pagos y emisión de certificados</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-amber-700">{stats.pendientes}</p>
                <p className="text-sm text-amber-600">Pendientes de pago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{stats.pagados}</p>
                <p className="text-sm text-blue-600">Pagados (sin certificado)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{stats.completados}</p>
                <p className="text-sm text-green-600">Certificados emitidos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, DNI, email o curso..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} variant="secondary">
                Buscar
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={estadoFilter} onValueChange={(v) => { setEstadoFilter(v); setPage(1); }}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TODOS">Todos los estados</SelectItem>
                  <SelectItem value="PENDIENTE">Pendientes</SelectItem>
                  <SelectItem value="PAGADO">Pagados</SelectItem>
                  <SelectItem value="CURSANDO">Cursando</SelectItem>
                  <SelectItem value="COMPLETADO">Completados</SelectItem>
                  <SelectItem value="CANCELADO">Cancelados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            </div>
          ) : inscripciones.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron inscripciones</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participante</TableHead>
                  <TableHead>Curso</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inscripciones.map((inscripcion) => {
                  const estadoInfo = estadoConfig[inscripcion.estado] || estadoConfig.PENDIENTE;
                  const tipoInfo = tipoConfig[inscripcion.curso.tipo] || tipoConfig.CERTIFICADO;
                  const EstadoIcon = estadoInfo.icon;

                  return (
                    <TableRow key={inscripcion.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{inscripcion.participante.nombreCompleto}</p>
                          <p className="text-sm text-gray-500">{inscripcion.participante.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className={tipoInfo.color} variant="secondary">
                              {tipoInfo.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-900 max-w-xs truncate">{inscripcion.curso.nombre}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">S/ {inscripcion.monto.toFixed(2)}</span>
                      </TableCell>
                      <TableCell>
                        <Badge className={estadoInfo.color}>
                          <EstadoIcon className="h-3 w-3 mr-1" />
                          {estadoInfo.label}
                        </Badge>
                        {inscripcion.certificado && (
                          <Badge variant="outline" className="ml-2 text-green-600">
                            <Award className="h-3 w-3 mr-1" />
                            Certificado
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {new Date(inscripcion.fechaInscripcion).toLocaleDateString('es-PE')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetails(inscripcion)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {inscripcion.estado === 'PENDIENTE' && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => openConfirmDialog(inscripcion, 'aprobar')}
                            >
                              <CreditCard className="h-4 w-4 mr-1" />
                              Aprobar Pago
                            </Button>
                          )}

                          {(inscripcion.estado === 'PAGADO' || inscripcion.estado === 'CURSANDO') && !inscripcion.certificado && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => openConfirmDialog(inscripcion, 'emitir')}
                            >
                              <Award className="h-4 w-4 mr-1" />
                              Emitir Certificado
                            </Button>
                          )}

                          {inscripcion.certificado && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => router.push(`/admin/certificados/${inscripcion.certificado!.id}`)}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Ver Certificado
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between p-4 border-t">
              <p className="text-sm text-gray-500">
                Mostrando {(pagination.page - 1) * pagination.limit + 1} -{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-gray-600">
                  Página {pagination.page} de {pagination.pages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={page === pagination.pages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalles de Inscripción</DialogTitle>
          </DialogHeader>
          {selectedInscripcion && (
            <div className="space-y-6">
              {/* Participante */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Participante
                </h3>
                <p className="font-semibold text-gray-900">{selectedInscripcion.participante.nombreCompleto}</p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <p className="text-gray-600">
                    {selectedInscripcion.participante.tipoDocumento}: {selectedInscripcion.participante.numeroDocumento}
                  </p>
                  <p className="text-gray-600 flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {selectedInscripcion.participante.email}
                  </p>
                  {selectedInscripcion.participante.telefono && (
                    <p className="text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {selectedInscripcion.participante.telefono}
                    </p>
                  )}
                </div>
              </div>

              {/* Curso */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Curso
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={tipoConfig[selectedInscripcion.curso.tipo]?.color}>
                    {tipoConfig[selectedInscripcion.curso.tipo]?.label}
                  </Badge>
                  <Badge variant="outline">{selectedInscripcion.curso.horasAcademicas} horas</Badge>
                </div>
                <p className="font-semibold text-gray-900">{selectedInscripcion.curso.nombre}</p>
                <p className="text-sm text-gray-600 mt-1">Modalidad: {selectedInscripcion.curso.modalidad}</p>
              </div>

              {/* Estado y Pago */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Estado y Pago
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <Badge className={estadoConfig[selectedInscripcion.estado]?.color}>
                      {estadoConfig[selectedInscripcion.estado]?.label}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Monto</p>
                    <p className="font-bold text-lg text-gray-900">S/ {selectedInscripcion.monto.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecha de inscripción</p>
                    <p className="text-gray-900">
                      {new Date(selectedInscripcion.fechaInscripcion).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                  {selectedInscripcion.fechaPago && (
                    <div>
                      <p className="text-sm text-gray-500">Fecha de pago</p>
                      <p className="text-gray-900">
                        {new Date(selectedInscripcion.fechaPago).toLocaleDateString('es-PE')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Certificado */}
              {selectedInscripcion.certificado && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Certificado Emitido
                  </h3>
                  <p className="text-green-800">
                    Código: <span className="font-mono font-bold">{selectedInscripcion.certificado.codigoVerificacion}</span>
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                {selectedInscripcion.estado === 'PENDIENTE' && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => openConfirmDialog(selectedInscripcion, 'cancelar')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancelar Inscripción
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => openConfirmDialog(selectedInscripcion, 'aprobar')}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Aprobar Pago
                    </Button>
                  </>
                )}

                {(selectedInscripcion.estado === 'PAGADO' || selectedInscripcion.estado === 'CURSANDO') &&
                  !selectedInscripcion.certificado && (
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => openConfirmDialog(selectedInscripcion, 'emitir')}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Emitir Certificado
                    </Button>
                  )}

                {selectedInscripcion.certificado && (
                  <Button
                    onClick={() => router.push(`/admin/certificados/${selectedInscripcion.certificado!.id}`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Certificado
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'aprobar' && 'Aprobar Pago'}
              {confirmAction === 'emitir' && 'Emitir Certificado'}
              {confirmAction === 'cancelar' && 'Cancelar Inscripción'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'aprobar' &&
                '¿Confirmas que el pago ha sido verificado? El participante podrá acceder al curso.'}
              {confirmAction === 'emitir' &&
                '¿Deseas emitir el certificado? Se generará un código único de verificación.'}
              {confirmAction === 'cancelar' &&
                '¿Estás seguro de cancelar esta inscripción? Esta acción no se puede deshacer.'}
            </DialogDescription>
          </DialogHeader>

          {selectedInscripcion && (
            <div className="p-4 bg-gray-50 rounded-lg text-sm">
              <p><strong>Participante:</strong> {selectedInscripcion.participante.nombreCompleto}</p>
              <p><strong>Curso:</strong> {selectedInscripcion.curso.nombre}</p>
              <p><strong>Monto:</strong> S/ {selectedInscripcion.monto.toFixed(2)}</p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)} disabled={processing}>
              Cancelar
            </Button>
            <Button
              onClick={handleConfirmAction}
              disabled={processing}
              className={
                confirmAction === 'cancelar'
                  ? 'bg-red-600 hover:bg-red-700'
                  : confirmAction === 'emitir'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }
            >
              {processing ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : confirmAction === 'aprobar' ? (
                <CreditCard className="h-4 w-4 mr-2" />
              ) : confirmAction === 'emitir' ? (
                <Award className="h-4 w-4 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {confirmAction === 'aprobar' && 'Aprobar Pago'}
              {confirmAction === 'emitir' && 'Emitir Certificado'}
              {confirmAction === 'cancelar' && 'Cancelar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
