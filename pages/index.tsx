import type { NextPage } from 'next';
import WhackAMole from '../components/WhackAMole';

const Home: NextPage = () => {
  return (
    <div className="container mx-auto px-4">
      <WhackAMole />
    </div>
  );
};

export default Home;