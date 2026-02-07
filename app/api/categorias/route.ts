import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Listar categorías públicas (activas)
export async function GET() {
  try {
    const categorias = await prisma.categoria.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' },
      include: {
        _count: {
          select: { cursos: true },
        },
      },
    });

    // Transformar al formato esperado por el frontend
    const categoriasFormateadas = categorias.map((cat) => ({
      id: cat.id,
      name: cat.nombre,
      slug: cat.slug,
      icon: cat.icono || 'BookOpen',
      color: cat.color || 'bg-gray-500',
      description: cat.descripcion,
      courseCount: cat._count.cursos,
    }));

    return NextResponse.json(categoriasFormateadas);
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}
