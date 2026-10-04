import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { POLICIES, policyHtml } from "@/lib/policies";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { ContactForm } from "@/components/contact-form";

export const dynamicParams = false;

export function generateStaticParams() {
  return POLICIES.map((p) => ({ policy: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[policy]">): Promise<Metadata> {
  const { policy: slug } = await params;
  const policy = POLICIES.find((p) => p.slug === slug);
  if (!policy) return {};
  return { title: `${policy.title} | Petivo`, description: policy.description };
}

export default async function PolicyPage({ params }: PageProps<"/[policy]">) {
  const { policy: slug } = await params;
  const policy = POLICIES.find((p) => p.slug === slug);
  if (!policy) notFound();

  return (
    <main id="main-content" className="min-h-screen bg-background text-ink overflow-x-hidden">
      <SiteNav />
      <article className="pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto surface rounded-[2rem] p-6 sm:p-12">
          <div className="policy-body" dangerouslySetInnerHTML={{ __html: policyHtml(policy.key) }} />
          {slug === "kontakt" && <ContactForm />}
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
