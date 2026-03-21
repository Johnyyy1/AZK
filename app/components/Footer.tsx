import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-8 bg-white border-t border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
        <div className="col-span-1">
          <div className="font-headline font-bold text-emerald-900 text-2xl mb-4">
            AquaSmart
          </div>
          <p className="font-body text-sm text-slate-500 mb-6">
            Sustainable precision for the modern laboratory of life.
          </p>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">public</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-lg">
                terminal
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-1">
          <h6 className="font-headline font-bold text-primary mb-4">
            Resources
          </h6>
          <ul className="space-y-3">
            <li>
              <a
                className="font-body text-sm text-slate-400 hover:text-emerald-600"
                href="#"
              >
                Documentation
              </a>
            </li>
            <li>
              <a
                className="font-body text-sm text-slate-400 hover:text-emerald-600"
                href="#"
              >
                API Reference
              </a>
            </li>
            <li>
              <Link
                className="font-body text-sm text-slate-400 hover:text-emerald-600"
                href="/case-studies"
              >
                Case Studies
              </Link>
            </li>
          </ul>
        </div>
        <div className="col-span-1">
          <h6 className="font-headline font-bold text-primary mb-4">
            Company
          </h6>
          <ul className="space-y-3">
            <li>
              <a
                className="font-body text-sm text-slate-400 hover:text-emerald-600"
                href="#"
              >
                About Us
              </a>
            </li>
            <li>
              <a
                className="font-body text-sm text-slate-400 hover:text-emerald-600"
                href="#"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                className="font-body text-sm text-slate-400 hover:text-emerald-600"
                href="#"
              >
                Terms of Service
              </a>
            </li>
          </ul>
        </div>
        <div className="col-span-1">
          <h6 className="font-headline font-bold text-primary mb-4">
            Support
          </h6>
          <ul className="space-y-3">
            <li>
              <a
                className="font-body text-sm text-slate-400 hover:text-emerald-600"
                href="#"
              >
                Contact Support
              </a>
            </li>
            <li>
              <a
                className="font-body text-sm text-slate-400 hover:text-emerald-600"
                href="#"
              >
                Help Center
              </a>
            </li>
            <li>
              <a
                className="font-body text-sm text-slate-400 hover:text-emerald-600"
                href="#"
              >
                Status
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-50 text-center">
        <p className="font-body text-xs text-slate-400">
          © 2024 AquaSmart Systems. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
