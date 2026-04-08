import { Header } from '@/components/Header';
import { SnakeGame } from '@/components/SnakeGame';

export default function SnakePage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Classic Snake</h1>
            <p className="text-muted-foreground">
              A minimal snake game built into the existing app shell.
            </p>
          </div>

          <SnakeGame />
        </div>
      </main>
    </>
  );
}
