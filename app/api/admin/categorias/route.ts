import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET - Listar categorías
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

    return NextResponse.json(categorias);
  } catch (error) {
    console.error('Error fetching categorias:', error);
    return NextResponse.json(
      { error: 'Error al obtener categorías' },
      { status: 500 }
    );
  }
}
