# sql-node-express-react

Les fichiers sont dans la branche master

MAJ du 21/06/2021:

Optimisation: modification du component de l'achat immédiat afin qu'il puisse être réutilisé pour le panier.

Ajout du panier:
    - Le bouton panier dans le détail du produit est désormais fonctionnel
    - Si l'utilisateur n'est pas connecté quand il clique sur le panier, il sera automatiquement redirigé vers la page de connexion. Une fois connecté, il sera redirigé sur le détail du produit qu'il souhaitait ajouter à son panier
    - Quand il ajoute un article au panier, un message en vert lui indique que l'ajout est fait avec un lien pour le diriger vers le détail de son panier. Il peut soit le suivre, soit continuer à naviguer sur le site comme bon lui semble.
    - Il pourra aussi accéder à son panier via le lien vers son profil dans la navbar. A partir de son panier, il pourra augmenter ou diminuer le nombre d'articles qu'il souhaite prendre ou supprimer un article en mettant une quantité de zéro. Il peut modifier la quantité de tous les produits en une seule fois et le montant total sera mis à jour à chaque modification validée. Il ne pourra pas valider son panier si il est en cours de modification.
    - A partir du panier, il pourra alors le valider. Une vérification sera faite dans le backend à ce moment pour vérifier, si depuis qu'il a mit ses articles dans le panier, il y toujours en stock la quantité demandée et si le produit est toujours proposé à la vente. S'il y a des erreurs, tous les problèmes apparaiteront sur un seul message avec une explication adaptée, quelque soit le nombre d'erreur. Il sera alors invité à réajuster la quantité ou supprimer le produit s'il n'est plus en vente.
    - Si le membre peut validé l'étape ci-dessus, il sera dirigé vers une nouvelle page pour procéder au paiement. Il pourra alors choisir le mode de paiement, le type de livraison et, comme pour l'achat immédiat, modifier son adresse de livraison sur la même page s'il a besoin de le faire. Quand il validera son achat, comme on ne peut pas savoir le temps qu'il a passé sur cet écran et l'évolution que le stock a pu avoir, la vérification des stocks sera relancée avant de valider l'achat.
    i Tous les achats du panier apparaiteront alors sur son historique d'achat. Il n'y a pas de présentation particulière entre un achat fait en direct ou via le panier mais tous ceux effectués via le panier auront exactement la même date d'achat.

Mon Intention
Ceci est l'ébauche un site commercial dont le seul but a été de tester l'utilisation de mySQL avec Node. J'ai aussi utilisé express pour le backend et react pour le frontend.

En ce qui concerne le frontend j'ai repris en partie ce que j'avais fais lors de mon stage de fin de formation pour me consacrer principalement à l'association node/sql. J'ai quand même tenté sans y passer trop de temps d' améliorer certaines choses par rapport mon précédent projet:
    - L'id du membre ne transite jamais par la barre d'adresse pour plus de sécurité.
    - J'ai un peu plus utilisé de fonctions que j'ai créée et qui allaient être réutilisées plusieurs fois (commme GetToken())
    - J'ai un peu plus utilisé de component de "base". C'est le même component qui permet de créer le contenu de chaque menu déroulant dans la partie administrateur par exemple.
      - Je n'avais jamais utilisé d'images pour un site, je me suis servi de Cloudinary pour leur enregistrement et leur affichage
      - J'ai fait le strict minium pour le CSS, le but était seulement que ce soit propre et même si j'utilise Bootstrap, je n'ai pas cherché à travailler l'affichage sur différentes taille d'écran. Je ne voulais pas passer trop de temps dessus.

En ce qui concerne le backend, le but était d'apprendre à utiser node avec sql et d'améliorer les connaissances avec mySQL que je n'avais pas utilisé de façon aussi poussée lors de ma formation.
        - J'ai fait en sorte que l'administrateur n'ai jamais à utiliser de ligne de commande mySQL: la création de la base de donnée et des différentes tables se fait automatiquement et au moment opportun afin qu'il n'y ait aucun message d'erreur
        - J'utilise différentes relations entre les tables (one to many, many to many). J'ai un peu "triché" sur le retour des données au front car je n'arrivais pas à avoir un rendu comme celui de mongoDB. J'ai créé des fonctions afin de modifier le résultat obtenu dans le backend pour avoir un rendu équivalante au populate de mongo en ce qui concerne l'affichage du produit. Par contre, pour l'historique des achats j'ai utilisé, de façon plus classique, le join et je retravaille l'affichage dans la fonction map de React pour un rendu plus propre. J'ai préféré laisser ces 2 méthodes plutôt que d'en utiliser qu'une seule.

Les fonctionnalités du site
Pour un utilisateur:
        - Il peut s'inscrire.
        - Il peut accéder à l'ensemble des pages du site: il peut consulter la page d'accueil, voir les produits qui y apparaissent, faire une recherche de produit et voir les images des produits, leur desciption et disponibilité. S'il rest moins de 10 exemplaire, un message indiquera qu'il n'y a plus que quleques exemplaires disponibles, qu'il n'en reste qu'un seul si c'est le cas et s'il n'y en a plus, le bouton acheter n'apparaîtera plus et un message spécifique apparaîtera.
        -  Il ne peut pas effectuer d'achat, s'il clique sur le bouton "Acheter cet article", on lui proposera soit de se connecter, soit de s'inscrire. Une fois fait, il sera redirigé vers l'article qu'il souhaite acheter.
Pour un membre:
        - Quand il s'incrit sur le site, le nouveau membre peut effectuer des achats directs. Lors de la validation de son achat, il choisi le mode de paiement et d'envoi parmi ceux qui sont proposés et la quantité souhaitée qui est limitée au stock disponible. Il a aussi la possibilité, sur le même écran de modifier son adresse. Quand l'achat est validé le stock du produit diminue en fonction du nombre d'unités achetées.
        - Il peut se connecter et se déconnecter, modifier son profil.
        - Il peut consulter son profil en cliquant sur son nom dans la navbar. Il peut alors voir et modifier ses données ainsi que consulter son historique d'achat s'il en a fait. Il peut, à partir de son historique d'achat, racheter un produit, s'il est toujours en vente ou que le stock le permet.
Pour un administrateur:
        - Il peut ajouter des nouveaux produits avec des photos associées. Le nom du produit est unique. Il peut aussi modifier les produit une fois créé: modifier le prix, quantité, nom, description... et le mettre retirer de la vente (indépendamment du stock) pour qu'il n'apparaisse plus dans les recherches.
        - Il peut rechercher un produit et classer le résultat par nom, prix, quantité, date de création, nombre de vue, nombre de vente en ordre croissant ou décroissant. Le nombre de vue augmente à chaque fois qu'un membre consulte le détail du produit
        - Il peut créer un nouvel administrateur.
Fonctionnalitées à venir:
        - Création d'un panier pour l'utilisateur qui pourra en une fois, acheter plusieurs articles différents avec la possibilité de gérer son panier: modifier la quantité, supprimer un produit, transférer dans sa liste d'envie
        - Création d'un liste d'envie à laquelle on pourra ajouter des produits toujours en vente mais qui n'ont pas de stock, transférer un produit de la liste vers le panier ou supprimer un article de la liste.
        - Des statistiques plus précises pour l'administrateur: ventes sur une période, nombre d'articles en vente, plus en vente, stock...
        - Mise en place par l'administrateur de promotions limitées dans le temps ou par le nombre d'exemplaire.
Mode d'emploi
Le site utilise Cloudinary, il vous faudra donc créer un compte sur cloudinary.com
J'utilise des fichiers .env pour certaines données qu'il faudra créer:
        - Dans le frontend pour Cloudinary, il vous faudra donc une variable nommée: REACT_APP_CLOUDINARY_NAME avec le nom de votre compte.
        - Dans le backend, les données relatives à votre base de données SQL avec les noms de variable: HOST, USER, PASSWORD et DATABASE, au Json Web Token: JWT_SECRET et à Cloudinary: CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_FILE.
Seul le premier membre créé aura le statut d'administrateur. Tous les autres membres ne seront que de simples utilisateurs. Si vous souhaitez créer un autre administrateur, vous pouvez le faire à partir de la section qui lui est dédiée
Afin que le site soit utilisable par un membre, l'administrateur doit créer le contenu des menus déroulants pour le mode de paiement, de livraison et la catégorie. Il ne pourra pas ajouter un produit avant que cela ne soit fait, la création de produit n'apparaitera quand au moins une donnée pour chacune de ces 3 catégories existera. De même, vous pouvez les supprimer mais pas tous, il en restera au moins un pour chaque catégorie.
