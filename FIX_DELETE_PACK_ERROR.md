# 🔧 Fix: Erreur "Pack not found" lors de la suppression

## 🐛 Problème

**Erreur** : `{"message":"Pack not found"}`

**Cause** : 
- La page `PacksGuid.jsx` utilisait `fetchPacks()` qui appelle `GET /api/packs`
- Cette route retourne **TOUS les packs publics** (de tous les guides)
- Mais un guide ne peut supprimer que **SES propres packs** (vérification `guideId === req.user.id` dans le backend)
- Donc quand le guide essayait de supprimer un pack d'un autre guide, le backend retournait "Pack not found"

## ✅ Solution

### 1. Créer une nouvelle action Redux `fetchGuidePacks`

**Fichier** : `Front-end/src/store/slices/packSlice.js`

```javascript
export const fetchGuidePacks = createAsyncThunk(
  "pack/fetchGuidePacks",
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const res = await api.get("/packs/all", { params: { page, limit } });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch guide packs");
    }
  }
);
```

**Route backend** : `GET /api/packs/all` → `getAllPacksForGuide()`
- Cette route est **protégée** par `verifyToken`
- Elle filtre les packs par `guideId: req.user.id`
- Retourne uniquement les packs du guide connecté

### 2. Ajouter les reducers pour `fetchGuidePacks`

```javascript
.addCase(fetchGuidePacks.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchGuidePacks.fulfilled, (state, action) => {
  state.loading = false;
  const payload = action.payload;
  if (payload && Array.isArray(payload.docs)) {
    state.items = payload.docs;
    state.page = payload.page ?? 1;
    state.totalPages = payload.totalPages ?? 1;
    state.totalDocs = payload.totalDocs ?? payload.total ?? payload.docs.length ?? 0;
    state.limit = payload.limit ?? state.limit;
  } else if (Array.isArray(payload)) {
    state.items = payload;
    state.totalDocs = payload.length;
    state.page = 1;
    state.totalPages = 1;
  } else {
    state.items = [];
  }
})
.addCase(fetchGuidePacks.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})
```

### 3. Modifier `PacksGuid.jsx` pour utiliser `fetchGuidePacks`

**Avant** :
```javascript
import { deletePack, fetchPacks } from "@/store/slices/packSlice";

useEffect(() => {
  dispatch(fetchPacks({ page: currentPage, limit: limit || 10 }));
}, [dispatch, currentPage, limit]);
```

**Après** :
```javascript
import { deletePack, fetchGuidePacks } from "@/store/slices/packSlice";

useEffect(() => {
  dispatch(fetchGuidePacks({ page: currentPage, limit: limit || 10 }));
}, [dispatch, currentPage, limit]);
```

## 📊 Comparaison des Routes

| Route | Endpoint | Authentification | Filtre | Usage |
|-------|----------|------------------|--------|-------|
| `fetchPacks` | `GET /api/packs` | ❌ Public | Aucun | Page publique (clients) |
| `fetchGuidePacks` | `GET /api/packs/all` | ✅ Requise | `guideId: req.user.id` | Dashboard guide |

## 🎯 Résultat

Maintenant :
- ✅ La liste affiche **uniquement les packs du guide connecté**
- ✅ Le guide peut **supprimer ses propres packs** sans erreur
- ✅ Le guide peut **modifier ses propres packs** sans erreur
- ✅ Pas d'accès aux packs des autres guides

## 🧪 Test

1. Se connecter en tant que guide
2. Aller sur `/guide/PacksGuide`
3. Vérifier que seuls vos packs s'affichent
4. Cliquer sur l'icône poubelle d'un pack
5. Confirmer la suppression
6. ✅ Le pack doit être supprimé sans erreur

## 🔐 Sécurité Backend

Le backend vérifie toujours :
```javascript
// deletePack controller
const pack = await Pack.findOneAndDelete({ 
  _id: req.params.id, 
  guideId: req.user.id  // ← Vérifie que le pack appartient au guide
});

if (!pack) {
  return res.status(404).json({ message: 'Pack not found' });
}
```

Même si un guide essaie de supprimer un pack qui n'est pas le sien (en modifiant l'URL), le backend retournera "Pack not found".
