// Standalone Jest mock for react-native-safe-area-context. The package's
// own jest/mock.tsx internally calls jest.requireActual('react-native-...')
// to reach the real context objects — routing that back through this same
// moduleNameMapper entry (which is how it gets loaded in the first place)
// makes requireActual resolve to this mock again instead of the real
// module, breaking useContext. Simplest fix is a self-contained mock that
// never needs the real module: most screens/components here only read
// insets (never a live device frame), so a fixed zero-inset object is
// enough for every test in this repo.
const React = require('react');

const ZERO_INSETS = { top: 0, right: 0, bottom: 0, left: 0 };
const ZERO_FRAME = { x: 0, y: 0, width: 320, height: 640 };

module.exports = {
  SafeAreaProvider: ({ children }) => children,
  SafeAreaInsetsContext: React.createContext(ZERO_INSETS),
  SafeAreaFrameContext: React.createContext(ZERO_FRAME),
  useSafeAreaInsets: () => ZERO_INSETS,
  useSafeAreaFrame: () => ZERO_FRAME,
  initialWindowMetrics: { insets: ZERO_INSETS, frame: ZERO_FRAME },
};
