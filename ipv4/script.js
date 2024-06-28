// JavaScript to fetch IP addresses
fetch('https://api64.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        document.getElementById('ipv4').textContent = data.ip;
    });

fetch('https://api64.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
        document.getElementById('ipv6').textContent = data.ip;
    });


    function copyText(id) {
        var text = document.getElementById(id).innerText;
        var input = document.createElement('input');
        input.setAttribute('value', text);
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
        
        var message = document.getElementById('message');
        message.textContent = 'Copie effectuée';
        message.style.display = 'block';
        
        setTimeout(function(){
            message.textContent = '';
            message.style.display = 'none';
        }, 3000); // Efface le message après 2 secondes
    }
    
    

    