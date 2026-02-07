'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Loader2,
  Save,
  GraduationCap,
  Award,
  FileText,
  Upload,
  Eye,
  Settings,
  Palette,
  Layout,
  Type,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ui/image-upload';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

const defaultConfig = {
  fonts: {
    title: { family: 'serif', size: 48, weight: 'bold', color: '#1a1a1a' },
    subtitle: { family: 'serif', size: 24, color: '#4a4a4a' },
    name: { family: 'serif', size: 36, weight: 'bold', color: '#1a1a1a' },
    course: { family: 'sans-serif', size: 20, weight: 'bold', color: '#333333' },
    body: { family: 'sans-serif', size: 12, color: '#555555' },
  },
  elements: {
    logo: { enabled: true, x: 5, y: 3, width: 15 },
    title: { enabled: true, x: 50, y: 18, align: 'center' },
    subtitle: { enabled: true, x: 50, y: 25, align: 'center', text: 'Otorgado por CertificadosPerú' },
    participantName: { enabled: true, x: 50, y: 42, align: 'center' },
    participantDocument: { enabled: true, x: 50, y: 48, align: 'center' },
    courseName: { enabled: true, x: 50, y: 62, align: 'center' },
    courseDetails: { enabled: true, x: 50, y: 70, align: 'center' },
    syllabus: { enabled: false, x: 10, y: 75, maxItems: 6 },
    qrCode: { enabled: true, x: 8, y: 82, width: 12 },
    verificationCode: { enabled: true, x: 8, y: 95, align: 'center' },
    signature1: { enabled: true, x: 75, y: 85, label: 'Director Académico', name: 'CertificadosPerú' },
    dates: { enabled: true, x: 50, y: 78, align: 'center' },
  },
  decorations: {
    border: { enabled: true, color: '#d4af37', width: 3, margin: 15 },
    innerBorder: { enabled: true, color: '#d4af37', width: 1, margin: 25 },
  },
};

export default function NuevaPlantillaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo: 'CERTIFICADO',
    orientacion: 'HORIZONTAL',
    fondoUrl: '',
    fondoColor: '#ffffff',
    activo: true,
    esDefault: false,
  });

  const [config, setConfig] = useState(defaultConfig);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/admin/plantillas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          config,
        }),
      });

      if (response.ok) {
        router.push('/admin/plantillas');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al crear plantilla');
      }
    } catch (error) {
      console.error('Error creating plantilla:', error);
      alert('Error al crear plantilla');
    } finally {
      setSaving(false);
    }
  }

  function updateConfig(path: string[], value: any) {
    setConfig(prev => {
      const newConfig = { ...prev };
      let current: any = newConfig;
      for (let i = 0; i < path.length - 1; i++) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newConfig;
    });
  }

  const tipoLabels: Record<string, string> = {
    DIPLOMADO: 'DIPLOMADO',
    CERTIFICADO: 'CERTIFICADO',
    CONSTANCIA: 'CONSTANCIA',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/plantillas">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva Plantilla</h1>
          <p className="text-gray-500">Diseña una plantilla profesional para tus certificados</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="general">
                  <Settings className="h-4 w-4 mr-2" />
                  General
                </TabsTrigger>
                <TabsTrigger value="diseno">
                  <Palette className="h-4 w-4 mr-2" />
                  Diseño
                </TabsTrigger>
                <TabsTrigger value="elementos">
                  <Layout className="h-4 w-4 mr-2" />
                  Elementos
                </TabsTrigger>
                <TabsTrigger value="textos">
                  <Type className="h-4 w-4 mr-2" />
                  Textos
                </TabsTrigger>
              </TabsList>

              {/* General Tab */}
              <TabsContent value="general" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Básica</CardTitle>
                    <CardDescription>Configura los datos principales de la plantilla</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="nombre">Nombre de la plantilla *</Label>
                      <Input
                        id="nombre"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        placeholder="Ej: Diplomado Elegante Dorado"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="descripcion">Descripción</Label>
                      <Textarea
                        id="descripcion"
                        value={formData.descripcion}
                        onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                        placeholder="Describe el estilo y uso de esta plantilla"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tipo">Tipo de certificado *</Label>
                        <Select
                          value={formData.tipo}
                          onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="DIPLOMADO">
                              <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4" />
                                Diplomado
                              </div>
                            </SelectItem>
                            <SelectItem value="CERTIFICADO">
                              <div className="flex items-center gap-2">
                                <Award className="h-4 w-4" />
                                Certificado
                              </div>
                            </SelectItem>
                            <SelectItem value="CONSTANCIA">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Constancia
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="orientacion">Orientación</Label>
                        <Select
                          value={formData.orientacion}
                          onValueChange={(value) => setFormData({ ...formData, orientacion: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HORIZONTAL">Horizontal (paisaje)</SelectItem>
                            <SelectItem value="VERTICAL">Vertical (retrato)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <p className="font-medium text-gray-900">Plantilla activa</p>
                        <p className="text-sm text-gray-500">Disponible para generar certificados</p>
                      </div>
                      <Switch
                        checked={formData.activo}
                        onCheckedChange={(checked) => setFormData({ ...formData, activo: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">Plantilla por defecto</p>
                        <p className="text-sm text-gray-500">Se usará automáticamente para este tipo</p>
                      </div>
                      <Switch
                        checked={formData.esDefault}
                        onCheckedChange={(checked) => setFormData({ ...formData, esDefault: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Diseño Tab */}
              <TabsContent value="diseno" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Fondo del Certificado</CardTitle>
                    <CardDescription>
                      Sube una imagen de fondo profesional o usa un color sólido
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Imagen de fondo</Label>
                      <p className="text-sm text-gray-500 mb-2">
                        Recomendado: 2480 x 1754 px (A4 horizontal a 300 DPI) en PNG o JPG
                      </p>
                      <ImageUpload
                        value={formData.fondoUrl}
                        onChange={(url) => setFormData({ ...formData, fondoUrl: url })}
                        folder="plantillas"
                      />
                    </div>

                    <div>
                      <Label htmlFor="fondoColor">Color de fondo (si no hay imagen)</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="color"
                          id="fondoColor"
                          value={formData.fondoColor}
                          onChange={(e) => setFormData({ ...formData, fondoColor: e.target.value })}
                          className="w-12 h-10 rounded border cursor-pointer"
                        />
                        <Input
                          value={formData.fondoColor}
                          onChange={(e) => setFormData({ ...formData, fondoColor: e.target.value })}
                          placeholder="#ffffff"
                          className="w-32"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Bordes Decorativos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Borde exterior</p>
                        <p className="text-sm text-gray-500">Marco decorativo dorado</p>
                      </div>
                      <Switch
                        checked={config.decorations.border.enabled}
                        onCheckedChange={(checked) => updateConfig(['decorations', 'border', 'enabled'], checked)}
                      />
                    </div>

                    {config.decorations.border.enabled && (
                      <div className="pl-4 space-y-3">
                        <div className="flex items-center gap-4">
                          <Label className="w-24">Color</Label>
                          <input
                            type="color"
                            value={config.decorations.border.color}
                            onChange={(e) => updateConfig(['decorations', 'border', 'color'], e.target.value)}
                            className="w-10 h-8 rounded border cursor-pointer"
                          />
                          <Input
                            value={config.decorations.border.color}
                            onChange={(e) => updateConfig(['decorations', 'border', 'color'], e.target.value)}
                            className="w-28"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          <Label className="w-24">Grosor</Label>
                          <Input
                            type="number"
                            value={config.decorations.border.width}
                            onChange={(e) => updateConfig(['decorations', 'border', 'width'], parseInt(e.target.value))}
                            className="w-20"
                            min={1}
                            max={10}
                          />
                          <span className="text-sm text-gray-500">px</span>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <p className="font-medium">Borde interior</p>
                        <p className="text-sm text-gray-500">Línea decorativa interior</p>
                      </div>
                      <Switch
                        checked={config.decorations.innerBorder.enabled}
                        onCheckedChange={(checked) => updateConfig(['decorations', 'innerBorder', 'enabled'], checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Elementos Tab */}
              <TabsContent value="elementos" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Elementos del Certificado</CardTitle>
                    <CardDescription>
                      Activa o desactiva los elementos que aparecerán en el certificado
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { key: 'logo', label: 'Logo de la institución' },
                      { key: 'title', label: 'Título (DIPLOMADO/CERTIFICADO/CONSTANCIA)' },
                      { key: 'subtitle', label: 'Subtítulo' },
                      { key: 'participantName', label: 'Nombre del participante' },
                      { key: 'participantDocument', label: 'Documento de identidad' },
                      { key: 'courseName', label: 'Nombre del curso' },
                      { key: 'courseDetails', label: 'Detalles (horas, créditos, modalidad)' },
                      { key: 'syllabus', label: 'Temario del curso' },
                      { key: 'dates', label: 'Fechas (inicio, fin, emisión)' },
                      { key: 'qrCode', label: 'Código QR de verificación' },
                      { key: 'verificationCode', label: 'Código de verificación' },
                      { key: 'signature1', label: 'Firma del director' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span>{label}</span>
                        <Switch
                          checked={config.elements[key as keyof typeof config.elements]?.enabled}
                          onCheckedChange={(checked) => updateConfig(['elements', key, 'enabled'], checked)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Textos Tab */}
              <TabsContent value="textos" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Textos Personalizados</CardTitle>
                    <CardDescription>
                      Personaliza los textos fijos del certificado
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Subtítulo</Label>
                      <Input
                        value={config.elements.subtitle.text}
                        onChange={(e) => updateConfig(['elements', 'subtitle', 'text'], e.target.value)}
                        placeholder="Otorgado por CertificadosPerú"
                      />
                    </div>

                    <div>
                      <Label>Nombre del firmante</Label>
                      <Input
                        value={config.elements.signature1.name}
                        onChange={(e) => updateConfig(['elements', 'signature1', 'name'], e.target.value)}
                        placeholder="CertificadosPerú"
                      />
                    </div>

                    <div>
                      <Label>Cargo del firmante</Label>
                      <Input
                        value={config.elements.signature1.label}
                        onChange={(e) => updateConfig(['elements', 'signature1', 'label'], e.target.value)}
                        placeholder="Director Académico"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Colores de Texto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { key: 'title', label: 'Título' },
                      { key: 'name', label: 'Nombre del participante' },
                      { key: 'course', label: 'Nombre del curso' },
                      { key: 'body', label: 'Texto general' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-4">
                        <Label className="w-40">{label}</Label>
                        <input
                          type="color"
                          value={config.fonts[key as keyof typeof config.fonts]?.color || '#000000'}
                          onChange={(e) => updateConfig(['fonts', key, 'color'], e.target.value)}
                          className="w-10 h-8 rounded border cursor-pointer"
                        />
                        <Input
                          value={config.fonts[key as keyof typeof config.fonts]?.color || '#000000'}
                          onChange={(e) => updateConfig(['fonts', key, 'color'], e.target.value)}
                          className="w-28"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar with Preview and Actions */}
          <div className="space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Vista Previa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`relative border-2 rounded-lg overflow-hidden ${
                    formData.orientacion === 'HORIZONTAL' ? 'aspect-[1.414]' : 'aspect-[0.707]'
                  }`}
                  style={{ backgroundColor: formData.fondoColor }}
                >
                  {formData.fondoUrl ? (
                    <img
                      src={formData.fondoUrl}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                      {/* Mini preview of certificate layout */}
                      <div className="text-xs font-bold text-gray-600 mb-1">
                        {tipoLabels[formData.tipo]}
                      </div>
                      <div className="text-[8px] text-gray-400 mb-2">
                        {config.elements.subtitle.text}
                      </div>
                      <div className="w-16 h-[1px] bg-gray-300 mb-2" />
                      <div className="text-[10px] font-bold text-gray-700">
                        NOMBRE DEL PARTICIPANTE
                      </div>
                      <div className="text-[6px] text-gray-400 mb-2">
                        DNI: 12345678
                      </div>
                      <div className="text-[8px] text-gray-500 mb-1">
                        Nombre del Curso
                      </div>
                      <div className="text-[6px] text-gray-400">
                        120 horas académicas
                      </div>
                    </div>
                  )}

                  {/* Decorative borders preview */}
                  {config.decorations.border.enabled && !formData.fondoUrl && (
                    <div
                      className="absolute inset-2 border-2 rounded pointer-events-none"
                      style={{ borderColor: config.decorations.border.color }}
                    />
                  )}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge>{formData.orientacion === 'HORIZONTAL' ? 'Horizontal' : 'Vertical'}</Badge>
                  <Badge variant="outline">{tipoLabels[formData.tipo]}</Badge>
                  {formData.esDefault && <Badge className="bg-amber-100 text-amber-700">Default</Badge>}
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="py-4">
                <h4 className="font-medium text-blue-900 mb-2">Consejos de diseño</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Usa imágenes de alta resolución (300 DPI)</li>
                  <li>• Deja espacio para el texto dinámico</li>
                  <li>• Los colores dorados dan elegancia</li>
                  <li>• Incluye el logo de tu institución</li>
                </ul>
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
                    Guardar Plantilla
                  </>
                )}
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/plantillas">Cancelar</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
