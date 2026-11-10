// Credit corrections for the Changes page.
//
// Some early commits were saved with "Claude" as the git author, even though a
// person asked for and directed the work. This list credits those commits to
// the right person on the Changes page, where they also get a "with Claude" tag.
// The GitHub history itself is not rewritten: the original author is still
// visible on GitHub, and this file records each correction openly.
//
// Key: full commit hash. Value: the person to credit.
// Only add entries for past commits. New commits should be authored correctly
// in the first place (see "Change tracker" in CLAUDE.md).

export const creditOverrides: Record<string, string> = {
  // Credited to Alex Gorcik on 2026-11-10, at Alex's request.
  '1cd7d586bb204b46aafc3439ed529e4177daa180': 'Alex Gorcik', // Add CLAUDE.md with project instructions
  '07f2d811dfde3ad231b01734d299a03e9380355e': 'Alex Gorcik', // Show newest updates first, format dates
  '198fb3a780d6d039c27af2910bb2af8c43dcccc1': 'Alex Gorcik', // Link Google Drive folder to assets page
  'e6a1757c9f824fccfcbf640de7f53abdfa95c2d3': 'Alex Gorcik', // Add sweet spot calculator script
  'ca44af319272a106a08aaa69e26c55fa618b981b': 'Alex Gorcik', // Add assets page and file storage structure
  '8ddfecf850ad4d6fdf8017e90e672cec64abf1f6': 'Alex Gorcik', // Fix subpage routing
  '4c259730e9d3faf3d0f47d185661a55fbd45325e': 'Alex Gorcik', // Fix deploy: npm install
  '0dc0231470a991613253426117392f556917d850': 'Alex Gorcik', // Update README
  'c03fe06b84ff7ee141716e6c694e1669e328bf60': 'Alex Gorcik', // Initial scaffolding
};
