# SSOP rideaux-hero-damas-ivoire

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| Image du rideau en damas ivoire | `2026-11-28-matron-img-rideaux-bbad2e25-….png` validée par l'humain, 2752 x 1536, inchangée | `public/visuals/rideau-damas-ivoire.jpg` | la conversion ImageMagick, une fois, hors du code, sans recadrage | JPEG 2752 x 1536, sRGB, qualité 90, 4:4:4 | une image recadrée ou agrandie au-delà de ce que l'humain a validé |
| Place de l'image dans le hero | `IvoryDamaskCurtain` | le slot `video` de `Hero`, `section` en `relative overflow-hidden` | `fill` et `object-cover` sur `Image` | `{ src: "/visuals/rideau-damas-ivoire.jpg"; fill: true; preload: true; sizes: "100vw" }` | une image de hero qui laisse un vide dans la section, ou qui se charge après le reste de la page |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| `rideau-damas-ivoire.jpg` | l'image source | aucun | le visuel 2752 x 1536 | `public/visuals/rideau-damas-ivoire.jpg` |
| `IvoryDamaskCurtain` | `rideau-damas-ivoire.jpg`, `Image` | aucun | une `Image` qui couvre son parent positionné | `src/app/_components/visuals.tsx` |
| `/rideaux-sur-mesure` | `IvoryDamaskCurtain` à la place de `OceanView`, `Hero` inchangé | aucun | la page | `src/app/rideaux-sur-mesure/page.tsx` |

Edges : `rideau-damas-ivoire.jpg` dans `IvoryDamaskCurtain`, `IvoryDamaskCurtain` dans le slot `video` de `Hero`.

1. `rideau-damas-ivoire.jpg`
2. `IvoryDamaskCurtain`
3. `/rideaux-sur-mesure`

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `IvoryDamaskCurtain` dans `visuals.tsx` | l'image du hero des rideaux, sa taille, son chargement prioritaire et son alt | son parent est positionné, comme la `section` de `Hero` |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| aucun état | - | - | - |
