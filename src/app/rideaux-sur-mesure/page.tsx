import { landing_metadata } from "@/lib/landing_metadata";
import { structured_data_json } from "@/lib/structured_data";
import { BookingSection } from "../_components/booking_section";
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
import { ReviewsSection } from "../_components/reviews_section";
import { SectionSeparator } from "../_components/section_separator";
import { SideVisualSection } from "../_components/side_visual_section";
import {
  Initials,
  Quote,
  Reviewer,
  SectionSubtitle,
  SectionTitle,
} from "../_components/typography";
import {
  CopperCurtains,
  CurtainWrappedGifts,
  GenoaVelvet,
} from "../_components/visuals";
import { Watermarked } from "../_components/watermarked";
import { WideVisualSection } from "../_components/wide_visual_section";

export const metadata = landing_metadata({
  pathname: "/rideaux-sur-mesure",
  title: "Rideaux sur mesure à Genève et Vaud, depuis 1921 | Maison Matron",
  description:
    "Vos rideaux sur mesure dans les plus beaux tissus, cousus par nos courtepointières et posés chez vous. L'atelier vient à vous, c'est offert. Visite chez vous ❊ Conseil sur vos tissus",
});

const Actions = () => (
  <ExpertiseActions tone="secondary">
    <CallToActionDetail>Visite chez vous</CallToActionDetail>
    <CallToActionDetail>Conseil sur vos tissus</CallToActionDetail>
  </ExpertiseActions>
);

const CustomCurtains = () => (
  <main>
    <Hero
      video="/video/rideaux-sur-mesure-hero.mp4"
      poster="/video/rideaux-sur-mesure-hero-poster.avif"
    >
      <HeroOvertitle>
        Tapissiers et courtepointières, de la visite à la pose
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
        <ExpertiseActions tone="paper">
          <CallToActionDetail>Visite chez vous</CallToActionDetail>
          <CallToActionDetail>Conseil sur vos tissus</CallToActionDetail>
        </ExpertiseActions>
      </HeroClose>
    </Hero>

    <Watermarked>
      <div className="page-width flex flex-col gap-24 py-12 lg:gap-32 lg:py-16 [&_:is(p,li):not(.font-display)]:text-gray-600">
        <CenteredSection>
          <SectionTitle>
            Vous cherchez les rideaux à votre image, or…
          </SectionTitle>
          <p>L'enseigne décide jusqu'où va votre « sur-mesure ».</p>
          <p>Le tissu se choisit sur un échantillon, loin de vos fenêtres.</p>
          <p>La pose des rails et des tringles vous reste sur les bras.</p>
        </CenteredSection>

        <SectionSeparator />

        <HeritageSection action={<Actions />} />

        <SectionSeparator />

        <WideVisualSection action={<Actions />}>
          <SectionTitle>
            Transformez votre salon avec des rideaux en tissu Pierre Frey, à vos
            mesures.
          </SectionTitle>
          <p>
            Nos tissus d'éditeur et le travail de nos courtepointières
            transforment vos fenêtres.
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

        <FabricsSection visual={<CopperCurtains />} action={<Actions />} />

        <SectionSeparator />

        <WideVisualSection visual={<GenoaVelvet />} action={<Actions />}>
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

        <WideVisualSection action={<Actions />}>
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

        <SideVisualSection
          visual={<CurtainWrappedGifts />}
          action={<Actions />}
        >
          <SectionTitle>Black Friday : 15 % sur tous les tissus</SectionTitle>
          <SectionSubtitle>
            Choisissez le tissu de vos rideaux parmi des milliers : il vous
            coûte 15 % de moins.
          </SectionSubtitle>
        </SideVisualSection>

        <SectionSeparator />

        <ReviewsSection
          title={
            <SectionTitle>Ils nous ont confié leur intérieur</SectionTitle>
          }
        >
          <figure>
            <blockquote>
              <Quote>
                « Des conseils avisés, une superbe sélection de tissus et un
                savoir-faire minutieux. Nous sommes ravis de nos nouvelles
                chaises et nous ferons sans aucun doute à nouveau appel à M.
                Matron. »
              </Quote>
            </blockquote>
            <Reviewer>
              <Initials>AG</Initials>Anne-Claude Gavin
            </Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Nous avons remis 6 chaises de salon pour mettre une nouvelle
                tapisserie et sommes très satisfaits du résultat. Prix
                raisonnable, tissu de qualité, finitions impeccables, livraison
                dans les (courts) délais et un contact très agréable et
                professionnel. Nous pouvons recommander Tapissier Matron. »
              </Quote>
            </blockquote>
            <Reviewer>
              <Initials>SS</Initials>stephan suter
            </Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Grand professionnalisme sans oublier une bienveillance et
                sympathie exceptionnelles. »
              </Quote>
            </blockquote>
            <Reviewer>
              <Initials>M</Initials>MP
            </Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Je recommande Monsieur Matron qui a effectué une très jolie
                restauration sur mon fauteuil. Travail au top »
              </Quote>
            </blockquote>
            <Reviewer>
              <Initials>TM</Initials>Tony Mellard
            </Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Je recommande M. Matron, il a restauré mon fauteuil, le
                travail est parfait. »
              </Quote>
            </blockquote>
            <Reviewer>
              <Initials>TB</Initials>Trévis Bontemps
            </Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Très bon service, bonne écoute du client, patience le temps
                que le choix soit établi, livraison conforme aux attentes et
                travail très propre. »
              </Quote>
            </blockquote>
            <Reviewer>
              <Initials>SG</Initials>Santiago Girardbille
            </Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Je ne puis que recommander la Maison Matron qui est une belle
                entreprise familiale. De bon conseil avec un travail soigné et
                de qualité. Absolument ravie du rendu concernant un vieux
                fauteuil de famille alors n'hésitez pas et prenez rapidement
                contact avec eux. Avec mes bonnes salutations. A. Berniguet »
              </Quote>
            </blockquote>
            <Reviewer>
              <Initials>AB</Initials>Annick Berniguet
            </Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « De sincères remerciements à la famille Matron pour leur
                intervention. Ils ont littéralement sauvé notre enfilade en teck
                qui avait subi des dommages liées à une infiltration. »
              </Quote>
            </blockquote>
            <Reviewer>
              <Initials>SC</Initials>Sebastien Coussieu
            </Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>
                « Bon contact et bonne expertise. Mon fauteuil a maintenant un
                tissu magnifique ! Il commence sa seconde vie !! Merci. Je
                recommande cet artisan. »
              </Quote>
            </blockquote>
            <Reviewer>
              <Initials>AL</Initials>aline loiseau
            </Reviewer>
          </figure>
          <figure>
            <blockquote>
              <Quote>« Superbe travail !!! Merci »</Quote>
            </blockquote>
            <Reviewer>
              <Initials>GA</Initials>Ginguene Anne
            </Reviewer>
          </figure>
        </ReviewsSection>

        <SectionSeparator />

        <BookingSection form_id="rideaux-sur-mesure">
          <SectionTitle>
            Recevez nos tissus chez vous, la visite est offerte.
          </SectionTitle>
        </BookingSection>
      </div>
      <Footer />
    </Watermarked>
    <script type="application/ld+json">{structured_data_json}</script>
  </main>
);

export default CustomCurtains;
