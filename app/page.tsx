import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  MapPin,
  ShieldCheck,
  Siren,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#061426] text-white">
      {/* Header */}
      <header className="border-b border-[#173653] bg-[#061426]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500 text-white shadow-lg shadow-red-500/20">
              <Siren size={21} />
            </div>

            <div>
              <p className="text-sm font-bold tracking-[0.14em]">
                DISASTER RESPONSE
              </p>
              <p className="text-[10px] uppercase tracking-[0.16em] text-[#6284a4]">
                Intelligent Emergency Platform
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-[#8fa5ba] transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-[#8fa5ba] transition hover:text-white"
            >
              How It Works
            </a>

            <a
              href="#about"
              className="text-sm text-[#8fa5ba] transition hover:text-white"
            >
              About
            </a>
          </div>

          <Link
            href="/auth/login"
            className="rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-400"
          >
            Emergency Access
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-28">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.8)]" />
              <span className="text-xs font-medium uppercase tracking-[0.14em] text-blue-300">
                AI-Powered Disaster Management
              </span>
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
              Faster response.
              <span className="block text-blue-400">
                Smarter decisions.
              </span>
              <span className="block">Lives protected.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-7 text-[#91a7bc] sm:text-lg">
              A cloud-powered emergency response platform connecting
              citizens, disaster authorities, and rescue teams through
              real-time information, AI-assisted analysis, location tracking,
              and coordinated emergency management.
            </p>

            {/* Main buttons */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/login"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-red-500/10 transition hover:bg-red-400"
              >
                <Siren size={19} />
                Login to Platform
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#294761] bg-[#0b1b2d] px-6 py-3.5 font-semibold text-white transition hover:border-blue-400/40 hover:bg-[#10243a]"
              >
                Create Account
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#6e8aa5]">
              <span className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-emerald-400" />
                Role-based access
              </span>

              <span className="flex items-center gap-2">
                <MapPin size={15} className="text-blue-400" />
                Location aware
              </span>

              <span className="flex items-center gap-2">
                <BrainCircuit size={15} className="text-violet-400" />
                AI-assisted analysis
              </span>
            </div>
          </div>

          {/* Right status panel */}
          <div className="flex items-center">
            <div className="w-full rounded-2xl border border-[#1d3a56] bg-[#0a1a2b]/90 shadow-2xl shadow-black/20">
              <div className="flex items-center justify-between border-b border-[#1d3a56] px-6 py-5">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#617b96]">
                    Platform
                  </p>
                  <h2 className="mt-1 text-xl font-bold">
                    Emergency Overview
                  </h2>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  System Online
                </div>
              </div>

              <div className="grid grid-cols-2">
                <FeatureBox
                  icon={<AlertTriangle size={20} />}
                  label="Disaster Reports"
                />

                <FeatureBox
                  icon={<Users size={20} />}
                  label="Rescue Teams"
                />

                <FeatureBox
                  icon={<Siren size={20} />}
                  label="Emergency Requests"
                />

                <FeatureBox
                  icon={<ShieldCheck size={20} />}
                  label="Secure Access"
                />
              </div>

              <div className="m-5 rounded-xl border border-dashed border-[#294761] bg-[#071728] px-5 py-8 text-center">
                <MapPin
                  size={30}
                  className="mx-auto text-blue-400"
                />

                <p className="mt-3 font-semibold">
                  Live Disaster Map
                </p>

                <p className="mt-1 text-sm text-[#647f99]">
                  Real-time disaster and emergency locations
                </p>

                <Link
                  href="/auth/login"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
                >
                  Access live situation
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-[#142d45] bg-[#071728] px-5 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">
            Platform Capabilities
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Built for real emergency response
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <InfoCard
              icon={<BrainCircuit />}
              title="AI Disaster Analysis"
              text="AI-assisted classification and severity assessment for submitted disaster reports."
            />

            <InfoCard
              icon={<MapPin />}
              title="Location Tracking"
              text="GPS-aware reporting and live disaster locations help responders understand where assistance is needed."
            />

            <InfoCard
              icon={<Users />}
              title="Coordinated Response"
              text="Citizens, authorities, and rescue teams work through role-specific emergency workflows."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="border-t border-[#142d45] px-5 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-400">
            How It Works
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            One platform. Multiple response roles.
          </h2>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <StepCard
              number="01"
              title="Report"
              text="Citizens submit disaster reports or emergency assistance requests."
            />

            <StepCard
              number="02"
              title="Analyze"
              text="The platform processes location, report details, and AI-assisted disaster assessment."
            />

            <StepCard
              number="03"
              title="Respond"
              text="Authorities coordinate resources and rescue teams respond to assigned emergencies."
            />
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="border-t border-[#142d45] bg-[#071728] px-5 py-16 lg:px-8"
      >
        <div className="mx-auto max-w-4xl text-center">
          <ShieldCheck
            size={30}
            className="mx-auto text-blue-400"
          />

          <h2 className="mt-4 text-3xl font-bold">
            Intelligent emergency management
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[#8299af]">
            A cloud-based disaster management system designed to support
            centralized information, AI-assisted analysis, emergency
            coordination, resource management, and real-time location
            awareness.
          </p>

          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/auth/login"
              className="rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white transition hover:bg-blue-400"
            >
              Login
            </Link>

            <Link
              href="/auth/register"
              className="rounded-xl border border-[#294761] px-6 py-3 font-semibold text-white transition hover:bg-[#10243a]"
            >
              Register
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#173653] px-5 py-7 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-3 text-xs text-[#5f7892] sm:flex-row">
          <p>Disaster Response Platform</p>
          <p>AI-Powered Smart Disaster Management System</p>
        </div>
      </footer>
    </main>
  );
}

function FeatureBox({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="border-b border-r border-[#1d3a56] p-6">
      <div className="text-blue-400">{icon}</div>
      <p className="mt-4 text-sm font-medium text-[#9eb1c3]">
        {label}
      </p>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#1d3a56] bg-[#0a1a2b] p-6">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-[#758da5]">
        {text}
      </p>
    </div>
  );
}

function StepCard({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[#1d3a56] bg-[#0a1a2b] p-6">
      <p className="text-sm font-bold text-blue-400">{number}</p>

      <h3 className="mt-5 text-xl font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-[#758da5]">
        {text}
      </p>
    </div>
  );
}