/**
 * Reading Mode layout — suppresses the Navbar and BottomNav visually.
 *
 * In Next.js App Router, nested layouts are composed inside the root layout,
 * so the root layout's Navbar and BottomNav are still in the DOM. This layout
 * adds a CSS class to the body that hides those nav elements, giving a
 * distraction-free reading experience.
 *
 * Requirements: 5.2
 */
export default function ReadingModeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/*
        Inject a <style> tag that hides the global Navbar and BottomNav
        while this layout is active. The reading page itself renders as a
        full-screen fixed overlay, so the nav elements are covered anyway,
        but this ensures they don't receive focus or appear in the a11y tree.
      */}
      <style>{`
        /* Hide root layout nav elements in reading mode */
        body > div header,
        body > div nav[aria-label="Mobile navigation"] {
          display: none !important;
        }
      `}</style>
      {children}
    </>
  )
}
