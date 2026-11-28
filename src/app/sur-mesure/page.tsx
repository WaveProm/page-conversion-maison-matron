import { landing_metadata } from "@/lib/landing_metadata";
import { structured_data_json } from "@/lib/structured_data";
import { BookingSection } from "../_components/booking_section";
import { BulletList } from "../_components/bullet_list";
import { CallToActionDetail } from "../_components/call_to_action";
import { CenteredSection } from "../_components/centered_section";
import { ExpertiseActions } from "../_components/expertise_actions";
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
  FiveChairs,
  LouisPhilippeSofa,
} from "../_components/visuals";
import { Watermarked } from "../_components/watermarked";
import { WideVisualSection } from "../_components/wide_visual_section";

export const metadata = landing_metadata({
  pathname: "/sur-mesure",
  title:
    "Meubles et chaises sur mesure à Genève et Vaud, depuis 1921 | Maison Matron",
  description:
    "Vos meubles et chaises sur mesure, façonnés à la main en pièce unique, avec le dernier chaisier de Suisse. L'atelier vient à vous, c'est offert. Visite chez vous ❊ Conseil sur vos bois et tissus",
});

type actions_props = { tone: "paper" | "secondary" };

const Actions = ({ tone }: actions_props) => (
  <ExpertiseActions tone={tone}>
    <CallToActionDetail>Visite chez vous</CallToActionDetail>
    <CallToActionDetail>Conseil sur vos bois et tissus</CallToActionDetail>
  </ExpertiseActions>
);

const CustomFurniture = () => (
  <main>
    <Hero video={null}>
      <HeroOvertitle>
        Ébénistes et tapissiers, de la visite à la fabrication
      </HeroOvertitle>
      <HeroTitle>
        Meubles et chaises sur mesure à Genève et Vaud, depuis 1921
      </HeroTitle>
      <HeroLead>
        Le meuble que vous imaginez, façonné à la main en pièce unique
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
          <SectionTitle>Vous cherchez le meuble de vos rêves ?</SectionTitle>
          <BulletList>
            <li>
              L'avoir à vos mesures, dans le bois et le tissu de votre choix ?
            </li>
            <li>
              Qu'on s'occupe de tout pour vous, de la visite chez vous à la
              fabrication ?
            </li>
          </BulletList>
          <SectionSubtitle>Vous êtes au bon endroit.</SectionSubtitle>
        </CenteredSection>

        <SectionSeparator />

        <HeritageSection action={<Actions tone="secondary" />} />

        <SectionSeparator />

        <WideVisualSection action={<Actions tone="secondary" />}>
          <SectionTitle>
            Transformez votre intérieur avec un meuble à votre image.
          </SectionTitle>
          <p>
            Nous le fabriquons à vos mesures, dans les bois et les tissus que
            vous choisissez.
          </p>
        </WideVisualSection>

        <SectionSeparator />

        <SideVisualSection
          visual={<FiveChairs />}
          action={<Actions tone="secondary" />}
        >
          <SectionTitle>
            Vos chaises assemblées par le dernier chaisier de Suisse
          </SectionTitle>
          <p>Nous travaillons avec lui pour chacune de vos chaises.</p>
          <p>Il les assemble à l'ancienne, dans des bois de Suisse.</p>
          <p>
            Les chaises et le canapé de nos photos, nous les avons tapissés :
            nous fabriquons les mêmes sur mesure.
          </p>
        </SideVisualSection>

        <SectionSeparator />

        <WideVisualSection
          visual={<LouisPhilippeSofa />}
          action={<Actions tone="secondary" />}
        >
          <SectionTitle>L'atelier vient à vous, et c'est offert</SectionTitle>
          <p>
            Quel que soit votre projet de meuble, nous venons d'abord en
            discuter avec vous.
          </p>
          <p>
            Un tissu doit être vu, touché, jugé à la lumière de chez vous et
            accordé à votre intérieur.
          </p>
          <SectionSubtitle>
            Nous vous conseillons dans le détail
          </SectionSubtitle>
          <p>
            Chaque bois et chaque tissu se choisit selon l'usage et le style de
            votre meuble.
          </p>
          <SectionSubtitle>Nous étudions votre intérieur</SectionSubtitle>
          <p>
            Ses mesures, et le meuble qui lui convient, de la chaise au canapé.
          </p>
        </WideVisualSection>

        <SectionSeparator />

        <WideVisualSection action={<Actions tone="secondary" />}>
          <SectionTitle>Le processus &amp; la restitution</SectionTitle>
          <p>Nos artisans façonnent votre meuble à vos mesures, en atelier.</p>
          <p>
            Comptez 3 à 6 mois selon le projet : le temps d'un travail fait à la
            main.
          </p>
          <p>Nous vous tenons informé durant toute la fabrication.</p>
          <p>
            Lorsque votre meuble est prêt, nous fixons avec vous le jour et
            l'heure de la restitution.
          </p>
          <p>Enfin, nous vous dévoilons votre meuble :</p>
          <SectionSubtitle>unique, et à votre image.</SectionSubtitle>
        </WideVisualSection>

        <SectionSeparator />

        <OfferSection
          video={<CurtainWrappedGifts />}
          action={<Actions tone="paper" />}
        >
          <OfferTitle>Black Friday : traitement des bois offert</OfferTitle>
        </OfferSection>

        <SectionSeparator />

        <ReviewsSection>
          <SectionTitle>Ils nous ont confié leur intérieur</SectionTitle>
        </ReviewsSection>

        <SectionSeparator />

        <BookingSection form_id="sur-mesure">
          <SectionTitle>
            Faites-vous plaisir, c'est sans engagement
          </SectionTitle>
        </BookingSection>

        <SectionSeparator />

        <ServicesSection current="/sur-mesure" />
      </div>
      <Footer />
    </Watermarked>
    <script type="application/ld+json">{structured_data_json}</script>
  </main>
);

export default CustomFurniture;
