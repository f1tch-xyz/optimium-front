import type { NextPage } from 'next';
import { useState } from 'react';
import HomePage from '../components/HomePage/HomePage';
import NavBar from '../components/NavBar/NavBar';
import Link from 'next/link'
import { Route, Router, Routes } from 'react-router-dom';
import Forge from './forge';
import Liquidity from './liquidity';

const Home: NextPage = () => {

  const [hasWeb3, setHasWeb3] = useState(false)
  const [user, setUser] = useState('') // the current connected user

  return (
    <>
      <NavBar hasWeb3={hasWeb3} user={user} setUser={setUser} />
      <Liquidity user={user} />
    </>
  );
};

export default Home;
