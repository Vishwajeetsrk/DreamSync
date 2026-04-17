export default function Terms() {
  return (
    <div className="min-h-screen bg-stone-50/50 py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12 bg-white border border-stone-100 p-8 md:p-16 rounded-[2.5rem] shadow-xl shadow-stone-200/50">
        <header className="border-b border-stone-100 pb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">Terms of Service</h1>
          <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Last updated: April 2026</p>
        </header>
        
        <div className="space-y-10 text-stone-600 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">1. Acceptance of Terms</h2>
            <p className="font-medium text-lg">
              By accessing and using DreamSync, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using our application.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">2. User Accounts</h2>
            <p className="font-medium text-lg">
              You must create an account to access our core AI tools. You are responsible for safeguarding your password and any activities or actions under your password.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">3. Prohibited Uses</h2>
            <p className="font-medium text-lg">
              You agree not to use the service for any illegal purposes or to conduct any activity that would violate the rights of others or compromise the security of the application.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">4. Limitations of AI</h2>
            <p className="font-medium text-lg">
              The AI-generated roadmaps, portfolio text, and ATS scores provided by DreamSync are for guidance purposes only. We make no guarantees regarding hiring outcomes or absolute accuracy.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
