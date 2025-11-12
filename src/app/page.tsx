import Hero from '@/components/Hero';
import { Navigation } from '@/components/Navigation';

export default function Home() {
  return (
    <main className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      <Navigation />
      <Hero />
    </main>
  );
}
