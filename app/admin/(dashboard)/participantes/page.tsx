'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Users,
  Award,
  FileText,
  Loader2,
  Mail,
  Phone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Participante {
  id: string;
  nombreCompleto: string;
  tipoDocumento: string;
  numeroDocumento: string;
  email: string;
  telefono?: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
  ocupacion?: string;
  centroTrabajo?: string;
  createdAt: string;
  _count: { inscripciones: number; certificados: number };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const tipoDocumentoLabels: Record<string, string> = {
  DNI: 'DNI',
  CE: 'Carné de Extranjería',
  PASAPORTE: 'Pasaporte',
  RUC: 'RUC',
};

export default function ParticipantesPage() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    email: '',
    telefono: '',
    departamento: '',
    provincia: '',
    distrito: '',
    ocupacion: '',
    centroTrabajo: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchParticipantes();
  }, [currentPage, searchTerm]);

  async function fetchParticipantes() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/participantes?${params}`);
      if (response.ok) {
        const data = await response.json();
        setParticipantes(data.participantes);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching participantes:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/participantes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setDialogOpen(false);
        setFormData({
          nombreCompleto: '',
          tipoDocumento: 'DNI',
          numeroDocumento: '',
          email: '',
          telefono: '',
          departamento: '',
          provincia: '',
          distrito: '',
          ocupacion: '',
          centroTrabajo: '',
        });
        fetchParticipantes();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al crear participante');
      }
    } catch (error) {
      console.error('Error creating participante:', error);
      alert('Error al crear participante');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este participante?')) return;

    try {
      const response = await fetch(`/api/admin/participantes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchParticipantes();
      }
    } catch (error) {
      console.error('Error deleting participante:', error);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  if (loading && participantes.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Participantes</h1>
          <p className="text-gray-500">Gestiona los participantes registrados</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-violet-600 hover:bg-violet-700">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Participante
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Participante</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="nombreCompleto">Nombre Completo *</Label>
                  <Input
                    id="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={(e) =>
                      setFormData({ ...formData, nombreCompleto: e.target.value })
                    }
                    placeholder="Ingrese el nombre completo"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tipoDocumento">Tipo de Documento *</Label>
                  <Select
                    value={formData.tipoDocumento}
                    onValueChange={(value) =>
                      setFormData({ ...formData, tipoDocumento: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="CE">Carné de Extranjería</SelectItem>
                      <SelectItem value="PASAPORTE">Pasaporte</SelectItem>
                      <SelectItem value="RUC">RUC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="numeroDocumento">Número de Documento *</Label>
                  <Input
                    id="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={(e) =>
                      setFormData({ ...formData, numeroDocumento: e.target.value })
                    }
                    placeholder="Ingrese el número de documento"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Correo Electrónico *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
                    }
                    placeholder="999 999 999"
                  />
                </div>

                <div>
                  <Label htmlFor="departamento">Departamento</Label>
                  <Input
                    id="departamento"
                    value={formData.departamento}
                    onChange={(e) =>
                      setFormData({ ...formData, departamento: e.target.value })
                    }
                    placeholder="Lima"
                  />
                </div>

                <div>
                  <Label htmlFor="provincia">Provincia</Label>
                  <Input
                    id="provincia"
                    value={formData.provincia}
                    onChange={(e) =>
                      setFormData({ ...formData, provincia: e.target.value })
                    }
                    placeholder="Lima"
                  />
                </div>

                <div>
                  <Label htmlFor="distrito">Distrito</Label>
                  <Input
                    id="distrito"
                    value={formData.distrito}
                    onChange={(e) =>
                      setFormData({ ...formData, distrito: e.target.value })
                    }
                    placeholder="Miraflores"
                  />
                </div>

                <div>
                  <Label htmlFor="ocupacion">Ocupación</Label>
                  <Input
                    id="ocupacion"
                    value={formData.ocupacion}
                    onChange={(e) =>
                      setFormData({ ...formData, ocupacion: e.target.value })
                    }
                    placeholder="Profesional, Estudiante, etc."
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="centroTrabajo">Centro de Trabajo</Label>
                  <Input
                    id="centroTrabajo"
                    value={formData.centroTrabajo}
                    onChange={(e) =>
                      setFormData({ ...formData, centroTrabajo: e.target.value })
                    }
                    placeholder="Nombre de la empresa o institución"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-violet-600 hover:bg-violet-700"
                  disabled={saving}
                >
                  {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Guardar Participante
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-100">
              <Users className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {pagination?.total || 0}
              </p>
              <p className="text-sm text-gray-500">Total Participantes</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {participantes.reduce((acc, p) => acc + p._count.inscripciones, 0)}
              </p>
              <p className="text-sm text-gray-500">Inscripciones</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100">
              <Award className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {participantes.reduce((acc, p) => acc + p._count.certificados, 0)}
              </p>
              <p className="text-sm text-gray-500">Certificados Emitidos</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Lista de Participantes</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, DNI o email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 w-80"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Participante</TableHead>
                <TableHead>Documento</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Inscripciones</TableHead>
                <TableHead>Certificados</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participantes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No hay participantes para mostrar
                  </TableCell>
                </TableRow>
              ) : (
                participantes.map((participante) => (
                  <TableRow key={participante.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-violet-600">
                            {participante.nombreCompleto
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {participante.nombreCompleto}
                          </p>
                          <p className="text-xs text-gray-500">
                            Registrado: {formatDate(participante.createdAt)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="secondary" className="mb-1">
                          {tipoDocumentoLabels[participante.tipoDocumento] ||
                            participante.tipoDocumento}
                        </Badge>
                        <p className="text-sm text-gray-900">
                          {participante.numeroDocumento}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">
                            {participante.email}
                          </span>
                        </div>
                        {participante.telefono && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Phone className="h-3 w-3" />
                            {participante.telefono}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {participante.departamento || participante.distrito ? (
                        <p className="text-sm text-gray-600">
                          {[
                            participante.distrito,
                            participante.provincia,
                            participante.departamento,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        {participante._count.inscripciones}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-emerald-100 text-emerald-700"
                      >
                        {participante._count.certificados}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Award className="mr-2 h-4 w-4" />
                            Emitir certificado
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDelete(participante.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-gray-500">
                Mostrando {(pagination.page - 1) * pagination.limit + 1} a{' '}
                {Math.min(pagination.page * pagination.limit, pagination.total)} de{' '}
                {pagination.total} resultados
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === pagination.pages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
