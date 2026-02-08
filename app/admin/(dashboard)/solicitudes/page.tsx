'use client';

import { useEffect, useState } from 'react';
import {
  Search,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  User,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  Filter,
  BookOpen,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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

interface Solicitud {
  id: string;
  cursoSolicitado: string;
  descripcion?: string;
  nombre?: string;
  email?: string;
  telefono?: string;
  estado: string;
  notas?: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

const estadoConfig: Record<string, { label: string; color: string; icon: any }> = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-amber-100 text-amber-700', icon: Clock },
  REVISADO: { label: 'Revisado', color: 'bg-blue-100 text-blue-700', icon: Eye },
  CREADO: { label: 'Curso Creado', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  RECHAZADO: { label: 'Rechazado', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export default function SolicitudesAdminPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('TODOS');
  const [page, setPage] = useState(1);

  // Dialog states
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'revisar' | 'crear' | 'rechazar' | 'eliminar' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [notas, setNotas] = useState('');

  useEffect(() => {
    fetchSolicitudes();
  }, [estadoFilter, page]);

  async function fetchSolicitudes() {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
      });

      if (estadoFilter !== 'TODOS') {
        params.append('estado', estadoFilter);
      }

      const response = await fetch(`/api/solicitudes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setSolicitudes(data.solicitudes);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching solicitudes:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    setPage(1);
    fetchSolicitudes();
  }

  function openDetails(solicitud: Solicitud) {
    setSelectedSolicitud(solicitud);
    setNotas(solicitud.notas || '');
    setDetailsDialogOpen(true);
  }

  function openConfirmDialog(solicitud: Solicitud, action: 'revisar' | 'crear' | 'rechazar' | 'eliminar') {
    setSelectedSolicitud(solicitud);
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  }

  async function handleConfirmAction() {
    if (!selectedSolicitud || !confirmAction) return;

    setProcessing(true);
    try {
      if (confirmAction === 'eliminar') {
        const response = await fetch(`/api/admin/solicitudes/${selectedSolicitud.id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Error al eliminar solicitud');
        }
      } else {
        const nuevoEstado = confirmAction === 'revisar' ? 'REVISADO' :
                           confirmAction === 'crear' ? 'CREADO' : 'RECHAZADO';

        const response = await fetch(`/api/admin/solicitudes/${selectedSolicitud.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ estado: nuevoEstado, notas }),
        });

        if (!response.ok) {
          throw new Error('Error al actualizar solicitud');
        }
      }

      fetchSolicitudes();
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
    pendientes: solicitudes.filter((s) => s.estado === 'PENDIENTE').length,
    revisados: solicitudes.filter((s) => s.estado === 'REVISADO').length,
    creados: solicitudes.filter((s) => s.estado === 'CREADO').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Solicitudes de Cursos</h1>
        <p className="text-gray-500">Gestiona las solicitudes de cursos enviadas por los usuarios</p>
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
                <p className="text-sm text-amber-600">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{stats.revisados}</p>
                <p className="text-sm text-blue-600">Revisados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{stats.creados}</p>
                <p className="text-sm text-green-600">Cursos Creados</p>
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
                  placeholder="Buscar por curso, nombre o email..."
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
                  <SelectItem value="REVISADO">Revisados</SelectItem>
                  <SelectItem value="CREADO">Cursos Creados</SelectItem>
                  <SelectItem value="RECHAZADO">Rechazados</SelectItem>
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
          ) : solicitudes.length === 0 ? (
            <div className="text-center py-16">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron solicitudes</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso Solicitado</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {solicitudes.map((solicitud) => {
                  const estadoInfo = estadoConfig[solicitud.estado] || estadoConfig.PENDIENTE;
                  const EstadoIcon = estadoInfo.icon;

                  return (
                    <TableRow key={solicitud.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{solicitud.cursoSolicitado}</p>
                          {solicitud.descripcion && (
                            <p className="text-sm text-gray-500 line-clamp-1">{solicitud.descripcion}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {solicitud.nombre && <p className="font-medium">{solicitud.nombre}</p>}
                          {solicitud.email && (
                            <p className="text-gray-500 flex items-center gap-1">
                              <Mail className="h-3 w-3" /> {solicitud.email}
                            </p>
                          )}
                          {solicitud.telefono && (
                            <p className="text-gray-500 flex items-center gap-1">
                              <Phone className="h-3 w-3" /> {solicitud.telefono}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={estadoInfo.color}>
                          <EstadoIcon className="h-3 w-3 mr-1" />
                          {estadoInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-500">
                          {new Date(solicitud.createdAt).toLocaleDateString('es-PE')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetails(solicitud)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {solicitud.estado === 'PENDIENTE' && (
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => openConfirmDialog(solicitud, 'revisar')}
                            >
                              Revisar
                            </Button>
                          )}

                          {solicitud.estado === 'REVISADO' && (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => openConfirmDialog(solicitud, 'crear')}
                            >
                              <BookOpen className="h-4 w-4 mr-1" />
                              Marcar Creado
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
            <DialogTitle>Detalle de Solicitud</DialogTitle>
          </DialogHeader>
          {selectedSolicitud && (
            <div className="space-y-6">
              {/* Curso Solicitado */}
              <div className="p-4 bg-violet-50 rounded-lg">
                <h3 className="text-sm font-medium text-violet-700 mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Curso Solicitado
                </h3>
                <p className="font-semibold text-gray-900 text-lg">{selectedSolicitud.cursoSolicitado}</p>
                {selectedSolicitud.descripcion && (
                  <p className="text-gray-600 mt-2">{selectedSolicitud.descripcion}</p>
                )}
              </div>

              {/* Contacto */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Información de Contacto
                </h3>
                <div className="space-y-2">
                  {selectedSolicitud.nombre && (
                    <p className="font-medium text-gray-900">{selectedSolicitud.nombre}</p>
                  )}
                  {selectedSolicitud.email && (
                    <p className="text-gray-600 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <a href={`mailto:${selectedSolicitud.email}`} className="text-blue-600 hover:underline">
                        {selectedSolicitud.email}
                      </a>
                    </p>
                  )}
                  {selectedSolicitud.telefono && (
                    <p className="text-gray-600 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href={`https://wa.me/${selectedSolicitud.telefono.replace(/\D/g, '')}`}
                         target="_blank"
                         className="text-green-600 hover:underline">
                        {selectedSolicitud.telefono}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* Estado */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Estado actual</p>
                    <Badge className={estadoConfig[selectedSolicitud.estado]?.color}>
                      {estadoConfig[selectedSolicitud.estado]?.label}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Fecha de solicitud</p>
                    <p className="text-gray-900">
                      {new Date(selectedSolicitud.createdAt).toLocaleDateString('es-PE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Notas internas
                </label>
                <Textarea
                  placeholder="Agregar notas sobre esta solicitud..."
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-between gap-2 pt-4 border-t">
                <Button
                  variant="destructive"
                  onClick={() => openConfirmDialog(selectedSolicitud, 'eliminar')}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </Button>

                <div className="flex gap-2">
                  {selectedSolicitud.estado === 'PENDIENTE' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => openConfirmDialog(selectedSolicitud, 'rechazar')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => openConfirmDialog(selectedSolicitud, 'revisar')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Marcar Revisado
                      </Button>
                    </>
                  )}

                  {selectedSolicitud.estado === 'REVISADO' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => openConfirmDialog(selectedSolicitud, 'rechazar')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => openConfirmDialog(selectedSolicitud, 'crear')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar Curso Creado
                      </Button>
                    </>
                  )}
                </div>
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
              {confirmAction === 'revisar' && 'Marcar como Revisado'}
              {confirmAction === 'crear' && 'Marcar Curso Creado'}
              {confirmAction === 'rechazar' && 'Rechazar Solicitud'}
              {confirmAction === 'eliminar' && 'Eliminar Solicitud'}
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'revisar' &&
                '¿Confirmas que has revisado esta solicitud?'}
              {confirmAction === 'crear' &&
                '¿El curso ya fue creado en la plataforma?'}
              {confirmAction === 'rechazar' &&
                '¿Estás seguro de rechazar esta solicitud?'}
              {confirmAction === 'eliminar' &&
                '¿Estás seguro de eliminar esta solicitud? Esta acción no se puede deshacer.'}
            </DialogDescription>
          </DialogHeader>

          {selectedSolicitud && (
            <div className="p-4 bg-gray-50 rounded-lg text-sm">
              <p><strong>Curso:</strong> {selectedSolicitud.cursoSolicitado}</p>
              {selectedSolicitud.nombre && <p><strong>Nombre:</strong> {selectedSolicitud.nombre}</p>}
              {selectedSolicitud.email && <p><strong>Email:</strong> {selectedSolicitud.email}</p>}
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
                confirmAction === 'rechazar' || confirmAction === 'eliminar'
                  ? 'bg-red-600 hover:bg-red-700'
                  : confirmAction === 'crear'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              }
            >
              {processing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {confirmAction === 'revisar' && 'Marcar Revisado'}
              {confirmAction === 'crear' && 'Marcar Creado'}
              {confirmAction === 'rechazar' && 'Rechazar'}
              {confirmAction === 'eliminar' && 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
