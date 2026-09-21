import {
  AlertTriangle,
  BrainCircuit,
  MapPin,
  ShieldCheck,
  Siren,
  Users,
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111F] text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-[#203449] bg-[#07111F]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EF4444]">
              <Siren size={19} />
            </div>

            <div>
              <p className="text-sm font-bold tracking-wide">DISASTER RESPONSE</p>
              <p className="hidden text-[10px] uppercase tracking-[0.2em] text-[#718096] sm:block">
                Intelligent Emergency Platform
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 md:flex">
            <a
              href="#features"
              className="text-sm text-[#A8B5C4] transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-[#A8B5C4] transition hover:text-white"
            >
              How It Works
            </a>

            <a
              href="#about"
              className="text-sm text-[#A8B5C4] transition hover:text-white"
            >
              About
            </a>
          </nav>

          <Button size="sm" variant="emergency">
            Emergency
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/5 blur-3xl" />

        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <Badge variant="info">AI-POWERED DISASTER MANAGEMENT</Badge>

            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Faster response.
              <span className="block text-[#4DA3FF]">
                Smarter decisions.
              </span>
              <span className="block">Lives protected.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#A8B5C4] sm:text-lg">
              A cloud-powered emergency response platform connecting
              citizens, disaster authorities, and rescue teams through
              real-time information, AI-assisted analysis, location tracking,
              and coordinated resource management.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" variant="emergency">
                <Siren size={19} />
                Report Emergency
              </Button>

              <Button size="lg" variant="outline">
                <MapPin size={19} />
                View Live Situation
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#718096]">
              <span className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-green-400" />
                Role-based access
              </span>

              <span className="flex items-center gap-2">
                <MapPin size={16} className="text-[#4DA3FF]" />
                Location aware
              </span>

              <span className="flex items-center gap-2">
                <BrainCircuit size={16} className="text-purple-400" />
                AI-assisted analysis
              </span>
            </div>
          </div>

          {/* Situation panel */}
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-blue-500/5 blur-2xl" />

            <Card
              variant="glass"
              className="relative overflow-hidden p-0"
            >
              <div className="border-b border-[#203449] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[#718096]">
                      Live Situation
                    </p>

                    <h2 className="mt-1 text-lg font-semibold">
                      Emergency Overview
                    </h2>
                  </div>

                  <span className="flex items-center gap-2 text-xs text-green-400">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                    System Online
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-px bg-[#203449]">
                <SituationStat
                  icon={<AlertTriangle size={18} />}
                  value="--"
                  label="Active Disasters"
                  iconClass="text-red-400"
                />

                <SituationStat
                  icon={<Users size={18} />}
                  value="--"
                  label="Rescue Teams"
                  iconClass="text-blue-400"
                />

                <SituationStat
                  icon={<Siren size={18} />}
                  value="--"
                  label="Emergency Requests"
                  iconClass="text-amber-400"
                />

                <SituationStat
                  icon={<ShieldCheck size={18} />}
                  value="--"
                  label="Resources"
                  iconClass="text-green-400"
                />
              </div>

              <div className="p-5">
                <div className="rounded-xl border border-dashed border-[#29415A] bg-[#07111F]/50 p-6 text-center">
                  <MapPin
                    size={30}
                    className="mx-auto text-[#4DA3FF]"
                  />

                  <p className="mt-3 text-sm font-medium">
                    Live disaster map
                  </p>

                  <p className="mt-1 text-xs text-[#718096]">
                    Real-time location data will appear here.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-[#203449] bg-[#091522]"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4DA3FF]">
              Core capabilities
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              One platform for coordinated disaster response.
            </h2>

            <p className="mt-4 text-[#A8B5C4]">
              The system brings reporting, AI analysis, emergency requests,
              resources, rescue operations, and location information together
              in one platform.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<BrainCircuit />}
              title="AI Disaster Analysis"
              description="Analyze reported incidents and assist authorities with disaster classification and severity estimation."
            />

            <FeatureCard
              icon={<MapPin />}
              title="Location Tracking"
              description="Capture incident locations and provide a centralized view of active disaster situations."
            />

            <FeatureCard
              icon={<Siren />}
              title="Emergency Requests"
              description="Request rescue, medical aid, food, water, or shelter and track the request status."
            />

            <FeatureCard
              icon={<Users />}
              title="Rescue Coordination"
              description="Help authorities assign rescue teams based on location, availability, and emergency requirements."
            />

            <FeatureCard
              icon={<ShieldCheck />}
              title="Resource Management"
              description="Monitor essential supplies and identify resource shortages during emergency operations."
            />

            <FeatureCard
              icon={<AlertTriangle />}
              title="Real-Time Alerts"
              description="Surface emergency notifications, rescue updates, and critical resource information."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-[#203449]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4DA3FF]">
                Response workflow
              </p>

              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                From emergency report to coordinated response.
              </h2>

              <p className="mt-5 leading-7 text-[#A8B5C4]">
                Citizens can report incidents with location and supporting
                information. The platform processes the report, assists with
                analysis, and provides authorities with the information needed
                to coordinate response operations.
              </p>
            </div>

            <div className="space-y-4">
              <WorkflowStep
                number="01"
                title="Report"
                description="Submit the emergency type, details, location, and optional media."
              />

              <WorkflowStep
                number="02"
                title="Analyze"
                description="AI-assisted processing helps classify the incident and estimate severity."
              />

              <WorkflowStep
                number="03"
                title="Coordinate"
                description="Authorities review the situation and coordinate rescue teams and resources."
              />

              <WorkflowStep
                number="04"
                title="Respond"
                description="Rescue operations and emergency requests are tracked through the platform."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="about"
        className="border-t border-[#203449] bg-[#050D16]"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-[#718096] sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>
            AI-Powered Smart Disaster Management System
          </p>

          <p>
            Cloud-based emergency response platform
          </p>
        </div>
      </footer>
    </main>
  );
}

function SituationStat({
  icon,
  value,
  label,
  iconClass,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  iconClass: string;
}) {
  return (
    <div className="bg-[#0D1B2A] p-5">
      <div className={iconClass}>{icon}</div>

      <p className="mt-3 text-2xl font-bold">{value}</p>

      <p className="mt-1 text-xs text-[#718096]">{label}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="group transition duration-200 hover:-translate-y-1 hover:border-[#4DA3FF]/30">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#4DA3FF]/10 text-[#4DA3FF]">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-semibold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-[#A8B5C4]">
        {description}
      </p>
    </Card>
  );
}

function WorkflowStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-[#203449] bg-[#0D1B2A] p-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4DA3FF]/10 text-sm font-bold text-[#4DA3FF]">
        {number}
      </div>

      <div>
        <h3 className="font-semibold">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-[#A8B5C4]">
          {description}
        </p>
      </div>
    </div>
  );
}