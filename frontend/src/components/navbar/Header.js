import React, { useContext } from 'react';
import { useHistory, Link } from 'react-router-dom';

import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
// import NavDropdown from 'react-bootstrap/NavDropdown';

import UserContext from '../../context/UserContext';


export default function Header(){

    const history = useHistory();
    const { userData, setUserData } = useContext(UserContext);

    return(
        <Navbar className="color-nav" collapseOnSelect expand="lg" bg="dark" variant="dark" fixed="top">
            <Navbar.Brand><Link className="home-link" to={"/"}>Node SQL</Link></Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
            <AuthOption />
            </Navbar.Collapse>
        </Navbar>
    )

    function AuthOption(){

        // Fonction de la navbar des non connectés
        const Inscription = function(){history.push("/inscription")};
        const Connexion = function(){history.push("/connexion")};

        // Fonctions de la navbar des admins
        const Admin = function(){history.push("/admin")};

        // Fonctions de la navbar des connectés (admins compris)
        const PageAccueilProfil = function(){history.push("/profil")};

        const Deconnexion = function(){
          setUserData({
              token: undefined,
              membre: undefined,
          });
          localStorage.setItem("auth-token", "");
          localStorage.setItem("id-pour-notifications", "");
          history.push("/");
        };
    
        if(userData.membre){
            return(
                <>
                <Nav className="mr-auto">
                </Nav>
                <Nav>
                {userData.membre.test && (
                    <Nav.Link onClick={Admin}>Admin</Nav.Link>
                )}
                {/* <NavDropdown title={userData.membre.prenom} id="collasible-nav-dropdown">
                    <NavDropdown.Item onClick={AfficherToutMonProfil}>Profil</NavDropdown.Item>
                    <NavDropdown.Item onClick={HistoriqueAchats}>Mes achats</NavDropdown.Item>
                    <NavDropdown.Divider />
                </NavDropdown> */}
                <Nav.Link onClick={PageAccueilProfil}>{userData.membre.prenom}</Nav.Link> 
                <Nav.Link onClick={Deconnexion}>Déconnexion</Nav.Link>
                </Nav>
                </>
            )
        }
        if(!userData.membre){
            return(
                <>
                <Nav className="mr-auto"></Nav>
                <Nav>
                    <Nav.Link onClick={Inscription}>Inscription</Nav.Link>
                    <Nav.Link onClick={Connexion}>Connexion</Nav.Link>
                </Nav>
                </>
            )
        }
    }
}