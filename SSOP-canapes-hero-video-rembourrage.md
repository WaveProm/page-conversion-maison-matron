# SSOP canapes-hero-video-rembourrage

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| Vidéo du hero | `hf_20260907_150810_21dca341-….mp4`, HEVC 10 bits 1920 x 1080, 24 i/s, 8 s, avec son, inchangée | `public/video/canapes-hero.mp4` | l'encodage ffmpeg, une fois, hors du code | H.264 High, yuv420p, bt709, libx264 preset slow CRF 22, faststart, sans piste son | une vidéo de hero qui porte une piste son ou un codec que Safari ne lit pas |
| Poster du hero | la première image de la source | `public/video/canapes-hero-poster.avif` | l'export ImageMagick, une fois | AVIF 1920 x 1080 | un poster qui ne montre pas l'image sur laquelle la vidéo démarre |
| Image du Chesterfield | `2026-11-28-matron-img-canapes-21f2548f-….png` validée par l'humain, 2752 x 1536, inchangée | `public/visuals/canape-chesterfield-cuir.jpg` | la conversion ImageMagick, sans recadrage | JPEG 2752 x 1536, sRGB, qualité 90, 4:4:4 | une image recadrée au-delà de ce que l'humain a validé |
| Ancre du rembourrage | le lien annexe Google Ads du groupe Canapés, `/canapes#rembourrage` | la section « Le processus & la restitution » | l'attribut `id` d'un `div` autour de la section, comme `#tissu` et `#cuir` | `id="rembourrage"` présent une fois sur la page | un lien annexe qui mène à une ancre absente |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| `canapes-hero.mp4`, `canapes-hero-poster.avif` | la vidéo source | aucun | la vidéo et son poster | `public/video/` |
| `canape-chesterfield-cuir.jpg` | l'image source | aucun | le visuel 16:9 | `public/visuals/` |
| `TuftedLeatherSalon` | `canapes-hero.mp4`, `canapes-hero-poster.avif`, `AutoplayVideo` | aucun | la vidéo de fond, `cover` et `eager` | `src/app/_components/visuals.tsx` |
| `OxbloodChesterfield` | `canape-chesterfield-cuir.jpg`, `Image` | aucun | une `figure` pleine largeur | `src/app/_components/visuals.tsx` |
| `/canapes` | `TuftedLeatherSalon`, `OxbloodChesterfield`, `WideVisualSection` | aucun | la page | `src/app/canapes/page.tsx` |

Edges : les fichiers dans leurs deux visuels, les deux visuels dans la page.

1. `canapes-hero.mp4`, `canapes-hero-poster.avif`, `canape-chesterfield-cuir.jpg`
2. `TuftedLeatherSalon`, `OxbloodChesterfield`
3. `/canapes`

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `TuftedLeatherSalon` dans `visuals.tsx` | la vidéo du hero des canapés, son poster et son démarrage | rien : aucun prop, elle couvre son parent positionné |
| `OxbloodChesterfield` dans `visuals.tsx` | l'image du canapé en cuir, sa taille et son alt | rien : aucun prop, elle rend une `figure` pleine largeur |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| lecture de la vidéo, refus, déblocage | `AutoplayVideo`, inchangé | la vidéo du hero | `AutoplayVideo` |
