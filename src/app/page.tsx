import { landing_metadata } from "@/lib/landing_metadata";
import { structured_data_json } from "@/lib/structured_data";
import { BookingSection } from "./_components/booking_section";
import { CallToActionDetail } from "./_components/call_to_action";
import { CenteredSection } from "./_components/centered_section";
import { ExpertiseActions } from "./_components/expertise_actions";
import { FabricsSection } from "./_components/fabrics_section";
import { Footer } from "./_components/footer";
import { HeritageSection } from "./_components/heritage_section";
import {
  Hero,
  HeroClose,
  HeroFigures,
  HeroLead,
  HeroOvertitle,
  HeroQuote,
  HeroTitle,
} from "./_components/hero";
import { ReviewsSection } from "./_components/reviews_section";
import { SectionSeparator } from "./_components/section_separator";
import { SideVisualSection } from "./_components/side_visual_section";
import { SectionSubtitle, SectionTitle } from "./_components/typography";
import {
  ClubArmchair,
  FiveChairs,
  GenoaVelvet,
  LouisPhilippeSofa,
  MaisonMatronHero,
  MaisonMatronReel,
  VoltaireOrbitalMacro,
} from "./_components/visuals";
import { Watermarked } from "./_components/watermarked";
import { WideVisualSection } from "./_components/wide_visual_section";

export const metadata = landing_metadata({
  pathname: "/",
  title: "Maison Matron | La Haute Couture, pour vos meubles",
  description:
    "Nous transformons vos meubles en pièces uniques au monde. L'atelier vient à vous, c'est offert. Visite chez vous ❊ Évaluation de votre mobilier",
});

const Actions = () => (
  <ExpertiseActions tone="secondary">
    <CallToActionDetail>Visite chez vous</CallToActionDetail>
    <CallToActionDetail>Évaluation de votre mobilier</CallToActionDetail>
  </ExpertiseActions>
);

const Home = () => (
  <main>
    <Hero video={<MaisonMatronHero />}>
      <HeroOvertitle>
        Artisan tapissier et ébéniste depuis 4 générations
      </HeroOvertitle>
      <HeroTitle>Transformez vos meubles en pièce unique</HeroTitle>
      <HeroLead>Profitez d'une collection de tissus d'exception</HeroLead>
      <HeroFigures />
      <HeroClose>
        <HeroQuote>
          « Des conseils avisés, une superbe sélection de tissus et un
          savoir-faire minutieux. » - Anne-Claude
        </HeroQuote>
        <ExpertiseActions tone="paper">
          <CallToActionDetail>Visite chez vous</CallToActionDetail>
          <CallToActionDetail>Évaluation de votre mobilier</CallToActionDetail>
        </ExpertiseActions>
      </HeroClose>
    </Hero>

    <Watermarked>
      <div className="page-width flex flex-col gap-24 py-12 lg:gap-32 lg:py-16 [&_:is(p,li):not(.font-display)]:text-gray-600">
        <CenteredSection>
          <SectionTitle>Vous cherchez la pièce à votre image, or…</SectionTitle>
          <p>La marque décide jusqu'où va votre « sur-mesure ».</p>
          <p>L'unique est éclipsé par les collections à la mode.</p>
          <p>Le choix des tissus vous est limité.</p>
        </CenteredSection>

        <SectionSeparator />

        <HeritageSection action={<Actions />} />

        <SectionSeparator />

        <WideVisualSection visual={<FiveChairs />} action={<Actions />}>
          <SectionTitle>De meuble à pièce de collection</SectionTitle>
          <p>
            Nos vastes collections de tissus et notre savoir-faire d'ébéniste
            transforment vos meubles.
          </p>
          <SectionSubtitle>
            Deux savoir-faire centenaires valorisent vos pièces
          </SectionSubtitle>
          <p>Nous travaillons avec le dernier chaisier de Suisse (1908) :</p>
          <p>Il assemble chaque chaise à l'ancienne, dans des bois locaux.</p>
        </WideVisualSection>

        <SectionSeparator />

        <FabricsSection visual={<MaisonMatronReel />} action={<Actions />} />

        <SectionSeparator />

        <WideVisualSection visual={<GenoaVelvet />} action={<Actions />}>
          <SectionTitle>L'atelier vient à vous, et c'est offert</SectionTitle>
          <p>
            Quel que soit votre projet, nous venons d'abord en discuter avec
            vous.
          </p>
          <p>
            Un tissu doit être vu, touché, jugé à la lumière de chez vous et
            accordé à votre intérieur.
          </p>
          <SectionSubtitle>
            Nous vous conseillons dans le détail
          </SectionSubtitle>
          <p>
            Les matériaux se choisissent selon la vie passée et future de votre
            objet.
          </p>
          <SectionSubtitle>Nous évaluons votre mobilier</SectionSubtitle>
          <p>
            La santé des bois et des matières et ce qui vaut la peine d'être
            restauré.
          </p>
        </WideVisualSection>

        <SectionSeparator />

        <WideVisualSection visual={<LouisPhilippeSofa />} action={<Actions />}>
          <SectionTitle>Le processus &amp; la restitution</SectionTitle>
          <p>
            Nous prenons en charge le transport de vos pièces dans le plus grand
            soin.
          </p>
          <p>
            Nous vous tenons informé durant tout le processus de transformation.
          </p>
          <p>
            Lorsque les artisans ont terminé, nous fixons avec vous le jour et
            l'heure de restitution.
          </p>
          <p>Enfin, nous vous dévoilons chaque ouvrage :</p>
          <SectionSubtitle>unique et à votre image.</SectionSubtitle>
        </WideVisualSection>

        <SectionSeparator />

        <SideVisualSection
          visual={<VoltaireOrbitalMacro />}
          action={<Actions />}
        >
          <SectionTitle>4 saisons, 4 privilèges</SectionTitle>
          <SectionSubtitle>
            Chaque saison, nous pensons une offre à la mesure de notre
            clientèle. La prochaine vous attend.
          </SectionSubtitle>
        </SideVisualSection>

        <SectionSeparator />

        <WideVisualSection visual={<ClubArmchair />} action={<Actions />}>
          <SectionTitle>
            Vous travaillez avec un décorateur d'intérieur ?
          </SectionTitle>
          <SectionSubtitle>C'est parfait.</SectionSubtitle>
          <p>Nos métiers d'art fonctionnent en symbiose.</p>
          <p>
            Il nous transmet sa vision, nous apportons nos 100 ans d'artisanat.
          </p>
          <p>Nous échangeons directement, vous gardez un seul interlocuteur.</p>
        </WideVisualSection>

        <SectionSeparator />

        <ReviewsSection>
          <SectionTitle>Ils nous ont confié leurs pièces</SectionTitle>
        </ReviewsSection>

        <SectionSeparator />

        <BookingSection form_id="luxe">
          <SectionTitle>L'atelier vient à vous, c'est offert.</SectionTitle>
        </BookingSection>
      </div>
      <Footer />
    </Watermarked>
    <script type="application/ld+json">{structured_data_json}</script>
  </main>
);

export default Home;
