<template>
  <page-view>
    <header-view />
    <div class="info-container">
      <h1>Bienvenue sur Leaugepedia</h1>
      <p>Leaugepedia est votre guide ultime pour tous les champions de <strong>League of Legends</strong>. Trouvez des informations détaillées sur chaque champion et découvrez leurs sorts en un seul clic !</p>

      <h2>Comment utiliser le site ?</h2>
      <ul>
        <li>🔎 <strong>Rechercher un champion :</strong> utilisez la barre de recherche pour trouver votre champion préféré.</li>
        <li>📜 <strong>Voir les détails :</strong> chaque page de champion affiche ses sorts et ses compétences uniques.</li>
        <li>🎯 <strong>Apprendre les mécaniques :</strong> découvrez comment optimiser chaque sort et les meilleures stratégies.</li>
      </ul>

      <h2>Que contient chaque page de champion ?</h2>
      <ul>
        <li>✅ Nom et rôle du champion</li>
        <li>✅ Description et statistiques de base</li>
        <li>✅ Liste complète des sorts avec leurs effets</li>
      </ul>

      <h2>💻 Code source et contribution</h2>
      <p>Le code source du projet est disponible sur GitHub. Vous pouvez contribuer ou signaler des bugs via le lien ci-dessous :</p>
      <p>
        👉 <a href="https://github.com/ayoubboussata/leauge_of_Legende" target="_blank">Consulter le projet sur GitHub</a>
      </p>
    </div>
  </page-view>
</template>

<script setup>
import HeaderView from '@/components/PageComponents/HeaderPage.vue';
import PageView from '@/components/PageComponents/PageView.vue';
</script>

<style scoped>
.info-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  line-height: 1.6;
}

h1,
h2 {
  color: #1e90ff;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}

a {
  color: #ff9900;
  text-decoration: none;
  font-weight: bold;
}

a:hover {
  text-decoration: underline;
}
</style>
