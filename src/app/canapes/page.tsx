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
import { SideVisualSection } from "../_components/side_visual_section";
import { SectionSubtitle, SectionTitle } from "../_components/typography";
import {
  CurtainWrappedGifts,
  LionHeadSofa,
  LouisPhilippeSofa,
} from "../_components/visuals";
import { Watermarked } from "../_components/watermarked";
import { WideVisualSection } from "../_components/wide_visual_section";

export const metadata = landing_metadata({
  pathname: "/canapes",
  title:
    "Restauration et rembourrage de canapés à Genève et Vaud, depuis 1921 | Maison Matron",
  description:
    "Votre canapé en tissu ou en cuir restauré et rembourré par nos tapissiers, à votre image. L'atelier vient à vous, c'est offert. Visite chez vous ❊ Conseil sur vos tissus",
});

type actions_props = { tone: "paper" | "secondary" };

const Actions = ({ tone }: actions_props) => (
  <ExpertiseActions tone={tone}>
    <CallToActionDetail>Visite chez vous</CallToActionDetail>
    <CallToActionDetail>Conseil sur vos tissus</CallToActionDetail>
  </ExpertiseActions>
);

const SofaRestoration = () => (
  <main>
    <Hero video={null}>
      <HeroOvertitle>Artisan tapissier depuis 4 générations</HeroOvertitle>
      <HeroTitle>
        Restauration et rembourrage de canapés à Genève et Vaud, depuis 1921
      </HeroTitle>
      <HeroLead>
        Votre canapé rembourré et habillé des plus beaux tissus, choisis chez
        vous
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
          <SectionTitle>
            Vous cherchez à retrouver le confort de votre canapé ?
          </SectionTitle>
          <BulletList>
            <li>
              Sélectionner le tissu parfait parmi nos vastes collections ?
            </li>
            <li>
              Qu'on s'occupe de tout pour vous, de la visite chez vous au retour
              de votre canapé ?
            </li>
          </BulletList>
          <SectionSubtitle>Vous êtes au bon endroit.</SectionSubtitle>
        </CenteredSection>

        <SectionSeparator />

        <HeritageSection action={<Actions tone="secondary" />} />

        <SectionSeparator />

        <WideVisualSection action={<Actions tone="secondary" />}>
          <SectionTitle>
            Transformez votre salon avec un canapé à votre image.
          </SectionTitle>
          <p>
            Nous nous occupons de tout, du rembourrage de l'assise au tissu ou
            au cuir qui l'habille.
          </p>
        </WideVisualSection>

        <SectionSeparator />

        <div id="tissu">
          <WideVisualSection
            visual={<LionHeadSofa />}
            action={<Actions tone="secondary" />}
          >
            <SectionTitle>Votre canapé en tissu, habillé de neuf</SectionTitle>
            <p>
              Nos tapissiers le retapissent dans le tissu que vous choisissez
              chez vous, parmi des milliers.
            </p>
            <p>Nous le restaurons, le réparons ou en refaisons la garniture.</p>
          </WideVisualSection>
        </div>

        <SectionSeparator />

        <div id="cuir">
          <SideVisualSection action={<Actions tone="secondary" />}>
            <SectionTitle>
              Votre canapé en cuir, restauré plutôt que remplacé
            </SectionTitle>
            <p>Nous restaurons, réparons ou refaisons votre canapé en cuir.</p>
            <p>Vous gardez le canapé que vous aimez.</p>
          </SideVisualSection>
        </div>

        <SectionSeparator />

        <div id="rembourrage">
          <SideVisualSection action={<Actions tone="secondary" />}>
            <SectionTitle>
              Le rembourrage de votre canapé, refait sous le tissu comme sous le
              cuir
            </SectionTitle>
            <p>
              Nous refaisons le rembourrage de votre canapé, son assise
              comprise.
            </p>
            <p>
              Puis nous le regarnissons, dans le tissu choisi avec vous ou dans
              son cuir.
            </p>
          </SideVisualSection>
        </div>

        <SectionSeparator />

        <FabricsSection action={<Actions tone="secondary" />} />

        <SectionSeparator />

        <WideVisualSection action={<Actions tone="secondary" />}>
          <SectionTitle>L'atelier vient à vous, et c'est offert</SectionTitle>
          <p>
            Quel que soit votre projet de canapé, nous venons d'abord en
            discuter avec vous.
          </p>
          <p>
            Un tissu doit être vu, touché, jugé à la lumière de votre salon et
            accordé à votre intérieur.
          </p>
          <SectionSubtitle>
            Nous vous conseillons dans le détail
          </SectionSubtitle>
          <p>
            Chaque tissu se choisit selon la lumière, l'usage et le style de la
            pièce.
          </p>
          <SectionSubtitle>Nous étudions votre canapé</SectionSubtitle>
          <p>
            Son assise, son rembourrage, son tissu ou son cuir, et la
            restauration qui lui convient.
          </p>
        </WideVisualSection>

        <SectionSeparator />

        <WideVisualSection
          visual={<LouisPhilippeSofa />}
          action={<Actions tone="secondary" />}
        >
          <SectionTitle>Le processus &amp; la restitution</SectionTitle>
          <p>
            Nos tapissiers restaurent et rembourrent votre canapé, dans le tissu
            choisi avec vous ou dans son cuir.
          </p>
          <p>Nous vous tenons informé durant toute la restauration.</p>
          <p>
            Lorsque votre canapé est prêt, nous fixons avec vous le jour et
            l'heure de sa restitution.
          </p>
          <p>Enfin, nous vous rendons votre canapé :</p>
          <SectionSubtitle>une pièce unique, à votre image.</SectionSubtitle>
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

        <BookingSection form_id="canapes">
          <SectionTitle>
            Faites-vous plaisir, c'est sans engagement
          </SectionTitle>
        </BookingSection>

        <SectionSeparator />

        <ServicesSection current="/canapes" />
      </div>
      <Footer />
    </Watermarked>
    <script type="application/ld+json">{structured_data_json}</script>
  </main>
);

export default SofaRestoration;
