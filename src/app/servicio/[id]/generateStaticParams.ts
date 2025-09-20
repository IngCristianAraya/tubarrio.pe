import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function generateStaticParams() {
  try {
    // Obtener todos los servicios de Firestore
    const servicesRef = collection(db, 'services');
    const querySnapshot = await getDocs(servicesRef);
    
    // Mapear los IDs de los servicios para generar las rutas estáticas
    const paths = querySnapshot.docs.map((doc) => ({
      id: doc.id,
    }));

    console.log(`Generating static paths for ${paths.length} services`);
    return paths;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
