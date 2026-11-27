import Image from "next/image";
import { AutoplayVideo } from "@/components/autoplay_video";
import five_chairs from "../../../public/visuals/5-chaises.jpg";
import lion_head_sofa from "../../../public/visuals/canape-lions.jpg";
import club_armchair from "../../../public/visuals/club-armchair.jpg";
import louis_philippe_sofa from "../../../public/visuals/louis-philippe.jpg";
import reel_poster from "../../../public/visuals/maison-matron-reel-poster.jpg";
import copper_curtains from "../../../public/visuals/rideaux-cuivres-salon.jpg";
import genoa_velvet from "../../../public/visuals/velours-gene.jpg";
import voltaire_poster from "../../../public/visuals/voltaire-orbital-macro-poster.jpg";

export const MaisonMatronHero = () => (
  <AutoplayVideo
    src="/video/maison-matron-hero.mp4"
    poster="/video/maison-matron-hero-poster.avif"
    cover
    eager
  />
);

export const OceanView = () => (
  <AutoplayVideo
    src="/video/rideaux-sur-mesure-hero.mp4"
    poster="/video/rideaux-sur-mesure-hero-poster.avif"
    cover
    eager
  />
);

export const FiveChairs = () => (
  <figure>
    <Image
      src={five_chairs}
      alt="Une petite chaise laquée blanc au dossier enroulé et quatre chaises traîneau en bois, garnies d'un même tissu bleu à motif de cercles, sur fond blanc."
      sizes="100vw"
    />
  </figure>
);

export const MaisonMatronReel = () => (
  <figure>
    <AutoplayVideo
      src="/visuals/maison-matron-reel.mp4"
      poster={reel_poster}
      label="Des chaises en bois garnies d'un tissu bleu, puis un velours rouge à motifs floraux, sous le logo Maison Matron 1921 ; une femme en tailleur blanc assise dans un fauteuil club, avec la phrase « La Haute Couture, pour vos meubles. » ; le logo Maison Matron sur fond noir."
    />
  </figure>
);

export const GenoaVelvet = () => (
  <figure>
    <Image
      src={genoa_velvet}
      alt="Gros plan d'un velours de Gênes à motif floral : roses et boutons rose corail, feuillage vert sombre en relief, sur fond blanc."
      sizes="100vw"
    />
  </figure>
);

export const LouisPhilippeSofa = () => (
  <figure>
    <Image
      src={louis_philippe_sofa}
      alt="Canapé Louis-Philippe en bois sculpté, dossier couronné d'une palmette et accoudoirs en volute, garni d'un tissu ivoire à rayures bordeaux et petits bouquets de fleurs, sur fond blanc."
      sizes="100vw"
    />
  </figure>
);

export const LionHeadSofa = () => (
  <figure>
    <Image
      src={lion_head_sofa}
      alt="Canapé en bois sombre aux accoudoirs roulés terminés par des têtes de lion sculptées, garni d'un tissu orangé à fines rayures crème, sur fond blanc."
      sizes="(min-width: 1024px) 50vw, 100vw"
    />
  </figure>
);

export const VoltaireOrbitalMacro = () => (
  <figure>
    <AutoplayVideo
      src="/visuals/voltaire-orbital-macro.mp4"
      poster={voltaire_poster}
      label="Un fauteuil Voltaire en bois clair, garni d'un tissu gris à feuillage de velours jaune d'or, puis un gros plan de ce tissu."
    />
  </figure>
);

export const ClubArmchair = () => (
  <figure>
    <Image
      src={club_armchair}
      alt="Une femme en tailleur blanc et bottines noires, assise jambes croisées dans un fauteuil club blanc aux accotoirs de bois sombre bordés de clous, sur fond blanc."
      sizes="100vw"
    />
  </figure>
);

export const CopperCurtains = () => (
  <figure>
    <Image
      src={copper_curtains}
      alt="Deux grands rideaux dans un tissu cuivré à motif de chevrons, suspendus à une tringle à œillets sous une charpente apparente, derrière un fauteuil et une table basse en bois."
      sizes="(min-width: 1024px) 50vw, 100vw"
    />
  </figure>
);

export const CurtainWrappedGifts = () => (
  <AutoplayVideo
    src="/video/curtain-wrapped-gifts.mp4"
    poster="/video/curtain-wrapped-gifts-poster.jpg"
    cover
  />
);
