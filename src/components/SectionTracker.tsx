'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function SectionTracker() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Extract section from URL path
    const section = pathname === '/' 
      ? 'home' 
      : pathname.split('/')[1];
    
    // Set the section as a data attribute on the document element
    document.documentElement.setAttribute('data-section', section);
  }, [pathname]);
  
  return null;
}