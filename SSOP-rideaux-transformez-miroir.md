# SSOP rideaux-transformez-miroir

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| Image du rideau en damas noir | `2026-11-28-matron-img-rideaux-da-76e1372d-….png` validée par l'humain, 2752 x 1536, inchangée | `public/visuals/rideau-damas-noir.jpg` | ImageMagick, une fois, hors du code : `-flop` puis la conversion web, sans recadrage | JPEG 2752 x 1536, miroir gauche-droite, sRGB, qualité 90, 4:4:4 | une image publiée dans le sens de la source, ou recadrée |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| `rideau-damas-noir.jpg` | l'image source | aucun | le visuel 16:9 en miroir | `public/visuals/rideau-damas-noir.jpg` |
| `BlackDamaskCurtain` | `rideau-damas-noir.jpg`, `Image` | aucun | une `figure` pleine largeur | `src/app/_components/visuals.tsx` |
| `/rideaux-sur-mesure` | `BlackDamaskCurtain` à la place de `TerracottaVelvetCurtains` | aucun | la page | `src/app/rideaux-sur-mesure/page.tsx` |

Edges : `rideau-damas-noir.jpg` dans `BlackDamaskCurtain`, `BlackDamaskCurtain` dans le `visual` de « Transformez vos pièces avec des rideaux à votre image. ».

1. `rideau-damas-noir.jpg`
2. `BlackDamaskCurtain`
3. `/rideaux-sur-mesure`

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `BlackDamaskCurtain` dans `visuals.tsx` | l'image du rideau en damas noir, son sens, sa taille et son alt | rien : aucun prop, elle rend une `figure` pleine largeur |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| aucun état | - | - | - |
