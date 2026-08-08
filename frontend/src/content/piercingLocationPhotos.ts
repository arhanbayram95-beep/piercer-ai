import { ImageSourcePropType } from 'react-native';
import { PiercingLocationId } from './piercingLocations';

// Real reference photos for the locations where a tasteful, confidently
// identifiable, properly-licensed match exists — see
// frontend/assets/piercing-diagrams/SOURCES.md for each photo's source URL
// and license (all Pexels, free for commercial use). Deliberately a
// Partial: most locations have no entry here and fall back to
// PiercingDiagram's vector illustration instead (see PiercingVisual.tsx) —
// stock photography rarely labels which specific ear-cartilage hole is
// which, so a location only gets a photo when the source photo's own
// caption/title names that exact piercing, not just "ear piercings"
// generally. `require()` calls must stay static (no computed paths) for
// Metro's bundler to resolve them.
export const PIERCING_LOCATION_PHOTOS: Partial<Record<PiercingLocationId, ImageSourcePropType>> = {
  lobe: require('../../assets/piercing-diagrams/lobe.jpg'),
  septum: require('../../assets/piercing-diagrams/septum.jpg'),
  nostril: require('../../assets/piercing-diagrams/nostril.jpg'),
  eyebrow: require('../../assets/piercing-diagrams/eyebrow.jpg'),
  bridge: require('../../assets/piercing-diagrams/bridge.jpg'),
  navel: require('../../assets/piercing-diagrams/navel.jpg'),
  tongue: require('../../assets/piercing-diagrams/tongue.jpg'),
  philtrumMedusa: require('../../assets/piercing-diagrams/philtrumMedusa.jpg'),
};
