# Piercing reference photo sources

Real reference photos for `PiercingReferenceScreen`/`PiercingDetailScreen`,
supplementing (not replacing) the vector diagrams in
`PiercingDiagram.tsx` — see `frontend/src/content/piercingLocationPhotos.ts`
for how a location maps to a photo file here, falling back to the vector
diagram when a location has none.

**Licensing:** all images below are from Pexels, under the [Pexels
License](https://www.pexels.com/license/) — free for commercial and
personal use, no attribution legally required (credited below anyway, as
good practice for real licensed content). Only Unsplash/Pexels/Pixabay were
considered, per the app's licensing constraint; Unsplash and Pixabay
searches for the remaining locations below didn't turn up a confidently-
identifiable, appropriately-licensed match and were skipped rather than
guessing.

Each file was downloaded at full resolution from Pexels' own CDN
(`images.pexels.com`), then locally resized (longest edge 800px) and
re-compressed (JPEG quality 78) to keep the app bundle small — the resize
step does not change licensing, only file size.

| Location ID | File | Pexels photo page | Photographer |
|---|---|---|---|
| `lobe` | `lobe.jpg` | https://www.pexels.com/photo/persons-ear-with-silver-stud-earring-7479508/ | Angela Roma |
| `septum` | `septum.jpg` | https://www.pexels.com/photo/brunette-woman-with-septum-piercing-21849471/ | Kenneth Surillo |
| `nostril` | `nostril.jpg` | https://www.pexels.com/photo/headshot-of-a-person-wearing-silver-stud-nose-piercing-12435650/ | Amaria |
| `eyebrow` | `eyebrow.jpg` | https://www.pexels.com/photo/eyebrow-piercing-in-close-up-view-16744733/ | _ofarias g |
| `bridge` | `bridge.jpg` | https://www.pexels.com/photo/a-woman-with-a-nose-bridge-piercing-8165864/ | Jessika Figueiredo |
| `navel` | `navel.jpg` | https://www.pexels.com/photo/person-with-navel-piercing-4224435/ | McCutcheon |
| `tongue` | `tongue.jpg` | https://www.pexels.com/photo/trendy-woman-with-pierced-tongue-and-sunglasses-29400911/ | Wolrider |
| `philtrumMedusa` | `philtrumMedusa.jpg` | https://www.pexels.com/photo/a-woman-with-a-philtrum-piercing-5940900/ | Antonio Friedemann |

## Locations checked but left on the vector diagram

Every other location in `piercingLocations.ts` was searched on
Unsplash/Pexels/Pixabay (ear cartilage sub-types first, since that's where
photos are most likely to be mislabeled or ambiguous). None had a
confidently identifiable, specifically-captioned match — most "ear
piercing" stock photos show several piercings at once without naming which
hole is which, so assigning one to e.g. "rook" specifically would be a
guess dressed up as a citation. `nipple` was excluded from search entirely
per the app's conservative scope, same boundary the vector-diagram catalog
already respects.

Left on `PiercingDiagram`: `upperLobe`, `helix`, `forwardHelix`, `tragus`,
`antiTragus`, `rook`, `daith`, `conch`, `snug`, `industrial`, `orbital`,
`flat`, `auricle`, `highNostril`, `labret`, `monroe`, `cheekDimple`,
`nefertiti`, `rhino`, `nasallang`, `verticalLabret`, `antiEyebrow`,
`nipple`, `surface`, `dermal`, `nape`, `hip`.
