import HomePage from '../components/HomePage/HomePage';

const Home = ({ user }: { user: string }) => {

  return (
    <>
      <HomePage user={user} />
    </>
  );
};

export default Home;
