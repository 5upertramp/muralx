import Navbar from '@/components/Navbar';
import CommissionCard from '@/components/CommissionCard';

const mockCommissions = [
  { title: 'Landscape Painting', description: 'Serene mountains and lake.', status: 'open' },
  { title: 'Modern Portrait', description: 'Vibrant oil portrait.', status: 'inProgress' },
  { title: 'Abstract Art', description: 'Colorful geometric shapes.', status: 'completed' },
  { title: 'Cityscape Sketch', description: 'Busy streets at sunset.', status: 'open' },
  { title: 'Fantasy Illustration', description: 'Dragons and castles.', status: 'inProgress' },
  { title: 'Still Life', description: 'Fruits and vases.', status: 'completed' },
  { title: 'Digital Character', description: 'Concept art for games.', status: 'open' },
  { title: 'Watercolor Flowers', description: 'Soft pastel blossoms.', status: 'completed' },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        fontFamily: "sans-serif",
        padding: "2rem"
      }}>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          width: '100%',
          maxWidth: '900px'
        }}>
          {mockCommissions.map((c, idx) => (
            <CommissionCard key={idx} {...c} />
          ))}
        </div>
      </main>
    </>
  );
}
