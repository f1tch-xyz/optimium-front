import type { NextPage } from 'next';
import { Fragment, useState } from 'react';
import HomePage from '../components/HomePage/HomePage';
import NavBar from '../components/NavBar/NavBar';
import Link from 'next/link'
import Forge from './forge';
import Pool from './pool';
import Regulation from './regulation';
import Epoch from './epoch';
import UniswapPool from './trade';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

const Home = ({ user }: { user: string }) => {

  return (
    <>
      <HomePage user={user} />
    </>
  );
};

export default Home;
