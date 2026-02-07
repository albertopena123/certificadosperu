'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  MoreHorizontal,
  Eye,
  Download,
  Trash2,
  Award,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Certificado {
  id: string;
  codigoVerificacion: string;
  nombreCurso: string;
  tipoCurso: string;
  modalidad: string;
  horasAcademicas: number;
  fechaEmision: string;
  fechaInicio: string;
  fechaFin: string;
  estado: string;
  participante: {
    id: string;
    nombreCompleto: string;
    numeroDocumento: string;
    tipoDocumento: string;
  };
  curso: {
    id: string;
    nombre: string;
  };
  emitidoPor?: {
    id: string;
    nombre: string;
  };
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const estadoConfig: Record<string, { icon: any; color: string; label: string }> = {
  EMITIDO: { icon: CheckCircle, color: 'bg-green-100 text-green-700', label: 'Emitido' },
  ANULADO: { icon: XCircle, color: 'bg-red-100 text-red-700', label: 'Anulado' },
  PENDIENTE: { icon: Clock, color: 'bg-yellow-100 text-yellow-700', label: 'Pendiente' },
};

const tipoConfig: Record<string, { color: string; label: string }> = {
  DIPLOMADO: { color: 'bg-violet-100 text-violet-700', label: 'Diplomado' },
  CERTIFICADO: { color: 'bg-blue-100 text-blue-700', label: 'Certificado' },
  CONSTANCIA: { color: 'bg-emerald-100 text-emerald-700', label: 'Constancia' },
};

export default function CertificadosPage() {
  const [certificados, setCertificados] = useState<Certificado[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCertificados();
  }, [currentPage, searchTerm, filterTipo, filterEstado]);

  async function fetchCertificados() {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });
      if (searchTerm) params.append('search', searchTerm);
      if (filterTipo !== 'todos') params.append('tipo', filterTipo);
      if (filterEstado !== 'todos') params.append('estado', filterEstado);

      const response = await fetch(`/api/admin/certificados?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCertificados(data.certificados);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching certificados:', error);
    } finally {
      setLoading(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  if (loading && certificados.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  const stats = {
    total: pagination?.total || 0,
    emitidos: certificados.filter((c) => c.estado === 'EMITIDO').length,
    anulados: certificados.filter((c) => c.estado === 'ANULADO').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Certificados Emitidos</h1>
          <p className="text-gray-500">Gestiona los certificados emitidos a participantes</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700" asChild>
          <Link href="/admin/certificados/emitir">
            <Award className="h-4 w-4 mr-2" />
            Emitir Certificado
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-100">
              <Award className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Certificados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.emitidos}</p>
              <p className="text-sm text-gray-500">Emitidos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-red-100">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.anulados}</p>
              <p className="text-sm text-gray-500">Anulados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Lista de Certificados</CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por código, nombre o DNI..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterTipo} onValueChange={(v) => { setFilterTipo(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los tipos</SelectItem>
                  <SelectItem value="diplomado">Diplomados</SelectItem>
                  <SelectItem value="certificado">Certificados</SelectItem>
                  <SelectItem value="constancia">Constancias</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterEstado} onValueChange={(v) => { setFilterEstado(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="emitido">Emitidos</SelectItem>
                  <SelectItem value="anulado">Anulados</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Participante</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha Emisión</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No hay certificados para mostrar
                  </TableCell>
                </TableRow>
              ) : (
                certificados.map((certificado) => {
                  const tipoInfo = tipoConfig[certificado.tipoCurso] || tipoConfig.CERTIFICADO;
                  const estadoInfo = estadoConfig[certificado.estado] || estadoConfig.EMITIDO;
                  const EstadoIcon = estadoInfo.icon;

                  return (
                    <TableRow key={certificado.id}>
                      <TableCell>
                        <code className="px-2 py-1 bg-gray-100 rounded text-sm font-mono">
                          {certificado.codigoVerificacion}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">
                            {certificado.participante.nombreCompleto}
                          </p>
                          <p className="text-xs text-gray-500">
                            {certificado.participante.tipoDocumento}: {certificado.participante.numeroDocumento}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-gray-900 line-clamp-1 max-w-xs">
                          {certificado.nombreCurso}
                        </p>
                        <p className="text-xs text-gray-500">{certificado.horasAcademicas} horas</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={tipoInfo.color} variant="secondary">
                          {tipoInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(certificado.fechaEmision)}</TableCell>
                      <TableCell>
                        <Badge className={estadoInfo.color} variant="secondary">
                          <EstadoIcon className="h-3 w-3 mr-1" />
                          {estadoInfo.label}
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
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/certificados/${certificado.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                Ver detalles
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Descargar PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Anular
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
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
