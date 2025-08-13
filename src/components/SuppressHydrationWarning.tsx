'use client';

import { useEffect, useState } from 'react';

export function SuppressHydrationWarning({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : <div suppressHydrationWarning>{children}</div>;
}

export default SuppressHydrationWarning;
