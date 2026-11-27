# SSOP sur-mesure

## Shapes

| Data | Origin | Destination | Boundary | Shape | Illegal state it forbids |
| ---- | ------ | ----------- | -------- | ----- | ------------------------ |
| Page metadata | `src/app/sur-mesure/page.tsx` | `landing_metadata` | the `landing_page` parameter | `{ pathname: service_path; title: string; description: string }` | a canonical pointing to a route that does not exist |
| Current service | `src/app/sur-mesure/page.tsx` | `ServicesSection` | the `current` prop | `service_path` | the page listing itself among the other services |

## Order

| Produces | Needs | Parameters | Returns | File |
| -------- | ----- | ---------- | ------- | ---- |
| `/sur-mesure` | every section of `src/app/_components/`, `FiveChairs`, `CurtainWrappedGifts`, `landing_metadata` | none | the page | `src/app/sur-mesure/page.tsx` |

Edges: every shared section, unchanged, into the page.

1. `/sur-mesure`

## Checks

| Module | Change it confines | What a caller must know |
| ------ | ------------------ | ----------------------- |
| `/sur-mesure` | the copy of the custom furniture service and which visual sits in each slot | nothing: it is a route |

## Ownership

| Fact | Owner | Readers | Writer |
| ---- | ----- | ------- | ------ |
| The phone number shown | `ExpertiseActions`, unchanged | the page | `ExpertiseActions` |

## Amendments
