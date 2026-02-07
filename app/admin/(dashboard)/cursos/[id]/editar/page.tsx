'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Save,
  GraduationCap,
  Award,
  FileText,
  Plus,
  Trash2,
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
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/ui/image-upload';

interface Categoria {
  id: string;
  nombre: string;
  slug: string;
}

const tipoConfig = {
  DIPLOMADO: { icon: GraduationCap, label: 'Diplomado', minHours: 120, color: 'bg-violet-100 text-violet-700' },
  CERTIFICADO: { icon: Award, label: 'Certificado', minHours: 40, color: 'bg-blue-100 text-blue-700' },
  CONSTANCIA: { icon: FileText, label: 'Constancia', minHours: 1, color: 'bg-emerald-100 text-emerald-700' },
};

export default function EditarCursoPage() {
  const params = useParams();
  const router = useRouter();

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [temarioItems, setTemarioItems] = useState<string[]>(['']);
  const [objetivosItems, setObjetivosItems] = useState<string[]>(['']);
  const [requisitosItems, setRequisitosItems] = useState<string[]>(['']);
  const [dirigidoAItems, setDirigidoAItems] = useState<string[]>(['']);

  const [formData, setFormData] = useState({
    nombre: '',
    slug: '',
    descripcion: '',
    descripcionCorta: '',
    tipo: 'CERTIFICADO',
    modalidad: 'VIRTUAL',
    horasAcademicas: 0,
    horasCronologicas: 0,
    creditos: 0,
    precio: 0,
    precioOriginal: 0,
    categoriaId: '',
    activo: true,
    destacado: false,
    imagen: '',
    fechaInicio: '',
    fechaFin: '',
    cupoMaximo: 0,
  });

  useEffect(() => {
    Promise.all([fetchCategorias(), fetchCurso()]);
  }, [params.id]);

  async function fetchCategorias() {
    try {
      const response = await fetch('/api/admin/categorias');
      if (response.ok) {
        const data = await response.json();
        setCategorias(data);
      }
    } catch (error) {
      console.error('Error fetching categorias:', error);
    }
  }

  async function fetchCurso() {
    try {
      const response = await fetch(`/api/admin/cursos/${params.id}`);
      if (response.ok) {
        const curso = await response.json();
        setFormData({
          nombre: curso.nombre || '',
          slug: curso.slug || '',
          descripcion: curso.descripcion || '',
          descripcionCorta: curso.descripcionCorta || '',
          tipo: curso.tipo || 'CERTIFICADO',
          modalidad: curso.modalidad || 'VIRTUAL',
          horasAcademicas: curso.horasAcademicas || 0,
          horasCronologicas: curso.horasCronologicas || 0,
          creditos: curso.creditos || 0,
          precio: curso.precio || 0,
          precioOriginal: curso.precioOriginal || 0,
          categoriaId: curso.categoriaId || curso.categoria?.id || '',
          activo: curso.activo ?? true,
          destacado: curso.destacado ?? false,
          imagen: curso.imagen || '',
          fechaInicio: curso.fechaInicio ? curso.fechaInicio.split('T')[0] : '',
          fechaFin: curso.fechaFin ? curso.fechaFin.split('T')[0] : '',
          cupoMaximo: curso.cupoMaximo || 0,
        });
        setTemarioItems(curso.temario?.length > 0 ? curso.temario : ['']);
        setObjetivosItems(curso.objetivos?.length > 0 ? curso.objetivos : ['']);
        setRequisitosItems(curso.requisitos?.length > 0 ? curso.requisitos : ['']);
        setDirigidoAItems(curso.dirigidoA?.length > 0 ? curso.dirigidoA : ['']);
      } else {
        router.push('/admin/cursos');
      }
    } catch (error) {
      console.error('Error fetching curso:', error);
      router.push('/admin/cursos');
    } finally {
      setLoading(false);
    }
  }

  function addItem(setter: React.Dispatch<React.SetStateAction<string[]>>, items: string[]) {
    setter([...items, '']);
  }

  function removeItem(setter: React.Dispatch<React.SetStateAction<string[]>>, items: string[], index: number) {
    setter(items.filter((_, i) => i !== index));
  }

  function updateItem(setter: React.Dispatch<React.SetStateAction<string[]>>, items: string[], index: number, value: string) {
    const newItems = [...items];
    newItems[index] = value;
    setter(newItems);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const temario = temarioItems.filter((item) => item.trim() !== '');
      const objetivos = objetivosItems.filter((item) => item.trim() !== '');
      const requisitos = requisitosItems.filter((item) => item.trim() !== '');
      const dirigidoA = dirigidoAItems.filter((item) => item.trim() !== '');

      const response = await fetch(`/api/admin/cursos/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          temario,
          objetivos,
          requisitos,
          dirigidoA,
          horasAcademicas: parseInt(formData.horasAcademicas.toString()),
          horasCronologicas: formData.horasCronologicas ? parseInt(formData.horasCronologicas.toString()) : null,
          creditos: formData.creditos ? parseFloat(formData.creditos.toString()) : null,
          precio: parseFloat(formData.precio.toString()),
          precioOriginal: formData.precioOriginal ? parseFloat(formData.precioOriginal.toString()) : null,
          cupoMaximo: formData.cupoMaximo ? parseInt(formData.cupoMaximo.toString()) : null,
          fechaInicio: formData.fechaInicio || null,
          fechaFin: formData.fechaFin || null,
        }),
      });

      if (response.ok) {
        router.push(`/admin/cursos/${params.id}`);
      } else {
        const error = await response.json();
        alert(error.error || 'Error al actualizar el curso');
      }
    } catch (error) {
      console.error('Error updating curso:', error);
      alert('Error al actualizar el curso');
    } finally {
      setSaving(false);
    }
  }

  const tipoInfo = tipoConfig[formData.tipo as keyof typeof tipoConfig];
  const TipoIcon = tipoInfo?.icon || Award;

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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href={`/admin/cursos/${params.id}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Curso</h1>
          <p className="text-gray-500">Modifica los detalles del curso</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información Básica</CardTitle>
                <CardDescription>Datos principales del curso</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Curso *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
                    }
                    placeholder="Ej: Diplomado en Gestión Pública"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="slug">Slug (URL amigable)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    placeholder="diplomado-gestion-publica"
                  />
                </div>

                <div>
                  <Label htmlFor="descripcionCorta">Descripción Corta</Label>
                  <Input
                    id="descripcionCorta"
                    value={formData.descripcionCorta}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcionCorta: e.target.value })
                    }
                    placeholder="Una línea describiendo el curso"
                    maxLength={150}
                  />
                </div>

                <div>
                  <Label htmlFor="descripcion">Descripción Completa</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    placeholder="Describe el curso, objetivos y público objetivo..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo">Tipo de Curso *</Label>
                    <Select
                      value={formData.tipo}
                      onValueChange={(value) =>
                        setFormData({ ...formData, tipo: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DIPLOMADO">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="h-4 w-4" />
                            Diplomado (120+ horas)
                          </div>
                        </SelectItem>
                        <SelectItem value="CERTIFICADO">
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4" />
                            Certificado (40-120 horas)
                          </div>
                        </SelectItem>
                        <SelectItem value="CONSTANCIA">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Constancia (&lt;40 horas)
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="modalidad">Modalidad *</Label>
                    <Select
                      value={formData.modalidad}
                      onValueChange={(value) =>
                        setFormData({ ...formData, modalidad: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar modalidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIRTUAL">Virtual</SelectItem>
                        <SelectItem value="PRESENCIAL">Presencial</SelectItem>
                        <SelectItem value="SEMIPRESENCIAL">Semipresencial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="categoriaId">Categoría *</Label>
                    <Select
                      value={formData.categoriaId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, categoriaId: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria.id} value={categoria.id}>
                            {categoria.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Precios */}
            <Card>
              <CardHeader>
                <CardTitle>Precios</CardTitle>
                <CardDescription>Configuración de precios del curso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="precio">Precio (S/) *</Label>
                    <Input
                      id="precio"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) =>
                        setFormData({ ...formData, precio: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="precioOriginal">Precio Original (S/)</Label>
                    <Input
                      id="precioOriginal"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.precioOriginal}
                      onChange={(e) =>
                        setFormData({ ...formData, precioOriginal: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0.00"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Déjalo mayor al precio para mostrar descuento
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Horas y Créditos */}
            <Card>
              <CardHeader>
                <CardTitle>Horas y Créditos</CardTitle>
                <CardDescription>
                  Información académica requerida para concursos públicos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="horasAcademicas">Horas Académicas *</Label>
                    <Input
                      id="horasAcademicas"
                      type="number"
                      min={tipoInfo?.minHours || 1}
                      value={formData.horasAcademicas}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          horasAcademicas: parseInt(e.target.value) || 0,
                        })
                      }
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Mínimo {tipoInfo?.minHours || 1} horas para {tipoInfo?.label || 'este tipo'}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="horasCronologicas">Horas Cronológicas</Label>
                    <Input
                      id="horasCronologicas"
                      type="number"
                      min="0"
                      value={formData.horasCronologicas}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          horasCronologicas: parseInt(e.target.value) || 0,
                        })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="creditos">Créditos</Label>
                    <Input
                      id="creditos"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.creditos}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          creditos: parseFloat(e.target.value) || 0,
                        })
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fechas */}
            <Card>
              <CardHeader>
                <CardTitle>Fechas y Cupo</CardTitle>
                <CardDescription>Configuración de fechas y límite de inscripciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
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
                    <Label htmlFor="cupoMaximo">Cupo Máximo</Label>
                    <Input
                      id="cupoMaximo"
                      type="number"
                      min="0"
                      value={formData.cupoMaximo}
                      onChange={(e) =>
                        setFormData({ ...formData, cupoMaximo: parseInt(e.target.value) || 0 })
                      }
                      placeholder="Sin límite"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Temario */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Temario del Curso</CardTitle>
                    <CardDescription>
                      Lista de temas que se incluirán en el certificado
                    </CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem(setTemarioItems, temarioItems)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar tema
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {temarioItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                      <Input
                        value={item}
                        onChange={(e) => updateItem(setTemarioItems, temarioItems, index, e.target.value)}
                        placeholder={`Módulo ${index + 1}: Título del tema`}
                      />
                      {temarioItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(setTemarioItems, temarioItems, index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Objetivos */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Objetivos</CardTitle>
                    <CardDescription>
                      Lo que el estudiante logrará al completar el curso
                    </CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem(setObjetivosItems, objetivosItems)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar objetivo
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {objetivosItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateItem(setObjetivosItems, objetivosItems, index, e.target.value)}
                        placeholder="Ej: Dominar las técnicas de gestión pública"
                      />
                      {objetivosItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(setObjetivosItems, objetivosItems, index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requisitos */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Requisitos</CardTitle>
                    <CardDescription>
                      Lo que el estudiante necesita para tomar el curso
                    </CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem(setRequisitosItems, requisitosItems)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar requisito
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {requisitosItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateItem(setRequisitosItems, requisitosItems, index, e.target.value)}
                        placeholder="Ej: Conocimientos básicos de computación"
                      />
                      {requisitosItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(setRequisitosItems, requisitosItems, index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dirigido a */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Dirigido a</CardTitle>
                    <CardDescription>
                      Público objetivo del curso
                    </CardDescription>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={() => addItem(setDirigidoAItems, dirigidoAItems)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar público
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dirigidoAItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={item}
                        onChange={(e) => updateItem(setDirigidoAItems, dirigidoAItems, index, e.target.value)}
                        placeholder="Ej: Profesionales del sector público"
                      />
                      {dirigidoAItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(setDirigidoAItems, dirigidoAItems, index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Imagen del curso */}
            <Card>
              <CardHeader>
                <CardTitle>Imagen del Curso</CardTitle>
                <CardDescription>
                  Imagen principal que se mostrará en la lista
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUpload
                  value={formData.imagen}
                  onChange={(url) => setFormData({ ...formData, imagen: url })}
                  folder="cursos"
                />
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Vista Previa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                  <Badge className={tipoInfo?.color || 'bg-gray-100'} variant="secondary">
                    <TipoIcon className="h-3 w-3 mr-1" />
                    {tipoInfo?.label || formData.tipo}
                  </Badge>
                  <p className="font-semibold text-gray-900">
                    {formData.nombre || 'Nombre del curso'}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="px-2 py-1 bg-white rounded">
                      {formData.horasAcademicas || 0} horas
                    </span>
                    {formData.creditos > 0 && (
                      <span className="px-2 py-1 bg-white rounded">
                        {formData.creditos} créditos
                      </span>
                    )}
                    <span className="px-2 py-1 bg-white rounded capitalize">
                      {formData.modalidad.toLowerCase()}
                    </span>
                  </div>
                  {formData.precio > 0 && (
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-violet-600">
                        S/ {formData.precio.toFixed(2)}
                      </p>
                      {formData.precioOriginal > formData.precio && (
                        <p className="text-sm text-gray-400 line-through">
                          S/ {formData.precioOriginal.toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Estado */}
            <Card>
              <CardHeader>
                <CardTitle>Estado del Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Curso Activo</p>
                    <p className="text-sm text-gray-500">
                      El curso será visible para inscripciones
                    </p>
                  </div>
                  <Switch
                    checked={formData.activo}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, activo: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Curso Destacado</p>
                    <p className="text-sm text-gray-500">
                      Aparecerá en la página principal
                    </p>
                  </div>
                  <Switch
                    checked={formData.destacado}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, destacado: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex flex-col gap-2">
              <Button
                type="submit"
                className="w-full bg-violet-600 hover:bg-violet-700"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Cambios
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/admin/cursos/${params.id}`}>Cancelar</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
