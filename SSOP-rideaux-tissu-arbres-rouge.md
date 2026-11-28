# SSOP rideaux-tissu-arbres-rouge

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| Photo du tissu aux arbres sur fond rouge | `24102026-IMG_1508-2.jpg` de l'humain, 2160 x 2700, inchangée | `public/visuals/tissu-arbres-rouge.jpg` | le recadrage ImageMagick, `-crop 2160x1440+0+720`, hors du code | JPEG 2160 x 1440, sRGB, qualité 90, 4:4:4 | une photo agrandie au-delà de la définition de la source |
| Taille déclarée du visuel | `identify` sur le fichier exporté | `width` et `height` de `Image` dans `RedTreePrint` | le chemin `src`, `width` et `height` écrits une fois dans `visuals.tsx` | `{ src: "/visuals/tissu-arbres-rouge.jpg"; width: 2160; height: 1440 }` | une taille déclarée différente de celle du fichier, image déformée ou décalage de mise en page |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| `tissu-arbres-rouge.jpg` | la photo source | aucun | le visuel 3:2 | `public/visuals/tissu-arbres-rouge.jpg` |
| `RedTreePrint` | `tissu-arbres-rouge.jpg`, `Image` | aucun | une `figure` du tissu | `src/app/_components/visuals.tsx` |
| `/rideaux-sur-mesure` | `RedTreePrint` à la place de `GenoaVelvet` | aucun | la page | `src/app/rideaux-sur-mesure/page.tsx` |

Edges : `tissu-arbres-rouge.jpg` dans `RedTreePrint`, `RedTreePrint` dans le `visual` de « L'atelier vient à vous, et c'est offert ».

1. `tissu-arbres-rouge.jpg`
2. `RedTreePrint`
3. `/rideaux-sur-mesure`

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `RedTreePrint` dans `visuals.tsx` | la photo du tissu, son cadrage, sa taille et son alt | rien : aucun prop, elle rend une `figure` pleine largeur |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| aucun état | - | - | - |
