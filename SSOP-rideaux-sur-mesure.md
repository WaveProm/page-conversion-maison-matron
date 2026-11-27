# SSOP rideaux-sur-mesure

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| Photo or poster of a visual | `public/visuals/`, `public/video/` | `Image`, `video`, `AutoplayVideo` | static import, resolved by the bundler at build | `StaticImageData` | a visual whose file is missing or whose size is unknown |
| Hero video and poster | `public/video/` | `Hero` | the two string props of `Hero`, typed `` `/video/${string}` `` | `hero_props` | a hero video served from outside `public/video/` |
| Phone number shown | `ExpertiseActions` | each `CallToAction` to the phone, rewritten in the browser by the Google tag | none: written once in the markup | `` `tel:${string}` `` | two pages, or two sections, showing two different numbers |
| Page metadata | each `page.tsx` | `landing_metadata` | the `landing_page` parameter | `{ pathname: "/" \| "/rideaux-sur-mesure"; title: string; description: string }` | a canonical pointing to a route that does not exist |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| `ExpertiseActions` | `CallToAction`, `CallToActions`, `CallToActionDetails` | `{ tone: "paper" \| "secondary"; children }` | the two calls to action and their details | `src/app/_components/expertise_actions.tsx` |
| `Hero`, `HeroOvertitle`, `HeroTitle`, `HeroLead`, `HeroFigures`, `HeroClose`, `HeroQuote` | `Frame`, `Quote`, `SectionSubtitle` | `{ video; poster; children }`, `{ children }` | the hero, its copy column given by the page | `src/app/_components/hero.tsx` |
| `HeritageSection` | `SideVisualSection`, typography | `{ action }` | « Maison Matron, artisan depuis 4 générations » and its archive photo | `src/app/_components/heritage_section.tsx` |
| `FabricsSection` | `SideVisualSection`, `LogoGrid`, typography | `{ visual; action }` | « Profitez de milliers de tissus » and the nine fabric houses | `src/app/_components/fabrics_section.tsx` |
| visuals | `Image`, `AutoplayVideo` | none | one `figure` per visual of the site | `src/app/_components/visuals.tsx` |
| `BookingSection` | `LeadSheet`, `Field` | `{ form_id; children }` | the booking form, its title given by the page | `src/app/_components/booking_section.tsx` |
| `Initials` | none | `{ children }` | a reviewer's initials | `src/app/_components/typography.tsx` |
| `landing_metadata` | `opengraph_image_path` | `landing_page` | `Metadata` | `src/lib/landing_metadata.ts` |
| `/` | every section, visuals, `landing_metadata` | none | the page | `src/app/page.tsx` |
| `/rideaux-sur-mesure` | every section, visuals, `landing_metadata` | none | the page | `src/app/rideaux-sur-mesure/page.tsx` |

Edges: `ExpertiseActions` into `Hero`'s children and every `action`; visuals into every `visual`; every section into both pages.

1. `ExpertiseActions`, `Initials`, `landing_metadata`, visuals
2. `Hero`, `HeritageSection`, `FabricsSection`, `BookingSection`
3. `/`, then `/rideaux-sur-mesure`

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `ExpertiseActions` | the label of the expertise button, its anchor, the phone number | the tone of the background it stands on; the details are its children |
| `Hero` | the hero's video frame, veil, blur, logo, flag and column | the video and poster paths; the copy column is its children, in the order overtitle, title, lead, figures, close |
| `HeritageSection` | the house's history section, identical on every page | the action under it |
| `FabricsSection` | the fabric houses section, identical on every page | the visual beside it and the action under it |
| visuals | which file, alt text and size each visual carries | the name of the visual |
| `BookingSection` | the form's fields, labels and send button | the form id and the title |
| `landing_metadata` | the share image, robots and Open Graph shape | the page's path, title and description |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| The phone number shown | `ExpertiseActions` | every page | `ExpertiseActions` in the server render, then the Google tag's callback in the browser |
| A video blocked by the browser | `AutoplayVideo`, unchanged | its button | `play_in_view` |

## Amendments
- Chaque page tient un `Actions` local qui compose `ExpertiseActions` avec ses deux détails, écrits une fois par page.
- `FabricsSection` prend `visual` en option : sans visuel, `SideVisualSection` montre son fond noir.
- Patch 003 : `ReviewsSection` tient les dix avis de / et reçoit son titre en children ; `Initials` sort.
- Patch 003 : `OfferSection` et `OfferTitle`, l'offre spéciale en plein écran, la vidéo en fond, le titre et l'action en overlay.
- Patch 003 : `ServicesSection`, les pages de service écrites une fois, la page courante exclue par `current`.
- Patch 003 : `AutoplayVideo` est le seul module vidéo ; `framing` sépare la vidéo de fond, `cover` et décorative, son poster un chemin de `public/video/`, de la vidéo de section, son label et son poster importé qui la dimensionne ; Turbopack n'importe pas l'AVIF.
- Patch 003 : `Hero` prend sa vidéo en slot, donnée par `visuals.tsx`.
- Patch 006 : `AutoplayVideo` prend `eager` : la vidéo à l'écran dès l'arrivée, le hero, démarre nativement au chargement par `autoPlay`, sans `preload`, et garde `play_in_view` pour le refus, le geste et la reprise.
