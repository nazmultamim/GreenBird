import { UserProfile } from '@clerk/nextjs'



export async function generateMetadata({ params }) { 
  const { username } = params;

  return {
    title: `${username} Profile`,
    description: `${username}- Profile`,
    openGraph: {
      title: `${username} | Profile Green Bird`,
      description: `${username}- Profile`,
      images: [`/api/og?username=${username}`], 
    },
  };
}


export default function ProfilePage() {
  
  return (
    <main>
     <UserProfile />
    </main>
  );
}