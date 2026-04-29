// // app/layout.tsx
// import './globals.css';
// import { ReactNode } from 'react';
// import AccessibilityControls from '../components/AccessibilityControls';

// export const metadata = {
//   title: 'Accessibility First Recipe Reader',
//   description: 'A recipe reader designed for everyone, including users with disabilities.',
// };

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
//         {/* <a href="#main-content" className="skip-link">
//           Skip to main content
//         </a> */}

//         <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200">
//           <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
//             <div className="flex justify-between items-center h-16">
//               <div className="flex items-center space-x-2">
//                 <div className="text-3xl" role="img" aria-label="Recipe book emoji">📖</div>
//                 <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
//                   AccessibleRecipes
//                 </span>
//               </div>

//               <ul className="flex space-x-1 sm:space-x-4">
//                 <li>
//                   <a href="/" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200 font-medium">
//                     Home
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/recipes" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200 font-medium">
//                     All Recipes
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/about" className="px-3 py-2 rounded-lg text-gray-700 hover:bg-primary hover:text-white transition-colors duration-200 font-medium">
//                     About
//                   </a>
//                 </li>
//               </ul>

//               <AccessibilityControls />
//             </div>
//           </nav>
//         </header>

//         <main id="main-content" tabIndex={-1} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {children}
//         </main>

//         <footer className="bg-gray-900 text-white mt-20">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div>
//                 <h2 className="text-xl font-bold mb-4">About This Project</h2>
//                 <p className="text-gray-300">
//                   Designed with HCI principles and WCAG 2.1 AA standards for maximum accessibility.
//                 </p>
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold mb-4">Accessibility Features</h2>
//                 <ul className="space-y-2 text-gray-300">
//                   <li>✓ Keyboard Navigation</li>
//                   <li>✓ Screen Reader Compatible</li>
//                   <li>✓ High Contrast Mode</li>
//                   <li>✓ Resizable Text</li>
//                 </ul>
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold mb-4">Quick Links</h2>
//                 <ul className="space-y-2">
//                   <li><a href="/accessibility" className="text-gray-300 hover:text-primary transition-colors">Accessibility Statement</a></li>
//                   <li><a href="/feedback" className="text-gray-300 hover:text-primary transition-colors">Send Feedback</a></li>
//                 </ul>
//               </div>
//             </div>
//             <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//               <p>© 2025 Accessible Recipe Reader — Designed for everyone</p>
//             </div>
//           </div>
//         </footer>
//       </body>
//     </html>
//   );
// }








// // app/layout.tsx
// import './globals.css';
// import { ReactNode } from 'react';
// import AccessibilityControls from '../components/AccessibilityControls';

// export const metadata = {
//   title: 'Accessibility First Recipe Reader',
//   description: 'A recipe reader designed for everyone, including users with disabilities.',
// };

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="en">
//       <body className="min-h-screen">
//         {/* <a href="#main-content" className="skip-link">
//           Skip to main content
//         </a> */}

//         <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg">
//           <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
//             <div className="flex justify-between items-center h-16">
//               <div className="flex items-center space-x-2">
//                 <div className="text-3xl" role="img" aria-label="Recipe book emoji">🍽️</div>
//                 <span className="text-xl font-bold gradient-text">
//                   AccessibleRecipes
//                 </span>
//               </div>

//               <ul className="flex space-x-1 sm:space-x-4">
//                 <li>
//                   <a href="/" className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-600 hover:text-white transition-colors duration-200 font-medium">
//                     Home
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/recipes" className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-600 hover:text-white transition-colors duration-200 font-medium">
//                     All Recipes
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/about" className="px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-purple-600 hover:text-white transition-colors duration-200 font-medium">
//                     About
//                   </a>
//                 </li>
//               </ul>

//               <AccessibilityControls />
//             </div>
//           </nav>
//         </header>

//         <main id="main-content" tabIndex={-1} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {children}
//         </main>

//         <footer className="bg-gray-900/95 backdrop-blur-sm text-white mt-20">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div>
//                 <h2 className="text-xl font-bold mb-4">About This Project</h2>
//                 <p className="text-gray-300">
//                   Designed with HCI principles and WCAG 2.1 AA standards for maximum accessibility.
//                 </p>
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold mb-4">Accessibility Features</h2>
//                 <ul className="space-y-2 text-gray-300">
//                   <li>✓ Keyboard Navigation</li>
//                   <li>✓ Screen Reader Compatible</li>
//                   <li>✓ High Contrast Mode</li>
//                   <li>✓ Resizable Text</li>
//                 </ul>
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold mb-4">Quick Links</h2>
//                 <ul className="space-y-2">
//                   <li><a href="/accessibility" className="text-gray-300 hover:text-purple-400 transition-colors">Accessibility Statement</a></li>
//                   <li><a href="/feedback" className="text-gray-300 hover:text-purple-400 transition-colors">Send Feedback</a></li>
//                 </ul>
//               </div>
//             </div>
//             <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
//               <p>© 2025 Accessible Recipe Reader — Designed for everyone</p>
//             </div>
//           </div>
//         </footer>
//       </body>
//     </html>
//   );
// }





// // app/layout.tsx
// 'use client';

// import './globals.css';
// import { ReactNode, useState, useEffect } from 'react';
// import AccessibilityControls from '../components/AccessibilityControls';

// export default function RootLayout({ children }: { children: ReactNode }) {
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   return (
//     <html lang="en" className="h-full">
//       <body className="bg-background text-foreground antialiased h-full">
//         <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:shadow-lg">
//           Skip to main content
//         </a>

//         <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
//           <nav className="container mx-auto px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
//             <div className="flex justify-between items-center h-16">
//               <div className="flex items-center space-x-2">
//                 <span className="text-3xl" role="img" aria-label="Recipe book">🍽️</span>
//                 <span className="text-xl font-bold text-primary">
//                   AccessibleRecipes
//                 </span>
//               </div>

//               <ul className="flex space-x-1 sm:space-x-4">
//                 <li>
//                   <a href="/" className="px-3 py-2 rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200 font-medium">
//                     Home
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/recipes" className="px-3 py-2 rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200 font-medium">
//                     All Recipes
//                   </a>
//                 </li>
//                 <li>
//                   <a href="/about" className="px-3 py-2 rounded-lg text-foreground hover:bg-primary hover:text-primary-foreground transition-colors duration-200 font-medium">
//                     About
//                   </a>
//                 </li>
//               </ul>

//               {mounted && <AccessibilityControls />}
//             </div>
//           </nav>
//         </header>

//         <main id="main-content" tabIndex={-1} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           {children}
//         </main>

//         <footer className="bg-card text-card-foreground mt-20 border-t border-border">
//           <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//               <div>
//                 <h2 className="text-xl font-bold mb-4">About This Project</h2>
//                 <p className="text-muted-foreground">
//                   Designed with HCI principles and WCAG 2.1 AA standards for maximum accessibility.
//                 </p>
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold mb-4">Accessibility Features</h2>
//                 <ul className="space-y-2 text-muted-foreground">
//                   <li>✓ Keyboard Navigation</li>
//                   <li>✓ Screen Reader Compatible</li>
//                   <li>✓ High Contrast Mode</li>
//                   <li>✓ Resizable Text</li>
//                   <li>✓ Dyslexia-Friendly Mode</li>
//                   <li>✓ Reduce Motion Support</li>
//                 </ul>
//               </div>
//               <div>
//                 <h2 className="text-xl font-bold mb-4">Quick Links</h2>
//                 <ul className="space-y-2">
//                   <li><a href="/accessibility" className="text-muted-foreground hover:text-primary transition-colors">Accessibility Statement</a></li>
//                   <li><a href="/feedback" className="text-muted-foreground hover:text-primary transition-colors">Send Feedback</a></li>
//                 </ul>
//               </div>
//             </div>
//             <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
//               <p>© 2025 Accessible Recipe Reader — Designed for everyone</p>
//             </div>
//           </div>
//         </footer>
//       </body>
//     </html>
//   );
// }








// app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import AccessibilityControls from '@/components/AccessibilityControls';

export const metadata = {
  title: 'Accessibility First Recipe Reader',
  description: 'A recipe reader designed for everyone, including users with disabilities.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-amber-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg">
          Skip to main content
        </a>

        {/* Header with Accessibility Controls */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-amber-200 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍽️</span>
                <span className="text-xl font-bold text-amber-700">AccessibleRecipes</span>
              </div>

              {/* Navigation */}
              <nav aria-label="Main navigation">
                <ul className="flex gap-4">
                  <li><a href="/" className="text-gray-700 hover:text-amber-600 transition-colors">Home</a></li>
                  <li><a href="/#recipes" className="text-gray-700 hover:text-amber-600 transition-colors">Recipes</a></li>
                  <li><a href="/about" className="text-gray-700 hover:text-amber-600 transition-colors">About</a></li>
                </ul>
              </nav>

              {/* Accessibility Controls - A+, A, and Eye buttons */}
              <AccessibilityControls />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main id="main-content" tabIndex={-1} className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white mt-20">
          <div className="container mx-auto px-4 py-8 text-center">
            <p>© 2025 Accessible Recipe Reader — Designed for everyone</p>
          </div>
        </footer>
      </body>
    </html>
  );
}