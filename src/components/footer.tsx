import Link from "next/link";
import { Car, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { pageToPath } from "@/stores/app-store";
import type { Page } from "@/stores/app-store";
import type { MouseEvent } from "react";
import { siteConfig } from "@/lib/seo";

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleFooterNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    page: Page
  ) => {
    if (!onNavigate) {
      return;
    }
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }
    event.preventDefault();
    onNavigate(page);
  };

  return (
    <footer className="bg-[#1F2937] text-white border-t border-gray-800">
      <div className="max-w-[1200px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <Car className="h-6 w-6 text-white" />
              </div>
              <span className="font-['Inter'] font-bold text-xl text-white">{siteConfig.name}</span>
            </div>
            <p className="font-['Roboto'] text-sm text-gray-400 mb-6 leading-relaxed">
              Compare car service quotes, maintenance pricing, and trusted repair providers in one {siteConfig.name} dashboard.
            </p>
            <div className="flex gap-3">
              <button className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </button>
              <button className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </button>
              <button className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </button>
              <button className="h-9 w-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-['Inter'] font-semibold mb-5 text-white">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", page: "about" as Page },
                { label: "How It Works", page: "how-it-works" as Page },
                { label: "Careers", page: "about" as Page },
                { label: "Blog", page: "blogs" as Page },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={pageToPath(item.page)}
                    onClick={(event) => handleFooterNavigation(event, item.page)}
                    className="font-['Roboto'] text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-['Inter'] font-semibold mb-5 text-white">Support</h4>
            <ul className="space-y-3">
              {[
                { label: "Help Centre", page: "contact" as Page },
                { label: "Contact Us", page: "contact" as Page },
                { label: "FAQs", page: "contact" as Page },
                { label: "Become a Supplier", page: "supplier-onboarding" as Page },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={pageToPath(item.page)}
                    onClick={(event) => handleFooterNavigation(event, item.page)}
                    className="font-['Roboto'] text-sm text-gray-400 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-['Inter'] font-semibold mb-5 text-white">Legal</h4>
            <ul className="space-y-3">
              <li>
                <button className="font-['Roboto'] text-sm text-gray-400 hover:text-primary transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button className="font-['Roboto'] text-sm text-gray-400 hover:text-primary transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="font-['Roboto'] text-sm text-gray-400 hover:text-primary transition-colors">
                  Cookie Policy
                </button>
              </li>
              <li>
                <button className="font-['Roboto'] text-sm text-gray-400 hover:text-primary transition-colors">
                  GDPR
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <p className="font-['Roboto'] text-sm text-gray-400 text-center">
            © 2025 {siteConfig.name}. All rights reserved. Registered in England and Wales.
          </p>
        </div>
      </div>
    </footer>
  );
}
