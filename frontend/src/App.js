import './App.css';
import './scss/custom.scss';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import UserContext from './context/UserContext';
import Requete from './middlewares/Requete';
import Header from './components/navbar/Header'; // Barre de navigation

// Import pour la page d'accueil
import Home from './components/home/Home';

// Import pour les membres
import CreerMembre from './components/membre/Inscription';
import Connexion from './components/membre/Connexion';
import PageAccueilProfil from './components/membre/donnees/PageAcceuilProfil';
// import AfficherProfilConnecte from './components/membre/donnees/AfficherProfilConnecte';
// import HistoriqueAchatsMembre from './components/membre/donnees/HistoriqueAchat';
import VerifierMotDePasse from './components/membre/VerifierMotDePasseAvantModifProfil';
import ModifierProfil from './components/membre/Modifier';

// Imports pour l'administrateur
import AdminHomePage from './components/admin/home/HomeAdmin';

// Imports pour les menus déroulants
import AjouterModePaiement from './components/admin/contenuMenusDeroulants/modePaiement/Ajouter';
import ModifierModePaiement from './components/admin/contenuMenusDeroulants/modePaiement/Modifier';
import SupprimerModePaiement from './components/admin/contenuMenusDeroulants/modePaiement/Supprimer';

import AjouterModeLivraison from './components/admin/contenuMenusDeroulants/modeLivraison/Ajouter';
import ModifierModeLivraison from './components/admin/contenuMenusDeroulants/modeLivraison/Modifier';
import SupprimerModeLivraison from './components/admin/contenuMenusDeroulants/modeLivraison/Supprimer';

import AjouterCategorieProduits from './components/admin/contenuMenusDeroulants/categoriesProduits/Ajouter';
import ModifierCategorieProduits from './components/admin/contenuMenusDeroulants/categoriesProduits/Modifier';
import SupprimerCategorieProduits from './components/admin/contenuMenusDeroulants/categoriesProduits/Supprimer';

import CreerAdmin from './components/admin/administrateur/Creer';

import MessageAccueilDansNouvellePage from './components/admin/messagePageAccueil/LireMessageNouvellePage';

// Imports pour les produits (administrateur)
import AjouterProduit from './components/admin/produits/Ajouter';
import AfficherUnProduit from './components/admin/produits/afficherUn';
import ModifierProduit from './components/admin/produits/ModifierUn';
import AfficherTousLesProduitsPourAdmin from './components/admin/produits/AfficherTous';
import RetirerOuRemettreProduitEnVente from './components/admin/produits/RetirerOuRemettreEnVente';

// Imports pour les produits (utilisateurs)
import ResultatRecherche from './components/produit/ResultatRecherche';
import AfficherUnPourUtilisateur from './components/produit/AfficherUn';

// Import pour les achats
import AchatImmediat from './components/achat/AchatDirect';

// Import pour l'historique d'achat
import DetailHistoriqueAchats from './components/historiqueAchats/Detail';

// Imports pour le panier
import ValiderModifierPanier from './components/panier/ValiderModifierPanier';
import FinaliserPaiementPanier from './components/panier/PayerPanier';

export default function App() {

  const [userData, setUserData] = useState({
    userData: undefined,
    setUserData: undefined,
  });

  useEffect(function(){ // Quand l'application se lancera, useEffect sera tout de suite utilisée

    const checkLoggedIn = async function(){ // useEffect est une fonction synchrone, mais comme le backend est asynchrone, il faut une fonction asynchrone
      let token = localStorage.getItem("auth-token");
      if(token === null){ // S'il n'y a pas de token dans le local storage, cela crée une erreur. Avec ce if, cela nous permet de lui attribuer une valeur et d'éviter une erreur s'il est null
        localStorage.setItem("auth-token", "");
        token = "";
      }

      const tokenRes = await Requete.post(
        "/membres/tokenValide",
        null, //on rajoute null car la requête est un post et que le body est vide
        { headers: { "x-auth-token": token } }
      );
      if(tokenRes.data){ // Si le token est valide, on récupère les données du membre
        const membreRes = await Requete.get(
          "/membres/",
          { headers: { "x-auth-token": token } },
        );
        console.log("membreRes: ", membreRes);
        setUserData({ // Comme on a vérifié le token auparavant, on sait que l'on trouvera un membre
          token,
          membre: membreRes.data,
        });
       }
    }
    checkLoggedIn();
  
  }, []);

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />

          <Route path="/inscription" component={CreerMembre} />
          <Route path="/connexion" component={Connexion} />
          <Route path="/profil" component={PageAccueilProfil} />
          {/* <Route path="/profilMembre" component={AfficherProfilConnecte} /> */}
          <Route path="/membres/verifier-mdp" component={VerifierMotDePasse} />
          <Route path="/membres/modifier" component={ModifierProfil} />
          {/* <Route path="/historiqueAchats" component={HistoriqueAchatsMembre} /> */}

          <Route exact path="/admin" component={AdminHomePage} />
          <Route path="/admin/menusDeroulants/modePaiement/ajouter" component={AjouterModePaiement} />
          <Route path="/admin/menusDeroulants/modePaiement/modifier/:id" component={ModifierModePaiement} />
          <Route path="/admin/menusDeroulants/modePaiement/supprimer/:id" component={SupprimerModePaiement} />
          <Route path="/admin/menusDeroulants/modeLivraison/ajouter" component={AjouterModeLivraison} />
          <Route path="/admin/menusDeroulants/modeLivraison/modifier/:id" component={ModifierModeLivraison} />
          <Route path="/admin/menusDeroulants/modeLivraison/supprimer/:id" component={SupprimerModeLivraison} />
          <Route path="/admin/menusDeroulants/categorieProduits/ajouter" component={AjouterCategorieProduits} />
          <Route path="/admin/menusDeroulants/categorieProduits/modifier/:id" component={ModifierCategorieProduits} />
          <Route path="/admin/menusDeroulants/categorieProduits/supprimer/:id" component={SupprimerCategorieProduits} />
          <Route path="/admin/message-accueil" component={MessageAccueilDansNouvellePage} />

          <Route path="/admin/produit/ajouter" component={AjouterProduit} />
          <Route path="/admin/produit/afficherTous" component={AfficherTousLesProduitsPourAdmin} />
          <Route path="/admin/produit/afficherUn/:id" component={AfficherUnProduit} />
          <Route path="/admin/produit/modifier-un/:id" component={ModifierProduit} />
          <Route path="/admin/produit/retirer-ou-remettre/:id" component={RetirerOuRemettreProduitEnVente} />

          <Route path="/admin/creer-administrateur" component={CreerAdmin} />

          <Route path="/produit/:recherche" component={ResultatRecherche} />
          <Route path="/recherche/afficherUn/:id/:recherche" component={AfficherUnPourUtilisateur} />

          <Route path="/achat-direct/:produitId" component={AchatImmediat} />

          <Route path="/historique-achats" component={DetailHistoriqueAchats} />

          <Route path="/panier/valider-modifier" component={ValiderModifierPanier} />
          <Route path="/panier/finaliser-paiement" component={FinaliserPaiementPanier} />


        </Switch>
      </UserContext.Provider>
    </BrowserRouter>
  );
}