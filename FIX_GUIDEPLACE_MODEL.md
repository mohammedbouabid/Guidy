# 🔧 Fix: Erreur "Schema hasn't been registered for model Guideplace"

## 🐛 Problème

**Erreur** :
```json
{
  "message": "Erreur lors du chargement des packs",
  "error": "Schema hasn't been registered for model \"Guideplace\".\nUse mongoose.model(name, schema)"
}
```

**Cause** : Incohérence dans la casse du nom du modèle

---

## 📋 Analyse

### Nom du Modèle
- **Fichier** : `Back-end/src/Models/GuidePlace.js`
- **Modèle enregistré** : `mongoose.model('GuidePlace', guidePlaceSchema)`
- **Collection MongoDB** : `guideplaces` (automatiquement en minuscules et pluriel)

### Références Incorrectes
1. **Dans Pack.js** : `ref: 'Guideplace'` ❌ (p minuscule)
2. **Dans guidePlaceController.js** : `import ... from "../Models/Guideplace.js"` ❌

### Référence Correcte
- Doit être : `'GuidePlace'` ✅ (P majuscule)

---

## ✅ Corrections Effectuées

### 1. **Modèle Pack.js**

**Fichier** : `Back-end/src/Models/Pack.js`

**Avant** :
```javascript
guidesPlacesId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Guideplace',  // ❌ Incorrect
    required: true
}],
```

**Après** :
```javascript
guidesPlacesId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuidePlace',  // ✅ Correct
    required: true
}],
```

---

### 2. **Controller guidePlaceController.js**

**Fichier** : `Back-end/src/Controllers/guidePlaceController.js`

**Avant** :
```javascript
import GuidePlace from "../Models/Guideplace.js";  // ❌ Incorrect
```

**Après** :
```javascript
import GuidePlace from "../Models/GuidePlace.js";  // ✅ Correct
```

---

## 📊 Récapitulatif des Noms

| Élément | Nom Correct | Remarque |
|---------|-------------|----------|
| **Fichier modèle** | `GuidePlace.js` | Avec P majuscule |
| **Modèle Mongoose** | `'GuidePlace'` | Avec P majuscule |
| **Collection MongoDB** | `guideplaces` | Auto-généré (minuscules + pluriel) |
| **Référence dans Pack** | `ref: 'GuidePlace'` | Doit correspondre au modèle |
| **Import dans controller** | `from "../Models/GuidePlace.js"` | Doit correspondre au fichier |

---

## 🔍 Vérification

### Modèle GuidePlace.js
```javascript
// ✅ Correct
const GuidePlace = mongoose.model("GuidePlace", guidePlaceSchema);
export default GuidePlace;
```

### Référence dans Pack.js
```javascript
// ✅ Correct
guidesPlacesId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GuidePlace',  // Correspond au nom du modèle
    required: true
}]
```

### Import dans Controller
```javascript
// ✅ Correct
import GuidePlace from "../Models/GuidePlace.js";  // Correspond au nom du fichier
```

---

## 🧪 Test

### 1. Redémarrer le serveur backend
```bash
cd Back-end
npm run dev
```

### 2. Tester l'API
```bash
GET /api/packs/all?page=1&limit=10
Authorization: Bearer <token>
```

### 3. Vérifier la réponse
```json
{
  "docs": [
    {
      "_id": "...",
      "title": "Pack Test",
      "guidesPlacesId": [
        {
          "_id": "...",
          "name": "Tour Eiffel",
          "city": "Paris",
          "country": "France",
          "images": ["url1", "url2"],
          "description": "..."
        }
      ]
    }
  ]
}
```

---

## 🎯 Résultat Attendu

- ✅ Pas d'erreur "Schema hasn't been registered"
- ✅ Les packs se chargent correctement
- ✅ Le populate fonctionne
- ✅ Les détails des places s'affichent

---

## 📝 Notes Importantes

### Convention de Nommage Mongoose

1. **Nom du modèle** : PascalCase (ex: `GuidePlace`)
2. **Collection MongoDB** : Automatiquement converti en minuscules + pluriel (ex: `guideplaces`)
3. **Référence `ref`** : Doit correspondre EXACTEMENT au nom du modèle (ex: `'GuidePlace'`)

### Sensibilité à la Casse

- Mongoose est **sensible à la casse** pour les noms de modèles
- `'GuidePlace'` ≠ `'Guideplace'` ≠ `'guideplace'`
- Toujours utiliser le nom exact du modèle

### Populate

Le populate fonctionne maintenant correctement :
```javascript
const options = {
  populate: {
    path: 'guidesPlacesId',
    select: 'name city country images description'
  }
};
```

---

## ✅ Checklist

- [x] Corriger `ref: 'Guideplace'` → `ref: 'GuidePlace'` dans Pack.js
- [x] Corriger import dans guidePlaceController.js
- [x] Vérifier qu'il n'y a pas d'autres références incorrectes
- [x] Redémarrer le serveur backend
- [x] Tester l'API
- [x] Vérifier le populate

🎉 **Le problème est résolu !**
