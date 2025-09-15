import Hero from '@/components/Hero'
import Features from '@/components/Features'
import ProgressPreview from '@/components/ProgressPreview'
import CulturalHighlight from '@/components/CulturalHighlight'
import CallToAction from '@/components/CallToAction'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-cream-50 to-marigold-50">
      <Hero />
      <Features />
      <ProgressPreview />
      <CulturalHighlight />
      <CallToAction />
    </main>
  )
}
