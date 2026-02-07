'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, Save, User, Mail, Phone, MapPin, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function ConfiguracionPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    direccion: '',
    departamento: '',
    provincia: '',
    distrito: '',
    ocupacion: '',
    centroTrabajo: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const response = await fetch('/api/mi-cuenta/perfil');
      if (response.ok) {
        const data = await response.json();
        setFormData({
          nombreCompleto: data.nombreCompleto || '',
          email: data.email || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          departamento: data.departamento || '',
          provincia: data.provincia || '',
          distrito: data.distrito || '',
          ocupacion: data.ocupacion || '',
          centroTrabajo: data.centroTrabajo || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/mi-cuenta/perfil', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Perfil actualizado correctamente');
      } else {
        const error = await response.json();
        alert(error.error || 'Error al actualizar perfil');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error de conexión');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-500">Administra tu información personal</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
            <CardDescription>
              Esta información aparecerá en tus certificados
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombreCompleto">Nombre completo</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                    className="pl-10"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  El nombre no puede ser modificado
                </p>
              </div>

              <div>
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    disabled
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="pl-10"
                    placeholder="987654321"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ocupacion">Ocupación</Label>
                <div className="relative mt-1">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="ocupacion"
                    value={formData.ocupacion}
                    onChange={(e) => setFormData({ ...formData, ocupacion: e.target.value })}
                    className="pl-10"
                    placeholder="Tu profesión u ocupación"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="centroTrabajo">Centro de trabajo</Label>
              <Input
                id="centroTrabajo"
                value={formData.centroTrabajo}
                onChange={(e) => setFormData({ ...formData, centroTrabajo: e.target.value })}
                placeholder="Nombre de la institución donde trabajas"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="direccion">Dirección</Label>
              <div className="relative mt-1">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  className="pl-10"
                  placeholder="Tu dirección"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="departamento">Departamento</Label>
                <Input
                  id="departamento"
                  value={formData.departamento}
                  onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                  className="mt-1"
                  placeholder="Lima"
                />
              </div>
              <div>
                <Label htmlFor="provincia">Provincia</Label>
                <Input
                  id="provincia"
                  value={formData.provincia}
                  onChange={(e) => setFormData({ ...formData, provincia: e.target.value })}
                  className="mt-1"
                  placeholder="Lima"
                />
              </div>
              <div>
                <Label htmlFor="distrito">Distrito</Label>
                <Input
                  id="distrito"
                  value={formData.distrito}
                  onChange={(e) => setFormData({ ...formData, distrito: e.target.value })}
                  className="mt-1"
                  placeholder="Miraflores"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700"
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
                    Guardar cambios
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
