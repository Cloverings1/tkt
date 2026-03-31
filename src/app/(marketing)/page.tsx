import { Navbar } from "@/components/marketing/navbar"
import { Hero } from "@/components/marketing/hero"
import { FeatureGrid } from "@/components/marketing/feature-grid"
import { DashboardPreview } from "@/components/marketing/dashboard-preview"
import { HowItWorks } from "@/components/marketing/how-it-works"
import { Pricing } from "@/components/marketing/pricing"
import { Footer } from "@/components/marketing/footer"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <FeatureGrid />
      <DashboardPreview />
      <HowItWorks />
      <Pricing />
      <Footer />
    </>
  )
}
