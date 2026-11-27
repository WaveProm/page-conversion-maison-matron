import type { ReactNode } from "react";
import { Quote, Reviewer } from "./typography";

type reviews_section_props = { children: ReactNode };

export const ReviewsSection = ({ children }: reviews_section_props) => (
  <section className="copy-inset flex min-h-svh flex-col justify-center">
    <div className="md:mx-auto md:w-full md:max-w-[600px] lg:max-w-[1100px]">
      {children}
      <div className="mt-12 lg:mt-16 lg:columns-2 lg:gap-16 [&>figure]:mb-12 [&>figure]:break-inside-avoid lg:[&>figure]:mb-16 [&>figure:last-child]:mb-0">
        <figure>
          <blockquote>
            <Quote>
              « Des conseils avisés, une superbe sélection de tissus et un
              savoir-faire minutieux. Nous sommes ravis de nos nouvelles chaises
              et nous ferons sans aucun doute à nouveau appel à M. Matron. »
            </Quote>
          </blockquote>
          <Reviewer>- Anne-Claude</Reviewer>
        </figure>
        <figure>
          <blockquote>
            <Quote>
              « Nous avons remis 6 chaises de salon pour mettre une nouvelle
              tapisserie et sommes très satisfaits du résultat. Tissu de
              qualité, finitions impeccables, livraison dans les (courts) délais
              et un contact très agréable et professionnel. Nous pouvons
              recommander Tapissier Matron. »
            </Quote>
          </blockquote>
          <Reviewer>- Stephan</Reviewer>
        </figure>
        <figure>
          <blockquote>
            <Quote>
              « Grand professionnalisme sans oublier une bienveillance et
              sympathie exceptionnelles. »
            </Quote>
          </blockquote>
          <Reviewer>- MP</Reviewer>
        </figure>
        <figure>
          <blockquote>
            <Quote>
              « Je recommande Monsieur Matron qui a effectué une très jolie
              restauration sur mon fauteuil. Travail au top. »
            </Quote>
          </blockquote>
          <Reviewer>- Tony</Reviewer>
        </figure>
        <figure>
          <blockquote>
            <Quote>
              « Je recommande M. Matron, il a restauré mon fauteuil, le travail
              est parfait. »
            </Quote>
          </blockquote>
          <Reviewer>- Trévis</Reviewer>
        </figure>
        <figure>
          <blockquote>
            <Quote>
              « Très bon service, bonne écoute du client, patience le temps que
              le choix soit établi, livraison conforme aux attentes et travail
              très propre. »
            </Quote>
          </blockquote>
          <Reviewer>- Santiago</Reviewer>
        </figure>
        <figure>
          <blockquote>
            <Quote>
              « Je ne puis que recommander la Maison Matron qui est une belle
              entreprise familiale. De bon conseil avec un travail soigné et de
              qualité. Absolument ravie du rendu concernant un vieux fauteuil de
              famille, alors n'hésitez pas et prenez rapidement contact avec
              eux. »
            </Quote>
          </blockquote>
          <Reviewer>- Annick</Reviewer>
        </figure>
        <figure>
          <blockquote>
            <Quote>
              « De sincères remerciements à la famille Matron pour leur
              intervention. Ils ont littéralement sauvé notre enfilade en teck
              qui avait subi des dommages liés à une infiltration. »
            </Quote>
          </blockquote>
          <Reviewer>- Sebastien</Reviewer>
        </figure>
        <figure>
          <blockquote>
            <Quote>
              « Bon contact et bonne expertise. Mon fauteuil a maintenant un
              tissu magnifique ! Il commence sa seconde vie ! Merci. Je
              recommande cet artisan. »
            </Quote>
          </blockquote>
          <Reviewer>- Aline</Reviewer>
        </figure>
        <figure>
          <blockquote>
            <Quote>« Superbe travail ! Merci. »</Quote>
          </blockquote>
          <Reviewer>- Anne</Reviewer>
        </figure>
      </div>
    </div>
  </section>
);
