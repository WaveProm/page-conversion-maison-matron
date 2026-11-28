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
  ClubArmchair,
  CurtainWrappedGifts,
  FiveChairs,
  MaisonMatronHero,
  MaisonMatronReel,
} from "../_components/visuals";
import { Watermarked } from "../_components/watermarked";
import { WideVisualSection } from "../_components/wide_visual_section";

export const metadata = landing_metadata({
  pathname: "/fauteuils",
  title:
    "Restauration de fauteuils et de chaises à Genève et Vaud, depuis 1921 | Maison Matron",
  description:
    "Vos fauteuils et vos chaises restaurés, regarnis et habillés des plus beaux tissus par nos tapissiers. L'atelier vient à vous, c'est offert. Visite chez vous ❊ Conseil sur vos tissus",
});

type actions_props = { tone: "paper" | "secondary" };

const Actions = ({ tone }: actions_props) => (
  <ExpertiseActions tone={tone}>
    <CallToActionDetail>Visite chez vous</CallToActionDetail>
    <CallToActionDetail>Conseil sur vos tissus</CallToActionDetail>
  </ExpertiseActions>
);

const ArmchairsAndChairs = () => (
  <main>
    <Hero video={<MaisonMatronHero />}>
      <HeroOvertitle>
        Tapissiers et ébénistes, de la visite à la restitution
      </HeroOvertitle>
      <HeroTitle>
        Restauration de fauteuils et de chaises à Genève et Vaud,
        depuis&nbsp;1921
      </HeroTitle>
      <HeroLead>
        Vos fauteuils et vos chaises regarnis et habillés des plus beaux tissus,
        sans rien transporter vous-même
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
            Vous cherchez à restaurer le fauteuil auquel vous tenez ?
          </SectionTitle>
          <BulletList>
            <li>
              Sélectionner le tissu parfait parmi nos vastes collections ?
            </li>
            <li>
              Qu'on s'occupe de tout pour vous, du transport à la restauration ?
            </li>
          </BulletList>
          <SectionSubtitle>Vous êtes au bon endroit.</SectionSubtitle>
        </CenteredSection>

        <SectionSeparator />

        <HeritageSection action={<Actions tone="secondary" />} />

        <SectionSeparator />

        <WideVisualSection
          visual={<FiveChairs />}
          action={<Actions tone="secondary" />}
        >
          <SectionTitle>
            Transformez vos fauteuils et vos chaises en pièces à votre image.
          </SectionTitle>
          <p>
            Nous nous occupons de tout, de la restauration au garnissage,
            jusqu'au tissu.
          </p>
          <SectionSubtitle>
            Des assises regarnies, dans les plus beaux tissus
          </SectionSubtitle>
          <p>
            Du Voltaire au Louis XV, nos tapissiers restaurent et regarnissent
            chaque fauteuil, chaque chaise.
          </p>
          <p>
            Chaque pièce est travaillée à la main, puis habillée du tissu que
            vous avez choisi chez vous.
          </p>
        </WideVisualSection>

        <SectionSeparator />

        <FabricsSection
          visual={<MaisonMatronReel />}
          action={<Actions tone="secondary" />}
        />

        <SectionSeparator />

        <WideVisualSection action={<Actions tone="secondary" />}>
          <SectionTitle>L'atelier vient à vous, et c'est offert</SectionTitle>
          <p>
            Quel que soit votre projet de fauteuils ou de chaises, nous venons
            d'abord en discuter avec vous.
          </p>
          <p>
            Un tissu doit être vu, touché, jugé à la lumière de chez vous et
            accordé à votre intérieur.
          </p>
          <SectionSubtitle>
            Nous vous conseillons dans le détail
          </SectionSubtitle>
          <p>
            Chaque tissu se choisit selon l'usage du fauteuil et le style de la
            pièce.
          </p>
          <SectionSubtitle>
            Nous évaluons vos fauteuils et vos chaises
          </SectionSubtitle>
          <p>
            Leur état, leur garnissage, et ce qui vaut la peine d'être restauré.
          </p>
        </WideVisualSection>

        <SectionSeparator />

        <WideVisualSection
          visual={<ClubArmchair />}
          action={<Actions tone="secondary" />}
        >
          <SectionTitle>Le processus &amp; la restitution</SectionTitle>
          <p>
            Nous prenons en charge le transport de vos fauteuils et de vos
            chaises jusqu'à l'atelier.
          </p>
          <p>Nous vous tenons informé durant toute la restauration.</p>
          <p>
            Lorsque nos tapissiers ont terminé, nous fixons avec vous le jour et
            l'heure de la restitution.
          </p>
          <p>Enfin, nous vous dévoilons chaque pièce :</p>
          <SectionSubtitle>une seconde vie, à votre image.</SectionSubtitle>
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

        <BookingSection form_id="fauteuils">
          <SectionTitle>
            Faites-vous plaisir, c'est sans engagement
          </SectionTitle>
        </BookingSection>

        <SectionSeparator />

        <ServicesSection current="/fauteuils" />
      </div>
      <Footer />
    </Watermarked>
    <script type="application/ld+json">{structured_data_json}</script>
  </main>
);

export default ArmchairsAndChairs;
