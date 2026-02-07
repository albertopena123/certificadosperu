'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Plus,
  Edit,
  Trash2,
  GraduationCap,
  Award,
  FileText,
  Star,
  Loader2,
  Eye,
  Copy,
  MoreVertical,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface Plantilla {
  id: string;
  nombre: string;
  descripcion?: string;
  tipo: string;
  orientacion: string;
  fondoUrl?: string;
  fondoColor?: string;
  activo: boolean;
  esDefault: boolean;
  createdAt: string;
  creador?: {
    id: string;
    nombre: string;
  };
}

const tipoConfig: Record<string, { icon: any; label: string; color: string; bgColor: string }> = {
  DIPLOMADO: { icon: GraduationCap, label: 'Diplomado', color: 'text-violet-700', bgColor: 'bg-violet-100' },
  CERTIFICADO: { icon: Award, label: 'Certificado', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  CONSTANCIA: { icon: FileText, label: 'Constancia', color: 'text-emerald-700', bgColor: 'bg-emerald-100' },
};

export default function PlantillasPage() {
  const [plantillas, setPlantillas] = useState<Plantilla[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchPlantillas();
  }, []);

  async function fetchPlantillas() {
    try {
      const response = await fetch('/api/admin/plantillas');
      if (response.ok) {
        const data = await response.json();
        setPlantillas(data);
      }
    } catch (error) {
      console.error('Error fetching plantillas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/admin/plantillas/${deleteId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPlantillas(plantillas.filter(p => p.id !== deleteId));
      }
    } catch (error) {
      console.error('Error deleting plantilla:', error);
    } finally {
      setDeleteId(null);
    }
  }

  async function handleSetDefault(id: string) {
    try {
      const plantilla = plantillas.find(p => p.id === id);
      if (!plantilla) return;

      const response = await fetch(`/api/admin/plantillas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...plantilla, esDefault: true }),
      });

      if (response.ok) {
        fetchPlantillas();
      }
    } catch (error) {
      console.error('Error setting default:', error);
    }
  }

  async function handleDuplicate(plantilla: Plantilla) {
    try {
      const response = await fetch('/api/admin/plantillas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...plantilla,
          id: undefined,
          nombre: `${plantilla.nombre} (copia)`,
          esDefault: false,
        }),
      });

      if (response.ok) {
        fetchPlantillas();
      }
    } catch (error) {
      console.error('Error duplicating plantilla:', error);
    }
  }

  const filteredPlantillas = plantillas.filter(p => {
    if (activeTab === 'all') return true;
    return p.tipo === activeTab;
  });

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plantillas de Certificados</h1>
          <p className="text-gray-500">Diseña y gestiona las plantillas para tus certificados</p>
        </div>
        <Button asChild className="bg-violet-600 hover:bg-violet-700">
          <Link href="/admin/plantillas/nueva">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Plantilla
          </Link>
        </Button>
      </div>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-violet-50 to-purple-50 border-violet-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Award className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold text-violet-900">Sistema de Plantillas Profesional</h3>
              <p className="text-sm text-violet-700 mt-1">
                Crea plantillas personalizadas para cada tipo de certificado.
                Sube fondos diseñados profesionalmente y configura la posición de cada elemento.
                La plantilla marcada como "Default" se usará automáticamente para ese tipo de certificado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">Todas ({plantillas.length})</TabsTrigger>
          <TabsTrigger value="DIPLOMADO">
            <GraduationCap className="h-4 w-4 mr-1" />
            Diplomados ({plantillas.filter(p => p.tipo === 'DIPLOMADO').length})
          </TabsTrigger>
          <TabsTrigger value="CERTIFICADO">
            <Award className="h-4 w-4 mr-1" />
            Certificados ({plantillas.filter(p => p.tipo === 'CERTIFICADO').length})
          </TabsTrigger>
          <TabsTrigger value="CONSTANCIA">
            <FileText className="h-4 w-4 mr-1" />
            Constancias ({plantillas.filter(p => p.tipo === 'CONSTANCIA').length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredPlantillas.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No hay plantillas</p>
                <p className="text-gray-400 mb-4">
                  Crea tu primera plantilla para empezar a generar certificados profesionales
                </p>
                <Button asChild>
                  <Link href="/admin/plantillas/nueva">
                    <Plus className="h-4 w-4 mr-2" />
                    Crear plantilla
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlantillas.map((plantilla) => {
                const tipoInfo = tipoConfig[plantilla.tipo] || tipoConfig.CERTIFICADO;
                const TipoIcon = tipoInfo.icon;

                return (
                  <Card key={plantilla.id} className="overflow-hidden group">
                    {/* Preview */}
                    <div className="relative aspect-[1.414] bg-gray-100 overflow-hidden">
                      {plantilla.fondoUrl ? (
                        <Image
                          src={plantilla.fondoUrl}
                          alt={plantilla.nombre}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{ backgroundColor: plantilla.fondoColor || '#f3f4f6' }}
                        >
                          <TipoIcon className={`h-16 w-16 ${tipoInfo.color} opacity-30`} />
                        </div>
                      )}

                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button size="sm" variant="secondary" asChild>
                          <Link href={`/admin/plantillas/${plantilla.id}`}>
                            <Eye className="h-4 w-4 mr-1" />
                            Ver
                          </Link>
                        </Button>
                        <Button size="sm" variant="secondary" asChild>
                          <Link href={`/admin/plantillas/${plantilla.id}/editar`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Link>
                        </Button>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                        <Badge className={`${tipoInfo.bgColor} ${tipoInfo.color}`}>
                          <TipoIcon className="h-3 w-3 mr-1" />
                          {tipoInfo.label}
                        </Badge>
                        {plantilla.esDefault && (
                          <Badge className="bg-amber-100 text-amber-700">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Default
                          </Badge>
                        )}
                      </div>

                      {!plantilla.activo && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-gray-200">
                            Inactiva
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{plantilla.nombre}</h3>
                          {plantilla.descripcion && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {plantilla.descripcion}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {plantilla.orientacion === 'HORIZONTAL' ? 'Horizontal' : 'Vertical'}
                          </p>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/plantillas/${plantilla.id}/editar`}>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(plantilla)}>
                              <Copy className="h-4 w-4 mr-2" />
                              Duplicar
                            </DropdownMenuItem>
                            {!plantilla.esDefault && (
                              <DropdownMenuItem onClick={() => handleSetDefault(plantilla.id)}>
                                <Star className="h-4 w-4 mr-2" />
                                Establecer como default
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteId(plantilla.id)}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar esta plantilla?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. La plantilla será eliminada permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
