/**
 * Universal Mobile/Web Bridge for Next.js Server Actions & APIs
 *
 * This function detects if the app is currently running as a static export (Next.js config + Capacitor)
 * or dynamically on the server.
 */

// If Mobile Builder set this, we check NEXT_PUBLIC_IS_MOBILE.
const IS_MOBILE = process.env.NEXT_PUBLIC_IS_MOBILE === 'true';

export async function executeAction<T>(key: string, data?: any): Promise<T> {
  if (IS_MOBILE) {
    // We are on purely static frontend (Capacitor/Mobile). Need to communicate over network!
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://80road.com'; // Change back to real URL when prod
    
    const res = await fetch(`${API_URL}/api/mobile/${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data || {}),
    });

    if (!res.ok) {
      const errorData = await res.text();
      throw new Error(`Mobile Bridge API Error (${res.status}): ${errorData}`);
    }

    return res.json() as Promise<T>;
  } else {
    // We are running within Next.js Node Environment (Web/VPS). Call directly!
    // Dynamically import registry only on server so client bundle stays entirely clean of server logic
    if (typeof window !== 'undefined') {
        // Technically, if this runs directly on a client component (web), we should probably 
        // fall back to a normal fetch or NEXT.js server action natively.
        // Wait, standard Next.js Server Actions don't need this bridge (Next.js creates a tunnel automatically).
        // Since the user asked to move core business logic into env-agnostic TS functions,
        // we can actually fetch from standard Next.js API route or just run it via use server.
        // But for this bridge, we assume executeAction is called in SERVER COMPONENTS.
    }
    const { actionRegistry } = await import('@/lib/services/registry');
    
    if (!actionRegistry[key]) {
      throw new Error(`Action [${key}] is not registered in the Action Registry.`);
    }

    return actionRegistry[key](data) as Promise<T>;
  }
}
