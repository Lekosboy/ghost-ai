import { SignIn } from "@clerk/nextjs";
import { Cpu, Users, FileText } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex h-screen font-sans">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-surface border-r border-border-default shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-12 pt-10">
          <div className="h-7 w-7 rounded-lg bg-brand shrink-0" />
          <span className="text-sm font-semibold text-copy-primary tracking-tight">Ghost AI</span>
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col justify-center px-12">
          <h1 className="text-4xl font-bold text-copy-primary leading-tight tracking-tight mb-4">
            Design systems at the<br />speed of thought.
          </h1>
          <p className="text-copy-secondary text-sm leading-relaxed mb-12 max-w-sm">
            Describe your architecture in plain English. Ghost AI maps it to a
            shared canvas your whole team can refine in real time.
          </p>

          <div className="space-y-6">
            <Feature
              icon={<Cpu className="h-4 w-4 text-copy-primary" />}
              title="AI Architecture Generation"
              description="Describe your system, AI maps it to nodes and edges on a live canvas."
            />
            <Feature
              icon={<Users className="h-4 w-4 text-copy-primary" />}
              title="Real-time Collaboration"
              description="Live cursors, presence indicators, and shared node editing across your team."
            />
            <Feature
              icon={<FileText className="h-4 w-4 text-copy-primary" />}
              title="Instant Spec Generation"
              description="Export a complete Markdown technical spec directly from the canvas graph."
            />
          </div>
        </div>

        {/* Footer */}
        <p className="px-12 pb-10 text-xs text-copy-faint">
          © 2026 Ghost AI. All rights reserved.
        </p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center p-8 bg-base">
        <SignIn />
      </div>
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-dim">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-copy-primary">{title}</p>
        <p className="text-xs text-copy-muted mt-0.5 leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
