import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: 'admin-credentials',
      name: 'Admin',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales requeridas');
        }

        const { default: prisma } = await import('./prisma');

        const user = await prisma.usuario.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.activo) {
          throw new Error('Usuario no encontrado o inactivo');
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValidPassword) {
          throw new Error('Contraseña incorrecta');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.nombre,
          role: user.rol,
          userType: 'admin',
        };
      },
    }),
    Credentials({
      id: 'participante-credentials',
      name: 'Participante',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales requeridas');
        }

        const { default: prisma } = await import('./prisma');

        const participante = await prisma.participante.findUnique({
          where: { email: credentials.email as string },
        });

        if (!participante || !participante.activo) {
          throw new Error('Usuario no encontrado o inactivo');
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          participante.password
        );

        if (!isValidPassword) {
          throw new Error('Contraseña incorrecta');
        }

        return {
          id: participante.id,
          email: participante.email,
          name: participante.nombreCompleto,
          role: 'PARTICIPANTE',
          userType: 'participante',
          documento: participante.numeroDocumento,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.userType = user.userType;
        token.documento = user.documento;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.userType = token.userType as string;
        session.user.documento = token.documento as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  trustHost: true,
});
