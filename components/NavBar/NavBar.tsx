import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAccount } from 'wagmi';
import Style from './NavBar.module.scss';
import Link from 'next/link'

type NavbarProps = {
    hasWeb3: boolean
    user: string
    setUser: Function
}

const NavBar = ({ hasWeb3, user, setUser }: NavbarProps) => {

    const { address, isConnected } = useAccount();
    if (isConnected) {
        setUser(address)
    }

    return (
        <>
            <div
                style={{
                    borderTop: '1px solid black',
                    backgroundColor: 'none',
                    textAlign: 'center',
                    height: '128px',
                    width: '100%',
                    fontSize: '14px',
                }}
            >
                <div className={Style.nav_wrapper}>
                    <div style={{ display: 'flex' }}>
                        <Link
                            href="/"
                            style={{ marginRight: '16px', height: '80px' }}
                        >
                            LOGO
                        </Link>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div className={Style.hide_links}>
                            <LinkButton title="Forge" to="/forge" />
                            <LinkButton title="Liquidity" to="/pool/" />
                            <LinkButton title="Regulation" to="/regulation/" />
                            <LinkButton title="Epoch" to="/epoch/" />
                            <LinkButton title="Trade" to="/trade/" />
                            <LinkButton title="Coupons" to="/coupons/" />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <ConnectButton chainStatus="none" showBalance={false} />
                    </div>
                </div>
            </div>
        </>
    )
}

type linkButtonProps = {
    title: string
    to: string
}

function LinkButton({ title, to }: linkButtonProps) {
    return (
        <Link
            href={{ pathname: `${to}` }}>
            <span style={{ display: 'block', padding: '1%', fontSize: '17px' }}>
                {title}
            </span>
        </Link>
    )
}

export default NavBar