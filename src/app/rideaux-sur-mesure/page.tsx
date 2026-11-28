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
  CopperCurtains,
  CurtainWrappedGifts,
  GenoaVelvet,
  OceanView,
  SewingBeads,
} from "../_components/visuals";
import { Watermarked } from "../_components/watermarked";
import { WideVisualSection } from "../_components/wide_visual_section";

export const metadata = landing_metadata({
  pathname: "/rideaux-sur-mesure",
  title: "Rideaux sur mesure à Genève et Vaud, depuis 1921 | Maison Matron",
  description:
    "Vos rideaux sur mesure dans les plus beaux tissus, cousus par nos courtepointières et posés chez vous. L'atelier vient à vous, c'est offert. Visite chez vous ❊ Conseil sur vos tissus",
});

type actions_props = { tone: "paper" | "secondary" };

const Actions = ({ tone }: actions_props) => (
  <ExpertiseActions tone={tone}>
    <CallToActionDetail>Visite chez vous</CallToActionDetail>
    <CallToActionDetail>Conseil sur vos tissus</CallToActionDetail>
  </ExpertiseActions>
);

const CustomCurtains = () => (
  <main>
    <Hero video={<OceanView />}>
      <HeroOvertitle>
        Artisan tapissier et courtepointière depuis 4 générations
      </HeroOvertitle>
      <HeroTitle>Rideaux sur mesure à Genève et Vaud, depuis 1921</HeroTitle>
      <HeroLead>
        Vos fenêtres habillées des plus beaux tissus, sans rien poser vous-même
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
          <SectionTitle>Vous cherchez les rideaux de vos rêves ?</SectionTitle>
          <BulletList>
            <li>
              Sélectionner le tissu parfait parmi nos vastes collections ?
            </li>
            <li>
              Qu'on s'occupe de tout pour vous, de la confection à la pose ?
            </li>
          </BulletList>
          <SectionSubtitle>Vous êtes au bon endroit.</SectionSubtitle>
        </CenteredSection>

        <SectionSeparator />

        <HeritageSection action={<Actions tone="secondary" />} />

        <SectionSeparator />

        <WideVisualSection action={<Actions tone="secondary" />}>
          <SectionTitle>
            Transformez vos pièces avec des rideaux à votre image.
          </SectionTitle>
          <p>
            Nous nous occupons de tout, de la confection à la pose, même les
            rails ou les tringles.
          </p>
          <SectionSubtitle>
            Des rideaux qui tombent juste, dans un vrai tissu
          </SectionSubtitle>
          <p>
            Vous choisissez parmi le lin, le coton, le chanvre, la soie
            naturelle, la soie sauvage et le velours 100 % coton.
          </p>
          <p>
            Chaque rideau est cousu à vos mesures, puis posé chez vous avec ses
            rails et sa tringlerie.
          </p>
        </WideVisualSection>

        <SectionSeparator />

        <FabricsSection
          visual={<CopperCurtains />}
          action={<Actions tone="secondary" />}
        />

        <SectionSeparator />

        <WideVisualSection
          visual={<GenoaVelvet />}
          action={<Actions tone="secondary" />}
        >
          <SectionTitle>L'atelier vient à vous, et c'est offert</SectionTitle>
          <p>
            Quel que soit votre projet de rideaux, nous venons d'abord en
            discuter avec vous.
          </p>
          <p>
            Un tissu doit être vu, touché, jugé à la lumière de vos fenêtres et
            accordé à votre intérieur.
          </p>
          <SectionSubtitle>
            Nous vous conseillons dans le détail
          </SectionSubtitle>
          <p>
            Chaque tissu se choisit selon la lumière, l'usage et le style de la
            pièce.
          </p>
          <SectionSubtitle>Nous étudions vos fenêtres</SectionSubtitle>
          <p>
            Leurs mesures, et la pose qui leur convient, sur rail ou sur
            tringle.
          </p>
        </WideVisualSection>

        <SectionSeparator />

        <WideVisualSection
          visual={<SewingBeads />}
          action={<Actions tone="secondary" />}
        >
          <SectionTitle>Le processus &amp; la restitution</SectionTitle>
          <p>Nos courtepointières confectionnent vos rideaux à vos mesures.</p>
          <p>Nous vous tenons informé durant toute la confection.</p>
          <p>
            Lorsque vos rideaux sont prêts, nous fixons avec vous le jour et
            l'heure de la pose.
          </p>
          <p>Enfin, nous posons les rails, la tringlerie et vos rideaux :</p>
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

        <BookingSection form_id="rideaux-sur-mesure">
          <SectionTitle>
            Faites-vous plaisir, c'est sans engagement
          </SectionTitle>
        </BookingSection>

        <SectionSeparator />

        <ServicesSection current="/rideaux-sur-mesure" />
      </div>
      <Footer />
    </Watermarked>
    <script type="application/ld+json">{structured_data_json}</script>
  </main>
);

export default CustomCurtains;
