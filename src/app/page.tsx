import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    <div className="flex flex-col flex-1">
    <main className="flex flex-col items-center justify-center flex-1">
      <h1 className="text-6xl font-bold">Welcome to the quiz page👋</h1>
    </main>
      <footer className="footer pb-9 px-6 relative">
        <Button>Start</Button>
      </footer>
    </div>
  )
}
