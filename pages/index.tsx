import type { NextPage } from 'next';
import { useState } from 'react';
import HomePage from '../components/HomePage/HomePage';
import NavBar from '../components/NavBar/NavBar';
import Link from 'next/link'
import { Route, Router, Routes } from 'react-router-dom';
import Forge from './Forge';
import Pool from './Pool';
import Regulation from './Regulation';
import Epoch from './Epoch';

const Home: NextPage = () => {

  const [hasWeb3, setHasWeb3] = useState(false)
  const [user, setUser] = useState('') // the current connected user

  return (
    <>
      <NavBar hasWeb3={hasWeb3} user={user} setUser={setUser} />
      {/* <Pool user={user} /> */}
      {/* <Regulation user={user} /> */}
      <Epoch user={user} />
    </>
  );
};

export default Home;
