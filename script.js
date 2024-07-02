document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const passwordInput = document.getElementById('password').value;
    
    // Mot de passe chiffré à comparer
    const hashedPassword = '3da7c384394875508da44eac15a9395c921f8c06666f170b2cd5944cf31aa619';
    
    // Chiffrer le mot de passe entré par l'utilisateur
    const userHashedPassword = CryptoJS.SHA256(passwordInput).toString();
    
    // Comparer les deux mots de passe chiffrés
    if (userHashedPassword === hashedPassword) {
        localStorage.setItem('authenticated', 'true');
        window.location.href = 'accueil.html';
    } else {
        alert('Mot de passe incorrect');
    }
});
