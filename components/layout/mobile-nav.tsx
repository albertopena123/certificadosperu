'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, ChevronDown, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label)
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Link href="/" onClick={() => setOpen(false)}>
              <Image
                src="/logo/logocertificado.jpg"
                alt="CertificadosPerú"
                width={160}
                height={45}
                className="h-10 w-auto"
              />
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-6 flex flex-col gap-1">
          {NAV_ITEMS.map(item => (
            <div key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => toggleExpanded(item.label)}
                    className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors"
                  >
                    {item.label}
                    <ChevronDown
                      className={cn(
                        'h-4 w-4 transition-transform',
                        expandedItems.includes(item.label) && 'rotate-180'
                      )}
                    />
                  </button>
                  {expandedItems.includes(item.label) && (
                    <div className="ml-4 mt-1 flex flex-col gap-1">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="px-3 py-2 text-sm text-muted-foreground rounded-md hover:bg-muted hover:text-foreground transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors',
                    item.label === 'Verificar Certificado' && 'text-primary'
                  )}
                >
                  {item.label === 'Verificar Certificado' && (
                    <ShieldCheck className="h-4 w-4" />
                  )}
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <Separator className="my-6" />

        <div className="flex flex-col gap-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link href="/login" onClick={() => setOpen(false)}>
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar Sesion
            </Link>
          </Button>
          <Button className="w-full justify-start" asChild>
            <Link href="/registro" onClick={() => setOpen(false)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Registrarse
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
