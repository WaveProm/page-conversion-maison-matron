# SSOP canapes-processus-ciseaux-cuir

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| Vidéo des ciseaux dans le cuir | `696428_Craftsperson Hand Working Craft_By_Raven_Production_Artlist_HD.mp4`, H.264 1920 x 1080, 25 i/s, 5,52 s, avec son, inchangée | `public/visuals/ciseaux-cuir.mp4` | l'encodage ffmpeg, une fois, hors du code, la vidéo entière | H.264 High, yuv420p, bt709, libx264 preset slow CRF 22, faststart, sans piste son | une vidéo de section qui porte une piste son, ou un passage qui montre un visage |
| Poster de la vidéo | la première image de la source | `public/visuals/ciseaux-cuir-poster.jpg`, importé | l'import statique, résolu par le bundler | `StaticImageData` 1920 x 1080 | une vidéo sans taille connue avant son chargement |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| `ciseaux-cuir.mp4`, `ciseaux-cuir-poster.jpg` | la vidéo source | aucun | la vidéo et son poster | `public/visuals/` |
| `ScissorsThroughLeather` | les deux fichiers, `AutoplayVideo` | aucun | une `figure` de la vidéo, démarrée à l'entrée à l'écran, en boucle | `src/app/_components/visuals.tsx` |
| `/canapes` | `ScissorsThroughLeather` à la place de `LouisPhilippeSofa` | aucun | la page | `src/app/canapes/page.tsx` |

Edges : les fichiers dans `ScissorsThroughLeather`, `ScissorsThroughLeather` dans le `visual` de « Le processus & la restitution ».

1. `ciseaux-cuir.mp4`, `ciseaux-cuir-poster.jpg`
2. `ScissorsThroughLeather`
3. `/canapes`

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `ScissorsThroughLeather` dans `visuals.tsx` | la vidéo des ciseaux, son poster et son label | rien : aucun prop, elle rend une `figure` pleine largeur |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| lecture de la vidéo, refus, déblocage | `AutoplayVideo`, inchangé | la vidéo de la section | `AutoplayVideo` |
