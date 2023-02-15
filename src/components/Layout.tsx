import styled from '@emotion/styled'
import React from 'react';
import mk_logo from '../img/Mortal-Kombat-Logo.png'
const NavBar = styled.nav`
  background-color: black;
  height: 76px;
  width: 100%;
  display: flex;
  justify-content: center;
  
  margin-bottom: 60px;
  
  img{
    position: absolute;
    height: 90px;
    width: 160px;
    margin-top: 32px;
  }
`

const BodyContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  flex-wrap: wrap;
  h1{
    text-align: center;
  }
`


const Layout: React.FC<{children: React.ReactNode}> = ({children}) => {
    return(
        <div>
            <NavBar>
                <img src={mk_logo} alt="Logo"/>
            </NavBar>
            <BodyContainer>
            {children}
            </BodyContainer>
        </div>
    )
}
export default Layout;