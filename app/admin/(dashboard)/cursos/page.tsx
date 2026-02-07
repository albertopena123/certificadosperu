'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  GraduationCap,
  Award,
  FileText,
  Loader2,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Curso {
  id: string;
  nombre: string;
  slug: string;
  tipo: string;
  modalidad: string;
  horasAcademicas: number;
  precio: number;
  activo: boolean;
  imagen?: string;
  categoria: { nombre: string };
  _count: { inscripciones: number; certificados: number };
}

const tipoConfig: Record<string, { icon: any; color: string; label: string }> = {
  DIPLOMADO: { icon: GraduationCap, color: 'bg-violet-100 text-violet-700', label: 'Diplomado' },
  CERTIFICADO: { icon: Award, color: 'bg-blue-100 text-blue-700', label: 'Certificado' },
  CONSTANCIA: { icon: FileText, color: 'bg-emerald-100 text-emerald-700', label: 'Constancia' },
};

const modalidadColors: Record<string, string> = {
  VIRTUAL: 'bg-cyan-100 text-cyan-700',
  PRESENCIAL: 'bg-orange-100 text-orange-700',
  SEMIPRESENCIAL: 'bg-purple-100 text-purple-700',
};

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');

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
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de eliminar este curso?')) return;

    try {
      const response = await fetch(`/api/admin/cursos/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchCursos();
      }
    } catch (error) {
      console.error('Error deleting curso:', error);
    }
  }

  const filteredCursos = cursos.filter((curso) => {
    const matchesSearch = curso.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'todos' || curso.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

  const counts = {
    total: cursos.length,
    diplomados: cursos.filter((c) => c.tipo === 'DIPLOMADO').length,
    certificados: cursos.filter((c) => c.tipo === 'CERTIFICADO').length,
    constancias: cursos.filter((c) => c.tipo === 'CONSTANCIA').length,
  };

  const CursosTable = ({ cursosList }: { cursosList: Curso[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Curso</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Modalidad</TableHead>
          <TableHead>Horas</TableHead>
          <TableHead>Precio</TableHead>
          <TableHead>Inscritos</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cursosList.length === 0 ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8 text-gray-500">
              No hay cursos para mostrar
            </TableCell>
          </TableRow>
        ) : (
          cursosList.map((curso) => {
            const tipoInfo = tipoConfig[curso.tipo] || tipoConfig.CERTIFICADO;
            const TipoIcon = tipoInfo.icon;

            return (
              <TableRow key={curso.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {curso.imagen ? (
                      <div className="relative w-16 h-10 rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={curso.imagen}
                          alt={curso.nombre}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className={`p-2 rounded-lg ${tipoInfo.color}`}>
                        <TipoIcon className="h-4 w-4" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1 max-w-xs">
                        {curso.nombre}
                      </p>
                      <p className="text-xs text-gray-500">{curso.categoria?.nombre}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={tipoInfo.color} variant="secondary">
                    {tipoInfo.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={modalidadColors[curso.modalidad]} variant="secondary">
                    {curso.modalidad.toLowerCase()}
                  </Badge>
                </TableCell>
                <TableCell>{curso.horasAcademicas}h</TableCell>
                <TableCell>S/ {curso.precio}</TableCell>
                <TableCell>{curso._count.inscripciones}</TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={
                      curso.activo
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }
                  >
                    {curso.activo ? 'activo' : 'inactivo'}
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
                        <Link href={`/admin/cursos/${curso.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/cursos/${curso.id}/editar`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(curso.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
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
  );

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Cursos</h1>
          <p className="text-gray-500">Administra diplomados, certificados y constancias</p>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700" asChild>
          <Link href="/admin/cursos/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Curso
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-100">
              <GraduationCap className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{counts.diplomados}</p>
              <p className="text-sm text-gray-500">Diplomados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-100">
              <Award className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{counts.certificados}</p>
              <p className="text-sm text-gray-500">Certificados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-emerald-100">
              <FileText className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{counts.constancias}</p>
              <p className="text-sm text-gray-500">Constancias</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle>Lista de Cursos</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar cursos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterTipo} onValueChange={setFilterTipo}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="DIPLOMADO">Diplomados</SelectItem>
                  <SelectItem value="CERTIFICADO">Certificados</SelectItem>
                  <SelectItem value="CONSTANCIA">Constancias</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="todos">Todos ({counts.total})</TabsTrigger>
              <TabsTrigger value="diplomados">Diplomados ({counts.diplomados})</TabsTrigger>
              <TabsTrigger value="certificados">Certificados ({counts.certificados})</TabsTrigger>
              <TabsTrigger value="constancias">Constancias ({counts.constancias})</TabsTrigger>
            </TabsList>

            <TabsContent value="todos">
              <CursosTable cursosList={filteredCursos} />
            </TabsContent>
            <TabsContent value="diplomados">
              <CursosTable cursosList={filteredCursos.filter((c) => c.tipo === 'DIPLOMADO')} />
            </TabsContent>
            <TabsContent value="certificados">
              <CursosTable cursosList={filteredCursos.filter((c) => c.tipo === 'CERTIFICADO')} />
            </TabsContent>
            <TabsContent value="constancias">
              <CursosTable cursosList={filteredCursos.filter((c) => c.tipo === 'CONSTANCIA')} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
