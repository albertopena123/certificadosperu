'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { ShieldCheck, Search, Menu, Globe, User, BookOpen, Award, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MobileNav } from './mobile-nav';
import { SearchCommand } from './search-command';
import { MobileSearch } from './mobile-search';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function Header() {
  const { data: session } = useSession();
  const isParticipante = session?.user?.userType === 'participante';

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b shadow-sm">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo and mobile nav */}
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo/logocertificado.jpg"
              alt="CertificadosPerú"
              width={200}
              height={55}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Main navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {NAV_ITEMS.map(item => (
              <NavigationMenuItem key={item.label}>
                {item.children ? (
                  <>
                    <NavigationMenuTrigger className="text-gray-700 hover:text-gray-900">
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                        {item.children.map(child => (
                          <li key={child.href}>
                            <NavigationMenuLink asChild>
                              <Link
                                href={child.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-violet-50 hover:text-violet-700 focus:bg-violet-50 focus:text-violet-700"
                              >
                                <div className="text-sm font-medium leading-none">
                                  {child.label}
                                </div>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        'flex items-center gap-1 text-gray-700 hover:text-gray-900',
                        item.label === 'Verificar Certificado' &&
                        'text-violet-600 font-medium hover:text-violet-700'
                      )}
                    >
                      {item.label === 'Verificar Certificado' && (
                        <ShieldCheck className="h-4 w-4" />
                      )}
                      {item.label}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search bar - desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <SearchCommand />
        </div>

        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          <MobileSearch />

          {isParticipante ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-violet-600" />
                  </div>
                  <span className="hidden sm:inline-block text-gray-700">
                    {session?.user?.name?.split(' ')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{session?.user?.name}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/mi-cuenta" className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Mi Perfil
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mi-cuenta/cursos" className="flex items-center">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Mis Cursos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/mi-cuenta/certificados" className="flex items-center">
                    <Award className="h-4 w-4 mr-2" />
                    Mis Certificados
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-red-600 focus:text-red-600"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" className="hidden sm:inline-flex text-gray-700 hover:text-gray-900 hover:bg-gray-100" asChild>
                <Link href="/login">Iniciar sesión</Link>
              </Button>

              <Button className="bg-violet-600 hover:bg-violet-700 text-white" asChild>
                <Link href="/registro">Regístrate</Link>
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" className="hidden lg:flex text-gray-700 hover:bg-gray-100">
            <Globe className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
