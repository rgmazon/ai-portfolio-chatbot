import ChatWidget from "../components/ChatWidget";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-3">
          RG Mazon
        </h1>
        <p className="text-xl text-gray-300 mb-2">
          Full-Stack Developer & UI/UX Designer
        </p>
        <p className="text-gray-400 text-sm">
          Ask me anything about my experience, skills, and portfolio
        </p>
      </div>

      <ChatWidget />
    </main>
  );
}