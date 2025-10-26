# Guide de Test - CRUD des Packs

## ✅ Modifications Effectuées

### Backend
1. **Controller `updatePack`** : Ajout de la gestion de l'upload d'image via `req.file.path`
2. **Routes** : Réorganisation pour que `getPackById` soit protégé par `verifyToken`

### Frontend
1. **Redux Slice** : Support de la pagination avec `page`, `limit`, `totalPages`, `totalDocs`
2. **PacksGuid.jsx** : 
   - Table responsive sans scroll horizontal (`table-fixed`, `truncate`)
   - Pagination avec boutons Précédent/Suivant
   - Colonnes ajustées au modèle backend
3. **AddPack.jsx** : Messages traduits en français
4. **UpdatePack.jsx** : Messages traduits en français

## 🧪 Tests à Effectuer

### 1. CREATE (Ajouter un Pack)
**Route Frontend** : `/guide/packs/add`

**Étapes** :
1. Cliquer sur "+ Ajouter un Pack" dans la liste
2. Remplir tous les champs obligatoires :
   - Titre (min 3 caractères)
   - Description (min 10 caractères)
   - Prix (nombre positif)
   - Date de début (au moins 15 jours dans le futur)
   - Date de fin (après la date de début)
   - Lieu de départ
   - Lieu d'arrivée
   - Nombre max de clients
   - Sélectionner au moins 1 place
   - Uploader une image
3. Cliquer sur "Ajouter le Pack"

**Résultat Attendu** :
- Toast : "Pack créé avec succès"
- Redirection vers `/guide/PacksGuide`
- Le nouveau pack apparaît dans la liste

**API Backend** : `POST /api/packs`
- Headers : `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- Body : FormData avec tous les champs + image

---

### 2. READ (Lire les Packs)
**Route Frontend** : `/guide/PacksGuide`

**Étapes** :
1. Accéder à la page
2. Vérifier que les packs s'affichent
3. Tester la pagination (boutons Précédent/Suivant)

**Résultat Attendu** :
- Liste des packs avec colonnes : Image, Titre, Prix, Places, Disponibilité, Départ, Arrivée, Dates, Actions
- Pagination fonctionnelle
- Pas de scroll horizontal

**API Backend** : `GET /api/packs?page=1&limit=10`
- Headers : `Authorization: Bearer <token>`
- Response : `{ docs: [...], page, totalPages, totalDocs, limit }`

---

### 3. UPDATE (Modifier un Pack)
**Route Frontend** : `/guide/packs/edit/:id`

**Étapes** :
1. Cliquer sur l'icône "Modifier" (crayon vert) d'un pack
2. Vérifier que les données sont pré-remplies
3. Modifier un ou plusieurs champs
4. Optionnel : Remplacer l'image
5. Cliquer sur "Mettre à jour"

**Résultat Attendu** :
- Toast : "Pack mis à jour avec succès"
- Redirection vers `/guide/PacksGuide`
- Les modifications apparaissent dans la liste

**API Backend** : `PUT /api/packs/:id`
- Headers : `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- Body : FormData avec les champs modifiés

---

### 4. DELETE (Supprimer un Pack)
**Route Frontend** : `/guide/PacksGuide`

**Étapes** :
1. Cliquer sur l'icône "Supprimer" (poubelle rouge) d'un pack
2. Confirmer la suppression dans la popup

**Résultat Attendu** :
- Le pack disparaît de la liste
- Pas de message d'erreur

**API Backend** : `DELETE /api/packs/:id`
- Headers : `Authorization: Bearer <token>`
- Response : Status 202

---

## 🔧 Problèmes Potentiels et Solutions

### Problème : "Failed to create pack"
**Cause** : Validation backend échouée
**Solution** : Vérifier que :
- La date de début est au moins 15 jours dans le futur
- La date de fin est après la date de début
- Tous les champs requis sont remplis
- L'image est bien uploadée

### Problème : "Pack not found" lors de l'édition
**Cause** : Le pack n'appartient pas au guide connecté
**Solution** : Le backend vérifie `guideId === req.user.id`

### Problème : Scroll horizontal persiste
**Cause** : Contenu trop large
**Solution** : Vérifier que `table-fixed` et `truncate` sont appliqués

### Problème : Pagination ne fonctionne pas
**Cause** : Backend ne retourne pas de métadonnées de pagination
**Solution** : Vérifier que le backend utilise `mongoose-paginate-v2` et retourne `{ docs, page, totalPages, totalDocs, limit }`

---

## 📋 Checklist Finale

- [ ] CREATE : Ajout d'un pack avec image
- [ ] READ : Affichage de la liste paginée
- [ ] UPDATE : Modification d'un pack existant
- [ ] DELETE : Suppression d'un pack
- [ ] Table responsive sans scroll horizontal
- [ ] Pagination fonctionnelle
- [ ] Messages d'erreur/succès en français
- [ ] Navigation entre les pages
- [ ] Upload d'images fonctionnel
- [ ] Validation des formulaires
