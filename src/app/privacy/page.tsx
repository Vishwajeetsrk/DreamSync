export default function Privacy() {
  return (
    <div className="min-h-screen bg-stone-50/50 py-20 px-6">
      <div className="max-w-4xl mx-auto space-y-12 bg-white border border-stone-100 p-8 md:p-16 rounded-[2.5rem] shadow-xl shadow-stone-200/50">
        <header className="border-b border-stone-100 pb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-sm font-bold text-stone-400 uppercase tracking-widest">Last updated: April 2026</p>
        </header>
        
        <div className="space-y-10 text-stone-600 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">1. Information We Collect</h2>
            <p className="font-medium text-lg">
              When you use DreamSync, we collect information you provide directly to us including your name, email address (via Firebase Auth), and the resumes (PDFs) you upload for ATS checking. Resumes are temporarily processed for analysis and are not permanently stored on our servers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">2. How We Use Your Information</h2>
            <p className="font-medium text-lg">
              We use your information exclusively to provide our services, such as generating career roadmaps, checking your ATS scores, and securing your account. We never sell your personal data to third parties.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">3. Data Security</h2>
            <p className="font-medium text-lg">
              Your authentication and account data are securely managed by Firebase and Supabase. While no service is completely secure, we implement standard industry practices to protect your information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-stone-900 tracking-tight">4. Contact Us</h2>
            <p className="font-medium text-lg">
              If you have any questions about this Privacy Policy, please contact us via our Team page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
