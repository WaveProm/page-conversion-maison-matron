import { landing_metadata } from "@/lib/landing_metadata";
import { structured_data_json } from "@/lib/structured_data";
import { BookingSection } from "../_components/booking_section";
import { BulletList } from "../_components/bullet_list";
import { CallToActionDetail } from "../_components/call_to_action";
import { CenteredSection } from "../_components/centered_section";
import { ExpertiseActions } from "../_components/expertise_actions";
import { FabricsSection } from "../_components/fabrics_section";
import { Footer } from "../_components/footer";
import { HeritageSection } from "../_components/heritage_section";
import {
  Hero,
  HeroClose,
  HeroFigures,
  HeroLead,
  HeroOvertitle,
  HeroQuote,
  HeroTitle,
} from "../_components/hero";
import { OfferSection, OfferTitle } from "../_components/offer_section";
import { ReviewsSection } from "../_components/reviews_section";
import { SectionSeparator } from "../_components/section_separator";
import { ServicesSection } from "../_components/services_section";
import { SectionSubtitle, SectionTitle } from "../_components/typography";
import {
  CurtainWrappedGifts,
  SunlightThroughBlinds,
  VenetianBlindsThroughTheDay,
} from "../_components/visuals";
import { Watermarked } from "../_components/watermarked";
import { WideVisualSection } from "../_components/wide_visual_section";

export const metadata = landing_metadata({
  pathname: "/stores-sur-mesure",
  title: "Stores sur mesure à Genève et Vaud, depuis 1921 | Maison Matron",
  description:
    "Vos stores d'intérieur sur mesure, en tissu ou en bois, fabriqués par nos soins et posés chez vous. L'atelier vient à vous, c'est offert. Visite chez vous ❊ Conseil sur vos tissus",
});

type actions_props = { tone: "paper" | "secondary" };

const Actions = ({ tone }: actions_props) => (
  <ExpertiseActions tone={tone}>
    <CallToActionDetail>Visite chez vous</CallToActionDetail>
    <CallToActionDetail>Conseil sur vos tissus</CallToActionDetail>
  </ExpertiseActions>
);

const CustomBlinds = () => (
  <main>
    <Hero video={<SunlightThroughBlinds />}>
      <HeroOvertitle>Artisan depuis 4 générations</HeroOvertitle>
      <HeroTitle>Stores sur mesure à Genève et Vaud, depuis 1921</HeroTitle>
      <HeroLead>
        Offrez-vous des stores en tissu ou en bois, sans rien poser vous-même
      </HeroLead>
      <HeroFigures />
      <HeroClose>
        <HeroQuote>
          « Des conseils avisés, une superbe sélection de tissus et un
          savoir-faire minutieux. » - Anne-Claude
        </HeroQuote>
        <Actions tone="paper" />
      </HeroClose>
    </Hero>

    <Watermarked>
      <div className="page-width flex flex-col gap-24 py-12 lg:gap-32 lg:py-16 [&_:is(p,li):not(.font-display)]:text-gray-600">
        <CenteredSection>
          <SectionTitle>Vous cherchez les stores de vos rêves ?</SectionTitle>
          <BulletList>
            <li>
              Sélectionner le tissu parfait parmi nos vastes collections ?
            </li>
            <li>
              Qu'on s'occupe de tout pour vous, de la fabrication à la pose ?
            </li>
          </BulletList>
          <SectionSubtitle>Vous êtes au bon endroit.</SectionSubtitle>
        </CenteredSection>

        <SectionSeparator />

        <HeritageSection action={<Actions tone="secondary" />} />

        <SectionSeparator />

        <WideVisualSection
          action={<Actions tone="secondary" />}
          visual={<VenetianBlindsThroughTheDay />}
        >
          <SectionTitle>
            Transformez vos fenêtres en élément de votre décor.
          </SectionTitle>
          <p>Nous nous occupons de tout, de la fabrication à la pose.</p>
          <SectionSubtitle>
            Des stores ajustés à vos fenêtres, dans la matière de votre choix
          </SectionSubtitle>
          <p>Vous choisissez le tissu ou le bois de chacun de vos stores.</p>
          <p>Chaque store est fabriqué à vos mesures, puis posé chez vous.</p>
        </WideVisualSection>

        <SectionSeparator />

        <FabricsSection action={<Actions tone="secondary" />} />

        <SectionSeparator />

        <WideVisualSection action={<Actions tone="secondary" />}>
          <SectionTitle>L'atelier vient à vous, et c'est offert</SectionTitle>
          <p>
            Quel que soit votre projet de stores, nous venons d'abord en
            discuter avec vous.
          </p>
          <p>
            Un tissu ou un bois doit être vu, touché, jugé à la lumière de vos
            fenêtres et accordé à votre intérieur.
          </p>
          <SectionSubtitle>
            Nous vous conseillons dans le détail
          </SectionSubtitle>
          <p>
            Chaque store se choisit selon la lumière, l'usage et le style de la
            pièce.
          </p>
          <SectionSubtitle>Nous étudions vos fenêtres</SectionSubtitle>
          <p>Leurs mesures, et la pose qui leur convient.</p>
        </WideVisualSection>

        <SectionSeparator />

        <WideVisualSection action={<Actions tone="secondary" />}>
          <SectionTitle>Le processus &amp; la restitution</SectionTitle>
          <p>Nous fabriquons vos stores à vos mesures.</p>
          <p>Nous vous tenons informé durant toute la fabrication.</p>
          <p>
            Lorsque vos stores sont prêts, nous fixons avec vous le jour et
            l'heure de la pose.
          </p>
          <p>Enfin, nous posons vos stores :</p>
          <SectionSubtitle>
            vos fenêtres habillées, à votre image.
          </SectionSubtitle>
        </WideVisualSection>

        <SectionSeparator />

        <OfferSection
          video={<CurtainWrappedGifts />}
          action={<Actions tone="paper" />}
        >
          <OfferTitle>Black Friday : 15 % sur tous les tissus</OfferTitle>
        </OfferSection>

        <SectionSeparator />

        <ReviewsSection>
          <SectionTitle>Ils nous ont confié leur intérieur</SectionTitle>
        </ReviewsSection>

        <SectionSeparator />

        <BookingSection form_id="stores-sur-mesure">
          <SectionTitle>
            Faites-vous plaisir, c'est sans engagement
          </SectionTitle>
        </BookingSection>

        <SectionSeparator />

        <ServicesSection current="/stores-sur-mesure" />
      </div>
      <Footer />
    </Watermarked>
    <script type="application/ld+json">{structured_data_json}</script>
  </main>
);

export default CustomBlinds;
