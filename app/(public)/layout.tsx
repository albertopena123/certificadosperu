import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { FloatingChatBot } from '@/components/floating-chat-bot';
import { FloatingWhatsApp } from '@/components/floating-whatsapp';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      <FloatingChatBot />
    </>
  );
}
