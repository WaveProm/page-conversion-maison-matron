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
import { CurtainWrappedGifts, FiveChairs } from "../_components/visuals";
import { Watermarked } from "../_components/watermarked";
import { WideVisualSection } from "../_components/wide_visual_section";

export const metadata = landing_metadata({
  pathname: "/restauration-meubles",
  title:
    "Restauration de meubles anciens à Genève et Vaud, depuis 1921 | Maison Matron",
  description:
    "Vos meubles anciens réparés et restaurés par nos ébénistes, prêts à passer à vos enfants. L'atelier vient à vous, c'est offert. Visite chez vous ❊ Conseil sur votre meuble",
});

type actions_props = { tone: "paper" | "secondary" };

const Actions = ({ tone }: actions_props) => (
  <ExpertiseActions tone={tone}>
    <CallToActionDetail>Visite chez vous</CallToActionDetail>
    <CallToActionDetail>Conseil sur votre meuble</CallToActionDetail>
  </ExpertiseActions>
);

const FurnitureRestoration = () => (
  <main>
    <Hero video={null}>
      <HeroOvertitle>
        Ébénistes restaurateurs, de l'expertise chez vous à la restitution
      </HeroOvertitle>
      <HeroTitle>
        Restauration de meubles anciens à Genève et Vaud, depuis 1921
      </HeroTitle>
      <HeroLead>
        Votre meuble ancien sauvé et restauré, prêt à passer à vos enfants
      </HeroLead>
      <HeroFigures />
      <HeroClose>
        <HeroQuote>
          « Ils ont littéralement sauvé notre enfilade en teck qui avait subi
          des dommages liés à une infiltration. » - Sebastien
        </HeroQuote>
        <Actions tone="paper" />
      </HeroClose>
    </Hero>

    <Watermarked>
      <div className="page-width flex flex-col gap-24 py-12 lg:gap-32 lg:py-16 [&_:is(p,li):not(.font-display)]:text-gray-600">
        <CenteredSection>
          <SectionTitle>
            Vous cherchez à faire restaurer votre meuble ancien ?
          </SectionTitle>
          <BulletList>
            <li>Le retrouver solide et beau ?</li>
            <li>
              Qu'on s'occupe de tout pour vous, de l'expertise chez vous à la
              restauration ?
            </li>
          </BulletList>
          <SectionSubtitle>Vous êtes au bon endroit.</SectionSubtitle>
        </CenteredSection>

        <SectionSeparator />

        <HeritageSection action={<Actions tone="secondary" />} />

        <SectionSeparator />

        <WideVisualSection action={<Actions tone="secondary" />}>
          <SectionTitle>
            Transformez votre meuble ancien en pièce maîtresse de votre
            intérieur.
          </SectionTitle>
          <p>
            Nous nous occupons de tout, de l'expertise chez vous à la
            restauration, même le traitement du bois.
          </p>
          <SectionSubtitle>
            Un meuble ancien solide, et beau à nouveau
          </SectionSubtitle>
          <p>
            Une armoire, une enfilade ou le bois d'un fauteuil : nos ébénistes
            réparent et restaurent chaque meuble ancien.
          </p>
          <p>
            Chaque meuble est restauré à l'atelier, puis vous revient prêt à
            servir de nouveau.
          </p>
        </WideVisualSection>

        <SectionSeparator />

        <SideVisualSection
          visual={<FiveChairs />}
          action={<Actions tone="secondary" />}
        >
          <SectionTitle>
            Profitez aussi du dernier chaisier de Suisse
          </SectionTitle>
          <p>Nous travaillons avec lui.</p>
          <p>
            Il assemble chaque chaise à l'ancienne, dans des bois de Suisse.
          </p>
        </SideVisualSection>

        <SectionSeparator />

        <WideVisualSection action={<Actions tone="secondary" />}>
          <SectionTitle>L'atelier vient à vous, et c'est offert</SectionTitle>
          <p>
            Quel que soit votre meuble ancien, nous venons d'abord l'examiner
            chez vous.
          </p>
          <p>
            Un meuble ancien doit être vu, touché et jugé sur place, avant qu'un
            ébéniste y travaille.
          </p>
          <SectionSubtitle>
            Nous vous conseillons dans le détail
          </SectionSubtitle>
          <p>
            Chaque restauration se décide avec vous, selon l'état du bois et
            l'usage du meuble.
          </p>
          <SectionSubtitle>Nous étudions votre meuble</SectionSubtitle>
          <p>Son bois, son état, et la restauration qui lui convient.</p>
        </WideVisualSection>

        <SectionSeparator />

        <WideVisualSection action={<Actions tone="secondary" />}>
          <SectionTitle>Le processus &amp; la restitution</SectionTitle>
          <p>Nos ébénistes restaurent votre meuble à l'atelier.</p>
          <p>Nous vous tenons informé durant toute la restauration.</p>
          <p>
            Lorsque votre meuble est prêt, nous fixons avec vous le jour et
            l'heure de sa restitution.
          </p>
          <p>Enfin, nous vous rendons votre meuble :</p>
          <SectionSubtitle>
            restauré, prêt à passer à vos enfants.
          </SectionSubtitle>
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

        <BookingSection form_id="restauration-meubles">
          <SectionTitle>
            Faites-vous plaisir, c'est sans engagement
          </SectionTitle>
        </BookingSection>

        <SectionSeparator />

        <ServicesSection current="/restauration-meubles" />
      </div>
      <Footer />
    </Watermarked>
    <script type="application/ld+json">{structured_data_json}</script>
  </main>
);

export default FurnitureRestoration;
