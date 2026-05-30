
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


export default function ProfilePage({ params }) {
  const { username } = params;
  
  return (
    <main>
      <h1>প্রোফাইল: {username}</h1>
    </main>
  );
}