# Zakaria Boukhris — Portfolio

Portfolio personnel d’un élève ingénieur en cinquième année à l’EMSI, spécialisé en **cybersécurité, systèmes et DevSecOps**.

Le site présente mon parcours, mes expériences, mes projets et mes certifications, dans une interface responsive disponible en français et en anglais.

## Projets présentés

| Projet | Domaine |
| --- | --- |
| SIEM Wazuh | Centralisation des journaux, détection et réponse aux incidents dans un laboratoire isolé |
| Pipeline DevSecOps | Contrôles de sécurité du code, de l’infrastructure et des images Docker |
| Gestion du matériel | Application Django de gestion des équipements et des demandes |
| Gestion de restaurant | Application Django de réservation, commandes et facturation |
| DentalTech | Services métier et accès aux données en Java, JDBC et MySQL |
| Plateforme e-learning | Application C# / ASP.NET Core MVC pour les cours et la progression |

Les études de cas précisent le contexte, les collaborations et le périmètre de chaque réalisation. Les dépôts disponibles sont accessibles depuis le site.

## Fonctionnalités

- Présentation du profil, des compétences, des stages et de la formation.
- Mise en avant des projets Wazuh et DevSecOps.
- Consultation des certifications et du CV en PDF.
- Navigation par sections et menu adapté aux petits écrans.
- Changement de langue français / anglais.
- Décor WebGL animé, étoiles et interactions à la souris.
- Prise en compte de la préférence système de réduction des animations.
- Liens de contact par email, GitHub et LinkedIn.

## Technologies

HTML5 · CSS3 · JavaScript · Three.js · Python · esbuild

Le site est statique : il n’utilise ni serveur applicatif ni base de données. Three.js anime un visuel sur une surface WebGL ; une image de secours est prévue lorsque WebGL n’est pas disponible.

## Consulter le site en local

Après avoir téléchargé et extrait le dépôt, ouvrir **`index.html`** dans un navigateur récent. Les fichiers nécessaires à l’affichage sont déjà inclus.

Un serveur local facultatif est disponible avec Node.js :

```bash
npm run preview
```

Ouvrir ensuite http://localhost:4173.

## Modifier et reconstruire

Les textes des projets, expériences et certifications se trouvent dans `src/content.json`. La structure de la page et les autres textes sont définis dans `scripts/build.py`.

Pour reconstruire la page et le bundle WebGL, installer Node.js avec npm et Python 3, puis exécuter :

```bash
npm ci
npm run build
```

Sur Windows, si la commande `python3` n’est pas disponible :

```powershell
py scripts/build.py
npx esbuild src/black-hole.js --bundle --format=iife --minify --outfile=js/black-hole.js --legal-comments=linked --loader:.png=dataurl
```

Une modification directe de `index.html` est visible immédiatement, mais sera remplacée lors de la prochaine reconstruction. Pour la conserver, modifier également les sources correspondantes.

## Déploiement sur Netlify depuis GitHub

1. Placer le contenu de ce dossier à la racine du dépôt GitHub : `index.html` et `netlify.toml` doivent être directement visibles.
2. Dans Netlify, importer un projet depuis GitHub et sélectionner ce dépôt.
3. Utiliser la branche `main`.
4. Conserver les paramètres définis dans `netlify.toml` :

| Paramètre | Valeur |
| --- | --- |
| Base directory | Racine du dépôt — laisser vide |
| Build command | `node scripts/prepare-deploy.mjs` |
| Publish directory | `dist` |

Le script de déploiement copie les fichiers du site déjà générés vers `dist`. Il ne reconstruit pas les sources Python ou Three.js : après modification de ces sources, lancer `npm run build` localement et envoyer aussi les fichiers générés sur GitHub.

Le dossier `dist` contient uniquement le site, ses documents et les mentions de licence nécessaires. Netlify publie ce dossier et peut redéployer le site après chaque modification de la branche connectée.

Documentation : [Importer un projet dans Netlify](https://docs.netlify.com/manage/projects/add-new-project/) · [Configuration des builds](https://docs.netlify.com/build/configure-builds/overview/).

## Organisation du dépôt

| Chemin | Contenu |
| --- | --- |
| `index.html` | Page du portfolio prête à consulter |
| `css/` | Mise en page, responsive et animations |
| `js/` | Navigation, langues et rendu animé |
| `assets/` | Visuels, captures et aperçus des certificats |
| `documents/` | CV |
| `certifs/` | Certificats PDF |
| `src/` | Données du portfolio et source du rendu WebGL |
| `scripts/` | Génération, serveur local et préparation du déploiement |
| `netlify.toml` | Configuration de publication |

## Contact

**Zakaria Boukhris** · Rabat, Maroc

- [GitHub](https://github.com/Zakaria-Boukhris)
- [LinkedIn](https://www.linkedin.com/in/zakaria-boukhris-752a30356/)
- [Email](mailto:boukhris.zakaria.dev@gmail.com)

## Droits et dépendances

Three.js est distribué sous licence MIT ; sa licence est conservée dans `THREE-LICENSE.txt` et les mentions du bundle dans `js/black-hole.js.LEGAL.txt`.

Les documents personnels, certificats et captures ne sont pas couverts par la licence de Three.js. Aucune licence générale de réutilisation n’est attribuée à ce dépôt.
