export default function Loading() {
  return (
    <main id="main-content" className="min-h-screen bg-[#06060e] text-white px-4 pt-28 pb-20" aria-busy="true" aria-label="Ładowanie sklepu">
      <div className="max-w-6xl mx-auto animate-pulse">
        <div className="h-4 w-40 rounded-full bg-white/10 mx-auto" />
        <div className="h-14 sm:h-20 max-w-3xl rounded-2xl bg-white/10 mx-auto mt-8" />
        <div className="h-6 max-w-xl rounded-xl bg-white/[0.07] mx-auto mt-6" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-20">
          <div className="sm:col-span-2 lg:col-span-2 h-[28rem] rounded-3xl bg-white/[0.06] border border-white/[0.06]" />
          <div className="h-[28rem] rounded-3xl bg-white/[0.06] border border-white/[0.06]" />
        </div>
      </div>
    </main>
  );
}
