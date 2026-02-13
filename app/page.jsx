import ChatWidget from "../components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-4">
      <div className="text-center mb-12">
        <h1 className="text-6xl font-bold text-white mb-4">
          RG Mazon
        </h1>
        <p className="text-xl text-slate-300 mb-3">
          Full-Stack Developer & UI/UX Designer
        </p>
        <p className="text-slate-500 text-sm max-w-md mx-auto">
          Explore my work and experience through an AI-powered conversation
        </p>
      </div>

      <ChatWidget />
    </main>
  );
}